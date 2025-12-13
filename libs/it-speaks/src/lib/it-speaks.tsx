import {
  ScrubberHandle,
  ScrubberProgress,
  ScrubberRoot,
  ScrubberTrack,
} from './components';

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
    <div className="rounded-box border-primary relative flex h-100 w-full flex-col gap-4 overflow-hidden border-2 p-5">
      <ScrubberRoot
        className="h-6 w-full"
        direction="left-right"
        initialValue={100}
        label="Example Slider"
        max={1000}
        min={100}
      >
        <ScrubberTrack className="h-2 rounded-xl bg-indigo-200">
          <ScrubberProgress className="bg-indigo-500" />
        </ScrubberTrack>

        <ScrubberHandle className="size-4 bg-indigo-600" />
      </ScrubberRoot>

      <ScrubberRoot
        className="h-6 w-full"
        direction="right-left"
        initialValue={100}
        label="Example Slider"
        max={1000}
        min={100}
      >
        <ScrubberTrack className="h-2 rounded-xl bg-red-200">
          <ScrubberProgress className="bg-red-500" />
        </ScrubberTrack>

        <ScrubberHandle className="size-4 bg-red-600" />
      </ScrubberRoot>

      <div className="flex h-50 gap-4">
        <ScrubberRoot
          className="h-full w-6"
          direction="bottom-top"
          initialValue={50}
          label="Example Slider"
          max={100}
          min={0}
        >
          <ScrubberTrack className="w-2 rounded-xl bg-green-200">
            <ScrubberProgress className="bg-green-500" />
          </ScrubberTrack>

          <ScrubberHandle className="size-4 bg-green-600" />
        </ScrubberRoot>

        <ScrubberRoot
          className="h-full w-6"
          direction="top-bottom"
          initialValue={50}
          label="Example Slider"
          max={100}
          min={0}
        >
          <ScrubberTrack className="w-2 rounded-xl bg-yellow-200">
            <ScrubberProgress className="bg-yellow-500" />
          </ScrubberTrack>

          <ScrubberHandle className="size-4 bg-yellow-600" />
        </ScrubberRoot>
      </div>
    </div>
  );
}
