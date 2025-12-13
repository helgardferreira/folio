import { lerp, normalize } from '@folio/utils';

import type { ScrubDirection, ScrubEvent, ScrubTrackRect } from '../types';

type ScrubEventFromOptions = {
  clientX: number;
  clientY: number;
  direction: ScrubDirection;
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
      clamped = Math.max(Math.min(bottom - clientY, height), 0);
    } else {
      clamped = Math.max(Math.min(clientY - top, height), 0);
    }

    normalized = normalize(clamped, 0, height);
  } else {
    let clamped: number;

    if (direction === 'left-right') {
      clamped = Math.max(Math.min(clientX - left, width), 0);
    } else {
      clamped = Math.max(Math.min(right - clientX, width), 0);
    }

    normalized = normalize(clamped, 0, width);
  }

  const percentage = normalized * 100;
  const value = lerp(normalized, min, max);

  return { type: 'SCRUB', percentage, value };
}
