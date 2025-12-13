import type { ComponentProps } from 'react';

import { cn } from '@folio/utils';

import { useScrubContext } from '../../../actors';

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
  const { scrubActor } = useScrubContext();
  const { handleScrubStart, max, min, panelClassName, value } =
    useScrubberPanel(scrubActor, onPointerDown);

  return (
    <div
      aria-label={label}
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={value}
      className={cn(panelClassName, className)}
      onPointerDown={handleScrubStart}
      role="slider"
      tabIndex={0}
      {...props}
    />
  );
}
