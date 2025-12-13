import { useContext } from 'react';

import { ScrubContext, type ScrubContextValue } from './scrub-provider';

export function useScrubContext(): ScrubContextValue {
  const context = useContext(ScrubContext);

  if (context === null) {
    throw new Error('useScrubContext must be used within a ScrubberRoot');
  }

  return context;
}
