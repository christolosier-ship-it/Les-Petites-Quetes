export function speakText(text: string, enabled: boolean): void {
  if (!enabled || !('speechSynthesis' in globalThis)) return;
  globalThis.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = 0.9;
  globalThis.speechSynthesis.speak(utterance);
}
