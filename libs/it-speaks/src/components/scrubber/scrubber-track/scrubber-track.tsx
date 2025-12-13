import { useSelector } from '@xstate/react';
import { type ComponentProps, useCallback } from 'react';

import { cn } from '@folio/utils';

import { useScrubContext } from '../../../lib/actors';

type ScrubberTrackProps = ComponentProps<'div'>;

export function ScrubberTrack({
  children,
  className,
  ref,
  ...props
}: ScrubberTrackProps) {
  const { scrubActor } = useScrubContext();

  const direction = useSelector(scrubActor, ({ context }) => context.direction);

  const setRef = useCallback(
    (scrubTrack: HTMLDivElement | null) => {
      if (scrubTrack !== null) scrubActor.send({ type: 'ATTACH', scrubTrack });

      if (typeof ref === 'function') ref(scrubTrack);
      else if (ref) ref.current = scrubTrack;

      return () => scrubActor.send({ type: 'DETACH' });
    },
    [ref, scrubActor]
  );

  return (
    <div
      {...props}
      className={cn(
        (direction === 'bottom-top' || direction === 'top-bottom') &&
          'bottom-0 left-1/2 h-full -translate-x-1/2',
        (direction === 'left-right' || direction === 'right-left') &&
          'top-1/2 left-0 w-full -translate-y-1/2',
        'absolute cursor-pointer overflow-hidden',
        className
      )}
      ref={setRef}
    >
      {children}
    </div>
  );
}
