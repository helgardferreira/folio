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

  const max = useSelector(scrubActor, (snapshot) => snapshot.context.max);
  const min = useSelector(scrubActor, (snapshot) => snapshot.context.min);
  const value = useSelector(scrubActor, (snapshot) => snapshot.context.value);

  const panelClassName =
    'relative z-10 cursor-pointer touch-none overflow-visible';

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

  useLayoutEffect(() => {
    onPointerDownRef.current = onPointerDown;
  }, [onPointerDown]);

  return {
    handleScrubStart,
    max,
    min,
    panelClassName,
    value,
  };
}
