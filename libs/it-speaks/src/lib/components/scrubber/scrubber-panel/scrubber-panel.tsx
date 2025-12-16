import type { ComponentProps } from 'react';

import { cn } from '@folio/utils';

import { useScrubberContext } from '../use-scrubber-context';

import { useScrubberPanel } from './use-scrubber-panel';

export type ScrubberPanelProps = Omit<
  ComponentProps<'div'>,
  | 'aria-label'
  | 'aria-valuemax'
  | 'aria-valuemin'
  | 'aria-valuenow'
  | 'aria-valuetext'
  | 'role'
> & { label: string };

export function ScrubberPanel({
  className,
  label,
  onPointerDown,
  ...props
}: ScrubberPanelProps) {
  const { scrubActor } = useScrubberContext();
  const { disabled, handleScrubStart, max, min, tabIndex, value } =
    useScrubberPanel(scrubActor, onPointerDown);

  return (
    <div
      aria-disabled={disabled}
      aria-label={label}
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={value}
      className={cn(
        'group focus-visible:outline-primary relative z-1 cursor-pointer touch-none overflow-visible focus-visible:outline-2 aria-disabled:cursor-default',
        className
      )}
      onPointerDown={handleScrubStart}
      role="slider"
      tabIndex={tabIndex}
      {...props}
    />
  );
}
