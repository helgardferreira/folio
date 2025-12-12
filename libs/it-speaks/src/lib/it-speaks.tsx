import { useActorRef, useSelector } from '@xstate/react';
import { useCallback } from 'react';

import { cn } from '@folio/utils';

import { scrubMachine } from './actors';
import type { ScrubDirection } from './actors/scrub/types';

type ItSpeaksProps = {
  direction: ScrubDirection;
};

// TODO: reimplement it-speaks speech synthesis demo
// TODO: continue here...
export function ItSpeaks({ direction }: ItSpeaksProps) {
  const scrubActor = useActorRef(scrubMachine, {
    input: { direction, min: 0, max: 1000, initialValue: 250 },
  });

  const isAttached = useSelector(scrubActor, (snapshot) =>
    snapshot.matches('attached')
  );
  const percentage = useSelector(
    scrubActor,
    ({ context }) => context.percentage
  );

  const handleScrubStart = useCallback(
    () => scrubActor.send({ type: 'SCRUB_START' }),
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
          className={cn(
            'bg-primary absolute left-0 z-10 size-10 cursor-pointer rounded-full select-none',
            isAttached ? 'opacity-100' : 'opacity-0'
          )}
          onPointerDown={handleScrubStart}
          ref={setRef}
          style={{
            bottom: `${percentage}%`,
            transform: `translate3d(0, ${percentage}%, 0)`,
          }}
        />
      )}

      {direction === 'left-right' && (
        <div
          className={cn(
            'bg-primary absolute top-0 z-10 size-10 cursor-pointer rounded-full select-none',
            isAttached ? 'opacity-100' : 'opacity-0'
          )}
          onPointerDown={handleScrubStart}
          ref={setRef}
          style={{
            left: `${percentage}%`,
            transform: `translate3d(-${percentage}%, 0, 0)`,
          }}
        />
      )}

      {direction === 'right-left' && (
        <div
          className={cn(
            'bg-primary absolute top-0 z-10 size-10 cursor-pointer rounded-full select-none',
            isAttached ? 'opacity-100' : 'opacity-0'
          )}
          onPointerDown={handleScrubStart}
          ref={setRef}
          style={{
            right: `${percentage}%`,
            transform: `translate3d(${percentage}%, 0, 0)`,
          }}
        />
      )}

      {direction === 'top-bottom' && (
        <div
          className={cn(
            'bg-primary absolute left-0 z-10 size-10 cursor-pointer rounded-full select-none',
            isAttached ? 'opacity-100' : 'opacity-0'
          )}
          onPointerDown={handleScrubStart}
          ref={setRef}
          style={{
            top: `${percentage}%`,
            transform: `translate3d(0, -${percentage}%, 0)`,
          }}
        />
      )}
    </div>
  );
}
