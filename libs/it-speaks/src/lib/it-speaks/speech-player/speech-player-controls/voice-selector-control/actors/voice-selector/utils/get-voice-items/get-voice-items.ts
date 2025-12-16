import { LANGUAGE_VOICE_LOCALE_META } from '../../../../constants';
import type { VoiceItem } from '../../types';

export function getVoiceItems(voices: SpeechSynthesisVoice[]) {
  const preferredLanguageCode = navigator.language.split('-')[0];

  const mappableVoices = voices.filter(
    (voice) =>
      LANGUAGE_VOICE_LOCALE_META[voice.lang.split('-')[0]] !== undefined
  );

  const voiceItems = mappableVoices.map<VoiceItem>((voice) => {
    const { default: isDefault, lang, name, voiceURI } = voice;

    const languageCode = lang.split('-')[0];

    const { languageName, region, regionName } =
      LANGUAGE_VOICE_LOCALE_META[languageCode];

    const flagUrl = new URL(`./flag-icons/${region}.svg`, import.meta.url).href;

    return {
      flagUrl,
      id: voiceURI,
      isDefault,
      languageCode,
      languageName,
      regionName,
      voiceName: name,
    };
  });

  return voiceItems.toSorted((a, b) => {
    if (a.isDefault) return -1;
    if (b.isDefault) return 1;

    if (a.languageCode === b.languageCode) {
      return a.voiceName.localeCompare(b.voiceName);
    }

    if (a.languageCode === preferredLanguageCode) return -1;
    if (b.languageCode === preferredLanguageCode) return 1;

    return a.languageCode.localeCompare(b.languageCode);
  });
}
