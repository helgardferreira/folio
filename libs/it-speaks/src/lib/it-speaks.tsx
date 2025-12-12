import { useActorRef, useSelector } from '@xstate/react';
import { type PointerEvent, useCallback, useEffect, useRef } from 'react';

import { scrubMachine } from './actors';

export function ItSpeaks() {
  const scrubActor = useActorRef(scrubMachine, {
    input: { maxValue: 2, minValue: 0, scrubDirection: 'x' },
  });
  const percentage = useSelector(
    scrubActor,
    ({ context }) => context.percentage
  );
  const prevPosition = useSelector(
    scrubActor,
    ({ context }) => context.prevPosition
  );
  const scrubberRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback(
    ({ clientX }: PointerEvent<HTMLDivElement>) => {
      if (scrubberRef.current === null) return;

      scrubActor.send({
        type: 'START_SCRUB',
        position: clientX,
        scrubberRef: scrubberRef.current,
      });
    },
    [scrubActor]
  );

  // TODO: remove this after debugging
  // ---------------------------------------------------------------------------
  useEffect(() => {
    console.log({ percentage });
  }, [percentage]);
  useEffect(() => {
    console.log({ prevPosition });
  }, [prevPosition]);
  // ---------------------------------------------------------------------------

  return (
    <div className="rounded-box border-primary relative h-30 w-full border">
      <div
        // className="h-3 w-3 -translate-y-2 cursor-pointer rounded-lg bg-indigo-600"
        className="bg-primary absolute z-10 size-10 cursor-pointer rounded-full"
        onPointerDown={handlePointerDown}
        ref={scrubberRef}
        // style={{ left: `calc(${0.8 * 100}% - 5px` }}
        style={{ left: prevPosition }}
      />
    </div>
  );
}
