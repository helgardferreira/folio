import { useSelector } from '@xstate/react';
import { type CSSProperties, type ComponentProps, useMemo } from 'react';

import { cn } from '@folio/utils';

import { useScrubContext } from '../../../lib/actors';

type ScrubberProgressProps = ComponentProps<'div'>;

export function ScrubberProgress({
  className,
  style,
  ...props
}: ScrubberProgressProps) {
  const { scrubActor } = useScrubContext();

  const direction = useSelector(scrubActor, ({ context }) => context.direction);
  const percentage = useSelector(
    scrubActor,
    ({ context }) => context.percentage
  );

  const transformStyles = useMemo<CSSProperties>(
    () =>
      direction === 'bottom-top' || direction === 'top-bottom'
        ? { height: `${percentage}%` }
        : { width: `${percentage}%` },
    [direction, percentage]
  );

  return (
    <div
      {...props}
      className={cn(
        (direction === 'bottom-top' || direction === 'top-bottom') &&
          'left-1/2 w-full -translate-x-1/2',
        (direction === 'left-right' || direction === 'right-left') &&
          'top-1/2 h-full -translate-y-1/2',
        direction === 'bottom-top' && 'bottom-0',
        direction === 'left-right' && 'left-0',
        direction === 'right-left' && 'right-0',
        direction === 'top-bottom' && 'top-0',
        'absolute',
        className
      )}
      style={{ ...style, ...transformStyles }}
    />
  );
}
