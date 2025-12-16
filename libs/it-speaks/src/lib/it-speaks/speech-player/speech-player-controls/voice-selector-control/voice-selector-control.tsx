import { useSelector } from '@xstate/react';
import { AudioLinesIcon } from 'lucide-react';

import { cn } from '@folio/utils';

import { useSpeechContext } from '../../../../actors';

import { VoiceList } from './voice-list/voice-list';

// TODO: implement custom details / summary disable / enable logic
// TODO: implement close on click outside logic
// TODO: create shared dropdown components
export function VoiceSelectorControl() {
  const { voiceSelectorActor } = useSpeechContext();

  const disabled = useSelector(
    voiceSelectorActor,
    (snapshot) => !snapshot.matches('active')
  );

  return (
    <details className="dropdown dropdown-end dropdown-top">
      <summary
        className={cn(
          'btn btn-square btn-primary btn-sm',
          disabled && 'btn-disabled'
        )}
      >
        <AudioLinesIcon className="size-4" />
      </summary>

      <div className="dropdown-content text-base-content rounded-box -end-6 z-1 mb-12 grid h-90 w-100 grid-rows-[auto_1fr] gap-y-2 overflow-hidden bg-slate-100 p-4 shadow-sm dark:bg-slate-950">
        <span className="px-2 text-sm font-semibold">Voices</span>

        <VoiceList />
      </div>
    </details>
  );
}
