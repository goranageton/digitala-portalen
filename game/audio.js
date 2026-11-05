// Web Audio Synthesizer supporting both "Default" and "Liquid" sound profiles + Professor Baltazar Retro Tunes
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.mode = 'liquid'; // 'default' | 'liquid'
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setEnabled(val) {
    this.enabled = Boolean(val);
  }

  setMode(mode) {
    this.mode = mode === 'default' ? 'default' : 'liquid';
  }

  // Upbeat cheerful chemistry lab theme tune
  playLabTheme() {
    return this.playBaltazarTheme();
  }

  // The cheerful bouncy lab melody
  playBaltazarTheme() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Classic cheerful upbeat 60s Zagreb Film cartoon melody
    // C - E - G - A - G - E - C - D - E - C
    const notes = [
      { f: 523.25, d: 0.14, t: 0.00 }, // C5
      { f: 659.25, d: 0.14, t: 0.15 }, // E5
      { f: 783.99, d: 0.18, t: 0.30 }, // G5
      { f: 880.00, d: 0.22, t: 0.48 }, // A5
      { f: 783.99, d: 0.18, t: 0.72 }, // G5
      { f: 659.25, d: 0.14, t: 0.92 }, // E5
      { f: 523.25, d: 0.14, t: 1.08 }, // C5
      { f: 587.33, d: 0.18, t: 1.24 }, // D5
      { f: 659.25, d: 0.20, t: 1.44 }, // E5
      { f: 523.25, d: 0.35, t: 1.66 }  // C5 (Hold)
    ];

    notes.forEach((n) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      // Vintage cartoon synth chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(0.001, now + n.t);
      gain.gain.linearRampToValueAtTime(0.2, now + n.t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.02);
    });
  }

  // Machine lever pull: gear ratchets + steam toot + drop pling!
  playLeverPull() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Ratchet clicks
    for (let i = 0; i < 4; i++) {
      const t = now + i * 0.045;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(420 + i * 60, t);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.04);
    }

    // 2. Whistle toot
    const wOsc = this.ctx.createOscillator();
    const wGain = this.ctx.createGain();
    wOsc.type = 'sine';
    wOsc.frequency.setValueAtTime(980, now + 0.2);
    wOsc.frequency.exponentialRampToValueAtTime(1400, now + 0.38);
    wGain.gain.setValueAtTime(0.001, now + 0.2);
    wGain.gain.linearRampToValueAtTime(0.15, now + 0.24);
    wGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
    wOsc.connect(wGain);
    wGain.connect(this.ctx.destination);
    wOsc.start(now + 0.2);
    wOsc.stop(now + 0.43);

    // 3. Magic drop "pling-plopp!"
    const dOsc = this.ctx.createOscillator();
    const dGain = this.ctx.createGain();
    dOsc.type = 'sine';
    dOsc.frequency.setValueAtTime(580, now + 0.45);
    dOsc.frequency.exponentialRampToValueAtTime(1250, now + 0.55);
    dGain.gain.setValueAtTime(0.24, now + 0.45);
    dGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    dOsc.connect(dGain);
    dGain.connect(this.ctx.destination);
    dOsc.start(now + 0.45);
    dOsc.stop(now + 0.66);
  }

  // Baltazar's "AHA! 💡" lightbulb moment sound
  playAha() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const chords = [659.25, 783.99, 1046.5]; // E5, G5, C6
    chords.forEach((f) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.46);
    });
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600 + Math.random() * 200, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.05);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.065);
  }

  playBubble() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const base = 350 + Math.random() * 250;
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.exponentialRampToValueAtTime(base * 1.8, now + 0.07);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playMascotWiggle() {
    this.playAha();
  }

  playSelect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (this.mode === 'liquid') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.085);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.06);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playDeselect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(310, now + 0.07);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playPour(units = 1, fillRatio = 0.5) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (this.mode === 'liquid') {
      const bubbleCount = Math.min(10, 4 + units * 2);
      const baseFreq = 260 + fillRatio * 260;

      for (let i = 0; i < bubbleCount; i++) {
        const t = now + i * 0.038;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const f = baseFreq + i * 42 + (Math.random() * 40 - 20);
        osc.frequency.setValueAtTime(f * 0.75, t);
        osc.frequency.exponentialRampToValueAtTime(f * 1.45, t + 0.045);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.16, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.052);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.058);
      }
    } else {
      const steps = Math.max(2, units + 1);
      for (let i = 0; i < steps; i++) {
        const t = now + i * 0.045;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(340 + i * 75, t);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.065);
      }
    }
  }

  playInvalid() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(170, now);
    osc.frequency.setValueAtTime(135, now + 0.07);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  playTubeComplete() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.048;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = this.mode === 'liquid' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.28);
    });
  }

  playLevelWin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const melody = [
      { f: 523.25, t: 0.0, d: 0.14 },
      { f: 659.25, t: 0.09, d: 0.14 },
      { f: 783.99, t: 0.18, d: 0.14 },
      { f: 1046.5, t: 0.27, d: 0.35 },
      { f: 987.77, t: 0.44, d: 0.14 },
      { f: 1046.5, t: 0.56, d: 0.45 },
      { f: 1318.5, t: 0.72, d: 0.6 }
    ];

    melody.forEach((n) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);
      gain.gain.setValueAtTime(0.2, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.02);
    });
  }
}

window.soundEngine = new SoundEngine();
