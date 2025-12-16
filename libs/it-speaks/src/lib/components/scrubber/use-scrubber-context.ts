import { useContext } from 'react';

import { ScrubberContext, type ScrubberContextValue } from './scrubber-context';

export function useScrubberContext(): ScrubberContextValue {
  const context = useContext(ScrubberContext);

  if (context === null) {
    throw new Error('useScrubberContext must be used within a ScrubberRoot');
  }

  return context;
}
