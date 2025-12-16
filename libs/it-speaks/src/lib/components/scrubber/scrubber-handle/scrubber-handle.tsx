import type { ComponentProps } from 'react';

import { cn } from '@folio/utils';

import { useScrubberContext } from '../use-scrubber-context';

import { useScrubberHandle } from './use-scrubber-handle';

export type ScrubberHandleProps = ComponentProps<'div'>;

export function ScrubberHandle({
  className,
  style,
  ...props
}: ScrubberHandleProps) {
  const { scrubActor } = useScrubberContext();
  const { direction, transformStyle } = useScrubberHandle(scrubActor);

  return (
    <div
      className={cn(
        direction === 'bottom-top' &&
          'left-1/2 -translate-x-1/2 translate-y-1/2',
        direction === 'left-right' &&
          'top-1/2 -translate-x-1/2 -translate-y-1/2',
        direction === 'right-left' &&
          'top-1/2 translate-x-1/2 -translate-y-1/2',
        direction === 'top-bottom' &&
          'left-1/2 -translate-x-1/2 -translate-y-1/2',
        'absolute rounded-full select-none group-aria-disabled:opacity-0',
        className
      )}
      style={{ ...transformStyle, ...style }}
      {...props}
    />
  );
}
