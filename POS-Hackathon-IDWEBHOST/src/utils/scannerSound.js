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

export const playSuccessChime = () => {
  try {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonious 3-note ascending chime (E5 -> G5 -> C6)
    const notes = [
      { freq: 659.25, time: 0, dur: 0.16 },
      { freq: 783.99, time: 0.1, dur: 0.20 },
      { freq: 1046.50, time: 0.22, dur: 0.40 },
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);
      gain.gain.setValueAtTime(0.18, now + time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur);
    });
  } catch (e) {
    console.log('Success chime notice:', e.message);
  }
};

export default playScannerBeep;
