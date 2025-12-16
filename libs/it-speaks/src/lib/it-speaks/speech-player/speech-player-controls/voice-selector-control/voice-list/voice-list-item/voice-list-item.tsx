import { useSelector } from '@xstate/react';
import { useCallback, useLayoutEffect, useRef } from 'react';

import { cn } from '@folio/utils';

import { type VoiceItem, useSpeechContext } from '../../../../../../actors';

type VoiceListItemProps = {
  voiceItem: VoiceItem;
};

export function VoiceListItem({ voiceItem }: VoiceListItemProps) {
  const ref = useRef<HTMLLIElement>(null);
  const { voiceSelectorActor } = useSpeechContext();

  const activeId = useSelector(
    voiceSelectorActor,
    (snapshot) => snapshot.context.activeVoiceItem?.id
  );
  const selectedId = useSelector(
    voiceSelectorActor,
    (snapshot) => snapshot.context.selectedVoiceItem?.id
  );

  const isActive = activeId === voiceItem.id;
  const isSelected = selectedId === voiceItem.id;

  useLayoutEffect(() => {
    if (!isActive) return;

    ref.current?.scrollIntoView({ block: 'nearest' });
  }, [isActive]);

  const handleClick = useCallback(
    () => voiceSelectorActor.send({ type: 'SELECT', id: voiceItem.id }),
    [voiceItem.id, voiceSelectorActor]
  );

  return (
    <li
      aria-selected={isSelected}
      className={cn(
        'list-row hover:bg-primary-content hover:text-primary cursor-pointer',
        isActive && 'outline-primary outline-2 -outline-offset-2',
        isSelected && 'bg-primary-content hover:bg-primary-content text-primary'
      )}
      id={voiceItem.id}
      ref={ref}
      role="option"
      onClick={handleClick}
    >
      <div>
        <img
          alt={voiceItem.regionName}
          className="rounded-box size-10"
          src={voiceItem.flagUrl}
        />
      </div>

      <div className="overflow-hidden">
        <p className="truncate font-semibold">{voiceItem.voiceName}</p>
        <p className="truncate text-xs">{voiceItem.languageName}</p>
      </div>
    </li>
  );
}
