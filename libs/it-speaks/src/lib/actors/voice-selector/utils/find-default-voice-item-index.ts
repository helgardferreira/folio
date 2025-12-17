import type { VoiceItem } from '../types';

export const findDefaultVoiceItemIndex = (voiceItems: VoiceItem[]): number => {
  let defaultVoiceItemIndex = voiceItems.findIndex(
    (voiceItem) => voiceItem.voice.default
  );

  /*
   * Most of the local `SpeechSynthesisVoice` instances sound pretty awful.
   *
   * This fallback provides a potential "sane" default in case no actual default
   * can be determined via the `SpeechSynthesisVoice`: `default` property.
   */
  if (defaultVoiceItemIndex === -1) {
    defaultVoiceItemIndex = voiceItems.findIndex((voiceItem) =>
      voiceItem.voiceName.includes('Samantha')
    );
  }

  return defaultVoiceItemIndex === -1 ? 0 : defaultVoiceItemIndex;
};
