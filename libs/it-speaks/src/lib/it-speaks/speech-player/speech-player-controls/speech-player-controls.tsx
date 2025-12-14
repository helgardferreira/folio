import { useSelector } from '@xstate/react';
import { AudioLinesIcon, SettingsIcon } from 'lucide-react';
import { useEffect } from 'react';

import { useSpeechContext } from '../../../actors';

import { PlayPause } from './play-pause/play-pause';
import { Volume } from './volume/volume';

// TODO: implement this
export function SpeechPlayerControls() {
  const { speechActor } = useSpeechContext();

  const _isPlaying = useSelector(speechActor, (snapshot) =>
    snapshot.matches({ active: 'playing' })
  );

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
        <PlayPause />
        <Volume />
      </div>

      <div className="flex items-center justify-between gap-1.5">
        {/* <Settings /> */}
        {/* --------------------------------------------------------- */}
        <button className="btn btn-square btn-primary btn-sm">
          <SettingsIcon className="size-4" />
        </button>
        {/* --------------------------------------------------------- */}

        {/* <VoiceSelector /> */}
        {/* --------------------------------------------------------- */}
        <button className="btn btn-square btn-primary btn-sm">
          <AudioLinesIcon className="size-4" />
        </button>
        {/* --------------------------------------------------------- */}
      </div>
    </div>
  );
}
