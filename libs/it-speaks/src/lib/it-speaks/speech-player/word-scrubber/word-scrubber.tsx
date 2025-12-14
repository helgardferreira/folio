import { cn } from '@folio/utils';

import { type ScrubActorRef } from '../../../actors';
import {
  useScrubberHandle,
  useScrubberPanel,
  useScrubberProgress,
  useScrubberTrack,
} from '../../../components';

type WordScrubberProps = {
  wordScrubActor: ScrubActorRef;
};

export function WordScrubber({ wordScrubActor }: WordScrubberProps) {
  const { handleScrubStart, max, min, panelClassName, value } =
    useScrubberPanel(wordScrubActor);
  const { setRef, trackClassName } = useScrubberTrack(wordScrubActor);
  const { progressClassName, progressStyle } =
    useScrubberProgress(wordScrubActor);
  const { handleClassName, handleStyle } = useScrubberHandle(wordScrubActor);

  return (
    <div
      aria-label="Word Playback"
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={value}
      className={cn(panelClassName, 'h-6 w-full')}
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
