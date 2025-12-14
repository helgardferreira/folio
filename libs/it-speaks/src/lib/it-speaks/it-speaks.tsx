import { SpeechProvider } from '../actors';

import { SpeechPlayer } from './speech-player/speech-player';

// TODO: reimplement it-speaks speech synthesis demo
//       - instantiate word scrubber (effectively playback offset for speech synthesis)
//       - instantiate volume scrubber
//       - instantiate speed scrubber (effectively playback rate for speech synthesis)
//       - use scrubbers in / with new `speechMachine` actor for basic it-speaks speech synthesis demo
//       - finally, create 3D WebGL renderer for demo
//       - reassess potential areas for cleanup / refactor afterwards
// TODO: continue here...
export function ItSpeaks() {
  return (
    <div className="rounded-box border-primary relative h-100 w-full border">
      <SpeechProvider>
        <SpeechPlayer />
      </SpeechProvider>
    </div>
  );
}
