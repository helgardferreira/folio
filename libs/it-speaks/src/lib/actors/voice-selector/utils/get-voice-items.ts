import { LANGUAGE_VOICE_LOCALE_META } from '../constants';
import type { VoiceItem } from '../types';

export function getVoiceItems(voices: SpeechSynthesisVoice[]) {
  const mappableVoices = voices.filter(
    (voice) =>
      LANGUAGE_VOICE_LOCALE_META[voice.lang.split('-')[0]] !== undefined
  );

  const voiceItems = mappableVoices.map<VoiceItem>((voice) => {
    const { default: isDefault, lang, name, voiceURI } = voice;

    const languageCode = lang.split('-')[0];

    const { languageName, region, regionName } =
      LANGUAGE_VOICE_LOCALE_META[languageCode];

    const flagUrl = new URL(
      `../../../components/icons/flags/${region}.svg`,
      import.meta.url
    ).href;

    return {
      flagUrl,
      id: voiceURI,
      isDefault,
      languageCode,
      languageName,
      regionName,
      voiceName: name,
      voice,
    };
  });

  return voiceItems;
}
