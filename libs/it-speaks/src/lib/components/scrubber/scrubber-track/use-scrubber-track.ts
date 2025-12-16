import { useSelector } from '@xstate/react';
import { type Ref, useCallback } from 'react';

import type { ScrubActorRef } from '../../../actors';

export function useScrubberTrack(
  scrubActor: ScrubActorRef,
  ref?: Ref<HTMLDivElement>
) {
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
