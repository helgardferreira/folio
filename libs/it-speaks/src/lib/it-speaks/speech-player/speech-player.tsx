import { useSelector } from '@xstate/react';
import { useEffect } from 'react';

import { useSpeechContext } from '../../actors';
import {
  ScrubberHandle,
  ScrubberProgress,
  ScrubberRoot,
  ScrubberTrack,
} from '../../components';

import { SpeechPlayerControls } from './speech-player-controls/speech-player-controls';

export function SpeechPlayer() {
  const { speechActor } = useSpeechContext();

  const wordScrubActor = useSelector(
    speechActor,
    (snapshot) => snapshot.context.wordScrubActor
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
    <div className="absolute bottom-10 left-1/2 flex w-4/5 -translate-x-1/2 flex-col gap-1 rounded-md bg-slate-100 px-6 py-3 dark:bg-slate-950">
      <ScrubberRoot
        className="h-6 w-full"
        label="Word Seek"
        scrubActor={wordScrubActor}
      >
        <ScrubberTrack className="bg-primary/30 h-2 rounded-xl">
          <ScrubberProgress className="bg-primary" />
        </ScrubberTrack>

        <ScrubberHandle className="bg-primary size-4" />
      </ScrubberRoot>

      <SpeechPlayerControls />
    </div>
  );
}
