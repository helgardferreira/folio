import { useSelector } from '@xstate/react';
import {
  type KeyboardEvent,
  type PointerEvent,
  type PointerEventHandler,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react';

import { useScrubberContext } from '../use-scrubber-context';

export function useScrubberPanel(
  onPointerDown: PointerEventHandler<HTMLDivElement> | undefined
) {
  const { scrubActor } = useScrubberContext();

  const onPointerDownRef =
    useRef<PointerEventHandler<HTMLDivElement>>(onPointerDown);

  useLayoutEffect(() => {
    onPointerDownRef.current = onPointerDown;
  }, [onPointerDown]);

  const max = useSelector(scrubActor, (snapshot) => snapshot.context.max);
  const min = useSelector(scrubActor, (snapshot) => snapshot.context.min);
  const value = useSelector(scrubActor, (snapshot) => snapshot.context.value);
  const disabled = useSelector(
    scrubActor,
    (snapshot) =>
      snapshot.matches('detached') || snapshot.matches({ attached: 'disabled' })
  );

  const tabIndex = disabled ? -1 : 0;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          scrubActor.send({ type: 'SCRUB_DOWN' });
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          scrubActor.send({ type: 'SCRUB_UP' });
          break;
        }
        case 'ArrowLeft': {
          event.preventDefault();
          scrubActor.send({ type: 'SCRUB_LEFT' });
          break;
        }
        case 'ArrowRight': {
          event.preventDefault();
          scrubActor.send({ type: 'SCRUB_RIGHT' });
          break;
        }
      }
    },
    [scrubActor]
  );

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
    disabled,
    handleKeyDown,
    handleScrubStart,
    max,
    min,
    tabIndex,
    value,
  };
}
