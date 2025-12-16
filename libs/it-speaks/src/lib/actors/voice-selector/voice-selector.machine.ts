import {
  type ActorRefFrom,
  type SnapshotFrom,
  assign,
  enqueueActions,
  setup,
} from 'xstate';

import { voicesListenerLogic } from './actors/voices-listener';
import type {
  SelectEvent,
  SetVoicesEvent,
  VoiceSelectorActorContext,
  VoiceSelectorActorEvent,
  VoiceSelectorActorInput,
} from './types';
import { findDefaultVoiceItemIndex, getVoiceItems } from './utils';

const voiceSelectorMachine = setup({
  types: {
    context: {} as VoiceSelectorActorContext,
    events: {} as VoiceSelectorActorEvent,
    input: {} as VoiceSelectorActorInput,
  },
  actions: {
    moveDown: assign(({ context }) => {
      const activeVoiceIndex =
        context.activeVoiceIndex === context.voiceItems.length - 1
          ? context.voiceItems.length - 1
          : context.activeVoiceIndex + 1;
      const activeVoiceItem = context.voiceItems[activeVoiceIndex];

      return { activeVoiceIndex, activeVoiceItem };
    }),
    moveFirst: assign(({ context }) => ({
      activeVoiceIndex: 0,
      activeVoiceItem: context.voiceItems[0],
    })),
    moveLast: assign(({ context }) => ({
      activeVoiceIndex: context.voiceItems.length - 1,
      activeVoiceItem: context.voiceItems[context.voiceItems.length - 1],
    })),
    moveUp: assign(({ context }) => {
      const activeVoiceIndex =
        context.activeVoiceIndex === 0 ? 0 : context.activeVoiceIndex - 1;
      const activeVoiceItem = context.voiceItems[activeVoiceIndex];

      return { activeVoiceIndex, activeVoiceItem };
    }),
    select: enqueueActions(
      ({ context, enqueue }, { id }: Omit<SelectEvent, 'type'>) => {
        let selectedIndex: number;

        if (id !== undefined) {
          selectedIndex = context.voiceItems.findIndex(
            (voiceItem) => voiceItem.id === id
          );
        } else {
          selectedIndex = context.activeVoiceIndex;
        }

        if (selectedIndex === -1) return;

        const selectedVoiceItem = context.voiceItems[selectedIndex];

        enqueue.assign({
          activeVoiceIndex: selectedIndex,
          activeVoiceItem: selectedVoiceItem,
          selectedVoiceItem,
        });

        enqueue.sendTo(({ context }) => context.parentActor, {
          type: 'SET_VOICE',
          voice: selectedVoiceItem.voice,
        });
      }
    ),
    setVoices: enqueueActions(
      ({ enqueue }, { voices }: Omit<SetVoicesEvent, 'type'>) => {
        if (voices.length === 0) return;

        const voiceItems = getVoiceItems(voices);
        const selectedIndex = findDefaultVoiceItemIndex(voiceItems);
        const selectedVoiceItem = voiceItems[selectedIndex];

        enqueue.assign({
          activeVoiceIndex: selectedIndex,
          activeVoiceItem: voiceItems[selectedIndex],
          selectedVoiceItem: voiceItems[selectedIndex],
          voiceItems,
        });

        enqueue.sendTo(({ context }) => context.parentActor, {
          type: 'SET_VOICE',
          voice: selectedVoiceItem.voice,
        });
      }
    ),
  },
  actors: {
    voicesListener: voicesListenerLogic,
  },
  guards: {
    hasVoices: (_, { voices }: Pick<SetVoicesEvent, 'voices'>) =>
      voices.length !== 0,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDcD2BLAxmAymANmJgC6oBOAxDgKIAqA+gGoDyAkgMLU4DaADALqJQAB1Sx0xdKgB2QkAA9EAFgBMAGhABPRAFYA7AE4AdAGYAHDpVKAjGZMmDK6yYC+LjWiy4CRUmSMAhiToyGAUALLMjNT0ACLMAOoAcnyCSCCi4pIycooIKmYqRnp6Sno6vCoAbM42VUoa2ggVxio6zqWGepVlbh4Y2HiEJOSBwaERUTEAYqwASji0qXKZElKy6XkFOkZmNtY65mbdTtZVjcrORgZ6VTV61np2VYV9IJ6DPiP+QZITkdF6AAZACCi2W6VW2Q2oC2x1Me2cOiqBhMTl4JguCBMtmKvFsOgMOkJDzObw+3mGfjGfzCAJiAFUAAoQkRiNY5TaIFQGKrXKq8IlnKwYpRmLEqFQmIyqB74gw2XjE8kDSm+Ua-EJhGhA6jsJYCFbs6G5RAmXhKIxKpRKsy8Kr2AwGR5Y6wFIwHKVKJRoqUGPY6NzuEDSVAQOByClDdVkI1ZdamhAAWnOWkQSZ2Tqz2ezZiqKq80e+NK1cY5MIUZrdphuzjthxeXSxAuMlhb6KJyJUBc+VNG6AghDLJq5CDdvCMxMMFQFOh9VVuWMsE7MRKqXbRiOsQZcQA */
  id: 'voiceSelector',

  context: ({ input }) => ({
    activeVoiceIndex: 0,
    activeVoiceItem: undefined,
    parentActor: input.parentActor,
    selectedVoiceItem: undefined,
    voiceItems: [],
  }),

  initial: 'idle',

  invoke: {
    id: 'voicesListener',
    src: 'voicesListener',
  },

  on: {
    SET_VOICES: {
      actions: {
        params: ({ event }) => ({ voices: event.voices }),
        type: 'setVoices',
      },
      guard: {
        params: ({ event }) => ({ voices: event.voices }),
        type: 'hasVoices',
      },
      target: '.active',
    },
  },

  states: {
    active: {
      on: {
        MOVE_DOWN: {
          actions: 'moveDown',
        },
        MOVE_FIRST: {
          actions: 'moveFirst',
        },
        MOVE_LAST: {
          actions: 'moveLast',
        },
        MOVE_UP: {
          actions: 'moveUp',
        },
        SELECT: {
          actions: {
            params: ({ event }) => ({ id: event.id }),
            type: 'select',
          },
        },
      },
    },

    idle: {},
  },
});

type VoiceSelectorActorRef = ActorRefFrom<typeof voiceSelectorMachine>;
type VoiceSelectorActorSnapshot = SnapshotFrom<typeof voiceSelectorMachine>;

export { voiceSelectorMachine };

export type { VoiceSelectorActorRef, VoiceSelectorActorSnapshot };
