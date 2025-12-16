import { useSelector } from '@xstate/react';
import { type Ref, useCallback } from 'react';

import { useScrubberContext } from '../use-scrubber-context';

export function useScrubberTrack(ref: Ref<HTMLDivElement> | undefined) {
  const { scrubActor } = useScrubberContext();

  const direction = useSelector(
    scrubActor,
    (snapshot) => snapshot.context.direction
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
    direction,
    setRef,
  };
}
