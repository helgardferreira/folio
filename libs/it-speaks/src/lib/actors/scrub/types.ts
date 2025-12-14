import type { ActorRef, Snapshot } from 'xstate';

type ScrubDirection = 'bottom-top' | 'left-right' | 'right-left' | 'top-bottom';

type ScrubTrackOffset = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

type ScrubTrackRect = {
  bottom: number;
  height: number;
  left: number;
  offset: ScrubTrackOffset;
  right: number;
  top: number;
  width: number;
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

type ScrubEmittedEvent = ScrubEvent & { id: string };
type ScrubEndEmittedEvent = ScrubEndEvent & { id: string };
type ScrubStartEmittedEvent = ScrubStartEvent & { id: string };

type ScrubActorEmittedEvent =
  | ScrubEmittedEvent
  | ScrubEndEmittedEvent
  | ScrubStartEmittedEvent;

type ScrubActorEvent =
  | AttachEvent
  | DetachEvent
  | ErrorEvent
  | ScrubEvent
  | ScrubStartEvent;

type ParentActor = ActorRef<
  Snapshot<unknown>,
  ScrubEmittedEvent | ScrubEndEmittedEvent | ScrubStartEmittedEvent
>;

type ScrubActorContext = {
  direction: ScrubDirection;
  max: number;
  min: number;
  parentActor: ParentActor | undefined;
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
  parentActor?: ParentActor;
};

export type {
  AttachEvent,
  DetachEvent,
  ErrorEvent,
  ScrubActorContext,
  ScrubActorEmittedEvent,
  ScrubActorEvent,
  ScrubActorInput,
  ScrubDirection,
  ScrubEmittedEvent,
  ScrubEndEmittedEvent,
  ScrubEndEvent,
  ScrubEvent,
  ScrubStartEmittedEvent,
  ScrubStartEvent,
  ScrubTrackOffset,
  ScrubTrackRect,
};
