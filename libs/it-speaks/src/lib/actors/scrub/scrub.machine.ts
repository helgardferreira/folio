import {
  type ActorRefFrom,
  type SnapshotFrom,
  assign,
  emit,
  enqueueActions,
  setup,
} from 'xstate';

import { lerp, normalize } from '@folio/utils';

import { scrubbingLogic } from './actors/scrubbing.actor';
import type {
  AttachEvent,
  ScrubActorContext,
  ScrubActorEmittedEvent,
  ScrubActorEvent,
  ScrubActorInput,
  ScrubEvent,
  ScrubStartEvent,
} from './types';
import { getScrubTrackRect, scrubEventFrom } from './utils';

const scrubMachine = setup({
  types: {
    context: {} as ScrubActorContext,
    emitted: {} as ScrubActorEmittedEvent,
    events: {} as ScrubActorEvent,
    input: {} as ScrubActorInput,
  },
  actions: {
    attach: enqueueActions(
      ({ enqueue }, { element }: Omit<AttachEvent, 'type'>) => {
        const parentElement = element.parentElement;

        if (parentElement === null) {
          return enqueue.raise({
            type: 'ERROR',
            error: new Error(
              'Scrubber element must be a child of another element'
            ),
          });
        }

        enqueue.assign(({ context }) => {
          const { direction, max, min, value } = context;
          const { height, width } = getScrubTrackRect(element, parentElement);
          const normalized = normalize(value, min, max);
          const percentage = normalized * 100;

          return direction === 'bottom-top' || direction === 'top-bottom'
            ? { element, percentage, position: lerp(normalized, 0, height) }
            : { element, percentage, position: lerp(normalized, 0, width) };
        });
      }
    ),
    detach: assign(() => ({ element: undefined })),
    logError: (_, { error }: { error: unknown }) => console.error(error),
    scrub: enqueueActions(
      (
        { enqueue },
        { percentage, position, value }: Omit<ScrubEvent, 'type'>
      ) => {
        enqueue.assign({ percentage, position, value });
        enqueue.emit({ type: 'SCRUB', percentage, position, value });
      }
    ),
    scrubEnd: emit({ type: 'SCRUB_END' }),
    scrubStart: emit(
      (_, { clientX, clientY }: Omit<ScrubStartEvent, 'type'>) => ({
        type: 'SCRUB_START',
        clientX,
        clientY,
      })
    ),
    scrubbingEntry: enqueueActions(({ context, enqueue, event }) => {
      if (event.type !== 'SCRUB_START') return;

      const { direction, element, max, min } = context;
      const { clientX, clientY } = event;

      if (element === undefined) {
        return enqueue.raise({
          type: 'ERROR',
          error: new Error('Scrubber element reference is undefined'),
        });
      }

      const parentElement = element.parentElement;

      if (parentElement === null) {
        return enqueue.raise({
          type: 'ERROR',
          error: new Error(
            'Scrubber element must be a child of another element'
          ),
        });
      }

      const scrubTrackRect = getScrubTrackRect(element, parentElement);

      enqueue.raise(
        scrubEventFrom({
          clientX,
          clientY,
          direction,
          max,
          min,
          scrubTrackRect,
        })
      );
    }),
  },
  actors: {
    scrubbing: scrubbingLogic,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwMYCcCuAjAxAUQCUCB5AgbQAYBdRUABwHtYBLAF2YYDtaQAPRACwAmADQgAnogCMAZgAcAOgoB2IcopSArHKHDlmgGwBfI2NSYsCgIatWVlAAtIOACJ4AKgEEAwgAlKNEggjCzsXDz8CEIAnJoKcgYUBgZSUhQUahSaYpIIskIKAtGpWdHRQgbKcnKaJmbo2Na29k4QCswQADZgOADK3gQAqgBCAPq9XgTuATwhbBzcQZHKMgYK0QLKxUIyq8LVOdKGClIC1TJC2skUxXUg5o02do6QCg9YWMycUDgQXGDtTgANwYAGsAe9Pt8ZkE5mFFqBlqsFJoslIEpsztEVocotFFLplKopFshEIdMZTPcGpYni1XpCvj8wGg0Aw0Ao6J0bAAzdkAWzeNKhUBh9CY83CS0QKzWqM06IMmLk2JkuKEWXWygEMhUKVWKykQju7yaz1aQosIr6AxGYuCEvhEUQml2KL2mximjK2QkRwoCiV2kuNRiMlOJppCggYHNzk87i8fntcIWzrxcQSSRSaQy6l9uTJygUygMwcqen0UhMVM4DBj8CC71mjrT0oQAFoDLiO7pIxYzfSIC3Qm3EYIkgoZLE5GlZxpohlcQYZFOycUBJpVK6MgIBP3Hs0Xm0Ot0R5KEXxEIu1gYyXvSjIBLIBOqYvFkkXortDcoD7SjwtRlvnPJ1203AQpxnOc0ikRdRD9KJUXWDVvTg7RsS9f9o1jIdQLHK88kqdZokScoMjkTZVDkXEpESdYyzUBVqnXV0ayMIA */
  id: 'scrub',

  context: ({ input: { direction, initialValue, max = 1, min = 0 } }) => ({
    direction,
    element: undefined,
    max,
    min,
    percentage: 0,
    position: 0,
    value: Math.max(Math.min(initialValue ?? 0, max), 0),
  }),

  initial: 'detached',

  on: {
    ERROR: {
      target: '.detached',
      actions: {
        type: 'logError',
        params: ({ event }) => ({ error: event.error }),
      },
    },
  },

  states: {
    attached: {
      initial: 'idle',

      on: {
        DETACH: {
          actions: 'detach',
          target: 'detached',
        },
      },

      states: {
        idle: {
          on: {
            SCRUB_START: {
              actions: {
                type: 'scrubStart',
                params: ({ event }) => ({
                  clientX: event.clientX,
                  clientY: event.clientY,
                }),
              },
              target: 'scrubbing',
            },
          },
        },
        scrubbing: {
          entry: 'scrubbingEntry',

          invoke: {
            id: 'scrubbing',
            input: ({ context }) => ({
              direction: context.direction,
              element: context.element,
              max: context.max,
              min: context.min,
            }),
            onDone: {
              actions: 'scrubEnd',
              target: 'idle',
            },
            onError: {
              actions: [
                {
                  type: 'logError',
                  params: ({ event }) => ({ error: event.error }),
                },
                'scrubEnd',
              ],
              target: 'idle',
            },
            src: 'scrubbing',
          },

          on: {
            SCRUB: {
              actions: {
                type: 'scrub',
                params: ({ event }) => ({
                  percentage: event.percentage,
                  position: event.position,
                  value: event.value,
                }),
              },
            },
          },
        },
      },
    },
    detached: {
      on: {
        ATTACH: {
          actions: {
            params: ({ event }) => ({ element: event.element }),
            type: 'attach',
          },
          target: 'attached',
        },
      },
    },
  },
});

type ScrubActorRef = ActorRefFrom<typeof scrubMachine>;
type ScrubActorSnapshot = SnapshotFrom<typeof scrubMachine>;

export { scrubMachine };

export type { ScrubActorRef, ScrubActorSnapshot };
