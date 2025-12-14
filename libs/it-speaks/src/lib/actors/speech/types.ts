import type { ScrubActorRef } from '../scrub/scrub.machine';
import type {
  ScrubEmittedEvent,
  ScrubEndEmittedEvent,
  ScrubStartEmittedEvent,
} from '../scrub/types';

type SpeechActorContext = {
  currentText: string;
  currentVoice: SpeechSynthesisVoice | undefined;
  length: number;
  percentage: number;
  rate: number;
  speedScrubActor: ScrubActorRef;
  utteranceRef: SpeechSynthesisUtterance | undefined;
  voices: SpeechSynthesisVoice[];
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
type VoiceChangedEvent = {
  type: 'VOICE_CHANGED';
  id: string;
};
type VoicesChangedEvent = {
  type: 'VOICES_CHANGED';
  voice: SpeechSynthesisVoice;
  voices: SpeechSynthesisVoice[];
};

type SpeechActorEvent =
  | BoundaryEvent
  | CancelEvent
  | LoadEvent
  | PauseEvent
  | PlayEvent
  | ReloadEvent
  | VoiceChangedEvent
  | VoicesChangedEvent
  | ScrubEmittedEvent
  | ScrubEndEmittedEvent
  | ScrubStartEmittedEvent;

export type {
  BoundaryEvent,
  CancelEvent,
  LoadEvent,
  PauseEvent,
  PlayEvent,
  ReloadEvent,
  SpeechActorContext,
  SpeechActorEvent,
  VoiceChangedEvent,
  VoicesChangedEvent,
};
