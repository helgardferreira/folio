import type { ComponentProps } from 'react';

import { cn } from '@folio/utils';

import { useScrubberTrack } from './use-scrubber-track';

export type ScrubberTrackProps = ComponentProps<'div'>;

export function ScrubberTrack({
  className,
  ref,
  ...props
}: ScrubberTrackProps) {
  const { direction, setRef } = useScrubberTrack(ref);

  return (
    <div
      className={cn(
        (direction === 'bottom-top' || direction === 'top-bottom') &&
          'bottom-0 left-1/2 h-full -translate-x-1/2',
        (direction === 'left-right' || direction === 'right-left') &&
          'top-1/2 left-0 w-full -translate-y-1/2',
        'group-aria-disabled:bg-base-content/10 absolute overflow-hidden',
        className
      )}
      ref={setRef}
      {...props}
    />
  );
}
