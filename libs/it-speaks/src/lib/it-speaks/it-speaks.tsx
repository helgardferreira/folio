import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SpeechProvider } from '../actors';

import { SpeechVisualization } from './speech-visualization/speech-visualization';

const queryClient = new QueryClient();

export function ItSpeaks() {
  return (
    <QueryClientProvider client={queryClient}>
      <SpeechProvider>
        {/* <div className="rounded-box relative flex size-full flex-col items-center py-8"> */}
        <div className="relative size-full overflow-hidden">
          <SpeechVisualization />

          {/* // TODO: restore this after implementing WebGL Visualization */}
          {/* <SpeechPlayer /> */}
        </div>
      </SpeechProvider>
    </QueryClientProvider>
  );
}
