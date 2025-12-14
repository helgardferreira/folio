import { useContext } from 'react';

import { SpeechContext, type SpeechContextValue } from './speech-provider';

export function useSpeechContext(): SpeechContextValue {
  const context = useContext(SpeechContext);

  if (context === null) {
    throw new Error('useSpeechContext must be used within a SpeechProvider');
  }

  return context;
}
