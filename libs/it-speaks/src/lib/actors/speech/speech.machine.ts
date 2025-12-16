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
  /** @xstate-layout N4IgpgJg5mDOIC5SwA5jAYwBYGICiASgQPIEDaADALqKgoD2sAlgC5P0B2tIAHogJwBWAMwA6CgHYJggEwVZMxfwA0IAJ6IAHADYJ4zYM0UALIInbBARhnGAvrdWp02HABliAQQAilGkhAMzGyc3HwImhKqGggymsai2nLawsb8-JrC2vx2DiBOmLju3mSWfnSMrOxc-mERUYjGEvyiEtbGGWmCFMKW-Nr2jmgFOADKAMIEAKoAQr7cgZUhNVr8lqLGlhtyFNomTYL1CH0yopk7svyZgto3A3lDLuNTs6XzFcHVoLUSJ8JWuzJLD9+BRNDJDpZ5HpkiJjMJLpZLGYZHd8o88AAVAD6ADViABJMZ4Ob+BYfUICYzxEFZdqxLIZcHqRCI2SiVYUbqpGRmRqaVEPLCiACGGDYADcwKMJjMsSMMR4CBiSeUglUKQhhFr2YI+sIjDt0hIdocftp1sI5FZsu1NIiBc4haKJWBREwIAAbKUABVcHgAmiqAu91csENYQaIIpk7ZtLH92odZHpjBQQRIwZd5Jp+A6CiKxUxJaIUMKAK6wSA4X0BoNk0NfFkySPR7SxjYJzSHRp6QwJ-hNP6aHR57AFl0lj3CtRMDhQHAQTiu2fi+gAa1dZZYLDAACdhRwMGBXExYDuOHu6yGlo3w82KFGJDHER3BInmQhEic28JzPxYuYqSCKOTqFsWKBTjOc44Huu70Luk7CiwABm8EALaiFuO77oex6nuel7UG8ao3rwLKJGIugDpkiQZqCwhJrsohdNYULSBEMgSCB45Fq6EHTrO87TMQkwAHJeIqgZEaS16fGR4YWJoogyMkFDNlYkiCIY3YWMpKlWHy1hgtxzq8YhUHzt6HiTCMxLSaqixyWE8Z9FGWRSIiJjxpI3acS0hhqRGGyWGCOSDI6PHgZBgnSs8WJ4OJV4kU5LKGEpakiByOg2D5H4bII6ycukiR2rG2hhfcEWmVFAnQU8soJT4rwyclGpIm27KJCCdptlINiHFczHSKYUhgik8bAbkaKgRO-EWaMmK4gSRJJY5bU3A+ZgSMYuhAT+DEfpxD7CJy5i6BE0iSCZYGurAGC7mWABGj0xfVsz2cGrVhrsKbdDcpghWcliHMkYhmEDw6gukFXTZFt33U9L11TK0zxYlH31qRtQ8uIFDWNIGZNMaximqm4hCDYvQnbok3hfm1Xww9z2vSjaNNWUn1rWGYIFZy+NmBEA4mCDihRqkmbcpaPz2LkHD0BAcDcNNxFc7e8KHAAtDYuOcrreucnC10uir5JhrEBVCHqBoMsa2gQpkoibHEcjpNcRj9FNgpw26npgCbDbyYi-4JGkUhpIo2hIl2H6RwVf5dFIiRUr0RtmaWFaQP7WMskCSkhe01NpiNB3RDtzQ3GkKSSECfy6KnNUWVnKXhm+SnjaxeNwrl0QWHoUg7ZC4eQjDXsM6Id1M0jUBNxqFgnFpeO-qYcRaiXiBPmIcSZgBrfDtx7pejPYZImsSLdEIXSGFtkQfvqzQ5m+mk5joXEy0AA */
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
            SCRUB: {
              actions: {
                params: ({ event }) => ({ value: event.value }),
                type: 'wordScrub',
              },
              guard: {
                params: ({ event }) => ({ id: event.id }),
                type: 'isWordScrub',
              },
            },
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
