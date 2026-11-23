/**
 * Hệ thống thời tiết sống (Living Weather) — Drunk Rocket 2.7
 * =====================================================================
 * Vì mỗi màn địa danh là một bức tranh riêng phủ kín màn hình, thời tiết
 * được vẽ ĐÈ LÊN tranh và còn **đổi cả bầu trời của tranh** cho khớp khí hậu:
 *
 *   1. drawSky()        -> đổi sắc trời (khử màu + nhuộm tông + tăng/giảm sáng)
 *                          rồi vẽ mây / sao / nắng / chim  (trên tranh, dưới nhân vật)
 *   2. drawForeground() -> mưa / tuyết / tia sét             (trên nhân vật, dưới HUD)
 *   3. drawOverlay()    -> chớp sáng + vignette điện ảnh     (trên cùng)
 *
 * ---------------------------------------------------------------------
 * MUỐN THÊM MỘT KIỂU THỜI TIẾT MỚI:
 *   - Thêm 1 dòng vào PRESETS: { label, ambient, sky:{...}, global:{...}, effects:[...] }
 *   - Nếu cần hiệu ứng mới: thêm 1 hàm vào EFFECTS (khai báo update / sky / fg)
 *   Không phải sửa chỗ nào khác.
 *
 * MUỐN THÊM MÀN HÌNH MỚI:
 *   - Khai báo `weatherStage: { horizon: 0.6 }` trong TIER_THEMES (themes.js)
 *     horizon = tỉ lệ chiều cao nơi bầu trời kết thúc (đường chân trời).
 *   - Không khai báo cũng chạy được (mặc định 0.55).
 * =====================================================================
 */

// ---------------------------------------------------------------------
// Bảng hiệu ứng: mỗi hiệu ứng khai báo hàm cập nhật và hàm vẽ (nếu có)
// ---------------------------------------------------------------------
const EFFECTS = {
  sun: { sky: '_fxSun' },
  clouds: { sky: '_fxClouds' },
  stars: { sky: '_fxStars', update: '_updStars' },
  birds: { sky: '_fxBirds', update: '_updBirds' },
  fog: { sky: '_fxFog' },
  rain: { fg: '_fxRain', update: '_updRain' },
  snow: { fg: '_fxSnow', update: '_updSnow' },
  lightning: { fg: '_fxLightning', update: '_updLightning' }
};

// ---------------------------------------------------------------------
// Bảng thời tiết: mọi thông số đều khai báo ở đây (dễ thêm / sửa)
//   sky.desat  : 0..1  khử bão hoà màu bầu trời (biến trời cam hoàng hôn thành trời xám)
//   sky.top/bottom + sky.hue : nhuộm lại màu trời (chế độ blend "color")
//   sky.shade  : { color, blend, strength } tăng/giảm độ sáng bầu trời
//   global     : lớp phủ toàn cảnh nhẹ (giữ "chất" của mỗi vùng miền)
// ---------------------------------------------------------------------
const PRESETS = {
  sun: {
    label: 'Nắng vàng',
    ambient: 'birds',
    bloom: 0.10,
    sky: {
      desat: 0.10,
      groundDesat: 0.2,
      top: '#8fc3ea',
      bottom: '#ffd9a0',
      hue: 0.35,
      overcast: 0,
      shade: { color: '#fff0c8', blend: 'screen', strength: 0.14, ground: 0.9 }
    },
    global: { color: '#ffb45c', blend: 'screen', strength: 0.10 },
    effects: ['sun', 'birds']
  },
  clouds: {
    label: 'Âm u',
    ambient: 'wind',
    bloom: 0.07,
    sky: {
      desat: 0.62,
      groundDesat: 0.45,
      top: '#6b7b90',
      bottom: '#9fabb9',
      hue: 0.82,
      overcast: 0.45,
      shade: { color: '#8794a6', blend: 'multiply', strength: 0.30, ground: 0.75 }
    },
    global: { color: '#4a5a74', blend: 'multiply', strength: 0.16 },
    effects: ['clouds']
  },
  rain: {
    label: 'Mưa rào',
    ambient: 'rain',
    bloom: 0.17,
    sky: {
      desat: 0.86,
      groundDesat: 0.78,
      top: '#37455c',
      bottom: '#6d7f96',
      hue: 0.92,
      overcast: 0.62,
      shade: { color: '#5f6f84', blend: 'multiply', strength: 0.40, ground: 0.80 }
    },
    global: { color: '#34527f', blend: 'multiply', strength: 0.18 },
    effects: ['clouds', 'rain']
  },
  storm: {
    label: 'Mưa giông',
    ambient: 'thunder',
    bloom: 0.20,
    sky: {
      desat: 0.92,
      groundDesat: 0.82,
      top: '#1d2338',
      bottom: '#3b4358',
      hue: 0.96,
      overcast: 0.82,
      shade: { color: '#3d465c', blend: 'multiply', strength: 0.55, ground: 0.85 }
    },
    global: { color: '#1c2752', blend: 'multiply', strength: 0.22 },
    effects: ['clouds', 'rain', 'lightning']
  },
  stars: {
    label: 'Đêm sao',
    ambient: 'night',
    bloom: 0.45,
    sky: {
      desat: 0.88,
      groundDesat: 0.70,
      top: '#101a42',
      bottom: '#2a3a6e',
      hue: 0.96,
      overcast: 0,
      shade: { color: '#26305c', blend: 'multiply', strength: 0.60, ground: 0.72 }
    },
    global: { color: '#101a44', blend: 'multiply', strength: 0.24 },
    effects: ['stars']
  },
  snow: {
    label: 'Mưa tuyết',
    ambient: 'wind',
    bloom: 0.10,
    sky: {
      desat: 0.82,
      groundDesat: 0.62,
      top: '#8fa6be',
      bottom: '#cfdcea',
      hue: 0.85,
      overcast: 0.35,
      shade: { color: '#c9d8e8', blend: 'screen', strength: 0.20, ground: 0.85 }
    },
    global: { color: '#cfdcee', blend: 'multiply', strength: 0.10 },
    effects: ['clouds', 'snow']
  },
  fog: {
    label: 'Sương mù',
    ambient: 'wind',
    bloom: 0.08,
    sky: {
      desat: 0.70,
      groundDesat: 0.55,
      top: '#93a3b2',
      bottom: '#c3ced9',
      hue: 0.80,
      overcast: 0.35,
      shade: { color: '#d3dde6', blend: 'screen', strength: 0.14, ground: 0.9 }
    },
    global: { color: '#cfdae6', blend: 'multiply', strength: 0.08 },
    effects: ['fog', 'clouds']
  },
  birds: {
    label: 'Chim trời',
    ambient: 'birds',
    bloom: 0.05,
    sky: {
      desat: 0.08,
      groundDesat: 0.15,
      hue: 0.15,
      overcast: 0,
      shade: { color: '#ffcf9e', blend: 'screen', strength: 0.08, ground: 0.9 }
    },
    global: { color: '#ffb07a', blend: 'screen', strength: 0.06 },
    effects: ['birds']
  }
};

export const WEATHER_TYPES = Object.keys(PRESETS);
export const WEATHER_LABELS = WEATHER_TYPES.reduce((acc, key) => {
  acc[key] = PRESETS[key].label;
  return acc;
}, {});

const DEFAULT_STAGE = { horizon: 0.55 };

export class WeatherSystem {
  constructor(width = 400, height = 700) {
    this.width = width;
    this.height = height;
    this.stage = { ...DEFAULT_STAGE };

    this.types = WEATHER_TYPES.slice();
    this.current = 'birds';
    this.previous = 'birds';
    this.alpha = 0;
    this.phase = 'in';
    this.phaseTimer = 0;
    this.holdTime = 30;
    this.fadeIn = 2.2;
    this.fadeOut = 2.2;
    this.time = 0;

    this.ambient = PRESETS.birds.ambient;
    this.onAmbientChange = null;
    this.onLightning = null;
    this.onChange = null;

    // Canvas tạm để lấy "nguồn sáng" trước khi đổi khí hậu (bloom cho đèn đóm)
    this._scratch = null;
    this._scratchCtx = null;

    // Giông bão
    this.flash = 0;
    this.strobeTimer = 0;
    this.strikeTimer = 4;
    this.strikeX = width * 0.5;
    this.bolts = [];
    this.thunderDelay = -1;

    this._rain = [];
    this._snow = [];
    this._stars = [];
    this._clouds = [];
    this._fog = [];
    this._birds = [];
    this._motes = [];
    this._splashes = [];
    this._shooting = null;
    this._shootTimer = 2;

    this._sprites = {};
    this._supportsColorBlend = this._detectColorBlend();
    this._buildParticles();
    this._buildSprites();
  }

  // Trình duyệt có hỗ trợ chế độ blend "saturation" / "color" không?
  // (nếu không, hệ thống tự lùi về cách phủ màu multiply/screen như cũ)
  _detectColorBlend() {
    try {
      const cv = document.createElement('canvas');
      const g = cv.getContext('2d');
      g.globalCompositeOperation = 'saturation';
      return g.globalCompositeOperation === 'saturation';
    } catch (e) {
      return false;
    }
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this._scratch = null;
    this._scratchCtx = null;
    this._buildParticles();
    this._buildSprites();
  }

  // Khai báo "sân khấu" của màn hiện tại (đường chân trời) để đổi màu trời cho đúng chỗ
  setStage(stage) {
    this.stage = Object.assign({ ...DEFAULT_STAGE }, this.stage, stage || {});
  }

  // Mỗi màn hình có thời tiết đặc trưng; đổi màn thì phần lớn thời gian ưu tiên
  // đúng thời tiết đó, còn lại để chu kỳ tự nhiên tiếp diễn (thời tiết đi lại khắp nơi).
  setTheme(theme) {
    if (!theme) return;
    if (theme.weatherStage) this.setStage(theme.weatherStage);
    const wanted = theme.weather;
    if (!wanted || !PRESETS[wanted]) return;
    if (wanted === this.current) {
      this._applyAmbient();
      return;
    }
    if (this.alpha < 0.2 || Math.random() < 0.55) {
      this.setWeather(wanted, true);
    }
  }

  setWeather(type, immediate = false) {
    if (!PRESETS[type]) return;
    if (type === this.current && !immediate) return;
    this.previous = this.current;
    this.current = type;
    this.phase = immediate ? 'hold' : 'in';
    this.alpha = immediate ? 1 : 0;
    this.phaseTimer = this.holdTime + Math.random() * 14;
    this.flash = 0;
    this.bolts = [];
    this.strikeTimer = 2 + Math.random() * 3;
    this._applyAmbient();
    if (typeof this.onChange === 'function') {
      try { this.onChange(type, PRESETS[type].label); } catch (e) { /* bỏ qua */ }
    }
  }

  _applyAmbient() {
    const preset = PRESETS[this.current];
    if (!preset) return;
    const next = preset.ambient;
    if (next === this.ambient) return;
    this.ambient = next;
    if (typeof this.onAmbientChange === 'function') {
      try { this.onAmbientChange(next); } catch (e) { /* bỏ qua */ }
    }
  }

  _nextWeather() {
    const pool = this.types.filter(t => t !== this.current && t !== this.previous);
    const next = pool[Math.floor(Math.random() * pool.length)] || 'sun';
    this.previous = this.current;
    this.current = next;
    this.phase = 'in';
    this.alpha = 0;
    this.phaseTimer = this.holdTime + Math.random() * 14;
    this.flash = 0;
    this.bolts = [];
    if (next === 'storm') this.strikeTimer = 1.5 + Math.random() * 2;
    this._applyAmbient();
    if (typeof this.onChange === 'function') {
      try { this.onChange(next, PRESETS[next].label); } catch (e) { /* bỏ qua */ }
    }
  }

  get effects() {
    const preset = PRESETS[this.current];
    return (preset && preset.effects) || [];
  }

  get label() {
    return PRESETS[this.current] ? PRESETS[this.current].label : '';
  }

  get isDark() {
    const preset = PRESETS[this.current];
    if (!preset || !preset.sky || !preset.sky.shade) return false;
    return preset.sky.shade.blend === 'multiply' && preset.sky.shade.strength * this.alpha > 0.2;
  }

  // ------------------------------------------
  // DỰNG HẠT & SPRITE
  // ------------------------------------------
  _buildParticles() {
    const w = this.width;
    const h = this.height;
    const rnd = (i) => {
      const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
      return v - Math.floor(v);
    };

    this._rain = [];
    for (let i = 0; i < 170; i++) {
      this._rain.push({
        x: rnd(i + 1) * (w + 140) - 70,
        y: rnd(i + 21) * h,
        len: 12 + rnd(i + 41) * 16,
        speed: 520 + rnd(i + 61) * 320,
        drift: -60 - rnd(i + 81) * 70
      });
    }

    this._snow = [];
    for (let i = 0; i < 120; i++) {
      this._snow.push({
        x: rnd(i + 5) * w,
        y: rnd(i + 25) * h,
        r: 1 + rnd(i + 45) * 2.6,
        vy: 18 + rnd(i + 65) * 34,
        sway: 0.4 + rnd(i + 85) * 1.2,
        phase: rnd(i + 105) * 6.28
      });
    }

    this._stars = [];
    for (let i = 0; i < 66; i++) {
      this._stars.push({
        x: rnd(i + 9) * w,
        y: rnd(i + 29) * h * 0.62,
        r: 0.7 + rnd(i + 49) * 1.5,
        phase: rnd(i + 69) * 6.28,
        speed: 1.2 + rnd(i + 89) * 1.8
      });
    }

    this._clouds = [];
    for (let i = 0; i < 7; i++) {
      this._clouds.push({
        x: rnd(i + 3) * w,
        y: h * (0.03 + rnd(i + 23) * 0.42),
        w: w * (0.5 + rnd(i + 43) * 0.7),
        h: h * (0.09 + rnd(i + 63) * 0.10),
        speed: 8 + rnd(i + 83) * 14,
        alpha: 0.35 + rnd(i + 103) * 0.35
      });
    }

    this._fog = [];
    for (let i = 0; i < 6; i++) {
      this._fog.push({
        x: rnd(i + 7) * w,
        y: h * (0.42 + rnd(i + 27) * 0.46),
        w: w * (0.7 + rnd(i + 47) * 0.8),
        h: h * (0.10 + rnd(i + 67) * 0.12),
        speed: 5 + rnd(i + 87) * 9,
        alpha: 0.18 + rnd(i + 107) * 0.22
      });
    }

    this._birds = [];
    for (let i = 0; i < 8; i++) {
      this._birds.push({
        x: rnd(i + 11) * w,
        y: h * (0.10 + rnd(i + 31) * 0.30),
        s: 3.4 + rnd(i + 51) * 2.6,
        speed: 46 + rnd(i + 71) * 34,
        phase: rnd(i + 91) * 6.28
      });
    }

    this._motes = [];
    for (let i = 0; i < 26; i++) {
      this._motes.push({
        x: rnd(i + 13) * w,
        y: rnd(i + 33) * h,
        r: 1.4 + rnd(i + 53) * 2.4,
        phase: rnd(i + 73) * 6.28
      });
    }

    this._splashes = [];
  }

  _buildSprites() {
    this._sprites.cloudLight = this._softSprite(96, 'rgba(226, 232, 244, 1)', 'rgba(226, 232, 244, 0)');
    this._sprites.cloudDark = this._softSprite(96, 'rgba(46, 54, 78, 1)', 'rgba(46, 54, 78, 0)');
    this._sprites.cloudStorm = this._softSprite(96, 'rgba(24, 28, 52, 1)', 'rgba(24, 28, 52, 0)');
    this._sprites.fog = this._softSprite(128, 'rgba(226, 236, 248, 1)', 'rgba(226, 236, 248, 0)');
    this._sprites.glow = this._softSprite(64, 'rgba(255, 244, 200, 1)', 'rgba(255, 210, 120, 0)');
  }

  _softSprite(size, inner, outer) {
    const cv = document.createElement('canvas');
    cv.width = size;
    cv.height = size;
    const g = cv.getContext('2d');
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, inner);
    grad.addColorStop(0.55, inner.replace(/,\s*1\)$/, ', 0.55)'));
    grad.addColorStop(1, outer);
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    return cv;
  }

  // ------------------------------------------
  // CẬP NHẬT
  // ------------------------------------------
  update(dt) {
    this.time += dt;

    if (this.phase === 'in') {
      this.alpha += dt / this.fadeIn;
      if (this.alpha >= 1) {
        this.alpha = 1;
        this.phase = 'hold';
      }
    } else if (this.phase === 'hold') {
      this.phaseTimer -= dt;
      if (this.phaseTimer <= 0) this.phase = 'out';
    } else {
      this.alpha -= dt / this.fadeOut;
      if (this.alpha <= 0) {
        this.alpha = 0;
        this._nextWeather();
      }
    }

    // Chạy các hàm update của hiệu ứng đang bật
    for (const name of this.effects) {
      const fx = EFFECTS[name];
      if (fx && fx.update) this[fx.update](dt);
    }

    if (this.thunderDelay >= 0) {
      this.thunderDelay -= dt;
      if (this.thunderDelay <= 0) {
        this.thunderDelay = -1;
        if (typeof this.onLightning === 'function') {
          try { this.onLightning(); } catch (e) { /* bỏ qua */ }
        }
      }
    }
  }

  _updRain(dt) {
    const h = this.height;
    const w = this.width;
    const count = this.current === 'storm' ? this._rain.length : 110;
    for (let i = 0; i < count; i++) {
      const d = this._rain[i];
      d.y += d.speed * dt;
      d.x += d.drift * dt;
      if (d.y > h + 20) {
        d.y = -30;
        d.x = Math.random() * (w + 140) - 40;
      }
    }

    if (this.alpha > 0.2 && Math.random() < dt * 26) {
      this._splashes.push({ x: Math.random() * w, y: h * (0.70 + Math.random() * 0.3), r: 1, life: 1 });
    }
    for (let i = this._splashes.length - 1; i >= 0; i--) {
      const s = this._splashes[i];
      s.life -= dt * 2.2;
      s.r += dt * 18;
      if (s.life <= 0) this._splashes.splice(i, 1);
    }
  }

  _updSnow(dt) {
    const h = this.height;
    const w = this.width;
    for (const f of this._snow) {
      f.y += f.vy * dt;
      f.phase += dt * f.sway;
      f.x += Math.sin(f.phase) * 18 * dt;
      if (f.y > h + 6) {
        f.y = -8;
        f.x = Math.random() * w;
      }
    }
  }

  _updStars(dt) {
    const w = this.width;
    const h = this.height;
    this._shootTimer -= dt;
    if (this._shootTimer <= 0 && !this._shooting) {
      this._shootTimer = 4 + Math.random() * 6;
      this._shooting = {
        x: Math.random() * w * 0.7,
        y: Math.random() * h * 0.25,
        vx: 240 + Math.random() * 160,
        vy: 120 + Math.random() * 80,
        life: 1
      };
    }
    if (this._shooting) {
      const s = this._shooting;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.life -= dt * 1.6;
      if (s.life <= 0 || s.x > w + 60 || s.y > h) this._shooting = null;
    }
  }

  _updBirds(dt) {
    const w = this.width;
    const h = this.height;
    for (const b of this._birds) {
      b.x += b.speed * dt;
      b.phase += dt * 9;
      if (b.x > w + 40) {
        b.x = -40;
        b.y = h * (0.10 + Math.random() * 0.30);
      }
    }
  }

  _updLightning(dt) {
    this.strikeTimer -= dt;
    if (this.strikeTimer <= 0) {
      this._triggerStrike();
      this.strikeTimer = 3.4 + Math.random() * 3.4;
    }
    if (this.flash > 0) {
      this.flash = Math.max(0, this.flash - dt * 2.4);
      this.strobeTimer -= dt;
      if (this.flash === 0) this.bolts = [];
    }
  }

  _triggerStrike() {
    this.flash = 1;
    this.strobeTimer = 0.46;
    const w = this.width;
    this.strikeX = w * (0.15 + Math.random() * 0.7);
    const endX = this.strikeX + (Math.random() * 150 - 75);
    const endY = this.height * (0.55 + Math.random() * 0.4);
    this.bolts = [this._bolt(this.strikeX, -20, endX, endY, 9, 24)];
    const main = this.bolts[0];
    if (main.length > 4) {
      const node = main[3];
      this.bolts.push(this._bolt(node.x, node.y, node.x + (Math.random() * 120 - 60), node.y + 120, 5, 16));
    }
    if (main.length > 6) {
      const node = main[5];
      this.bolts.push(this._bolt(node.x, node.y, node.x + (Math.random() * 90 - 45), node.y + 90, 4, 12));
    }
    this.thunderDelay = 0.25 + Math.random() * 0.5;
  }

  _bolt(x1, y1, x2, y2, segments, jitter) {
    const pts = [{ x: x1, y: y1 }];
    const dx = (x2 - x1) / segments;
    const dy = (y2 - y1) / segments;
    for (let i = 1; i < segments; i++) {
      pts.push({
        x: x1 + dx * i + (Math.random() * jitter * 2 - jitter),
        y: y1 + dy * i + (Math.random() * jitter * 0.5 - jitter * 0.25)
      });
    }
    pts.push({ x: x2, y: y2 });
    return pts;
  }

  // ------------------------------------------
  // ĐỔI KHÍ HẬU CHO BẦU TRỜI CỦA TRANH
  // ------------------------------------------
  _skyBand() {
    const h = this.height;
    const horizon = Math.max(0.25, Math.min(0.85, this.stage.horizon || 0.55));
    return { horizon, hz: h * horizon };
  }

  _relightSky(ctx, preset, a) {
    const w = this.width;
    const h = this.height;
    const sky = preset.sky || {};
    const { hz } = this._skyBand();

    if (this._supportsColorBlend) {
      // 1) Khử bão hoà: trời cam hoàng hôn sẽ thành trời xám khi mưa
      if (sky.desat) {
        const g = ctx.createLinearGradient(0, 0, 0, h);
        const topA = Math.min(1, sky.desat * a);
        const groundA = topA * (sky.groundDesat !== undefined ? sky.groundDesat : 0.45);
        g.addColorStop(0, `rgba(128,128,128,${topA})`);
        g.addColorStop(Math.min(0.92, (hz / h) * 0.92), `rgba(128,128,128,${topA})`);
        g.addColorStop(Math.min(0.99, hz / h + 0.06), `rgba(128,128,128,${groundA})`);
        g.addColorStop(1, `rgba(128,128,128,${groundA * 0.7})`);
        ctx.save();
        ctx.globalCompositeOperation = 'saturation';
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }

      // 2) Nhuộm lại màu trời theo khí hậu (tan dần qua đường chân trời để không lộ đường cắt)
      if (sky.top && sky.bottom) {
        const band = hz * 1.22;
        const g = ctx.createLinearGradient(0, 0, 0, band);
        g.addColorStop(0, sky.top);
        g.addColorStop(Math.min(0.98, hz / band), sky.bottom);
        g.addColorStop(1, this._hexToRgba(sky.bottom, 0));
        ctx.save();
        ctx.globalCompositeOperation = 'color';
        ctx.globalAlpha = Math.min(1, (sky.hue !== undefined ? sky.hue : 0.9) * a);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, band);
        ctx.restore();
      }
    } else {
      // Trình duyệt không hỗ trợ blend "color": phủ màu trực tiếp lên vùng trời
      const g = ctx.createLinearGradient(0, 0, 0, hz);
      g.addColorStop(0, sky.top || '#6b7b90');
      g.addColorStop(1, sky.bottom || '#9fabb9');
      ctx.save();
      ctx.globalAlpha = Math.min(1, 0.55 * a);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, hz);
      ctx.restore();
    }

    // 3) Tăng / giảm độ sáng: rải mượt suốt chiều cao (trời mạnh, mặt đất nhẹ hơn)
    //    nhờ vậy không còn "lát cắt" ở đường chân trời.
    if (sky.shade && sky.shade.strength) {
      const strength = Math.min(1, sky.shade.strength * a);
      const groundFactor = sky.shade.ground !== undefined ? sky.shade.ground : 0.75;
      const col = this._hexToRgbParts(sky.shade.color);
      const g = ctx.createLinearGradient(0, 0, 0, h);
      const hzRatio = Math.min(0.96, hz / h);
      g.addColorStop(0, `rgba(${col},${strength})`);
      g.addColorStop(hzRatio, `rgba(${col},${strength * 0.9})`);
      g.addColorStop(Math.min(1, hzRatio + (1 - hzRatio) * 0.55), `rgba(${col},${strength * groundFactor})`);
      g.addColorStop(1, `rgba(${col},${strength * groundFactor * 0.85})`);
      ctx.save();
      ctx.globalCompositeOperation = sky.shade.blend === 'screen' ? 'screen' : 'multiply';
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    // 4) Lớp phủ toàn cảnh nhẹ (giữ chất riêng từng vùng miền)
    const g2 = preset.global;
    if (g2 && g2.strength) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, g2.strength * a);
      ctx.globalCompositeOperation = g2.blend === 'screen' ? 'screen' : 'multiply';
      ctx.fillStyle = g2.color;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    // 5) Dải sương mờ nơi trời tiếp giáp mặt đất (làm mềm đường chân trời)
    if (sky.bottom) {
      const band = h * 0.12;
      const g3 = ctx.createLinearGradient(0, hz - band, 0, hz + band * 0.7);
      g3.addColorStop(0, 'rgba(0,0,0,0)');
      g3.addColorStop(0.5, this._hexToRgba(sky.bottom, 0.24 * a));
      g3.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save();
      ctx.fillStyle = g3;
      ctx.fillRect(0, hz - band, w, band * 1.7);
      ctx.restore();
    }
  }

  _hexToRgbParts(hex) {
    if (!hex || hex[0] !== '#') return '160,170,185';
    const v = hex.length === 4
      ? [parseInt(hex[1] + hex[1], 16), parseInt(hex[2] + hex[2], 16), parseInt(hex[3] + hex[3], 16)]
      : [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
    return `${v[0]},${v[1]},${v[2]}`;
  }

  _hexToRgba(hex, alpha) {
    if (!hex || hex[0] !== '#') return `rgba(160,170,185,${alpha})`;
    const v = hex.length === 4
      ? [parseInt(hex[1] + hex[1], 16), parseInt(hex[2] + hex[2], 16), parseInt(hex[3] + hex[3], 16)]
      : [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
    return `rgba(${v[0]},${v[1]},${v[2]},${alpha})`;
  }

  // ------------------------------------------
  // VẼ
  // ------------------------------------------
  drawSky(ctx) {
    if (this.alpha <= 0.02) return;
    const preset = PRESETS[this.current];
    if (!preset) return;
    const w = this.width;
    const h = this.height;
    const bloom = preset.bloom || 0;

    // Chụp khung hình GỐC (trước khi đổi khí hậu). Sau khi làm tối, ta nhân nó với
    // khung đã tối để chỉ giữ lại những điểm vốn đã sáng (đèn, cửa sổ, cầu rồng)
    // → chúng phát sáng trở lại, còn bầu trời ban ngày bị tối thì không bị bạc màu.
    if (this.forceLowEnd !== undefined) this._lowEnd = this.forceLowEnd;
    let hasGlow = false;
    this._bloomTick = ((this._bloomTick || 0) + 1) % 2;
    const lowEnd = this._lowEnd !== undefined ? this._lowEnd :
      ((navigator.deviceMemory && navigator.deviceMemory <= 4) ||
       (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4));
    this._lowEnd = lowEnd;

    // Chỉ chụp lại khung mỗi 2 frame nhưng VẪN composite mọi frame bằng bản đã lưu
    // (trước đây bỏ cả composite ở frame lẻ -> quầng sáng nhấp nháy, rõ nhất ban đêm).
    if (bloom > 0.02 && ctx.canvas && !lowEnd && this._bloomTick === 0) {
      this._ensureScratch();
      this._scratchCtx.setTransform(1, 0, 0, 1, 0, 0);
      this._scratchCtx.globalCompositeOperation = 'source-over';
      this._scratchCtx.clearRect(0, 0, this._scratch.width, this._scratch.height);
      this._scratchCtx.drawImage(ctx.canvas, 0, 0, this._scratch.width, this._scratch.height);
      this._glowReady = true;
    }
    hasGlow = !!(bloom > 0.02 && ctx.canvas && !lowEnd && this._glowReady);

    ctx.save();
    this._relightSky(ctx, preset, this.alpha);

    for (const name of this.effects) {
      const fx = EFFECTS[name];
      if (fx && fx.sky) this[fx.sky](ctx, this.alpha);
    }

    if (hasGlow && bloom > 0.02 && ctx.canvas) {
      const sw = this._scratch.width;
      const sh = this._scratch.height;

      // Khung đã đổi khí hậu (bản thu nhỏ)
      const g = this._glowCtx;
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalCompositeOperation = 'source-over';
      g.clearRect(0, 0, sw, sh);
      g.drawImage(ctx.canvas, 0, 0, sw, sh);

      // Ước lượng độ sáng khung hình (12 frame/lần): cảnh càng tối thì cho phép
      // bloom càng mạnh, cảnh ban ngày thì giảm để không bị bạc màu.
      this._lumaTimer = (this._lumaTimer || 0) - 1;
      if (this._lumaTimer <= 0) {
        this._lumaTimer = 24;
        try {
          const data = g.getImageData(0, 0, sw, sh).data;
          let sum = 0;
          let n = 0;
          for (let i = 0; i < data.length; i += 28) {
            sum += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
            n++;
          }
          if (n) this._luma = sum / n;
        } catch (e) { /* canvas bị chặn đọc pixel thì bỏ qua */ }
      }
      const brightnessFactor = Math.max(0.22, Math.min(1, 1.05 - (this._luma || 0.4) * 2.4));

      // glow = gốc × đã-tối  → chỉ vùng sáng còn sót lại mới được cộng
      this._scratchCtx.globalCompositeOperation = 'multiply';
      this._scratchCtx.drawImage(this._glow, 0, 0);
      this._scratchCtx.globalCompositeOperation = 'source-over';

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.min(0.85, bloom * 2.0 * brightnessFactor * this.alpha);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(this._scratch, 0, 0, w, h);
      ctx.restore();
    }
    ctx.restore();
  }

  // Hai canvas nhỏ 1/4: một bản thu nhỏ khung hình, một bản "ngưỡng sáng" (bình phương)
  _ensureScratch() {
    const lowEnd = (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
                   (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    this._lowEnd = !!lowEnd;
    const div = lowEnd ? 8 : 6;
    const sw = Math.max(1, Math.round(this.width / div));
    const sh = Math.max(1, Math.round(this.height / div));
    if (this._scratch && this._scratch.width === sw && this._scratch.height === sh &&
      this._glow && this._glow.width === sw && this._glow.height === sh) return;

    const make = () => {
      const cv = document.createElement('canvas');
      cv.width = sw;
      cv.height = sh;
      return cv;
    };
    this._scratch = make();
    // willReadFrequently: bắt buộc cho canvas bị getImageData (nếu không sẽ rất chậm)
    this._scratchCtx = this._scratch.getContext('2d', { willReadFrequently: true });
    this._glow = make();
    this._glowCtx = this._glow.getContext('2d', { willReadFrequently: true });
  }

  drawForeground(ctx) {
    if (this.alpha <= 0.02) return;
    ctx.save();
    for (const name of this.effects) {
      const fx = EFFECTS[name];
      if (fx && fx.fg) this[fx.fg](ctx, this.alpha);
    }
    ctx.restore();
  }

  drawOverlay(ctx) {
    if (this.alpha <= 0.02) return;
    const a = this.alpha;
    const w = this.width;
    const h = this.height;

    const moody = this.current === 'storm' || this.current === 'stars' || this.current === 'rain' || this.current === 'fog';
    if (moody) {
      const vig = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.36, w * 0.5, h * 0.5, Math.max(w, h) * 0.78);
      vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vig.addColorStop(1, this.current === 'fog' ? `rgba(30, 44, 60, ${0.20 * a})` : `rgba(3, 6, 18, ${0.34 * a})`);
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
    }

    if (this.current === 'storm' && this.flash > 0.02) {
      const flicker = Math.sin(this.strobeTimer * 34) > -0.25 ? 1 : 0.45;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = `rgba(210, 236, 255, ${Math.min(0.26, this.flash * 0.24 * flicker) * a})`;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }
  }

  // ------------------------------------------
  // HIỆU ỨNG: BẦU TRỜI
  // ------------------------------------------
  _fxSun(ctx, a) {
    const w = this.width;
    const h = this.height;
    const { hz } = this._skyBand();
    const sx = w * 0.72;
    const sy = hz * 0.34;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.26 * a;

    const grad = ctx.createRadialGradient(sx, sy, 4, sx, sy, h * 0.34);
    grad.addColorStop(0, 'rgba(255, 246, 196, 0.85)');
    grad.addColorStop(0.3, 'rgba(255, 208, 110, 0.32)');
    grad.addColorStop(1, 'rgba(255, 190, 90, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = 0.10 * a;
    const rays = 9;
    for (let i = 0; i < rays; i++) {
      const ang = this.time * 0.06 + (i / rays) * Math.PI * 2;
      const len = h * 0.9;
      ctx.fillStyle = 'rgba(255, 236, 170, 0.45)';
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + Math.cos(ang - 0.035) * len, sy + Math.sin(ang - 0.035) * len);
      ctx.lineTo(sx + Math.cos(ang + 0.035) * len, sy + Math.sin(ang + 0.035) * len);
      ctx.closePath();
      ctx.fill();
    }

    ctx.globalAlpha = 0.32 * a;
    const glow = this._sprites.glow;
    for (const m of this._motes) {
      const x = m.x + Math.sin(this.time * 0.5 + m.phase) * 16;
      const y = m.y - ((this.time * 12 + m.phase * 30) % (h * 0.8));
      const r = m.r * 3.2;
      ctx.drawImage(glow, x - r / 2, y - r / 2, r, r);
    }
    ctx.restore();
  }

  _fxClouds(ctx, a) {
    const preset = PRESETS[this.current];
    const sky = (preset && preset.sky) || {};
    const { hz } = this._skyBand();
    const w = this.width;
    const h = this.height;

    // 1) Mây dày kín trời: mưa / giông phải phủ kín bầu trời chứ không phải vài đám lẻ tẻ
    if (sky.overcast) {
      const tone = this.current === 'storm' ? '#1f2438'
        : this.current === 'rain' ? '#39455b'
          : this.current === 'clouds' ? '#8794a6' : '#c3ced9';
      const g = ctx.createLinearGradient(0, 0, 0, hz * 1.12);
      const topA = Math.min(0.9, sky.overcast * a);
      g.addColorStop(0, this._hexToRgba(tone, topA));
      g.addColorStop(0.62, this._hexToRgba(tone, topA * 0.78));
      g.addColorStop(1, this._hexToRgba(tone, 0));
      ctx.save();
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, hz * 1.12);
      ctx.restore();
    }

    const sprite = this.current === 'storm'
      ? this._sprites.cloudStorm
      : (this.current === 'rain' ? this._sprites.cloudDark : this._sprites.cloudLight);
    if (!sprite) return;
    const strength = this.current === 'storm' ? 0.9 : (this.current === 'rain' ? 0.75 : 0.45);

    ctx.save();
    for (const c of this._clouds) {
      ctx.globalAlpha = Math.min(1, c.alpha * strength * a);
      const cw = c.w;
      const ch = c.h * 2.1;
      ctx.drawImage(sprite, c.x - cw / 2, c.y - ch / 2, cw, ch);
    }

    // 2) Thêm các đám mây lớn phủ ngang trời khi mưa / giông
    if (this.current === 'rain' || this.current === 'storm' || this.current === 'fog') {
      const extra = this.current === 'storm' ? 9 : 6;
      for (let i = 0; i < extra; i++) {
        const speed = 7 + (i % 4) * 4;
        const span = w * 1.5;
        const x = ((i * 0.19 * w + this.time * speed) % span) - w * 0.25;
        const y = h * (0.03 + ((i * 0.137) % 0.40));
        const cw = w * (0.85 + (i % 3) * 0.22);
        const ch = h * (0.16 + (i % 2) * 0.05);
        ctx.globalAlpha = Math.min(1, (0.30 + (i % 3) * 0.08) * a);
        ctx.drawImage(sprite, x - cw / 2, y - ch / 2, cw, ch);
      }
    }
    ctx.restore();
  }

  _fxFog(ctx, a) {
    const sprite = this._sprites.fog;
    if (!sprite) return;
    ctx.save();
    for (const f of this._fog) {
      ctx.globalAlpha = Math.min(1, f.alpha * a);
      ctx.drawImage(sprite, f.x - f.w / 2, f.y - f.h, f.w, f.h * 2);
    }
    ctx.restore();
  }

  _fxStars(ctx, a) {
    ctx.save();
    for (const s of this._stars) {
      const tw = 0.45 + 0.55 * Math.abs(Math.sin(this.time * s.speed + s.phase));
      ctx.globalAlpha = tw * a;
      ctx.fillStyle = '#fffdf2';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (s.r > 1.8) {
        ctx.globalAlpha = tw * a * 0.5;
        ctx.fillRect(s.x - s.r * 4, s.y - 0.4, s.r * 8, 0.8);
        ctx.fillRect(s.x - 0.4, s.y - s.r * 4, 0.8, s.r * 8);
      }
    }

    if (this._shooting) {
      const s = this._shooting;
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 0.08, s.y - s.vy * 0.08);
      grad.addColorStop(0, `rgba(255, 255, 240, ${0.9 * s.life * a})`);
      grad.addColorStop(1, 'rgba(255, 255, 240, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * 0.08, s.y - s.vy * 0.08);
      ctx.stroke();
    }
    ctx.restore();
  }

  _fxBirds(ctx, a) {
    ctx.save();
    ctx.strokeStyle = this.current === 'birds' ? 'rgba(38, 26, 44, 0.9)' : 'rgba(60, 44, 30, 0.8)';
    ctx.lineWidth = 1.7;
    ctx.lineCap = 'round';
    ctx.globalAlpha = a;
    for (const b of this._birds) {
      const flap = Math.sin(b.phase) * b.s * 0.8;
      ctx.beginPath();
      ctx.moveTo(b.x - b.s, b.y - b.s * 0.4 + flap);
      ctx.quadraticCurveTo(b.x - b.s * 0.45, b.y + b.s * 0.2, b.x, b.y);
      ctx.quadraticCurveTo(b.x + b.s * 0.45, b.y + b.s * 0.2, b.x + b.s, b.y - b.s * 0.4 + flap);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ------------------------------------------
  // HIỆU ỨNG: MƯA / TUYẾT / SÉT (lớp trước nhân vật)
  // ------------------------------------------
  _fxRain(ctx, a) {
    const isStorm = this.current === 'storm';
    const count = isStorm ? this._rain.length : 110;

    ctx.save();
    ctx.strokeStyle = isStorm ? `rgba(214, 236, 255, ${0.55 * a})` : `rgba(180, 214, 255, ${0.42 * a})`;
    ctx.lineWidth = isStorm ? 1.6 : 1.2;
    ctx.lineCap = 'round';
    for (let i = 0; i < count; i++) {
      const d = this._rain[i];
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + (d.drift / d.speed) * d.len, d.y + d.len);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    for (const s of this._splashes) {
      ctx.globalAlpha = Math.max(0, s.life) * 0.5 * a;
      ctx.strokeStyle = 'rgba(210, 235, 255, 0.8)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(s.x, s.y, s.r, s.r * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  _fxSnow(ctx, a) {
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${0.85 * a})`;
    for (const f of this._snow) {
      ctx.globalAlpha = (0.55 + 0.45 * Math.sin(f.phase * 2)) * a;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  _fxLightning(ctx, a) {
    if (this.flash <= 0.02) return;
    const flicker = Math.sin(this.strobeTimer * 34) > -0.25 ? 1 : 0.4;
    const alpha = Math.min(1, this.flash * flicker) * a;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const bloom = ctx.createRadialGradient(this.strikeX, 0, 10, this.strikeX, 120, this.width * 1.25);
    bloom.addColorStop(0, `rgba(255, 255, 255, ${0.45 * alpha})`);
    bloom.addColorStop(0.35, `rgba(170, 226, 255, ${0.22 * alpha})`);
    bloom.addColorStop(0.7, `rgba(120, 110, 255, ${0.18 * alpha})`);
    bloom.addColorStop(1, 'rgba(10, 10, 30, 0)');
    ctx.fillStyle = bloom;
    ctx.fillRect(0, 0, this.width, this.height);

    for (const bolt of this.bolts) {
      if (bolt.length < 2) continue;
      ctx.strokeStyle = `rgba(120, 220, 255, ${0.75 * alpha})`;
      ctx.lineWidth = 6;
      ctx.shadowColor = '#6fe8ff';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.moveTo(bolt[0].x, bolt[0].y);
      for (let i = 1; i < bolt.length; i++) ctx.lineTo(bolt[i].x, bolt[i].y);
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.98 * alpha})`;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(bolt[0].x, bolt[0].y);
      for (let i = 1; i < bolt.length; i++) ctx.lineTo(bolt[i].x, bolt[i].y);
      ctx.stroke();
    }
    ctx.restore();
  }
}
