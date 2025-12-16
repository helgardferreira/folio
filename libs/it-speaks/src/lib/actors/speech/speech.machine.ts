import {
  type ActorRefFrom,
  type SnapshotFrom,
  assign,
  enqueueActions,
  sendTo,
  setup,
} from 'xstate';

import { scrubMachine } from '../scrub/scrub.machine';

import { voicesListenerLogic } from './actors/voices-listener';
import type {
  SpeechActorContext,
  SpeechActorEvent,
  VoicesChangedEvent,
} from './types';
import { findDefaultVoice } from './utils';

enum ScrubKind {
  Speed = 'speed',
  Volume = 'volume',
  Word = 'word',
}

// TODO: refactor this
//       - move most (if not all) `SpeechSynthesisVoice` related actions and actors to `voiceSelectorMachine`
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
    enableWordScrub: sendTo(({ context }) => context.wordScrubActor, {
      type: 'ENABLE',
    }),
    // TODO: implement each of these
    /* boundary */
    cancel: (_) => speechSynthesis.cancel(),
    load: enqueueActions(({ context, enqueue }, { text }: { text: string }) => {
      const { currentVoice, rate, volume } = context;

      if (!currentVoice) return;

      const { length } = text.split(' ');
      const utteranceRef = new SpeechSynthesisUtterance(
        text.replace(/[^a-zA-Z\s]/g, '')
      );
      utteranceRef.rate = rate;
      utteranceRef.volume = volume;
      utteranceRef.voice = currentVoice;

      enqueue.assign({
        currentText: text,
        length,
        progress: 0,
        utteranceRef,
        wordIndex: 0,
      });
    }),
    /* play */
    // TODO: completely reimplement / rework reload mechanism
    speedScrub: enqueueActions(
      ({ context, enqueue }, { value }: { value: number }) => {
        const { utteranceRef } = context;

        if (utteranceRef) {
          utteranceRef.rate = value;
        }

        // TODO: completely reimplement / rework reload mechanism
        /*
          rateSubject$.next(value);
        */

        enqueue.assign({ rate: value });
      }
    ),
    /* voiceChanged */
    voicesChanged: assign(
      ({ context }, { voices }: Omit<VoicesChangedEvent, 'type'>) =>
        context.currentVoice !== undefined
          ? { voices }
          : { currentVoice: findDefaultVoice(voices), voices }
    ),
    // TODO: completely reimplement / rework reload mechanism
    volumeScrub: enqueueActions(
      ({ context, enqueue }, { value }: { value: number }) => {
        const { utteranceRef } = context;

        if (utteranceRef) {
          utteranceRef.volume = value;
        }

        // TODO: completely reimplement / rework reload mechanism
        /*
        volumeSubject$.next(value);
        */

        enqueue.assign({ volume: value });
      }
    ),
    wordScrub: assign(({ context }, { value }: { value: number }) => ({
      progress: value,
      wordIndex: Math.trunc(value * context.length),
    })),
    // TODO: implement this
    /*
    boundary: assign(({ wordIndex, length }) => {
      const newWordIndex = wordIndex + 1;

      return {
        wordIndex: newWordIndex,
        progress: newWordIndex / length,
      };
    }),
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

        // TODO: determine if this can be removed through proper finite states and transitions
        speechSynthesis.cancel();
        speechSynthesis.speak(newUtteranceRef ?? utteranceRef);
        speechSynthesis.resume();

        return {
          progress: wordIndex / length,
          utteranceRef: newUtteranceRef ?? utteranceRef,
        };
      }
    ),
    */
  },
  actors: {
    // TODO: implement each of these
    /* boundary$ */
    scrub: scrubMachine,
    /* speedReload$ */
    voicesListener: voicesListenerLogic,
    /* volumeReload$ */
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
    hasVoice: ({ context }) => context.currentVoice !== undefined,
    isSpeedScrub: (_, { id }: { id: string }) => id === ScrubKind.Speed,
    isVolumeScrub: (_, { id }: { id: string }) => id === ScrubKind.Volume,
    isWordScrub: (_, { id }: { id: string }) => id === ScrubKind.Word,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwA5jAYwBYGIDCAggHJ4CiAMgNoAMAuoqCgPawCWALq0wHYMgAeiAGwB2ADQgAnohEAmABwA6eQGZZ1akOryArCoCc1ACwBfExNTpsOcgHkCAERr0kIZm048+ghKInSEI30hRWoVEWoREQBGHWpokRVosws0TFwAZTwAJQBVACFnPncOLl5XHxUDRRUdfX0RHXVNaKF-RGjIxVkRI16dVr1ZfSN5FJBLdJwsvMLol0YWUq8KxDVqbobR+JV5DRVjdoRo2XHJ6wA1WwBJMgyAfTwACWIAcVInOmKlz3LQSqEKmUtUMsWiKiEsiEOiO8i0ilGBx0RiEQiMdSEZzSlxuZEeLyI70+CzcPzK3jWQiUER0Qn0VXC9USsM6imhjQM0XqrShWKsWEUAEMMJwAG5gHBXW6kfFvD5FVwlX4UhA9fTdXRg2RJeTRVRHQHqhJGE0NNSqERjcwTbEC4VisCKFAAG0FklY3CgOAACgRchlSArFh5yatfJplPIekYTqJkVGjjpEsoog04oYqvJ9Hz0kKRaxxU7Xe7PTh8rZckQHARsgBNIOkkMrf6IFFGRT6VqQ5HUOqyHRwo59dsNaG7TpZxo6HQ57B5h1Ft0er3ZCj2YnfJt-AStqI1QxJ9SAyKxGFSVv9xRgjRBfRNMKma3nO35wsoQUAV1gkB95AI9a+RUyWbHdfASK86XUU89REPxzwQJp217ftOmMeREjCMxrW4JgIDgPhn03ZZtx8LkjgAWkaGpZGGLl4jhQx5EfVJ+UUVgIGdMAiOVMNZCCDUBgGbU9T1FQjjkJR6nqKMmNRZIn1tecCy4oCtxVYSBK1HVRKOfsgXQ7UswSfRdRMlRZxfBcXSXT1uNDFtAijRRaUBaco1RTRIkTYZlGodQYho6MogspTC1gDAACcPwAI2i5c7JAyptARUZkTpMJjG1cR4IMdUqVGCJohjOIghC+1lMUCAeBU4NiJVNQQhEEzBl7LRdn0I4VBjK872GXs4gSU4FNY8q30-b8IASkiZD1Goe1kk1aihRM1BqPzjHpOQjCyrCTCAA */
  id: 'speech',

  context: ({ self, spawn }) => ({
    currentText: '',
    currentVoice: undefined,
    length: 0,
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
    utteranceRef: undefined,
    voices: [],
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
  }),

  initial: 'idle',

  invoke: {
    id: 'voicesListener',
    src: 'voicesListener',
  },

  on: {
    CANCEL: {
      target: '.idle',
    },
    LOAD: [
      {
        actions: [
          'enableWordScrub',
          {
            params: ({ event }) => ({ text: event.text }),
            type: 'load',
          },
        ],
        guard: 'hasVoice',
        reenter: true,
        target: '.active.playing',
      },
      {
        actions: [
          'enableWordScrub',
          {
            params: ({ event }) => ({ text: event.text }),
            type: 'load',
          },
        ],
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
    // TODO: determine if this is still necessary thanks to reworked `scrubMachine` implementation
    /*
    SCRUB_START: [
      {
        // actions: 'speedScrub',
        guard: {
          params: ({ event }) => ({ id: event.id }),
          type: 'isSpeedScrub',
        },
      },
      {
        // actions: 'volumeScrub',
        guard: {
          params: ({ event }) => ({ id: event.id }),
          type: 'isVolumeScrub',
        },
      },
    ],
    */
    VOICES_CHANGED: {
      actions: {
        params: ({ event }) => ({ voices: event.voices }),
        type: 'voicesChanged',
      },
    },
    VOICE_CHANGED: {
      // TODO: remove this after debugging
      //// ---------------------------------------------------------------------
      actions: () => {
        console.log('wolf A');
      },
      //// ---------------------------------------------------------------------
      // TODO: implement this
      // actions: 'voiceChanged',
    },
  },

  states: {
    idle: {},

    active: {
      initial: 'playing',

      states: {
        // TODO: maybe implement `exit` action?
        playing: {
          // TODO: implement this
          // entry: 'play',
          // TODO: remove this after debugging
          entry: () => {
            console.log('.active.playing entry');
          },

          on: {
            PAUSE: {
              actions: 'cancel',
              target: 'paused',
            },

            BOUNDARY: {
              // TODO: implement this
              // actions: 'boundary',
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
              onDone: {
                target: '.idle',
              },
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

        // TODO: reevaluate 'active.idle' state
        idle: {},

        paused: {
          on: {
            PLAY: {
              target: 'playing',
            },
          },
        },
      },

      on: {
        SCRUB_START: [
          {
            actions: [
              // TODO: maybe remove this in favor of `.active.playing` `exit` action?
              'cancel',
              // TODO: determine if this is still necessary thanks to reworked `scrubMachine` implementation
              // 'wordScrub'
            ],
            target: '.scrubbing',
            guard: {
              params: ({ event }) => ({ id: event.id }),
              type: 'isWordScrub',
            },
          },
        ],

        VOICE_CHANGED: {
          target: '.playing',
          // TODO: implement this
          // actions: 'voiceChanged',
          // TODO: remove this after debugging
          //// ---------------------------------------------------------------------
          actions: () => {
            console.log('wolf B');
          },
          //// ---------------------------------------------------------------------
          // TODO: determine if reenter should be enabled here
          // reenter: true,
        },
      },
    },
  },
});

type SpeechActorRef = ActorRefFrom<typeof speechMachine>;
type SpeechActorSnapshot = SnapshotFrom<typeof speechMachine>;

export { speechMachine };

export type { SpeechActorRef, SpeechActorSnapshot };
