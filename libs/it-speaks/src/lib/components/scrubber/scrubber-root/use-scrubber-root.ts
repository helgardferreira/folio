import { useEffect, useLayoutEffect, useRef } from 'react';

import type {
  ScrubActorRef,
  ScrubEmittedEvent,
  ScrubEndEmittedEvent,
  ScrubStartEmittedEvent,
} from '../../../actors';

type UseScrubberRootOptions = {
  onScrub: ((event: ScrubEmittedEvent) => void) | undefined;
  onScrubEnd: ((event: ScrubEndEmittedEvent) => void) | undefined;
  onScrubStart: ((event: ScrubStartEmittedEvent) => void) | undefined;
  scrubActor: ScrubActorRef;
};

export function useScrubberRoot({
  onScrub,
  onScrubEnd,
  onScrubStart,
  scrubActor,
}: UseScrubberRootOptions) {
  const onScrubRef = useRef(onScrub);
  const onScrubEndRef = useRef(onScrubEnd);
  const onScrubStartRef = useRef(onScrubStart);

  useLayoutEffect(() => {
    onScrubRef.current = onScrub;
    onScrubEndRef.current = onScrubEnd;
    onScrubStartRef.current = onScrubStart;
  }, [onScrub, onScrubEnd, onScrubStart]);

  useEffect(() => {
    const scrubSub = scrubActor.on('SCRUB', (event) =>
      onScrubRef.current?.(event)
    );
    const scrubEndSub = scrubActor.on('SCRUB_END', (event) =>
      onScrubEndRef.current?.(event)
    );
    const scrubStartSub = scrubActor.on('SCRUB_START', (event) =>
      onScrubStartRef.current?.(event)
    );

    return () => {
      scrubSub.unsubscribe();
      scrubEndSub.unsubscribe();
      scrubStartSub.unsubscribe();
    };
  }, [scrubActor]);
}
