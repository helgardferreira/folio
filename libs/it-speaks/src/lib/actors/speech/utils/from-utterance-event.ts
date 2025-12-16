import { Observable } from 'rxjs';

export function fromUtteranceEvent<
  K extends keyof SpeechSynthesisUtteranceEventMap,
>(
  utterance: SpeechSynthesisUtterance,
  eventName: K
): Observable<SpeechSynthesisUtteranceEventMap[K]> {
  return new Observable<SpeechSynthesisUtteranceEventMap[K]>((subscriber) => {
    const handleEvent = (event: SpeechSynthesisUtteranceEventMap[K]) =>
      subscriber.next(event);

    utterance.addEventListener(eventName, handleEvent);

    return () => utterance.removeEventListener(eventName, handleEvent);
  });
}
