/**
 * Web Audio API 8-Bit Chiptune & Meme Synthesizer 2.0
 * Generates rich, humorous, punchy retro arcade sounds procedurally with 0 bytes external asset size!
 */
export class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.noiseBuffer = null;
  }

  _ensureContext() {
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

  _getNoiseBuffer() {
    if (this.noiseBuffer) return this.noiseBuffer;
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  /**
   * Sound when tapping engine thrust:
   * Layered drunk bubble-pop + mechanical thruster whoosh
   */
  playThrust() {
    if (this.isMuted) return;
    this._ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Layer 1: Drunken bubbly spring boing (triangle + sine)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(160, now);
      osc1.frequency.linearRampToValueAtTime(380, now + 0.04);
      osc1.frequency.exponentialRampToValueAtTime(80, now + 0.12);

      gain1.gain.setValueAtTime(0.24, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Layer 2: Little puff exhaust noise
      const noise = this._getNoiseBuffer();
      if (noise) {
        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = noise;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + 0.1);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.12, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        noiseSrc.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noiseSrc.start(now);
        noiseSrc.stop(now + 0.1);
      }
    } catch (e) {}
  }

  /**
   * Sound when clearing an obstacle (+1 point)
   * High-spirited, bright & sparkling "YEAHHH!" cheerful celebration:
   * Multi-voice joyful chords + bell sparkle chimes + rising pitch glide
   */
  playScore() {
    if (this.isMuted) return;
    this._ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Bright cheerful crystalline bells (C5 -> E5 -> G5 -> C6 -> E6 joyful cascade)
      const melody = [
        { freq: 523.25, time: 0.00, dur: 0.18 }, // C5 (Yee-)
        { freq: 659.25, time: 0.05, dur: 0.18 }, // E5 (-aa-)
        { freq: 783.99, time: 0.10, dur: 0.22 }, // G5 (-ahh-)
        { freq: 1046.50, time: 0.15, dur: 0.35 }, // C6 (HHH!)
        { freq: 1318.51, time: 0.20, dur: 0.40 }  // E6 (Sparkle harmonic)
      ];

      melody.forEach(m => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';

        const start = now + m.time;
        osc.frequency.setValueAtTime(m.freq, start);
        // Slight playful pitch vibrato upwards
        osc.frequency.exponentialRampToValueAtTime(m.freq * 1.04, start + m.dur);

        gain.gain.setValueAtTime(0.28, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + m.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + m.dur);
      });

      // 2. Warm harmonic synth body chord for fullness (C major triad undercoat)
      [261.63, 329.63, 392.00].forEach(rootFreq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const start = now + 0.06;
        osc.frequency.setValueAtTime(rootFreq, start);
        gain.gain.setValueAtTime(0.14, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.38);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.38);
      });

      // 3. Shimmering high-pitch sparkle "Ting!"
      const sparkleOsc = this.ctx.createOscillator();
      const sparkleGain = this.ctx.createGain();
      sparkleOsc.type = 'triangle';
      sparkleOsc.frequency.setValueAtTime(2093, now + 0.16); // C7
      sparkleOsc.frequency.linearRampToValueAtTime(3135, now + 0.35); // G7
      sparkleGain.gain.setValueAtTime(0.18, now + 0.16);
      sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      sparkleOsc.connect(sparkleGain);
      sparkleGain.connect(this.ctx.destination);
      sparkleOsc.start(now + 0.16);
      sparkleOsc.stop(now + 0.38);
    } catch (e) {}
  }

  /**
   * Sound when crashing into laser or boundary:
   * Dày dặn, trào lộng, kéo dài trêu ngươi!
   * Heavy comical cartoon "BONK / CRASH" + prolonged mocking descending "QUÉEEE-OOOO-OOHHH"
   */
  playCrash() {
    if (this.isMuted) return;
    this._ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Heavy bass thud / explosion punch
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.45);
      subGain.gain.setValueAtTime(0.48, now);
      subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.45);

      // 2. Cartoon metal spring clang + crunch
      const metalOsc = this.ctx.createOscillator();
      const metalGain = this.ctx.createGain();
      metalOsc.type = 'sawtooth';
      metalOsc.frequency.setValueAtTime(420, now);
      metalOsc.frequency.exponentialRampToValueAtTime(60, now + 0.35);
      metalGain.gain.setValueAtTime(0.32, now);
      metalGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      metalOsc.connect(metalGain);
      metalGain.connect(this.ctx.destination);
      metalOsc.start(now);
      metalStop(now + 0.35);

      // Noise debris burst
      const noise = this._getNoiseBuffer();
      if (noise) {
        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = noise;
        const nFilter = this.ctx.createBiquadFilter();
        nFilter.type = 'lowpass';
        nFilter.frequency.setValueAtTime(800, now);
        nFilter.frequency.exponentialRampToValueAtTime(120, now + 0.4);
        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.35, now);
        nGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        noiseSrc.connect(nFilter);
        nFilter.connect(nGain);
        nGain.connect(this.ctx.destination);
        noiseSrc.start(now);
        noiseSrc.stop(now + 0.4);
      }

      // 3. Comic prolonged mocking "QUÉEEEE-OÒOO-OOHHH" (Sad trombone trêu ngươi cực dày)
      // 4 dài nốt trêu chọc với vibrato rung bần bật:
      const mockingSlide = [
        { startF: 440, endF: 415.3, startT: 0.18, dur: 0.28 }, // Quéee-
        { startF: 392, endF: 369.9, startT: 0.50, dur: 0.30 }, // Oòoo-
        { startF: 349.2, endF: 329.6, startT: 0.84, dur: 0.34 }, // Oòhh-
        { startF: 311.1, endF: 160.0, startT: 1.22, dur: 0.65 }  // Queee-ooo-ooohhh (kéo dài đãi giọng)
      ];

      mockingSlide.forEach((note, idx) => {
        const st = now + note.startT;

        // Two oscillators slightly detuned (supersaw) for thick mocking brass sound
        [-5, 5].forEach(detune => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = idx === 3 ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(note.startF, st);
          osc.frequency.exponentialRampToValueAtTime(note.endF, st + note.dur);
          osc.detune.setValueAtTime(detune, st);

          // Hilarious wobble wah-wah tremolo
          const lfo = this.ctx.createOscillator();
          const lfoGain = this.ctx.createGain();
          lfo.frequency.setValueAtTime(idx === 3 ? 9 : 6, st); // faster wobble on the tail
          lfoGain.gain.setValueAtTime(0.08, st);
          lfo.connect(gain.gain);

          gain.gain.setValueAtTime(0.24, st);
          gain.gain.linearRampToValueAtTime(0.28, st + note.dur * 0.3);
          gain.gain.exponentialRampToValueAtTime(0.001, st + note.dur);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          lfo.start(st);
          osc.start(st);
          lfo.stop(st + note.dur);
          osc.stop(st + note.dur);
        });
      });
    } catch (e) {}
  }

  /**
   * Massive Supernova Smash sound effect:
   * 1) Tiếng bùng nổ phun lửa rồng dũng mãnh (Deep roaring thruster combustion)
   * 2) Tiếng rít gió vút lên xé toạc không gian (High-speed atmospheric sonic whoosh)
   * 3) Tiếng kim loại / cột vỡ vụn giòn giã (Pillar shatter impact)
   */
  playSmash(isChain = false) {
    if (this.isMuted) return;
    this._ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const duration = isChain ? 0.95 : 0.70;

      // 1. Phun lửa rồng gầm thét (Deep Combustion Roar via Low-pass Noise + Sub Rumble)
      const noise = this._getNoiseBuffer();
      if (noise) {
        // Flame burn noise layer
        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = noise;
        const fireFilter = this.ctx.createBiquadFilter();
        fireFilter.type = 'bandpass';
        fireFilter.frequency.setValueAtTime(350, now);
        fireFilter.frequency.linearRampToValueAtTime(800, now + 0.2);
        fireFilter.frequency.exponentialRampToValueAtTime(250, now + duration);
        fireFilter.Q.setValueAtTime(2.5, now);

        const fireGain = this.ctx.createGain();
        fireGain.gain.setValueAtTime(0.35, now);
        fireGain.gain.linearRampToValueAtTime(0.48, now + 0.15);
        fireGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        noiseSrc.connect(fireFilter);
        fireFilter.connect(fireGain);
        fireGain.connect(this.ctx.destination);

        noiseSrc.start(now);
        noiseSrc.stop(now + duration);
      }

      // 2. Tiếng gió vút lên xé gió thần tốc (Sonic Jet Whoosh / Wind Shear)
      if (noise) {
        const windSrc = this.ctx.createBufferSource();
        windSrc.buffer = noise;
        const windFilter = this.ctx.createBiquadFilter();
        windFilter.type = 'highpass';
        windFilter.frequency.setValueAtTime(1200, now);
        windFilter.frequency.linearRampToValueAtTime(3600, now + 0.25);
        windFilter.frequency.exponentialRampToValueAtTime(600, now + duration);

        const windGain = this.ctx.createGain();
        windGain.gain.setValueAtTime(0.18, now);
        windGain.gain.linearRampToValueAtTime(0.40, now + 0.22); // peak whoosh
        windGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        windSrc.connect(windFilter);
        windFilter.connect(windGain);
        windGain.connect(this.ctx.destination);

        windSrc.start(now);
        windSrc.stop(now + duration);
      }

      // 3. Sub-bass sonic boom shockwave
      const boomOsc = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      boomOsc.type = 'sawtooth';
      boomOsc.frequency.setValueAtTime(240, now);
      boomOsc.frequency.exponentialRampToValueAtTime(32, now + 0.55);

      boomGain.gain.setValueAtTime(0.55, now);
      boomGain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);

      boomOsc.connect(boomGain);
      boomGain.connect(this.ctx.destination);
      boomOsc.start(now);
      boomOsc.stop(now + 0.55);

      // 4. Shattering laser pillars impact crunch (Square glass/laser explosion)
      const shatterCount = isChain ? 2 : 1;
      for (let s = 0; s < shatterCount; s++) {
        const sTime = now + (s * 0.16);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(520 - s * 60, sTime);
        osc.frequency.exponentialRampToValueAtTime(55, sTime + 0.28);

        gain.gain.setValueAtTime(0.38, sTime);
        gain.gain.exponentialRampToValueAtTime(0.01, sTime + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(sTime);
        osc.stop(sTime + 0.28);
      }
    } catch (e) {}
  }

  /**
   * Sound effect for collecting floating energy cells (Bright cyber bell chime)
   */
  playCellCollect() {
    if (this.isMuted) return;
    this._ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Dual-tone harmonic crystal chime
      [880, 1320].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';

        osc.frequency.setValueAtTime(freq, now + idx * 0.02);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.6, now + 0.12);

        gain.gain.setValueAtTime(0.20, now + idx * 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.02);
        osc.stop(now + 0.14);
      });
    } catch (e) {}
  }

  playTap() {
    if (this.isMuted) return;
    this._ensureContext();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(920, now);
      osc.frequency.exponentialRampToValueAtTime(1440, now + 0.05);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  /**
   * Fanfare sound when opening perk draft cards or picking perk
   */
  playMedal() {
    if (this.isMuted) return;
    this._ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Victorious Brass Fanfare (F4 -> A4 -> C5 -> F5)
      const fanfare = [
        { f: 349.23, t: 0.00, d: 0.12 },
        { f: 440.00, t: 0.08, d: 0.12 },
        { f: 523.25, t: 0.16, d: 0.16 },
        { f: 698.46, t: 0.26, d: 0.35 }
      ];

      fanfare.forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const start = now + note.t;
        osc.frequency.setValueAtTime(note.f, start);

        gain.gain.setValueAtTime(0.26, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + note.d);
      });
    } catch (e) {}
  }

  /**
   * Sound when performing a daring Near-Miss close shave
   */
  playNearMiss() {
    if (this.isMuted) return;
    this._ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // Dramatic electric adrenaline laser chirp
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(2200, now + 0.16);

      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);

      // Electric sub rumble
      const sub = this.ctx.createOscillator();
      const sGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(120, now);
      sub.frequency.exponentialRampToValueAtTime(40, now + 0.18);
      sGain.gain.setValueAtTime(0.3, now);
      sGain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      sub.connect(sGain);
      sGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.18);
    } catch (e) {}
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const sound = new AudioSynthesizer();
