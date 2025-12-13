import { useActorRef } from '@xstate/react';
import { type PropsWithChildren, createContext } from 'react';

import { type ScrubActorRef, scrubMachine } from './scrub.machine';
import type { ScrubDirection } from './types';

export type ScrubContextValue = {
  scrubActor: ScrubActorRef;
};

export const ScrubContext = createContext<ScrubContextValue | null>(null);

type ScrubProviderProps = PropsWithChildren<{
  direction: ScrubDirection;
  initialValue?: number;
  max?: number;
  min?: number;
}>;

export function ScrubProvider({
  children,
  direction,
  initialValue,
  max,
  min,
}: ScrubProviderProps) {
  const scrubActor = useActorRef(scrubMachine, {
    input: { direction, initialValue, max, min },
  });

  return (
    <ScrubContext.Provider
      value={{
        scrubActor,
      }}
    >
      {children}
    </ScrubContext.Provider>
  );
}
