import type { ActorRef, Snapshot } from 'xstate';

type Direction = 'bottom-top' | 'left-right' | 'right-left' | 'top-bottom';

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

type ScrubActorContext = {
  direction: Direction;
  disable: boolean;
  max: number;
  min: number;
  parentActor: ParentActor | undefined;
  percentage: number;
  scrubTrack: Element | undefined;
  scrubTrackRect: ScrubTrackRect | undefined;
  value: number;
};

type ScrubActorInput = {
  direction: Direction;
  disable?: boolean;
  initialValue?: number;
  max?: number;
  min?: number;
  parentActor?: ParentActor;
};

type AttachEvent = {
  type: 'ATTACH';
  scrubTrack: Element;
};
type DetachEvent = {
  type: 'DETACH';
};
type DisableEvent = {
  type: 'DISABLE';
};
type EnableEvent = {
  type: 'ENABLE';
};
type ScrubDownEvent = {
  type: 'SCRUB_DOWN';
};
type ScrubEndEvent = {
  type: 'SCRUB_END';
  percentage: number;
  value: number;
};
type ScrubErrorEvent = {
  type: 'ERROR';
  error: unknown;
};
type ScrubEvent = {
  type: 'SCRUB';
  percentage: number;
  value: number;
};
type ScrubLeftEvent = {
  type: 'SCRUB_LEFT';
};
type ScrubRightEvent = {
  type: 'SCRUB_RIGHT';
};
type ScrubStartEvent = {
  type: 'SCRUB_START';
  clientX: number;
  clientY: number;
};
type ScrubUpEvent = {
  type: 'SCRUB_UP';
};
type SetPercentageEvent = {
  type: 'SET_PERCENTAGE';
  percentage: number;
  propagate?: boolean;
};
type SetValueEvent = {
  type: 'SET_VALUE';
  propagate?: boolean;
  value: number;
};

type ScrubActorEvent =
  | AttachEvent
  | DetachEvent
  | DisableEvent
  | EnableEvent
  | ScrubDownEvent
  | ScrubErrorEvent
  | ScrubEvent
  | ScrubLeftEvent
  | ScrubRightEvent
  | ScrubStartEvent
  | ScrubUpEvent
  | SetPercentageEvent
  | SetValueEvent;

type ScrubEmittedEvent = ScrubEvent & { id: string };
type ScrubEndEmittedEvent = ScrubEndEvent & { id: string };
type ScrubStartEmittedEvent = ScrubStartEvent & { id: string };

type ScrubActorEmittedEvent =
  | ScrubEmittedEvent
  | ScrubEndEmittedEvent
  | ScrubStartEmittedEvent;

type ParentActor = ActorRef<
  Snapshot<unknown>,
  ScrubEmittedEvent | ScrubEndEmittedEvent | ScrubStartEmittedEvent
>;

export type {
  AttachEvent,
  DetachEvent,
  Direction,
  DisableEvent,
  EnableEvent,
  ScrubActorContext,
  ScrubActorEmittedEvent,
  ScrubActorEvent,
  ScrubActorInput,
  ScrubDownEvent,
  ScrubEmittedEvent,
  ScrubEndEmittedEvent,
  ScrubEndEvent,
  ScrubErrorEvent,
  ScrubEvent,
  ScrubLeftEvent,
  ScrubRightEvent,
  ScrubStartEmittedEvent,
  ScrubStartEvent,
  ScrubTrackOffset,
  ScrubTrackRect,
  ScrubUpEvent,
  SetPercentageEvent,
  SetValueEvent,
};
