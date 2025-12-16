import { useSelector } from '@xstate/react';
import {
  Volume1Icon,
  Volume2Icon,
  VolumeIcon,
  VolumeXIcon,
} from 'lucide-react';
import { useCallback } from 'react';

import { useSpeechContext } from '../../../../actors';
import {
  ScrubberHandle,
  ScrubberProgress,
  ScrubberRoot,
  ScrubberTrack,
} from '../../../../components';

export function VolumeControl() {
  const { speechActor, volumeScrubActor } = useSpeechContext();

  const muted = useSelector(speechActor, (snapshot) => snapshot.context.muted);

  const volumePercentage = useSelector(
    volumeScrubActor,
    (snapshot) => snapshot.context.percentage
  );

  const handleClick = useCallback(
    () => speechActor.send({ type: 'TOGGLE_MUTE' }),
    [speechActor]
  );

  return (
    <div className="flex gap-3">
      <button
        className="btn btn-square btn-primary btn-sm"
        onClick={handleClick}
      >
        {muted && <VolumeXIcon className="size-4" />}
        {!muted && volumePercentage >= 0 && volumePercentage < 33 && (
          <VolumeIcon className="size-4" />
        )}
        {!muted && volumePercentage >= 33 && volumePercentage < 66 && (
          <Volume1Icon className="size-4" />
        )}
        {!muted && volumePercentage >= 66 && <Volume2Icon className="size-4" />}
      </button>

      <ScrubberRoot
        className="h-8 w-25"
        label="Volume"
        scrubActor={volumeScrubActor}
      >
        <ScrubberTrack className="bg-primary/30 h-2 rounded-xl">
          <ScrubberProgress className="bg-primary" />
        </ScrubberTrack>

        <ScrubberHandle className="bg-primary size-4" />
      </ScrubberRoot>
    </div>
  );
}
