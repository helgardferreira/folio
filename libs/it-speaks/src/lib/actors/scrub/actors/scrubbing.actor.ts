import { fromEvent, map, takeUntil, throwError } from 'rxjs';
import { type ActorRefFrom, fromEventObservable } from 'xstate';

import type { EventObservableCreator } from '@folio/actors';

import type { Direction, ScrubEvent } from '../types';
import { getScrubTrackRect, scrubEventFrom } from '../utils';

type ScrubbingActorInput = {
  direction: Direction;
  scrubTrack: Element | undefined;
  max: number;
  min: number;
};

const scrubbing: EventObservableCreator<ScrubEvent, ScrubbingActorInput> = ({
  input: { direction, scrubTrack, max, min },
}) => {
  if (scrubTrack === undefined) {
    return throwError(
      () => new Error('Scrub track element reference is undefined')
    );
  }

  const scrubTrackRect = getScrubTrackRect(scrubTrack);

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
