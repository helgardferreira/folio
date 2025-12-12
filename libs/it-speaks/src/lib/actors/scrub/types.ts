// TODO: refactor this after initial implementation

type ScrubDirection = 'x' | 'y';

// TODO: implement this
/*
type ParentActor = ActorRef<
  Snapshot<unknown>,
  | { type: 'END_SCRUB' }
  | { type: 'SCRUB'; percentage: number }
  | { type: 'START_SCRUB'; percentage: number }
>;
*/

type ScrubActorContext = {
  maxValue: number;
  minValue: number;
  // TODO: implement this
  // parentActor: ParentActor;
  percentage: number;
  prevPosition: number;
  scrubDirection: ScrubDirection;
  scrubberRef: Element | undefined;
};

type ScrubActorInput = {
  maxValue: number;
  minValue: number;
  // TODO: implement this
  // parentActor: ParentActor;
  scrubDirection: ScrubDirection;
};

type EndScrubEvent = {
  type: 'END_SCRUB';
};

type ScrubEvent = {
  type: 'SCRUB';
  position: number;
};

type StartScrubEvent = {
  type: 'START_SCRUB';
  position: number;
  scrubberRef: Element;
};

type ScrubActorEvent = StartScrubEvent | ScrubEvent | EndScrubEvent;

export type {
  EndScrubEvent,
  ScrubActorContext,
  ScrubActorEvent,
  ScrubActorInput,
  ScrubDirection,
  ScrubEvent,
  StartScrubEvent,
};
