import { map, merge, switchMap, takeUntil, throwError } from 'rxjs';
import { type ActorRefFrom, fromEventObservable } from 'xstate';

import type { EventObservableCreator } from '@folio/actors';

import type { BoundaryEvent } from '../types';
import { fromUtteranceEvent } from '../utils';

type UtteranceListenerActorInput = {
  utterance: SpeechSynthesisUtterance | undefined;
};

const utteranceListener: EventObservableCreator<
  BoundaryEvent,
  UtteranceListenerActorInput
> = ({ input: { utterance } }) => {
  if (utterance === undefined) {
    return throwError(() => new Error('Missing utterance'));
  }

  return merge(
    fromUtteranceEvent(utterance, 'boundary').pipe(
      map<SpeechSynthesisEvent, BoundaryEvent>(() => ({ type: 'BOUNDARY' }))
    ),
    fromUtteranceEvent(utterance, 'error').pipe(
      switchMap((event) =>
        throwError(
          () =>
            new Error(
              `An error has occurred with the speech synthesis: ${event.error}`
            )
        )
      )
    )
  ).pipe(takeUntil(fromUtteranceEvent(utterance, 'end')));
};

export const utteranceListenerLogic = fromEventObservable(utteranceListener);

export type UtteranceListenerActorRef = ActorRefFrom<
  typeof utteranceListenerLogic
>;
