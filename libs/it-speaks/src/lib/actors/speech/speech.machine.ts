import { type ActorRefFrom, type SnapshotFrom, setup } from 'xstate';

import { scrubMachine } from '../scrub/scrub.machine';

import type { SpeechActorContext, SpeechActorEvent } from './types';

enum ScrubKind {
  Speed = 'speed',
  Volume = 'volume',
  Word = 'word',
}

// TODO: refactor this
// TODO: implement this
//       - without scrubbing for first implementation
//       - figure out scrubbing event handling with guarded transitions based on `id` on event payload
//       - should probably create bespoke `TOGGLE_VOLUME` event in `speechMachine`
// TODO: continue here...
const speechMachine = setup({
  types: {
    context: {} as SpeechActorContext,
    events: {} as SpeechActorEvent,
  },
  actions: {
    // TODO: implement each of these
    /*
    boundary
    cancel
    load
    play
    speedScrub
    voiceChanged
    voicesChanged
    volumeScrub
    wordScrub
    */
    // TODO: implement this
    /*
    boundary: assign(({ wordIndex, length }) => {
      const newWordIndex = wordIndex + 1;

      return {
        wordIndex: newWordIndex,
        // TODO: refactor this to account for percentage in scrubber no longer being normalized
        percentage: newWordIndex / length,
      };
    }),
    */
    // TODO: implement this
    /*
    voicesChanged: assign(({ currentVoice }, { voice, voices }) => ({
      currentVoice: currentVoice ?? voice,
      voices,
    })),
    */
    // TODO: implement this
    /*
    voiceChanged: assign(({ voices, currentVoice }, { id }) => ({
      currentVoice:
        voices.find((voice) => voice.voiceURI === id) ?? currentVoice,
    })),
    */
    // TODO: implement this
    /*
    load: assign(({ rate, volume, currentVoice }, { text }) => {
      if (!currentVoice) return {};

      const { length } = text.split(' ');
      const utteranceRef = new SpeechSynthesisUtterance(
        text.replace(/[^a-zA-Z\s]/g, '')
      );
      utteranceRef.rate = rate;
      utteranceRef.volume = volume;
      utteranceRef.voice = currentVoice;

      return {
        utteranceRef,
        currentText: text,
        length,
        // TODO: refactor this to account for percentage in scrubber no longer being normalized
        percentage: 0,
        wordIndex: 0,
      };
    }),
    */
    // TODO: implement this
    /*
    play: assign(
      (
        {
          currentText,
          currentVoice,
          length,
          rate,
          utteranceRef,
          volume,
          wordIndex,
        },
        { type }
      ) => {
        // TODO: improve this error handling via `enqueueActions` with `enqueue.raise`
        if (!utteranceRef) throw new Error('Missing utterance');
        // TODO: improve this error handling via `enqueueActions` with `enqueue.raise`
        if (!currentVoice) throw new Error('Missing voice');

        let newUtteranceRef: SpeechSynthesisUtterance | undefined;
        if (type !== 'LOAD') {
          const newTextSlice = currentText
            .split(' ')
            .slice(wordIndex)
            .join(' ');
          newUtteranceRef = new SpeechSynthesisUtterance(
            newTextSlice.replace(/[^a-zA-Z\s]/g, '')
          );
          newUtteranceRef.rate = rate;
          newUtteranceRef.volume = volume;
          newUtteranceRef.voice = currentVoice;
        }

        speechSynthesis.cancel();
        speechSynthesis.speak(newUtteranceRef ?? utteranceRef);
        speechSynthesis.resume();

        return {
          // TODO: refactor this to account for percentage in scrubber no longer being normalized
          percentage: wordIndex / length,
          utteranceRef: newUtteranceRef ?? utteranceRef,
        };
      }
    ),
    */
    // TODO: implement this
    /*
    cancel: () => speechSynthesis.cancel(),
    */
    // TODO: implement this
    /*
    // TODO: refactor this to account for percentage in scrubber no longer being normalized
    volumeScrub: assign(({ utteranceRef }, { percentage }) => {
      if (utteranceRef) {
        // TODO: refactor this to account for percentage in scrubber no longer being normalized
        utteranceRef.volume = percentage;
      }

      // TODO: refactor this to account for percentage in scrubber no longer being normalized
      volumeSubject$.next(percentage);

      return {
        // TODO: refactor this to account for percentage in scrubber no longer being normalized
        volume: percentage,
      };
    }),
    */
    // TODO: implement this
    /*
    // TODO: refactor this to account for percentage in scrubber no longer being normalized
    speedScrub: assign(({ utteranceRef }, { percentage }) => {
      if (utteranceRef) {
        // TODO: refactor this to account for percentage in scrubber no longer being normalized
        utteranceRef.rate = percentage;
      }

      // TODO: refactor this to account for percentage in scrubber no longer being normalized
      rateSubject$.next(percentage);

      return {
        // TODO: refactor this to account for percentage in scrubber no longer being normalized
        rate: percentage,
      };
    }),
    */
    // TODO: implement this
    /*
    // TODO: refactor this to account for percentage in scrubber no longer being normalized
    wordScrub: assign(({ length }, { percentage }) => ({
      // TODO: refactor this to account for percentage in scrubber no longer being normalized
      percentage,
      // TODO: refactor this to account for percentage in scrubber no longer being normalized
      wordIndex: Math.trunc(percentage * length),
    })),
    */
  },
  actors: {
    scrub: scrubMachine,

    // TODO: implement each of these
    /*
    boundary$
    speedReload$
    voicesChange$
    volumeReload$
    */
    // TODO: implement this
    /*
    voicesChange$: (): Observable<VoicesChangedEvent> => {
      return fromSpeechSynthesisEvent().pipe(
        startWith(undefined),
        map(() => {
          const voices = speechSynthesis
            .getVoices()
            .filter((voice) => voice.localService);

          return {
            type: 'VOICES_CHANGED',
            voice: voices.find((voice) => voice.name === 'Tessa') ?? voices[0],
            voices,
          } as VoicesChangedEvent;
        })
      );
    },
    */
    // TODO: implement this
    /*
    boundary$: ({ utteranceRef }): Observable<BoundaryEvent> => {
      // TODO: improve this error handling via `throwError`
      if (!utteranceRef) throw new Error('Missing utterence');

      return fromUtteranceEvent(utteranceRef, 'onboundary').pipe(
        map<SpeechSynthesisEvent, BoundaryEvent>(() => ({
          type: 'BOUNDARY',
        }))
      );
    },
    */
    // TODO: implement this
    /*
    volumeReload$: (): Observable<ReloadEvent> => {
      return timer(0, 1000).pipe(
        withLatestFrom(volumeSubject$),
        distinctUntilChanged(
          ([, prevVolume], [, nextVolume]) => nextVolume === prevVolume
        ),
        skip(1),
        map<any, ReloadEvent>(() => ({
          type: 'RELOAD',
        }))
      );
    },
    */
    // TODO: implement this
    /*
    speedReload$: (): Observable<ReloadEvent> => {
      return timer(0, 1000).pipe(
        withLatestFrom(rateSubject$),
        distinctUntilChanged(
          ([, prevRate], [, nextRate]) => prevRate === nextRate
        ),
        skip(1),
        map<any, ReloadEvent>(() => ({
          type: 'RELOAD',
        }))
      );
    },
    */
  },
  guards: {
    isSpeedScrub: (_, { id }: { id: string }) => id === ScrubKind.Speed,
    isVolumeScrub: (_, { id }: { id: string }) => id === ScrubKind.Volume,
    isWordScrub: (_, { id }: { id: string }) => id === ScrubKind.Word,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwA5jAYwBYGIDCAggHJ4CiAMgNoAMAuoqCgPawCWALq0wHYMgAeiAOxCANCACewgMzSAdACZqADgUBOZWukAWbQulCAvofGp02HOQDyBACI16SEMzacefQQhHipCAKz6cgCMBhpBamoh1EYmIGaYuABqVgCSZADKAPp4ABLEAOKk9nR8LhxcvE6eOtpyQgpCygHKOkLSTdo+iEF+QsHU1PpBQtrK2tS6MaZoCTjJaaTZeUSFxY6MLOXuVYg6anJ+akIAbNrHysfRl9R+XQhB0YojQj2jagrDfsfG0+a46XgAEoAVQAQg5Sps3JVQNUlIo-OFpEEFGc2sdjncUT84jMLACQeCgutnFCKh5dtQgsFNLogsplEI-Iy1HdItQ5NIVKMXoydDocfF8UCwZQFCSytCKQguX0-ONpAFogoFPLlHdlD05NRZCcDJomszBXisHIAIYYTgANzAc1SZCWBSKEKckvJOwQQ21xzUAx6x16JwUmMkiFO8j8fiuIgiYz80mNf3NltYNrkKAANmaJKxuFAcAAFAjA9KkF0bVzu2GISPKOQYjGI64RY5BO69Ouq7TSYMTHQNIKJhLJ61gdNZnN5nCgqzAoi2AiAgCa5dJle21YQ2iCxzqA0RalOLRCYzu2iE+0VCiaQXCFy08qH2BHqbHmezufzgIoNjWkPXMICIgej7MMky3sGrbqCGvggQcDSyNoWhqFGDZPqaFqjumZoAK6wJAhbkAQK4lK6ZIbkB-jnHIKFcoeASfBM7bXnIegMtQRxjKigzGLE3BMBAcB8EKWD-lsgGeOoWJCBy7y9KMAxMpE2joXIrAQBmYBiVKHpKNS1A+n6XyBscwZ3G08gGKZYw3L6PYJrEIkvja2lVpR9LyAZvpUsZIimTBiCqp2owYu8mgccMqmYa+44fnmrkUZ43a1IqgyHFxIyKu2OjBI00jHCMHbKBMUUpmmsAYAATjhABGNWfglEmBZcig9no+UhaqrKhluEzereGLdneXylVhEA8FpZEAdKDR1sySgqlSHFfJ0PU6H4BwvMZBnbkFo0xSguH4RAjXSgVHInhMF4Xj0jTZbuBUtAV2hFSVvFAA */
  id: 'speech',

  // TODO: refactor this to account for percentage in scrubber no longer being normalized
  context: ({ self, spawn }) => ({
    speedScrubActor: spawn('scrub', {
      id: ScrubKind.Speed,
      input: {
        direction: 'bottom-top',
        max: 2,
        min: 0,
        parentActor: self,
      },
    }),
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
    wordScrubActor: spawn('scrub', {
      id: ScrubKind.Word,
      input: {
        direction: 'left-right',
        max: 1,
        min: 0,
        parentActor: self,
      },
    }),

    currentText: '',
    currentVoice: undefined,
    length: 0,
    percentage: 0,
    rate: 1,
    utteranceRef: undefined,
    voices: [],
    volume: 1,
    wordIndex: 0,
  }),

  initial: 'idle',

  // TODO: implement this
  /*
  invoke: {
    src: 'voicesChange$',
  },
  */

  on: {
    CANCEL: '.idle',

    LOAD: {
      target: '.active.playing',
      // TODO: implement this
      // actions: 'load',
      reenter: true,
    },

    VOICES_CHANGED: {
      // TODO: implement this
      // actions: 'voicesChanged',
    },

    VOICE_CHANGED: {
      // TODO: implement this
      // actions: 'voiceChanged',
    },

    // TODO: remove this after debugging
    ////// ---------------------------------------------------------------------
    /*
    SCRUB: [
      {
        actions: () => console.log('speed scrub event'),
        guard: {
          params: ({ event }) => ({ id: event.id }),
          type: 'isSpeedScrub',
        },
      },
      {
        actions: () => console.log('volume scrub event'),
        guard: {
          params: ({ event }) => ({ id: event.id }),
          type: 'isVolumeScrub',
        },
      },
      {
        actions: () => console.log('word scrub event'),
        guard: {
          params: ({ event }) => ({ id: event.id }),
          type: 'isWordScrub',
        },
      },
    ],

    SCRUB: {
      actions: ({ event }) => {
        console.log('SCRUB', event);
      },
    },
    SCRUB_END: {
      actions: ({ event }) => {
        console.log('SCRUB_END', event);
      },
    },
    SCRUB_START: {
      actions: ({ event }) => {
        console.log('SCRUB_START', event);
      },
    },
    */

    /*
    'SPEED/SCRUB': {
      actions: 'speedScrub',
    },
    'SPEED/START_SCRUB': {
      actions: 'speedScrub',
    },
    'VOLUME/SCRUB': {
      actions: ['volumeScrub'],
    },
    'VOLUME/START_SCRUB': {
      actions: ['volumeScrub'],
    },
    */
    ////// ---------------------------------------------------------------------
  },

  states: {
    idle: {},

    active: {
      initial: 'playing',

      states: {
        playing: {
          // entry: 'play',

          on: {
            PAUSE: {
              target: 'paused',
              // TODO: implement this
              // actions: 'cancel',
            },

            BOUNDARY: {
              // TODO: implement this
              // actions: 'boundary',
              target: 'playing',
            },

            RELOAD: {
              target: 'playing',
              reenter: true,
            },
          },

          // TODO: implement this
          /*
          invoke: [
            {
              src: 'boundary$',
              onDone: 'done',
            },
            {
              src: 'volumeReload$',
            },
            {
              src: 'speedReload$',
            },
          ],
          */
        },

        scrubbing: {
          // TODO: figure scrub actor composition out later
          /*
          on: {
            'WORD/SCRUB': {
              target: 'scrubbing',
              actions: 'wordScrub',
            },

            'WORD/END_SCRUB': {
              target: 'playing',
            },
          },
          */
        },

        // TODO: reevaluate 'done' state
        done: {},

        paused: {
          on: {
            PLAY: 'playing',
          },
        },
      },

      on: {
        // TODO: figure scrub actor composition out later
        /*
        'WORD/START_SCRUB': {
          actions: ['cancel', 'wordScrub'],
          target: '.scrubbing',
        },
        */

        VOICE_CHANGED: {
          target: '.playing',
          // TODO: implement this
          // actions: ['voiceChanged'],
        },
      },
    },
  },
});

type SpeechActorRef = ActorRefFrom<typeof speechMachine>;
type SpeechActorSnapshot = SnapshotFrom<typeof speechMachine>;

export { speechMachine };

export type { SpeechActorRef, SpeechActorSnapshot };
