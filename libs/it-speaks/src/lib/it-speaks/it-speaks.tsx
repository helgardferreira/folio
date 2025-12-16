import { SpeechProvider } from '../actors';

import { SpeechPlayer } from './speech-player/speech-player';
import { SpeechVisualization } from './speech-visualization/speech-visualization';

// TODO: reimplement it-speaks speech synthesis showcase
//       - create 3D WebGL renderer for showcase
export function ItSpeaks() {
  return (
    <SpeechProvider>
      <div className="rounded-box relative flex size-full flex-col items-center py-8">
        <SpeechVisualization />

        <SpeechPlayer />
      </div>
    </SpeechProvider>
  );
}
