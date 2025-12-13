import { useSelector } from '@xstate/react';
import { type CSSProperties, useMemo } from 'react';

import { cn } from '@folio/utils';

import { type ScrubActorRef } from '../../../actors';

export function useScrubberHandle(scrubActor: ScrubActorRef) {
  const direction = useSelector(
    scrubActor,
    (snapshot) => snapshot.context.direction
  );
  const percentage = useSelector(
    scrubActor,
    (snapshot) => snapshot.context.percentage
  );
  const scrubTrackRect = useSelector(
    scrubActor,
    (snapshot) => snapshot.context.scrubTrackRect
  );

  const handleClassName = useMemo(
    () =>
      cn(
        direction === 'bottom-top' &&
          'left-1/2 -translate-x-1/2 translate-y-1/2',
        direction === 'left-right' &&
          'top-1/2 -translate-x-1/2 -translate-y-1/2',
        direction === 'right-left' &&
          'top-1/2 translate-x-1/2 -translate-y-1/2',
        direction === 'top-bottom' &&
          'left-1/2 -translate-x-1/2 -translate-y-1/2',
        'absolute cursor-pointer rounded-full select-none'
      ),
    [direction]
  );

  const handleStyle = useMemo<CSSProperties>(() => {
    const scrubTrackOffset = scrubTrackRect?.offset ?? {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    };

    switch (direction) {
      case 'bottom-top': {
        return {
          bottom: `${percentage}%`,
          transform: `translate3d(0, calc((${percentage} / 100 * ${scrubTrackOffset.top}px) + (${percentage} / 100 * ${scrubTrackOffset.bottom}px) - ${scrubTrackOffset.bottom}px), 0)`,
        };
      }
      case 'left-right': {
        return {
          left: `${percentage}%`,
          transform: `translate3d(calc(${scrubTrackOffset.left}px - (${percentage} / 100 * ${scrubTrackOffset.right}px) - (${percentage} / 100 * ${scrubTrackOffset.left}px)), 0, 0)`,
        };
      }
      case 'right-left': {
        return {
          right: `${percentage}%`,
          transform: `translate3d(calc((${percentage} / 100 * ${scrubTrackOffset.left}px) + (${percentage} / 100 * ${scrubTrackOffset.right}px) - ${scrubTrackOffset.right}px), 0, 0)`,
        };
      }
      case 'top-bottom': {
        return {
          top: `${percentage}%`,
          transform: `translate3d(0, calc(${scrubTrackOffset.top}px - (${percentage} / 100 * ${scrubTrackOffset.bottom}px) - (${percentage} / 100 * ${scrubTrackOffset.top}px)), 0)`,
        };
      }
    }
  }, [direction, percentage, scrubTrackRect?.offset]);

  return {
    handleClassName,
    handleStyle,
  };
}
