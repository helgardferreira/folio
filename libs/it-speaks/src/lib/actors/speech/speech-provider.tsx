import { useActorRef } from '@xstate/react';
import { type PropsWithChildren, createContext } from 'react';

import { type SpeechActorRef, speechMachine } from './speech.machine';

export type SpeechContextValue = {
  speechActor: SpeechActorRef;
};

export const SpeechContext = createContext<SpeechContextValue | null>(null);

export function SpeechProvider({ children }: PropsWithChildren) {
  const speechActor = useActorRef(speechMachine);

  return (
    <SpeechContext.Provider value={{ speechActor }}>
      {children}
    </SpeechContext.Provider>
  );
}
