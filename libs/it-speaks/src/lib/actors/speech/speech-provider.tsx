import { useActorRef, useSelector } from '@xstate/react';
import { type PropsWithChildren, createContext } from 'react';

import type { ScrubActorRef } from '../scrub/scrub.machine';
import type { VoiceSelectorActorRef } from '../voice-selector/voice-selector.machine';

import { type SpeechActorRef, speechMachine } from './speech.machine';

export type SpeechContextValue = {
  speechActor: SpeechActorRef;
  speedScrubActor: ScrubActorRef;
  voiceSelectorActor: VoiceSelectorActorRef;
  volumeScrubActor: ScrubActorRef;
  wordScrubActor: ScrubActorRef;
};

export const SpeechContext = createContext<SpeechContextValue | null>(null);

export function SpeechProvider({ children }: PropsWithChildren) {
  const speechActor = useActorRef(speechMachine);

  const speedScrubActor = useSelector(
    speechActor,
    (snapshot) => snapshot.context.speedScrubActor
  );
  const voiceSelectorActor = useSelector(
    speechActor,
    (snapshot) => snapshot.context.voiceSelectorActor
  );
  const volumeScrubActor = useSelector(
    speechActor,
    (snapshot) => snapshot.context.volumeScrubActor
  );
  const wordScrubActor = useSelector(
    speechActor,
    (snapshot) => snapshot.context.wordScrubActor
  );

  return (
    <SpeechContext.Provider
      value={{
        speechActor,
        speedScrubActor,
        voiceSelectorActor,
        volumeScrubActor,
        wordScrubActor,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
}
