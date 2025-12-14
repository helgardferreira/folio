import { type ActorRefFrom, type SnapshotFrom, setup } from 'xstate';

import { scrubMachine } from '../scrub/scrub.machine';

import type { SpeechActorContext, SpeechActorEvent } from './types';

// TODO: refactor this
// TODO: implement this
//       - without scrubbing for first implementation
//       - figure out scrubbing event handling with guarded transitions based on `id` on event payload
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
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwA5jAYwBYGIDCAggHJ4CiAMgNoAMAuoqCgPawCWALq0wHYMgAeiAKwB2ADQgAnsIAcMgHQBGajOoAWAJxCAzEKEAmavoC+xianTYc5APIEAIjXpIQzNpx59BCUROkJtEQVqQJE1ADZFRRlw7Wpw03M0TFwANRsASTIAZQB9PAAJYgBxUkc6PjcOLl4Xb219NXkRfSCZIRkNbRlAjTU-REUTMxALFJx0rNJ8oqJS8udGFmrPOsQGjXkhDRFwmX1OxRFdiIGEcPDNrt0gjUVtgxFE0eTseQBDDE4ANzAJzLIMxKZSclWWHlqoG8+ii8niGmoymoQkUGh6Mn6UkQmgUaiEyOUqjkEQxzzGb0+PzA8hQABt3pJWNwoDgAAoEACq2VIoJcVQhXmE3XkFwuIiEeP2uhkZzU2m0Sgl1BEgX0DXCarJrywHy+rF+NPpjOZOAAQjYOUR7AQAEoATV5S3cNUFAQ04Wa1GRKg1Gj6RjO8qa+gMHXC4o6inDCRG5J1lP11LpDKZLJtFDsCzBztWUOx1E2RzUanFRjuKkx-gOTTUrWRKvF3VrWss8b1BpQ7wArrBIGzyAQHRU+eCXWsfGoFFptPc5PEohrAz15A12sXtLX9jtTCNuEwIHA+HHsytIQJEBoziH5Ps9FGQzFRPoY0lW-JWBBaWATwLx9FFHClyIl6KJok2ZwdAorThOoiKdK0WgtikupUj+Y55ggUYKvCwEEmBGJnFECqKJOm4HI0YQdEhFLtkmRqpmhubnggagkSu+KtNE0FxEIS6bMqMgLoo2gapoajUW2VLyLAGAAE5dgARgpDEjjmZ7Qmo1DyGqjT6CGMJiuElaIA+8jugWDRRBiogSShibyBAPDfqpp6uqZHSGHppF6PoV5evIJbCZpcS+qiwyvshCYdt2vYQIx6mIOE+JKN08TdGEM6ooGdxbEEQkiY0fQ7sYQA */
  id: 'speech',

  // TODO: refactor this to account for percentage in scrubber no longer being normalized
  context: ({ self, spawn }) => ({
    speedScrubActor: spawn('scrub', {
      id: 'speed',
      input: { direction: 'bottom-top', max: 2, min: 0, parentActor: self },
    }),
    volumeScrubActor: spawn('scrub', {
      id: 'volume',
      input: { direction: 'left-right', max: 1, min: 0, parentActor: self },
    }),
    wordScrubActor: spawn('scrub', {
      id: 'word',
      input: { direction: 'left-right', max: 1, min: 0, parentActor: self },
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
    ////// ---------------------------------------------------------------------

    // TODO: figure scrub actor composition out later
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
