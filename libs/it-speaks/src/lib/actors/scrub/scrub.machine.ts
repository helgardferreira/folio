import {
  type ActorRefFrom,
  type SnapshotFrom,
  assign,
  emit,
  enqueueActions,
  setup,
} from 'xstate';

import { normalize } from '@folio/utils';

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
      ({ enqueue }, { percentage, value }: Omit<ScrubEvent, 'type'>) => {
        enqueue.assign({ percentage, value });
        enqueue.emit({ type: 'SCRUB', percentage, value });
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
  },
  actors: {
    scrubbing: scrubbingLogic,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwMYCcCuAjAxAUQCUCB5AgbQAYBdRUABwHtYBLAF2YYDtaQAPRACwAmADQgAnogCMAdgCsAOgpCKUgGwBmOQE4BUgBwapAX2NjUmLAoCGrVtZQALSDgAieACoBBAMIAJShokEEYWdi4efgQhbUV9NQo1NW0ZfSEpDX0ZNTFJBHVtBQFMuQEKCliynX1Tc3RsGzsHZwgFZggAGzAcAGUfAgBVACEAfR7vAg9AnlC2Dm5gqJkNNQVdVKTYuR0pXOk5CgU1ATkZGQE1DJkKjVqQCwbbeydIBQesLGZOKBwILjA2pwAG4MADWAPen2+02Cs3CC1ASxWCgOclkGkyKhkuwkiBWAgU+go+lOMm0ankyRkd3ejWeLTe9Q+Xx+YDQaAYaAUdA6tgAZpyALaMyxQqAw+hMOYRRaIZarVHozEUbF7aInNYqbb4lVCdI0pl05qvSEs3r9YYSkJS+GRRByDEo-EYk4CeTCNV6w7FYSnDICANyNQGywKCBgekuLwebz+K1w+Z26KxQkJTapdKZbKe44KbEYqTaKR6vRZASmMwgTgMcPwYLvGY2xOyhAAWhyuLbQg0a20ff7A-7t0rtKexogjbCzcRgkSCg0sX0Uj0yXiFAxas0871+iyGkSJIuwZHhrHL1a7S6k+lCL4iG0c7Uesyqg0mbknsMCikhbJQjkKjaPuJwho8TTniK2Bitetotq686LsuBRrhunZvoc1z6CkGQAdiAbHnUobhpGE6wk2MozvkFK9gkS6xD+BwaGqv5rMW5znCoUjKBQcgVsYQA */
  id: 'scrub',

  context: ({ input: { direction, initialValue, max = 1, min = 0 } }) => ({
    direction,
    max,
    min,
    percentage: 0,
    scrubTrack: undefined,
    scrubTrackRect: undefined,
    value: Math.max(Math.min(initialValue ?? min, max), min),
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
