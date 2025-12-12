import { useActorRef, useSelector } from '@xstate/react';
import { type PointerEvent, useCallback } from 'react';

import { scrubMachine } from './actors';
import type { ScrubDirection } from './actors/scrub/types';

type ItSpeaksProps = {
  direction: ScrubDirection;
};

// TODO: reimplement it-speaks speech synthesis demo
// TODO: continue here...
export function ItSpeaks({ direction }: ItSpeaksProps) {
  const scrubActor = useActorRef(scrubMachine, {
    input: { direction },
  });

  const position = useSelector(scrubActor, ({ context }) => context.position);

  const handleScrubStart = useCallback(
    ({ clientX }: PointerEvent<HTMLDivElement>) =>
      scrubActor.send({ type: 'SCRUB_START', position: clientX }),
    [scrubActor]
  );

  const setRef = useCallback(
    <T extends Element>(element: T | null) => {
      if (element !== null) scrubActor.send({ type: 'ATTACH', element });
      return () => scrubActor.send({ type: 'DETACH' });
    },
    [scrubActor]
  );

  return (
    <div className="rounded-box border-primary relative h-30 w-full overflow-hidden border-8 p-4">
      {direction === 'bottom-top' && (
        <div
          className="bg-primary absolute left-0 z-10 size-10 cursor-pointer rounded-full"
          onPointerDown={handleScrubStart}
          ref={setRef}
          style={{ bottom: position }}
        />
      )}

      {direction === 'left-right' && (
        <div
          className="bg-primary absolute top-0 z-10 size-10 cursor-pointer rounded-full"
          onPointerDown={handleScrubStart}
          ref={setRef}
          style={{ left: position }}
        />
      )}

      {direction === 'right-left' && (
        <div
          className="bg-primary absolute top-0 z-10 size-10 cursor-pointer rounded-full"
          onPointerDown={handleScrubStart}
          ref={setRef}
          style={{ right: position }}
        />
      )}

      {direction === 'top-bottom' && (
        <div
          className="bg-primary absolute left-0 z-10 size-10 cursor-pointer rounded-full"
          onPointerDown={handleScrubStart}
          ref={setRef}
          style={{ top: position }}
        />
      )}
    </div>
  );
}
