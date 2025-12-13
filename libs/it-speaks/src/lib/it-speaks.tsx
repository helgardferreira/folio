import { useActorRef, useSelector } from '@xstate/react';
import { type PointerEvent, useCallback, useMemo } from 'react';

import { cn } from '@folio/utils';

import { scrubMachine } from './actors';
import type { ScrubTrackOffset } from './actors/scrub/utils';

// TODO: reimplement it-speaks speech synthesis demo
//       - instantiate word scrubber (effectively playback offset for speech synthesis)
//       - instantiate volume scrubber
//       - instantiate speed scrubber (effectively playback rate for speech synthesis)
//       - use scrubbers in / with new `speechMachine` actor for basic it-speaks speech synthesis demo
//       - finally, create 3D WebGL renderer for demo
//       - reassess potential areas for cleanup / refactor afterwards
// TODO: continue here...
export function ItSpeaks() {
  const MAX = 1000;
  const MIN = 100;

  const scrubActor = useActorRef(scrubMachine, {
    input: { direction: 'left-right', initialValue: MIN, max: MAX, min: MIN },
  });

  const percentage = useSelector(
    scrubActor,
    ({ context }) => context.percentage
  );
  const scrubTrackRect = useSelector(
    scrubActor,
    ({ context }) => context.scrubTrackRect
  );
  const scrubTrackOffset = useMemo<ScrubTrackOffset>(
    () => scrubTrackRect?.offset ?? { bottom: 0, left: 0, right: 0, top: 0 },
    [scrubTrackRect]
  );
  const value = useSelector(scrubActor, ({ context }) => context.value);

  const handleScrubStart = useCallback(
    ({ clientX, clientY }: PointerEvent) =>
      scrubActor.send({ type: 'SCRUB_START', clientX, clientY }),
    [scrubActor]
  );

  const setRef = useCallback(
    <T extends Element>(scrubTrack: T | null) => {
      if (scrubTrack !== null) scrubActor.send({ type: 'ATTACH', scrubTrack });
      return () => scrubActor.send({ type: 'DETACH' });
    },
    [scrubActor]
  );

  // TODO: split up into separate scrubber components
  //       - `<ScrubberRoot />`
  //       - `<ScrubberTrack />`
  //       - `<ScrubberProgress />`
  //       - `<ScrubberThumb />`
  return (
    <div className="rounded-box border-primary relative h-30 w-full overflow-hidden border-2 p-5">
      {/* Scrubber Root */}
      <div
        aria-label="Slider"
        aria-valuemax={MAX}
        aria-valuemin={MIN}
        aria-valuenow={value}
        className={cn(
          'relative',
          'z-10',
          'h-6',
          'w-full',
          'overflow-visible',
          'cursor-pointer'
        )}
        onPointerDown={handleScrubStart}
        role="slider"
        tabIndex={0}
      >
        {/* Scrubber Track */}
        <div
          className={cn(
            'absolute',
            'bg-indigo-200',
            'cursor-pointer',
            'h-2',
            'overflow-hidden',
            'rounded-xl',
            'top-1/2 left-0 -translate-y-1/2',
            'touch-none',
            'w-full'
          )}
          ref={setRef}
        >
          {/* Scrubber Progress */}
          <div
            className="absolute top-1/2 left-0 h-full -translate-y-1/2 bg-indigo-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Scrubber Thumb */}
        <div
          className={cn(
            '-translate-1/2',
            'absolute',
            'bg-indigo-600',
            'cursor-pointer',
            'rounded-full',
            'select-none',
            'size-4',
            'top-1/2'
          )}
          style={{
            left: `${percentage}%`,
            transform: `translate3d(calc(${scrubTrackOffset.left}px - (${percentage} / 100 * ${scrubTrackOffset.right}px) - (${percentage} / 100 * ${scrubTrackOffset.left}px)), 0, 0)`,
          }}
        />
      </div>
    </div>
  );
}
