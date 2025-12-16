import { useActorRef, useSelector } from '@xstate/react';
import { AudioLinesIcon } from 'lucide-react';
import { useEffect } from 'react';

import { cn } from '@folio/utils';

import { useSpeechContext } from '../../../../actors';

import { voiceSelectorMachine } from './actors';
import { VoiceList } from './voice-list/voice-list';

// TODO: implement custom details / summary disable / enable logic
// TODO: implement close on click outside logic
// TODO: create shared dropdown components
export function VoiceSelectorControl() {
  const { speechActor } = useSpeechContext();

  const currentVoice = useSelector(
    speechActor,
    (snapshot) => snapshot.context.currentVoice
  );
  const voices = useSelector(
    speechActor,
    (snapshot) => snapshot.context.voices
  );

  // TODO: make `voiceSelectorMachine` a child of `speechMachine` later
  // ---------------------------------------------------------------------------
  const voiceSelectorActor = useActorRef(voiceSelectorMachine, {
    input: { parentActor: speechActor },
  });

  useEffect(() => {
    voiceSelectorActor.send({ type: 'SET_VOICES', currentVoice, voices });
  }, [currentVoice, voiceSelectorActor, voices]);
  // ---------------------------------------------------------------------------

  // TODO: restore this or remove this after debugging
  /*
  const disabled = voices.length === 0;
  */
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

      <div
        // TODO: clean up `className`
        className={cn(
          'dropdown-content',
          'text-base-content',
          'rounded-box',
          '-end-6',
          'z-1',
          'mb-12',
          'grid',
          // TODO: remove this after debugging
          'gap-y-2',
          'h-90',
          'w-100',
          'grid-rows-[auto_1fr]',
          'overflow-hidden',
          'bg-slate-100',
          // TODO: remove this after debugging
          // 'p-2',
          // 'px-3 pb-1',
          // 'px-6 py-4',
          'p-4',
          'shadow-sm',
          'dark:bg-slate-950'
        )}
      >
        {/* // TODO: remove this after debugging */}
        {/* <span className="px-4 pt-2 text-sm font-semibold">Voices</span> */}
        {/* <span className="px-6 pt-4 text-sm font-semibold">Voices</span> */}
        {/* <span className="px-3 pt-4 text-sm font-semibold">Voices</span> */}
        <span className="px-2 text-sm font-semibold">Voices</span>

        <VoiceList voiceSelectorActor={voiceSelectorActor} />
      </div>
    </details>
  );
}
