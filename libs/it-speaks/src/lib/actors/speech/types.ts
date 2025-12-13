type SpeechActorContext = {
  currentText: string;
  currentVoice: SpeechSynthesisVoice | undefined;
  length: number;
  percentage: number; // percentage is normalized between 0 and 1
  rate: number;
  utteranceRef: SpeechSynthesisUtterance | undefined;
  voices: SpeechSynthesisVoice[];
  volume: number;
  wordIndex: number;

  // TODO: figure scrub actor composition out later
  // speedScrubActor: ScrubActorRef | undefined;
  // volumeScrubActor: ScrubActorRef | undefined;
  // wordScrubActor: ScrubActorRef | undefined;
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
  | VoicesChangedEvent;
// TODO: figure scrub actor composition out later
/*
  | WordStartScrubEvent
  | WordScrubEvent
  | WordEndScrubEvent
  | VolumeStartScrubEvent
  | VolumeScrubEvent
  | VolumeEndScrubEvent
  | SpeedStartScrubEvent
  | SpeedScrubEvent
  | SpeedEndScrubEvent
*/

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
