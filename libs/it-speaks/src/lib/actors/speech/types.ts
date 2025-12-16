import type { ScrubActorRef } from '../scrub/scrub.machine';
import type {
  ScrubEmittedEvent,
  ScrubEndEmittedEvent,
  ScrubStartEmittedEvent,
} from '../scrub/types';
import type { VoiceSelectorActorRef } from '../voice-selector/voice-selector.machine';

type SpeechActorContext = {
  muted: boolean;
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
  words: string[];
};

type BoundaryEvent = {
  type: 'BOUNDARY';
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
type SpeechErrorEvent = {
  type: 'ERROR';
  error: unknown;
};
type ToggleMuteEvent = {
  type: 'TOGGLE_MUTE';
};

type SpeechActorEvent =
  | BoundaryEvent
  | LoadEvent
  | PauseEvent
  | PlayEvent
  | ReloadEvent
  | ScrubEmittedEvent
  | ScrubEndEmittedEvent
  | ScrubStartEmittedEvent
  | SetVoiceEvent
  | SpeechErrorEvent
  | ToggleMuteEvent;

export type {
  BoundaryEvent,
  LoadEvent,
  PauseEvent,
  PlayEvent,
  ReloadEvent,
  SetVoiceEvent,
  SpeechActorContext,
  SpeechActorEvent,
  SpeechErrorEvent,
  ToggleMuteEvent,
};
