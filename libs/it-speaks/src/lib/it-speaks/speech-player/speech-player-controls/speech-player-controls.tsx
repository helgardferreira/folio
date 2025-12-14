import { useSelector } from '@xstate/react';
import { useEffect } from 'react';

import { useSpeechContext } from '../../../actors';

import { PlayPauseControl } from './play-pause-control/play-pause-control';
import { SpeedControl } from './speed-control/speed-control';
import { VoiceSelectorControl } from './voice-selector-control/voice-selector-control';
import { VolumeControl } from './volume-control/volume-control';

// TODO: implement this
export function SpeechPlayerControls() {
  const { speechActor } = useSpeechContext();

  // TODO: remove this after debugging
  // ---------------------------------------------------------------------------
  const value = useSelector(speechActor, (snapshot) =>
    JSON.stringify(snapshot.value)
  );

  useEffect(() => {
    console.log({ value });
  }, [value]);
  // ---------------------------------------------------------------------------

  return (
    <div className="text-primary flex justify-between">
      <div className="flex items-center justify-between gap-1.5">
        <PlayPauseControl />
        <VolumeControl />
      </div>

      <div className="flex items-center justify-between gap-1.5">
        <SpeedControl />
        <VoiceSelectorControl />
      </div>
    </div>
  );
}
