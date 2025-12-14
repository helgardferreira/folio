import { useSelector } from '@xstate/react';

import { cn } from '@folio/utils';

import { useSpeechContext } from '../../actors';

import { SpeechPlayerControls } from './speech-player-controls/speech-player-controls';
import { WordScrubber } from './word-scrubber/word-scrubber';

export function SpeechPlayer() {
  const { speechActor } = useSpeechContext();

  const wordScrubActor = useSelector(
    speechActor,
    (snapshot) => snapshot.context.wordScrubActor
  );

  return (
    <div
      className={cn(
        'bg-base-content absolute bottom-10 left-1/2 flex w-4/5 -translate-x-1/2 flex-col gap-1 rounded-md px-6 py-3'
      )}
    >
      <WordScrubber wordScrubActor={wordScrubActor} />

      <SpeechPlayerControls />
    </div>
  );
}
