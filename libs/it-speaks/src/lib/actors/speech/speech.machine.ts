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

// TODO: refactor this
// TODO: implement this
//       - without scrubbing for first implementation
//       - figure out scrubbing event handling with guarded transitions based on `id` on event payload
//       - should probably create bespoke `TOGGLE_VOLUME` event in `speechMachine`
//       - implement better error handling
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
    boundary: assign(({ context }) => {
      const { wordIndex, length } = context;
      const newWordIndex = wordIndex + 1;

      return {
        wordIndex: newWordIndex,
        progress: newWordIndex / length,
      };
    }),
    cancel: (_) => speechSynthesis.cancel(),
    load: enqueueActions(({ context, enqueue }, { text }: { text: string }) => {
      const { voice, rate, volume } = context;

      if (!voice) return;

      const { length } = text.split(' ');
      const utterance = new SpeechSynthesisUtterance(
        text.replace(/[^a-zA-Z\s]/g, '')
      );
      utterance.rate = rate;
      utterance.volume = volume;
      utterance.voice = voice;

      enqueue.assign({
        length,
        progress: 0,
        text,
        utterance,
        wordIndex: 0,
      });
    }),
    logError: (_, { error }: { error: unknown }) => console.error(error),
    // TODO: reimplement this
    play: enqueueActions(({ context, enqueue }, { type }: { type: string }) => {
      const { length, rate, text, utterance, voice, volume, wordIndex } =
        context;

      // TODO: remove this after debugging
      console.log('play', { type });

      if (!utterance) {
        return enqueue.raise({
          type: 'ERROR',
          error: new Error('Missing utterance'),
        });
      }
      if (!voice) {
        return enqueue.raise({
          type: 'ERROR',
          error: new Error('Missing voice'),
        });
      }

      // TODO: remove this after debugging
      console.log('wolf A');

      let newUtterance: SpeechSynthesisUtterance | undefined;

      // TODO: completely reimplement / rework this
      if (type !== 'LOAD') {
        // TODO: remove this after debugging
        console.log('wolf B');

        const newTextSlice = text.split(' ').slice(wordIndex).join(' ');
        newUtterance = new SpeechSynthesisUtterance(
          newTextSlice.replace(/[^a-zA-Z\s]/g, '')
        );
        newUtterance.rate = rate;
        newUtterance.volume = volume;
        newUtterance.voice = voice;
      }

      // TODO: determine if this can be removed through proper finite states and transitions
      //// ---------------------------------------------------------------------
      speechSynthesis.cancel();
      //// ---------------------------------------------------------------------
      speechSynthesis.speak(newUtterance ?? utterance);
      speechSynthesis.resume();

      enqueue.assign({
        progress: wordIndex / length,
        utterance: newUtterance ?? utterance,
      });
    }),
    // TODO: completely reimplement / rework reload mechanism
    speedScrub: enqueueActions(
      ({ context, enqueue }, { value }: { value: number }) => {
        const { utterance } = context;

        if (utterance) {
          utterance.rate = value;
        }

        // TODO: completely reimplement / rework reload mechanism
        /*
          rateSubject$.next(value);
        */

        enqueue.assign({ rate: value });
      }
    ),
    setVoice: assign((_, { voice }: Omit<SetVoiceEvent, 'type'>) => ({
      voice,
    })),
    // TODO: completely reimplement / rework reload mechanism
    volumeScrub: enqueueActions(
      ({ context, enqueue }, { value }: { value: number }) => {
        const { utterance } = context;

        if (utterance) {
          utterance.volume = value;
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
  },
  actors: {
    // TODO: implement each of these
    /* boundary$ */
    scrub: scrubMachine,
    /* speedReload$ */
    /* volumeReload$ */
    voiceSelector: voiceSelectorMachine,
    // TODO: implement this
    /*
    boundary$: ({ utterance }): Observable<BoundaryEvent> => {
      // TODO: improve this error handling via `throwError`
      if (!utterance) throw new Error('Missing utterance');

      return fromUtteranceEvent(utterance, 'onboundary').pipe(
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
    hasVoice: ({ context }) => context.voice !== undefined,
    isSpeedScrub: (_, { id }: { id: string }) => id === ScrubKind.Speed,
    isVolumeScrub: (_, { id }: { id: string }) => id === ScrubKind.Volume,
    isWordScrub: (_, { id }: { id: string }) => id === ScrubKind.Word,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwA5jAYwBYGIDCAggHJ4CiAMgNoAMAuoqCgPawCWALq0wHYMgAeiAOxCANCACeiABwBGAHQBmAEzLpATgBsAVlWz1u2QF8j41Omw5yAeQIARGvSQhmbTjz6CEI8VITL1ABZ5dXU1OWpI7UVAoRMzNExcG3tKWSdGFg4uXmcvH0lEWSFFeVlqRW1pEtUYzWpA+JBzJJwAZTwAJQBVACFHPldsjzzEHWp5bVltetnqbUDpRV8ZCvlpTWUhHTlZZUC1JpbLDp7+9MGs91zQL01FBUDo2VlFUOklgJWEDXUyxSET2Umg0QlUyiOiROpAAKgB9ABq1gAkmQBs4htdPMIGvJItJtNQ9upqNU1N9QsFAntlLJNvMpiDIRYsPIAIYYTgANzA7S6fThbRhBE6MPRmTcOWxCBUpQMWlkByJ0way0KCCm0hCWwqm0CiyemmZSXZnNYPPasMRKLRdEukpGt0QKi18s0iuUysJgTVfk0gU0kw+DWo7up8zipmaUNZHO5YHkKAANmyJKxuFAcAAFAjdNqkcUuK5S0YIPZ7eQgyqera0-Tab7adRCeSBMLSKKKMlE43YU3xxMptMZnC9azdIh2EUATULmJLTrL1CEEyExTekQCbdD3zbWqbeyEM0Cy+0Il7sbNPMHqfTmc6FFsDjtGOLjoERVJpX0r0UAJJiwNuq+patsZ77E8Z4+vMF79uaCYoGyACusCQNm5AELOL4SsMNwfmWqh-IsFRvE2AJCOojaxJWmhgm2lQAgysFxvB8iwBgABOSEAEbcXefJnHOb54V4TYtielRBHqsgfLIu6LPIFEPBU1Rdk8kYJCycHXuxXG8fxpwCqQk5CQ6IkyNMeJEsCajKFMLzKFRWq-GETZbGE2wmFG3BMBAcB8McWD2rh0pfOqAC0RpRoF8isBASZgMFWKlp6CihiSrzEWSyi+hZrYkmCBLUDWGXMVeiWvmZoVHiETZhqlKo+t85YhB2AYUcCSzNlFmkmix15xQlSULvhLq1QqSovN6uX+NQfyKCR-r6iSMTNmVA7JreGbDe+XjlB8Si0YeHk6HSjbRK2dLSJ1dkiPs62sYhKGQDt5lln+EyaDoWwzA0OgzOd2ghHSIjSLEh5VA9OmcTxfHbZVIWlv6yiTISpIGPUMmUeqCx-KGQgbCUGj+sVXlGEAA */
  id: 'speech',

  context: ({ self, spawn }) => ({
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
  }),

  initial: 'idle',

  on: {
    CANCEL: {
      target: '.idle',
    },
    ERROR: {
      actions: {
        params: ({ event }) => ({ error: event.error }),
        type: 'logError',
      },
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
    SET_VOICE: {
      actions: {
        params: ({ event }) => ({ voice: event.voice }),
        type: 'setVoice',
      },
    },
  },

  states: {
    idle: {},

    active: {
      initial: 'playing',

      states: {
        // TODO: reevaluate 'active.idle' state
        idle: {},

        // TODO: maybe implement `exit` action?
        playing: {
          // TODO: implement this
          entry: {
            params: ({ event }) => ({ type: event.type }),
            type: 'play',
          },

          on: {
            BOUNDARY: {
              // TODO: implement this
              // actions: 'boundary',
            },
            PAUSE: {
              actions: 'cancel',
              target: 'paused',
            },
            RELOAD: {
              reenter: true,
              target: 'playing',
            },
          },

          // TODO: implement this
          /*
          invoke: [
            {
              src: 'boundary$',
              onDone: {
                target: 'idle',
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

        paused: {
          on: {
            PLAY: { target: 'playing' },
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
            SCRUB_END: {
              guard: {
                params: ({ event }) => ({ id: event.id }),
                type: 'isWordScrub',
              },
              target: 'playing',
            },
          },
        },
      },

      on: {
        SCRUB_START: [
          {
            // TODO: maybe remove this in favor of `.active.playing` `exit` action?
            actions: 'cancel',
            target: '.scrubbing',
            guard: {
              params: ({ event }) => ({ id: event.id }),
              type: 'isWordScrub',
            },
          },
        ],
        SET_VOICE: {
          target: '.playing',
          actions: {
            params: ({ event }) => ({ voice: event.voice }),
            type: 'setVoice',
          },
        },
      },
    },
  },
});

type SpeechActorRef = ActorRefFrom<typeof speechMachine>;
type SpeechActorSnapshot = SnapshotFrom<typeof speechMachine>;

export { speechMachine };

export type { SpeechActorRef, SpeechActorSnapshot };
