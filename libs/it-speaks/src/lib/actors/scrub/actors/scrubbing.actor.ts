import { fromEvent, map, takeUntil, throwError } from 'rxjs';
import { type ActorRefFrom, fromEventObservable } from 'xstate';

import type { EventObservableCreator } from '@folio/actors';

import type { ScrubDirection, ScrubEvent } from '../types';
import { getScrubTrackRect, scrubEventFrom } from '../utils';

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

  const scrubTrackRect = getScrubTrackRect(element, element.parentElement);

  return fromEvent<PointerEvent>(window, 'pointermove').pipe(
    takeUntil(fromEvent<PointerEvent>(window, 'pointerup')),
    map<PointerEvent, ScrubEvent>(({ clientX, clientY }) =>
      scrubEventFrom({
        clientX,
        clientY,
        direction,
        max,
        min,
        scrubTrackRect,
      })
    )
  );
};

export const scrubbingLogic = fromEventObservable(scrubbing);

export type ScrubbingActorRef = ActorRefFrom<typeof scrubbingLogic>;
