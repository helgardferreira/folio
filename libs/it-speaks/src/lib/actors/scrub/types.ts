type ScrubDirection = 'bottom-top' | 'left-right' | 'right-left' | 'top-bottom';

type ScrubActorContext = {
  direction: ScrubDirection;
  element: Element | undefined;
  position: number;
};

type ScrubActorInput = {
  direction: ScrubDirection;
  initialPosition?: number;
};

type AttachEvent = {
  type: 'ATTACH';
  element: Element;
};
type DetachEvent = {
  type: 'DETACH';
};
type ScrubEvent = {
  type: 'SCRUB';
  position: number;
};
type ScrubStartEvent = {
  type: 'SCRUB_START';
  position: number;
};

type ScrubActorEvent = AttachEvent | DetachEvent | ScrubEvent | ScrubStartEvent;

export type {
  AttachEvent,
  DetachEvent,
  ScrubActorContext,
  ScrubActorEvent,
  ScrubActorInput,
  ScrubDirection,
  ScrubEvent,
  ScrubStartEvent,
};
