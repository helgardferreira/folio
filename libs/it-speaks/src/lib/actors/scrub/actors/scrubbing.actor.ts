import { fromEvent, map, takeUntil, throwError } from 'rxjs';
import { type ActorRefFrom, fromEventObservable } from 'xstate';

import type { EventObservableCreator } from '@folio/actors';
import { lerp, normalize } from '@folio/utils';

import { getScrubTrackRect } from '../get-scrub-track-rect';
import type { ScrubDirection, ScrubEvent } from '../types';

type ScrubbingActorInput = {
  direction: ScrubDirection;
  element: Element | undefined;
  max: number;
  min: number;
};

const scrubbing: EventObservableCreator<ScrubEvent, ScrubbingActorInput> = ({
  input: { direction, element, max, min },
}) => {
  if (element === undefined) {
    return throwError(
      () => new Error('Scrubber element reference is undefined')
    );
  }
  if (element.parentElement === null) {
    return throwError(
      () => new Error('Scrubber element must be a child of another element')
    );
  }

  const { bottom, height, left, right, top, width } = getScrubTrackRect(
    element,
    element.parentElement
  );

  return fromEvent<PointerEvent>(window, 'pointermove').pipe(
    takeUntil(fromEvent<PointerEvent>(window, 'pointerup')),
    /*
     * Constrains the pointer within the scrubber's track and maps the pointer's
     * coordinates to a left / top / bottom / right `position` value (for
     * positioning the scrubber element) as well as a linearly interpolated
     * `value` between the configured `max` and `min` input parameters.
     *
     * The scrubber's track is defined as the area within the scrubber's
     * parent element's padding box edge offset by the scrubber element's
     * center point.
     */
    map<PointerEvent, ScrubEvent>(({ clientX, clientY }) => {
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
    })
  );
};

export const scrubbingLogic = fromEventObservable(scrubbing);

export type ScrubbingActorRef = ActorRefFrom<typeof scrubbingLogic>;
