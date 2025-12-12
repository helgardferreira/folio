import {
  type ActorRefFrom,
  type SnapshotFrom,
  assign,
  enqueueActions,
  setup,
} from 'xstate';

import { scrubbingLogic } from './actors/scrubbing.actor';
import type {
  AttachEvent,
  ScrubActorContext,
  ScrubActorEvent,
  ScrubActorInput,
  ScrubEvent,
} from './types';
import { getScrubTrackRect, lerp, normalize } from './utils';

// TODO: implement event emitters
// TODO: continue here...
const scrubMachine = setup({
  types: {
    context: {} as ScrubActorContext,
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
    scrub: assign(
      (_, { percentage, position, value }: Omit<ScrubEvent, 'type'>) => ({
        percentage,
        position,
        value,
      })
    ),
  },
  actors: {
    scrubbing: scrubbingLogic,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwMYCcCuAjAdAQwBcC8UALSAYgBEBRAFQEEBhACQG0AGAXUVAAcA9rACWBYQIB2vEAA9EAJgAc8nAEYAnAFZ5AZk3qdigCz7FANgA0IAJ6JVOlUfWqOigOwcdL+WeMBfPytUTFxCYjJIHGEIABswCgBlJgAlAFUAIQB9BMZkuk4eJBBBETFJaTkEN10cJXkjBrMjRVUzTytbBFVNMzVmtzMNZxcmxQCg9Gx8IhJyCBxg7CxhCSgKCEkwKIkANwEAay3FrGXVgukS0XEpIsrqlUUddTcvTQG9ew6FdUVaowH1IMOP1quMQMdpuE5gtJicVmswGg0AI0Dg+DFCAAzFEAWxhIVOUHORUuZRuoDu8geTxe3Xemk+NgUHE0OGeRnkbm8Zl8HA0YIhYVmkWOhMSKQyxP4Qiu5VuiAZ6hw7m88nUBiMZh8Xy6mg4OCab0Umh0bj1ZjcbgFsJwEDAUMoDDojFYUuKMrJFQUyjUWl0+kMJh+liZCCpbhwA00xqpvnUHCU1pCFBoyWSAHlkm7SdcvQgOTrWvq3M8dBw+aojOX5JpNAFAiAJAI7fAiscLh7c-KEABaEOdHs1dXDkcj8xJqZCiIQDulLsUxBPFQvTzqZpOeQcC06HVmHQ4Bxq3Tr4EWsYNwUzadRWJgWey8myRCKdQqLRmNeKBNKIw6HehqklXMLVK2BVQXz-HQJ1CK9oVFeF709bsGmLMsnnXV8txeHUa31TDay3VQ1V-MxoNte1hRnElOzlBddSMA8yzMfR6h6Bxa0LNo2WYzkOHjJQeR6es-CAA */
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
        params: ({ event }) => ({ error: event.error }),
        type: 'logError',
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
              max: context.max,
              min: context.min,
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
                params: ({ event }) => ({
                  percentage: event.percentage,
                  position: event.position,
                  value: event.value,
                }),
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
