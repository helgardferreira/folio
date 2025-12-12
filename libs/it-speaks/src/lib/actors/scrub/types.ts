type ScrubDirection = 'bottom-top' | 'left-right' | 'right-left' | 'top-bottom';

type ScrubActorContext = {
  direction: ScrubDirection;
  element: Element | undefined;
  max: number;
  min: number;
  percentage: number;
  position: number;
  value: number;
};

type ScrubActorInput = {
  direction: ScrubDirection;
  initialValue?: number;
  max?: number;
  min?: number;
};

type AttachEvent = {
  type: 'ATTACH';
  element: Element;
};
type DetachEvent = {
  type: 'DETACH';
};
type ErrorEvent = {
  type: 'ERROR';
  error: unknown;
};
type ScrubEvent = {
  type: 'SCRUB';
  percentage: number;
  position: number;
  value: number;
};
type ScrubStartEvent = {
  type: 'SCRUB_START';
};

type ScrubActorEvent =
  | AttachEvent
  | DetachEvent
  | ErrorEvent
  | ScrubEvent
  | ScrubStartEvent;

export type {
  AttachEvent,
  DetachEvent,
  ErrorEvent,
  ScrubActorContext,
  ScrubActorEvent,
  ScrubActorInput,
  ScrubDirection,
  ScrubEvent,
  ScrubStartEvent,
};
