import {
  type ActorRefFrom,
  type SnapshotFrom,
  assign,
  enqueueActions,
  sendTo,
  setup,
} from 'xstate';

import { scrubMachine } from '../scrub/scrub.machine';
import { voiceSelectorMachine } from '../voice-selector/voice-selector.machine';

import { utteranceListenerLogic } from './actors/utterance-listener';
import type {
  SetVoiceEvent,
  SpeechActorContext,
  SpeechActorEvent,
} from './types';

enum ScrubKind {
  Speed = 'speed',
  Volume = 'volume',
  Word = 'word',
}

const speechMachine = setup({
  types: {
    context: {} as SpeechActorContext,
    events: {} as SpeechActorEvent,
  },
  actions: {
    enableWordScrub: sendTo(({ context }) => context.wordScrubActor, {
      type: 'ENABLE',
    }),
    boundary: enqueueActions(({ context, enqueue }) => {
      const wordIndex = context.wordIndex + 1;
      const progress = wordIndex / context.words.length;

      enqueue.assign({ progress, wordIndex });
      enqueue.sendTo(context.wordScrubActor, {
        type: 'SET_VALUE',
        value: progress,
      });
    }),
    cancel: (_) => speechSynthesis.cancel(),
    load: enqueueActions(({ context, enqueue }, { text }: { text: string }) => {
      const words = text.split(' ');

      enqueue.assign({
        progress: 0,
        text,
        wordIndex: 0,
        words,
      });
      enqueue.sendTo(context.wordScrubActor, {
        type: 'SET_VALUE',
        value: 0,
      });
    }),
    logError: (_, { error }: { error: unknown }) => console.error(error),
    play: enqueueActions(({ context, enqueue }) => {
      if (!context.voice) {
        return enqueue.raise({
          type: 'ERROR',
          error: new Error('Missing voice'),
        });
      }

      const words = context.text.split(' ');
      const offsetText = words.slice(context.wordIndex).join(' ');
      const utterance = new SpeechSynthesisUtterance(
        offsetText.replace(/[^a-zA-Z\s]/g, '')
      );
      utterance.rate = context.rate;
      utterance.volume = context.muted ? 0 : context.volume;
      utterance.voice = context.voice;

      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
      speechSynthesis.resume();

      enqueue.assign({ utterance });
    }),
    speedScrub: assign((_, { value }: { value: number }) => ({ rate: value })),
    setVoice: assign((_, { voice }: Omit<SetVoiceEvent, 'type'>) => ({
      voice,
    })),
    toggleMute: enqueueActions(({ context, enqueue }) => {
      if (context.muted) {
        enqueue.assign({ muted: false });
        enqueue.sendTo(context.volumeScrubActor, {
          type: 'SET_VALUE',
          value: context.volume,
        });
      } else {
        enqueue.assign({ muted: true });
        enqueue.sendTo(context.volumeScrubActor, {
          type: 'SET_VALUE',
          value: 0,
        });
      }
    }),
    volumeScrub: assign((_, { value }: { value: number }) => ({
      muted: false,
      volume: value,
    })),
    wordScrub: assign(({ context }, { value }: { value: number }) => ({
      progress: value,
      wordIndex: Math.floor(value * context.words.length),
    })),
  },
  actors: {
    utteranceListener: utteranceListenerLogic,
    scrub: scrubMachine,
    voiceSelector: voiceSelectorMachine,
  },
  guards: {
    hasVoice: ({ context }) => context.voice !== undefined,
    isSpeedScrub: (_, { id }: { id: string }) => id === ScrubKind.Speed,
    isVolumeScrub: (_, { id }: { id: string }) => id === ScrubKind.Volume,
    isWordScrub: (_, { id }: { id: string }) => id === ScrubKind.Word,
    isWordScrubAndHasVoice: ({ context }, { id }: { id: string }) =>
      id === ScrubKind.Word && context.voice !== undefined,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwA5jAYwBYGICiASgQPIEDaADALqKgoD2sAlgC5P0B2tIAHogJwBmCgDoALMIAcAdlkA2AIwAmSWLEAaEAE9ECispELJcsZMFKKlgKxmAvrc2p02HABliAQQAilGkhAMzGyc3HwIetKaOghiSvwi0krKVhRyVkpyxnL2jmiYuO7eZAp+dIys7Fz+YRFRiHJKYiKSCoJ6FIJW0grK0jkgTvk4AMoAwgQAqgBCvtyBFSHViMaSCXLSpun8KhSR2roR4oqpHRQtVrH9gy5jkzMlc+XBVaBhqvHSFCkdCmImloI6uELEoEp05IINgoGlYrnkbuNpmQlKUAk9KqFllY5CIvnJLA1dvwxLIgcp+Kt9BQkmJ0hJafw4c5cMM8AAVAD6ADViABJUZ4Wb+ebPTEIbagjIdCHUsT8Br8MmCIQiFRywSCNI2bGwhwDeG4NnEADixtceA5AFkJmzBdRHkEMUtxakRMIKVYrBqrPwKHKyaZVp75fwvcTldCmfkRABDDBsABuYBGiKmHOGbI8BDZQrKjsWr0QnUEIlD8pU6Vk6SsQJkq2kkgoFP++Kskb11ywsfjTCTIiYEAANsmAAquDwATVzaPzL14uiUSisIhsXyU0n4G4UPskQPWoJS8sSi+hX0kUew3cTYBEKBjAFdYJAcGPJ9ORU7C8ClyvG5XN-w24Unui4iJkYh6MqgiSDI0jZB2BpXr2N4oIOMZaEwHBQDgECcDemEJvQADWN73iwLBgAATjGHAYGArhMLAFEcFR77ogW87fsuq7-luO5AnB0gJKoEjKvivxNheXZxtet5oRhWE4FRlH0JRckxiwABmqkALYiGRFHUbR9GMcxrH2sK7FzjUnqrNBaTKnBRhKAJXxgfocibnBnlmIIUlIX2qHoZh2FTMQEwAHJeFmU4WXmCzWboPqgiGvoyOsii0nuehuhkQj4mqpj+TJyHqQp2Ejh4Eysmxs5iq0bQrt53TKl8fwaPsCBdKCkg2BC25JKGEHFT2gXySFKZ3ByeBRbVCX1ekoLSOY5iqD0spAtiogpL8EKKANJIjbJQXlZN0zTbNDyWXVzrbh0YGeRs4GSIuezRG2ojrDYoarRuEJiEdpUnRNtznTNPgog6823R9uIWBs-C+l5sRAn8oi9R065+vimSA2NwWKaynI8vydqoh+HE2aGqqqG0dZiLsChApq3HSJ6Dm7F6fkIcyAUoeNilGqa5pWjaZNQ6KMMbm6Gq9Yk6QNOuQJY26liNuCkiIw2eM3rAGCUfeABGhsg6mF0+HFM7Q1+bMfGcjRmBIJhZZ1MHLgooYwYI9KqBcOsiHrBvG6bU3g8U5NWWKtsJPbpje5qag1p1gmlikpjKBk0H6PYeocPQEBwNwnYS5+nE+kCAC0jS4pYtd17X3O5LzJVJiXlNFm5ZYNL165s0uSo4r8vtdNu6xygDPPRi3+FDmAbeJeEvTiKkLUvXKKQucn+LNJ8eixBciSN-qzejShD5PhA8-1T0PWAbIscwb12VNPfaij+smtH52fNlSFV+3XHXEpgAS+QkDYWs1Id6LV2NjCEjJJ6XmngHfWRsTZYX-l+CEoIGaakGmcOUG5awNlLIGWCcRYjDQQV2Acw4MGcQUN0QwKRlQqE1r8eym1valnlPoJQEYTx9BzkAA */
  id: 'speech',

  context: ({ self, spawn }) => ({
    muted: false,
    progress: 0,
    rate: 1,
    speedScrubActor: spawn('scrub', {
      id: ScrubKind.Speed,
      input: {
        direction: 'bottom-top',
        initialValue: 1,
        max: 2,
        min: 0.25,
        parentActor: self,
      },
    }),
    text: '',
    utterance: undefined,
    voice: undefined,
    voiceSelectorActor: spawn('voiceSelector', {
      id: 'voiceSelector',
      input: { parentActor: self },
    }),
    volume: 1,
    volumeScrubActor: spawn('scrub', {
      id: ScrubKind.Volume,
      input: {
        direction: 'left-right',
        initialValue: 1,
        max: 1,
        min: 0,
        parentActor: self,
      },
    }),
    wordIndex: 0,
    wordScrubActor: spawn('scrub', {
      id: ScrubKind.Word,
      input: {
        direction: 'left-right',
        disable: true,
        initialValue: 0,
        max: 1,
        min: 0,
        parentActor: self,
      },
    }),
    words: [],
  }),

  initial: 'idle',

  entry: 'cancel',
  exit: 'cancel',

  on: {
    ERROR: {
      actions: {
        params: ({ event }) => ({ error: event.error }),
        type: 'logError',
      },
    },
    LOAD: [
      {
        actions: {
          params: ({ event }) => ({ text: event.text }),
          type: 'load',
        },
        guard: 'hasVoice',
        target: '.active.playing',
      },
      {
        actions: {
          params: ({ event }) => ({ text: event.text }),
          type: 'load',
        },
        target: '.active.idle',
      },
    ],
    SCRUB: [
      {
        actions: {
          params: ({ event }) => ({ value: event.value }),
          type: 'speedScrub',
        },
        guard: {
          params: ({ event }) => ({ id: event.id }),
          type: 'isSpeedScrub',
        },
      },
      {
        actions: {
          params: ({ event }) => ({ value: event.value }),
          type: 'volumeScrub',
        },
        guard: {
          params: ({ event }) => ({ id: event.id }),
          type: 'isVolumeScrub',
        },
      },
      {
        actions: {
          params: ({ event }) => ({ value: event.value }),
          type: 'wordScrub',
        },
        guard: {
          params: ({ event }) => ({ id: event.id }),
          type: 'isWordScrub',
        },
      },
    ],
    SET_VOICE: {
      actions: {
        params: ({ event }) => ({ voice: event.voice }),
        type: 'setVoice',
      },
    },
    TOGGLE_MUTE: {
      actions: 'toggleMute',
    },
  },

  states: {
    active: {
      initial: 'idle',

      entry: 'enableWordScrub',

      on: {
        SCRUB_START: [
          {
            target: '.scrubbing',
            guard: {
              params: ({ event }) => ({ id: event.id }),
              type: 'isWordScrub',
            },
          },
        ],
      },

      states: {
        idle: {
          on: {
            PLAY: {
              actions: {
                params: ({ context }) => ({ text: context.text }),
                type: 'load',
              },
              guard: 'hasVoice',
              target: 'playing',
            },
          },
        },

        paused: {
          on: {
            PLAY: { target: 'playing' },
          },
        },

        playing: {
          entry: 'play',
          exit: 'cancel',

          invoke: [
            {
              id: 'utteranceListener',
              input: ({ context }) => ({ utterance: context.utterance }),
              onDone: { target: 'idle' },
              onError: {
                actions: {
                  params: ({ event }) => ({ error: event.error }),
                  type: 'logError',
                },
              },
              src: 'utteranceListener',
            },
          ],

          on: {
            BOUNDARY: {
              actions: 'boundary',
            },
            PAUSE: {
              target: 'paused',
            },
            SCRUB_END: [
              {
                guard: {
                  params: ({ event }) => ({ id: event.id }),
                  type: 'isSpeedScrub',
                },
                reenter: true,
                target: 'playing',
              },
              {
                guard: {
                  params: ({ event }) => ({ id: event.id }),
                  type: 'isVolumeScrub',
                },
                reenter: true,
                target: 'playing',
              },
              {
                guard: {
                  params: ({ event }) => ({ id: event.id }),
                  type: 'isWordScrub',
                },
                reenter: true,
                target: 'playing',
              },
            ],
            SET_VOICE: {
              actions: {
                params: ({ event }) => ({ voice: event.voice }),
                type: 'setVoice',
              },
              reenter: true,
              target: 'playing',
            },
            TOGGLE_MUTE: {
              actions: 'toggleMute',
              reenter: true,
              target: 'playing',
            },
          },
        },

        scrubbing: {
          on: {
            SCRUB_END: [
              {
                guard: {
                  params: ({ event }) => ({ id: event.id }),
                  type: 'isWordScrubAndHasVoice',
                },
                target: 'playing',
              },
              {
                guard: {
                  params: ({ event }) => ({ id: event.id }),
                  type: 'isWordScrub',
                },
                target: 'idle',
              },
            ],
          },
        },
      },
    },

    idle: {},
  },
});

type SpeechActorRef = ActorRefFrom<typeof speechMachine>;
type SpeechActorSnapshot = SnapshotFrom<typeof speechMachine>;

export { speechMachine };

export type { SpeechActorRef, SpeechActorSnapshot };
