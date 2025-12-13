import type { ScrubTrackRect } from './utils';

type ScrubDirection = 'bottom-top' | 'left-right' | 'right-left' | 'top-bottom';

type ScrubActorContext = {
  direction: ScrubDirection;
  max: number;
  min: number;
  percentage: number;
  scrubTrack: Element | undefined;
  scrubTrackRect: ScrubTrackRect | undefined;
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
  scrubTrack: Element;
};
type DetachEvent = {
  type: 'DETACH';
};
type ErrorEvent = {
  type: 'ERROR';
  error: unknown;
};
type ScrubEndEvent = {
  type: 'SCRUB_END';
};
type ScrubEvent = {
  type: 'SCRUB';
  percentage: number;
  value: number;
};
type ScrubStartEvent = {
  type: 'SCRUB_START';
  clientX: number;
  clientY: number;
};

type ScrubActorEmittedEvent = ScrubEndEvent | ScrubEvent | ScrubStartEvent;

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
  ScrubActorEmittedEvent,
  ScrubActorEvent,
  ScrubActorInput,
  ScrubDirection,
  ScrubEndEvent,
  ScrubEvent,
  ScrubStartEvent,
};
