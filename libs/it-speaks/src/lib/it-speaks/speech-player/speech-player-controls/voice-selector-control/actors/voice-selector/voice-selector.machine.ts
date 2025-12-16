import {
  type ActorRef,
  type ActorRefFrom,
  type Snapshot,
  type SnapshotFrom,
  assign,
  enqueueActions,
  setup,
} from 'xstate';

import type { VoiceItem } from './types';
import { getVoiceItems } from './utils';

type ParentActor = ActorRef<
  Snapshot<unknown>,
  { type: 'VOICE_CHANGED'; id: string }
>;

type VoiceSelectorActorContext = {
  activeId: string | undefined;
  activeIndex: number;
  selectedId: string | undefined;
  // TODO: make `voiceSelectorMachine` a child of `speechMachine` later
  parentActor: ParentActor;
  voiceItems: VoiceItem[];
};

type VoiceSelectorActorInput = {
  // TODO: make `voiceSelectorMachine` a child of `speechMachine` later
  parentActor: ParentActor;
};

type MoveDownEvent = {
  type: 'MOVE_DOWN';
};
type MoveFirstEvent = {
  type: 'MOVE_FIRST';
};
type MoveLastEvent = {
  type: 'MOVE_LAST';
};
type MoveUpEvent = {
  type: 'MOVE_UP';
};
type SelectEvent = {
  type: 'SELECT';
  id?: string;
};
type SetVoicesEvent = {
  type: 'SET_VOICES';
  currentVoice: SpeechSynthesisVoice | undefined;
  voices: SpeechSynthesisVoice[];
};

// TODO: implement all events / transitions / actions
type VoiceSelectorActorEvent =
  | MoveDownEvent
  | MoveFirstEvent
  | MoveLastEvent
  | MoveUpEvent
  | SelectEvent
  | SetVoicesEvent;

// TODO: implement this
//       - set active index to selected index when voice selector control is closed
const voiceSelectorMachine = setup({
  types: {
    context: {} as VoiceSelectorActorContext,
    events: {} as VoiceSelectorActorEvent,
    input: {} as VoiceSelectorActorInput,
  },
  actions: {
    moveDown: assign(({ context }) => {
      const activeIndex =
        context.activeIndex === context.voiceItems.length - 1
          ? context.voiceItems.length - 1
          : context.activeIndex + 1;
      const activeId = context.voiceItems[activeIndex].id;

      return { activeId, activeIndex };
    }),
    moveFirst: assign(({ context }) => ({
      activeId: context.voiceItems[0].id,
      activeIndex: 0,
    })),
    moveLast: assign(({ context }) => ({
      activeId: context.voiceItems[context.voiceItems.length - 1].id,
      activeIndex: context.voiceItems.length - 1,
    })),
    moveUp: assign(({ context }) => {
      const activeIndex =
        context.activeIndex === 0 ? 0 : context.activeIndex - 1;
      const activeId = context.voiceItems[activeIndex].id;

      return { activeId, activeIndex };
    }),
    select: enqueueActions(
      ({ context, enqueue }, { id }: Omit<SelectEvent, 'type'>) => {
        let selectedIndex: number;

        if (id !== undefined) {
          selectedIndex = context.voiceItems.findIndex(
            (voiceItem) => voiceItem.id === id
          );
        } else {
          selectedIndex = context.activeIndex;
        }

        if (selectedIndex === -1) return;

        const selectedId = context.voiceItems[selectedIndex].id;

        enqueue.assign({
          activeId: selectedId,
          activeIndex: selectedIndex,
          selectedId,
        });

        enqueue.sendTo(({ context }) => context.parentActor, {
          type: 'VOICE_CHANGED',
          id: selectedId,
        });
      }
    ),
    // TODO: reimplement this later
    setVoices: assign(
      (_, { currentVoice, voices }: Omit<SetVoicesEvent, 'type'>) => {
        const voiceItems = getVoiceItems(voices);

        const selectedIndex = voiceItems.findIndex(
          (voiceItem) => voiceItem.id === currentVoice?.voiceURI
        );

        if (currentVoice === undefined || selectedIndex === -1) {
          return {
            activeId: voiceItems[0].id,
            activeIndex: 0,
            selectedId: voiceItems[0].id,
            voiceItems,
          };
        }

        return {
          activeId: voiceItems[selectedIndex].id,
          activeIndex: selectedIndex,
          selectedId: voiceItems[selectedIndex].id,
          voiceItems,
        };
      }
    ),
  },
  guards: {
    hasVoices: (_, { voices }: Pick<SetVoicesEvent, 'voices'>) =>
      voices.length !== 0,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDcD2BLAxmAymANmJgC6oBOAxDgKIAqA+gGoDyAkgMLU4DaADALqJQAB1Sx0xdKgB2QkAA9EAFgBMAGhABPRAGYVvAHQBOAIxGlvAOxGV+lUaMA2AL7ONaLLgJFSZAwEMSdGQwCgBZZkZqegARZgB1ADk+QSQQUXFJGTlFBHsVAz0ADksinR1HKydHDW08osNHFSVzHRNyksdLJVd3DGw8QhJyAKCQ8MjogDFWACUcWhS5DIkpWTTc+wBWQqMtkzKTStKVGq1EFR1Da3MlJSKTexsTXpAPAe9hv0DJcYio+gAGQAggslmkVll1qBNk5jDoHkpLMUjEUmltaogDoYjMjzI4WioTFYka93l4hr5Rr9Qv9ogBVAAK4JEYlW2Q2ul4jgM+xaBIqyMspSUmIQ7RMBhM9zuD0sj1sRTJ-QpPhGP2CoRogOo7AYwL1rCiLPSbKhOQuRQKwqRSgq+hKvCKYoehVsRisRWeWy6Lle0lQEDgcnJgzVZGWZrWFoQAFoznV48rPGGvtTNZHMtHOXlTLykVsVA0TN0lPsdGLyjsy7w7tKtkjHNK-X0U58qegIIRM+zoQosfpeVtrEpHBV68OMec8k0DKpUcSWo9h0ZXK4gA */
  id: 'voiceSelector',

  context: ({ input }) => ({
    activeId: undefined,
    activeIndex: 0,
    selectedId: undefined,
    parentActor: input.parentActor,
    voiceItems: [],
  }),

  initial: 'idle',

  on: {
    SET_VOICES: {
      actions: {
        params: ({ event }) => ({
          currentVoice: event.currentVoice,
          voices: event.voices,
        }),
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
        MOVE_DOWN: { actions: 'moveDown' },
        MOVE_FIRST: { actions: 'moveFirst' },
        MOVE_LAST: { actions: 'moveLast' },
        MOVE_UP: { actions: 'moveUp' },
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
