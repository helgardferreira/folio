import type { VoiceItem } from '../types';

export const findDefaultVoiceItemIndex = (voiceItems: VoiceItem[]): number => {
  let defaultVoiceItemIndex = voiceItems.findIndex(
    (voiceItem) => voiceItem.voice.default
  );

  return defaultVoiceItemIndex === -1 ? 0 : defaultVoiceItemIndex;
};
