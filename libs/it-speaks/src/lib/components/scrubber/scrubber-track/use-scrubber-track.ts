import { useSelector } from '@xstate/react';
import { type Ref, useCallback, useMemo } from 'react';

import { cn } from '@folio/utils';

import type { ScrubActorRef } from '../../../actors';

export function useScrubberTrack(
  scrubActor: ScrubActorRef,
  ref?: Ref<HTMLDivElement>
) {
  const direction = useSelector(scrubActor, ({ context }) => context.direction);

  const trackClassName = useMemo(
    () =>
      cn(
        (direction === 'bottom-top' || direction === 'top-bottom') &&
          'bottom-0 left-1/2 h-full -translate-x-1/2',
        (direction === 'left-right' || direction === 'right-left') &&
          'top-1/2 left-0 w-full -translate-y-1/2',
        'absolute cursor-pointer overflow-hidden'
      ),
    [direction]
  );

  const setRef = useCallback(
    (scrubTrack: HTMLDivElement | null) => {
      if (scrubTrack !== null) scrubActor.send({ type: 'ATTACH', scrubTrack });

      if (typeof ref === 'function') ref(scrubTrack);
      // eslint-disable-next-line react-hooks/immutability
      else if (ref) ref.current = scrubTrack;

      return () => scrubActor.send({ type: 'DETACH' });
    },
    [ref, scrubActor]
  );

  return {
    setRef,
    trackClassName,
  };
}
