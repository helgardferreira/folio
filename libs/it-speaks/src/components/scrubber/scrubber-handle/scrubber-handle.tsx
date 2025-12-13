import { useSelector } from '@xstate/react';
import { type CSSProperties, type ComponentProps, useMemo } from 'react';

import { cn } from '@folio/utils';

import { useScrubContext } from '../../../lib/actors';

type ScrubberHandleProps = ComponentProps<'div'>;

export function ScrubberHandle({
  className,
  style,
  ...props
}: ScrubberHandleProps) {
  const { scrubActor } = useScrubContext();

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

  const transformStyles = useMemo<CSSProperties>(() => {
    const scrubTrackOffset = scrubTrackRect?.offset ?? {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    };

    switch (direction) {
      case 'bottom-top': {
        return {
          transform: `translate3d(0, calc((${percentage} / 100 * ${scrubTrackOffset.top}px) + (${percentage} / 100 * ${scrubTrackOffset.bottom}px) - ${scrubTrackOffset.bottom}px), 0)`,
          bottom: `${percentage}%`,
        };
      }
      case 'left-right': {
        return {
          transform: `translate3d(calc(${scrubTrackOffset.left}px - (${percentage} / 100 * ${scrubTrackOffset.right}px) - (${percentage} / 100 * ${scrubTrackOffset.left}px)), 0, 0)`,
          left: `${percentage}%`,
        };
      }
      case 'right-left': {
        return {
          transform: `translate3d(calc((${percentage} / 100 * ${scrubTrackOffset.left}px) + (${percentage} / 100 * ${scrubTrackOffset.right}px) - ${scrubTrackOffset.right}px), 0, 0)`,
          right: `${percentage}%`,
        };
      }
      case 'top-bottom': {
        return {
          transform: `translate3d(0, calc(${scrubTrackOffset.top}px - (${percentage} / 100 * ${scrubTrackOffset.bottom}px) - (${percentage} / 100 * ${scrubTrackOffset.top}px)), 0)`,
          top: `${percentage}%`,
        };
      }
    }
  }, [direction, percentage, scrubTrackRect?.offset]);

  return (
    <div
      {...props}
      className={cn(
        direction === 'bottom-top' &&
          'left-1/2 -translate-x-1/2 translate-y-1/2',
        direction === 'left-right' &&
          'top-1/2 -translate-x-1/2 -translate-y-1/2',
        direction === 'right-left' &&
          'top-1/2 translate-x-1/2 -translate-y-1/2',
        direction === 'top-bottom' &&
          'left-1/2 -translate-x-1/2 -translate-y-1/2',
        'absolute cursor-pointer rounded-full select-none',
        className
      )}
      style={{ ...style, ...transformStyles }}
    />
  );
}
