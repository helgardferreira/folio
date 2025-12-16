import type {
  ScrubActorRef,
  ScrubEmittedEvent,
  ScrubEndEmittedEvent,
  ScrubStartEmittedEvent,
} from '../../../actors';
import { ScrubberContext } from '../scrubber-context';
import {
  ScrubberPanel,
  type ScrubberPanelProps,
} from '../scrubber-panel/scrubber-panel';

import { useScrubberRoot } from './use-scrubber-root';

type ScrubberRootProps = ScrubberPanelProps & {
  onScrub?: (event: ScrubEmittedEvent) => void;
  onScrubEnd?: (event: ScrubEndEmittedEvent) => void;
  onScrubStart?: (event: ScrubStartEmittedEvent) => void;
  scrubActor: ScrubActorRef;
};

export function ScrubberRoot({
  onScrub,
  onScrubEnd,
  onScrubStart,
  scrubActor,
  ...props
}: ScrubberRootProps) {
  useScrubberRoot({ onScrub, onScrubEnd, onScrubStart, scrubActor });

  return (
    <ScrubberContext.Provider value={{ scrubActor }}>
      <ScrubberPanel {...props} />
    </ScrubberContext.Provider>
  );
}
