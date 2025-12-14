import { useActorRef } from '@xstate/react';
import {
  type PropsWithChildren,
  createContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';

import { type ScrubActorRef, scrubMachine } from './scrub.machine';
import type {
  ScrubDirection,
  ScrubEmittedEvent,
  ScrubEndEmittedEvent,
  ScrubStartEmittedEvent,
} from './types';

export type ScrubContextValue = {
  scrubActor: ScrubActorRef;
};

export const ScrubContext = createContext<ScrubContextValue | null>(null);

type ScrubProviderProps = PropsWithChildren<{
  direction: ScrubDirection;
  id: string;
  initialValue?: number;
  max?: number;
  min?: number;
  onScrub?: (event: ScrubEmittedEvent) => void;
  onScrubEnd?: (event: ScrubEndEmittedEvent) => void;
  onScrubStart?: (event: ScrubStartEmittedEvent) => void;
}>;

export function ScrubProvider({
  children,
  direction,
  id,
  initialValue,
  max,
  min,
  onScrub,
  onScrubEnd,
  onScrubStart,
}: ScrubProviderProps) {
  const onScrubRef = useRef(onScrub);
  const onScrubEndRef = useRef(onScrubEnd);
  const onScrubStartRef = useRef(onScrubStart);

  useLayoutEffect(() => {
    onScrubRef.current = onScrub;
  }, [onScrub]);
  useLayoutEffect(() => {
    onScrubEndRef.current = onScrubEnd;
  }, [onScrubEnd]);
  useLayoutEffect(() => {
    onScrubStartRef.current = onScrubStart;
  }, [onScrubStart]);

  const scrubActor = useActorRef(scrubMachine, {
    input: { direction, initialValue, max, min },
    id,
  });

  useEffect(() => {
    const scrubSub = scrubActor.on('SCRUB', (event) =>
      onScrubRef.current?.(event)
    );
    const scrubEndSub = scrubActor.on('SCRUB_END', (event) =>
      onScrubEndRef.current?.(event)
    );
    const scrubStartSub = scrubActor.on('SCRUB_START', (event) =>
      onScrubStartRef.current?.(event)
    );

    return () => {
      scrubSub.unsubscribe();
      scrubEndSub.unsubscribe();
      scrubStartSub.unsubscribe();
    };
  }, [scrubActor]);

  return (
    <ScrubContext.Provider value={{ scrubActor }}>
      {children}
    </ScrubContext.Provider>
  );
}
