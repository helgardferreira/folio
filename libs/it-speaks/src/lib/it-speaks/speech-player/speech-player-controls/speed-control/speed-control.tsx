import { useSelector } from '@xstate/react';
import { CircleGaugeIcon } from 'lucide-react';

import { useSpeechContext } from '../../../../actors';
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
  ScrubberHandle,
  ScrubberProgress,
  ScrubberRoot,
  ScrubberTrack,
} from '../../../../components';

import { SpeedMultiplierButton } from './speed-multiplier-button/speed-multiplier-button';

const SPEED_MULTIPLIERS: number[] = [2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25];

export function SpeedControl() {
  const { speedScrubActor } = useSpeechContext();

  const currentMultiplier = useSelector(speedScrubActor, (snapshot) =>
    snapshot.context.value.toFixed(2)
  );

  return (
    <Dropdown className="dropdown-end dropdown-top">
      <DropdownTrigger className="btn btn-square btn-primary btn-sm">
        <CircleGaugeIcon className="size-4" />
      </DropdownTrigger>

      <DropdownContent className="text-base-content -end-15.5 mb-12 grid h-80 w-39 grid-cols-2 grid-rows-[auto_1fr_auto] gap-y-3 bg-slate-100 px-6 py-4 select-none dark:bg-slate-950">
        <span className="col-span-2 text-sm font-semibold">Playback Speed</span>

        <div className="size-full py-3">
          <ScrubberRoot
            className="size-full"
            label="Playback Speed"
            scrubActor={speedScrubActor}
          >
            <ScrubberTrack className="bg-primary/30 w-2 rounded-xl">
              <ScrubberProgress className="bg-primary" />
            </ScrubberTrack>

            <ScrubberHandle className="bg-primary size-4" />
          </ScrubberRoot>
        </div>

        <div className="flex flex-col items-end justify-between font-mono">
          {SPEED_MULTIPLIERS.map((multiplier) => (
            <SpeedMultiplierButton key={multiplier} multiplier={multiplier} />
          ))}
        </div>

        <span className="col-start-2 text-center font-mono leading-none">
          {currentMultiplier}x
        </span>
      </DropdownContent>
    </Dropdown>
  );
}
