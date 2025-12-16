export const findDefaultVoice = (
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | undefined => {
  let defaultVoice = voices.find((voice) => voice.default);
  if (defaultVoice !== undefined) return defaultVoice;

  defaultVoice = voices
    .filter((voice) => voice.lang === navigator.language)
    .at(0);
  if (defaultVoice !== undefined) return defaultVoice;

  return voices.at(0);
};
