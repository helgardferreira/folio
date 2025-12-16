import { useSelector } from '@xstate/react';
import { type KeyboardEvent, useCallback } from 'react';

import { useSpeechContext } from '../../../../../actors';

import { VoiceListItem } from './voice-list-item/voice-list-item';

export function VoiceList() {
  const { voiceSelectorActor } = useSpeechContext();

  const activeId = useSelector(
    voiceSelectorActor,
    (snapshot) => snapshot.context.activeVoiceItem?.id
  );
  const voiceItems = useSelector(
    voiceSelectorActor,
    (snapshot) => snapshot.context.voiceItems
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLUListElement>) => {
      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          voiceSelectorActor.send({ type: 'MOVE_DOWN' });
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          voiceSelectorActor.send({ type: 'MOVE_UP' });
          break;
        }
        case 'Home': {
          event.preventDefault();
          voiceSelectorActor.send({ type: 'MOVE_FIRST' });
          break;
        }
        case 'End': {
          event.preventDefault();
          voiceSelectorActor.send({ type: 'MOVE_LAST' });
          break;
        }
        case 'Enter':
        case ' ': {
          event.preventDefault();
          voiceSelectorActor.send({ type: 'SELECT' });
          break;
        }
      }
    },
    [voiceSelectorActor]
  );

  return (
    <ul
      aria-activedescendant={activeId}
      aria-label="Choose a voice"
      className="list outline-primary h-full w-full overflow-y-auto rounded-sm p-2 focus-visible:outline-2"
      id="voice-list"
      onKeyDown={handleKeyDown}
      role="listbox"
      tabIndex={0}
    >
      {voiceItems.map((voiceItem) => (
        <VoiceListItem key={voiceItem.id} voiceItem={voiceItem} />
      ))}
    </ul>
  );
}
