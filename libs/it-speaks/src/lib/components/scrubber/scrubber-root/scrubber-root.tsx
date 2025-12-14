import {
  type ScrubDirection,
  type ScrubEmittedEvent,
  type ScrubEndEmittedEvent,
  ScrubProvider,
  type ScrubStartEmittedEvent,
} from '../../../actors';
import {
  ScrubberPanel,
  type ScrubberPanelProps,
} from '../scrubber-panel/scrubber-panel';

type ScrubberRootProps = ScrubberPanelProps & {
  direction: ScrubDirection;
  id: string;
  initialValue?: number;
  max?: number;
  min?: number;
  onScrub?: (event: ScrubEmittedEvent) => void;
  onScrubEnd?: (event: ScrubEndEmittedEvent) => void;
  onScrubStart?: (event: ScrubStartEmittedEvent) => void;
};

export function ScrubberRoot({
  direction,
  id,
  initialValue,
  max,
  min,
  onScrub,
  onScrubEnd,
  onScrubStart,
  ...props
}: ScrubberRootProps) {
  return (
    <ScrubProvider
      direction={direction}
      id={id}
      initialValue={initialValue}
      max={max}
      min={min}
      onScrub={onScrub}
      onScrubEnd={onScrubEnd}
      onScrubStart={onScrubStart}
    >
      <ScrubberPanel id={id} {...props} />
    </ScrubProvider>
  );
}
