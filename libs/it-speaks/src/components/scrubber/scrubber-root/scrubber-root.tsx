import { useSelector } from '@xstate/react';
import { type ComponentProps, type PointerEvent, useCallback } from 'react';

import { cn } from '@folio/utils';

import {
  type ScrubDirection,
  ScrubProvider,
  useScrubContext,
} from '../../../lib/actors';

type ScrubberRootImplProps = Omit<
  ComponentProps<'div'>,
  | 'aria-label'
  | 'aria-valuemax'
  | 'aria-valuemin'
  | 'aria-valuenow'
  | 'aria-valuetext'
  | 'role'
> & {
  label: string;
  max?: number;
  min?: number;
};

function ScrubberRootImpl({
  children,
  className,
  label,
  max,
  min,
  onPointerDown,
  ...props
}: ScrubberRootImplProps) {
  const { scrubActor } = useScrubContext();

  const value = useSelector(scrubActor, (snapshot) => snapshot.context.value);

  const handleScrubStart = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(event);
      scrubActor.send({
        type: 'SCRUB_START',
        clientX: event.clientX,
        clientY: event.clientY,
      });
    },
    [onPointerDown, scrubActor]
  );

  return (
    <div
      {...props}
      aria-label={label}
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={value}
      className={cn(
        'relative z-10 cursor-pointer touch-none overflow-visible',
        className
      )}
      onPointerDown={handleScrubStart}
      role="slider"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

type ScrubberRootProps = ScrubberRootImplProps & {
  direction: ScrubDirection;
  initialValue?: number;
};

export function ScrubberRoot({
  direction,
  initialValue,
  max,
  min,
  ...props
}: ScrubberRootProps) {
  return (
    <ScrubProvider
      direction={direction}
      initialValue={initialValue}
      max={max}
      min={min}
    >
      <ScrubberRootImpl max={max} min={min} {...props} />
    </ScrubProvider>
  );
}
