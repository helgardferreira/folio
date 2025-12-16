import { useSelector } from '@xstate/react';
import { useCallback } from 'react';

import { cn } from '@folio/utils';

import { useSpeechContext } from '../../../../../actors';

type SpeedMultiplierButtonProps = {
  multiplier: number;
};

export function SpeedMultiplierButton({
  multiplier,
}: SpeedMultiplierButtonProps) {
  const { speedScrubActor } = useSpeechContext();

  const formattedMultiplier = multiplier.toFixed(2);

  const currentMultiplier = useSelector(speedScrubActor, (snapshot) =>
    snapshot.context.value.toFixed(2)
  );

  const isActive = currentMultiplier === formattedMultiplier;

  const handleClick = useCallback(
    () => speedScrubActor.send({ type: 'SET_VALUE', value: multiplier }),
    [multiplier, speedScrubActor]
  );

  return (
    <button
      className={cn(
        'btn btn-xs btn-outline btn-primary',
        isActive && 'btn-active'
      )}
      onClick={handleClick}
    >
      {formattedMultiplier}x
    </button>
  );
}
