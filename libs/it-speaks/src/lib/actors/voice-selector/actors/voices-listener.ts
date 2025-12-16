import { map, startWith } from 'rxjs';
import { type ActorRefFrom, fromEventObservable } from 'xstate';

import type { EventObservableCreator } from '@folio/actors';

import type { SetVoicesEvent } from '../types';
import { fromVoicesChangedEvent, getLocalVoices } from '../utils';

const voicesListener: EventObservableCreator<SetVoicesEvent> = () =>
  fromVoicesChangedEvent().pipe(
    startWith(getLocalVoices()),
    map<SpeechSynthesisVoice[], SetVoicesEvent>((voices) => ({
      type: 'SET_VOICES',
      voices,
    }))
  );

export const voicesListenerLogic = fromEventObservable(voicesListener);

export type VoicesListenerActorRef = ActorRefFrom<typeof voicesListenerLogic>;
