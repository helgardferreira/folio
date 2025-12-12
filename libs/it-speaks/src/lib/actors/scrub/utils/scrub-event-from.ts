import { lerp, normalize } from '@folio/utils';

import type { ScrubDirection, ScrubEvent } from '../types';

import type { ScrubTrackRect } from './get-scrub-track-rect';

type ScrubEventFromOptions = {
  clientX: number;
  clientY: number;
  direction: ScrubDirection;
  max: number;
  min: number;
  scrubTrackRect: ScrubTrackRect;
};

/**
 * Constrains the pointer within the scrubber's track and maps the pointer's
 * coordinates to a left / top / bottom / right `position` value (for
 * positioning the scrubber element) as well as a linearly interpolated `value`
 * between the configured `max` and `min` input parameters.
 *
 * The scrubber's track is defined as the area within the scrubber's parent
 * element's padding box edge offset by the scrubber element's center point.
 */
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
  let position: number;

  if (direction === 'bottom-top' || direction === 'top-bottom') {
    if (direction === 'bottom-top') {
      position = Math.max(Math.min(bottom - clientY, height), 0);
    } else {
      position = Math.max(Math.min(clientY - top, height), 0);
    }

    normalized = normalize(position, 0, height);
  } else {
    if (direction === 'left-right') {
      position = Math.max(Math.min(clientX - left, width), 0);
    } else {
      position = Math.max(Math.min(right - clientX, width), 0);
    }

    normalized = normalize(position, 0, width);
  }

  const percentage = normalized * 100;
  const value = lerp(normalized, min, max);

  return { type: 'SCRUB', percentage, position, value };
}
