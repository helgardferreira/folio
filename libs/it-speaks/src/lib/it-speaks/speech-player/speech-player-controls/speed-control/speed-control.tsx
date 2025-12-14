import { useSelector } from '@xstate/react';
import { CircleGaugeIcon } from 'lucide-react';

import { useSpeechContext } from '../../../../actors';

import { SpeedMultiplierButton } from './speed-multiplier-button/speed-multiplier-button';
import { SpeedScrubber } from './speed-scrubber/speed-scrubber';

const SPEED_MULTIPLIERS: number[] = [2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25];

// TODO: implement close on click outside logic
// TODO: create shared dropdown components
export function SpeedControl() {
  const { speechActor } = useSpeechContext();

  const speedScrubActor = useSelector(
    speechActor,
    (snapshot) => snapshot.context.speedScrubActor
  );

  const currentMultiplier = useSelector(speedScrubActor, (snapshot) =>
    snapshot.context.value.toFixed(2)
  );

  return (
    <details className="dropdown dropdown-end dropdown-top">
      <summary className="btn btn-square btn-primary btn-sm">
        <CircleGaugeIcon className="size-4" />
      </summary>

      <div className="bg-primary-content dropdown-content rounded-box -end-15.5 z-1 mb-12 grid h-80 w-39 grid-cols-2 grid-rows-[auto_1fr_auto] gap-y-3 px-6 py-4 shadow-sm select-none">
        <span className="col-span-2 text-sm font-semibold">Playback Speed</span>

        <div className="size-full py-3">
          <SpeedScrubber speedScrubActor={speedScrubActor} />
        </div>

        <div className="flex flex-col items-end justify-between font-mono">
          {SPEED_MULTIPLIERS.map((multiplier) => (
            <SpeedMultiplierButton
              key={multiplier}
              multiplier={multiplier}
              speedScrubActor={speedScrubActor}
            />
          ))}
        </div>

        <span className="col-start-2 text-center font-mono leading-none">
          {currentMultiplier}x
        </span>
      </div>
    </details>
  );
}
