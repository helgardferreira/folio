import { useSelector } from '@xstate/react';
import { type CSSProperties, useMemo } from 'react';

import { cn } from '@folio/utils';

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

  const progressClassName = useMemo(
    () =>
      cn(
        (direction === 'bottom-top' || direction === 'top-bottom') &&
          'left-1/2 w-full -translate-x-1/2',
        (direction === 'left-right' || direction === 'right-left') &&
          'top-1/2 h-full -translate-y-1/2',
        direction === 'bottom-top' && 'bottom-0',
        direction === 'left-right' && 'left-0',
        direction === 'right-left' && 'right-0',
        direction === 'top-bottom' && 'top-0',
        'absolute'
      ),
    [direction]
  );

  const progressStyle = useMemo<CSSProperties>(
    () =>
      direction === 'bottom-top' || direction === 'top-bottom'
        ? { height: `${percentage}%` }
        : { width: `${percentage}%` },
    [direction, percentage]
  );

  return {
    progressClassName,
    progressStyle,
  };
}
