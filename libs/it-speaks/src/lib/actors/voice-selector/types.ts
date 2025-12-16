import type { ActorRef, Snapshot } from 'xstate';

type VoiceItem = {
  flagUrl: string;
  id: string;
  isDefault: boolean;
  languageCode: string;
  languageName: string;
  regionName: string;
  voice: SpeechSynthesisVoice;
  voiceName: string;
};

type ParentActor = ActorRef<
  Snapshot<unknown>,
  { type: 'SET_VOICE'; voice: SpeechSynthesisVoice }
>;

type VoiceSelectorActorContext = {
  activeVoiceIndex: number;
  activeVoiceItem: VoiceItem | undefined;
  parentActor: ParentActor;
  selectedVoiceItem: VoiceItem | undefined;
  voiceItems: VoiceItem[];
};

type VoiceSelectorActorInput = {
  parentActor: ParentActor;
};

type MoveDownEvent = {
  type: 'MOVE_DOWN';
};
type MoveFirstEvent = {
  type: 'MOVE_FIRST';
};
type MoveLastEvent = {
  type: 'MOVE_LAST';
};
type MoveUpEvent = {
  type: 'MOVE_UP';
};
type SelectEvent = {
  type: 'SELECT';
  id?: string;
};
type SetVoicesEvent = {
  type: 'SET_VOICES';
  voices: SpeechSynthesisVoice[];
};

type VoiceSelectorActorEvent =
  | MoveDownEvent
  | MoveFirstEvent
  | MoveLastEvent
  | MoveUpEvent
  | SelectEvent
  | SetVoicesEvent;

export type {
  MoveDownEvent,
  MoveFirstEvent,
  MoveLastEvent,
  MoveUpEvent,
  SelectEvent,
  SetVoicesEvent,
  VoiceItem,
  VoiceSelectorActorContext,
  VoiceSelectorActorEvent,
  VoiceSelectorActorInput,
};
