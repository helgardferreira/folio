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
    disable: assign({ disable: true }),
    enable: assign({ disable: false }),
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
      const { percentage, value } = context;

      enqueue.emit({ type: 'SCRUB_END', id: self.id, percentage, value });

      if (context.parentActor === undefined) return;

      enqueue.sendTo(context.parentActor, {
        type: 'SCRUB_END',
        id: self.id,
        percentage,
        value,
      });
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

        if (params.propagate !== true) return;

        enqueue.emit({ type: 'SCRUB', id: self.id, percentage, value });
        enqueue.emit({ type: 'SCRUB_END', id: self.id, percentage, value });

        if (context.parentActor === undefined) return;

        enqueue.sendTo(context.parentActor, {
          type: 'SCRUB',
          id: self.id,
          percentage,
          value,
        });
        enqueue.sendTo(context.parentActor, {
          type: 'SCRUB_END',
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

        if (params.propagate !== true) return;

        enqueue.emit({ type: 'SCRUB', id: self.id, percentage, value });
        enqueue.emit({ type: 'SCRUB_END', id: self.id, percentage, value });

        if (context.parentActor === undefined) return;

        enqueue.sendTo(context.parentActor, {
          type: 'SCRUB',
          id: self.id,
          percentage,
          value,
        });
        enqueue.sendTo(context.parentActor, {
          type: 'SCRUB_END',
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
  guards: {
    shouldDisable: ({ context }) => context.disable,
    shouldEnable: ({ context }) => !context.disable,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwMYCcCuAjAxAEQEkBlAQQCEAZAUQG0AGAXUVAAcB7WASwBdO2A7ZiAAeiAGwBGOgDoA7LICcAJgAcEgMyKF6hWIA0IAJ6IJSgL5mDqTLioA5ctXpMkIdl14ChohJKXSFABYdIPUJQNkJFXUDYwQFBVlpdUCJNLSlAFY6MUiLK3RsHCoAJRKAeRLnIXcePkFXH0zZWJMVfwlFJUCVYIVMlVl1TPyQa2xpAENubkmUAAtIfCoAFRIAYQAJatdazwbQHzCZFTEc2Tps9vV1FUzWhE6xaUzEsTPbpXU6OiDR8awUxmc0WEBwRFWAH0AAqldb2NYAcVojBqHDqXkaiHk6hegSCzTo3z69yMiE0SXCkTCqSUChUylk-0KgOmswWSwhK0hADUSBQAKoolysdH7bzYhLSLIDW5nH4qHIPVQSaSDL79BmyMSBTISZk2IHs0E4Haijz1CUIfG43rdTRiG49WTdB69FTSKK-TKBJThX6yFQGiZskGQaScCAAGzA4PWJQFZEhRDWJRWZrcYstWPiqWkvsuvr1Xz9gQePtVskCEUyNzEqlrQcsYxZRrDEGkAKwnH4UBwEAEYAj-AAbmwANZDrs9qAZvbZw6IIIyRKBzRKbVKDcSB6OpJ0CRBFTHwOHpsFQ2hjkd6e9nBgNBoNhoaQsKPTABmz4Atp2Wd3eznLNMUXXMV3kaIXU3bcHhdBRpWUbRZAGVJHXMZsATba8-xsAC+yIeNEyAi0QJEbFbmkH4FDoY96wZZoFHLelpSyQYCToZDFGDVlgWwiBOFgSYsBjMFiIxA4yLAgIIPXaDIjdHpPUVfpfX9RJzxbQ0IDAY0lhIFY1i2MTxRzY41TOXJLhor5blJOJTkyOQiSrOshiPCxm34NhtPgVwATREiJJ8RiyQQBlpSrIZMj1WtqyibisNBALxKtatHLtYJtSddUy1C3VAnzP1TjEZRoiddQEqvUEI2jMBkpM0CMlVb0D0dekwgkfRQu1VUdTCelax9YZ9Qw1sqvDW8oHqhdJLEAZzN6XJ6xyD5d2Y7IcnCXRJDoP1Kt46r+ME4TIGm0ifCGArAh1TrdGou5BgU55fjQzrovUJQOIS7TdIgM6grafwEjOZQOLQv1lUuSjIjuT6skCH54o8oA */
  id: 'scrub',

  context: ({
    input: {
      direction,
      disable = false,
      initialValue,
      max = 1,
      min = 0,
      parentActor,
    },
  }) => ({
    direction,
    disable,
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
    DISABLE: {
      actions: 'disable',
    },
    ENABLE: {
      actions: 'enable',
    },
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
            params: ({ event }) => ({
              percentage: event.percentage,
              propagate: event.propagate,
            }),
            type: 'setPercentage',
          },
        },
        SET_VALUE: {
          actions: {
            params: ({ event }) => ({
              propagate: event.propagate,
              value: event.value,
            }),
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

        disabled: {
          always: {
            target: 'idle',
            guard: 'shouldEnable',
          },
        },
      },

      always: {
        guard: 'shouldDisable',
        target: '.disabled',
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
