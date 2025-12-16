export const getLocalVoices = (): SpeechSynthesisVoice[] =>
  speechSynthesis.getVoices().filter((voice) => voice.localService);
