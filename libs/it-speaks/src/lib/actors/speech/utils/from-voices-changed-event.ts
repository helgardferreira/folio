import { Observable } from 'rxjs';

import { getLocalVoices } from './get-local-voices';

export const fromVoicesChangedEvent = () =>
  new Observable<SpeechSynthesisVoice[]>((subscriber) => {
    const handleVoicesChanged = (_: Event) => {
      subscriber.next(getLocalVoices());
    };

    speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  });
