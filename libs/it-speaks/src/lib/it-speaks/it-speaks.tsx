import { SpeechProvider } from '../actors';

import { SpeechPlayer } from './speech-player/speech-player';

// TODO: reimplement it-speaks speech synthesis demo
//       - use scrubbers in / with new `speechMachine` actor for basic it-speaks speech synthesis demo
//       - finally, create 3D WebGL renderer for demo
//       - reassess potential areas for cleanup / refactor afterwards
export function ItSpeaks() {
  return (
    <div className="rounded-box border-primary relative h-full w-full border">
      <SpeechProvider>
        <SpeechPlayer />
      </SpeechProvider>
    </div>
  );
}
