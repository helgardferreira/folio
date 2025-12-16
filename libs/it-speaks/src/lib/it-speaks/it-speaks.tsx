import {
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useState,
} from 'react';

import { SpeechProvider, useSpeechContext } from '../actors';

import { SpeechPlayer } from './speech-player/speech-player';

// TODO: reimplement it-speaks speech synthesis demo
//       - use scrubbers in / with new `speechMachine` actor for basic it-speaks speech synthesis demo
//       - finally, create 3D WebGL renderer for demo
//       - reassess potential areas for cleanup / refactor afterwards
export function ItSpeaks() {
  return (
    <SpeechProvider>
      {/* <div className="rounded-box border-primary relative h-full w-full border"> */}
      <div className="rounded-box relative flex size-full flex-col items-center py-8">
        <SpeechVisualization />

        <SpeechPlayer />
      </div>
    </SpeechProvider>
  );
}

// TODO: move this
//// ---------------------------------------------------------------------------
// TODO: reimplement this with WebGL Visualization
export function SpeechVisualization() {
  const { speechActor } = useSpeechContext();

  const [text, setText] = useState(
    'Hi! This is the text to speech buddy, ready to bring any text to life, no pressure. This is an interactive display, feel free to click on any sentence to hear it. This view is in three dimensions! Click and drag to rotate the view.'
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setText(event.target.value);
    },
    []
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key !== 'Enter' || event.shiftKey) return;

      event.preventDefault();
      speechActor.send({ type: 'LOAD', text });

      if (event.target instanceof HTMLElement) event.target.blur();
    },
    [speechActor, text]
  );

  return (
    <textarea
      className="textarea textarea-xl textarea-primary h-100 w-4/5 resize-none"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      value={text}
    />
  );
}
//// ---------------------------------------------------------------------------
