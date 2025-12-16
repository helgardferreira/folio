import type { ComponentProps } from 'react';

import { cn } from '@folio/utils';

import { useScrubberContext } from '../use-scrubber-context';

import { useScrubberProgress } from './use-scrubber-progress';

export type ScrubberProgressProps = ComponentProps<'div'>;

export function ScrubberProgress({
  className,
  style,
  ...props
}: ScrubberProgressProps) {
  const { scrubActor } = useScrubberContext();
  const { direction, transformStyle } = useScrubberProgress(scrubActor);

  return (
    <div
      className={cn(
        (direction === 'bottom-top' || direction === 'top-bottom') &&
          'left-1/2 w-full -translate-x-1/2',
        (direction === 'left-right' || direction === 'right-left') &&
          'top-1/2 h-full -translate-y-1/2',
        direction === 'bottom-top' && 'bottom-0',
        direction === 'left-right' && 'left-0',
        direction === 'right-left' && 'right-0',
        direction === 'top-bottom' && 'top-0',
        'group-aria-disabled:bg-base-content/10 absolute',
        className
      )}
      style={{ ...transformStyle, ...style }}
      {...props}
    />
  );
}
