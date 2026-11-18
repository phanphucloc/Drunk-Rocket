/**
 * Web Audio API 8-Bit Chiptune & Meme Synthesizer 2.5
 * Generates rich, humorous, punchy retro arcade sounds procedurally with 0 bytes external asset size!
 */
export class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.noiseBuffer = null;
    this.laserHumGain = null;
    this.laserBuzzOsc = null;
    this.laserCrackleSrc = null;
    this.laserCrackleFilter = null;
    this.currentAmbient = null;
    this.ambientGainNode = null;
    this.ambientRainSrc = null;
    this.ambientWindSrc = null;
    this.ambientSources = [];
    this.thunderTimer = 0;
    this.birdTimer = 0;
    this._bindUnlock();
  }

  _bindUnlock() {
    const unlock = () => {
      this._ensureContext();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().then(() => {
          if (this.currentAmbient && !this.ambientGainNode) {
            this.setAmbientTheme(this.currentAmbient, true);
          }
        }).catch(() => {});
      } else if (this.currentAmbient && !this.ambientGainNode) {
        this.setAmbientTheme(this.currentAmbient, true);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('pointerdown', unlock, { once: false, passive: true });
      window.addEventListener('keydown', unlock, { once: false, passive: true });
      window.addEventListener('touchstart', unlock, { once: false, passive: true });
    }
  }

  _ensureContext() {
    if (!this.ctx && typeof window !== 'undefined') {
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
    const bufferSize = Math.floor(this.ctx.sampleRate * 2.5); // 2.5s buffer
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

      // Layer 1: Drunken bubbly spring boing (triangle)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(160, now);
      osc1.frequency.linearRampToValueAtTime(420, now + 0.04);
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
   * Super cheerful crystalline "YEAHHH!" celebration:
   * 5-note rising chord cascade + shimmering bell high harmonics
   */
  playScore() {
    if (this.isMuted) return;
    this._ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Bright cheerful crystalline bells (C5 -> E5 -> G5 -> C6 -> E6 joyful cascade)
      const melody = [
        { freq: 523.25, time: 0.00, dur: 0.22 }, // C5 (Yee-)
        { freq: 659.25, time: 0.05, dur: 0.22 }, // E5 (-aa-)
        { freq: 783.99, time: 0.10, dur: 0.26 }, // G5 (-ahh-)
        { freq: 1046.50, time: 0.15, dur: 0.38 }, // C6 (HHH!)
        { freq: 1318.51, time: 0.20, dur: 0.42 }  // E6 (Sparkle harmonic)
      ];

      melody.forEach(m => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';

        const start = now + m.time;
        osc.frequency.setValueAtTime(m.freq, start);
        osc.frequency.exponentialRampToValueAtTime(m.freq * 1.05, start + m.dur);

        gain.gain.setValueAtTime(0.32, start);
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
        gain.gain.setValueAtTime(0.16, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.4);
      });

      // 3. Shimmering high-pitch sparkle "Ting!"
      const sparkleOsc = this.ctx.createOscillator();
      const sparkleGain = this.ctx.createGain();
      sparkleOsc.type = 'triangle';
      sparkleOsc.frequency.setValueAtTime(2093, now + 0.16); // C7
      sparkleOsc.frequency.linearRampToValueAtTime(3135, now + 0.35); // G7
      sparkleGain.gain.setValueAtTime(0.20, now + 0.16);
      sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      sparkleOsc.connect(sparkleGain);
      sparkleGain.connect(this.ctx.destination);
      sparkleOsc.start(now + 0.16);
      sparkleOsc.stop(now + 0.38);
    } catch (e) {}
  }

  /**
   * Sound when crashing into laser or boundary:
   * 1. Cú nổ va đập cực mạnh (Sub-bass + crunch)
   * 2. Đúng chuẩn 3 âm tiết rõ ràng: "QUÉO - QUÈO - QUEO" kéo dài, nhừa nhựa cợt nhã trêu ngươi!
   */
  playCrash() {
    if (this.isMuted) return;
    this._ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Initial Impact Thud & Debris Crunch
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(160, now);
      subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.35);
      subGain.gain.setValueAtTime(0.55, now);
      subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.35);

      const metalOsc = this.ctx.createOscillator();
      const metalGain = this.ctx.createGain();
      metalOsc.type = 'sawtooth';
      metalOsc.frequency.setValueAtTime(450, now);
      metalOsc.frequency.exponentialRampToValueAtTime(60, now + 0.28);
      metalGain.gain.setValueAtTime(0.35, now);
      metalGain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      metalOsc.connect(metalGain);
      metalGain.connect(this.ctx.destination);
      metalOsc.start(now);
      metalOsc.stop(now + 0.28);

      const noise = this._getNoiseBuffer();
      if (noise) {
        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = noise;
        const nFilter = this.ctx.createBiquadFilter();
        nFilter.type = 'lowpass';
        nFilter.frequency.setValueAtTime(900, now);
        nFilter.frequency.exponentialRampToValueAtTime(140, now + 0.32);
        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.4, now);
        nGain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);
        noiseSrc.connect(nFilter);
        nFilter.connect(nGain);
        nGain.connect(this.ctx.destination);
        noiseSrc.start(now);
        noiseSrc.stop(now + 0.32);
      }

      // 2. CHÍNH XÁC 3 ÂM TIẾT CỢT NHÃ ĐÃI GIỌNG:
      // Âm 1: "QUÉO" (nốt cao, vuốt trượt giễu cợt: F4 -> E4, 0.25s)
      // Âm 2: "QUÈO" (nốt tụt xuống trầm, kéo đãi dài: D4 -> C#4, 0.32s)
      // Âm 3: "QUEO..." (nốt tụt sâu, rung wah-wah nhừa nhựa bực mình: C4 -> G3, 0.65s)
      const syllables = [
        { name: 'QUÉO', startF: 370, endF: 340, startT: 0.18, dur: 0.26, lfoFreq: 7 },
        { name: 'QUÈO', startF: 310, endF: 275, startT: 0.50, dur: 0.32, lfoFreq: 6 },
        { name: 'QUEO', startF: 260, endF: 165, startT: 0.88, dur: 0.70, lfoFreq: 5 }
      ];

      syllables.forEach((s) => {
        const st = now + s.startT;

        // Double oscillator (sawtooth + triangle) tạo chất kèn đồng cartoon dày dặn
        [-6, 6].forEach(detune => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';

          // Slide tần số đãi giọng
          osc.frequency.setValueAtTime(s.startF, st);
          osc.frequency.exponentialRampToValueAtTime(s.endF, st + s.dur);
          osc.detune.setValueAtTime(detune, st);

          // LFO tạo hiệu ứng rung nhừa nhựa "wah-wah" trêu ngươi
          const lfo = this.ctx.createOscillator();
          const lfoGain = this.ctx.createGain();
          lfo.frequency.setValueAtTime(s.lfoFreq, st);
          lfoGain.gain.setValueAtTime(0.12, st);
          lfo.connect(gain.gain);

          gain.gain.setValueAtTime(0.35, st);
          gain.gain.linearRampToValueAtTime(0.40, st + s.dur * 0.35);
          gain.gain.exponentialRampToValueAtTime(0.001, st + s.dur);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          lfo.start(st);
          osc.start(st);
          lfo.stop(st + s.dur);
          osc.stop(st + s.dur);
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

      // 1. Phun lửa rồng gầm thét (Deep Combustion Roar via Noise + Bandpass Filter)
      const noise = this._getNoiseBuffer();
      if (noise) {
        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = noise;
        const fireFilter = this.ctx.createBiquadFilter();
        fireFilter.type = 'bandpass';
        fireFilter.frequency.setValueAtTime(350, now);
        fireFilter.frequency.linearRampToValueAtTime(850, now + 0.22);
        fireFilter.frequency.exponentialRampToValueAtTime(250, now + duration);
        fireFilter.Q.setValueAtTime(2.2, now);

        const fireGain = this.ctx.createGain();
        fireGain.gain.setValueAtTime(0.38, now);
        fireGain.gain.linearRampToValueAtTime(0.52, now + 0.18);
        fireGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        noiseSrc.connect(fireFilter);
        fireFilter.connect(fireGain);
        fireGain.connect(this.ctx.destination);

        noiseSrc.start(now);
        noiseSrc.stop(now + duration);
      }

      // 2. Tiếng gió vút lên xé toạc không gian (Sonic Wind Shear Whoosh)
      if (noise) {
        const windSrc = this.ctx.createBufferSource();
        windSrc.buffer = noise;
        const windFilter = this.ctx.createBiquadFilter();
        windFilter.type = 'highpass';
        windFilter.frequency.setValueAtTime(1100, now);
        windFilter.frequency.linearRampToValueAtTime(3800, now + 0.24);
        windFilter.frequency.exponentialRampToValueAtTime(500, now + duration);

        const windGain = this.ctx.createGain();
        windGain.gain.setValueAtTime(0.20, now);
        windGain.gain.linearRampToValueAtTime(0.46, now + 0.22);
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
      boomOsc.frequency.setValueAtTime(250, now);
      boomOsc.frequency.exponentialRampToValueAtTime(30, now + 0.55);

      boomGain.gain.setValueAtTime(0.58, now);
      boomGain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);

      boomOsc.connect(boomGain);
      boomGain.connect(this.ctx.destination);
      boomOsc.start(now);
      boomOsc.stop(now + 0.55);

      // 4. Shattering laser pillars impact crunch
      const shatterCount = isChain ? 2 : 1;
      for (let s = 0; s < shatterCount; s++) {
        const sTime = now + (s * 0.16);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(520 - s * 60, sTime);
        osc.frequency.exponentialRampToValueAtTime(50, sTime + 0.28);

        gain.gain.setValueAtTime(0.42, sTime);
        gain.gain.exponentialRampToValueAtTime(0.01, sTime + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(sTime);
        osc.stop(sTime + 0.28);
      }
    } catch (e) {}
  }

  /**
   * Sound effect for collecting floating energy cells:
   * Chuông pha lê đôi tinh khiết 880Hz + 1320Hz ngân vang trong trẻo!
   */
  playCellCollect() {
    if (this.isMuted) return;
    this._ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const crystalNotes = [880, 1320]; // A5 + E6 harmonic crystal pair
      crystalNotes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';

        const startTime = now + idx * 0.035;
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + 0.18);

        gain.gain.setValueAtTime(0.30, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.22);
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
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  /**
   * Fanfare Thẻ bài (Perk Draft):
   * Khúc kèn đồng khải hoàn tươi sáng khi mở và chọn thẻ nâng cấp!
   */
  playMedal() {
    if (this.isMuted) return;
    this._ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Tươi sáng rộn rã: F4 -> A4 -> C5 -> F5 khải hoàn
      const fanfare = [
        { f: 349.23, t: 0.00, d: 0.14 },
        { f: 440.00, t: 0.09, d: 0.14 },
        { f: 523.25, t: 0.18, d: 0.18 },
        { f: 698.46, t: 0.28, d: 0.40 }
      ];

      fanfare.forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const start = now + note.t;
        osc.frequency.setValueAtTime(note.f, start);

        gain.gain.setValueAtTime(0.32, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + note.d);
      });
    } catch (e) {}
  }

  /**
   * Sound when performing a daring Near-Miss close shave:
   * Tiếng quét laser kích thích adrenaline kết hợp xung điện rung sub-bass!
   */
  playNearMiss() {
    if (this.isMuted) return;
    this._ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // 1. Dramatic electric adrenaline laser chirp
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.18);

      gain.gain.setValueAtTime(0.38, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);

      // 2. Electric sub-bass rumble
      const sub = this.ctx.createOscillator();
      const sGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(130, now);
      sub.frequency.exponentialRampToValueAtTime(35, now + 0.22);
      sGain.gain.setValueAtTime(0.45, now);
      sGain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      sub.connect(sGain);
      sGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.22);
    } catch (e) {}
  }


  /**
   * Initializes the continuous electric proximity buzz & sizzling crackle audio graph ("xẹt xẹt")
   */
  _initLaserProximity() {
    if (!this.ctx || this.laserHumGain) return;
    try {
      const now = this.ctx.currentTime;
      // Master proximity gain node
      this.laserHumGain = this.ctx.createGain();
      this.laserHumGain.gain.setValueAtTime(0, now);

      // 1. Low-frequency AC electrical hum / buzz (65Hz sawtooth)
      this.laserBuzzOsc = this.ctx.createOscillator();
      this.laserBuzzOsc.type = 'sawtooth';
      this.laserBuzzOsc.frequency.setValueAtTime(65, now);

      const buzzFilter = this.ctx.createBiquadFilter();
      buzzFilter.type = 'bandpass';
      buzzFilter.frequency.setValueAtTime(140, now);
      buzzFilter.Q.setValueAtTime(4.0, now);

      const buzzGain = this.ctx.createGain();
      buzzGain.gain.setValueAtTime(0.22, now);

      this.laserBuzzOsc.connect(buzzFilter);
      buzzFilter.connect(buzzGain);
      buzzGain.connect(this.laserHumGain);
      this.laserBuzzOsc.start(now);

      // 2. Sizzling high-voltage electrical arcing crackle ("xẹt xẹt")
      const noise = this._getNoiseBuffer();
      if (noise) {
        this.laserCrackleSrc = this.ctx.createBufferSource();
        this.laserCrackleSrc.buffer = noise;
        this.laserCrackleSrc.loop = true;

        this.laserCrackleFilter = this.ctx.createBiquadFilter();
        this.laserCrackleFilter.type = 'bandpass';
        this.laserCrackleFilter.frequency.setValueAtTime(2600, now);
        this.laserCrackleFilter.Q.setValueAtTime(3.8, now);

        const crackleGain = this.ctx.createGain();
        crackleGain.gain.setValueAtTime(0.38, now);

        this.laserCrackleSrc.connect(this.laserCrackleFilter);
        this.laserCrackleFilter.connect(crackleGain);
        crackleGain.connect(this.laserHumGain);
        this.laserCrackleSrc.start(now);
      }

      this.laserHumGain.connect(this.ctx.destination);
    } catch (e) {}
  }

  /**
   * Dynamically modulates laser electric buzz volume and intensity based on rocket proximity (0.0 to 1.0)
   */
  updateLaserProximity(proximityNorm) {
    if (this.isMuted) {
      if (this.laserHumGain && this.ctx) {
        this.laserHumGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      }
      return;
    }
    this._ensureContext();
    if (!this.ctx) return;
    if (!this.laserHumGain) {
      this._initLaserProximity();
    }
    if (!this.laserHumGain) return;

    const now = this.ctx.currentTime;
    const clamped = Math.max(0, Math.min(1, proximityNorm));

    if (clamped > 0.03) {
      // Exponential rise: quiet when far away, rapid aggressive sizzle when brushing laser
      const targetGain = Math.min(0.38, Math.pow(clamped, 1.5) * 0.38);
      this.laserHumGain.gain.setTargetAtTime(targetGain, now, 0.035);

      if (this.laserCrackleFilter) {
        const targetFreq = 1800 + clamped * 2600;
        this.laserCrackleFilter.frequency.setTargetAtTime(targetFreq, now, 0.035);
      }
      if (this.laserBuzzOsc) {
        const targetPitch = 65 + clamped * 65;
        this.laserBuzzOsc.frequency.setTargetAtTime(targetPitch, now, 0.035);
      }
    } else {
      this.laserHumGain.gain.setTargetAtTime(0, now, 0.05);
    }
  }

  /**
   * Mutes laser proximity hum immediately on death, pause, or smash
   */

  /**
   * Sets and updates environmental ambient soundscape according to weather theme:
   * - birds (bình minh / hoàng hôn): Tiếng chim hót ríu rít tự nhiên, âm lượng to rõ
   * - wind (nắng / âm u): Tiếng gió thoảng êm dịu, sống động
   * - rain (trời mưa): Tiếng mưa rào dào dạt
   * - thunder (mưa giông): Tiếng mưa dồn dập + tiếng sấm sét rền vang giòn giã
   * - night (trời tối): Tiếng đêm vũ trụ huyền bí
   */
  setAmbientTheme(ambientType, force = false) {
    if (!force && this.currentAmbient === ambientType && this.ambientGainNode) return;
    this.currentAmbient = ambientType;
    if (this.isMuted) return;
    this._ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Fade out previous ambient if exists
      if (this.ambientGainNode) {
        try {
          this.ambientGainNode.gain.cancelScheduledValues(now);
          this.ambientGainNode.gain.setTargetAtTime(0, now, 0.35);
        } catch (e) {}
      }

      this.ambientGainNode = this.ctx.createGain();
      this.ambientGainNode.gain.setValueAtTime(0, now);
      // Khuếch đại âm lượng nền bầu trời: 0.65 (so với 0.24 trước đây)
      this.ambientGainNode.gain.linearRampToValueAtTime(0.65, now + 0.5);
      this.ambientGainNode.connect(this.ctx.destination);

      const noise = this._getNoiseBuffer();

      if (ambientType === 'rain' || ambientType === 'thunder') {
        if (noise) {
          const rainSrc = this.ctx.createBufferSource();
          rainSrc.buffer = noise;
          rainSrc.loop = true;

          const rainFilter = this.ctx.createBiquadFilter();
          rainFilter.type = 'bandpass';
          rainFilter.frequency.setValueAtTime(ambientType === 'thunder' ? 1500 : 1100, now);
          rainFilter.Q.setValueAtTime(0.7, now);

          rainSrc.connect(rainFilter);
          rainFilter.connect(this.ambientGainNode);
          rainSrc.start(now);
          this.ambientRainSrc = rainSrc;
        }
        if (ambientType === 'thunder') {
          this.thunderTimer = 1.2; // First thunder roll starts shortly after entering storm
        }
      } else if (ambientType === 'ocean' || ambientType === 'waves') {
        if (noise) {
          const oceanSrc = this.ctx.createBufferSource();
          oceanSrc.buffer = noise;
          oceanSrc.loop = true;

          // Bộ lọc lowpass tạo âm sắc dải trầm và trung cho tiếng sóng biển dạt dào
          const oceanFilter = this.ctx.createBiquadFilter();
          oceanFilter.type = 'lowpass';
          oceanFilter.frequency.setValueAtTime(540, now);
          oceanFilter.Q.setValueAtTime(1.5, now);

          // LFO dao động tần số thấp (~0.23Hz = 4.3s mỗi chu kỳ một con sóng vỗ bờ)
          const lfo = this.ctx.createOscillator();
          lfo.type = 'sine';
          lfo.frequency.setValueAtTime(0.23, now);

          // Điều tần (Filter Sweep): Sóng dâng trào lên tần số ~920Hz rồi rút êm dịu về ~180Hz
          const lfoFilterGain = this.ctx.createGain();
          lfoFilterGain.gain.setValueAtTime(370, now);
          lfo.connect(lfoFilterGain);
          lfoFilterGain.connect(oceanFilter.frequency);

          // Điều biên (Volume Swell): Âm lượng sóng biển dào dạt tương đương trời mưa (đạt đỉnh 1.0)
          const waveGain = this.ctx.createGain();
          waveGain.gain.setValueAtTime(0.72, now);
          const lfoGainMod = this.ctx.createGain();
          lfoGainMod.gain.setValueAtTime(0.28, now);
          lfo.connect(lfoGainMod);
          lfoGainMod.connect(waveGain.gain);

          oceanSrc.connect(oceanFilter);
          oceanFilter.connect(waveGain);
          waveGain.connect(this.ambientGainNode);

          oceanSrc.start(now);
          lfo.start(now);
          if (!this.ambientSources) this.ambientSources = [];
          this.ambientSources.push(oceanSrc, lfo);
        }
      } else if (ambientType === 'wind') {
        if (noise) {
          const windSrc = this.ctx.createBufferSource();
          windSrc.buffer = noise;
          windSrc.loop = true;

          const windFilter = this.ctx.createBiquadFilter();
          windFilter.type = 'lowpass';
          windFilter.frequency.setValueAtTime(480, now);

          windSrc.connect(windFilter);
          windFilter.connect(this.ambientGainNode);
          windSrc.start(now);
          this.ambientWindSrc = windSrc;
        }
      } else if (ambientType === 'birds') {
        // Gặp bình minh hoặc hoàng hôn: chim hót chào đón ngay lập tức!
        this.playBirdChirp();
        this.birdTimer = 2.0;
      } else if (ambientType === 'night') {
        const drone = this.ctx.createOscillator();
        const dGain = this.ctx.createGain();
        drone.type = 'sine';
        drone.frequency.setValueAtTime(80, now);
        dGain.gain.setValueAtTime(0.35, now);
        drone.connect(dGain);
        dGain.connect(this.ambientGainNode);
        drone.start(now);
      }
    } catch (e) {}
  }

  /**
   * Periodic procedural triggers for chirping birds & rumbling thunder
   */
  updateAmbientTick(dt) {
    if (this.isMuted || !this.ctx) return;

    if (this.currentAmbient === 'birds') {
      this.birdTimer -= dt;
      if (this.birdTimer <= 0) {
        this.playBirdChirp();
        // Líu lo ríu rít đều đặn mỗi 2s - 3.5s
        this.birdTimer = 2.0 + Math.random() * 1.5;
      }
    } else if (this.currentAmbient === 'thunder') {
      this.thunderTimer -= dt;
      if (this.thunderTimer <= 0) {
        this.playThunderClap();
        // Giông bão sấm rền mỗi 3.5s - 6s
        this.thunderTimer = 3.5 + Math.random() * 2.5;
      }
    }
  }

  /**
   * Procedural morning/twilight bird chirping ("líu lo ríu rít")
   * Âm lượng to rõ (0.42), trong trẻo, sinh động
   */
  playBirdChirp() {
    if (this.isMuted) return;
    this._ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Chuỗi 4 nốt chim hót líu lo thanh thót
      const notes = [
        { f: 2637, d: 0.08, g: 0.40 }, // E7
        { f: 3136, d: 0.09, g: 0.48 }, // G7
        { f: 3520, d: 0.09, g: 0.44 }, // A7
        { f: 2793, d: 0.12, g: 0.36 }  // F7
      ];

      notes.forEach((note, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';

        const st = now + idx * 0.075;
        osc.frequency.setValueAtTime(note.f, st);
        osc.frequency.exponentialRampToValueAtTime(note.f * 1.35, st + note.d * 0.65);

        gain.gain.setValueAtTime(note.g, st);
        gain.gain.exponentialRampToValueAtTime(0.001, st + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(st);
        osc.stop(st + note.d);
      });
    } catch (e) {}
  }

  /**
   * Procedural rolling thunder boom ("sấm sét rền vang rung chuyển không gian")
   * Âm lượng uy lực (0.85), sét đánh đanh và tiếng sấm rền dội dài
   */
  playThunderClap() {
    if (this.isMuted) return;
    this._ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // 1. Initial explosive lightning crackle
      const noise = this._getNoiseBuffer();
      if (noise) {
        const crackleSrc = this.ctx.createBufferSource();
        crackleSrc.buffer = noise;
        const crackleFilter = this.ctx.createBiquadFilter();
        crackleFilter.type = 'bandpass';
        crackleFilter.frequency.setValueAtTime(1200, now);
        crackleFilter.frequency.exponentialRampToValueAtTime(220, now + 0.4);

        const crackleGain = this.ctx.createGain();
        crackleGain.gain.setValueAtTime(0.75, now);
        crackleGain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

        crackleSrc.connect(crackleFilter);
        crackleFilter.connect(crackleGain);
        crackleGain.connect(this.ctx.destination);
        crackleSrc.start(now);
        crackleSrc.stop(now + 0.45);
      }

      // 2. Rolling deep sub-rumble boom
      const boom = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      boom.type = 'sawtooth';
      boom.frequency.setValueAtTime(140, now + 0.05);
      boom.frequency.exponentialRampToValueAtTime(28, now + 2.2);

      bGain.gain.setValueAtTime(0.85, now + 0.05);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      boom.connect(bGain);
      bGain.connect(this.ctx.destination);
      boom.start(now + 0.05);
      boom.stop(now + 2.2);
    } catch (e) {}
  }

  stopAmbient() {
    if (this.ambientGainNode && this.ctx) {
      try {
        this.ambientGainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
      } catch (e) {}
    }
    if (this.ambientSources && this.ambientSources.length > 0) {
      const now = this.ctx ? this.ctx.currentTime : 0;
      this.ambientSources.forEach(s => {
        try { s.stop(now + 0.2); } catch (e) {}
      });
      this.ambientSources = [];
    }
    this.currentAmbient = null;
  }

  stopLaserProximity() {
    if (this.laserHumGain && this.ctx) {
      this.laserHumGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.03);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const sound = new AudioSynthesizer();
