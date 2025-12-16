import { useSelector } from '@xstate/react';
import { type CSSProperties, useMemo } from 'react';

import { useScrubberContext } from '../use-scrubber-context';

export function useScrubberProgress() {
  const { scrubActor } = useScrubberContext();

  const direction = useSelector(
    scrubActor,
    (snapshot) => snapshot.context.direction
  );
  const percentage = useSelector(
    scrubActor,
    (snapshot) => snapshot.context.percentage
  );

  const transformStyle = useMemo<CSSProperties>(
    () =>
      direction === 'bottom-top' || direction === 'top-bottom'
        ? { height: `${percentage}%` }
        : { width: `${percentage}%` },
    [direction, percentage]
  );

  return {
    direction,
    transformStyle,
  };
}
