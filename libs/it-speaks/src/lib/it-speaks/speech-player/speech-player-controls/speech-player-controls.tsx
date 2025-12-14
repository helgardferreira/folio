import {
  AudioLinesIcon,
  PlayIcon,
  SettingsIcon,
  Volume2Icon,
} from 'lucide-react';

// TODO: implement this
export function SpeechPlayerControls() {
  return (
    <div className="text-primary flex justify-between">
      <div className="flex items-center justify-between gap-1.5">
        {/* <PlayPause /> */}
        {/* --------------------------------------------------------- */}
        <button className="btn btn-square btn-primary btn-sm">
          <PlayIcon className="size-4" />
        </button>
        {/* --------------------------------------------------------- */}

        {/* <Volume /> */}
        {/* --------------------------------------------------------- */}
        {/* // TODO: switch between volume icons depending on volume level */}
        {/*
            <VolumeIcon />
            <Volume1Icon />
            <Volume2Icon />
            */}
        <button className="btn btn-square btn-primary btn-sm">
          <Volume2Icon className="size-4" />
        </button>
        {/* --------------------------------------------------------- */}
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
