import { useSelector } from '@xstate/react';
import { AudioLinesIcon } from 'lucide-react';

import { useSpeechContext } from '../../../../actors';
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from '../../../../components';

import { VoiceList } from './voice-list/voice-list';

export function VoiceSelectorControl() {
  const { voiceSelectorActor } = useSpeechContext();

  const disabled = useSelector(
    voiceSelectorActor,
    (snapshot) => !snapshot.matches('active')
  );

  return (
    <Dropdown className="dropdown-end dropdown-top">
      <DropdownTrigger
        className="btn btn-square btn-primary btn-sm"
        disabled={disabled}
      >
        <AudioLinesIcon className="size-4" />
      </DropdownTrigger>

      <DropdownContent className="text-base-content -end-6 mb-12 grid h-90 w-100 grid-rows-[auto_1fr] gap-y-2 overflow-hidden bg-slate-100 p-4 dark:bg-slate-950">
        <span className="px-2 text-sm font-semibold">Voices</span>

        <VoiceList />
      </DropdownContent>
    </Dropdown>
  );
}
