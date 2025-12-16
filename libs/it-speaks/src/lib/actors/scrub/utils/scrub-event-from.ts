import { clamp, lerp, normalize } from '@folio/utils';

import type { Direction, ScrubEvent, ScrubTrackRect } from '../types';

type ScrubEventFromOptions = {
  clientX: number;
  clientY: number;
  direction: Direction;
  max: number;
  min: number;
  scrubTrackRect: ScrubTrackRect;
};

export function scrubEventFrom({
  clientX,
  clientY,
  direction,
  max,
  min,
  scrubTrackRect,
}: ScrubEventFromOptions): ScrubEvent {
  const { bottom, height, left, right, top, width } = scrubTrackRect;
  let normalized: number;

  if (direction === 'bottom-top' || direction === 'top-bottom') {
    let clamped: number;

    if (direction === 'bottom-top') {
      clamped = clamp(bottom - clientY, 0, height);
    } else {
      clamped = clamp(clientY - top, 0, height);
    }

    normalized = normalize(clamped, 0, height);
  } else {
    let clamped: number;

    if (direction === 'left-right') {
      clamped = clamp(clientX - left, 0, width);
    } else {
      clamped = clamp(right - clientX, 0, width);
    }

    normalized = normalize(clamped, 0, width);
  }

  const percentage = normalized * 100;
  const value = lerp(normalized, min, max);

  return { type: 'SCRUB', percentage, value };
}
