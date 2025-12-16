import { map, startWith } from 'rxjs';
import { type ActorRefFrom, fromEventObservable } from 'xstate';

import type { EventObservableCreator } from '@folio/actors';

import type { VoicesChangedEvent } from '../types';
import { fromVoicesChangedEvent, getLocalVoices } from '../utils';

const voicesListener: EventObservableCreator<VoicesChangedEvent> = () =>
  fromVoicesChangedEvent().pipe(
    startWith(getLocalVoices()),
    map<SpeechSynthesisVoice[], VoicesChangedEvent>((voices) => ({
      type: 'VOICES_CHANGED',
      voices,
    }))
  );

export const voicesListenerLogic = fromEventObservable(voicesListener);

export type VoicesListenerActorRef = ActorRefFrom<typeof voicesListenerLogic>;
