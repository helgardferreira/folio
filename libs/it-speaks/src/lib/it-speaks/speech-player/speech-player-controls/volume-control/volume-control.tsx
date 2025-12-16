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
  const { volumeScrubActor } = useSpeechContext();

  const volumePercentage = useSelector(
    volumeScrubActor,
    (snapshot) => snapshot.context.percentage
  );

  // TODO: enhance mute / unmute to restore previous volume amount instead of maxing out
  //       - should probably create bespoke `TOGGLE_VOLUME` event in `speechMachine`
  const muteUnmute = useCallback(() => {
    if (volumePercentage !== 0) {
      volumeScrubActor.send({ type: 'SET_PERCENTAGE', percentage: 0 });
    } else {
      volumeScrubActor.send({ type: 'SET_PERCENTAGE', percentage: 100 });
    }
  }, [volumePercentage, volumeScrubActor]);

  return (
    <div className="flex gap-3">
      <button
        className="btn btn-square btn-primary btn-sm"
        onClick={muteUnmute}
      >
        {volumePercentage === 0 && <VolumeXIcon className="size-4" />}
        {volumePercentage > 0 && volumePercentage <= 33 && (
          <VolumeIcon className="size-4" />
        )}
        {volumePercentage > 33 && volumePercentage <= 66 && (
          <Volume1Icon className="size-4" />
        )}
        {volumePercentage > 66 && <Volume2Icon className="size-4" />}
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
