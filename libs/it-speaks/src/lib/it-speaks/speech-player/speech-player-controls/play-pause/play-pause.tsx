import { useSelector } from '@xstate/react';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { useCallback } from 'react';

import { useSpeechContext } from '../../../../actors';

export function PlayPause() {
  const { speechActor } = useSpeechContext();

  const isPlaying = useSelector(speechActor, (snapshot) =>
    snapshot.matches({ active: 'playing' })
  );

  const handlePlayPause = useCallback(() => {
    if (isPlaying) speechActor.send({ type: 'PAUSE' });
    else speechActor.send({ type: 'PLAY' });
  }, [isPlaying, speechActor]);

  return (
    <button
      className="btn btn-square btn-primary btn-sm"
      onClick={handlePlayPause}
    >
      {isPlaying ? (
        <PauseIcon className="size-4" />
      ) : (
        <PlayIcon className="size-4" />
      )}
    </button>
  );
}
