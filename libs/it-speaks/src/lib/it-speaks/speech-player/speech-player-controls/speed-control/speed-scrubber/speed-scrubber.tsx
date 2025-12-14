import { cn } from '@folio/utils';

import type { ScrubActorRef } from '../../../../../actors';
import {
  useScrubberHandle,
  useScrubberPanel,
  useScrubberProgress,
  useScrubberTrack,
} from '../../../../../components';

type SpeedScrubberProps = {
  speedScrubActor: ScrubActorRef;
};

export function SpeedScrubber({ speedScrubActor }: SpeedScrubberProps) {
  const { handleScrubStart, max, min, panelClassName, value } =
    useScrubberPanel(speedScrubActor);
  const { setRef, trackClassName } = useScrubberTrack(speedScrubActor);
  const { progressClassName, progressStyle } =
    useScrubberProgress(speedScrubActor);
  const { handleClassName, handleStyle } = useScrubberHandle(speedScrubActor);

  return (
    <div
      aria-label="Playback Speed"
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={value}
      className={cn(panelClassName, 'size-full')}
      onPointerDown={handleScrubStart}
      role="slider"
      tabIndex={0}
    >
      <div
        className={cn(trackClassName, 'bg-primary/30 w-2 rounded-xl')}
        ref={setRef}
      >
        <div
          className={cn(progressClassName, 'bg-primary')}
          style={progressStyle}
        />
      </div>

      <div
        className={cn(handleClassName, 'bg-primary size-4')}
        style={handleStyle}
      />
    </div>
  );
}
