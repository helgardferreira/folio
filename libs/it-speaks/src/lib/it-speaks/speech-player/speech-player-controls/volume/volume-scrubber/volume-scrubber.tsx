import { cn } from '@folio/utils';

import { type ScrubActorRef } from '../../../../../actors';
import {
  useScrubberHandle,
  useScrubberPanel,
  useScrubberProgress,
  useScrubberTrack,
} from '../../../../../components';

type VolumeScrubberProps = {
  volumeScrubActor: ScrubActorRef;
};

export function VolumeScrubber({ volumeScrubActor }: VolumeScrubberProps) {
  const { handleScrubStart, max, min, panelClassName, value } =
    useScrubberPanel(volumeScrubActor);
  const { setRef, trackClassName } = useScrubberTrack(volumeScrubActor);
  const { progressClassName, progressStyle } =
    useScrubberProgress(volumeScrubActor);
  const { handleClassName, handleStyle } = useScrubberHandle(volumeScrubActor);

  return (
    <div
      aria-label="Volume"
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={value}
      className={cn(panelClassName, 'h-8 w-25')}
      onPointerDown={handleScrubStart}
      role="slider"
      tabIndex={0}
    >
      <div
        className={cn(trackClassName, 'bg-primary/30 h-2 rounded-xl')}
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
