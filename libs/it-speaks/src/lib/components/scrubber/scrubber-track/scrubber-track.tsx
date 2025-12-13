import type { ComponentProps } from 'react';

import { cn } from '@folio/utils';

import { useScrubContext } from '../../../actors';

import { useScrubberTrack } from './use-scrubber-track';

export type ScrubberTrackProps = ComponentProps<'div'>;

export function ScrubberTrack({
  className,
  ref,
  ...props
}: ScrubberTrackProps) {
  const { scrubActor } = useScrubContext();
  const { setRef, trackClassName } = useScrubberTrack(scrubActor, ref);

  return (
    <div className={cn(trackClassName, className)} ref={setRef} {...props} />
  );
}
