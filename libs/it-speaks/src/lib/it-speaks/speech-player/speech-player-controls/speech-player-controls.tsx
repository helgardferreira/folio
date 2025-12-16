import { PlayPauseControl } from './play-pause-control/play-pause-control';
import { SpeedControl } from './speed-control/speed-control';
import { VoiceSelectorControl } from './voice-selector-control/voice-selector-control';
import { VolumeControl } from './volume-control/volume-control';

export function SpeechPlayerControls() {
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
