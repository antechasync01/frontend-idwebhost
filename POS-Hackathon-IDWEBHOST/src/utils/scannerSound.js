// AURA SMART POS - POS Scanner Audio Synthesizer
// Generates realistic supermarket register barcode beeps via Web Audio API

export const playScannerBeep = () => {
  try {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // 1950 Hz clear high-frequency scanner chirp
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1950, ctx.currentTime);

    // Fast decay envelope for crisp POS beep
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // AudioContext autoplay restrictions or unsupported
    console.log('Scanner sound notice:', e.message);
  }
};

export default playScannerBeep;
