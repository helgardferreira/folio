import type { ComponentProps } from 'react';

import { cn } from '@folio/utils';

import { useScrubContext } from '../../../actors';

import { useScrubberHandle } from './use-scrubber-handle';

export type ScrubberHandleProps = ComponentProps<'div'>;

export function ScrubberHandle({
  className,
  style,
  ...props
}: ScrubberHandleProps) {
  const { scrubActor } = useScrubContext();
  const { handleClassName, handleStyle } = useScrubberHandle(scrubActor);

  return (
    <div
      className={cn(handleClassName, className)}
      style={{ ...handleStyle, ...style }}
      {...props}
    />
  );
}
