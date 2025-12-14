import { useSelector } from '@xstate/react';
import {
  Volume1Icon,
  Volume2Icon,
  VolumeIcon,
  VolumeXIcon,
} from 'lucide-react';
import { useCallback } from 'react';

import { useSpeechContext } from '../../../../actors';

import { VolumeScrubber } from './volume-scrubber/volume-scrubber';

export function Volume() {
  const { speechActor } = useSpeechContext();

  const volumeScrubActor = useSelector(
    speechActor,
    (snapshot) => snapshot.context.volumeScrubActor
  );

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

      <VolumeScrubber volumeScrubActor={volumeScrubActor} />
    </div>
  );
}
