import {
  type ActorRefFrom,
  type SnapshotFrom,
  assign,
  enqueueActions,
  setup,
} from 'xstate';

import { clamp, lerp, normalize } from '@folio/utils';

import { scrubbingLogic } from './actors/scrubbing.actor';
import type {
  AttachEvent,
  ScrubActorContext,
  ScrubActorEmittedEvent,
  ScrubActorEvent,
  ScrubActorInput,
  ScrubEvent,
  ScrubStartEvent,
  SetPercentageEvent,
  SetValueEvent,
} from './types';
import { getScrubTrackRect, scrubEventFrom } from './utils';

// TODO: implement keyboard interactions after implementing speech machine
const scrubMachine = setup({
  types: {
    context: {} as ScrubActorContext,
    emitted: {} as ScrubActorEmittedEvent,
    events: {} as ScrubActorEvent,
    input: {} as ScrubActorInput,
  },
  actions: {
    attach: assign(({ context }, { scrubTrack }: Omit<AttachEvent, 'type'>) => {
      const { max, min, value } = context;
      const normalized = normalize(value, min, max);
      const percentage = normalized * 100;
      const scrubTrackRect = getScrubTrackRect(scrubTrack);

      return { percentage, scrubTrack, scrubTrackRect };
    }),
    detach: assign({ scrubTrack: undefined, scrubTrackRect: undefined }),
    logError: (_, { error }: { error: unknown }) => console.error(error),
    scrub: enqueueActions(
      (
        { context, enqueue, self },
        { percentage, value }: Omit<ScrubEvent, 'type'>
      ) => {
        enqueue.assign({ percentage, value });
        enqueue.emit({ type: 'SCRUB', id: self.id, percentage, value });
        if (context.parentActor === undefined) return;
        enqueue.sendTo(context.parentActor, {
          type: 'SCRUB',
          id: self.id,
          percentage,
          value,
        });
      }
    ),
    scrubEnd: enqueueActions(({ context, enqueue, self }) => {
      enqueue.emit({ type: 'SCRUB_END', id: self.id });
      if (context.parentActor === undefined) return;
      enqueue.sendTo(context.parentActor, { type: 'SCRUB_END', id: self.id });
    }),
    scrubStart: enqueueActions(
      (
        { context, enqueue, self },
        { clientX, clientY }: Omit<ScrubStartEvent, 'type'>
      ) => {
        enqueue.emit({ type: 'SCRUB_START', clientX, clientY, id: self.id });
        if (context.parentActor === undefined) return;
        enqueue.sendTo(context.parentActor, {
          type: 'SCRUB_START',
          clientX,
          clientY,
          id: self.id,
        });
      }
    ),
    scrubbingEntry: enqueueActions(({ context, enqueue, event }) => {
      if (event.type !== 'SCRUB_START') return;

      const { direction, scrubTrack, max, min } = context;
      const { clientX, clientY } = event;

      if (scrubTrack === undefined) {
        return enqueue.raise({
          type: 'ERROR',
          error: new Error('Scrub track element reference is undefined'),
        });
      }

      const scrubTrackRect = getScrubTrackRect(scrubTrack);

      enqueue.assign({ scrubTrackRect });
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
    setPercentage: enqueueActions(
      (
        { context, enqueue, self },
        params: Omit<SetPercentageEvent, 'type'>
      ) => {
        const percentage = clamp(params.percentage, 0, 100);
        const value = lerp(percentage / 100, context.min, context.max);

        enqueue.assign({ percentage, value });
        enqueue.emit({ type: 'SCRUB', id: self.id, percentage, value });
        if (context.parentActor === undefined) return;
        enqueue.sendTo(context.parentActor, {
          type: 'SCRUB',
          id: self.id,
          percentage,
          value,
        });
      }
    ),
    setValue: enqueueActions(
      ({ context, enqueue, self }, params: Omit<SetValueEvent, 'type'>) => {
        const value = clamp(params.value, context.min, context.max);
        const percentage = normalize(value, context.min, context.max) * 100;

        enqueue.assign({ percentage, value });
        enqueue.emit({ type: 'SCRUB', id: self.id, percentage, value });
        if (context.parentActor === undefined) return;
        enqueue.sendTo(context.parentActor, {
          type: 'SCRUB',
          id: self.id,
          percentage,
          value,
        });
      }
    ),
  },
  actors: {
    scrubbing: scrubbingLogic,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwMYCcCuAjAxAUQCUCB5AgbQAYBdRUABwHtYBLAF2YYDtaQAPRACwAmADQgAnoiEBOAQDoAjAooUAbMIAcAgOzaAzNIC+hsakxY5AQ1atLKABaQcAETwAVAIIBhABKUaSCCMLOxcPPwIMgCschqqalF62hpJegICYpKRanLSCqp52tJ6elFRCsLGpujYVjZ2jhByzBAANmA4AMpeBACqAEIA+p2eBG7+PMFsHNyBEfqquToaGgpCAhTaFNIamYgKURRy6lFFUUIUBhqJqlUgZrXWtg6Qcg9YWMycUDgQXGDNTgANwYAGsAe9Pt8JoEpqFZqB5npFodznptvEdAo9ghkfINBQ4gppDtVKdlFE7u86s9Gm8ah8vj8wGg0Aw0HI6K1rAAzdkAW3p5ihUBh9CY0zCc0QCzkqKE6OkmO02IkUgEMWkF1OJTyCg0QgUVIZNIar0hTK6PQGYqCEvh4UQiT0crxUQK5WJ6RxQgucgEaSEBtUyQqQm0xvMcggYFpTg8bk8vltcJmjsi0hicQSSRS+m9atxFCEijyqnRAjyNxDkce9ReEC67kGAAVCF48AA5TwAcTwKftaelCFU6jkJWuE5k0mSGUL5W0ckJFwJpxDaiExhMIE4DBj8EC70mg6liMQAFpVDjz+slyoKAoinpfdpK4TaxYnmaIMeQkOzwgGyLAYUSrK+Wrlnkc5ZOW46+hoM7xMSEERtu1Jfg2zRtGAv6SgifCINIOSqL6AgHGso5qKqWRBi6SgziSJE6Fs1wfqamEWt8uEOsOGryCBYGVkIkEVDiz5HCxJJoqoaxFGxMZxj+sInvhET5IujHbJcyQkVoYmPnewkKpWSrxBoW6GEAA */
  id: 'scrub',

  context: ({
    input: { direction, initialValue, max = 1, min = 0, parentActor },
  }) => ({
    direction,
    max,
    min,
    parentActor,
    percentage: 0,
    scrubTrack: undefined,
    scrubTrackRect: undefined,
    value: clamp(initialValue ?? min, min, max),
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
        SET_PERCENTAGE: {
          actions: {
            params: ({ event }) => ({ percentage: event.percentage }),
            type: 'setPercentage',
          },
        },
        SET_VALUE: {
          actions: {
            params: ({ event }) => ({ value: event.value }),
            type: 'setValue',
          },
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
              max: context.max,
              min: context.min,
              scrubTrack: context.scrubTrack,
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
            params: ({ event }) => ({ scrubTrack: event.scrubTrack }),
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
