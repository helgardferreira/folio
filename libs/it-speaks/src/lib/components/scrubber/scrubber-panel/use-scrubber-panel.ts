import { useSelector } from '@xstate/react';
import {
  type PointerEvent,
  type PointerEventHandler,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react';

import { type ScrubActorRef } from '../../../actors';

export function useScrubberPanel(
  scrubActor: ScrubActorRef,
  onPointerDown?: PointerEventHandler<HTMLDivElement>
) {
  const onPointerDownRef =
    useRef<PointerEventHandler<HTMLDivElement>>(onPointerDown);

  useLayoutEffect(() => {
    onPointerDownRef.current = onPointerDown;
  }, [onPointerDown]);

  const max = useSelector(scrubActor, (snapshot) => snapshot.context.max);
  const min = useSelector(scrubActor, (snapshot) => snapshot.context.min);
  const value = useSelector(scrubActor, (snapshot) => snapshot.context.value);

  const panelClassName =
    'focus-visible:outline-primary relative z-10 cursor-pointer touch-none overflow-visible focus-visible:outline-2';

  const handleScrubStart = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      onPointerDownRef.current?.(event);
      scrubActor.send({
        type: 'SCRUB_START',
        clientX: event.clientX,
        clientY: event.clientY,
      });
    },
    [scrubActor]
  );

  return {
    handleScrubStart,
    max,
    min,
    panelClassName,
    value,
  };
}
