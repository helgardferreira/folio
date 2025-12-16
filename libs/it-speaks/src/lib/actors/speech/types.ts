import type { ScrubActorRef } from '../scrub/scrub.machine';
import type {
  ScrubEmittedEvent,
  ScrubEndEmittedEvent,
  ScrubStartEmittedEvent,
} from '../scrub/types';
import type { VoiceSelectorActorRef } from '../voice-selector/voice-selector.machine';

type SpeechActorContext = {
  // TODO: maybe replace `length` with `words` array?
  length: number;
  progress: number;
  rate: number;
  speedScrubActor: ScrubActorRef;
  text: string;
  utterance: SpeechSynthesisUtterance | undefined;
  voice: SpeechSynthesisVoice | undefined;
  voiceSelectorActor: VoiceSelectorActorRef;
  volume: number;
  volumeScrubActor: ScrubActorRef;
  wordIndex: number;
  wordScrubActor: ScrubActorRef;
};

type BoundaryEvent = {
  type: 'BOUNDARY';
};
type CancelEvent = {
  type: 'CANCEL';
};
type ErrorEvent = {
  type: 'ERROR';
  error: unknown;
};
type LoadEvent = {
  type: 'LOAD';
  text: string;
};
type PauseEvent = {
  type: 'PAUSE';
};
type PlayEvent = {
  type: 'PLAY';
};
type ReloadEvent = {
  type: 'RELOAD';
};
type SetVoiceEvent = {
  type: 'SET_VOICE';
  voice: SpeechSynthesisVoice;
};

type SpeechActorEvent =
  | BoundaryEvent
  | CancelEvent
  | ErrorEvent
  | LoadEvent
  | PauseEvent
  | PlayEvent
  | ReloadEvent
  | ScrubEmittedEvent
  | ScrubEndEmittedEvent
  | ScrubStartEmittedEvent
  | SetVoiceEvent;

export type {
  BoundaryEvent,
  CancelEvent,
  ErrorEvent,
  LoadEvent,
  PauseEvent,
  PlayEvent,
  ReloadEvent,
  SetVoiceEvent,
  SpeechActorContext,
  SpeechActorEvent,
};
