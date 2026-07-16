export function playCelebrationSound(enabled: boolean): void {
  if (!enabled || typeof AudioContext === 'undefined') return;
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(523.25, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(783.99, context.currentTime + 0.22);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.32);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.34);
  oscillator.addEventListener('ended', () => void context.close());
}
