import { useSelector } from '@xstate/react';
import { type CSSProperties, useMemo } from 'react';

import type { ScrubActorRef } from '../../../actors';

export function useScrubberProgress(scrubActor: ScrubActorRef) {
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
