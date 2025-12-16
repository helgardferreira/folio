import { createContext } from 'react';

import type { ScrubActorRef } from '../../actors';

export type ScrubberContextValue = {
  scrubActor: ScrubActorRef;
};

export const ScrubberContext = createContext<ScrubberContextValue | null>(null);
