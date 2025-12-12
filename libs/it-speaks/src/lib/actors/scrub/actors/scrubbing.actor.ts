import { fromEvent, map, takeUntil, throwError } from 'rxjs';
import { type ActorRefFrom, fromEventObservable } from 'xstate';

import type { EventObservableCreator } from '../../../types';
import type { ScrubDirection, ScrubEvent } from '../types';
import { computeScrubTrackEdges } from '../utils';

type ScrubbingActorInput = {
  direction: ScrubDirection;
  element: Element | undefined;
};

const scrubbing: EventObservableCreator<ScrubEvent, ScrubbingActorInput> = ({
  input: { direction, element },
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

  const { bottom, left, right, top } = computeScrubTrackEdges(
    element,
    element.parentElement
  );

  return fromEvent<PointerEvent>(window, 'pointermove').pipe(
    takeUntil(fromEvent<PointerEvent>(window, 'pointerup')),
    /*
     * Constrains the pointer within the scrubber's track and maps the pointer's
     * coordinates to the `left` / `top` / `bottom` / `right` value for
     * positioning the scrubber element.
     *
     * The scrubber's track is defined as the area within the scrubber's
     * parent element's padding box edge offset by the scrubber element's
     * center point.
     */
    map(({ clientX, clientY }) => {
      let position: number;

      switch (direction) {
        case 'bottom-top': {
          position = Math.max(Math.min(bottom - clientY, bottom - top), 0);

          break;
        }
        case 'left-right': {
          position = Math.max(Math.min(clientX - left, right - left), 0);

          break;
        }
        case 'right-left': {
          position = Math.max(Math.min(right - clientX, right - left), 0);

          break;
        }
        case 'top-bottom': {
          position = Math.max(Math.min(clientY - top, bottom - top), 0);

          break;
        }
      }

      return { type: 'SCRUB', position } as ScrubEvent;
    })
  );
};

export const scrubbingLogic = fromEventObservable(scrubbing);

export type ScrubbingActorRef = ActorRefFrom<typeof scrubbingLogic>;
