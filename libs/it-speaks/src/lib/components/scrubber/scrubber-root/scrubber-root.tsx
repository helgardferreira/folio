import { type ScrubDirection, ScrubProvider } from '../../../actors';
import {
  ScrubberPanel,
  type ScrubberPanelProps,
} from '../scrubber-panel/scrubber-panel';

type ScrubberRootProps = ScrubberPanelProps & {
  direction: ScrubDirection;
  initialValue?: number;
  max?: number;
  min?: number;
};

export function ScrubberRoot({
  direction,
  initialValue,
  max,
  min,
  ...props
}: ScrubberRootProps) {
  return (
    <ScrubProvider
      direction={direction}
      initialValue={initialValue}
      max={max}
      min={min}
    >
      <ScrubberPanel {...props} />
    </ScrubProvider>
  );
}
