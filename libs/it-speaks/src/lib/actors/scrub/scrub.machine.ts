import { type ActorRefFrom, type SnapshotFrom, assign, setup } from 'xstate';

import { scrubbingLogic } from './actors/scrubbing.actor';
import type {
  AttachEvent,
  ScrubActorContext,
  ScrubActorEvent,
  ScrubActorInput,
  ScrubEvent,
} from './types';

// TODO: implement event emitters
// TODO: implement percentage computation from `position` value (normalized between `0` and `1`)
// TODO: continue here...
const scrubMachine = setup({
  types: {
    context: {} as ScrubActorContext,
    events: {} as ScrubActorEvent,
    input: {} as ScrubActorInput,
  },
  actions: {
    attach: assign((_, { element }: Omit<AttachEvent, 'type'>) => ({
      element,
    })),
    detach: assign(() => ({ element: undefined })),
    logError: (_, { error }: { error: unknown }) => console.error(error),
    scrub: assign((_, { position }: Omit<ScrubEvent, 'type'>) => ({
      position,
    })),
  },
  actors: {
    scrubbing: scrubbingLogic,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwMYCcCuAjAdAQwBcC8UALSAYgBEBRAFQEEBhACQG0AGAXUVAAcA9rACWBYQIB2vEAA9EARgBsAThwAORQBYArMu0BmPdoBMajmoA0IAJ4LNi9QHZFHZcfnHH77Y8cBfPytUTFxCYjJIHGEIABswCgBlRgAlOgB9BKZkgFUAIU4eJBBBETFJaTkEFQ4cDkUtev1NR1dteStbBHltGq1tNU1NJWU1ZQ4vAKD0bHwiEnIIHGDsLGEJKAoISTAoiQA3AQBrHeWsABlhWAIwCTA0AukS0XEpIsr6hw5hx21FfTVjKZlB1EMYODVmvJ9H9lJpjMomvZJiBTrNwgsltMsKt1hQ7mgBGgcHwYoQAGaEgC2mJCFyuNzuDyKTzKr1A73qtW+v3+gNGIIQxmaOHh2n6dShLg0xmRqLC80ipxxGxoADkqBksnkmfwhM9ym9EB8uSofn8AUCBfpDDhfmNxopfvDutpZVi0QrFkq1htMjl8txHnrWRVEJp9DV4eHTJoxspFELHALjE0cGN5HUvl8M0K3SEcBAwOjKAw6IxWDrisGXqGuip1H09IYxaZzMm4ThuuZAZ5AYoAf5kRIBIX4EVTkHSjXDQgALSKAWzoW1cGrtdrwdTfPyiIQSf6tmyUFmHCGZQ-Dj9QFQ9o2I36U+AtxggawgzaTR5mY7jHROL7kMZw0NR1DUMxHB0J0hlvTpjE5a01BMeRBn7QFXUCFF3R-RUsWVADp3ZRB9FMU9lHPHor3cfQYOPVQvEdRwRgg5CXE3TD80LYs92ZasDUIhA4QFeQflPHpjB6LtHAtT8Aj8IA */
  id: 'scrub',

  context: ({ input }) => ({
    direction: input.direction,
    element: undefined,
    position: input.initialPosition ?? 0,
  }),

  initial: 'detached',

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
              target: 'scrubbing',
            },
          },
        },
        scrubbing: {
          invoke: {
            id: 'scrubbing',
            input: ({ context }) => ({
              direction: context.direction,
              element: context.element,
            }),
            onDone: {
              target: 'idle',
            },
            onError: {
              actions: {
                params: ({ event }) => ({ error: event.error }),
                type: 'logError',
              },
              target: 'idle',
            },
            src: 'scrubbing',
          },

          on: {
            SCRUB: {
              actions: {
                params: ({ event }) => ({ position: event.position }),
                type: 'scrub',
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
