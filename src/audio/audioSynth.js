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
    // Nhạc nền theo địa danh (mỗi vùng miền một thang âm/tiết tấu riêng)
    this.musicTheme = null;
    this.musicGainNode = null;
    this.musicStepTimer = 0;
    this.musicDegree = 0;
    this.musicBeat = 0;
    // Âm lượng riêng: nhạc nền & hiệu ứng/môi trường (lưu lại giữa các lần chơi)
    this.musicVolume = 0.8;
    this.sfxVolume = 1.0;
    this.sfxGainNode = null;
    this.musicDuck = 1;
    this.MUSIC_BUS_GAIN = 0.7;   // độ to tổng của nhạc nền (0..1)
    try {
      const mv = parseFloat(localStorage.getItem('dieu_music_vol'));
      const sv = parseFloat(localStorage.getItem('dieu_sfx_vol'));
      if (!isNaN(mv)) this.musicVolume = Math.max(0, Math.min(1, mv));
      if (!isNaN(sv)) this.sfxVolume = Math.max(0, Math.min(1, sv));
    } catch (e) { /* bỏ qua */ }
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

  /** Bus chung cho hiệu ứng + môi trường (nhạc nền đi đường riêng). */
  _dest() {
    if (this.ctx && !this.sfxGainNode) this._ensureSfxBus();
    return this.sfxGainNode || this.ctx.destination;
  }

  _ensureSfxBus() {
    if (!this.ctx || this.sfxGainNode) return;
    try {
      const bus = this.ctx.createGain();
      bus.gain.value = this.isMuted ? 0 : this.sfxVolume;
      // Nối THẲNG ra loa — không dùng _dest() ở đây kẻo nối vào chính nó.
      bus.connect(this.ctx.destination);
      this.sfxGainNode = bus;
    } catch (e) { this.sfxGainNode = null; }
  }

  _ensureContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this._ensureSfxBus();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      const p = this.ctx.resume();
      if (p && p.then) p.then(() => this._applyMusicGain()).catch(() => {});
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
      gain1.connect(this._dest());
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
        noiseGain.connect(this._dest());

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
        gain.connect(this._dest());
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
        gain.connect(this._dest());
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
      sparkleGain.connect(this._dest());
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
      subGain.connect(this._dest());
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
      metalGain.connect(this._dest());
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
        nGain.connect(this._dest());
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
          gain.connect(this._dest());

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
        fireGain.connect(this._dest());

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
        windGain.connect(this._dest());

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
      boomGain.connect(this._dest());
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
        gain.connect(this._dest());
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
        gain.connect(this._dest());
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
      gain.connect(this._dest());
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
        gain.connect(this._dest());
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
      gain.connect(this._dest());
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
      sGain.connect(this._dest());
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

      this.laserHumGain.connect(this._dest());
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
      // Ambient nền vừa phải (0.42) để nhạc nền vùng miền vẫn nghe rõ
      this.ambientGainNode.gain.linearRampToValueAtTime(0.42, now + 0.5);
      this.ambientGainNode.connect(this._dest());

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
      // Sấm giờ do hệ thống thời tiết kích hoạt đúng lúc có tia sét (WeatherSystem.onLightning),
      // nên không tự phát ngẫu nhiên nữa để tránh sấm chồng tiếng và lệch với ánh chớp.
      this.thunderTimer = 0;
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
        gain.connect(this._dest());
        osc.start(st);
        osc.stop(st + note.d);
      });
    } catch (e) {}
  }

  /**
   * Sấm sét điện ảnh — dựng 3 lớp chồng nhau:
   *   1. Tiếng nổ đanh (crack): noise lọc highpass + đỉnh 2.4kHz, tắt rất nhanh
   *   2. Sấm rền (rumble): 2 lớp noise lọc lowpass quét tần số, bao hình dài
   *      với nhiều "đợt" ngẫu nhiên + LFO rung → cảm giác sấm lăn từ xa tới
   *   3. Cục sub trầm (30-60Hz) cho cảm giác rung ngực
   */
  playThunderClap(intensity = 1) {
    if (this.isMuted) return;
    this._ensureContext();
    if (!this.ctx) return;

    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const noise = this._getNoiseBuffer();
      if (!noise) return;

      const out = ctx.createGain();
      out.gain.value = Math.min(1.2, 0.9 * intensity);
      out.connect(ctx.destination);

      // ---- 1. Tiếng nổ đanh ----
      const crackSrc = ctx.createBufferSource();
      crackSrc.buffer = noise;
      const crackHp = ctx.createBiquadFilter();
      crackHp.type = 'highpass';
      crackHp.frequency.value = 700;
      const crackPeak = ctx.createBiquadFilter();
      crackPeak.type = 'peaking';
      crackPeak.frequency.value = 2400;
      crackPeak.Q.value = 0.7;
      crackPeak.gain.value = 10;
      const crackGain = ctx.createGain();
      crackGain.gain.setValueAtTime(0.0001, now);
      crackGain.gain.exponentialRampToValueAtTime(0.95, now + 0.008);
      crackGain.gain.exponentialRampToValueAtTime(0.16, now + 0.13);
      crackGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.45);
      crackSrc.connect(crackHp);
      crackHp.connect(crackPeak);
      crackPeak.connect(crackGain);
      crackGain.connect(out);
      crackSrc.start(now, Math.random() * 1.2);
      crackSrc.stop(now + 0.5);

      // ---- 2. Sấm rền nhiều đợt ----
      const rumbleLayer = (delay, dur, f0, f1, peak, wobble) => {
        const src = ctx.createBufferSource();
        src.buffer = noise;
        src.loop = true;

        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(f0, now + delay);
        lp.frequency.exponentialRampToValueAtTime(f1, now + delay + dur);
        lp.Q.value = 0.85;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now + delay);
        gain.gain.exponentialRampToValueAtTime(peak, now + delay + 0.2);
        // Những đợt sấm lăn tiếp theo (to nhỏ ngẫu nhiên)
        let t = 0.45;
        while (t < dur - 0.7) {
          gain.gain.setValueAtTime(peak * (0.35 + Math.random() * 0.65), now + delay + t);
          t += 0.32 + Math.random() * 0.55;
        }
        gain.gain.exponentialRampToValueAtTime(0.0008, now + delay + dur);

        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.5 + Math.random() * 0.9;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = wobble;
        lfo.connect(lfoGain);
        lfoGain.connect(lp.frequency);

        src.connect(lp);
        lp.connect(gain);
        gain.connect(out);
        src.start(now + delay);
        lfo.start(now + delay);
        src.stop(now + delay + dur + 0.1);
        lfo.stop(now + delay + dur + 0.1);
      };

      rumbleLayer(0.03, 3.6, 480, 110, 0.75, 90);
      rumbleLayer(0.34, 4.4, 240, 60, 0.6, 45);

      // ---- 3. Cục sub trầm ----
      const sub = ctx.createOscillator();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(62, now + 0.02);
      sub.frequency.exponentialRampToValueAtTime(30, now + 2.6);
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.0001, now + 0.02);
      subGain.gain.exponentialRampToValueAtTime(0.5, now + 0.12);
      subGain.gain.exponentialRampToValueAtTime(0.0006, now + 2.8);
      sub.connect(subGain);
      subGain.connect(out);
      sub.start(now + 0.02);
      sub.stop(now + 2.9);
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

  /**
   * Đổi "bộ nhạc" theo địa danh. Crossfade ~1.1s để không bị cắt cụt.
   * cfg = { id, root, scale:[semitone...], step, lead, bassEvery, gain, filter }
   */
  setMusicTheme(cfg, force = false) {
    if (!cfg) return;
    if (!force && this.musicTheme && cfg.id === this.musicTheme.id) return;
    this.musicTheme = cfg;
    this._ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const old = this.musicGainNode;
      if (old) {
        old.gain.cancelScheduledValues(now);
        old.gain.setTargetAtTime(0, now, 0.25);
        setTimeout(() => { try { old.disconnect(); } catch (e) {} }, 1500);
      }

      const g = this.ctx.createGain();
      const target = this._musicTargetGainFor(cfg);
      g.gain.setValueAtTime(force ? target : 0.0001, now);
      if (!force) g.gain.setTargetAtTime(target, now, 0.35);
      g.connect(this.ctx.destination);
      this.musicGainNode = g;
      this.musicStepTimer = 0.05;
      this.musicDegree = Math.floor((cfg.scale || []).length / 2);
      this.musicBeat = 0;
    } catch (e) { /* bỏ qua lỗi audio */ }
  }

  /** Một nốt nhạc synth ngắn (có lọc thông thấp cho êm). */
  _musicNote(freq, dur, peak, type, when, filterHz = 2400) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(filterHz, when);
    osc.type = type || 'triangle';
    osc.frequency.setValueAtTime(freq, when);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.linearRampToValueAtTime(Math.max(0.001, peak), when + 0.014);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(filt);
    filt.connect(gain);
    gain.connect(this.musicGainNode);
    osc.start(when);
    osc.stop(when + dur + 0.06);
  }

  /** Nhịp nhạc: gọi mỗi frame, tự phát nốt theo bước thời gian của theme. */
  updateMusicTick(dt) {
    if (this.isMuted || !this.ctx || !this.musicTheme || !this.musicGainNode) return;

    const cfg = this.musicTheme;
    const step = cfg.step || 0.34;
    this.musicStepTimer -= dt;
    if (this.musicStepTimer > 0) return;
    this.musicStepTimer = step;

    try {
      const scale = cfg.scale && cfg.scale.length ? cfg.scale : [0, 2, 4, 7, 9];
      // bước đi mềm trên thang âm (không nhảy loạn)
      this.musicDegree += Math.random() < 0.5 ? 1 : -1;
      if (this.musicDegree < 0) this.musicDegree = 0;
      if (this.musicDegree >= scale.length) this.musicDegree = scale.length - 1;

      const base = cfg.root || 220;
      const octave = Math.random() < 0.18 ? 2 : 1;
      const freq = base * Math.pow(2, scale[this.musicDegree] / 12) * octave;
      const when = this.ctx.currentTime + 0.02;
      this._musicNote(freq, step * 1.5, 0.5, cfg.lead || 'triangle', when, cfg.filter || 2400);

      this.musicBeat += 1;
      if (this.musicBeat % (cfg.bassEvery || 6) === 0) {
        this._musicNote(base * 0.5, step * 4.5, 0.75, 'sine', when, 800);
      }
    } catch (e) { /* bỏ qua */ }
  }

  /** Đặt âm lượng nhạc nền (0..1). */
  setMusicVolume(v) {
    this.musicVolume = Math.max(0, Math.min(1, v));
    try { localStorage.setItem('dieu_music_vol', String(this.musicVolume)); } catch (e) {}
    this._applyMusicGain();
  }

  /** Đặt âm lượng hiệu ứng + môi trường (0..1). */
  setSfxVolume(v) {
    this.sfxVolume = Math.max(0, Math.min(1, v));
    try { localStorage.setItem('dieu_sfx_vol', String(this.sfxVolume)); } catch (e) {}
    if (this.sfxGainNode && this.ctx) {
      try { this.sfxGainNode.gain.setTargetAtTime(this.isMuted ? 0 : this.sfxVolume, this.ctx.currentTime, 0.1); } catch (e) {}
    }
  }

  /** Giảm nhạc tạm thời (1 = bình thường, 0.35 = đang pause, mở popup). */
  setMusicDuck(factor = 1) {
    this.musicDuck = Math.max(0, Math.min(1, factor));
    this._applyMusicGain();
  }

  _musicTargetGainFor(cfg) {
    if (this.isMuted) return 0;
    const balance = cfg && cfg.gain ? Math.min(1.15, cfg.gain / 0.16) : 1;
    return this.MUSIC_BUS_GAIN * balance * this.musicVolume * (this.musicDuck === undefined ? 1 : this.musicDuck);
  }

  _musicTargetGain() {
    if (this.isMuted) return 0;
    // cân bằng nhẹ giữa các vùng (gain 0.14–0.18 trong themes.js)
    const cfg = this.musicTheme;
    const balance = cfg && cfg.gain ? Math.min(1.15, cfg.gain / 0.16) : 1;
    const base = this.MUSIC_BUS_GAIN * balance;
    return base * this.musicVolume * (this.musicDuck === undefined ? 1 : this.musicDuck);
  }

  _applyMusicGain() {
    if (!this.ctx || !this.musicGainNode) return;
    try {
      this.musicGainNode.gain.setTargetAtTime(this._musicTargetGain(), this.ctx.currentTime, 0.15);
    } catch (e) {}
  }

  /** Tiếng "lên dây" khi diều lên cấp (mỗi vòng một cao độ khác nhau). */
  playKiteUpgrade(stage = 1) {
    if (this.isMuted) return;
    this._ensureContext();
    if (!this.ctx) return;
    try {
      const roots = [392.0, 440.0, 493.9, 523.3, 587.3]; // G4 A4 B4 C5 D5
      const root = roots[Math.max(0, Math.min(roots.length - 1, stage - 1))];
      const now = this.ctx.currentTime;
      const steps = [0, 4, 7, 12];
      steps.forEach((semi, i) => {
        const f = root * Math.pow(2, semi / 12);
        const when = now + i * 0.085;
        const dur = 0.28 + i * 0.05;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = i === steps.length - 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(f, when);
        gain.gain.setValueAtTime(0.0001, when);
        gain.gain.linearRampToValueAtTime(0.16, when + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
        osc.connect(gain);
        gain.connect(this._dest());
        osc.start(when);
        osc.stop(when + dur + 0.05);
      });
      // tiếng trầm "uỳnh" nhẹ cho có lực
      const boom = this.ctx.createOscillator();
      const bg = this.ctx.createGain();
      boom.type = 'sine';
      boom.frequency.setValueAtTime(120, now);
      boom.frequency.exponentialRampToValueAtTime(58, now + 0.45);
      bg.gain.setValueAtTime(0.0001, now);
      bg.gain.linearRampToValueAtTime(0.22, now + 0.02);
      bg.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      boom.connect(bg);
      bg.connect(this._dest());
      boom.start(now);
      boom.stop(now + 0.55);
    } catch (e) { /* bỏ qua */ }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.ctx) {
      const now = this.ctx.currentTime;
      const musicTarget = this.isMuted ? 0 : ((this.musicTheme && this.musicTheme.gain) || 0.18);
      try {
        if (this.musicGainNode) this.musicGainNode.gain.setTargetAtTime(musicTarget, now, 0.12);
        if (this.sfxGainNode) this.sfxGainNode.gain.setTargetAtTime(this.isMuted ? 0 : this.sfxVolume, now, 0.12);
        if (this.ambientGainNode) this.ambientGainNode.gain.setTargetAtTime(this.isMuted ? 0 : 0.42, now, 0.12);
      } catch (e) { /* bỏ qua */ }
    }
    return this.isMuted;
  }
}

export const sound = new AudioSynthesizer();
