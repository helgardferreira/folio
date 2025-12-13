import type { ComponentProps } from 'react';

import { cn } from '@folio/utils';

import { useScrubContext } from '../../../actors';

import { useScrubberProgress } from './use-scrubber-progress';

export type ScrubberProgressProps = ComponentProps<'div'>;

export function ScrubberProgress({
  className,
  style,
  ...props
}: ScrubberProgressProps) {
  const { scrubActor } = useScrubContext();
  const { progressClassName, progressStyle } = useScrubberProgress(scrubActor);

  return (
    <div
      className={cn(progressClassName, className)}
      style={{ ...progressStyle, ...style }}
      {...props}
    />
  );
}
