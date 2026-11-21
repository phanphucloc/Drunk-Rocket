/**
 * Vietnam Iconic Landmarks Overlook System - High-Art Master Cinema Edition 2.5
 * 
 * 1. 100% FIXED CAMERA VIEW - ZERO ELEVATION / TILT / PITCH:
 *    - Completely eliminates dizziness and eye fatigue.
 *    - Pure, steady, comfortable panoramic view matching the 8 panels of the user reference image.
 *    - Silky cross-fade transition (fadeProgress over 1.0s) between tiers when advancing.
 * 
 * 2. 8 Hand-Crafted Masterpiece Backdrops:
 *    - Tier 1 (Sa Pa): Misty mountain peaks, Fansipan summit flag, sliding cable cars, golden/green terraced rice fields.
 *    - Tier 2 (Hà Nội): Draping weeping willow branches at top corners, sunset dusk, Long Biên Bridge span, Tháp Rùa on emerald islet with lake reflection.
 *    - Tier 3 (Huế): Royal purple twilight, Đại Nội Ngọ Môn citadel palace with Lầu Ngũ Phụng, rainbow neon Cầu Tràng Tiền arches with shimmering river reflections.
 *    - Tier 4 (Đà Nẵng): Night skyline with glowing skyscrapers, Golden Dragon Bridge breathing a giant dynamic fireblast, Han River reflections.
 *    - Tier 5 (Hội An): Traditional curved tile roof eaves at top corners with hanging glowing silk lanterns, sky lanterns drifting up into the starry sky, Chùa Cầu, yellow ancient shophouses, and flower lanterns on Sông Hoài.
 *    - Tier 6 (Đà Lạt): Morning mist over rolling pine hills, Con Gà church steeple, Hồ Xuân Hương lake, dense sea of blooming hydrangeas in pastel pink/purple/blue across foreground.
 *    - Tier 7 (TP. HCM): Midnight cyberpunk skyline, towering Landmark 81 with glowing pink lotus flower at base, Bitexco tower, expressways with streaming yellow car headlight trails and red taillights.
 *    - Tier 8 (Miền Tây): Bright tropical morning, Cầu Cần Thơ cable-stayed bridge, lush coconut palm groves on both sides, Cái Răng floating market with wooden boats loaded with fruits and merchants in conical hats.
 */

// Hằng số khung vẽ gốc Đà Lạt
const DALAT_W = 1600;  // Chiều rộng khung vẽ gốc
const DALAT_H = 1200;  // Chiều cao khung vẽ gốc
const DALAT_PAD = 40;  // Lề thừa hai bên để các lớp đồi dịch chuyển theo chiều sâu
const DALAT_HZ = 660;  // Đường chân trời (nơi mặt hồ bắt đầu)

export class ScenicLandmarksManager {
  constructor(width = 400, height = 700) {
    this.width = width;
    this.height = height;

    this.currentTier = 1;
    this.prevTier = 1;
    this.fadeProgress = 1.0;
    this._hueScene = null;

    // Animation Timers
    this.animTimer = 0;
    this.cableCarPhase = 0;
    this.dragonFlameTimer = 0;
    this.sunWheelAngle = 0;
    this.scrollX = 0;

    // Dynamic Elements
    this.skyLanterns = [];
    for (let i = 0; i < 16; i++) {
      this.skyLanterns.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height * 0.6),
        speed: 12 + Math.random() * 16,
        size: 2.5 + Math.random() * 3,
        glow: 0.5 + Math.random() * 0.5
      });
    }

    this.trafficLights = [];
    for (let i = 0; i < 18; i++) {
      this.trafficLights.push({
        progress: Math.random(),
        speed: 0.15 + Math.random() * 0.25,
        lane: i % 2 === 0 ? 'headlight' : 'taillight'
      });
    }
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    // Cached Miền Tây layers depend on the physical canvas dimensions.
    this._sapaScene = null;
    this._ninhBinhScene = null;
    this._hanoiScene = null;
    this._hueScene = null;
    this._daNangScene = null;
    this._hoiAnScene = null;
    this._mienTayScene = null;
  }

  /**
   * Vẽ thử từng địa danh một lần vào canvas tạm để "hâm" cache.
   * Nhờ vậy lần đầu vào Đà Lạt/… không còn frame dựng hình ~200ms.
   * Chạy rải bằng setTimeout để không chặn màn READY.
   */
  preWarmAll(tiers = [1, 2, 3, 4, 5, 6, 7, 8, 9], done) {
    if (this._preWarming) return;
    this._preWarming = true;
    const scratch = document.createElement('canvas');
    scratch.width = this.width;
    scratch.height = this.height;
    const sctx = scratch.getContext('2d');
    const savedTier = this.currentTier;
    const savedPrev = this.prevTier;
    let i = 0;

    const step = () => {
      if (i >= tiers.length) {
        this.currentTier = savedTier;
        this.prevTier = savedPrev;
        this._preWarming = false;
        if (done) done();
        return;
      }
      const tier = tiers[i++];
      try {
        sctx.clearRect(0, 0, this.width, this.height);
        this._drawLandmarkByTier(sctx, tier);
      } catch (e) { /* bỏ qua lỗi vẽ thử */ }
      setTimeout(step, 24);
    };
    setTimeout(step, 120);
  }

  /**
   * DỰNG SẴN toàn bộ 9 địa danh (một lần, lúc màn hình loading).
   * Trả Promise; gọi onProgress(done, total) sau mỗi địa danh.
   */
  bakeAll(onProgress) {
    const tiers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const scratch = document.createElement('canvas');
    scratch.width = this.width;
    scratch.height = this.height;
    const sctx = scratch.getContext('2d');
    const savedTier = this.currentTier;
    const savedPrev = this.prevTier;
    let i = 0;

    return new Promise((resolve) => {
      const step = () => {
        if (i >= tiers.length) {
          this.currentTier = savedTier;
          this.prevTier = savedPrev;
          this._preWarming = false;
          resolve();
          return;
        }
        const tier = tiers[i++];
        try {
          sthis._resetView(ctx);
          sctx.clearRect(0, 0, this.width, this.height);
          this._drawLandmarkByTier(sctx, tier);
        } catch (e) { /* bỏ qua lỗi dựng thử */ }
        if (onProgress) onProgress(i, tiers.length, tier);
        setTimeout(step, 0);
      };
      step();
    });
  }

  /**
   * Transform nền của từng canvas (do Game.resize đặt: scale = backing/400).
   * Các hàm vẽ cảnh dùng transform TUYỆT ĐỐI; helper dưới đây nhân với nền
   * để không ghi đè transform DPR -> vừa đúng vị trí, vừa nét.
   */
  _ctxBase(ctx) {
    this._ctxBaseMap = this._ctxBaseMap || new WeakMap();
    return this._ctxBaseMap.get(ctx) || { a: 1, d: 1 };
  }

  _setCtxBase(ctx) {
    this._ctxBaseMap = this._ctxBaseMap || new WeakMap();
    const m = (ctx.getTransform && ctx.getTransform()) || { a: 1, d: 1 };
    this._ctxBaseMap.set(ctx, { a: m.a || 1, d: m.d || 1 });
  }

  /** Thay cho ctx.setTransform(1,0,0,1,0,0) */
  _resetView(ctx) {
    const b = this._ctxBase(ctx);
    ctx.setTransform(b.a, 0, 0, b.d, 0, 0);
  }

  /** Thay cho ctx.setTransform(sx,0,0,sy,tx,ty) */
  _viewT(ctx, sx, sy, tx, ty) {
    const b = this._ctxBase(ctx);
    ctx.setTransform(b.a * sx, 0, 0, b.d * sy, b.a * tx, b.d * ty);
  }

  setTier(tier) {
    if (tier !== this.currentTier) {
      this.prevTier = this.currentTier;
      this.currentTier = tier;
      this.fadeProgress = 0.0;
    }
  }

  update(dt, tier = 1) {
    if (this.currentTier === 5 || this.prevTier === 5) {
      this._updateDaNangFx(dt);
    }
    this.animTimer += dt;
    this.dragonFlameTimer += dt;
    this.cableCarPhase = (this.cableCarPhase + dt * 0.35) % 1.0;
    this.sunWheelAngle += dt * 0.25;
    this.scrollX += dt * 15;

    if (tier !== this.currentTier) {
      this.setTier(tier);
    }

    if (this.fadeProgress < 1.0) {
      // ~0.66s tổng: đủ để mắt bắt kịp, không kéo dài frame nặng
      this.fadeProgress = Math.min(1.0, this.fadeProgress + dt * 1.5);
    }

    // Update Hoi An Sky Lanterns
    for (const l of this.skyLanterns) {
      l.y -= l.speed * dt;
      l.x += Math.sin(this.animTimer + l.y * 0.05) * 6 * dt;
      if (l.y < -10) {
        l.y = this.height * 0.65;
        l.x = Math.random() * this.width;
      }
    }

    // Update HCM Traffic
    for (const t of this.trafficLights) {
      t.progress = (t.progress + t.speed * dt) % 1.0;
    }
  }

  draw(ctx) {
    ctx.save();

    if (this.fadeProgress < 1.0) {
      // Chuyển cảnh MƯỢT: chỉ vẽ MỘT bức tranh mỗi frame (trước đây vẽ cả hai
      // cùng lúc nên frame bị nặng gấp đôi -> giật đúng lúc đổi chương).
      const half = this.fadeProgress < 0.5;
      this._drawLandmarkByTier(ctx, half ? this.prevTier : this.currentTier);

      // Màn "mực" phủ lên: đậm dần (nửa đầu) rồi tan dần (nửa sau)
      const veil = half
        ? this.fadeProgress / 0.5
        : 1 - (this.fadeProgress - 0.5) / 0.5;

      ctx.save();
      ctx.globalAlpha = Math.min(1, Math.max(0, veil)) * 0.93;
      ctx.fillStyle = '#0b1512';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.restore();

      // Vệt vàng mảnh ở mép màn mực cho có chất "cuộn tranh"
      const edgeY = this.height * (half ? 1 - veil : veil);
      ctx.save();
      ctx.globalAlpha = 0.5 * (1 - Math.abs(veil - 0.5) * 2);
      ctx.fillStyle = 'rgba(232, 184, 75, 0.55)';
      ctx.fillRect(0, Math.max(0, Math.min(this.height - 2, edgeY)), this.width, 2);
      ctx.restore();
    } else {
      this._drawLandmarkByTier(ctx, this.currentTier);
    }

    // Atmospheric depth scrim (keeps background subtle so foreground obstacles pop out crystal clear)
    // Tier 1 (Sa Pa) và Tier 2 (Ninh Bình) là cảnh ban ngày nên chỉ phủ một lớp mỏng,
    // giữ nguyên độ trong và sắc màu của tranh.
    const daylight = this.currentTier === 1 || this.currentTier === 2;
    const scrim = ctx.createLinearGradient(0, 0, 0, this.height);
    if (daylight) {
      const cool = this.currentTier === 1;
      scrim.addColorStop(0, cool ? 'rgba(20, 34, 52, 0.08)' : 'rgba(24, 42, 34, 0.05)');
      scrim.addColorStop(0.5, cool ? 'rgba(20, 34, 52, 0.04)' : 'rgba(24, 42, 34, 0.02)');
      scrim.addColorStop(1, cool ? 'rgba(16, 30, 46, 0.16)' : 'rgba(16, 34, 28, 0.12)');
    } else {
      scrim.addColorStop(0, 'rgba(10, 14, 24, 0.12)');
      scrim.addColorStop(0.5, 'rgba(10, 14, 24, 0.06)');
      scrim.addColorStop(1, 'rgba(10, 14, 24, 0.25)');
    }
    ctx.fillStyle = scrim;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.restore();
  }

  _drawLandmarkByTier(ctx, tier) {
    this._setCtxBase(ctx);
    switch (tier) {
      case 1: this._drawSapa(ctx); break;
      case 2: this._drawNinhBinh(ctx); break;
      case 3: this._drawHanoi(ctx); break;
      case 4: this._drawHue(ctx); break;
      case 5: this._drawDaNang(ctx); break;
      case 6: this._drawHoiAn(ctx); break;
      case 7: this._drawDaLat(ctx); break;
      case 8: this._drawHoChiMinh(ctx); break;
      case 9: this._drawMienTay(ctx); break;
      default: this._drawSapa(ctx); break;
    }
  }

  // ==========================================
  // PANEL 1: SA PA (Đỉnh Fansipan, cáp treo & ruộng bậc thang Mù Cang Chải)
  // Tranh gốc 1438 x 2576 (vùng cảnh x: 109..1329, rộng 1220).
  // "Cover" vào khung vẽ nên giữ đúng tỉ lệ trên mọi màn hình.
  // Lớp tĩnh -> dựng sẵn một lần; lớp động -> vẽ mỗi khung hình.
  // ==========================================
  _drawSapa(ctx) {
    const w = this.width;
    const h = this.height;
    const t = this.animTimer || 0;
    const scene = this._getSapaScene();
    const view = scene.view;

    ctx.save();

    // 1. Bầu trời, Fansipan, dãy núi giữa và sương thung lũng
    ctx.drawImage(scene.A, 0, 0, w, h);

    // 2. Các chi tiết động vẽ trong hệ toạ độ tranh gốc
    ctx.save();
    this._viewT(ctx, view.sx, view.sy, -view.offX * view.sx, -view.offY * view.sy);

    this._saDrawFlag(ctx, t, view.kx);
    this._saDrawClouds(ctx, t, scene);
    this._saDrawBirds(ctx, t, scene);
    this._saDrawCable(ctx, t, scene, view.kx);

    ctx.restore();

    // 3. Ruộng bậc thang, nhà sàn, đá và hoa
    ctx.drawImage(scene.B, 0, 0, w, h);

    // 4. Nắng lướt trên ruộng và hạt sáng lơ lửng
    ctx.save();
    this._viewT(ctx, view.sx, view.sy, -view.offX * view.sx, -view.offY * view.sy);
    this._saDrawSunSweep(ctx, t);
    this._saDrawMotes(ctx, t, scene);
    ctx.restore();

    ctx.restore();
  }

  // Khung nhìn: tranh gốc cao hơn khung dọc nên co giãn nhẹ theo chiều dọc
  // để cả đỉnh Fansipan lẫn ruộng bậc thang đều nằm trong khung (như ảnh mẫu).
  // Nếu khung quá khác tỉ lệ tranh thì quay về kiểu "cover" + cắt bớt.
  _saView(w, h) {
    const artX0 = 109;
    const artW = 1220;
    const artH = 2576;
    const maxStretch = 1.25;

    let sx = w / artW;
    let sy = h / artH;
    const ratio = sx / sy;

    if (ratio > maxStretch || ratio < 1 / maxStretch) {
      // Cắt bớt cho an toàn, tránh biến dạng quá mức trên khung lạ
      const s = Math.max(sx, sy);
      sx = s;
      sy = s;
      const vw = w / sx;
      const vh = h / sy;
      return {
        sx,
        sy,
        offX: artX0 + (artW - vw) / 2,
        offY: Math.max(0, (artH - vh) * 0.30),
        kx: 1
      };
    }

    return {
      sx,
      sy,
      offX: artX0,
      offY: 0,
      // Hệ số bù để cabin cáp treo và lá cờ không bị dẹt theo chiều dọc
      kx: Math.min(1, sy / sx)
    };
  }

  _saLayer(w, h, draw) {
    const layer = document.createElement('canvas');
    layer.width = Math.max(1, Math.round(w));
    layer.height = Math.max(1, Math.round(h));
    const g = layer.getContext('2d');
    const view = this._saView(w, h);
    g.setTransform(view.sx, 0, 0, view.sy, -view.offX * view.sx, -view.offY * view.sy);
    draw(g);
    return layer;
  }

  _getSapaScene() {
    const width = Math.max(1, Math.round(this.width));
    const height = Math.max(1, Math.round(this.height));
    if (this._sapaScene &&
      this._sapaScene.width === width &&
      this._sapaScene.height === height) {
      return this._sapaScene;
    }

    const scene = { width, height, view: this._saView(width, height) };
    scene.A = this._saLayer(width, height, g => this._saBuildA(g));
    scene.B = this._saLayer(width, height, g => this._saBuildB(g));
    scene.glow = this._nbGlowSprite();

    // Mây mù: [x, y, bán kính ngang, bán kính dọc, tốc độ, độ đậm]
    scene.puffs = [
      [200, 1400, 340, 100, 3, 0.8], [800, 1450, 400, 100, -2, 0.75],
      [1150, 1420, 300, 100, 2.5, 0.8], [420, 1260, 270, 80, -3, 0.7],
      [950, 1210, 300, 90, 2, 0.6], [1200, 1110, 260, 80, -2, 0.5],
      [600, 1130, 300, 80, 3, 0.5], [300, 800, 250, 70, 2, 0.6],
      [1150, 830, 230, 70, -2, 0.5], [700, 1330, 260, 70, 2.2, 0.55]
    ];

    scene.birds = [
      [700, 1030, 22], [780, 1075, 16], [1100, 1150, 18]
    ].map((b, i) => ({ x: b[0], y: b[1], s: b[2], p: i * 2 }));

    scene.motes = [];
    for (let i = 0; i < 24; i++) {
      scene.motes.push({
        x: 130 + this._nbRnd(i + 9) * 1180,
        y: 1600 + this._nbRnd(i + 19) * 900,
        p: this._nbRnd(i) * 6
      });
    }

    scene.cabs = [
      ['#f5a020', '#d07810'],
      ['#2a9a50', '#1a6a38'],
      ['#d03050', '#9a1c38'],
      ['#2a70c0', '#1a4a90']
    ];

    this._sapaScene = scene;
    return scene;
  }

  // ------------------------------------------
  // HÀM VẼ CƠ BẢN
  // ------------------------------------------
  _saPoly(g, p, fill) {
    g.fillStyle = fill;
    g.beginPath();
    p.forEach((a, i) => (i ? g.lineTo(a[0], a[1]) : g.moveTo(a[0], a[1])));
    g.closePath();
    g.fill();
  }

  _saMix(a, b, u) {
    const parse = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
    const A = parse(a);
    const B = parse(b);
    return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, '0')).join('');
  }

  // Lấy mẫu đường Bezier bậc 3 nối chuỗi điểm (mỗi đoạn 4 điểm)
  _saCubic(pts) {
    const out = [];
    for (let s = 0; s + 3 < pts.length; s += 3) {
      for (let i = (s ? 1 : 0); i <= 24; i++) {
        const u = i / 24;
        const v = 1 - u;
        const a = pts[s];
        const b = pts[s + 1];
        const c = pts[s + 2];
        const d = pts[s + 3];
        out.push([
          v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0],
          v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]
        ]);
      }
    }
    return out;
  }

  _saRoundRect(g, x, y, w, h, r) {
    const rad = Array.isArray(r) ? r : [r, r, r, r];
    const max = Math.min(w, h) / 2;
    const [tl, tr, br, bl] = rad.map(v => Math.min(v, max));
    g.beginPath();
    g.moveTo(x + tl, y);
    g.lineTo(x + w - tr, y);
    g.quadraticCurveTo(x + w, y, x + w, y + tr);
    g.lineTo(x + w, y + h - br);
    g.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    g.lineTo(x + bl, y + h);
    g.quadraticCurveTo(x, y + h, x, y + h - bl);
    g.lineTo(x, y + tl);
    g.quadraticCurveTo(x, y, x + tl, y);
    g.closePath();
  }

  // ------------------------------------------
  // LỚP TĨNH A: TRỜI, FANSIPAN, DÃY NÚI GIỮA
  // ------------------------------------------
  _saBuildA(g) {
    g.fillStyle = this._nbLG(g, 0, 0, 0, 2600, [
      [0, '#5e7e92'], [0.15, '#7896a8'], [0.27, '#a8c4d6'], [0.36, '#d4e6f2'], [1, '#d2e4f0']
    ]);
    g.fillRect(0, 0, 1400, 2600);

    // Đỉnh Fansipan
    this._saPoly(g, [
      [560, 1560], [600, 1032], [700, 952], [830, 862], [900, 802], [990, 732],
      [1035, 690], [1080, 730], [1130, 790], [1200, 832], [1252, 882], [1340, 860], [1340, 1560]
    ], this._nbLG(g, 600, 0, 1300, 0, [[0, '#7488a4'], [0.5, '#5a6e88'], [1, '#4a5e78']]));

    this._saPoly(g, [
      [1035, 690], [900, 802], [830, 862], [780, 930], [860, 1000], [960, 880], [1020, 780]
    ], 'rgba(40,60,96,.18)');

    // Tuyết phủ đỉnh
    this._saPoly(g, [
      [1035, 692], [1080, 730], [1130, 790], [1165, 815], [1130, 828], [1100, 822], [1090, 862],
      [1062, 836], [1040, 884], [1020, 842], [990, 862], [974, 822], [934, 842], [900, 802], [960, 745], [1000, 716]
    ], '#eff1f8');
    this._saPoly(g, [
      [1035, 692], [1000, 716], [960, 745], [900, 802], [934, 842], [974, 822], [990, 862],
      [1020, 842], [1030, 780]
    ], '#bcc8dc');

    g.strokeStyle = 'rgba(40,56,90,.35)';
    g.lineWidth = 5;
    g.lineCap = 'round';
    [[1020, 870, 1015, 1010], [1100, 840, 1130, 960], [940, 880, 900, 980]].forEach(([a, b, d, e]) => {
      g.beginPath();
      g.moveTo(a, b);
      g.lineTo(d, e);
      g.stroke();
    });

    // Dãy núi giữa
    const M = (p, f, lit) => {
      this._saPoly(g, p, f);
      if (lit) this._saPoly(g, lit, 'rgba(130,152,184,.32)');
    };

    M([[109, 1560], [109, 1052], [150, 1022], [215, 970], [240, 962], [300, 1016], [330, 1010],
      [462, 905], [520, 972], [560, 1010], [605, 1032], [660, 1100], [700, 1180], [780, 1560]],
      this._nbLG(g, 109, 0, 780, 0, [[0, '#506680'], [1, '#3c506a']]),
      [[462, 905], [520, 972], [560, 1010], [605, 1032], [660, 1100], [700, 1180], [780, 1560],
        [520, 1560], [470, 1100], [455, 960]]);

    M([[560, 1560], [620, 1062], [740, 1026], [790, 1070], [860, 1132], [960, 1192], [1040, 1560]],
      '#4a5e78',
      [[740, 1026], [790, 1070], [860, 1132], [960, 1192], [1040, 1560], [800, 1560]]);

    M([[900, 1560], [1000, 1222], [1080, 1130], [1180, 1058], [1250, 1120], [1340, 1160], [1340, 1560]],
      '#3e5270',
      [[1180, 1058], [1250, 1120], [1340, 1160], [1340, 1560], [1150, 1560], [1160, 1120]]);

    g.strokeStyle = 'rgba(120,142,176,.4)';
    g.lineWidth = 4;
    [[462, 905, 380, 1100], [462, 905, 520, 1060], [240, 962, 190, 1120],
      [740, 1026, 700, 1130], [1180, 1058, 1100, 1180]].forEach(([a, b, d, e]) => {
        g.beginPath();
        g.moveTo(a, b);
        g.lineTo(d, e);
        g.stroke();
      });

    // Sương thung lũng
    g.fillStyle = this._nbLG(g, 0, 1000, 0, 1620, [
      [0, 'rgba(214,230,244,0)'], [0.3, 'rgba(214,230,244,.38)'],
      [0.6, 'rgba(214,230,244,.88)'], [0.9, '#d2e4f0'], [1, '#d2e4f0']
    ]);
    g.fillRect(100, 1000, 1260, 620);
  }

  // ------------------------------------------
  // LỚP TĨNH B: RUỘNG BẬC THANG, NHÀ SÀN, ĐÁ, HOA
  // ------------------------------------------
  _saBuildB(g) {
    const P = [[109, 1522], [330, 1498], [560, 1560], [760, 1732], [810, 1768], [880, 1802], [1010, 1872]];
    const R = [[1340, 1496], [1150, 1494], [950, 1520], [840, 1598], [785, 1636], [742, 1668], [730, 1724]];

    const band = (poly, off, fill, wall) => {
      const q = poly.map(p => [p[0], p[1] + off]);
      const a = q[0];
      const z = q[q.length - 1];
      g.fillStyle = fill;
      g.beginPath();
      q.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
      g.lineTo(z[0], 2620);
      g.lineTo(a[0], 2620);
      g.closePath();
      g.fill();

      g.lineCap = 'butt';
      g.lineJoin = 'round';
      g.strokeStyle = this._saMix('#6a3e22', '#8a5a30', 0.4);
      g.lineWidth = wall;
      g.beginPath();
      q.forEach((p, i) => (i ? g.lineTo(p[0], p[1] + wall / 2) : g.moveTo(p[0], p[1] + wall / 2)));
      g.stroke();

      g.strokeStyle = 'rgba(255,245,170,.4)';
      g.lineWidth = 3;
      g.beginPath();
      q.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
      g.stroke();
    };

    const pal = [['#8ea834', '#b8c038'], ['#d0b82e', '#e2b42a']];
    const rp = this._saCubic(R);
    const lp = this._saCubic(P);

    for (let k = 0; k < 9; k++) {
      band(rp, k * 46 + k * k * 2.4, this._saMix(pal[0][k % 2], pal[1][k % 2], k / 9), 14 + k * 1.5);
    }
    for (let k = 0; k < 11; k++) {
      band(lp, k * 56 + k * k * 2.2, this._saMix(pal[0][k % 2], pal[1][k % 2], 0.15 + k / 14), 16 + k * 1.8);
    }
    for (let k = 0; k < 11; k++) {
      const a = 1940 + k * 98 + k * k * 6;
      const b = 2020 + k * 128 + k * k * 5;
      const wv = Math.sin(k * 1.7) * 60;
      const pts = [[109, a + 40], [380, a - 90 + wv], [820, b - 230 - wv], [1340, b]];
      band(this._saCubic(pts), 0, this._saMix('#c4bc36', '#e2b42c', k / 10 * 0.8 + (k % 2) * 0.1), 24 + k * 3.5);
    }

    g.fillStyle = this._nbLG(g, 0, 2300, 0, 2576, [
      [0, 'rgba(90,60,20,0)'], [1, 'rgba(90,60,20,.25)']
    ]);
    g.fillRect(109, 2300, 1230, 280);

    // Nhà sàn
    this._saHut(g, 250, 1905, 1.2);
    this._saHut(g, 1215, 1496, 0.78);

    // Đá + hoa
    const rock = (p, f, hl) => {
      this._saPoly(g, p, f);
      this._saPoly(g, hl, 'rgba(120,120,140,.45)');
    };
    rock([[940, 1962], [985, 1902], [1050, 1856], [1130, 1840], [1192, 1902], [1204, 1992], [1080, 2022]],
      '#3a3a44', [[985, 1902], [1050, 1856], [1130, 1840], [1100, 1900], [1020, 1930]]);
    rock([[1190, 1792], [1252, 1782], [1340, 1750], [1340, 2012], [1252, 2032], [1215, 1952]],
      '#2e2e38', [[1190, 1792], [1252, 1782], [1300, 1770], [1270, 1850], [1225, 1880]]);
    rock([[1062, 2012], [1132, 1962], [1242, 1952], [1262, 2042], [1162, 2052]],
      '#4a4a54', [[1132, 1962], [1242, 1952], [1200, 1990], [1120, 2000]]);
    rock([[1192, 2062], [1252, 2002], [1340, 2002], [1340, 2102], [1232, 2112]],
      '#3a3a44', [[1252, 2002], [1340, 2002], [1300, 2030]]);

    const flowerColors = ['#e8609c', '#f0d030', '#a478e8', '#ffffff', '#f08060'];
    for (let i = 0; i < 70; i++) {
      const x = 925 + this._nbRnd(i) * 400;
      const y = 1890 + this._nbRnd(i + 7) * 230;
      g.strokeStyle = '#2a6a30';
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(x, y + 12);
      g.lineTo(x, y);
      g.stroke();
      g.fillStyle = flowerColors[i % 5];
      g.beginPath();
      g.arc(x, y, 3.5 + this._nbRnd(i + 3) * 3, 0, 7);
      g.fill();
    }
  }

  _saHut(g, x, y, s) {
    g.save();
    g.translate(x, y);
    g.scale(s, s);

    g.fillStyle = 'rgba(60,40,10,.3)';
    g.beginPath();
    g.ellipse(0, 52, 84, 11, 0, 0, 7);
    g.fill();

    g.fillStyle = '#5a4028';
    [-38, 0, 32].forEach(px => g.fillRect(px, 14, 6, 40));

    g.strokeStyle = '#5a4028';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(48, 20);
    g.lineTo(58, 54);
    g.moveTo(56, 20);
    g.lineTo(66, 54);
    for (let i = 0; i < 4; i++) {
      g.moveTo(50 + i * 2.5, 28 + i * 8);
      g.lineTo(58 + i * 2.5, 28 + i * 8);
    }
    g.stroke();

    g.fillStyle = this._nbLG(g, -45, 0, 45, 0, [[0, '#b08a5c'], [1, '#8a6642']]);
    g.fillRect(-46, -12, 92, 28);
    g.strokeStyle = 'rgba(60,40,20,.4)';
    g.lineWidth = 1.5;
    for (let i = -40; i < 46; i += 11) {
      g.beginPath();
      g.moveTo(i, -12);
      g.lineTo(i, 16);
      g.stroke();
    }

    g.fillStyle = '#3a2a1c';
    g.fillRect(-8, -2, 16, 18);

    g.fillStyle = '#8a6a46';
    g.beginPath();
    g.moveTo(-66, -10);
    g.lineTo(-2, -50);
    g.lineTo(62, -10);
    g.lineTo(50, 4);
    g.lineTo(-54, 4);
    g.closePath();
    g.fill();

    g.strokeStyle = 'rgba(50,34,18,.45)';
    g.lineWidth = 2;
    for (let i = -50; i < 50; i += 10) {
      g.beginPath();
      g.moveTo(i * 0.35, -42);
      g.lineTo(i * 1.1, 2);
      g.stroke();
    }
    g.restore();
  }

  // ------------------------------------------
  // LỚP ĐỘNG
  // ------------------------------------------
  _saDrawFlag(ctx, t, kx = 1) {
    ctx.save();
    // Bù biến dạng để lá cờ không bị dẹt khi tranh co giãn theo chiều dọc
    ctx.translate(1030, 0);
    ctx.scale(kx, 1);
    ctx.translate(-1030, 0);

    ctx.fillStyle = '#4a4a5a';
    ctx.fillRect(1028, 620, 4, 72);

    ctx.fillStyle = '#d8232a';
    ctx.beginPath();
    ctx.moveTo(1032, 622);
    for (let i = 0; i <= 12; i++) {
      ctx.lineTo(1032 + i * 4.4, 622 + Math.sin(t * 4 - i * 0.6) * (1 + i * 0.3));
    }
    for (let i = 12; i >= 0; i--) {
      ctx.lineTo(1032 + i * 4.4, 658 + Math.sin(t * 4 - i * 0.6) * (1 + i * 0.3));
    }
    ctx.fill();

    // Sao vàng
    ctx.fillStyle = '#ffd21f';
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 4.5 : 11;
      const a = -Math.PI / 2 + i * Math.PI / 5;
      ctx.lineTo(1058 + Math.cos(a) * r, 640 + Math.sin(a) * r);
    }
    ctx.fill();

    ctx.restore();
  }

  _saDrawClouds(ctx, t, scene) {
    ctx.save();
    scene.puffs.forEach(([x, y, rx, ry, sp, al], i) => {
      const px = ((x + t * sp * 4 + 400) % 1700) - 400 + 109 + (i % 2) * 20;
      ctx.save();
      ctx.translate(px, y);
      ctx.scale(1, ry * 1.4 / rx);
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
      grad.addColorStop(0, `rgba(236,244,250,${al})`);
      grad.addColorStop(0.6, `rgba(226,236,246,${al * 0.6})`);
      grad.addColorStop(1, 'rgba(226,236,246,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, rx, 0, 7);
      ctx.fill();
      ctx.restore();
    });
    ctx.restore();
  }

  _saDrawBirds(ctx, t, scene) {
    ctx.strokeStyle = '#3a4a64';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    for (const b of scene.birds) {
      const x = b.x + Math.sin(t * 0.4 + b.p) * 40;
      const y = b.y + Math.sin(t * 0.8 + b.p) * 10;
      const f = Math.sin(t * 5 + b.p) * 5;
      ctx.beginPath();
      ctx.moveTo(x - b.s, y - 8 + f);
      ctx.quadraticCurveTo(x - b.s / 2, y + 3, x, y + 2);
      ctx.quadraticCurveTo(x + b.s / 2, y + 3, x + b.s, y - 8 + f);
      ctx.stroke();
    }
  }

  // Điểm trên dây cáp: u = 0..1 dọc theo nhịp cáp, k = 0/1 cho hai sợi
  _saCablePoint(u, k) {
    const y0 = [660, 690][k];
    const y1 = [978, 1012][k];
    const cy = [795, 830][k];
    const v = 1 - u;
    return [109 + u * 1220, v * v * y0 + 2 * v * u * cy + u * u * y1];
  }

  _saDrawCable(ctx, t, scene, kx = 1) {
    ctx.strokeStyle = '#4a5264';
    ctx.lineWidth = 2.6;
    [0, 1].forEach(k => {
      ctx.beginPath();
      for (let i = 0; i <= 30; i++) {
        const p = this._saCablePoint(i / 30, k);
        if (i) ctx.lineTo(p[0], p[1]);
        else ctx.moveTo(p[0], p[1]);
      }
      ctx.stroke();
    });

    scene.cabs.forEach((col, i) => {
      const u = (t * 0.014 + i / scene.cabs.length) % 1;
      const p = this._saCablePoint(u, 0);
      const q = this._saCablePoint(u, 1);
      this._saCab(ctx, (p[0] + q[0]) / 2, (p[1] + q[1]) / 2 - 4, col, kx);
    });
  }

  _saCab(ctx, x, y, col, kx = 1) {
    ctx.save();
    ctx.translate(x, y);
    // Bù biến dạng để cabin vẫn vuông vức sau khi tranh co giãn
    ctx.scale(kx, 1);

    ctx.strokeStyle = '#3a4252';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 52);
    ctx.stroke();
    ctx.fillStyle = '#3a4252';
    ctx.fillRect(-6, -4, 12, 10);

    ctx.fillStyle = col[1];
    this._saRoundRect(ctx, -30, 52, 60, 12, 5);
    ctx.fill();

    ctx.fillStyle = col[0];
    this._saRoundRect(ctx, -30, 50, 60, 46, [8, 8, 6, 6]);
    ctx.fill();

    ctx.fillStyle = col[1];
    ctx.fillRect(-30, 86, 60, 10);

    [[-24, 60], [2, 60]].forEach(([wx, wy]) => {
      ctx.fillStyle = this._nbLG(ctx, wx, wy, wx + 22, wy + 22, [[0, '#4a90b0'], [1, '#1e4a6a']]);
      ctx.fillRect(wx, wy, 22, 22);
      ctx.fillStyle = 'rgba(255,255,255,.3)';
      ctx.beginPath();
      ctx.moveTo(wx + 3, wy + 18);
      ctx.lineTo(wx + 10, wy + 2);
      ctx.lineTo(wx + 14, wy + 2);
      ctx.lineTo(wx + 7, wy + 18);
      ctx.fill();
    });

    ctx.restore();
  }

  _saDrawSunSweep(ctx, t) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const sx = ((t * 60) % 2200) - 500;
    ctx.fillStyle = this._nbLG(ctx, sx, 1500, sx + 360, 2300, [
      [0, 'rgba(255,240,170,0)'], [0.5, 'rgba(255,240,170,.1)'], [1, 'rgba(255,240,170,0)']
    ]);
    ctx.fillRect(109, 1500, 1230, 1076);
    ctx.restore();
  }

  _saDrawMotes(ctx, t, scene) {
    if (!scene.glow) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const m of scene.motes) {
      const x = m.x + Math.sin(t * 0.6 + m.p) * 26;
      const y = 1500 + ((m.y - 1500 - t * 14 + 4000) % 1000);
      const a = 0.25 + 0.5 * Math.abs(Math.sin(t + m.p));
      ctx.globalAlpha = a;
      ctx.drawImage(scene.glow, x - 12, y - 12, 24, 24);
    }
    ctx.restore();
  }

  // ==========================================
  // PANEL 2: NINH BÌNH (Tràng An - Tam Cốc Bích Động)
  // Toàn cảnh sông Ngô Đồng: bầu trời hoàng kim, dãy karst Tràng An,
  // chùa cổ ven bờ, thuyền nan và rặng cọ tiền cảnh.
  //
  // Tranh được dựng trong hệ toạ độ gốc 2213 x 1652 (theo tranh tham khảo),
  // sau đó "cover" vào khung vẽ hiện tại nên giữ đúng tỉ lệ trên mọi màn hình.
  // Lớp tĩnh -> dựng sẵn một lần vào canvas đệm; lớp động -> vẽ mỗi khung hình.
  // ==========================================
  _drawNinhBinh(ctx) {
    const w = this.width;
    const h = this.height;
    const t = this.animTimer || 0;
    const scene = this._getNinhBinhScene();
    const view = scene.view;

    ctx.save();

    // 1. Bầu trời hoàng kim
    ctx.drawImage(scene.sky, 0, 0, w, h);

    // 2. Mây trôi rất chậm
    ctx.save();
    ctx.translate(Math.sin(t * 0.12) * 26 * view.s, 0);
    ctx.drawImage(scene.clouds, 0, 0, w, h);
    ctx.restore();

    // 3. Núi karst, chùa cổ, sông Ngô Đồng
    ctx.drawImage(scene.land, 0, 0, w, h);

    // 4. Các chi tiết động vẽ trong hệ toạ độ tranh gốc
    ctx.save();
    this._viewT(ctx, view.s, view.s, -view.offX * view.s, -view.offY * view.s);

    this._nbDrawWater(ctx, t);
    for (const boat of scene.boats) this._nbBoat(ctx, boat, t);
    this._nbDrawRays(ctx, t, scene);
    this._nbDrawMotes(ctx, t, scene);
    this._nbDrawBirds(ctx, t, scene);

    ctx.restore();

    // 5. Rặng cọ tiền cảnh
    ctx.drawImage(scene.fg, 0, 0, w, h);

    // 6. Khung lá tối góc dưới cho khung dọc vẫn có tiền cảnh
    this._nbDrawFrame(ctx, w, h);

    ctx.restore();
  }

  // Chọn khung nhìn "cover" trong tranh gốc: giữ mặt đất ở đáy, cắt bớt hai bên khi khung dọc
  _nbView(w, h) {
    const artX0 = 105;      // tranh gốc chỉ có nội dung từ x = 105 tới x = 2108
    const artW = 2003;
    const artH = 1652;
    // Khung dọc: phóng thêm một chút để cảnh không bị loãng hai bên
    const zoom = (w / h) < 0.9 ? 1.14 : 1;
    const s = Math.max(w / artW, h / artH) * zoom;
    const vw = w / s;
    const vh = h / s;
    const centerX = artX0 + artW * 0.40;
    let offX = centerX - vw / 2;
    offX = Math.min(Math.max(offX, artX0), Math.max(artX0, artX0 + artW - vw));
    const offY = Math.max(0, artH - vh);
    return { s, offX, offY };
  }

  _nbStaticLayer(w, h, draw) {
    const layer = document.createElement('canvas');
    layer.width = Math.max(1, Math.round(w));
    layer.height = Math.max(1, Math.round(h));
    const g = layer.getContext('2d');
    const view = this._nbView(w, h);
    g.setTransform(view.s, 0, 0, view.s, -view.offX * view.s, -view.offY * view.s);
    draw(g);
    return layer;
  }

  // Sprite quầng sáng dùng lại cho bụi sáng (nhanh hơn tạo gradient mỗi khung hình)
  _nbGlowSprite() {
    const size = 64;
    const sprite = document.createElement('canvas');
    sprite.width = size;
    sprite.height = size;
    const g = sprite.getContext('2d');
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255, 246, 200, 1)');
    grad.addColorStop(0.32, 'rgba(255, 226, 140, 0.8)');
    grad.addColorStop(1, 'rgba(255, 210, 110, 0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    return sprite;
  }

  _getNinhBinhScene() {
    const width = Math.max(1, Math.round(this.width));
    const height = Math.max(1, Math.round(this.height));
    if (this._ninhBinhScene &&
      this._ninhBinhScene.width === width &&
      this._ninhBinhScene.height === height) {
      return this._ninhBinhScene;
    }

    const scene = {
      width,
      height,
      view: this._nbView(width, height)
    };

    scene.sky = this._nbStaticLayer(width, height, g => this._nbDrawSky(g));
    scene.clouds = this._nbStaticLayer(width, height, g => this._nbDrawCloudLayer(g));
    scene.land = this._nbStaticLayer(width, height, g => this._nbDrawLand(g));
    scene.fg = this._nbStaticLayer(width, height, g => this._nbDrawFgLayer(g));

    // Thuyền nan chèo trên sông: [x, y, tỉ lệ, hướng, số người, pha]
    scene.boats = [
      [878, 1430, 0.9, 1, 1, 0],
      [1035, 1355, 0.7, -1, 2, 1.3],
      [1163, 1287, 0.35, 1, 1, 2.6],
      [1168, 1503, 1.15, 1, 2, 3.9],
      [1325, 1528, 1.05, -1, 2, 5.2]
    ].map(b => ({ x: b[0], y: b[1], s: b[2], d: b[3], n: b[4], p: b[5] }));

    // Đàn chim trời
    scene.birds = [
      [1035, 205, 28], [1100, 685, 26], [1160, 705, 16], [1330, 495, 34], [1280, 508, 24]
    ].map((b, i) => ({ x: b[0], y: b[1], s: b[2], p: i * 1.7 }));

    // Bụi sáng lơ lửng trong nắng
    scene.motes = [];
    for (let i = 0; i < 26; i++) {
      scene.motes.push({
        x: 800 + this._nbRnd(i + 9) * 800,
        y: 900 + this._nbRnd(i + 19) * 500,
        p: this._nbRnd(i) * 6
      });
    }

    this._ninhBinhScene = scene;
    return scene;
  }

  // ------------------------------------------
  // HÀM VẼ CƠ BẢN (hệ toạ độ tranh gốc)
  // ------------------------------------------
  _nbRnd(n) {
    const value = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return value - Math.floor(value);
  }

  _nbLG(g, x0, y0, x1, y1, stops) {
    const grad = g.createLinearGradient(x0, y0, x1, y1);
    stops.forEach(st => grad.addColorStop(st[0], st[1]));
    return grad;
  }

  _nbRG(g, x, y, r0, r1, stops) {
    const grad = g.createRadialGradient(x, y, r0, x, y, r1);
    stops.forEach(st => grad.addColorStop(st[0], st[1]));
    return grad;
  }

  _nbSmoothPath(g, p) {
    const n = p.length;
    g.beginPath();
    g.moveTo((p[0][0] + p[n - 1][0]) / 2, (p[0][1] + p[n - 1][1]) / 2);
    for (let i = 0; i < n; i++) {
      const a = p[i];
      const b = p[(i + 1) % n];
      g.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
    }
    g.closePath();
  }

  // Đa giác gồ ghề: chèn thêm điểm lệch ngẫu nhiên để vách đá không thẳng đơ
  _nbPoly(g, p) {
    const q = [];
    p.forEach((a, i) => {
      const b = p[(i + 1) % p.length];
      q.push(a);
      for (let k = 1; k < 4; k++) {
        const u = k / 4;
        const j = (this._nbRnd(i * 9 + k + a[0]) - 0.5) * 26;
        q.push([a[0] + (b[0] - a[0]) * u + j, a[1] + (b[1] - a[1]) * u + j * 0.6]);
      }
    });
    g.beginPath();
    q.forEach((a, i) => (i ? g.lineTo(a[0], a[1]) : g.moveTo(a[0], a[1])));
    g.closePath();
  }

  _nbMtn(g, p, fill, extra) {
    this._nbPoly(g, p);
    g.fillStyle = fill;
    g.fill();
    if (extra) {
      g.save();
      this._nbPoly(g, p);
      g.clip();
      extra();
      g.restore();
    }
  }

  _nbVeins(g, sd, x0, x1, y0, y1, n, col, lw) {
    g.strokeStyle = col;
    g.lineWidth = lw;
    g.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      let x = x0 + this._nbRnd(sd + i) * (x1 - x0);
      let y = y0 + this._nbRnd(sd + i + 50) * (y1 - y0);
      g.beginPath();
      g.moveTo(x, y);
      for (let k = 0; k < 4; k++) {
        x += 20 + this._nbRnd(sd + i * 7 + k) * 40;
        y += 40 + this._nbRnd(sd + i * 3 + k) * 70;
        g.lineTo(x, y);
      }
      g.stroke();
    }
  }

  _nbCloudPuff(g, circs, base, body, rim) {
    g.save();
    g.beginPath();
    g.rect(0, 0, 2300, base + 140);
    g.clip();
    g.fillStyle = rim;
    g.beginPath();
    circs.forEach(o => {
      g.moveTo(o[0] + o[2], o[1]);
      g.arc(o[0], o[1], o[2], 0, 7);
    });
    g.fill();
    g.fillStyle = body;
    g.beginPath();
    circs.forEach(o => {
      g.moveTo(o[0] + o[2], o[1] + 12);
      g.arc(o[0], o[1] + 12, o[2], 0, 7);
    });
    g.fill();
    g.restore();
  }

  _nbBladeShape(g, x, y, L, a, w, col) {
    g.fillStyle = col;
    g.beginPath();
    g.moveTo(x - w, y);
    g.quadraticCurveTo(x + Math.cos(a) * L * 0.6 - w, y + Math.sin(a) * L * 0.6, x + Math.cos(a) * L, y + Math.sin(a) * L);
    g.quadraticCurveTo(x + Math.cos(a) * L * 0.6 + w, y + Math.sin(a) * L * 0.6, x + w, y);
    g.fill();
  }

  _nbPalmTree(g, x, y, r, c1, c2, trunk) {
    if (trunk) {
      g.strokeStyle = '#3a2a20';
      g.lineWidth = 7;
      g.beginPath();
      g.moveTo(x, y + trunk);
      g.quadraticCurveTo(x + 6, y + trunk / 2, x, y);
      g.stroke();
    }
    const n = 26;
    for (let i = 0; i < n; i++) {
      this._nbBladeShape(
        g, x, y,
        r * (0.7 + this._nbRnd(i + x) * 0.45),
        -3.3 + (i / n) * 3.6 + (this._nbRnd(i) - 0.5) * 0.2,
        3.2,
        i % 2 ? c1 : c2
      );
    }
  }

  _nbRoofShape(g, x0, x1, y, roofH, col, edge) {
    g.fillStyle = col;
    g.beginPath();
    g.moveTo(x0 - 18, y + roofH + 4);
    g.quadraticCurveTo(x0 + 8, y + roofH, x0 + (x1 - x0) * 0.12, y + roofH * 0.4);
    g.lineTo(x0 + (x1 - x0) * 0.22, y);
    g.lineTo(x1 - (x1 - x0) * 0.22, y);
    g.lineTo(x1 - (x1 - x0) * 0.12, y + roofH * 0.4);
    g.quadraticCurveTo(x1 - 8, y + roofH, x1 + 18, y + roofH + 4);
    g.lineTo(x1, y + roofH + 8);
    g.lineTo(x0, y + roofH + 8);
    g.closePath();
    g.fill();
    g.strokeStyle = edge;
    g.lineWidth = 2.5;
    g.beginPath();
    g.moveTo(x0 - 14, y + roofH + 3);
    g.quadraticCurveTo(x0 + 10, y + roofH - 2, x0 + (x1 - x0) * 0.12, y + roofH * 0.4);
    g.lineTo(x0 + (x1 - x0) * 0.22, y);
    g.lineTo(x1 - (x1 - x0) * 0.22, y);
    g.lineTo(x1 - (x1 - x0) * 0.12, y + roofH * 0.4);
    g.quadraticCurveTo(x1 - 10, y + roofH - 2, x1 + 14, y + roofH + 3);
    g.stroke();
  }

  // ------------------------------------------
  // LỚP TĨNH
  // ------------------------------------------
  _nbDrawSky(g) {
    g.fillStyle = this._nbLG(g, 0, 0, 0, 1300, [
      [0, '#cfe6f4'], [0.3, '#f0ecc4'], [0.6, '#f8e0a0'], [1, '#fcd484']
    ]);
    g.fillRect(0, 0, 2300, 1300);

    g.fillStyle = this._nbLG(g, 105, 0, 1300, 0, [
      [0, 'rgba(236,230,150,.6)'], [1, 'rgba(236,230,150,0)']
    ]);
    g.fillRect(0, 0, 2300, 900);

    g.fillStyle = this._nbLG(g, 1300, 0, 2108, 0, [
      [0, 'rgba(190,226,250,0)'], [1, 'rgba(190,226,250,.85)']
    ]);
    g.fillRect(0, 0, 2300, 1300);

    g.fillStyle = this._nbRG(g, 1170, 1180, 10, 560, [
      [0, 'rgba(255,214,120,1)'], [0.5, 'rgba(255,214,120,.5)'], [1, 'rgba(255,214,120,0)']
    ]);
    g.fillRect(0, 500, 2300, 800);
  }

  _nbDrawCloudLayer(g) {
    this._nbCloudPuff(g, [[240, 250, 110], [380, 210, 130], [540, 260, 120], [700, 330, 90], [160, 300, 70]], 430, '#fff6d4', '#fffbe8');
    this._nbCloudPuff(g, [[300, 620, 90], [450, 590, 110], [600, 620, 90], [720, 660, 60]], 700, '#fff0cc', '#fffae0');
    this._nbCloudPuff(g, [[1900, 180, 100], [2020, 120, 90], [2100, 190, 80], [1780, 210, 70]], 260, '#fdfcff', '#ffffff');
    this._nbCloudPuff(g, [[1850, 600, 100], [1990, 530, 120], [2100, 600, 90], [1740, 630, 70]], 700, '#fffaf0', '#ffffff');
    this._nbCloudPuff(g, [[1000, 770, 80], [1130, 740, 100], [1260, 780, 70], [900, 790, 50]], 850, '#ffe8b8', '#fff4d4');
    this._nbCloudPuff(g, [[1400, 980, 80], [1500, 950, 90], [1250, 990, 60]], 1040, '#ffe6b0', '#fff0cc');
  }

  _nbDrawLand(g) {
    const M = (p, f, e) => this._nbMtn(g, p, f, e);
    const haze = (a) => {
      g.fillStyle = `rgba(252,226,150,${a})`;
      g.fillRect(0, 400, 2300, 900);
    };

    // Núi xa bên phải
    M([[1650, 1300], [1690, 780], [1760, 600], [1810, 522], [1860, 512], [1910, 580], [1960, 740], [2000, 950], [2060, 1300]],
      this._nbLG(g, 1650, 0, 2000, 0, [[0, '#a8984a'], [1, '#b8883a']]), () => {
        g.fillStyle = 'rgba(70,90,40,.25)';
        g.fillRect(1850, 500, 200, 800);
        this._nbVeins(g, 300, 1700, 1980, 560, 1000, 9, 'rgba(110,70,30,.5)', 6);
      });

    M([[900, 1300], [920, 950], [950, 805], [990, 772], [1040, 830], [1100, 1000], [1160, 1300]],
      this._nbLG(g, 900, 0, 1150, 0, [[0, '#b09a40'], [1, '#d4b458']]), () =>
        this._nbVeins(g, 330, 930, 1120, 800, 1100, 6, 'rgba(120,90,30,.4)', 5));

    M([[300, 1300], [320, 800], [380, 692], [440, 662], [500, 702], [560, 820], [610, 1300]],
      this._nbLG(g, 300, 0, 600, 0, [[0, '#d0ac5c'], [1, '#9a8c46']]), null);

    haze(0.1);

    M([[1130, 1300], [1170, 1050], [1230, 872], [1292, 812], [1340, 832], [1390, 950], [1425, 1100], [1450, 1300]],
      this._nbLG(g, 1130, 0, 1440, 0, [[0, '#d8b85a'], [0.5, '#9aa448'], [1, '#6a8a3c']]), () =>
        this._nbVeins(g, 360, 1180, 1400, 850, 1200, 7, 'rgba(70,90,30,.4)', 5));

    haze(0.08);

    // Núi lớn giữa - trái
    M([[430, 1300], [450, 900], [540, 722], [600, 652], [662, 612], [732, 626], [802, 682], [862, 762], [922, 902], [1002, 1102], [1052, 1300]],
      this._nbLG(g, 430, 0, 1050, 0, [[0, '#0f4034'], [0.45, '#1c5a46'], [0.62, '#4a7a40'], [1, '#c8a24a']]), () => {
        g.fillStyle = 'rgba(224,180,80,.4)';
        g.beginPath();
        g.moveTo(770, 650); g.lineTo(862, 762); g.lineTo(922, 902); g.lineTo(1002, 1102); g.lineTo(1052, 1300);
        g.lineTo(930, 1300); g.lineTo(860, 960); g.lineTo(790, 780);
        g.fill();
        g.fillStyle = 'rgba(10,50,40,.5)';
        g.beginPath();
        g.moveTo(610, 650); g.lineTo(700, 700); g.lineTo(660, 900); g.lineTo(600, 1300);
        g.lineTo(520, 1300); g.lineTo(560, 900);
        g.fill();
        this._nbVeins(g, 400, 520, 900, 700, 1100, 8, 'rgba(8,36,30,.55)', 6);
        this._nbVeins(g, 420, 720, 960, 760, 1100, 5, 'rgba(230,190,90,.4)', 4);
      });

    // Vách phải
    M([[1900, 1330], [1930, 900], [1990, 700], [2050, 592], [2108, 540], [2108, 1330]],
      this._nbLG(g, 1900, 0, 2108, 0, [[0, '#8a8a3c'], [1, '#4a7a38']]), () => {
        g.fillStyle = 'rgba(40,110,50,.7)';
        for (let i = 0; i < 14; i++) {
          g.beginPath();
          g.arc(2020 + this._nbRnd(i) * 70, 600 + i * 28 + this._nbRnd(i + 3) * 20, 20 + this._nbRnd(i + 6) * 20, 0, 7);
          g.fill();
        }
        this._nbVeins(g, 440, 1920, 2100, 700, 1200, 6, 'rgba(90,60,20,.45)', 5);
      });

    M([[1380, 1330], [1420, 1050], [1480, 852], [1540, 730], [1600, 696], [1652, 722], [1702, 802], [1762, 952], [1812, 1102], [1862, 1330]],
      this._nbLG(g, 1380, 0, 1860, 0, [[0, '#a8a448'], [0.38, '#6a8a3c'], [0.62, '#1c5a44'], [1, '#0e3a30']]), () => {
        g.fillStyle = 'rgba(230,190,80,.3)';
        g.beginPath();
        g.moveTo(1420, 1050); g.lineTo(1480, 852); g.lineTo(1540, 730); g.lineTo(1580, 740);
        g.lineTo(1500, 960); g.lineTo(1470, 1330); g.lineTo(1380, 1330);
        g.fill();
        this._nbVeins(g, 460, 1560, 1840, 760, 1250, 8, 'rgba(6,34,28,.55)', 6);
      });

    // Vách trái tối
    M([[105, 470], [200, 520], [262, 622], [332, 762], [402, 952], [472, 1152], [562, 1322], [105, 1330]],
      this._nbLG(g, 105, 0, 560, 0, [[0, '#0e3a2e'], [1, '#1c5a44']]), () => {
        this._nbVeins(g, 480, 110, 540, 520, 1250, 10, 'rgba(210,170,70,.65)', 6);
        this._nbVeins(g, 510, 110, 500, 600, 1200, 6, 'rgba(6,30,24,.6)', 8);
      });

    M([[330, 1300], [350, 1000], [388, 850], [424, 962], [472, 1152], [530, 1300]], '#1c5040', () =>
      this._nbVeins(g, 540, 340, 480, 870, 1200, 4, 'rgba(210,170,70,.55)', 5));

    // Dải xanh chân núi
    g.fillStyle = '#2c6a3a';
    g.beginPath();
    g.moveTo(520, 1300);
    g.bezierCurveTo(540, 1230, 700, 1210, 800, 1215);
    g.bezierCurveTo(900, 1210, 1020, 1200, 1060, 1250);
    g.lineTo(1110, 1300);
    g.fill();

    // Chùa cổ
    const wall = (x, y, w2, h2) => {
      g.fillStyle = this._nbLG(g, x, 0, x + w2, 0, [[0, '#a89480'], [1, '#8a7260']]);
      g.fillRect(x, y, w2, h2);
    };
    wall(540, 1165, 215, 55);
    wall(585, 1112, 130, 56);
    wall(745, 1210, 100, 40);
    wall(830, 1190, 100, 60);
    wall(930, 1215, 40, 35);

    g.fillStyle = '#2e2018';
    [[630, 1180, 50, 40], [610, 1130, 24, 28], [680, 1130, 24, 28], [855, 1200, 52, 50]].forEach(([x, y, w2, h2]) => {
      g.beginPath();
      g.moveTo(x, y + h2);
      g.lineTo(x, y + w2 * 0.4);
      g.quadraticCurveTo(x + w2 / 2, y - w2 * 0.2, x + w2, y + w2 * 0.4);
      g.lineTo(x + w2, y + h2);
      g.fill();
    });

    this._nbRoofShape(g, 536, 760, 1140, 30, '#6a5048', '#d0aa80');
    this._nbRoofShape(g, 560, 740, 1088, 28, '#6a5048', '#d0aa80');
    this._nbRoofShape(g, 826, 938, 1160, 26, '#6a5048', '#d0aa80');

    g.fillStyle = '#6a5048';
    g.fillRect(644, 1066, 8, 24);
    g.beginPath();
    g.arc(648, 1064, 6, 0, 7);
    g.fill();

    for (let i = 0; i < 16; i++) {
      g.fillStyle = i % 2 ? '#1e5230' : '#2c6a3a';
      g.beginPath();
      g.arc(530 + i * 36 + this._nbRnd(i) * 20, 1245 - this._nbRnd(i + 4) * 24, 30 + this._nbRnd(i + 8) * 18, 0, 7);
      g.fill();
    }
    [[760, 1190], [800, 1200]].forEach(([x, y]) => {
      g.fillStyle = '#1e4a2c';
      g.beginPath();
      g.arc(x, y, 34, 0, 7);
      g.fill();
    });

    // Đồng cỏ
    g.fillStyle = this._nbLG(g, 0, 1260, 0, 1652, [[0, '#4a8a3e'], [0.4, '#2e6a38'], [1, '#1c5230']]);
    g.beginPath();
    g.moveTo(105, 1330);
    g.bezierCurveTo(400, 1330, 600, 1300, 1100, 1262);
    g.lineTo(1300, 1262);
    g.lineTo(2108, 1250);
    g.lineTo(2108, 1652);
    g.lineTo(105, 1652);
    g.fill();

    g.fillStyle = this._nbLG(g, 0, 1250, 0, 1450, [[0, '#5a9a44'], [1, '#3a7a3a']]);
    g.beginPath();
    g.moveTo(1290, 1290); g.lineTo(1400, 1250); g.lineTo(2108, 1200); g.lineTo(2108, 1560);
    g.lineTo(1480, 1525); g.lineTo(1100, 1490); g.lineTo(1045, 1445); g.lineTo(1250, 1330);
    g.fill();

    g.fillStyle = '#a89a50';
    g.beginPath();
    g.moveTo(1930, 1330); g.lineTo(2108, 1200); g.lineTo(2108, 1400);
    g.fill();

    // Sông Ngô Đồng
    const riv = [
      [1100, 1262], [1030, 1302], [930, 1352], [832, 1402], [772, 1472], [756, 1552], [790, 1652],
      [2108, 1652], [2108, 1585], [1900, 1566], [1600, 1546], [1300, 1520], [1120, 1482],
      [1046, 1446], [1070, 1406], [1160, 1362], [1250, 1326], [1288, 1296], [1252, 1268], [1180, 1258]
    ];
    this._nbSmoothPath(g, riv);
    g.fillStyle = this._nbLG(g, 0, 1258, 0, 1652, [[0, '#8cc8a0'], [0.3, '#3a9a76'], [1, '#2a7a62']]);
    g.fill();
    g.strokeStyle = 'rgba(60,44,26,.85)';
    g.lineWidth = 5;
    g.stroke();

    g.fillStyle = this._nbLG(g, 0, 1500, 0, 1652, [[0, 'rgba(120,190,200,0)'], [1, 'rgba(120,190,200,.5)']]);
    g.fillRect(1500, 1520, 608, 132);
  }

  _nbDrawFgLayer(g) {
    [[180, 1240, 160], [270, 1310, 130], [450, 1300, 120], [560, 1350, 110], [160, 1440, 170], [340, 1450, 140]]
      .forEach(([x, y, r], i) => this._nbPalmTree(g, x, y, r, i % 2 ? '#7a9a3a' : '#a4b84a', i % 2 ? '#2e6a3a' : '#5a8a38', 0));

    [[1400, 1372, 120], [1510, 1330, 130], [1700, 1332, 120], [1810, 1380, 120], [1920, 1410, 110]]
      .forEach(([x, y, r], i) => this._nbPalmTree(g, x, y, r, i % 2 ? '#8aa83c' : '#b4c458', '#2e6a3a', 60));

    g.fillStyle = '#10382e';
    [[1300, 1370, 60], [1340, 1340, 50], [1330, 1400, 55], [1370, 1390, 40]].forEach(([x, y, r]) => {
      g.beginPath();
      g.arc(x, y, r, 0, 7);
      g.fill();
    });

    g.fillStyle = '#2a7a36';
    for (let i = 0; i < 12; i++) {
      g.beginPath();
      g.arc(2000 + this._nbRnd(i) * 108, 1300 + this._nbRnd(i + 3) * 200, 40 + this._nbRnd(i + 6) * 36, 0, 7);
      g.fill();
    }

    for (let i = 0; i < 14; i++) {
      this._nbBladeShape(g, 105 + i * 24, 1652, 280 + (i % 4) * 70, -1.6 - (i % 5) * 0.1 + 0.3, 11, i % 2 ? '#0c2a26' : '#143a30');
    }

    g.strokeStyle = '#6a4a30';
    g.lineWidth = 5;
    [[560, 1480], [640, 1530], [720, 1505]].forEach(([x, y]) => {
      g.beginPath();
      g.moveTo(x - 10, 1652);
      g.quadraticCurveTo(x - 6, (y + 1652) / 2, x, y + 20);
      g.stroke();
      g.fillStyle = '#7a4a2a';
      g.beginPath();
      g.ellipse(x, y, 8, 26, 0.1, 0, 7);
      g.fill();
    });

    for (let i = 0; i < 10; i++) {
      this._nbBladeShape(g, 600 + i * 22, 1652, 160 + (i % 3) * 60, -1.5 + (i - 5) * 0.12, 8, i % 2 ? '#2a6a34' : '#4a8a3c');
    }
    for (let i = 0; i < 10; i++) {
      this._nbBladeShape(g, 1860 + i * 24, 1652, 220 + (i % 3) * 60, -1.5 + (i - 5) * 0.1, 9, i % 2 ? '#0e3a2e' : '#1c5a40');
    }

    g.fillStyle = '#8a7a6a';
    g.beginPath();
    g.ellipse(900, 1620, 50, 18, 0, 0, 7);
    g.fill();
  }

  // ------------------------------------------
  // LỚP ĐỘNG
  // ------------------------------------------
  _nbDrawWater(ctx, t) {
    ctx.save();
    ctx.lineCap = 'round';
    const flows = [
      [1150, 1285, 1080, 1330, 930, 1390, 850, 1470],
      [1190, 1300, 1120, 1350, 1000, 1400, 900, 1500],
      [850, 1540, 980, 1580, 1100, 1560, 1300, 1580],
      [1000, 1590, 1200, 1620, 1500, 1620, 1700, 1610],
      [1450, 1560, 1600, 1590, 1800, 1585, 2000, 1610],
      [920, 1470, 960, 1510, 1010, 1550, 1060, 1560]
    ];

    flows.forEach((f, i) => {
      ctx.setLineDash([70 + i * 8, 46]);
      ctx.lineDashOffset = -t * (16 + i * 3);
      ctx.strokeStyle = `rgba(230,250,235,${0.28 + 0.14 * Math.sin(t + i)})`;
      ctx.lineWidth = 5 - (i > 1 ? 0 : 1);
      ctx.beginPath();
      ctx.moveTo(f[0], f[1]);
      ctx.bezierCurveTo(f[2], f[3], f[4], f[5], f[6], f[7]);
      ctx.stroke();
    });

    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(240,255,240,.30)';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 26; i++) {
      const x = 800 + this._nbRnd(i) * 1250;
      const y = 1470 + this._nbRnd(i + 5) * 170;
      if (y < 1460 + (x - 800) * 0.05) continue;
      const len = 30 + this._nbRnd(i + 9) * 60;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y + Math.sin(t * 2 + i) * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  _nbBoat(ctx, b, t) {
    const bob = Math.sin(t * 1.6 + b.p) * 2 * b.s;
    const dx = Math.sin(t * 0.35 + b.p) * 14 * b.s;

    ctx.save();
    ctx.translate(b.x + dx, b.y + bob);
    ctx.scale(b.s * b.d, b.s);

    ctx.fillStyle = 'rgba(255,255,255,.28)';
    ctx.beginPath();
    ctx.ellipse(0, 6, 54, 8, 0, 0, 7);
    ctx.fill();

    ctx.fillStyle = '#6a3e22';
    ctx.beginPath();
    ctx.moveTo(-52, -4);
    ctx.quadraticCurveTo(0, 14, 52, -4);
    ctx.lineTo(44, -12);
    ctx.lineTo(-44, -12);
    ctx.fill();
    ctx.fillStyle = '#a07040';
    ctx.fillRect(-44, -13, 88, 4);

    for (let i = 0; i < b.n; i++) {
      const x = -18 + i * 38;
      ctx.fillStyle = i % 2 ? '#2a6a8a' : '#6a8a4a';
      ctx.fillRect(x - 6, -34, 12, 22);
      ctx.fillStyle = '#c8905a';
      ctx.beginPath();
      ctx.arc(x, -40, 6, 0, 7);
      ctx.fill();
      ctx.fillStyle = '#e0c488';
      ctx.beginPath();
      ctx.moveTo(x - 16, -38);
      ctx.lineTo(x, -56);
      ctx.lineTo(x + 16, -38);
      ctx.fill();
    }

    ctx.strokeStyle = '#5a3a22';
    ctx.lineWidth = 3;
    const o = Math.sin(t * 2 + b.p) * 6;
    ctx.beginPath();
    ctx.moveTo(-14, -28);
    ctx.lineTo(-60, 10 + o);
    ctx.moveTo(14, -28);
    ctx.lineTo(60, 10 - o);
    ctx.stroke();

    ctx.restore();
  }

  _nbDrawRays(ctx, t) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 6; i++) {
      const a = -2.2 + i * 0.28;
      const al = 0.02 + 0.015 * Math.sin(t * 0.8 + i);
      ctx.fillStyle = `rgba(255,220,130,${al})`;
      ctx.beginPath();
      ctx.moveTo(1170, 1180);
      ctx.lineTo(1170 + Math.cos(a - 0.025) * 1100, 1180 + Math.sin(a - 0.025) * 1100);
      ctx.lineTo(1170 + Math.cos(a + 0.025) * 1100, 1180 + Math.sin(a + 0.025) * 1100);
      ctx.fill();
    }
    ctx.restore();
  }

  _nbDrawMotes(ctx, t, scene) {
    // Dùng một sprite phát sáng dựng sẵn để không phải tạo gradient mỗi khung hình
    if (!scene.glow) scene.glow = this._nbGlowSprite();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const m of scene.motes) {
      const x = m.x + Math.sin(t * 0.5 + m.p) * 30;
      const y = m.y - ((t * 10 + m.p * 40) % 140);
      const a = 0.35 + 0.55 * Math.abs(Math.sin(t + m.p));
      ctx.globalAlpha = a;
      ctx.drawImage(scene.glow, x - 11, y - 11, 22, 22);
    }
    ctx.restore();
  }

  _nbDrawBirds(ctx, t, scene) {
    ctx.strokeStyle = '#5a3a4a';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    for (const b of scene.birds) {
      const x = b.x + Math.sin(t * 0.4 + b.p) * 40;
      const y = b.y + Math.sin(t * 0.8 + b.p) * 10;
      const f = Math.sin(t * 5 + b.p) * 6;
      ctx.beginPath();
      ctx.moveTo(x - b.s, y - 10 + f);
      ctx.quadraticCurveTo(x - b.s / 2, y + 4, x, y + 2);
      ctx.quadraticCurveTo(x + b.s / 2, y + 4, x + b.s, y - 10 + f);
      ctx.stroke();
    }
  }

  // Khung lá tối ở hai góc dưới (dùng toạ độ khung vẽ, cho khung dọc vẫn có tiền cảnh)
  _nbDrawFrame(ctx, w, h) {
    const short = Math.min(w, h);

    const crown = (x, y, len, rot, c1, c2) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      for (let i = 0; i < 9; i++) {
        const ang = -Math.PI * 0.96 + (i / 8) * Math.PI * 0.9;
        const l = len * (0.72 + this._nbRnd(i * 3 + 1) * 0.4);
        const halfW = len * 0.07;
        ctx.fillStyle = i % 2 ? c1 : c2;
        ctx.beginPath();
        ctx.moveTo(-halfW, 0);
        ctx.quadraticCurveTo(Math.cos(ang) * l * 0.55 - halfW, Math.sin(ang) * l * 0.55,
          Math.cos(ang) * l, Math.sin(ang) * l);
        ctx.quadraticCurveTo(Math.cos(ang) * l * 0.55 + halfW, Math.sin(ang) * l * 0.55,
          halfW, 0);
        ctx.fill();
      }
      ctx.restore();
    };

    crown(-0.02 * w, h * 1.02, 0.30 * short, 0.30, '#0d3226', '#144533');
    crown(w * 1.02, h * 1.03, 0.28 * short, -0.32, '#0c2f24', '#123f2f');

    // Lớp tối mỏng ở đáy tranh
    const base = ctx.createLinearGradient(0, h * 0.90, 0, h);
    base.addColorStop(0, 'rgba(9, 34, 26, 0)');
    base.addColorStop(1, 'rgba(9, 34, 26, 0.42)');
    ctx.fillStyle = base;
    ctx.fillRect(0, h * 0.90, w, h * 0.10);
  }

  // ==========================================
  // PANEL 3: HÀ NỘI (Tháp Rùa Hồ Gươm & Cầu Long Biên)
  // MASTERPIECE CINEMATIC 2D ART - 100% DEMO & REFERENCE
  // OFFCANVAS MULTI-LAYER CACHING FOR SILKY 60 FPS
  // FULLY RESPONSIVE FOR MOBILE PHONES & DESKTOP
  // ==========================================
  _drawHanoi(ctx) {
    const scene = this._getHanoiScene();
    const t = this.animTimer || 0;

    ctx.save();
    // 1. Vẽ nền tĩnh (Bầu trời hoàng hôn, Trăng, Mây, Đồi xa, Mặt nước, Bờ cây & Cầu Long Biên)
    this._resetView(ctx);
    ctx.drawImage(scene.bg, 0, 0);

    // 2. Đàn chim chiều chao lượn trên bầu trời
    this._hanoiT(ctx, scene);
    ctx.strokeStyle = '#4a2a5a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    scene.birds.forEach(b => {
      const x = ((b.x + t * 14) % 2000) + 105;
      const y = b.y + Math.sin(t + b.p) * 12;
      const f = Math.sin(t * 5 + b.p) * 6;
      ctx.beginPath();
      ctx.moveTo(x - b.s, y - f);
      ctx.quadraticCurveTo(x - b.s / 2, y - 8, x, y);
      ctx.quadraticCurveTo(x + b.s / 2, y - 8, x + b.s, y - f);
      ctx.stroke();
    });

    // 3. Đèn cầu Long Biên lấp lánh trong hoàng hôn
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    scene.lamps.forEach((x, i) => {
      const y = scene.top(x) + 18;
      const a = 0.6 + 0.4 * Math.sin(t * 2 + i * 1.7);
      ctx.fillStyle = this._hanoiRg(ctx, x, y, 0, 22, [
        [0, 'rgba(255,210,110,' + a + ')'],
        [1, 'rgba(255,160,50,0)']
      ]);
      ctx.fillRect(x - 22, y - 22, 44, 44);
    });
    ctx.restore();

    // 4. Phản chiếu dầm thép Cầu Long Biên xuống mặt nước
    this._hanoiRefl(ctx, scene.brg, 1000, 1000, 1280, 0.42, 280, 2.5, t, scene);

    // 5. Gợn sóng lấp lánh ánh hoàng hôn trên mặt nước sông
    ctx.save();
    this._hanoiT(ctx, scene);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 60; i++) {
      const y = 1010 + i * 10 + this._hanoiRnd(i) * 8;
      const x = 140 + this._hanoiRnd(i + 20) * 1900;
      const w = 60 + this._hanoiRnd(i + 40) * 160;
      const a = (0.12 + 0.2 * Math.abs(Math.sin(t * 1.4 + i))) * (1 - (y - 1000) / 760);
      ctx.strokeStyle = 'rgba(255,200,150,' + a + ')';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - w / 2, y);
      for (let q = 1; q <= 6; q++) {
        ctx.lineTo(x - w / 2 + w * q / 6, y + Math.sin(t * 2 + q * 1.5 + i) * 3);
      }
      ctx.stroke();
    }

    // Quầng ấm vàng đổ bóng từ Tháp Rùa xuống mặt nước
    ctx.fillStyle = this._hanoiRg(ctx, 1363, 1330, 10, 420, [
      [0, 'rgba(255,170,60,.22)'],
      [1, 'rgba(255,170,60,0)']
    ]);
    ctx.fillRect(0, 1250, 2300, 402);
    ctx.restore();

    // 6. Phản chiếu hình bóng Tháp Rùa lung linh sóng nước Hồ Gươm
    this._hanoiRefl(ctx, scene.twr, 1215, 1268, 1640, 0.85, 460, 5, t, scene);

    // Vệt gợn sóng vàng óng chân Tháp Rùa
    ctx.save();
    this._hanoiT(ctx, scene);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 40; i++) {
      const y = 1280 + i * 8 + this._hanoiRnd(i) * 6;
      const x = 1200 + this._hanoiRnd(i + 70) * 330;
      const w = 50 + this._hanoiRnd(i + 3) * 120;
      ctx.strokeStyle = 'rgba(255,190,90,' + ((0.1 + 0.25 * Math.abs(Math.sin(t * 1.8 + i))) * (1 - (y - 1270) / 330)) + ')';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - w / 2, y);
      ctx.lineTo(x + w / 2, y + Math.sin(t * 2 + i) * 3);
      ctx.stroke();
    }
    ctx.restore();

    // 7. Vẽ Đảo Ngọc & Tháp Rùa
    this._resetView(ctx);
    ctx.drawImage(scene.isl, 0, 0);

    // 8. Hiệu ứng ánh sáng tỏa ra từ các cửa vòm Tháp Rùa & Đom đóm bay lượn
    ctx.save();
    this._hanoiT(ctx, scene);
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.75 + 0.25 * Math.sin(t * 2.3);
    ctx.fillStyle = this._hanoiRg(ctx, 1363, 1100, 20, 520, [
      [0, 'rgba(255,170,60,' + (0.2 * f) + ')'],
      [1, 'rgba(255,170,60,0)']
    ]);
    ctx.fillRect(800, 600, 1100, 700);

    [[1363, 1115, 70], [1363, 970, 56], [1272, 1120, 36], [1454, 1120, 36], [1280, 980, 30], [1448, 980, 30], [1342, 806, 30], [1386, 806, 30]].forEach(([x, y, r], i) => {
      const a = 0.35 + 0.3 * Math.sin(t * 2.1 + i * 1.3);
      ctx.fillStyle = this._hanoiRg(ctx, x, y, 2, r, [
        [0, 'rgba(255,190,80,' + a + ')'],
        [1, 'rgba(255,150,40,0)']
      ]);
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    });

    scene.flies.forEach(fl => {
      const x = fl.x + Math.sin(t * 0.7 + fl.p) * 30;
      const y = fl.y + Math.cos(t * 0.9 + fl.p) * 18;
      const a = 0.3 + 0.7 * Math.abs(Math.sin(t * 1.8 + fl.p));
      ctx.fillStyle = this._hanoiRg(ctx, x, y, 0, 14, [
        [0, 'rgba(255,240,140,' + a + ')'],
        [1, 'rgba(255,200,60,0)']
      ]);
      ctx.fillRect(x - 14, y - 14, 28, 28);
    });
    ctx.restore();

    // 9. Tầng tiền cảnh
    this._resetView(ctx);
    ctx.drawImage(scene.fg, 0, 0);

    // 10. Hàng liễu rủ đung đưa trong gió thu Hà Nội
    this._hanoiWillow(ctx, t, scene);

    // 11. Vignette
    this._resetView(ctx);
    const v = ctx.createRadialGradient(scene.W / 2, scene.H * 0.55, scene.H * 0.35, scene.W / 2, scene.H * 0.55, scene.H * 0.95);
    v.addColorStop(0, 'rgba(14,8,34,0)');
    v.addColorStop(1, 'rgba(14,8,34,.4)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, scene.W, scene.H);

    ctx.restore();
  }

  // ==========================================
  // CÁC HÀM PHỤ TRỢ CHI TIẾT HÀ NỘI
  // ==========================================

  _getHanoiScene() {
    const width = Math.max(1, Math.round(this.width));
    const height = Math.max(1, Math.round(this.height));
    if (this._hanoiScene && this._hanoiScene.W === width && this._hanoiScene.H === height) {
      return this._hanoiScene;
    }
    const W = width, H = height;
    const isMobile = W < H;
    const baseW = isMobile ? 1120 : 2003;
    const baseH = 1652;
    const minX = isMobile ? 720 : 105;
    const K = Math.max(W / baseW, H / baseH);
    const offsetX = (W - baseW * K) / 2 - minX * K;
    const offsetY = (H - baseH * K) / 2;
    const P = [[105,850],[135,832],[553,702],[1035,828],[1450,826],[1890,703],[2108,790]];
    const top = x => { for (let i = 1; i < P.length; i++) { if (x <= P[i][0]) { const a = P[i-1], b = P[i]; return a[1] + (b[1]-a[1])*(x-a[0])/(b[0]-a[0]); } } return 790; };
    const scene = { W, H, K, offsetX, offsetY, isMobile, baseW, minX, P, top,
      birds: Array.from({length:8},(_,i)=>({x:minX+50+this._hanoiRnd(i+31)*(baseW-100),y:180+this._hanoiRnd(i+41)*560,s:14+this._hanoiRnd(i)*22,p:this._hanoiRnd(i+5)*6})),
      flies: Array.from({length:14},(_,i)=>({x:(isMobile?1050:900)+this._hanoiRnd(i+9)*(isMobile?600:900),y:1000+this._hanoiRnd(i+19)*220,p:this._hanoiRnd(i)*6})),
      lamps: isMobile ? [820,1030,1215,1450,1650,1800] : [318,466,650,820,1030,1215,1650,1800,2000]
    };
    const [brgCv,brgCtx]=this._hanoiMk(W,H,K,offsetX,offsetY); this._hanoiBuildBridge(brgCtx,scene); scene.brg=brgCv;
    const [twrCv,twrCtx]=this._hanoiMk(W,H,K,offsetX,offsetY); this._hanoiBuildTower(twrCtx,scene); scene.twr=twrCv;
    const [islCv,islCtx]=this._hanoiMk(W,H,K,offsetX,offsetY); this._hanoiBuildIsland(islCtx,scene); scene.isl=islCv;
    const [bgCv,bgCtx]=this._hanoiMk(W,H,K,offsetX,offsetY); this._hanoiBuildBg(bgCtx,scene); scene.bg=bgCv;
    const [fgCv,fgCtx]=this._hanoiMk(W,H,K,offsetX,offsetY); this._hanoiBuildFg(fgCtx,scene); scene.fg=fgCv;
    this._hanoiScene = scene;
    return scene;
  }

  _hanoiMk(W,H,K,offsetX,offsetY) { const c=document.createElement('canvas'); c.width=W; c.height=H; const x=c.getContext('2d'); x.setTransform(K,0,0,K,offsetX,offsetY); return[c,x]; }
  _hanoiT(c, scene) { this._viewT(c, scene.K, scene.K, scene.offsetX, scene.offsetY); }
  _hanoiRnd(n) { const s=Math.sin(n*127.1+311.7)*43758.5453; return s-Math.floor(s); }
  _hanoiLg(c,x0,y0,x1,y1,st) { const g=c.createLinearGradient(x0,y0,x1,y1); st.forEach(s=>g.addColorStop(s[0],s[1])); return g; }
  _hanoiRg(c,x,y,r0,r1,st) { const g=c.createRadialGradient(x,y,r0,x,y,r1); st.forEach(s=>g.addColorStop(s[0],s[1])); return g; }
  _hanoiCloud(c,circs,base,body,rim) { c.save(); c.beginPath(); c.rect(0,0,2400,base); c.clip(); c.fillStyle=rim; c.beginPath(); circs.forEach(o=>{c.moveTo(o[0]+o[2],o[1]);c.arc(o[0],o[1],o[2],0,Math.PI*2);}); c.fill(); c.fillStyle=body; c.beginPath(); circs.forEach(o=>{c.moveTo(o[0]+o[2],o[1]+12);c.arc(o[0],o[1]+12,o[2],0,Math.PI*2);}); c.fill(); c.restore(); }
  _hanoiBlade(c,x,y,L,a,w,col) { c.fillStyle=col; c.beginPath(); c.moveTo(x-w,y); c.quadraticCurveTo(x+Math.cos(a)*L*.6-w,y+Math.sin(a)*L*.6,x+Math.cos(a)*L,y+Math.sin(a)*L); c.quadraticCurveTo(x+Math.cos(a)*L*.6+w,y+Math.sin(a)*L*.6,x+w,y); c.fill(); }
  _hanoiBurst(c,x,y,r,n,c1,c2) { for(let i=0;i<n;i++) this._hanoiBlade(c,x,y,r*(.7+this._hanoiRnd(i+x)*.5),i/n*Math.PI*2,3.2,i%2?c1:c2); }

  _hanoiBuildBridge(c,scene) {
    const P=scene.P, top=scene.top, col='#2e2a4c'; c.lineCap='round'; c.lineJoin='round';
    [[115,916,48,108],[530,916,50,108],[952,916,48,108],[1830,916,50,108]].forEach(([x,y,w,h])=>{c.fillStyle=this._hanoiLg(c,x,0,x+w,0,[[0,'#4a3c5c'],[1,'#2c2644']]);c.fillRect(x,y,w,h);c.fillStyle='rgba(255,170,110,.3)';c.fillRect(x,y,5,h);c.fillStyle='#241e3c';c.fillRect(x-6,y,w+12,14);});
    c.strokeStyle=col; c.lineWidth=3.4;
    for(let x=138;x<2080;x+=64){c.beginPath();c.moveTo(x,892);c.lineTo(x,top(x));c.stroke();const x2=x+64;c.beginPath();if(((x-138)/64)%2){c.moveTo(x,top(x));c.lineTo(x2,892);}else{c.moveTo(x,892);c.lineTo(x2,top(x2));}c.stroke();}
    c.lineWidth=8;[[553,470,640],[1890,1800,1985]].forEach(([px,a,b])=>{c.beginPath();c.moveTo(a,892);c.lineTo(px,top(px));c.lineTo(b,892);c.stroke();c.lineWidth=13;c.beginPath();c.moveTo(px,892);c.lineTo(px,top(px));c.stroke();c.lineWidth=8;});
    [[330,553],[553,780],[1700,1890],[1890,2060]].forEach(([a,b])=>{c.lineWidth=6;c.beginPath();c.moveTo(a,892);c.lineTo(b,top(b));c.stroke();});
    c.lineWidth=9;c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
    c.lineWidth=3;c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]+15):c.moveTo(p[0],p[1]+15));c.stroke();
    c.fillStyle=col;c.fillRect(133,818,14,76);c.setLineDash([2,7]);c.lineWidth=10;c.beginPath();c.moveTo(105,884);c.lineTo(2108,884);c.stroke();c.setLineDash([]);
    c.lineWidth=2.4;[878,892].forEach(y=>{c.beginPath();c.moveTo(105,y);c.lineTo(2108,y);c.stroke();});
  }

  _hanoiBuildTower(t,scene) {
    const wall=(x,y,w,h)=>{t.fillStyle=this._hanoiLg(t,x,0,x+w,0,[[0,'#7a5230'],[.3,'#d8a860'],[.7,'#e0b068'],[1,'#6a4428']]);t.fillRect(x,y,w,h);};
    wall(1218,1030,292,130);wall(1232,900,264,130);wall(1290,835,150,66);wall(1312,782,104,48);
    t.fillStyle='#5a3a24';t.fillRect(1212,1022,304,10);t.fillRect(1226,892,276,10);t.fillRect(1284,828,162,9);
    const bal=(x,y,w)=>{t.fillStyle='#a07040';t.fillRect(x,y,w,6);t.fillRect(x,y+20,w,6);t.fillStyle='#7a5030';for(let i=x+6;i<x+w-4;i+=12)t.fillRect(i,y+6,5,14);};
    bal(1228,1006,272);t.fillStyle='#a07040';t.fillRect(1228,872,272,6);
    const door=(x,y,w,h,glow)=>{t.fillStyle='#3a1608';t.beginPath();t.moveTo(x,y+h);t.lineTo(x,y+w*.5);t.quadraticCurveTo(x+w/2,y-w*.25,x+w,y+w*.5);t.lineTo(x+w,y+h);t.fill();t.fillStyle=this._hanoiLg(t,0,y,0,y+h,[[0,'rgba(255,'+(160+glow)+',50,.95)'],[1,'rgba(200,90,20,.55)']]);const m=w*.16;t.beginPath();t.moveTo(x+m,y+h);t.lineTo(x+m,y+w*.52);t.quadraticCurveTo(x+w/2,y+w*.02,x+w-m,y+w*.52);t.lineTo(x+w-m,y+h);t.fill();t.fillStyle='#4a2410';t.fillRect(x+w*.46,y+w*.3,w*.08,h);};
    door(1325,1068,76,92,40);door(1252,1076,44,84,20);door(1432,1076,44,84,20);
    door(1336,936,56,70,50);door(1260,950,38,56,20);door(1430,950,38,56,20);
    t.fillStyle='#2a1008';t.beginPath();t.moveTo(1346,902);t.lineTo(1346,884);t.quadraticCurveTo(1363,866,1380,884);t.lineTo(1380,902);t.fill();
    t.fillStyle='#ffcc55';t.fillRect(1332,800,20,13);t.fillRect(1376,800,20,13);
    t.fillStyle='#4a2c28';t.beginPath();t.moveTo(1285,764);t.quadraticCurveTo(1308,792,1345,786);t.lineTo(1382,786);t.quadraticCurveTo(1420,792,1442,764);t.quadraticCurveTo(1430,800,1390,800);t.lineTo(1338,800);t.quadraticCurveTo(1296,800,1285,764);t.fill();
    t.fillStyle='#6a3c30';t.beginPath();t.moveTo(1310,786);t.lineTo(1330,758);t.lineTo(1396,758);t.lineTo(1416,786);t.fill();
    t.strokeStyle='#e8b070';t.lineWidth=3;t.beginPath();t.moveTo(1288,766);t.quadraticCurveTo(1308,790,1345,785);t.lineTo(1382,785);t.quadraticCurveTo(1420,790,1440,766);t.stroke();
    t.fillStyle='#6a3c30';t.beginPath();t.moveTo(1346,760);t.lineTo(1363,738);t.lineTo(1380,760);t.fill();t.fillRect(1352,748,22,12);t.fillStyle='#e8b070';t.fillRect(1358,730,10,10);
    t.fillStyle='#7a4a34';[1292,1434].forEach(x=>{t.beginPath();t.arc(x,764,7,0,Math.PI*2);t.fill();});
  }

  _hanoiBuildIsland(c,scene) {
    c.fillStyle='rgba(160,230,90,.25)';c.beginPath();c.ellipse(1360,1210,600,70,0,0,Math.PI*2);c.fill();
    c.fillStyle=this._hanoiLg(c,0,1140,0,1264,[[0,'#8ad850'],[.35,'#4aa83a'],[1,'#1c6a2a']]);
    c.beginPath();c.moveTo(810,1205);c.bezierCurveTo(950,1160,1100,1142,1230,1142);c.lineTo(1520,1142);c.bezierCurveTo(1700,1148,1820,1170,1905,1205);c.bezierCurveTo(1800,1250,1600,1262,1360,1264);c.bezierCurveTo(1100,1264,900,1245,810,1205);c.fill();
    c.strokeStyle='rgba(210,255,140,.6)';c.lineWidth=4;c.beginPath();c.moveTo(830,1200);c.bezierCurveTo(1000,1170,1150,1150,1230,1148);c.moveTo(1520,1148);c.bezierCurveTo(1700,1152,1800,1175,1890,1203);c.stroke();
    c.fillStyle='rgba(255,180,60,.22)';c.beginPath();c.ellipse(1363,1170,280,40,0,0,Math.PI*2);c.fill();
    [[1230,1170,1],[1530,1175,1.1]].forEach(([x,y,s])=>{for(let i=0;i<9;i++){c.fillStyle=i%2?'#2c6a2e':'#1e5026';c.beginPath();c.arc(x+(i-4)*16*s,y-(i%3)*8,22*s,0,Math.PI*2);c.fill();}});
    c.save();c.setTransform(1,0,0,1,0,0);c.drawImage(scene.twr,0,0);c.restore();
  }

  _hanoiBuildBg(c,scene) {
    const minX=scene.minX, baseW=scene.baseW;
    c.fillStyle=this._hanoiLg(c,0,0,0,980,[[0,'#261b40'],[.25,'#482a52'],[.55,'#8a4362'],[.78,'#c96464'],[.92,'#f09670'],[1,'#ffb87a']]);c.fillRect(minX-50,0,baseW+100,990);
    c.fillStyle=this._hanoiRg(c,1100,960,10,720,[[0,'rgba(255,190,110,.75)'],[1,'rgba(255,150,80,0)']]);c.fillRect(minX-50,0,baseW+100,990);
    c.fillStyle=this._hanoiRg(c,1760,180,20,120,[[0,'rgba(255,230,240,.35)'],[1,'rgba(255,200,230,0)']]);c.fillRect(1600,20,320,320);c.fillStyle='rgba(235,215,240,.6)';c.beginPath();c.arc(1760,180,58,0,Math.PI*2);c.fill();
    this._hanoiCloud(c,[[300,640,110],[470,590,120],[640,620,90],[790,660,80],[180,650,70]],700,'#c0888a','#e8b0a0');
    this._hanoiCloud(c,[[1550,600,90],[1700,540,120],[1850,560,90],[2000,600,80],[1450,630,60]],660,'#c0868c','#e6aa9c');
    this._hanoiCloud(c,[[1330,840,80],[1450,790,110],[1560,830,70]],900,'#d89890','#f4b8a0');
    this._hanoiCloud(c,[[700,800,90],[830,770,110],[950,800,80]],880,'#d49490','#f2b4a0');
    c.fillStyle='#7a5a78';for(let i=0;i<28;i++){const x=105+i*38+this._hanoiRnd(i)*20,h=20+this._hanoiRnd(i+4)*46;c.fillRect(x,980-h,28+this._hanoiRnd(i+8)*14,h);}
    c.fillStyle='#6a5a78';c.beginPath();c.moveTo(980,985);c.quadraticCurveTo(1100,925,1240,985);c.fill();
    c.fillStyle=this._hanoiLg(c,0,978,0,1652,[[0,'#e49a80'],[.12,'#c08090'],[.35,'#7a5a84'],[.7,'#4c3c66'],[1,'#2e2448']]);c.fillRect(minX-50,978,baseW+100,674);
    c.fillStyle=this._hanoiRg(c,1100,990,10,760,[[0,'rgba(255,200,140,.4)'],[1,'rgba(255,200,140,0)']]);c.fillRect(minX-50,978,baseW+100,674);
    c.save();c.setTransform(1,0,0,1,0,0);c.drawImage(scene.brg,0,0);c.restore();
    c.fillStyle='#18362e';c.beginPath();c.moveTo(1480,1000);c.lineTo(2108,940);c.lineTo(2108,1180);c.quadraticCurveTo(1900,1100,1700,1085);c.quadraticCurveTo(1560,1070,1480,1040);c.fill();
    for(let i=0;i<46;i++){const x=1500+this._hanoiRnd(i)*620,y=950+this._hanoiRnd(i+3)*120-(x-1500)*.03,r=30+this._hanoiRnd(i+6)*42;c.fillStyle=i%3?'#1f4a3a':'#2c6244';c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();}
    c.fillStyle=this._hanoiLg(c,0,1090,0,1200,[[0,'rgba(20,50,44,.7)'],[1,'rgba(20,50,44,0)']]);c.fillRect(1500,1090,608,120);
    c.fillStyle='rgba(70,40,60,.25)';c.fillRect(minX-50,1020,baseW+100,20);
  }

  _hanoiBuildFg(c,scene) {
    for(let i=0;i<18;i++){c.fillStyle=i%2?'#10282e':'#17363a';c.beginPath();c.arc(130+this._hanoiRnd(i)*300,1170+this._hanoiRnd(i+3)*380,50+this._hanoiRnd(i+6)*70,0,Math.PI*2);c.fill();}
    this._hanoiBurst(c,190,1260,110,36,'#7a8a3a','#a4b24a');this._hanoiBurst(c,330,1330,120,40,'#2a4a3a','#1c3a34');this._hanoiBurst(c,150,1480,90,28,'#2e6a3a','#8ea040');
    for(let i=0;i<10;i++)this._hanoiBlade(c,130+i*28,1652,300+(i%3)*70,-1.75+i*.09,10,i%2?'#0c2a28':'#183e34');
    c.fillStyle='#3a2a3a';c.fillRect(424,1070,14,560);
    [[282,1112,140,62],[445,1186,145,62]].forEach(([x,y,w,h])=>{c.fillStyle='#2a2640';c.fillRect(x,y,w,h);c.strokeStyle='#8a7a6a';c.lineWidth=4;c.strokeRect(x+2,y+2,w-4,h-4);c.fillStyle='#6a6a88';c.fillRect(x+18,y+22,w-36,18);});
    c.fillStyle='#6a6070';c.fillRect(220,1468,400,26);c.fillStyle='#4a4458';for(let x=238;x<520;x+=44)c.fillRect(x,1494,20,100);
    c.fillStyle='#847a8a';c.fillRect(520,1390,100,262);c.fillStyle='#a49aa8';c.fillRect(510,1380,120,20);
    this._hanoiBurst(c,720,1540,150,40,'#8aa03a','#587a30');this._hanoiBurst(c,600,1600,110,30,'#a4b84a','#6a8a34');this._hanoiBurst(c,2000,1500,150,40,'#8aa03a','#46703a');this._hanoiBurst(c,1850,1600,110,30,'#6a8a34','#2e5a34');
    for(let i=0;i<14;i++)this._hanoiBlade(c,1700+i*26,1652,260+(i%4)*70,-1.7-(i%5)*.08,9,i%2?'#183e34':'#285a38');
    c.fillStyle='#7a4a2a';[1790,1840,1890].forEach(x=>{c.fillRect(x,1430,10,90);c.beginPath();c.ellipse(x+5,1420,8,24,0,0,Math.PI*2);c.fill();});
  }

  _hanoiRefl(c,src,axis,y0,y1,a0,fade,amp,t,scene) {
    const K=scene.K,W=scene.W,offsetY=scene.offsetY;c.save();c.setTransform(1,0,0,1,0,0);
    for(let y=y0;y<y1;y+=4){const sy=2*axis-y;if(sy<0)break;const d=y-y0,off=Math.sin(t*1.5+y*.06)*(amp*(1+d/200));c.globalAlpha=Math.max(0,a0*(1-d/fade))*(.75+.25*Math.sin(y*.5));c.drawImage(src,0,sy*K+offsetY,W,4*K,off*K,y*K+offsetY,W,4*K);}
    c.restore();
  }

  _hanoiWillow(c,t,scene) {
    c.save();c.lineCap='round';c.strokeStyle='#3a2430';this._hanoiT(c,scene);
    const hs=[[105,300,300,100,560,0,22],[1480,0,1700,70,1950,10,14],[1640,0,1820,160,2108,440,26]];
    hs.forEach(([x0,y0,cx,cy,x1,y1,w])=>{c.lineWidth=w;c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo(cx,cy,x1,y1);c.stroke();});
    [[0,60,1],[1,40,7],[2,34,13]].forEach(([bi,n,ph])=>{const[x0,y0,cx,cy,x1,y1]=hs[bi];
      for(let i=0;i<n;i++){const u=(i+this._hanoiRnd(i+ph))/n,v=1-u,bx=v*v*x0+2*v*u*cx+u*u*x1,by=v*v*y0+2*v*u*cy+u*u*y1;
        const L=220+this._hanoiRnd(i*3+ph)*520,sw=Math.sin(t*1.1+i*.7+ph)*16*(L/600),ex=bx+sw*1.6,ey=by+L;
        const g=c.createLinearGradient(0,by,0,ey);g.addColorStop(0,'#2a4a34');g.addColorStop(1,'#5a8a4a');c.strokeStyle=g;c.lineWidth=2.4;c.beginPath();c.moveTo(bx,by);c.quadraticCurveTo(bx+sw*.4,by+L*.5,ex,ey);c.stroke();
        for(let k=1;k<14;k++){const w=k/14,lx=bx+(ex-bx)*w*w+sw*.4*w*(1-w),ly=by+L*w,a=1.25+Math.sin(t*2+k+i)*.2;c.fillStyle=k%2?'#3e7a40':'#68a04a';c.beginPath();c.ellipse(lx+(k%2?5:-5),ly,3,14,k%2?a:-a,0,Math.PI*2);c.fill();}}});
    c.restore();
  }

  // ==========================================
  // PANEL 4: HUẾ (Đại Nội Ngọ Môn, Kỳ Đài & Cầu Tràng Tiền)
  // MASTERPIECE CINEMATIC 2D ART - 100% DEMO & REFERENCE
  // OFFCANVAS MULTI-LAYER CACHING FOR SILKY 60 FPS
  // FULLY RESPONSIVE FOR MOBILE PHONES & DESKTOP
  // ==========================================
  _drawHue(ctx) {
    const scene = this._getHueScene();
    const t = this.animTimer || 0;

    ctx.save();
    // 1. Vẽ nền tĩnh đã cache (Trời, Mây, Núi, Hoàng Thành, Kỳ Đài, Ngọ Môn)
    this._resetView(ctx);
    ctx.clearRect(0, 0, scene.W, scene.H);
    ctx.drawImage(scene.bg, 0, 0);

    // 2. Sao lấp lánh & Đàn chim chiều vỗ cánh bay
    this._hueT(ctx, scene);
    ctx.fillStyle = '#fff';
    scene.stars.forEach(s => {
      ctx.globalAlpha = 0.25 + 0.5 * Math.abs(Math.sin(t * 1.5 + s.p));
      ctx.fillRect(s.x, s.y, 3, 3);
    });
    ctx.globalAlpha = 1.0;

    // Đàn chim chiều
    ctx.strokeStyle = '#3a1a50';
    ctx.lineWidth = 3;
    scene.birds.forEach(b => {
      const x = ((b.x + t * 14) % (scene.baseW - 100)) + scene.minX + 50;
      const y = b.y + Math.sin(t + b.p) * 12;
      const f = Math.sin(t * 5 + b.p) * 6;
      ctx.beginPath();
      ctx.moveTo(x - b.s, y - f);
      ctx.quadraticCurveTo(x - b.s / 2, y - 8, x, y);
      ctx.quadraticCurveTo(x + b.s / 2, y - 8, x + b.s, y - f);
      ctx.stroke();
    });

    // 3. CỜ ĐỎ SAO VÀNG BAY PHẤP PHỚI TRÊN ĐỈNH KỲ ĐÀI
    const fx = scene.flagPos.x;
    const fy = scene.flagPos.y;
    ctx.fillStyle = '#d8232a';
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    for (let i = 0; i <= 20; i++) {
      ctx.lineTo(fx + i * 5, fy + Math.sin(t * 4 - i * 0.5) * (2 + i * 0.35));
    }
    for (let i = 20; i >= 0; i--) {
      ctx.lineTo(fx + i * 5, fy + 72 + Math.sin(t * 4 - i * 0.5) * (2 + i * 0.35));
    }
    ctx.fill();

    // Ngôi sao vàng năm cánh
    ctx.fillStyle = '#ffd21f';
    ctx.save();
    ctx.translate(fx + 50, fy + 36 + Math.sin(t * 4 - 5) * 4);
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 10 : 25;
      const a = -Math.PI / 2 + i * Math.PI / 5;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.fill();
    ctx.restore();

    // 4. Vẽ Cầu Tràng Tiền vào bộ nhớ đệm
    const bx = scene.brX;
    bx.setTransform(1, 0, 0, 1, 0, 0);
    bx.clearRect(0, 0, scene.W, scene.H);
    this._hueT(bx, scene);
    this._hueBridge(bx, t, scene);

    // 5. Mặt nước Sông Hương phản chiếu Cầu Tràng Tiền
    this._hueWater(ctx, t, scene);

    // 6. Vẽ Cầu Tràng Tiền lên màn hình chính
    this._resetView(ctx);
    ctx.drawImage(scene.brCanvas, 0, 0);

    // 7. Đom đóm đêm lập lòe bờ sông
    this._hueT(ctx, scene);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    scene.flies.forEach(f => {
      const x = f.x + Math.sin(t * 0.7 + f.p) * 30;
      const y = f.y + Math.cos(t * 0.9 + f.p) * 20;
      const a = 0.3 + 0.7 * Math.abs(Math.sin(t * 1.8 + f.p));
      ctx.fillStyle = this._hueRg(ctx, x, y, 0, 16, [
        [0, `rgba(255,230,120,${a})`],
        [1, 'rgba(255,200,60,0)']
      ]);
      ctx.fillRect(x - 16, y - 16, 32, 32);
    });
    ctx.restore();

    // 8. Tầng tiền cảnh (Lan can đá, khóm cây ven sông)
    this._resetView(ctx);
    ctx.drawImage(scene.fg, 0, 0);

    // 9. Cành liễu rủ đung đưa trong gió
    this._hueWillow(ctx, t, scene);

    // 10. Lớp Vignette viền màn hình tạo chiều sâu điện ảnh
    this._resetView(ctx);
    const v = ctx.createRadialGradient(
      scene.W / 2, scene.H * 0.55, scene.H * 0.35,
      scene.W / 2, scene.H * 0.55, scene.H * 0.95
    );
    v.addColorStop(0, 'rgba(10,4,30,0)');
    v.addColorStop(1, 'rgba(10,4,30,.45)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, scene.W, scene.H);

    ctx.restore();
  }

  _getHueScene() {
    const width = Math.max(1, Math.round(this.width));
    const height = Math.max(1, Math.round(this.height));
    if (this._hueScene &&
      this._hueScene.W === width &&
      this._hueScene.H === height) {
      return this._hueScene;
    }

    const W = width;
    const H = height;
    const isMobile = W < H;
    const baseW = isMobile ? 1060 : 2003;
    const baseH = 1652;
    const minX = isMobile ? 0 : 105;

    const K = Math.max(W / baseW, H / baseH);
    const offsetX = (W - baseW * K) / 2 - minX * K;
    const offsetY = (H - baseH * K) / 2;

    const scene = {
      W,
      H,
      K,
      offsetX,
      offsetY,
      isMobile,
      baseW,
      minX,
      stars: Array.from({ length: 50 }, (_, i) => ({
        x: minX + this._hueRnd(i + 7) * baseW,
        y: this._hueRnd(i + 77) * 380,
        p: this._hueRnd(i + 3) * 6
      })),
      flies: Array.from({ length: 16 }, (_, i) => ({
        x: minX + 40 + this._hueRnd(i + 9) * (baseW - 80),
        y: 850 + this._hueRnd(i + 19) * 380,
        p: this._hueRnd(i) * 6
      })),
      birds: Array.from({ length: 7 }, (_, i) => ({
        x: minX + 150 + this._hueRnd(i + 31) * (baseW - 300),
        y: 200 + this._hueRnd(i + 41) * 450,
        s: 14 + this._hueRnd(i) * 20,
        p: this._hueRnd(i + 5) * 6
      })),
      arches: isMobile ? [
        [490, 775, 120, 0],
        [775, 1050, 140, 1]
      ] : [
        [885, 1237, 105, 0],
        [1240, 1738, 150, 1],
        [1740, 2108, 130, 2]
      ],
      flagPos: isMobile ? { x: 468, y: 265 } : { x: 778, y: 265 }
    };

    // 1. Tầng nền tĩnh (Bầu trời, Hoàng Thành, Kỳ Đài, Ngọ Môn, bờ sông)
    const [bgCv, bgCtx] = this._hueMk(W, H, K, offsetX, offsetY);
    this._hueBuildBg(bgCtx, scene);
    scene.bg = bgCv;

    // 2. Tầng tiền cảnh tĩnh (Lan can đá, khóm cây, lau sậy)
    const [fgCv, fgCtx] = this._hueMk(W, H, K, offsetX, offsetY);
    this._hueBuildFg(fgCtx, scene);
    scene.fg = fgCv;

    // 3. Canvas đệm cho Cầu Tràng Tiền (dùng để trích xuất phản chiếu mặt nước)
    const [brCv, brCtx] = this._hueMk(W, H, K, offsetX, offsetY);
    scene.brCanvas = brCv;
    scene.brX = brCtx;

    this._hueScene = scene;
    return scene;
  }

  _hueMk(W, H, K, offsetX, offsetY) {
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const x = c.getContext('2d');
    x.setTransform(K, 0, 0, K, offsetX, offsetY);
    return [c, x];
  }

  _hueT(c, scene) { this._viewT(c, scene.K, scene.K, scene.offsetX, scene.offsetY); }

  _hueRnd(n) {
    const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return s - Math.floor(s);
  }

  _hueLg(c, x0, y0, x1, y1, st) {
    const g = c.createLinearGradient(x0, y0, x1, y1);
    st.forEach(s => g.addColorStop(s[0], s[1]));
    return g;
  }

  _hueRg(c, x, y, r0, r1, st) {
    const g = c.createRadialGradient(x, y, r0, x, y, r1);
    st.forEach(s => g.addColorStop(s[0], s[1]));
    return g;
  }

  _huePoly(c, pts, fill) {
    c.fillStyle = fill;
    c.beginPath();
    pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
    c.closePath();
    c.fill();
  }

  _hueCloud(c, circs, base, body, rim) {
    c.save();
    c.beginPath();
    c.rect(0, 0, 2400, base);
    c.clip();
    c.fillStyle = rim;
    c.beginPath();
    circs.forEach(o => { c.moveTo(o[0] + o[2], o[1]); c.arc(o[0], o[1], o[2], 0, Math.PI * 2); });
    c.fill();
    c.fillStyle = body;
    c.beginPath();
    circs.forEach(o => { c.moveTo(o[0] + o[2], o[1] + 12); c.arc(o[0], o[1] + 12, o[2], 0, Math.PI * 2); });
    c.fill();
    c.restore();
  }

  // Mái ngói hoàng cung cong vuốt đầu đao
  _hueRoof(c, x0, x1, y, h, col, edge) {
    const span = x1 - x0;
    c.fillStyle = col;
    c.beginPath();
    c.moveTo(x0 - 26, y + h + 8);
    c.quadraticCurveTo(x0 + 14, y + h, x0 + span * 0.12, y + h * 0.4);
    c.lineTo(x0 + span * 0.2, y);
    c.lineTo(x1 - span * 0.2, y);
    c.lineTo(x1 - span * 0.12, y + h * 0.4);
    c.quadraticCurveTo(x1 - 14, y + h, x1 + 26, y + h + 8);
    c.lineTo(x1, y + h + 12);
    c.lineTo(x0, y + h + 12);
    c.closePath();
    c.fill();

    c.strokeStyle = edge;
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(x0 + 6, y + h + 2);
    c.lineTo(x1 - 6, y + h + 2);
    c.stroke();

    // Vân ngói lưu ly
    c.strokeStyle = 'rgba(80,30,20,.35)';
    c.lineWidth = 2;
    for (let x = x0 + 20; x < x1 - 14; x += 14) {
      c.beginPath();
      c.moveTo(x, y + 6);
      c.lineTo(x + (x < (x0 + x1) / 2 ? -8 : 8), y + h);
      c.stroke();
    }
  }

  _hueColor(p) {
    const a = [275, 325, 185, 275];
    p = ((p % 1) + 1) % 1 * 3;
    const i = Math.floor(p), f = p - i;
    return a[i] + (a[i + 1] - a[i]) * f;
  }

  _hueBuildBg(c, scene) {
    const isMobile = scene.isMobile;
    const baseW = scene.baseW;
    const minX = scene.minX;
    const maxX = minX + baseW;

    // 1. Bầu trời hoàng hôn tím Cố Đô (Deep Royal Twilight Sky)
    c.fillStyle = this._hueLg(c, 0, 0, 0, 1000, [
      [0, '#2f7fc0'],
      [0.35, '#5aa5d4'],
      [0.6, '#96c8e0'],
      [0.8, '#d7e4dc'],
      [0.93, '#f6e8c4'],
      [1, '#ffeccb']
    ]);
    c.fillRect(minX - 50, 0, baseW + 100, 1100);

    // 2. Ánh rực hoàng hôn chân trời
    const glowX = isMobile ? 660 : 1400;
    c.fillStyle = this._hueRg(c, glowX, 960, 10, isMobile ? 500 : 700, [
      [0, 'rgba(255,190,100,.8)'],
      [1, 'rgba(255,140,80,0)']
    ]);
    c.fillRect(minX - 50, 0, baseW + 100, 1100);

    // 3. Vầng trăng huyền ảo xứ Huế
    const moonX = isMobile ? 860 : 1760;
    c.fillStyle = this._hueRg(c, moonX, 160, 20, isMobile ? 110 : 150, [
      [0, 'rgba(255, 250, 225, .55)'],
      [1, 'rgba(255, 240, 195, 0)']
    ]);
    c.fillRect(moonX - 160, 0, 340, 340);
    c.fillStyle = 'rgba(255, 252, 236, .92)';
    c.beginPath();
    c.arc(moonX, 160, isMobile ? 40 : 50, 0, Math.PI * 2);
    c.fill();
    // Mây nhỏ phụ
    const secX = isMobile ? 670 : 1375;
    c.fillStyle = 'rgba(255, 255, 255, .55)';
    c.beginPath();
    c.ellipse(secX, 210, isMobile ? 34 : 46, isMobile ? 10 : 13, 0, 0, Math.PI * 2);
    c.fill();

    // 4. Mây hoàng hôn bồng bềnh nhiều tầng
    if (isMobile) {
      this._hueCloud(c, [[160, 520, 75], [260, 470, 90], [380, 500, 85], [480, 530, 60], [80, 540, 50]], 590, '#c9d8e4', '#eef4f6');
      this._hueCloud(c, [[820, 640, 70], [920, 570, 100], [1010, 600, 75], [740, 660, 50]], 700, '#bfd2e0', '#e9f1f4');
      this._hueCloud(c, [[600, 850, 75], [720, 790, 110], [840, 820, 85], [540, 880, 50]], 930, '#d9e4ea', '#f8eedb');
      this._hueCloud(c, [[460, 720, 70], [550, 690, 80], [630, 740, 50]], 780, '#c2d2de', '#e8f0f2');
    } else {
      this._hueCloud(c, [[300, 520, 90], [420, 470, 110], [560, 500, 100], [700, 530, 70], [180, 540, 60]], 590, '#c9d8e4', '#eef4f6');
      this._hueCloud(c, [[1750, 640, 80], [1880, 570, 120], [2000, 600, 90], [1650, 660, 60]], 700, '#bfd2e0', '#e9f1f4');
      this._hueCloud(c, [[1250, 850, 90], [1400, 790, 130], [1560, 820, 100], [1180, 880, 60]], 930, '#d9e4ea', '#f8eedb');
      this._hueCloud(c, [[950, 720, 80], [1060, 690, 90], [1150, 740, 60]], 780, '#c2d2de', '#e8f0f2');
    }

    // 5. Đồi núi xa & Rừng cây tím hoàng hôn
    c.fillStyle = '#4c6b52';
    c.beginPath();
    const hillStartX = isMobile ? 650 : 1500;
    c.moveTo(hillStartX, 1000);
    c.bezierCurveTo(hillStartX + (maxX - hillStartX) * 0.25, 900, hillStartX + (maxX - hillStartX) * 0.5, 880, maxX, 840);
    c.lineTo(maxX, 1100);
    c.lineTo(hillStartX, 1100);
    c.fill();

    c.fillStyle = '#3a2a4c';
    const numTrunks = isMobile ? 6 : 12;
    for (let i = 0; i < numTrunks; i++) {
      c.fillRect((isMobile ? 740 : 1700) + i * 36, 880 + (i % 3) * 20, 30, 120);
    }

    c.fillStyle = '#1c3a30';
    c.beginPath();
    const treeStartX = isMobile ? 550 : 1330;
    c.moveTo(treeStartX, 1090);
    for (let x = treeStartX; x <= maxX; x += 26) {
      c.lineTo(x, 960 + 36 * Math.sin(x * 0.04) + 18 * Math.sin(x * 0.11));
    }
    c.lineTo(maxX, 1090);
    c.fill();

    // Rặng dừa bóng nước
    const palms = isMobile ? [
      [580, 900, 0.9],
      [710, 880, 1.0],
      [800, 930, 0.8]
    ] : [
      [1230, 900, 1],
      [1450, 880, 1.1],
      [1520, 930, 0.8]
    ];
    palms.forEach(([x, y, s]) => {
      c.strokeStyle = '#2a2a2a';
      c.lineWidth = 9 * s;
      c.beginPath();
      c.moveTo(x, y + 90);
      c.quadraticCurveTo(x + 8, y + 40, x + 2, y);
      c.stroke();
      for (let a = -3; a <= 3; a++) {
        c.strokeStyle = a % 2 ? '#1f6a3a' : '#2e8a44';
        c.lineWidth = 7 * s;
        c.beginPath();
        c.moveTo(x, y);
        c.quadraticCurveTo(x + a * 30 * s, y - 40 * s, x + a * 48 * s, y + (Math.abs(a) * 14 - 8) * s);
        c.stroke();
      }
    });

    // 6. KỲ ĐÀI HUẾ (CỘT CỜ KINH THÀNH HOÀNG GIA)
    const kdX = isMobile ? 360 : 640;
    const kdBaseW = isMobile ? 270 : 390;
    const kdStepW = isMobile ? 180 : 230;
    const kdTower = isMobile ? [
      [420, 650], [516, 650], [494, 440], [442, 440]
    ] : [
      [722, 650], [838, 650], [812, 440], [746, 440]
    ];
    const kdTopPav = isMobile ? { x: 434, w: 68 } : { x: 738, w: 84 };
    const kdCornice = isMobile ? [
      [426, 424], [510, 424], [494, 408], [442, 408]
    ] : [
      [730, 424], [830, 424], [812, 408], [748, 408]
    ];
    const mastX = isMobile ? 468 : 775;

    // Bệ đá móng Kỳ Đài
    c.fillStyle = this._hueLg(c, kdX, 0, kdX + kdBaseW, 0, [[0, '#8a6a54'], [1, '#6a4a40']]);
    c.fillRect(kdX, 690, kdBaseW, 150);
    c.fillStyle = '#7a5a48';
    c.fillRect(kdX + (kdBaseW - kdStepW) / 2, 650, kdStepW, 46);
    c.fillStyle = '#5a3c36';
    c.fillRect(kdX, 676, kdBaseW, 14);
    c.fillRect(kdX + (kdBaseW - kdStepW) / 2, 646, kdStepW, 8);
    for (let x = kdX + 10; x < kdX + kdBaseW; x += 28) {
      c.fillStyle = '#5a3c36';
      c.fillRect(x, 676, 14, 8);
    }

    // Tháp gạch Kỳ Đài vươn cao
    this._huePoly(c, kdTower, this._hueLg(c, kdTower[0][0], 0, kdTower[1][0], 0, [[0, '#a07250'], [1, '#6a4638']]));
    c.fillStyle = '#4a2e2c';
    c.fillRect(kdTower[0][0], 560, kdTower[1][0] - kdTower[0][0], 8);
    c.fillRect(kdTower[3][0] - 10, 500, kdTower[2][0] - kdTower[3][0] + 20, 8);

    // Lỗ châu mai trên tháp
    c.fillStyle = '#2a1a22';
    const numCols = isMobile ? 2 : 3;
    const colStart = isMobile ? 450 : 758;
    for (let y = 470; y < 640; y += 36) {
      for (let k = 0; k < numCols; k++) {
        c.fillRect(colStart + k * 20, y, 9, 16);
      }
    }

    // Lầu đài nhỏ đỉnh tháp & lan can
    c.fillStyle = '#8a5a3a';
    c.fillRect(kdTopPav.x, 420, kdTopPav.w, 26);
    this._huePoly(c, kdCornice, '#6a3a2c');
    c.fillStyle = '#ffcc66';
    c.fillRect(mastX - 9, 428, 10, 14);
    c.fillRect(mastX + 9, 428, 10, 14);

    // Cột cờ Kỳ Đài
    c.strokeStyle = '#d8d0e0';
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(mastX, 408);
    c.lineTo(mastX, 262);
    c.stroke();

    // 7. NGỌ MÔN - LẦU NGŨ PHỤNG (ĐẠI NỘI HUẾ)
    const nmX = isMobile ? 30 : 150;
    const nmW = isMobile ? 410 : 760;

    // Chân đài Ngọ Môn bằng đá kiên cố
    c.fillStyle = this._hueLg(c, 0, 820, 0, 940, [[0, '#6a4a50'], [1, '#4a3440']]);
    c.fillRect(nmX, 830, nmW, 110);
    c.fillStyle = '#3a2830';
    c.fillRect(nmX, 826, nmW, 10);

    // Cổng vòm Ngọ Môn tỏa ánh hoàng cung vàng rực
    const numGates = isMobile ? 3 : 4;
    const gateStart = isMobile ? 180 : 410;
    const gateSpacing = isMobile ? 72 : 80;
    for (let i = 0; i < numGates; i++) {
      const gx = gateStart + i * gateSpacing;
      c.fillStyle = '#ffb21e';
      c.fillRect(gx, 850, 46, 90);
      c.fillStyle = this._hueRg(c, gx + 23, 890, 4, 70, [
        [0, 'rgba(255,220,100,.6)'],
        [1, 'rgba(255,160,30,0)']
      ]);
      c.fillRect(gx - 30, 820, 106, 130);
      c.fillStyle = '#4a2e30';
      c.beginPath();
      c.arc(gx + 23, 850, 23, Math.PI, 0);
      c.fill();
    }

    // Hàng cột gỗ son đỏ Ngọ Môn - Tầng 1
    const colStartX = isMobile ? 60 : 200;
    const colEndX = isMobile ? 410 : 870;
    c.fillStyle = '#c4382e';
    for (let x = colStartX; x < colEndX; x += (isMobile ? 38 : 46)) {
      c.fillRect(x, 770, 8, 58);
    }
    c.fillStyle = '#7a2420';
    c.fillRect(colStartX - 10, 768, colEndX - colStartX + 20, 8);

    // MÁI TẦNG 1: Mái ngói Hoàng Lưu Ly cong vuốt đầu đao
    const r1X0 = isMobile ? 40 : 170;
    const r1X1 = isMobile ? 430 : 880;
    this._hueRoof(c, r1X0, r1X1, 730, 40, '#c8841e', '#ffcc55');

    // Hàng cột gỗ son - Lầu Ngũ Phụng Tầng 2
    const col2Start = isMobile ? 150 : 420;
    const col2End = isMobile ? 320 : 720;
    c.fillStyle = '#c4382e';
    for (let x = col2Start; x < col2End; x += (isMobile ? 32 : 40)) {
      c.fillRect(x, 690, 7, 42);
    }

    // MÁI TẦNG 2: Mái thượng điện Lầu Ngũ Phụng
    const r2X0 = isMobile ? 130 : 390;
    const r2X1 = isMobile ? 340 : 720;
    this._hueRoof(c, r2X0, r2X1, 650, 44, '#e0a02a', '#ffe08a');

    // Lồng đèn đỏ treo hiên Ngọ Môn
    const lanternStep = isMobile ? 70 : 110;
    for (let x = colStartX + 20; x < colEndX; x += lanternStep) {
      c.fillStyle = '#e02a30';
      c.beginPath();
      c.ellipse(x, 800, 9, 13, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = this._hueRg(c, x, 800, 2, 34, [
        [0, 'rgba(255,90,60,.5)'],
        [1, 'rgba(255,90,60,0)']
      ]);
      c.fillRect(x - 34, 766, 68, 68);
    }

    // 8. Tường thành đá cổ kính & Vân gạch
    const wallStartX = minX;
    const wallEndX = isMobile ? 580 : 1365;
    c.fillStyle = this._hueLg(c, 0, 925, 0, 1090, [[0, '#7a6460'], [1, '#4a3a48']]);
    c.fillRect(wallStartX, 925, wallEndX - wallStartX, 165);
    c.fillStyle = '#9a8478';
    c.fillRect(wallStartX, 920, wallEndX - wallStartX, 10);
    for (let x = wallStartX + 5; x < wallEndX; x += 24) {
      c.fillStyle = '#8a7468';
      c.fillRect(x, 935, 8, 28);
    }
    c.fillStyle = '#8a7468';
    c.fillRect(wallStartX, 960, wallEndX - wallStartX, 6);

    // Kính lộng / cửa thành phụ
    c.fillStyle = '#c9c4d0';
    c.beginPath();
    c.arc(isMobile ? 410 : 745, 1030, 16, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#4a3a48';
    c.fillRect((isMobile ? 410 : 745) - 25, 1046, 50, 40);
    c.fillStyle = '#ff3a4a';
    c.fillRect((isMobile ? 410 : 745) - 8, 1058, 18, 18);

    // Đường vân gạch tường thành
    c.strokeStyle = 'rgba(30,16,36,.35)';
    c.lineWidth = 1.5;
    for (let y = 970; y < 1090; y += 20) {
      c.beginPath();
      c.moveTo(wallStartX, y);
      c.lineTo(wallEndX, y);
      c.stroke();
      for (let x = wallStartX + (y % 40); x < wallEndX; x += 46) {
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x, y + 20);
        c.stroke();
      }
    }

    // Ánh hoàng hôn viền ấm trên mái và thành cổ
    c.fillStyle = this._hueLg(c, wallStartX, 0, wallEndX, 0, [
      [0, 'rgba(255,170,90,0)'],
      [1, 'rgba(255,150,80,.28)']
    ]);
    c.fillRect(wallStartX, 925, wallEndX - wallStartX, 165);

    // Cây bàng cổ thụ bên trái Ngọ Môn
    const treeBaseX = isMobile ? 65 : 205;
    c.fillStyle = '#3a2430';
    c.beginPath();
    c.moveTo(treeBaseX, 1090);
    c.quadraticCurveTo(treeBaseX + 20, 1010, treeBaseX + 10, 940);
    c.lineTo(treeBaseX + 40, 940);
    c.quadraticCurveTo(treeBaseX + 50, 1010, treeBaseX + 65, 1090);
    c.fill();

    const foliage = isMobile ? [
      [treeBaseX - 30, 880, 50],
      [treeBaseX + 30, 865, 58],
      [treeBaseX + 70, 915, 42],
      [treeBaseX, 940, 48],
      [treeBaseX - 50, 930, 40],
      [treeBaseX + 45, 965, 42]
    ] : [
      [165, 880, 62],
      [235, 865, 70],
      [285, 915, 52],
      [195, 940, 60],
      [135, 930, 50],
      [250, 965, 52]
    ];
    foliage.forEach(([x, y, r], i) => {
      c.fillStyle = i % 2 ? '#2e7a3a' : '#3a9a46';
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = 'rgba(20,50,40,.45)';
      c.beginPath();
      c.arc(x + 14, y + 20, r * 0.8, 0, Math.PI * 2);
      c.fill();
    });

    // 9. DÒNG SÔNG HƯƠNG (PERFUME RIVER)
    c.fillStyle = this._hueLg(c, 0, 1090, 0, 1652, [
      [0, '#6ba0b8'],
      [0.3, '#4a7f9b'],
      [1, '#2f5c76']
    ]);
    c.fillRect(minX - 50, 1090, baseW + 100, 562);

    // Ánh hoàng hôn rọi sáng trên mặt nước sông
    c.fillStyle = this._hueLg(c, 0, 1090, 0, 1260, [
      [0, 'rgba(255, 244, 210, .30)'],
      [1, 'rgba(255, 244, 210, 0)']
    ]);
    c.fillRect(minX - 50, 1090, baseW + 100, 170);

    // 10. TRỤ CẦU & BẢN MẶT ĐƯỜNG CẦU TRÀNG TIỀN
    const deckStartX = isMobile ? 480 : 850;
    c.fillStyle = '#6b7f8e';
    if (isMobile) {
      c.fillRect(720, 1100, 90, 110);
      c.fillRect(980, 1100, 90, 120);
      c.fillRect(470, 1090, 100, 32);
      c.fillStyle = '#1c1440';
      c.fillRect(720, 1200, 90, 14);
      c.fillRect(980, 1210, 90, 14);
    } else {
      c.fillRect(1210, 1100, 110, 110);
      c.fillRect(1700, 1100, 130, 120);
      c.fillRect(850, 1090, 130, 32);
      c.fillStyle = '#1c1440';
      c.fillRect(1210, 1200, 110, 14);
      c.fillRect(1700, 1210, 130, 14);
    }

    // Dầm bản mặt cầu
    c.fillStyle = '#2a2050';
    c.fillRect(deckStartX, 1096, maxX - deckStartX, 24);
    c.strokeStyle = '#4a3a80';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(deckStartX, 1094);
    c.lineTo(maxX, 1094);
    c.stroke();
  }

  _hueBuildFg(c, scene) {
    const isMobile = scene.isMobile;
    const baseW = scene.baseW;
    const minX = scene.minX;
    const maxX = minX + baseW;

    const blade = (x, y, L, a, w, col) => {
      c.fillStyle = col;
      c.beginPath();
      c.moveTo(x - w, y);
      c.quadraticCurveTo(x + Math.cos(a) * L * 0.6 - w, y + Math.sin(a) * L * 0.6, x + Math.cos(a) * L, y + Math.sin(a) * L);
      c.quadraticCurveTo(x + Math.cos(a) * L * 0.6 + w, y + Math.sin(a) * L * 0.6, x + w, y);
      c.fill();
    };

    // Bụi tán lá cỏ lau giữa-trái
    const foliageStartX = isMobile ? 260 : 520;
    const foliageW = isMobile ? 200 : 360;
    for (let i = 0; i < 26; i++) {
      blade(foliageStartX + this._hueRnd(i) * foliageW, 1160 + this._hueRnd(i + 3) * 40, 90 + this._hueRnd(i + 5) * 80, -Math.PI / 2 + (this._hueRnd(i + 9) - 0.5) * 2.6, 6, i % 2 ? '#2a7a3a' : '#1c5a34');
    }

    // Lan can đá công viên bờ sông Hương
    const railX = isMobile ? 30 : 220;
    const railW = isMobile ? 240 : 400;
    const pilX = isMobile ? 230 : 520;
    const pilW = isMobile ? 80 : 100;

    c.fillStyle = '#6a6070';
    c.fillRect(railX, 1470, railW, 30);
    for (let x = railX + 15; x < railX + railW; x += (isMobile ? 32 : 42)) {
      c.fillRect(x, 1500, 18, 80);
    }
    // Trụ đèn đá cung đình
    c.fillStyle = '#8a8090';
    c.fillRect(pilX, 1390, pilW, 260);
    c.fillStyle = '#a49aa8';
    c.fillRect(pilX - 10, 1380, pilW + 20, 22);

    // Bụi cọ & lá nhiệt đới hai góc
    const leafGroups = isMobile ? [
      [30, 1650, 0.9],
      [160, 1650, 0.85],
      [maxX - 60, 1650, 0.9],
      [maxX - 160, 1650, 0.8]
    ] : [
      [160, 1650, 1],
      [330, 1650, 0.9],
      [1980, 1650, 1],
      [1800, 1650, 0.8]
    ];

    leafGroups.forEach(([x, y, s], k) => {
      for (let i = 0; i < 14; i++) {
        blade(x, y, (160 + this._hueRnd(i + k * 9) * 260) * s, -Math.PI / 2 + (this._hueRnd(i + k * 5 + 1) - 0.5) * 2.8, 12, i % 3 ? '#14502e' : '#2c8040');
      }
    });

    const reedStart = isMobile ? 10 : 130;
    for (let i = 0; i < 12; i++) {
      blade(reedStart + i * 16, 1650, 360 + (i % 4) * 60, -1.9 + i * 0.08, 9, i % 2 ? '#0e3a28' : '#1c5a34');
    }

    c.fillStyle = '#6a3a24';
    const postX = isMobile ? [maxX - 180, maxX - 120, maxX - 60] : [1780, 1840, 1900];
    postX.forEach(x => {
      c.fillRect(x, 1500, 12, 90);
    });
  }

  // CẦU TRÀNG TIỀN: CÁC NHỊP VÒM THÉP PARABOL PHÁT SÁNG ĐỔI MÀU NEON
  _hueBridge(c, t, scene) {
    const dY = 1092;
    const arches = scene.arches;

    c.save();
    c.lineCap = 'round';
    c.lineJoin = 'round';

    arches.forEach(([x0, x1, h, k]) => {
      const n = Math.round((x1 - x0) / 20);
      const top = (u, hh) => dY - 8 - hh * 4 * u * (1 - u);
      const col = (u, l, a) => `hsla(${200 + this._hueColor(k * 0.33 + u * 0.35) * 30}, 45%, ${Math.min(96, l + 26)}%, ${a * 0.5})`;

      // Nền vòm cầu (thép sáng ban ngày)
      c.fillStyle = 'rgba(96, 116, 132, .45)';
      c.beginPath();
      c.moveTo(x0, dY - 6);
      for (let i = 0; i <= 40; i++) {
        c.lineTo(x0 + (x1 - x0) * i / 40, top(i / 40, h));
      }
      c.lineTo(x1, dY - 6);
      c.fill();

      // Hiệu ứng phát sáng Neon nhiều lớp
      c.globalCompositeOperation = 'lighter';
      const stroke = (hh, lw, l, a) => {
        for (let i = 0; i < 40; i++) {
          const u = i / 40, u2 = (i + 1) / 40;
          c.strokeStyle = col(u, l, a);
          c.lineWidth = lw;
          c.beginPath();
          c.moveTo(x0 + (x1 - x0) * u, top(u, hh));
          c.lineTo(x0 + (x1 - x0) * u2, top(u2, hh));
          c.stroke();
        }
      };

      stroke(h, 26, 50, 0.05);   // Tán sáng ngoài rộng (dịu)
      stroke(h, 14, 55, 0.10);   // Vầng sáng
      stroke(h, 7, 68, 0.55);    // Thân vòm
      stroke(h * 0.84, 3, 70, 0.45); // Thanh giằng cong phụ

      // Thanh giằng đứng & chéo
      for (let i = 0; i <= n; i++) {
        const u = i / n, x = x0 + (x1 - x0) * u;
        c.strokeStyle = col(u, 74, 0.95);
        c.lineWidth = 2.4;
        c.beginPath();
        c.moveTo(x, dY - 6);
        c.lineTo(x, top(u, h));
        c.stroke();

        if (i < n) {
          const u2 = (i + 1) / n;
          c.strokeStyle = col(u, 80, 0.6);
          c.lineWidth = 1.6;
          c.beginPath();
          c.moveTo(x, i % 2 ? top(u, h * 0.84) : dY - 6);
          c.lineTo(x0 + (x1 - x0) * u2, i % 2 ? dY - 6 : top(u2, h * 0.84));
          c.stroke();
        }
      }

      // Thanh dầm đáy cầu neon
      c.strokeStyle = col(0.5, 70, 0.9);
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(x0, dY - 10);
      c.lineTo(x1, dY - 10);
      c.stroke();

      // Quầng sáng rọi trên mặt cầu
      c.fillStyle = this._hueLg(c, 0, dY - 40, 0, dY, [
        [0, 'rgba(0,0,0,0)'],
        [1, col(0.5, 55, 0.22)]
      ]);
      c.fillRect(x0, dY - 40, x1 - x0, 40);

      c.globalCompositeOperation = 'source-over';
    });

    c.restore();
  }

  // MẶT NƯỚC SÔNG HƯƠNG PHẢN CHIẾU ÁNH SÁNG CẦU TRÀNG TIỀN
  _hueWater(c, t, scene) {
    const K = scene.K;
    const W = scene.W;
    const H = scene.H;
    const minX = scene.minX;
    const isMobile = scene.isMobile;

    // Phản chiếu gợn sóng từ canvas cầu
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.beginPath();
    c.rect(0, 1112 * K + scene.offsetY, W, H);
    c.clip();

    for (let y = 1120; y < 1640; y += 6) {
      const d = y - 1112;
      const sy = 1092 - d * 0.55;
      if (sy < 880) break;
      const off = Math.sin(t * 1.6 + y * 0.05) * (3 + d * 0.03);
      c.globalAlpha = Math.max(0, 0.3 - d / 1500);
      c.drawImage(
        scene.brCanvas,
        0, sy * K + scene.offsetY, W, 4 * K,
        off * K, y * K + scene.offsetY, W, 6 * K
      );
    }
    c.restore();

    // Vệt sáng lấp lánh phản quang neon trên mặt nước
    c.save();
    this._hueT(c, scene);
    c.globalCompositeOperation = 'lighter';
    c.lineCap = 'round';

    const glowX = isMobile ? 660 : 1000;
    c.fillStyle = this._hueRg(c, glowX, 1140, 10, 900, [
      [0, 'rgba(255, 238, 196, .22)'],
      [1, 'rgba(255, 238, 196, 0)']
    ]);
    c.fillRect(minX - 50, 1112, scene.baseW + 100, 540);

    const numRipples = isMobile ? 70 : 120;
    const spanStartX = isMobile ? 480 : 880;
    const spanW = isMobile ? 560 : 1220;

    for (let i = 0; i < numRipples; i++) {
      const y = 1130 + i * (isMobile ? 7.2 : 4.4) + this._hueRnd(i) * 6;
      const x = spanStartX + this._hueRnd(i + 20) * spanW;
      const w = 70 + this._hueRnd(i + 40) * (isMobile ? 120 : 190);
      const a = (0.2 + 0.4 * Math.abs(Math.sin(t * 1.8 + i))) * (y < 1420 ? 1 : 0.5);

      c.strokeStyle = `rgba(226, 244, 250, ${a * 0.30})`;
      c.lineWidth = 9;
      c.beginPath();
      c.moveTo(x - w / 2, y);
      for (let q = 1; q <= 8; q++) {
        c.lineTo(x - w / 2 + w * q / 8, y + Math.sin(t * 2.2 + q * 1.4 + i) * 5);
      }
      c.stroke();

      c.strokeStyle = `rgba(255, 255, 255, ${a * 0.75})`;
      c.lineWidth = 2.6;
      c.stroke();
    }
    c.restore();
  }

  // RÈM LIỄU RỦ THƠ MỘNG HAI BÊN GÓC TRÊN
  _hueWillow(c, t, scene) {
    const isMobile = scene.isMobile;

    c.save();
    this._hueT(c, scene);

    const hs = isMobile ? [
      [0, 260, 140, 100, 320, 0],
      [680, 0, 840, 70, 1050, 10],
      [780, 0, 920, 160, 1050, 430]
    ] : [
      [105, 300, 330, 120, 600, 0],
      [1480, 0, 1700, 70, 1950, 10],
      [1640, 0, 1820, 160, 2108, 430]
    ];

    const branchCounts = isMobile ? [
      [0, 36, 1],
      [1, 26, 7],
      [2, 22, 13]
    ] : [
      [0, 70, 1],
      [1, 44, 7],
      [2, 34, 13]
    ];

    branchCounts.forEach(([bi, n, ph]) => {
      const [x0, y0, cx, cy, x1, y1] = hs[bi];
      for (let i = 0; i < n; i++) {
        const u = (i + this._hueRnd(i + ph)) / n, v = 1 - u;
        const bx = v * v * x0 + 2 * v * u * cx + u * u * x1;
        const by = v * v * y0 + 2 * v * u * cy + u * u * y1;
        const L = (isMobile ? 150 : 200) + this._hueRnd(i * 3 + ph) * (isMobile ? 360 : 480);
        const sw = Math.sin(t * 1.2 + i * 0.7 + ph) * 16 * (L / 600);
        const ex = bx + sw * 1.6 + (this._hueRnd(i + 50) - 0.5) * 20;
        const ey = by + L;

        const g = c.createLinearGradient(0, by, 0, ey);
        g.addColorStop(0, '#2a5a32');
        g.addColorStop(1, '#6aae48');
        c.strokeStyle = g;
        c.lineWidth = 2.6;
        c.beginPath();
        c.moveTo(bx, by);
        c.quadraticCurveTo(bx + sw * 0.4, by + L * 0.5, ex, ey);
        c.stroke();

        for (let k = 1; k < 13; k++) {
          const w = k / 13;
          const lx = bx + (ex - bx) * w * w + sw * 0.4 * w * (1 - w);
          const ly = by + L * w;
          const a = 1.3 + Math.sin(t * 2 + k + i) * 0.25;
          c.fillStyle = k % 2 ? '#4f9444' : '#7fc050';
          c.beginPath();
          c.ellipse(lx + (k % 2 ? 5 : -5), ly, 3, 12, k % 2 ? a : -a, 0, Math.PI * 2);
          c.fill();
        }
      }
    });

    // Tán lá xanh tối góc trên rủ xuống
    c.fillStyle = '#244a30';
    const topCanopies = isMobile ? [
      [30, 30, 80], [120, 10, 70], [220, 0, 60],
      [760, 10, 70], [860, 0, 70], [980, 20, 60], [1040, 100, 70]
    ] : [
      [150, 30, 80], [280, 10, 70], [420, 0, 60],
      [1560, 10, 70], [1700, 0, 70], [1880, 20, 60],
      [2040, 100, 70], [2090, 280, 60], [1970, 200, 50]
    ];
    topCanopies.forEach(([x, y, r]) => {
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fill();
    });

    c.restore();
  }

  // ==========================================
  // PANEL 5: ĐÀ NẴNG (Cầu Rồng Sông Hàn & Bán Đảo Sơn Trà)
  // MASTERPIECE CINEMATIC 2D ART - 100% DEMO & CONCEPT REFERENCE
  // OFFCANVAS MULTI-LAYER CACHING FOR SILKY 60 FPS
  // ==========================================
  _drawDaNang(ctx) {
    const scene = this._getDaNangScene();
    const t = this.animTimer || 0;

    ctx.save();
    // 1. Vẽ nền tĩnh (trời, sao, mây, núi Sơn Trà, Phật Bà, skyline Mỹ Khê)
    this._resetView(ctx);
    ctx.drawImage(scene.bg, 0, 0);

    // 2. Sao lấp lánh & Vòng quay Sun Wheel rực rỡ
    this._danangT(ctx, scene);
    scene.stars.forEach(s => {
      const a = 0.3 + 0.7 * Math.abs(Math.sin(t * (0.7 + (s.p % 1)) + s.p));
      ctx.fillStyle = `rgba(255,255,240,${a})`;
      if (s.b) {
        ctx.fillRect(s.x - 10, s.y - 1, 20, 2);
        ctx.fillRect(s.x - 1, s.y - 10, 2, 20);
      }
      ctx.fillRect(s.x - 2, s.y - 2, 4, 4);
    });
    this._danangFerris(ctx, 2050, 628, 140, t);

    // 3. Tòa nhà thấp trước vòng quay & đèn chớp đỏ trên đỉnh cao ốc
    this._resetView(ctx);
    ctx.drawImage(scene.fr, 0, 0);
    this._danangT(ctx, scene);
    [[1500, 600], [1700, 495]].forEach((b, i) => {
      ctx.fillStyle = `rgba(255,60,60,${Math.sin(t * 3 + i * 2) > 0.2 ? 1 : 0.15})`;
      ctx.beginPath();
      ctx.arc(b[0], b[1], 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Mặt nước Sông Hàn phản chiếu Cầu Rồng & bóng đèn bờ sông
    this._danangWater(ctx, t, scene);

    // 5. Cầu quay Sông Hàn & Cầu Rồng tráng lệ
    this._resetView(ctx);
    ctx.drawImage(scene.sw, 0, 0);
    ctx.drawImage(scene.brg, 0, 0);

    // 6. Quầng sáng vàng rực dưới các nhịp vòm Cầu Rồng
    this._danangT(ctx, scene);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    [[300, 1000], [640, 960], [1140, 1020], [1480, 1060]].forEach((a, i) => {
      ctx.fillStyle = this._danangRg(ctx, a[0], a[1], 10, 300, [
        [0, `rgba(255,170,40,${0.13 + 0.06 * Math.sin(t * 1.6 + i)})`],
        [1, 'rgba(255,170,40,0)']
      ]);
      ctx.fillRect(a[0] - 300, a[1] - 300, 600, 600);
    });
    ctx.restore();

    // 7. Rồng phun lửa / phun nước rực sáng màn đêm
    this._danangFx(ctx, t, scene);

    // 8. Tiền cảnh: quảng trường lan can đá & rặng dừa nhiệt đới
    this._resetView(ctx);
    if (scene.portrait) {
      // Khung dọc: rặng dừa tiền cảnh vẽ riêng ở hai góc dưới để không che đầu rồng
      this._danangFrame(ctx, scene.W, scene.H);
    } else {
      ctx.drawImage(scene.fg, 0, 0);
    }

    // 9. Lớp vignette mềm mại bao quanh viền tranh
    this._danangT(ctx, scene);
    ctx.fillStyle = this._danangRg(ctx, 1100, 826, 500, 1300, [
      [0, 'rgba(0,0,12,0)'],
      [1, 'rgba(0,0,24,.5)']
    ]);
    ctx.fillRect(105, 0, 2003, 1652);

    ctx.restore();
  }

  // Khung dọc: rặng dừa tối ở hai góc dưới — giữ tiền cảnh mà không che đầu rồng
  _danangFrame(ctx, w, h) {
    const short = Math.min(w, h);

    const crown = (x, y, len, rot, c1, c2, rim) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      for (let i = 0; i < 11; i++) {
        const ang = -Math.PI * 0.99 + (i / 10) * Math.PI * 0.98;
        const l = len * (0.7 + this._danangRnd(i * 3 + 1) * 0.5);
        const hw = len * 0.055;
        const tipX = Math.cos(ang) * l;
        const tipY = Math.sin(ang) * l;
        const midX = Math.cos(ang) * l * 0.55;
        const midY = Math.sin(ang) * l * 0.55;
        ctx.fillStyle = i % 2 ? c1 : c2;
        ctx.beginPath();
        ctx.moveTo(-hw, 0);
        ctx.quadraticCurveTo(midX - hw, midY, tipX, tipY);
        ctx.quadraticCurveTo(midX + hw, midY, hw, 0);
        ctx.closePath();
        ctx.fill();
        if (rim) {
          ctx.strokeStyle = rim;
          ctx.lineWidth = Math.max(0.7, w * 0.0022);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(midX - hw * 0.2, midY - 2, tipX, tipY);
          ctx.stroke();
        }
      }
      ctx.restore();
    };

    crown(-0.02 * w, h * 1.10, 0.30 * short, 0.26, '#03131c', '#062330', 'rgba(110,190,210,.35)');
    crown(w * 1.03, h * 1.12, 0.28 * short, -0.28, '#03131c', '#05202a', 'rgba(110,190,210,.3)');

    const base = ctx.createLinearGradient(0, h * 0.9, 0, h);
    base.addColorStop(0, 'rgba(3, 10, 22, 0)');
    base.addColorStop(1, 'rgba(3, 10, 22, 0.5)');
    ctx.fillStyle = base;
    ctx.fillRect(0, h * 0.9, w, h * 0.1);
  }

  _getDaNangScene() {
    const width = Math.max(1, Math.round(this.width));
    const height = Math.max(1, Math.round(this.height));
    if (this._daNangScene &&
      this._daNangScene.W === width &&
      this._daNangScene.H === height) {
      return this._daNangScene;
    }

    const W = width;
    const H = height;

    // Khung dọc: neo thẳng vào Cầu Rồng (đầu rồng, nhịp vòm và skyline Mỹ Khê)
    // thay vì cắt giữa tranh — nhờ vậy rồng phun lửa vẫn nằm trong khung.
    const portrait = W / H < 1;
    const K = portrait ? H / 1652 : Math.max(W / 2003, H / 1652);
    const offsetX = portrait
      ? W / 2 - 1580 * K
      : (W - 2003 * K) / 2 - 105 * K;
    const offsetY = portrait ? 0 : (H - 1652 * K) / 2;

    const scene = {
      W,
      H,
      K,
      offsetX,
      offsetY,
      portrait,
      lamps: [],
      stars: Array.from({ length: 70 }, (_, i) => {
        const x = 105 + this._danangRnd(i + 7) * 2003;
        return {
          x,
          y: this._danangRnd(i + 77) * (x < 720 ? 300 : 470),
          p: this._danangRnd(i + 3) * 6,
          b: i % 6 === 0
        };
      })
    };

    // Khởi tạo các canvas lớp tĩnh
    const [bgCv, bgCtx] = this._danangMk(W, H, K, offsetX, offsetY);
    this._danangBuildBg(bgCtx, scene);
    scene.bg = bgCv;

    const [frCv, frCtx] = this._danangMk(W, H, K, offsetX, offsetY);
    this._danangBuildFront(frCtx);
    scene.fr = frCv;

    const [swCv, swCtx] = this._danangMk(W, H, K, offsetX, offsetY);
    this._danangBuildSwing(swCtx);
    scene.sw = swCv;

    const [brgCv, brgCtx] = this._danangMk(W, H, K, offsetX, offsetY);
    this._danangBuildBridge(brgCtx);
    scene.brg = brgCv;

    const [fgCv, fgCtx] = this._danangMk(W, H, K, offsetX, offsetY);
    this._danangBuildFg(fgCtx);
    scene.fg = fgCv;

    const [rfcCv, rfcCtx] = this._danangMk(W, H, K, offsetX, offsetY);
    scene.rfc = rfcCv;
    scene.rf = rfcCtx;

    this._daNangScene = scene;
    return scene;
  }

  _danangMk(W, H, K, offsetX, offsetY) {
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const x = c.getContext('2d');
    x.setTransform(K, 0, 0, K, offsetX, offsetY);
    return [c, x];
  }

  _danangT(c, scene) { this._viewT(c, scene.K, scene.K, scene.offsetX, scene.offsetY); }

  _danangRnd(n) {
    const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return s - Math.floor(s);
  }

  _danangDeck(x) {
    return 1040 + 0.0802 * (x - 105);
  }

  _danangBz(p, u) {
    const v = 1 - u;
    return [
      v * v * v * p[0] + 3 * v * v * u * p[2] + 3 * v * u * u * p[4] + u * u * u * p[6],
      v * v * v * p[1] + 3 * v * v * u * p[3] + 3 * v * u * u * p[5] + u * u * u * p[7]
    ];
  }

  _danangLerp(pts, x) {
    for (let i = 1; i < pts.length; i++) {
      if (x <= pts[i][0]) {
        const a = pts[i - 1];
        const b = pts[i];
        return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
      }
    }
    return pts[pts.length - 1][1];
  }

  _danangLg(c, x0, y0, x1, y1, st) {
    const g = c.createLinearGradient(x0, y0, x1, y1);
    st.forEach(s => g.addColorStop(s[0], s[1]));
    return g;
  }

  _danangRg(c, x, y, r0, r1, st) {
    const g = c.createRadialGradient(x, y, r0, x, y, r1);
    st.forEach(s => g.addColorStop(s[0], s[1]));
    return g;
  }

  // Đường viền dòng sông Hàn (vùng nước)
  _danangRiver(c) {
    c.beginPath();
    c.moveTo(830, 790);
    c.lineTo(1160, 648);
    c.lineTo(1430, 648);
    c.lineTo(1430, 798);
    c.lineTo(1400, 798);
    c.bezierCurveTo(1520, 850, 1760, 960, 1850, 1180);
    c.bezierCurveTo(1900, 1290, 1990, 1480, 2050, 1650);
    c.lineTo(860, 1650);
    c.bezierCurveTo(780, 1380, 380, 1250, 105, 1215);
    c.lineTo(0, 1215);
    c.lineTo(0, 1040);
    c.lineTo(105, 1040);
    c.bezierCurveTo(430, 900, 650, 830, 830, 790);
    c.closePath();
  }

  _danangCloud(c, circs, base, body, rim, dy) {
    c.save();
    c.beginPath();
    c.rect(-100, -100, 2500, base + 100);
    c.clip();
    c.fillStyle = rim;
    c.beginPath();
    circs.forEach(o => {
      c.moveTo(o[0] + o[2], o[1]);
      c.arc(o[0], o[1], o[2], 0, Math.PI * 2);
    });
    c.fill();
    c.fillStyle = body;
    c.beginPath();
    circs.forEach(o => {
      c.moveTo(o[0] + o[2], o[1] + dy);
      c.arc(o[0], o[1] + dy, o[2], 0, Math.PI * 2);
    });
    c.fill();
    c.restore();
  }

  _danangTower(c, x, top, bw, base, a, b, edge, seed, crown) {
    const h = base - top;
    c.save();
    c.shadowColor = edge;
    c.shadowBlur = 26;
    c.fillStyle = this._danangLg(c, x, 0, x + bw, 0, [[0, a], [1, b]]);
    c.fillRect(x, top, bw, h);
    c.strokeStyle = edge;
    c.lineWidth = 1.8;
    c.strokeRect(x, top, bw, h);
    c.shadowBlur = 0;

    // Lưới cửa sổ cao ốc rực rỡ
    const cw = Math.max(7, bw / 6);
    const ch = 14;
    const cols = Math.floor((bw - 10) / cw);
    const rows = Math.floor((h - 18) / ch);
    for (let r = 0; r < rows; r++) {
      for (let k = 0; k < cols; k++) {
        const n = this._danangRnd(k * 7 + r * 13 + seed * 99);
        c.fillStyle = n > 0.9 ? '#c8f8ff' : n > 0.58 ? '#ffdc94' : '#ffc070';
        c.globalAlpha = 0.55 + n * 0.45;
        c.fillRect(x + 5 + k * cw, top + 8 + r * ch, cw * 0.55, 8);
      }
    }
    c.globalAlpha = 1;
    if (crown) {
      c.fillStyle = 'rgba(100,245,255,.6)';
      for (let i = 1; i < 4; i++) {
        c.fillRect(x + bw * i / 4 - 1.5, top, 3, h);
      }
    }
    c.restore();
  }

  // Thân rồng + gai sống lưng dọc theo đường cong Bezier
  _danangSpine(c, p, lw, teeth, tmax) {
    c.save();
    c.lineCap = 'round';
    c.strokeStyle = 'rgba(255,165,30,.3)';
    c.lineWidth = lw + 22;
    c.beginPath();
    c.moveTo(p[0], p[1]);
    c.bezierCurveTo(p[2], p[3], p[4], p[5], p[6], p[7]);
    c.stroke();

    c.strokeStyle = this._danangLg(c, 0, Math.min(p[1], p[3], p[5], p[7]), 0, Math.max(p[1], p[7]), [
      [0, '#fff3a6'],
      [0.5, '#ffc72c'],
      [1, '#e8901a']
    ]);
    c.lineWidth = lw;
    c.beginPath();
    c.moveTo(p[0], p[1]);
    c.bezierCurveTo(p[2], p[3], p[4], p[5], p[6], p[7]);
    c.stroke();

    c.strokeStyle = 'rgba(255,252,215,.95)';
    c.lineWidth = lw * 0.2;
    c.beginPath();
    c.moveTo(p[0], p[1] - lw * 0.22);
    c.bezierCurveTo(p[2], p[3] - lw * 0.22, p[4], p[5] - lw * 0.22, p[6], p[7] - lw * 0.22);
    c.stroke();

    for (let i = 1; i < teeth; i++) {
      const u = i / teeth;
      const a = this._danangBz(p, u);
      const b = this._danangBz(p, u + 0.008);
      const tx = b[0] - a[0];
      const ty = b[1] - a[1];
      const L = Math.hypot(tx, ty) || 1;
      const nx = ty / L;
      const ny = -tx / L;
      const s = tmax * (0.45 + 0.55 * Math.sin(u * Math.PI)) * (i % 2 ? 1 : 0.7);
      const k = lw * 0.55;
      c.fillStyle = i % 2 ? '#ffe070' : '#ffb830';
      c.beginPath();
      c.moveTo(a[0] + nx * k - tx / L * 7, a[1] + ny * k - ty / L * 7);
      c.lineTo(a[0] + nx * (k + s) + tx / L * 4, a[1] + ny * (k + s) + ty / L * 4);
      c.lineTo(a[0] + nx * k + tx / L * 7, a[1] + ny * k + ty / L * 7);
      c.fill();
    }
    c.restore();
  }

  // Lá dừa & cỏ nhiệt đới
  _danangBlade(c, x, y, L, a, wd, col, rim) {
    const tx = x + Math.cos(a) * L;
    const ty = y + Math.sin(a) * L + L * 0.25;
    const mx = x + Math.cos(a) * L * 0.5;
    const my = y + Math.sin(a) * L * 0.5 - L * 0.12;
    const nx = -Math.sin(a) * wd;
    const ny = Math.cos(a) * wd;
    c.fillStyle = col;
    c.beginPath();
    c.moveTo(x, y);
    c.quadraticCurveTo(mx + nx, my + ny, tx, ty);
    c.quadraticCurveTo(mx - nx, my - ny, x, y);
    c.fill();
    if (rim) {
      c.strokeStyle = rim;
      c.lineWidth = 2.5;
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(mx + nx, my + ny, tx, ty);
      c.stroke();
    }
  }

  // ==========================================
  // XÂY DỰNG CÁC LỚP TĨNH
  // ==========================================
  _danangBuildBg(c, scene) {
    // 1. Bầu trời đêm chuyển sắc
    c.fillStyle = this._danangLg(c, 0, 0, 0, 660, [
      [0, '#050a2c'],
      [0.22, '#0e1650'],
      [0.45, '#1f2c80'],
      [0.68, '#4a3a98'],
      [0.84, '#9a4f9c'],
      [0.93, '#e07a86'],
      [1, '#ffb862']
    ]);
    c.fillRect(-200, 0, 2700, 660);

    // Vầng rực rỡ chân trời hoàng hôn muộn
    c.save();
    c.translate(1130, 650);
    c.scale(1, 0.26);
    c.fillStyle = this._danangRg(c, 0, 0, 0, 1000, [
      [0, 'rgba(255,205,110,.85)'],
      [0.4, 'rgba(255,150,110,.35)'],
      [1, 'rgba(255,120,120,0)']
    ]);
    c.fillRect(-1200, -1200, 2400, 1200);
    c.restore();

    // 140 đốm sao tinh tú
    for (let i = 0; i < 140; i++) {
      c.fillStyle = `rgba(255,255,245,${0.2 + this._danangRnd(i + 400) * 0.45})`;
      const x = 105 + this._danangRnd(i + 500) * 2003;
      const y = this._danangRnd(i + 600) * 400;
      c.fillRect(x, y, 2.2, 2.2);
    }

    // Các dải mây cuộn Anime/Ghibli
    c.fillStyle = this._danangLg(c, 400, 0, 900, 170, [[0, '#4864b4'], [1, '#2c3d92']]);
    c.beginPath();
    c.moveTo(380, 0);
    c.bezierCurveTo(520, 100, 760, 150, 940, 168);
    c.bezierCurveTo(760, 128, 540, 70, 470, 0);
    c.fill();
    c.strokeStyle = 'rgba(150,175,240,.7)';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(380, 0);
    c.bezierCurveTo(520, 100, 760, 150, 940, 168);
    c.stroke();
    this._danangCloud(c, [
      [150, 215, 75], [255, 175, 95], [365, 205, 80],
      [470, 230, 65], [560, 262, 60], [650, 292, 45],
      [110, 270, 60], [330, 280, 60], [440, 292, 50]
    ], 332, '#33489c', '#7c94dc', 12);

    c.fillStyle = this._danangLg(c, 1400, 215, 1880, 0, [[0, '#3c52a6'], [1, '#6a82d0']]);
    c.beginPath();
    c.moveTo(1400, 215);
    c.bezierCurveTo(1560, 190, 1760, 110, 1880, 0);
    c.lineTo(2010, 0);
    c.bezierCurveTo(1850, 130, 1620, 232, 1400, 215);
    c.fill();
    this._danangCloud(c, [
      [1700, 120, 85], [1820, 92, 100], [1940, 128, 95],
      [2040, 100, 90], [1860, 225, 110], [1990, 256, 100],
      [2080, 335, 120], [1760, 252, 70]
    ], 405, '#2f4296', '#8aa2ea', 14);
    this._danangCloud(c, [
      [1500, 475, 50], [1580, 452, 62], [1665, 472, 55], [1745, 492, 40]
    ], 528, 'rgba(125,88,170,.8)', 'rgba(255,175,190,.65)', 10);
    this._danangCloud(c, [
      [520, 612, 40], [600, 588, 55], [685, 602, 45], [745, 622, 30]
    ], 652, 'rgba(110,86,168,.8)', 'rgba(255,170,180,.5)', 9);

    c.fillStyle = 'rgba(255,170,160,.35)';
    c.beginPath();
    c.ellipse(820, 528, 240, 9, 0, 0, Math.PI * 2);
    c.ellipse(1500, 560, 170, 7, 0, 0, Math.PI * 2);
    c.fill();

    // Mặt trăng đêm
    c.fillStyle = this._danangRg(c, 1276, 556, 10, 150, [
      [0, 'rgba(200,235,255,.6)'],
      [1, 'rgba(200,235,255,0)']
    ]);
    c.beginPath();
    c.arc(1276, 556, 150, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = this._danangRg(c, 1268, 548, 3, 30, [
      [0, '#ffffff'],
      [1, '#bfdcf6']
    ]);
    c.beginPath();
    c.arc(1276, 556, 28, 0, Math.PI * 2);
    c.fill();

    // Bán đảo Sơn Trà: 3 mặt phẳng sáng/tối + sương mù chân núi
    const M = [
      [-60, 440], [105, 432], [368, 330], [470, 382], [610, 470],
      [760, 545], [900, 598], [1050, 640], [1160, 648], [830, 790], [-60, 790]
    ];
    c.fillStyle = this._danangLg(c, 0, 330, 0, 720, [
      [0, '#4254ac'],
      [0.45, '#2f3590'],
      [1, '#221d62']
    ]);
    c.beginPath();
    M.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
    c.fill();

    c.fillStyle = 'rgba(130,155,240,.3)';
    c.beginPath();
    c.moveTo(-60, 440);
    c.lineTo(368, 330);
    c.lineTo(325, 480);
    c.lineTo(180, 560);
    c.lineTo(-60, 560);
    c.fill();

    c.fillStyle = 'rgba(8,8,50,.34)';
    c.beginPath();
    c.moveTo(368, 330);
    c.lineTo(470, 382);
    c.lineTo(760, 545);
    c.lineTo(1050, 640);
    c.lineTo(830, 790);
    c.lineTo(520, 700);
    c.lineTo(430, 520);
    c.fill();

    c.fillStyle = 'rgba(8,8,50,.28)';
    c.beginPath();
    c.moveTo(368, 330);
    c.lineTo(430, 520);
    c.lineTo(330, 600);
    c.lineTo(325, 480);
    c.fill();

    c.strokeStyle = 'rgba(170,190,255,.6)';
    c.lineWidth = 3;
    c.beginPath();
    M.slice(1, 9).forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
    c.stroke();

    c.fillStyle = this._danangLg(c, 0, 520, 0, 700, [
      [0, 'rgba(230,120,160,0)'],
      [1, 'rgba(240,130,150,.4)']
    ]);
    c.fillRect(-60, 520, 1300, 200);

    // Rừng thông Sơn Trà
    const F = [[-60, 515], [105, 520], [250, 595], [450, 690], [700, 760], [830, 790]];
    c.fillStyle = this._danangLg(c, 0, 520, 0, 1040, [
      [0, '#0c2a3a'],
      [0.5, '#081c2e'],
      [1, '#0a1830']
    ]);
    c.beginPath();
    F.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
    c.lineTo(830, 790);
    c.bezierCurveTo(650, 830, 430, 900, 105, 1040);
    c.lineTo(-60, 1040);
    c.fill();

    for (let row = 3; row >= 0; row--) {
      for (let i = 0; i < 80; i++) {
        const x = -40 + i * 11 + this._danangRnd(i + row * 90) * 10;
        if (x > 830) break;
        const y = this._danangLerp(F, x) + row * 38 + this._danangRnd(i + row * 50) * 14;
        const s = 38 + this._danangRnd(i + row * 33) * 36;
        c.fillStyle = ['#05161f', '#061d28', '#082630', '#0a2a30'][(i + row) % 4];
        c.beginPath();
        c.moveTo(x - s * 0.3, y + 8);
        c.lineTo(x, y - s);
        c.lineTo(x + s * 0.3, y + 8);
        c.moveTo(x - s * 0.42, y + 10 + s * 0.28);
        c.lineTo(x, y - s * 0.4);
        c.lineTo(x + s * 0.42, y + 10 + s * 0.28);
        c.fill();
      }
    }

    // Tượng Phật Bà Linh Ứng trên núi Sơn Trà
    c.fillStyle = this._danangRg(c, 388, 715, 4, 130, [
      [0, 'rgba(255,190,90,.7)'],
      [1, 'rgba(255,160,60,0)']
    ]);
    c.beginPath();
    c.arc(388, 715, 130, 0, Math.PI * 2);
    c.fill();

    c.fillStyle = '#fffaf0';
    c.beginPath();
    c.moveTo(372, 764);
    c.quadraticCurveTo(368, 710, 382, 688);
    c.lineTo(394, 688);
    c.quadraticCurveTo(408, 710, 404, 764);
    c.fill();

    c.beginPath();
    c.arc(388, 678, 9, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(255,230,160,.5)';
    c.beginPath();
    c.arc(388, 680, 17, 0, Math.PI * 2);
    c.fill();

    c.fillStyle = '#e39a50';
    c.fillRect(362, 762, 52, 18);
    c.fillStyle = '#ffd48a';
    c.fillRect(362, 762, 52, 4);

    // Đất liền bờ trái + đường ven sông
    c.fillStyle = this._danangLg(c, 0, 800, 0, 1040, [[0, '#0a1a34'], [1, '#101e3c']]);
    c.beginPath();
    c.moveTo(105, 880);
    c.lineTo(830, 790);
    c.bezierCurveTo(650, 830, 430, 900, 105, 1040);
    c.fill();

    c.strokeStyle = 'rgba(90,90,150,.55)';
    c.lineWidth = 28;
    c.beginPath();
    c.moveTo(830, 790);
    c.bezierCurveTo(650, 826, 430, 892, 105, 1030);
    c.stroke();

    c.strokeStyle = 'rgba(255,190,110,.5)';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(830, 792);
    c.bezierCurveTo(650, 832, 430, 902, 105, 1040);
    c.stroke();

    // Tòa nhà bên trái chân Sơn Trà
    this._danangTower(c, 105, 690, 42, 895, '#143a54', '#1d6a80', '#4af0e8', 21);
    this._danangTower(c, 192, 752, 84, 905, '#4a5470', '#66708c', '#ffc880', 22);

    // Đất liền bên phải
    c.fillStyle = this._danangLg(c, 0, 795, 0, 1650, [[0, '#0e1c4a'], [1, '#070f2a']]);
    c.beginPath();
    c.moveTo(1400, 798);
    c.lineTo(2200, 790);
    c.lineTo(2200, 1650);
    c.lineTo(2050, 1650);
    c.bezierCurveTo(1990, 1480, 1900, 1290, 1850, 1180);
    c.bezierCurveTo(1760, 960, 1520, 850, 1400, 798);
    c.fill();

    // Dãy cao ốc Mỹ Khê rực rỡ (xa -> gần)
    c.fillStyle = this._danangRg(c, 1700, 720, 20, 420, [
      [0, 'rgba(80,230,255,.3)'],
      [1, 'rgba(80,230,255,0)']
    ]);
    c.fillRect(1300, 400, 800, 600);

    const towers = [
      [1425, 715, 47, 815, '#1f3a5e', '#2c5a70', '#58f0a0', 11],
      [1480, 625, 55, 812, '#222c6c', '#36428c', '#ffd070', 12],
      [1580, 672, 36, 800, '#14507a', '#1c7a9a', '#5af0ff', 14],
      [1550, 760, 70, 830, '#2a3a70', '#3c5088', '#ffd070', 13],
      [1640, 520, 112, 880, '#0a4f80', '#20a8c4', '#5af4ff', 15, 1],
      [1730, 842, 72, 888, '#0e5a7a', '#1a8aa0', '#5af0ff', 17],
      [1790, 620, 110, 892, '#3a3472', '#50468a', '#ffc860', 16]
    ];
    towers.forEach(b => this._danangTower(c, b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7], b[8]));

    // Đèn đường ven bờ sông
    for (let i = 0; i < 18; i++) {
      const p = this._danangBz([1400, 798, 1520, 850, 1760, 960, 1850, 1180], i / 18);
      scene.lamps.push([p[0] + 14, p[1] - 8]);
    }
    [[128, 940], [262, 960], [380, 905], [520, 868], [660, 826]].forEach(l => scene.lamps.push(l));

    scene.lamps.forEach(l => {
      c.fillStyle = this._danangRg(c, l[0], l[1], 0, 22, [
        [0, 'rgba(255,220,140,1)'],
        [0.3, 'rgba(255,200,110,.5)'],
        [1, 'rgba(255,180,90,0)']
      ]);
      c.fillRect(l[0] - 22, l[1] - 22, 44, 44);
    });

    c.strokeStyle = 'rgba(255,200,120,.45)';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(1400, 798);
    c.bezierCurveTo(1520, 850, 1760, 960, 1850, 1180);
    c.stroke();
  }

  _danangBuildFront(c) {
    const frontTowers = [
      [1920, 772, 80, 905, '#0d5a78', '#1a86a0', '#5af0ff', 31],
      [2030, 792, 90, 885, '#16507a', '#2a7aa0', '#5af0ff', 32],
      [1960, 905, 110, 965, '#4a3550', '#7a5040', '#ffa040', 33]
    ];
    frontTowers.forEach(b => this._danangTower(c, b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7]));
    for (let i = 0; i < 10; i++) {
      c.fillStyle = ['#ff7a30', '#ffc040', '#ff4a80'][i % 3];
      c.beginPath();
      c.arc(1975 + i * 11, 925, 4, 0, Math.PI * 2);
      c.fill();
    }
  }

  _danangBuildSwing(c) {
    const y = 797;
    c.strokeStyle = '#0c1648';
    c.lineWidth = 9;
    c.beginPath();
    c.moveTo(790, y);
    c.lineTo(1405, y);
    c.stroke();

    c.strokeStyle = 'rgba(190,205,255,.55)';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(790, y - 4);
    c.lineTo(1405, y - 4);
    c.stroke();

    c.strokeStyle = '#101c5c';
    c.lineWidth = 13;
    c.beginPath();
    c.moveTo(925, y + 10);
    c.bezierCurveTo(960, y - 80, 1040, y - 92, 1105, y - 92);
    c.bezierCurveTo(1170, y - 92, 1250, y - 80, 1285, y + 10);
    c.stroke();

    c.strokeStyle = 'rgba(150,175,255,.7)';
    c.lineWidth = 2.5;
    c.beginPath();
    c.moveTo(925, y + 4);
    c.bezierCurveTo(960, y - 86, 1040, y - 98, 1105, y - 98);
    c.bezierCurveTo(1170, y - 98, 1250, y - 86, 1285, y + 4);
    c.stroke();

    c.fillStyle = '#101c5c';
    c.fillRect(1093, y - 100, 24, 100);
    c.fillRect(1087, y - 108, 36, 12);

    c.lineWidth = 1.6;
    c.strokeStyle = 'rgba(205,220,255,.75)';
    for (let i = -22; i <= 22; i++) {
      if (Math.abs(i) < 2) continue;
      c.beginPath();
      c.moveTo(1105, y - 96);
      c.lineTo(1105 + i * 8.4, y - 4);
      c.stroke();
    }

    c.fillStyle = '#101c5c';
    c.fillRect(915, y - 4, 20, 26);
    c.fillRect(1275, y - 4, 20, 26);
    for (let i = 0; i < 40; i++) {
      c.fillStyle = 'rgba(255,225,160,.9)';
      c.fillRect(800 + i * 15.2, y - 10, 4, 4);
    }
  }

  _danangBuildBridge(c) {
    const d = (x) => this._danangDeck(x);

    // Trụ cầu
    [[165, 235], [370, 450], [835, 945], [1350, 1500]].forEach(r => {
      const y = d((r[0] + r[1]) / 2) + 14;
      c.fillStyle = this._danangLg(c, r[0], 0, r[1], 0, [
        [0, '#ffa63a'],
        [0.5, '#a0642a'],
        [1, '#3c2418']
      ]);
      c.beginPath();
      c.moveTo(r[0], y);
      c.lineTo(r[1], y);
      c.lineTo(r[1] - 14, y + 72);
      c.lineTo(r[0] + 14, y + 72);
      c.fill();
      c.fillStyle = 'rgba(255,200,110,.5)';
      c.fillRect(r[0], y, r[1] - r[0], 6);
    });

    // Mặt cầu + lan can + đèn đường
    c.fillStyle = this._danangLg(c, 0, 1000, 0, 1220, [
      [0, '#e8a858'],
      [0.5, '#a86e38'],
      [1, '#5a3820']
    ]);
    c.beginPath();
    c.moveTo(60, d(60) - 10);
    c.lineTo(1880, d(1880) - 10);
    c.lineTo(1880, d(1880) + 24);
    c.lineTo(60, d(60) + 24);
    c.fill();

    c.strokeStyle = '#ffe49a';
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(60, d(60) - 10);
    c.lineTo(1880, d(1880) - 10);
    c.stroke();

    c.strokeStyle = 'rgba(255,170,60,.9)';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(60, d(60) + 24);
    c.lineTo(1880, d(1880) + 24);
    c.stroke();

    for (let x = 70; x < 1880; x += 22) {
      c.fillStyle = '#ffeab0';
      c.fillRect(x, d(x) - 22, 3, 12);
    }

    // 3 vòm rồng thép vàng
    const arch = (x0, x1, pk) => {
      const y0 = d(x0) - 10;
      const y1 = d(x1) - 10;
      const cy = (4 * pk - y0 - y1) / 2;
      const p = [x0, y0, x0 + (x1 - x0) * 0.22, y0 + (cy - y0) * 1.0, x1 - (x1 - x0) * 0.22, y1 + (cy - y1) * 1.0, x1, y1];
      c.strokeStyle = 'rgba(255,215,120,.8)';
      c.lineWidth = 2.6;
      for (let x = x0 + 14; x < x1 - 8; x += 15) {
        let lo = 0, hi = 1;
        for (let k = 0; k < 14; k++) {
          const m = (lo + hi) / 2;
          if (this._danangBz(p, m)[0] < x) lo = m; else hi = m;
        }
        const q = this._danangBz(p, lo);
        c.beginPath();
        c.moveTo(x, q[1] + 8);
        c.lineTo(x, d(x) - 12);
        c.stroke();
      }
      this._danangSpine(c, p, 15, Math.round((x1 - x0) / 15), 24);
    };

    arch(215, 385, 975);
    arch(435, 840, 915);
    arch(935, 1350, 975);

    // Đuôi rồng uốn cong bên trái
    this._danangSpine(c, [215, 1040, 180, 1032, 150, 1010, 132, 968], 12, 5, 14);

    // Cổ rồng nhô lên bên phải
    this._danangSpine(c, [1400, 1128, 1500, 1090, 1520, 1010, 1600, 1030], 26, 11, 22);

    // Đầu rồng hùng vĩ phun lửa hướng sang phải
    c.save();
    c.translate(1626, 1007);
    c.scale(3.1, 3.1);

    for (let i = 0; i < 6; i++) {
      c.fillStyle = i % 2 ? '#ff7a1a' : '#ffa82a';
      c.beginPath();
      c.moveTo(-2, -6 + i);
      c.quadraticCurveTo(-18 - i * 3, -16 + i * 5, -30 - i * 4, -6 + i * 6);
      c.quadraticCurveTo(-18, -2 + i * 3, -2, 4 + i);
      c.fill();
    }

    c.strokeStyle = '#ffe9a0';
    c.lineWidth = 2.4;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(-1, -9);
    c.quadraticCurveTo(-8, -24, -22, -26);
    c.moveTo(4, -9);
    c.quadraticCurveTo(0, -20, -8, -26);
    c.stroke();

    c.fillStyle = this._danangLg(c, 0, -12, 0, 6, [[0, '#ffe46a'], [1, '#f59a1a']]);
    c.beginPath();
    c.moveTo(-10, -4);
    c.quadraticCurveTo(-8, -13, 4, -12);
    c.lineTo(22, -9);
    c.quadraticCurveTo(34, -9, 35, -3);
    c.quadraticCurveTo(33, 0, 26, 0);
    c.lineTo(8, 1);
    c.fill();

    c.fillStyle = '#7a1408';
    c.beginPath();
    c.moveTo(8, 1);
    c.lineTo(26, 0);
    c.lineTo(28, 9);
    c.lineTo(8, 8);
    c.fill();

    c.fillStyle = this._danangLg(c, 0, 4, 0, 14, [[0, '#f2a21c'], [1, '#d4780f']]);
    c.beginPath();
    c.moveTo(-6, 2);
    c.lineTo(8, 7);
    c.lineTo(28, 9);
    c.quadraticCurveTo(24, 14, 10, 14);
    c.lineTo(-6, 9);
    c.fill();

    c.fillStyle = '#fffbe8';
    for (let i = 0; i < 4; i++) {
      c.beginPath();
      c.moveTo(10 + i * 5, 1);
      c.lineTo(12 + i * 5, 6);
      c.lineTo(14 + i * 5, 1);
      c.fill();
      c.beginPath();
      c.moveTo(12 + i * 5, 8.5);
      c.lineTo(13.4 + i * 5, 5);
      c.lineTo(15 + i * 5, 8.5);
      c.fill();
    }

    c.fillStyle = '#fff';
    c.beginPath();
    c.ellipse(6, -5.5, 3.4, 2.6, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#d8200c';
    c.beginPath();
    c.arc(7, -5.5, 1.5, 0, Math.PI * 2);
    c.fill();

    c.strokeStyle = '#a04a08';
    c.lineWidth = 1.4;
    c.beginPath();
    c.moveTo(1, -9.5);
    c.lineTo(11, -8);
    c.stroke();
    c.fillStyle = '#c4540c';
    c.beginPath();
    c.arc(31, -5.5, 1.5, 0, Math.PI * 2);
    c.fill();

    c.strokeStyle = '#ffd24a';
    c.lineWidth = 1.4;
    c.beginPath();
    c.moveTo(24, 0);
    c.quadraticCurveTo(34, 14, 28, 28);
    c.moveTo(20, 0);
    c.quadraticCurveTo(24, 16, 16, 30);
    c.stroke();

    c.restore();
  }

  _danangBuildFg(c) {
    const dark = ['#03101a', '#05202a', '#082a30'];
    const rim = 'rgba(110,190,210,.4)';

    // Quảng trường đá + lan can trắng bên trái
    c.fillStyle = this._danangLg(c, 0, 1440, 0, 1650, [[0, '#2c3c60'], [1, '#161e3a']]);
    c.beginPath();
    c.moveTo(105, 1470);
    c.lineTo(830, 1440);
    c.lineTo(860, 1650);
    c.lineTo(105, 1650);
    c.fill();

    c.fillStyle = 'rgba(210,226,255,.9)';
    c.fillRect(230, 1462, 600, 12);
    c.fillRect(230, 1530, 600, 9);
    for (let x = 240; x < 830; x += 24) {
      c.fillStyle = 'rgba(190,210,245,.85)';
      c.fillRect(x, 1474, 9, 56);
    }
    c.fillStyle = 'rgba(210,226,255,.9)';
    c.beginPath();
    c.moveTo(830, 1440);
    c.lineTo(850, 1445);
    c.lineTo(730, 1650);
    c.lineTo(690, 1650);
    c.fill();

    c.fillStyle = '#5a6482';
    c.fillRect(530, 1395, 80, 255);
    c.fillStyle = '#aab4d6';
    c.fillRect(520, 1385, 100, 16);

    // Cây dừa bên trái
    c.strokeStyle = dark[0];
    c.lineWidth = 26;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(150, 1450);
    c.quadraticCurveTo(210, 1300, 210, 1120);
    c.stroke();
    for (let i = 0; i < 12; i++) {
      this._danangBlade(c, 210, 1115, 150 + this._danangRnd(i) * 120, -Math.PI * 1.05 + i * Math.PI * 1.15 / 11, 18, dark[i % 3], rim);
    }

    // Bụi lá nhiệt đới trái dưới
    const leftFronds = [
      [105, 1660, 330], [240, 1660, 260], [420, 1660, 200], [105, 1290, 240], [330, 1640, 170]
    ];
    leftFronds.forEach((f, j) => {
      for (let i = 0; i < 13; i++) {
        this._danangBlade(c, f[0], f[1], f[2] * (0.7 + this._danangRnd(i + j * 9) * 0.5), -Math.PI * 0.98 + i * Math.PI * 0.96 / 12, 17, dark[(i + j) % 3], rim);
      }
    });

    // Cây dừa lớn góc phải
    c.strokeStyle = dark[0];
    c.lineWidth = 30;
    c.beginPath();
    c.moveTo(2085, 1650);
    c.quadraticCurveTo(2040, 1380, 1995, 1150);
    c.stroke();
    for (let i = 0; i < 13; i++) {
      this._danangBlade(c, 1995, 1065, 200 + this._danangRnd(i + 40) * 120, -Math.PI * 1.2 + i * Math.PI * 1.35 / 12, 20, dark[i % 3], rim);
    }

    c.strokeStyle = dark[0];
    c.lineWidth = 16;
    c.beginPath();
    c.moveTo(1820, 1330);
    c.quadraticCurveTo(1840, 1260, 1830, 1190);
    c.stroke();
    for (let i = 0; i < 9; i++) {
      this._danangBlade(c, 1830, 1185, 90 + this._danangRnd(i + 70) * 50, -Math.PI * 1.1 + i * Math.PI * 1.2 / 8, 11, dark[i % 3], rim);
    }

    const rightFronds = [
      [2040, 1680, 300], [1900, 1690, 240], [2108, 1500, 200]
    ];
    rightFronds.forEach((f, j) => {
      for (let i = 0; i < 14; i++) {
        this._danangBlade(c, f[0], f[1], f[2] * (0.7 + this._danangRnd(i + j * 5) * 0.5), -Math.PI * 1.05 + i * Math.PI * 1.1 / 13, 15, ['#0b3a2c', '#0e4a34', '#125a3a', '#04141c'][(i + j) % 4], 'rgba(150,230,200,.35)');
      }
    });
  }

  // ==========================================
  // CÁC HÀM ĐỘNG: VÒNG QUAY, NƯỚC, KHÍ PHUN
  // ==========================================
  _danangFerris(c, cx, cy, r, t) {
    const a0 = t * 0.1;
    c.save();
    c.strokeStyle = '#1a2766';
    c.lineWidth = 9;
    c.beginPath();
    c.moveTo(cx, cy);
    c.lineTo(cx - 70, cy + r + 150);
    c.moveTo(cx, cy);
    c.lineTo(cx + 70, cy + r + 150);
    c.stroke();

    c.fillStyle = this._danangRg(c, cx, cy, r * 0.5, r * 1.6, [
      [0, 'rgba(160,150,255,.28)'],
      [1, 'rgba(160,150,255,0)']
    ]);
    c.fillRect(cx - r * 1.7, cy - r * 1.7, r * 3.4, r * 3.4);

    c.lineWidth = 2.2;
    for (let i = 0; i < 24; i++) {
      const a = a0 + i * Math.PI / 12;
      c.strokeStyle = `hsla(${i * 15 + t * 20},95%,66%,.85)`;
      c.beginPath();
      c.moveTo(cx, cy);
      c.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      c.stroke();
    }

    [r, r * 0.6].forEach((rr, k) => {
      for (let i = 0; i < 60; i++) {
        const a = i / 60 * Math.PI * 2 + a0 * (k ? -1 : 1);
        c.fillStyle = `hsl(${i * 6 + t * 40},100%,70%)`;
        c.beginPath();
        c.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 3.2, 0, Math.PI * 2);
        c.fill();
      }
    });

    for (let i = 0; i < 16; i++) {
      const a = a0 + i * Math.PI / 8;
      const gx = cx + Math.cos(a) * r;
      const gy = cy + Math.sin(a) * r;
      c.fillStyle = `hsl(${i * 22 + 20},90%,62%)`;
      c.fillRect(gx - 7, gy + 2, 14, 12);
    }

    c.fillStyle = '#e8e9ff';
    c.beginPath();
    c.arc(cx, cy, 9, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }

  _danangStrips(c, src, axis, k, alpha, maxD, fade, scene) {
    const K = scene.K, W = scene.W, H = scene.H, offsetY = scene.offsetY;
    for (let d = 0; d < maxD; d += 6) {
      const sy = axis - d * k;
      if (sy < 0) break;
      c.globalAlpha = alpha * (1 - d / maxD * fade);
      const py = sy * K + offsetY;
      if (py >= 0 && py + 6 * K <= H) {
        c.drawImage(src, 0, py, W, 6 * K, 105 + Math.sin(d * 0.05 + (this.animTimer || 0) * 1.8) * (1.5 + d * 0.012), axis + d, 2003, 6);
      }
    }
    c.globalAlpha = 1;
  }

  _danangWater(c, t, scene) {
    const K = scene.K;
    c.save();
    this._danangRiver(c);
    c.clip();

    // Nước sông Hàn
    c.fillStyle = this._danangLg(c, 0, 648, 0, 1652, [
      [0, '#6a4c92'],
      [0.05, '#2c3c88'],
      [0.22, '#162684'],
      [0.5, '#0e1a62'],
      [1, '#080e40']
    ]);
    c.fillRect(0, 640, 2300, 1020);

    c.fillStyle = this._danangRg(c, 1200, 650, 10, 360, [
      [0, 'rgba(255,200,110,.75)'],
      [1, 'rgba(255,170,110,0)']
    ]);
    c.save();
    c.translate(0, 650);
    c.scale(1, 0.14);
    c.translate(0, -650);
    c.fillRect(800, 0, 900, 1652);
    c.restore();

    this._danangStrips(c, scene.bg, 648, 0.9, 0.6, 360, 0.85, scene);
    this._danangStrips(c, scene.sw, 797, 0.8, 0.5, 150, 0.9, scene);

    // Phản chiếu Cầu Rồng: lật cột quanh chân cầu, cắt vằn ngang sóng
    const rf = scene.rf;
    rf.save();
    rf.setTransform(1, 0, 0, 1, 0, 0);
    rf.clearRect(0, 0, scene.W, scene.H);
    this._danangT(rf, scene);

    for (let x = 105; x < 1870; x += 8) {
      const ym = this._danangDeck(x) + 22;
      rf.save();
      rf.translate(Math.sin(x * 0.04 + t * 2.2) * 3.5, 2 * ym);
      rf.scale(1, -1);
      const px = x * K + scene.offsetX;
      const py = scene.offsetY;
      rf.drawImage(scene.brg, px, py, 8 * K, ym * K, x, 0, 8, ym);
      rf.restore();
    }

    rf.globalCompositeOperation = 'destination-out';
    for (let y = 1110; y < 1560; y += 10) {
      rf.fillStyle = `rgba(0,0,0,${0.25 + 0.4 * Math.abs(Math.sin(y * 0.07 + t * 1.5)) + (y - 1110) / 1500})`;
      rf.fillRect(105, y, 2003, 3 + (y - 1110) / 70);
    }
    rf.restore();

    c.globalAlpha = 0.85;
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.drawImage(scene.rfc, 0, 0);
    c.restore();
    c.globalAlpha = 1;

    // Vệt đèn bờ & cao ốc
    scene.lamps.forEach((l, i) => {
      for (let k = 0; k < 6; k++) {
        c.fillStyle = `rgba(255,205,115,${0.2 + 0.12 * Math.sin(t * 2 + i + k)})`;
        c.fillRect(l[0] - 4 + Math.sin(t * 2 + k + i) * 4, l[1] + 18 + k * 16, 8 - k, 4);
      }
    });

    [[1700, '90,240,255'], [1840, '255,200,100'], [1520, '255,210,120']].forEach((r, i) => {
      for (let k = 0; k < 8; k++) {
        c.fillStyle = `rgba(${r[1]},${0.07 + 0.07 * Math.abs(Math.sin(t * 1.2 + k + i))})`;
        c.fillRect(r[0] - 40 + Math.sin(t + k) * 8, 940 + i * 20 + k * 22, 80, 6);
      }
    });

    // Vệt trăng trên biển + sóng nước
    for (let i = 0; i < 22; i++) {
      const y = 660 + i * 12;
      const w = 10 + this._danangRnd(i) * 60 * (1 + i * 0.05);
      c.fillStyle = `rgba(215,238,255,${0.1 + 0.4 * Math.abs(Math.sin(t * 1.5 + i * 1.7))})`;
      c.fillRect(1276 - w / 2 + Math.sin(t + i) * 8, y, w, 3.5);
    }

    for (let i = 0; i < 80; i++) {
      const y = 680 + Math.pow(this._danangRnd(i + 300), 1.3) * 960;
      const x = 105 + this._danangRnd(i + 350) * 2003;
      const a = 0.05 + 0.22 * Math.max(0, Math.sin(t * 1.6 + i * 2.3));
      c.strokeStyle = `rgba(190,210,255,${a})`;
      c.lineWidth = 2.4;
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(x + 22, y - 4, x + 50 + (y - 650) * 0.06, y);
      c.stroke();
    }

    c.fillStyle = this._danangLg(c, 0, 648, 0, 1652, [
      [0.6, 'rgba(4,8,34,0)'],
      [1, 'rgba(4,8,34,.5)']
    ]);
    c.fillRect(0, 648, 2300, 1010);
    c.restore();
  }

  _updateDaNangFx(dt) {
    if (!this.daNangParts) this.daNangParts = [];
    if (!this.daNangAcc) this.daNangAcc = 0;
    const m = { x: 1742, y: 1007 };
    const mode = ((this.animTimer || 0) % 14) < 7 ? 'fire' : 'water';
    const fire = mode === 'fire';
    this.daNangAcc += dt * (fire ? 240 : 170);
    while (this.daNangAcc >= 1 && this.daNangParts.length < 460) {
      this.daNangAcc -= 1;
      const r = Math.random();
      if (fire) {
        const sp = 380 + Math.random() * 260;
        this.daNangParts.push(r < 0.14
          ? { k: 'e', x: m.x, y: m.y, vx: 420 + Math.random() * 520, vy: -260 + Math.random() * 200, l: 1, d: 0.9 + Math.random() * 0.8 }
          : { k: 'f', x: m.x, y: m.y, vx: sp, vy: -sp * 0.42 + (Math.random() - 0.5) * 120, l: 1, d: 0.45 + Math.random() * 0.4 });
      } else {
        this.daNangParts.push({ k: 'w', x: m.x, y: m.y, vx: 240 + r * 220, vy: -560 - Math.random() * 170, l: 1, d: 1.45 });
      }
    }
    if (this.daNangAcc > 1) this.daNangAcc = 0;
    this.daNangParts = this.daNangParts.filter(p => {
      p.l -= dt / p.d;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.k === 'f') p.vy -= 140 * dt;
      else if (p.k === 'e') p.vy += 260 * dt;
      else p.vy += 1150 * dt;
      return p.l > 0;
    });
  }

  _danangFx(c, t, scene) {
    const m = { x: 1742, y: 1007 };
    const mode = ((this.animTimer || 0) % 14) < 7 ? 'fire' : 'water';
    const fire = mode === 'fire';

    // 1. Thân lửa / tia nước: vẽ đè bình thường để không bị bệt trắng trên nền phố sáng
    if (fire) {
      const ang = -0.42;
      const len = 280 + Math.sin(t * 9) * 22;
      const dx = Math.cos(ang);
      const dy = Math.sin(ang);
      const nx = -dy;
      const ny = dx;

      const flame = (w0, w1, stops) => {
        const grad = c.createLinearGradient(m.x, m.y, m.x + dx * len, m.y + dy * len);
        stops.forEach(s => grad.addColorStop(s[0], s[1]));
        c.fillStyle = grad;
        c.beginPath();
        c.moveTo(m.x + nx * w0, m.y + ny * w0);
        c.quadraticCurveTo(
          m.x + dx * len * 0.5 + nx * w1, m.y + dy * len * 0.5 + ny * w1,
          m.x + dx * len, m.y + dy * len
        );
        c.quadraticCurveTo(
          m.x + dx * len * 0.5 - nx * w1, m.y + dy * len * 0.5 - ny * w1,
          m.x - nx * w0, m.y - ny * w0
        );
        c.closePath();
        c.fill();
      };

      flame(14, 52, [
        [0, 'rgba(255,120,25,0.55)'],
        [0.28, 'rgba(255,104,20,0.72)'],
        [0.72, 'rgba(255,80,15,0.42)'],
        [1, 'rgba(255,60,10,0)']
      ]);
      flame(9, 30, [
        [0, 'rgba(255,196,60,0.85)'],
        [0.36, 'rgba(255,160,45,0.7)'],
        [1, 'rgba(255,120,30,0)']
      ]);
      flame(4, 11, [
        [0, 'rgba(255,250,215,0.95)'],
        [0.5, 'rgba(255,232,150,0.5)'],
        [1, 'rgba(255,200,80,0)']
      ]);
    }

    // 2. Quầng sáng và hạt: cộng sáng cho rực rỡ
    c.save();
    c.globalCompositeOperation = 'lighter';
    if (fire) {
      c.fillStyle = this._danangRg(c, 1880, 830, 20, 520, [
        [0, `rgba(255,140,40,${0.22 + 0.07 * Math.sin(t * 9)})`],
        [1, 'rgba(255,120,30,0)']
      ]);
      c.fillRect(1300, 400, 810, 800);
      for (let i = 0; i < 14; i++) {
        c.fillStyle = `rgba(255,${110 + i * 8},40,${0.12 + 0.08 * Math.sin(t * 6 + i)})`;
        c.fillRect(1560 + i * 24 + Math.sin(t * 3 + i) * 8, 1290 + i * 15, 330 - i * 14, 7);
      }
    }
    const glowR = fire ? 50 : 110;
    c.fillStyle = this._danangRg(c, m.x, m.y, 4, glowR, [
      [0, fire ? 'rgba(255,160,60,.38)' : 'rgba(205,238,255,.75)'],
      [1, fire ? 'rgba(255,110,30,0)' : 'rgba(150,200,255,0)']
    ]);
    c.beginPath();
    c.arc(m.x, m.y, glowR, 0, Math.PI * 2);
    c.fill();

    // Hạt lửa vẽ đè (không cộng sáng) để không bị bệt trắng trên nền phố
    c.globalCompositeOperation = fire ? 'source-over' : 'lighter';
    if (this.daNangParts) {
      this.daNangParts.forEach(p => {
        if (p.k === 'f') {
          const r = 12 + (1 - p.l) * 74;
          c.fillStyle = `hsla(${6 + 52 * p.l},100%,${44 + 24 * p.l}%,${Math.min(1, p.l * 1.2) * 0.55})`;
          c.beginPath();
          c.arc(p.x, p.y, r, 0, Math.PI * 2);
          c.fill();
          // Bóng lửa trên mặt nước
          c.fillStyle = `hsla(${10 + 40 * p.l},100%,55%,${p.l * 0.22})`;
          c.beginPath();
          c.ellipse(p.x, 2 * 1160 - p.y, r * 1.7, r * 0.42, 0, 0, Math.PI * 2);
          c.fill();
        } else if (p.k === 'e') {
          c.fillStyle = `rgba(255,${(170 + 80 * p.l) | 0},70,${p.l})`;
          c.fillRect(p.x, p.y, 6, 6);
        } else {
          c.fillStyle = `rgba(205,235,255,${p.l * 0.75})`;
          c.beginPath();
          c.arc(p.x, p.y, 5 + (1 - p.l) * 7, 0, Math.PI * 2);
          c.fill();
          c.fillStyle = `rgba(255,255,255,${p.l * 0.6})`;
          c.fillRect(p.x - 1.5, p.y - 1.5, 3.5, 3.5);
        }
      });
    }
    c.restore();
  }

  // ==========================================
  // PANEL 6: HỘI AN (Chùa Cầu & Sông Hoài Đêm Đèn Lồng)
  // MASTERPIECE VECTOR 2D ART - 100% DEMO & CONCEPT REFERENCE
  // OFFCANVAS LAYER CACHING FOR SILKY 60 FPS
  // ==========================================
  _drawHoiAn(ctx) {
    const scene = this._getHoiAnScene();
    const w = this.width;
    const h = this.height;
    const scale = w / 480;

    ctx.save();
    // 1. Dựng tầng kiến trúc tĩnh & nền trời sông nước đã được cache sẵn (0 ms overhead)
    ctx.drawImage(scene.back, 0, 0, w, h);

    // 2. Mây đêm bồng bềnh trôi nhẹ
    this._hoianDrawClouds(ctx, w, h, scale);

    // 3. Đèn trời (thiên đăng) bay lượn trên cao
    this._hoianDrawSkyLanterns(ctx, w, h, scale);

    // 4. Đèn lồng phố cổ & Chùa Cầu đung đưa êm dịu trong gió
    this._hoianDrawHouseLanterns(ctx, w, h, scale);
    this._hoianDrawBridgeLanterns(ctx, w, h, scale);
    this._hoianDrawStringLanterns(ctx, w, h, scale);

    // 5. Mặt nước sông Hoài gợn sóng phản chiếu ánh đèn
    this._hoianDrawWaterRipples(ctx, w, h, scale);

    // 6. Cánh đồng hoa đăng bập bồng nhấp nháy trên sông Hoài
    this._hoianDrawLotusField(ctx, w, h, scale);

    // 7. Thuyền nan chở khách và hoa đăng chòng chành trên sông
    this._hoianDrawBoats(ctx, w, h, scale);

    // 8. Tiền cảnh: cỏ nến, dương xỉ đung đưa, hoa đăng lớn và viền sáng tối
    this._hoianDrawForeground(ctx, w, h, scale);

    ctx.restore();
  }

  _getHoiAnScene() {
    const width = Math.max(1, Math.round(this.width));
    const height = Math.max(1, Math.round(this.height));
    if (this._hoiAnScene &&
      this._hoiAnScene.width === width &&
      this._hoiAnScene.height === height) {
      return this._hoiAnScene;
    }

    const scene = { width, height };
    const scale = width / 480;

    scene.back = this._hoianLayer(g => {
      // 1. Bầu trời hoàng hôn muộn
      const gSky = g.createLinearGradient(0, 0, 0, height * 0.58);
      gSky.addColorStop(0, '#060b2a');
      gSky.addColorStop(0.28, '#141d4e');
      gSky.addColorStop(0.44, '#5a3a58');
      gSky.addColorStop(0.54, '#e0802e');
      gSky.addColorStop(1, '#ffb54c');
      g.fillStyle = gSky;
      g.fillRect(0, 0, width, height * 0.6);

      // Trăng tròn & quầng sáng đêm
      const mx = width * 0.8;
      const my = height * 0.11;
      const gl = g.createRadialGradient(mx, my, 4, mx, my, 70 * scale);
      gl.addColorStop(0, 'rgba(200,225,255,.5)');
      gl.addColorStop(1, 'rgba(200,225,255,0)');
      g.fillStyle = gl;
      g.beginPath();
      g.arc(mx, my, 70 * scale, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#cfe2f6';
      g.beginPath();
      g.arc(mx, my, 20 * scale, 0, Math.PI * 2);
      g.fill();

      // 2. Mặt đất / đường phố
      const gGround = g.createLinearGradient(0, height * 0.55, 0, height);
      gGround.addColorStop(0, '#7a4a3a');
      gGround.addColorStop(0.3, '#3b2e44');
      gGround.addColorStop(1, '#1b1a30');
      g.fillStyle = gGround;
      g.fillRect(0, height * 0.55, width, height * 0.45);

      // 3. Các nếp nhà phố cổ vàng hai bên bờ
      this._hoianHouseStatic(g, 70 * scale, 80 * scale, height * 0.40, height * 0.585, scale);
      this._hoianHouseStatic(g, 340 * scale, 66 * scale, height * 0.42, height * 0.585, scale);
      this._hoianHouseStatic(g, 0, 90 * scale, height * 0.30, height * 0.63, scale);
      this._hoianHouseStatic(g, 392 * scale, 88 * scale, height * 0.29, height * 0.63, scale);

      // 4. Chùa Cầu cổ kính trung tâm (chân đế đá, 3 vòm, tường đỏ, chùa gỗ, mái ngói 2 tầng, hoa văn rồng lân)
      this._hoianBridgeStatic(g, width, height, scale);

      // 5. Mặt nước sông Hoài & quầng sáng hắt từ vòm giữa
      this._hoianWaterStatic(g, width, height, scale);

      // 6. Bờ kè đá hai bên
      this._hoianWallsStatic(g, width, height, scale);

      // 7. Dây đèn lồng phố cổ (đường dây nối nhà với Chùa Cầu)
      this._hoianStringWire(g, 70 * scale, height * 0.40, width * 0.27, height * 0.45, 24, scale);
      this._hoianStringWire(g, width * 0.73, height * 0.45, 400 * scale, height * 0.40, 22, scale);

      // 8. Lan can đá tiền cảnh góc trái
      g.fillStyle = '#6a6a78';
      g.fillRect(0, height * 0.93, width * 0.27, 5 * scale);
      g.fillStyle = '#55556a';
      for (let i = 0; i < 7; i++) {
        g.fillRect(i * width * 0.04, height * 0.935, 3 * scale, height * 0.04);
      }
    });

    this._hoiAnScene = scene;
    return scene;
  }

  _hoianLayer(draw) {
    const layer = document.createElement('canvas');
    layer.width = Math.max(1, Math.round(this.width));
    layer.height = Math.max(1, Math.round(this.height));
    const g = layer.getContext('2d');
    draw(g);
    return layer;
  }

  _hoianRnd(n) {
    const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return s - Math.floor(s);
  }

  _hoianEdge(y, h, w) {
    const f = Math.max(0, Math.min(1, (y - h * 0.575) / (h * 0.225)));
    return [w * 0.34 * (1 - f), w - w * 0.34 * (1 - f)];
  }

  // ---- Đèn lồng phố cổ đung đưa ----
  _hoianLantern(ctx, x, y, r, k, ph, scale) {
    const C = [
      ['#ff9a2a', '255,150,40'],
      ['#e72f45', '240,50,70'],
      ['#ff5aa0', '255,90,160'],
      ['#ffcf40', '255,200,60']
    ][k % 4];
    x += Math.sin((this.animTimer || 0) * 1.2 + ph) * r * 0.2;
    const gl = ctx.createRadialGradient(x, y, 1, x, y, r * 3.2);
    gl.addColorStop(0, `rgba(${C[1]},.45)`);
    gl.addColorStop(1, `rgba(${C[1]},0)`);
    ctx.fillStyle = gl;
    ctx.beginPath();
    ctx.arc(x, y, r * 3.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = C[0];
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 1.15, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,240,170,.45)';
    ctx.beginPath();
    ctx.ellipse(x, y, r * 0.55, r * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(90,20,10,.5)';
    ctx.lineWidth = Math.max(0.7, 0.7 * scale);
    ctx.beginPath();
    ctx.ellipse(x, y, r * 0.5, r * 1.15, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#4a2a14';
    ctx.fillRect(x - r * 0.45, y - r * 1.3, r * 0.9, r * 0.3);
    ctx.fillRect(x - r * 0.35, y + r * 1.1, r * 0.7, r * 0.2);

    ctx.strokeStyle = C[0];
    ctx.beginPath();
    ctx.moveTo(x, y + r * 1.3);
    ctx.lineTo(x, y + r * 1.9);
    ctx.stroke();
  }

  // ---- Nhà phố cổ vàng (phần kiến trúc tĩnh) ----
  _hoianHouseStatic(ctx, x, bw, top, base, scale) {
    const g = ctx.createLinearGradient(x, 0, x + bw, 0);
    g.addColorStop(0, '#f2b236');
    g.addColorStop(1, '#c98a1e');
    ctx.fillStyle = g;
    ctx.fillRect(x, top, bw, base - top);

    // Mái ngói
    ctx.fillStyle = '#4a2a2a';
    ctx.beginPath();
    ctx.moveTo(x - 6 * scale, top + 14 * scale);
    ctx.lineTo(x + bw * 0.4, top - 24 * scale);
    ctx.lineTo(x + bw + 6 * scale, top + 14 * scale);
    ctx.fill();

    ctx.strokeStyle = 'rgba(210,130,90,.35)';
    ctx.lineWidth = Math.max(1, scale);
    for (let i = 1; i < 6; i++) {
      const yy = top - 24 * scale + i * 6.4 * scale;
      const f = i / 6;
      ctx.beginPath();
      ctx.moveTo(x + bw * 0.4 - (bw * 0.4 + 6 * scale) * f, yy);
      ctx.lineTo(x + bw * 0.4 + (bw * 0.6 + 6 * scale) * f, yy);
      ctx.stroke();
    }

    // Cửa sổ chớp tầng trên
    const n = Math.max(1, Math.floor(bw / (36 * scale)));
    for (let i = 0; i < n; i++) {
      const wx = x + 8 * scale + i * ((bw - 16 * scale) / n) + 2 * scale;
      const ww = (bw - 16 * scale) / n - 8 * scale;
      const wy = top + 26 * scale;
      ctx.fillStyle = '#5a3418';
      ctx.fillRect(wx, wy, ww, 34 * scale);
      ctx.strokeStyle = 'rgba(255,190,100,.5)';
      for (let k = 0; k < 5; k++) {
        ctx.beginPath();
        ctx.moveTo(wx + 2 * scale, wy + (4 + k * 6) * scale);
        ctx.lineTo(wx + ww - 2 * scale, wy + (4 + k * 6) * scale);
        ctx.stroke();
      }
    }

    // Mái hiên giữa + ban công
    const my = top + (base - top) * 0.5;
    ctx.fillStyle = '#4a2a2a';
    ctx.beginPath();
    ctx.moveTo(x - 4 * scale, my + 10 * scale);
    ctx.lineTo(x + bw + 4 * scale, my + 10 * scale);
    ctx.lineTo(x + bw, my - 4 * scale);
    ctx.lineTo(x, my - 4 * scale);
    ctx.fill();

    ctx.fillStyle = '#7a4a22';
    ctx.fillRect(x, my - 24 * scale, bw, 3 * scale);
    for (let i = 0; i < bw / (5 * scale); i++) {
      ctx.fillRect(x + i * 5 * scale + 1, my - 22 * scale, 1.5 * scale, 18 * scale);
    }

    // Tầng trệt: cửa phát sáng
    const dg = ctx.createLinearGradient(0, my + 14 * scale, 0, base);
    dg.addColorStop(0, '#2a1810');
    dg.addColorStop(1, '#a8601e');
    ctx.fillStyle = dg;
    ctx.fillRect(x + bw * 0.25, my + 14 * scale, bw * 0.5, base - my - 14 * scale);
  }

  // ---- Chùa Cầu (phần kiến trúc tĩnh) ----
  _hoianBridgeStatic(ctx, w, h, scale) {
    const wb = h * 0.575;

    // Chân cầu đá có 3 vòm
    ctx.fillStyle = '#5a5248';
    ctx.fillRect(w * 0.29, h * 0.50, w * 0.42, wb - h * 0.50);
    ctx.strokeStyle = 'rgba(30,25,25,.45)';
    ctx.lineWidth = Math.max(1, scale);
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 22; c++) {
        const bx = w * 0.29 + c * (w * 0.42 / 22) + (r % 2) * 4 * scale;
        ctx.strokeRect(bx, h * 0.50 + r * 8 * scale, w * 0.42 / 22, 8 * scale);
      }
    }

    [[0.37, 0.05], [0.5, 0.09], [0.63, 0.05]].forEach((a, i) => {
      const cx = w * a[0], aw = w * a[1], top = h * (i === 1 ? 0.515 : 0.53);
      const lg = ctx.createLinearGradient(0, top, 0, wb);
      lg.addColorStop(0, '#16152c');
      lg.addColorStop(1, i === 1 ? '#c8803c' : '#241d30');
      ctx.fillStyle = lg;
      ctx.beginPath();
      ctx.moveTo(cx - aw, wb);
      ctx.lineTo(cx - aw, top + aw * 0.8);
      ctx.quadraticCurveTo(cx, top - aw * 0.8, cx + aw, top + aw * 0.8);
      ctx.lineTo(cx + aw, wb);
      ctx.fill();
    });

    // Hai đầu tường đỏ
    [[0.26, 0.09], [0.65, 0.09]].forEach(e => {
      const g = ctx.createLinearGradient(0, h * 0.42, 0, wb);
      g.addColorStop(0, '#8a3a30');
      g.addColorStop(1, '#5a2420');
      ctx.fillStyle = g;
      ctx.fillRect(w * e[0], h * 0.435, w * e[1], wb - h * 0.435);
    });

    // Nội thất nhà cầu + cột + lan can
    ctx.fillStyle = '#1a1020';
    ctx.fillRect(w * 0.32, h * 0.435, w * 0.36, h * 0.055);
    ctx.fillStyle = '#6a2a24';
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(w * 0.33 + i * w * 0.06, h * 0.435, 4 * scale, h * 0.058);
    }
    ctx.fillStyle = '#7a4a2a';
    ctx.fillRect(w * 0.32, h * 0.466, w * 0.36, 2 * scale);
    for (let i = 0; i < 40; i++) {
      ctx.fillRect(w * 0.32 + i * (w * 0.36 / 40), h * 0.466, 1.4 * scale, h * 0.024);
    }

    // Mái ngói hai tầng
    const roof = (x0, x1, y0, y1, ins) => {
      ctx.fillStyle = '#3a2224';
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x0 + ins, y1);
      ctx.lineTo(x1 - ins, y1);
      ctx.lineTo(x1, y0);
      ctx.fill();
      ctx.strokeStyle = 'rgba(200,110,80,.4)';
      ctx.lineWidth = Math.max(1, scale);
      for (let i = 1; i < 6; i++) {
        const f = i / 6;
        const yy = y0 + (y1 - y0) * f;
        ctx.beginPath();
        ctx.moveTo(x0 + ins * f, yy);
        ctx.lineTo(x1 - ins * f, yy);
        ctx.stroke();
      }
      ctx.strokeStyle = '#8a5a30';
      ctx.lineWidth = 2.5 * scale;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y0);
      ctx.stroke();
    };
    roof(w * 0.27, w * 0.73, h * 0.43, h * 0.385, w * 0.04);
    roof(w * 0.35, w * 0.65, h * 0.395, h * 0.355, w * 0.03);

    // Trang trí nóc: rồng/lân
    ctx.fillStyle = '#2a1a1e';
    [[0.5, 0.35, 1.3], [0.38, 0.358, 0.9], [0.62, 0.358, 0.9], [0.28, 0.425, 0.8], [0.72, 0.425, 0.8]].forEach(o => {
      const x = w * o[0], y = h * o[1], s = o[2] * scale;
      ctx.beginPath();
      ctx.moveTo(x - 10 * s, y + 5 * scale);
      ctx.quadraticCurveTo(x - 8 * s, y - 10 * s, x, y - 14 * s);
      ctx.quadraticCurveTo(x + 8 * s, y - 10 * s, x + 10 * s, y + 5 * scale);
      ctx.quadraticCurveTo(x, y - 2 * s, x - 10 * s, y + 5 * scale);
      ctx.fill();
    });
  }

  // ---- Mặt nước Sông Hoài tĩnh ----
  _hoianWaterStatic(ctx, w, h, scale) {
    const wb = h * 0.575;
    ctx.beginPath();
    ctx.moveTo(w * 0.34, wb);
    ctx.lineTo(w * 0.66, wb);
    ctx.lineTo(w, h * 0.8);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.lineTo(0, h * 0.8);
    ctx.closePath();
    const g = ctx.createLinearGradient(0, wb, 0, h);
    g.addColorStop(0, '#2c5a78');
    g.addColorStop(0.25, '#173a5e');
    g.addColorStop(1, '#0a1230');
    ctx.fillStyle = g;
    ctx.fill();

    // Ánh sáng qua vòm giữa
    const lg = ctx.createRadialGradient(w * 0.5, wb + 10 * scale, 3, w * 0.5, wb + 10 * scale, 90 * scale);
    lg.addColorStop(0, 'rgba(255,170,80,.45)');
    lg.addColorStop(1, 'rgba(255,150,60,0)');
    ctx.fillStyle = lg;
    ctx.fillRect(w * 0.3, wb, w * 0.4, 100 * (h / 720));
  }

  // ---- Bờ kè đá hai bên ----
  _hoianWallsStatic(ctx, w, h, scale) {
    [[1, 0], [-1, w]].forEach(s => {
      const bx = s[1] === 0 ? w * 0.34 : w * 0.66;
      const tx = s[1] === 0 ? w * 0.30 : w * 0.70;
      const ex = s[1];
      ctx.fillStyle = '#3d3b52';
      ctx.beginPath();
      ctx.moveTo(tx, h * 0.55);
      ctx.lineTo(bx, h * 0.575);
      ctx.lineTo(ex, h * 0.80);
      ctx.lineTo(ex, h * 0.765);
      ctx.fill();

      ctx.fillStyle = '#8a7060';
      ctx.beginPath();
      ctx.moveTo(tx, h * 0.55);
      ctx.lineTo(ex, h * 0.765);
      ctx.lineTo(ex, h * 0.775);
      ctx.lineTo(tx, h * 0.558);
      ctx.fill();

      ctx.strokeStyle = 'rgba(15,12,25,.5)';
      ctx.lineWidth = Math.max(1, scale);
      for (let i = 0; i < 26; i++) {
        const f = i / 26;
        const x = tx + (ex - tx) * f;
        const y = h * 0.56 + (h * 0.215) * f;
        ctx.strokeRect(x, y, 14 * scale * (1 - f * 0.5) * Math.sign(ex - tx || 1), (7 + f * 5) * scale);
      }
    });
  }

  // ---- Dây treo đèn lồng ----
  _hoianStringWire(ctx, x0, y0, x1, y1, sag, scale) {
    ctx.strokeStyle = 'rgba(40,20,20,.8)';
    ctx.lineWidth = Math.max(1, scale);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 + sag * 2 * scale, x1, y1);
    ctx.stroke();
  }

  // ---- Mây đêm trôi bồng bềnh ----
  _hoianDrawClouds(ctx, w, h, scale) {
    const t = this.animTimer || 0;
    const clouds = [
      [0.85, 0.14, 1.2, 'rgba(60,70,120,.85)'],
      [0.12, 0.27, 1.3, 'rgba(70,75,125,.7)'],
      [0.20, 0.43, 1.2, 'rgba(150,100,120,.5)'],
      [0.84, 0.43, 1.2, 'rgba(150,100,120,.5)']
    ];
    clouds.forEach((c, i) => {
      const cx = w * c[0] + Math.sin(t * 0.05 + i * 2) * 14 * scale;
      const cy = h * c[1];
      const s = c[2] * scale;
      ctx.fillStyle = c[3];
      ctx.beginPath();
      ctx.ellipse(cx, cy + 4 * s, 56 * s, 10 * s, 0, 0, Math.PI * 2);
      ctx.ellipse(cx - 20 * s, cy - 6 * s, 24 * s, 15 * s, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + 12 * s, cy - 12 * s, 28 * s, 18 * s, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // ---- Đèn trời (thiên đăng) bay lượn ----
  _hoianDrawSkyLanterns(ctx, w, h, scale) {
    const t = this.animTimer || 0;
    for (let i = 0; i < 34; i++) {
      const sp = 5 + this._hoianRnd(i + 3) * 9;
      const span = h * 0.58;
      const off = this._hoianRnd(i + 8) * span;
      const u = ((t * sp + off) % span) / span;
      const y = h * 0.56 - u * span - 6;
      const x = w * this._hoianRnd(i) + Math.sin(t * 0.5 + i) * 6 * scale;
      const s = (4 + this._hoianRnd(i + 20) * 7 + u * 3) * scale;
      const a = Math.min(1, u * 6, (1 - u) * 4) * 0.95;

      ctx.save();
      ctx.globalAlpha = a;
      const gl = ctx.createRadialGradient(x, y, 1, x, y, s * 3);
      gl.addColorStop(0, 'rgba(255,170,50,.55)');
      gl.addColorStop(1, 'rgba(255,150,40,0)');
      ctx.fillStyle = gl;
      ctx.beginPath();
      ctx.arc(x, y, s * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ff9a28';
      ctx.beginPath();
      ctx.moveTo(x - s * 0.8, y - s);
      ctx.lineTo(x + s * 0.8, y - s);
      ctx.lineTo(x + s * 0.55, y + s);
      ctx.lineTo(x - s * 0.55, y + s);
      ctx.fill();

      ctx.fillStyle = '#ffe9a0';
      ctx.beginPath();
      ctx.ellipse(x, y + s * 0.85, s * 0.5, s * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ---- Đèn lồng treo các nếp nhà ----
  _hoianDrawHouseLanterns(ctx, w, h, scale) {
    const houses = [
      { x: 70 * scale, bw: 80 * scale, top: h * 0.40, base: h * 0.585, seed: 1 },
      { x: 340 * scale, bw: 66 * scale, top: h * 0.42, base: h * 0.585, seed: 2 },
      { x: 0, bw: 90 * scale, top: h * 0.30, base: h * 0.63, seed: 3 },
      { x: 392 * scale, bw: 88 * scale, top: h * 0.29, base: h * 0.63, seed: 4 }
    ];
    houses.forEach(house => {
      const { x, bw, top, base, seed } = house;
      const my = top + (base - top) * 0.5;
      this._hoianLantern(ctx, x + bw * 0.25, my + 22 * scale, (8 + (seed % 2) * 2) * scale, seed, seed, scale);
      this._hoianLantern(ctx, x + bw * 0.78, my + 28 * scale, 7 * scale, seed + 1, seed * 2, scale);
      if (bw > 80 * scale) {
        this._hoianLantern(ctx, x + bw * 0.55, top + 80 * scale, 9 * scale, seed + 2, seed * 3, scale);
      }
    });
  }

  // ---- Đèn lồng Chùa Cầu ----
  _hoianDrawBridgeLanterns(ctx, w, h, scale) {
    [0.4, 0.46, 0.54, 0.6].forEach((u, i) => {
      this._hoianLantern(ctx, w * u, h * 0.452, 5 * scale, i % 2 ? 1 : 3, i, scale);
    });
  }

  // ---- Đèn lồng giăng qua phố ----
  _hoianDrawStringLanterns(ctx, w, h, scale) {
    const runLanterns = (x0, y0, x1, y1, n, sag, k) => {
      for (let i = 1; i < n; i++) {
        const u = i / n;
        const x = x0 + (x1 - x0) * u;
        const y = y0 + (y1 - y0) * u + sag * 4 * scale * u * (1 - u);
        this._hoianLantern(ctx, x, y + 6 * scale, 4.5 * scale, i + k, i * 1.3 + k, scale);
      }
    };
    runLanterns(70 * scale, h * 0.40, w * 0.27, h * 0.45, 7, 24, 0);
    runLanterns(w * 0.73, h * 0.45, 400 * scale, h * 0.40, 7, 22, 2);
  }

  // ---- Gợn sóng & phản chiếu mặt nước ----
  _hoianDrawWaterRipples(ctx, w, h, scale) {
    const t = this.animTimer || 0;
    for (let i = 0; i < 40; i++) {
      const y = h * (0.59 + this._hoianRnd(i + 70) * 0.4);
      const e = this._hoianEdge(y, h, w);
      const x = e[0] + this._hoianRnd(i + 90) * (e[1] - e[0]);
      ctx.strokeStyle = `rgba(255,190,110,${0.08 + 0.1 * Math.sin(t * 1.5 + i)})`;
      ctx.lineWidth = Math.max(0.8, scale * 0.9);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 10 * scale, y - 2 * scale, x + (22 + (y / h) * 20) * scale, y);
      ctx.stroke();
    }
  }

  // ---- Hoa đăng trôi trên Sông Hoài ----
  _hoianLotus(ctx, x, y, r, k, ph) {
    const t = this.animTimer || 0;
    const C = [
      ['#ff5a8e', '#ffd0e0'],
      ['#ffa530', '#ffe08a'],
      ['#ffd040', '#fff3b0']
    ][k % 3];
    y += Math.sin(t * 1.3 + ph) * r * 0.12;
    const fl = 0.75 + 0.25 * Math.sin(t * 5 + ph * 3);
    const gl = ctx.createRadialGradient(x, y + r * 0.4, 1, x, y + r * 0.4, r * 2.6);
    gl.addColorStop(0, `rgba(255,170,70,${0.5 * fl})`);
    gl.addColorStop(1, 'rgba(255,150,60,0)');
    ctx.fillStyle = gl;
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.6, r * 2.6, r * 1.4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2b6a3a';
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.45, r * 1.1, r * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = C[0];
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * r * 0.25, y + r * 0.4);
      ctx.quadraticCurveTo(x + i * r * 0.7, y - r * 0.4, x + i * r * 0.2, y - r * 0.8 + Math.abs(i) * r * 0.2);
      ctx.quadraticCurveTo(x + i * r * 0.05, y - r * 0.2, x + i * r * 0.25, y + r * 0.4);
      ctx.fill();
    }

    ctx.fillStyle = `rgba(255,245,190,${fl})`;
    ctx.beginPath();
    ctx.arc(x, y - r * 0.1, r * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  _hoianDrawLotusField(ctx, w, h, scale) {
    for (let i = 0; i < 84; i++) {
      const v = Math.pow(this._hoianRnd(i + 500), 1.4);
      const y = h * (0.595 + v * 0.40);
      const e = this._hoianEdge(y, h, w);
      const x = e[0] + 10 * scale + this._hoianRnd(i + 540) * (e[1] - e[0] - 20 * scale);
      this._hoianLotus(ctx, x, y, (2 + v * 8) * scale, i, i * 0.7);
    }
  }

  // ---- Thuyền nan chèo lướt trên sông ----
  _hoianBoat(ctx, x, y, s, ang, ph, small, scale) {
    const t = this.animTimer || 0;
    const S = Math.abs(s);
    const dir = Math.sign(s) || 1;
    ctx.save();
    ctx.translate(x, y + Math.sin(t * 1.1 + ph) * 2 * scale);
    ctx.rotate(ang + Math.sin(t * 0.9 + ph) * 0.015);
    ctx.scale(dir * S * 1.3, S * 1.3);

    // Bóng đổ trên mặt nước
    ctx.fillStyle = 'rgba(0,0,0,.3)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 78, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Thân thuyền nan gỗ
    ctx.fillStyle = '#5a3418';
    ctx.beginPath();
    ctx.moveTo(-78, -6);
    ctx.quadraticCurveTo(-45, 22, 30, 16);
    ctx.quadraticCurveTo(66, 10, 84, -22);
    ctx.quadraticCurveTo(30, -4, -78, -6);
    ctx.fill();

    ctx.strokeStyle = '#c28a50';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-78, -6);
    ctx.quadraticCurveTo(30, -4, 84, -22);
    ctx.stroke();

    // Người ngồi trong thuyền: [x, màu áo, có nón lá không?]
    [[-48, '#4a6a9a', 1], [-6, '#2a8a6a', 0], [34, '#a03a50', 0]].forEach((p, i) => {
      const bx = p[0];
      const by = -6 + (bx > 0 ? -1 : 0);
      ctx.fillStyle = p[1];
      ctx.beginPath();
      ctx.ellipse(bx, by - 8, 7, 11, i === 0 ? 0.1 : -0.15, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e0a878';
      ctx.beginPath();
      ctx.arc(bx, by - 24, 5, 0, Math.PI * 2);
      ctx.fill();

      if (p[2]) {
        // Nón lá
        ctx.fillStyle = '#e8c070';
        ctx.beginPath();
        ctx.moveTo(bx - 13, by - 24);
        ctx.lineTo(bx, by - 36);
        ctx.lineTo(bx + 13, by - 24);
        ctx.fill();
      } else {
        // Tóc đen
        ctx.fillStyle = '#151018';
        ctx.beginPath();
        ctx.arc(bx, by - 26, 5.4, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(bx - 5.4, by - 26, 2, 12);
      }
    });

    // Khay nến hoa đăng ấm áp trong thuyền
    const gl = ctx.createRadialGradient(10, -8, 1, 10, -8, 22);
    gl.addColorStop(0, 'rgba(255,180,70,.7)');
    gl.addColorStop(1, 'rgba(255,150,40,0)');
    ctx.fillStyle = gl;
    ctx.fillRect(-14, -30, 48, 44);
    ctx.fillStyle = '#ff8030';
    ctx.beginPath();
    ctx.arc(10, -8, 4, 0, Math.PI * 2);
    ctx.fill();

    // Mái chèo đung đưa
    ctx.strokeStyle = '#7a4a22';
    ctx.lineWidth = 2.2;
    const sw = Math.sin(t * 1.6 + ph) * 6;
    ctx.beginPath();
    ctx.moveTo(-38, -20);
    ctx.lineTo(-30 + sw, 26);
    ctx.stroke();

    ctx.restore();
  }

  _hoianDrawBoats(ctx, w, h, scale) {
    this._hoianBoat(ctx, w * 0.40, h * 0.845, 1.0 * scale, -0.05, 0, 0, scale);
    this._hoianBoat(ctx, w * 0.72, h * 0.685, -0.5 * scale, 0.03, 1.7, 1, scale);
  }

  // ---- Cành lá dương xỉ & cây cối tiền cảnh ----
  _hoianFrond(ctx, x, y, L, a, c) {
    ctx.strokeStyle = c;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const ex = x + Math.cos(a) * L;
    const ey = y + Math.sin(a) * L;
    ctx.quadraticCurveTo(x + Math.cos(a) * L * 0.5, y + Math.sin(a) * L * 0.5 - L * 0.25, ex, ey);
    ctx.stroke();

    ctx.lineWidth = 1.2;
    for (let i = 1; i < 9; i++) {
      const u = i / 9;
      const px = x + (ex - x) * u;
      const py = y + (ey - y) * u - Math.sin(u * Math.PI) * L * 0.18;
      const l = L * 0.22 * (1 - u * 0.6);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - l * 0.4, py + l * 0.9);
      ctx.moveTo(px, py);
      ctx.lineTo(px + l * 0.4, py - l * 0.8 + l * 0.9);
      ctx.stroke();
    }
  }

  _hoianDrawForeground(ctx, w, h, scale) {
    const t = this.animTimer || 0;
    ctx.save();

    // Dương xỉ / bụi cây hai góc bờ sông
    const ferns = [
      [0.02, 1.01, 80, '#0a3a30'],
      [0.10, 1.02, 70, '#0e4a34'],
      [0.00, 0.93, 60, '#0a2c2c'],
      [0.97, 1.01, 85, '#0a3a30'],
      [0.88, 1.02, 70, '#0e4a34'],
      [1.00, 0.92, 60, '#0a2c2c']
    ];
    ferns.forEach((f, j) => {
      for (let i = 0; i < 9; i++) {
        const a = -Math.PI + (i / 8) * Math.PI + Math.sin(t * 0.7 + i + j) * 0.04;
        this._hoianFrond(ctx, w * f[0], h * f[1], f[2] * scale * (0.8 + this._hoianRnd(i + j * 9) * 0.5), a, f[3]);
      }
    });

    // Cỏ nến đung đưa
    ctx.strokeStyle = '#3a2a1a';
    ctx.lineWidth = 2 * scale;
    [[0.16, 0.96], [0.20, 0.94], [0.80, 0.95], [0.84, 0.97]].forEach((c, i) => {
      const sw = Math.sin(t + i) * 2 * scale;
      ctx.beginPath();
      ctx.moveTo(w * c[0], h);
      ctx.lineTo(w * c[0] + sw, h * c[1]);
      ctx.stroke();
      ctx.fillStyle = '#6a3a1a';
      ctx.fillRect(w * c[0] + sw - 2 * scale, h * c[1] - 12 * scale, 4 * scale, 13 * scale);
    });

    // 4 hoa đăng lớn rực rỡ cận cảnh
    const bigLotus = [
      [0.30, 0.945, 12, 0],
      [0.55, 0.975, 15, 2],
      [0.76, 0.930, 11, 1],
      [0.44, 0.900,  9, 1]
    ];
    bigLotus.forEach((l, i) => {
      this._hoianLotus(ctx, w * l[0], h * l[1], l[2] * scale, l[3], i * 2.1);
    });

    // Vignette mềm mại bao quanh viền tranh
    const v = ctx.createRadialGradient(w / 2, h * 0.5, h * 0.35, w / 2, h * 0.5, h * 0.78);
    v.addColorStop(0, 'rgba(0,0,10,0)');
    v.addColorStop(1, 'rgba(0,0,20,.5)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);

    ctx.restore();
  }

  // ==========================================
  // PANEL 7: ĐÀ LẠT (Hồ Xuân Hương & Rừng Thông Thung Lũng)
  // CHUẨN 100% DEMO CANVAS MỚI NHẤT VỚI HỆ THỐNG MULTI-LAYER OFFCANVAS 60FPS
  // ==========================================
  _drawDaLat(ctx) {
    ctx.save();
    const w = this.width;
    const h = this.height;
    const t = (this.animTimer || 0) * 1000;  // Thời gian (ms) cho các chuyển động
    const px = this.dalatParallax || 0;      // -1..1: độ lệch chiều sâu theo chuột (mặc định 0)
    const scene = this._getDalatScene();     // Các lớp tranh được vẽ sẵn một lần rồi lưu lại
    const layer = (img, depth) => ctx.drawImage(img, -DALAT_PAD + px * depth, 0);

    // Co giãn khung 1600x1200 phủ vừa panel (cover) và cắt phần thừa
    const s = Math.max(w / DALAT_W, h / DALAT_H);
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.clip();
    ctx.translate((w - DALAT_W * s) / 2, (h - DALAT_H * s) / 2);
    ctx.scale(s, s);

    // 1. Bầu trời hoàng hôn tím hồng
    ctx.drawImage(scene.sky, -DALAT_PAD, 0);

    // 2. Mây núi trôi nhẹ, đàn chim cao nguyên
    this._drawDalatSoftClouds(ctx, scene.clouds, t, px);
    this._drawDalatBirds(ctx, scene.birds, t);

    // 3. Đồi xa, Hồ Xuân Hương phẳng lặng sương giăng
    layer(scene.far, 4);
    this._drawDalatMist(ctx, scene.fog, t, DALAT_HZ - 18, 6, 0.55, 1.6, 4);
    layer(scene.water, 4);
    this._drawLakeRipples(ctx, t);
    this._drawDalatMist(ctx, scene.fog, t, DALAT_HZ + 40, -8, 0.35, 1.3, 4);

    // 4. Rừng thông trùng điệp, tháp chuông và thủy tạ
    layer(scene.left, 8);
    layer(scene.right, 8);
    this._drawDalatMist(ctx, scene.fog, t, 600, 5, 0.5, 1.5, 4);
    this._drawDalatMist(ctx, scene.fog, t, 700, -6, 0.4, 1.8, 4);
    layer(scene.leftNear, 12);

    // 5. Đồi hoa cẩm tú cầu bạt ngàn
    layer(scene.meadowFar, 16);
    this._drawDalatMist(ctx, scene.fog, t, 820, 7, 0.35, 1.6, 4);
    layer(scene.meadow, 24);
    this._drawDalatCattails(ctx, scene.cats, t, px);

    // 6. Nhánh thông, dương xỉ, cỏ và hoa dại tiền cảnh
    layer(scene.fore, 34);

    // 7. Đom đóm phát sáng trên đồi hoa
    this._drawDalatFireflies(ctx, scene.flies, t, px);

    // 8. Viền tối nhẹ và tiêu đề
    this._drawDalatVignette(ctx);
    this._drawDalatTitle(ctx);

    ctx.restore();
  }

  // ==========================================
  // CÁC HÀM PHỤ TRỢ CHI TIẾT
  // ==========================================

  // Dựng toàn bộ các lớp tranh một lần duy nhất (thứ tự gọi quyết định số ngẫu nhiên, không đổi thứ tự)
  _getDalatScene() {
    if (this._dalatScene) return this._dalatScene;
    this._dalatSeed = 11;  // Hạt giống cố định để tranh luôn giống nhau
    const scene = {};

    scene.fog = this._makeDalatFogSprite();
    scene.sky = this._dalatLayer(g => this._drawDalatSkyLayer(g));
    scene.far = this._dalatLayer(g => this._drawDalatFarHills(g));
    scene.water = this._dalatLayer(g => this._drawDalatLakeLayer(g, scene.far));
    scene.left = this._dalatLayer(g => this._drawDalatLeftHills(g));
    scene.right = this._dalatLayer(g => this._drawDalatRightHills(g));
    scene.leftNear = this._dalatLayer(g => this._drawDalatNearPineHills(g));
    scene.meadowFar = this._dalatLayer(g => this._drawDalatFarMeadow(g));
    scene.meadow = this._dalatLayer(g => this._drawDalatHydrangeaHills(g));
    scene.fore = this._dalatLayer(g => this._drawDalatFoliages(g));

    // [rộng, cao, màu, x, y, tốc độ]
    scene.clouds = [
      [560, 190, '205,200,225', -20, 150, 6],
      [520, 170, '220,214,232', 330, 330, 4],
      [640, 200, '230,222,238', 1020, 40, 5],
      [560, 170, '226,218,236', 1000, 260, 3],
      [380, 120, '215,208,230', 700, 230, 7],
      [700, 140, '240,215,215', 520, 420, 2]
    ].map(([cw, ch, col, x, y, sp]) => ({ img: this._makeDalatCloudSprite(cw, ch, col), w: cw, x, y, sp }));

    scene.birds = Array.from({ length: 7 }, () => {
      const x = this._dalatRange(500, 1000);
      const y = this._dalatRange(330, 420);
      const z = this._dalatRange(.7, 1.4);
      const sp = this._dalatRange(6, 12);
      const ph = this._dalatRange(0, 6);
      return { x, y, z, sp, ph };
    });

    scene.flies = Array.from({ length: 26 }, () => {
      const x = this._dalatRange(100, 1500);
      const y = this._dalatRange(720, 1100);
      const ph = this._dalatRange(0, 6);
      const sz = this._dalatRange(.7, 1.3);
      return { x, y, ph, sz };
    });

    scene.cats = [[560, 230], [612, 190], [1060, 210], [1105, 250], [1142, 180], [340, 170]];
    this._dalatScene = scene;
    return scene;
  }

  // ---- Số ngẫu nhiên có hạt giống & hàm toán học ----
  _dalatRand() {
    this._dalatSeed = this._dalatSeed * 16807 % 2147483647;
    return this._dalatSeed / 2147483647;
  }

  _dalatRange(a, b) {
    return a + (b - a) * this._dalatRand();
  }

  _dalatSmooth(a, b, x) {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  _dalatGauss(x, c, s) {
    return Math.exp(-(((x - c) / s) ** 2));
  }

  // ---- Đường sống đồi (trả về độ cao y tại vị trí x) ----
  _dalatFarRidge(x) {
    return 600 + Math.sin(x * .005 + 1) * 30 + Math.sin(x * .013 + 2) * 14;
  }

  _dalatLeftRidge(x) {
    return 560 + this._dalatSmooth(-40, 560, x) * 210 + this._dalatSmooth(540, 760, x) * 500 + Math.sin(x * .02) * 6;
  }

  _dalatRightRidge(x) {
    return 1300 - this._dalatSmooth(760, 930, x) * 610 - this._dalatSmooth(1010, 1520, x) * 240;
  }

  _dalatRightShore(x) {
    return this._dalatRightRidge(x) + 16 + this._dalatSmooth(1000, 1350, x) * 900;
  }

  _dalatNearPineRidge(x) {
    return 700 + this._dalatSmooth(-40, 420, x) * 150 + this._dalatSmooth(400, 640, x) * 600;
  }

  _dalatMeadowFarRidge(x) {
    return 840 - 80 * this._dalatGauss(x, 420, 300) - 110 * this._dalatGauss(x, 1280, 330) + Math.sin(x * .012) * 5;
  }

  _dalatMeadowRidge(x) {
    return 890 - 100 * this._dalatGauss(x, 200, 300) - 90 * this._dalatGauss(x, 1350, 360) + Math.sin(x * .008 + 1) * 8;
  }

  // Màu hoa theo vị trí: xanh dương bên trái, tím giữa, hồng tím bên phải
  _dalatHue(x) {
    if (x < 500) return 218 + this._dalatRange(-8, 12);
    if (x < 1000) return 262 + this._dalatRange(-10, 10);
    return 295 + this._dalatRange(-15, 20);
  }

  // ---- Dụng cụ vẽ lớp ----
  _dalatLayer(draw) {
    const c = document.createElement('canvas');
    c.width = DALAT_W + DALAT_PAD * 2;
    c.height = DALAT_H;
    const g = c.getContext('2d');
    g.translate(DALAT_PAD, 0);
    draw(g);
    return c;
  }

  // Tô khối đồi giữa đường sống (trên) và đường đáy
  _dalatPoly(g, ridge, fill, bottom) {
    g.beginPath();
    for (let x = -DALAT_PAD; x <= DALAT_W + DALAT_PAD; x += 6) g.lineTo(x, ridge(x));
    for (let x = DALAT_W + DALAT_PAD; x >= -DALAT_PAD; x -= 6) g.lineTo(x, bottom ? bottom(x) : DALAT_H + 60);
    g.closePath();
    g.fillStyle = fill;
    g.fill();
  }

  // Một cây thông năm tầng
  _dalatPine(g, x, y, h) {
    const w = h * .32;
    for (let i = 0; i < 5; i++) {
      const top = y - h + i * h * .17;
      const bot = top + h * .34;
      const ww = w * (.35 + i * .17);
      g.beginPath();
      g.moveTo(x, top);
      g.lineTo(x + ww, bot);
      g.lineTo(x - ww, bot);
      g.fill();
    }
    g.fillRect(x - h * .02, y - h * .1, h * .04, h * .1 + 2);
  }

  // Một hàng thông rải dọc theo đường sống đồi
  _dalatForest(g, ridge, x0, x1, hMin, hMax, step, colors, dy, canPlant) {
    for (let x = x0; x < x1; x += step * this._dalatRange(.55, 1.45)) {
      const y = ridge(x) + dy + this._dalatRange(-5, 10);
      if (canPlant && !canPlant(x, y)) continue;
      g.fillStyle = colors[this._dalatRand() * colors.length | 0];
      this._dalatPine(g, x, y, this._dalatRange(hMin, hMax));
    }
  }

  // ---- Các lớp tranh tĩnh ----

  // Bầu trời hoàng hôn tím hồng, ánh hồng đào sát chân trời
  _drawDalatSkyLayer(g) {
    let gr = g.createLinearGradient(0, 0, 0, 700);
    gr.addColorStop(0, '#3a3560');
    gr.addColorStop(.35, '#58507e');
    gr.addColorStop(.65, '#b497a9');
    gr.addColorStop(.85, '#e6c3b6');
    gr.addColorStop(1, '#e9cdbf');
    g.fillStyle = gr;
    g.fillRect(-DALAT_PAD, 0, DALAT_W + DALAT_PAD * 2, DALAT_H);

    gr = g.createRadialGradient(900, 640, 10, 900, 640, 520);
    gr.addColorStop(0, 'rgba(255,214,190,.55)');
    gr.addColorStop(1, 'rgba(255,214,190,0)');
    g.fillStyle = gr;
    g.fillRect(-DALAT_PAD, 0, DALAT_W + DALAT_PAD * 2, DALAT_H);
  }

  // Dãy đồi thông xa nhất mờ trong sương
  _drawDalatFarHills(g) {
    const ridge = x => this._dalatFarRidge(x);
    const gr = g.createLinearGradient(0, 540, 0, 700);
    gr.addColorStop(0, '#8d95b2');
    gr.addColorStop(1, '#bdb7cf');
    this._dalatPoly(g, ridge, gr, () => DALAT_HZ + 40);
    this._dalatForest(g, ridge, -DALAT_PAD, DALAT_W + DALAT_PAD, 14, 30, 7, ['#7b86a5', '#707c9c'], 8);
    this._dalatForest(g, ridge, -DALAT_PAD, DALAT_W + DALAT_PAD, 18, 34, 9, ['#7f89a8'], 28);
  }

  // Mặt hồ Xuân Hương: bóng đồi xa và bóng thủy tạ in xuống nước
  _drawDalatLakeLayer(g, farHills) {
    g.save();
    g.beginPath();
    g.rect(-DALAT_PAD, DALAT_HZ, DALAT_W + DALAT_PAD * 2, DALAT_H);
    g.clip();

    let gr = g.createLinearGradient(0, DALAT_HZ, 0, 900);
    gr.addColorStop(0, '#a9a2bf');
    gr.addColorStop(.4, '#8085a6');
    gr.addColorStop(1, '#5a6286');
    g.fillStyle = gr;
    g.fillRect(-DALAT_PAD, DALAT_HZ, DALAT_W + DALAT_PAD * 2, DALAT_H);

    // Bóng đồi xa lật ngược
    g.save();
    g.globalAlpha = .32;
    g.translate(0, 2 * DALAT_HZ);
    g.scale(1, -1);
    g.drawImage(farHills, -DALAT_PAD, 0);
    g.restore();

    // Bóng thủy tạ lật ngược
    g.save();
    g.globalAlpha = .22;
    g.translate(0, 2 * 688 + 4);
    g.scale(1, -1);
    this._drawLakeGazebo(g, 972, 688);
    g.restore();

    // Phủ một lớp sương nước nhẹ
    gr = g.createLinearGradient(0, DALAT_HZ, 0, 900);
    gr.addColorStop(0, 'rgba(190,180,205,.25)');
    gr.addColorStop(1, 'rgba(90,98,134,.35)');
    g.fillStyle = gr;
    g.fillRect(-DALAT_PAD, DALAT_HZ, DALAT_W + DALAT_PAD * 2, DALAT_H);
    g.restore();
  }

  // Đồi thông bên trái, nhiều hàng cây xếp tầng
  _drawDalatLeftHills(g) {
    const ridge = x => this._dalatLeftRidge(x);
    this._dalatPoly(g, ridge, '#566a7c');
    for (const dy of [0, 40, 85]) {
      const colors = dy ? ['#47596c', '#3f5265'] : ['#4f6378', '#586c80'];
      this._dalatForest(g, ridge, -DALAT_PAD, 720, 50 + dy * .3, 95 + dy * .4, 16, colors, dy + 22);
    }
  }

  // Đồi bên phải: tháp chuông, thủy tạ trên mũi đất và rừng thông sẫm
  _drawDalatRightHills(g) {
    const ridge = x => this._dalatRightRidge(x);
    const shore = x => this._dalatRightShore(x);
    const gr = g.createLinearGradient(0, 450, 0, 900);
    gr.addColorStop(0, '#6b8676');
    gr.addColorStop(1, '#2b4a3d');

    g.beginPath();
    for (let x = -DALAT_PAD; x <= DALAT_W + DALAT_PAD; x += 6) g.lineTo(x, ridge(x));
    for (let x = DALAT_W + DALAT_PAD; x >= -DALAT_PAD; x -= 6) g.lineTo(x, shore(x));
    g.closePath();
    g.fillStyle = gr;
    g.fill();

    this._drawDalatBellTower(g, 1283, ridge(1283) + 8, 340);
    this._drawLakeGazebo(g, 972, 688);

    // Chỉ trồng thông trên phần đất liền, không trồng xuống nước
    const onLand = (x, y) => y < shore(x) - 4;
    for (const dy of [-6, 30, 70, 115]) {
      this._dalatForest(g, ridge, 990, DALAT_W + DALAT_PAD, 40 + dy * .3, 100 + dy * .4, 13, ['#2d4d45', '#27463f', '#355a4d'], dy, onLand);
    }
  }

  // Đồi thông sẫm màu gần bờ trái
  _drawDalatNearPineHills(g) {
    const ridge = x => this._dalatNearPineRidge(x);
    this._dalatPoly(g, ridge, '#2c4a45');
    for (const dy of [0, 60]) {
      this._dalatForest(g, ridge, -DALAT_PAD, 560, 90, 170, 22, ['#1f3d3a', '#264a42', '#193530'], dy + 30);
    }
  }

  // Đồi hoa phía xa: hàng nghìn chấm hoa pastel li ti
  _drawDalatFarMeadow(g) {
    const ridge = x => this._dalatMeadowFarRidge(x);
    const gr = g.createLinearGradient(0, 700, 0, 900);
    gr.addColorStop(0, '#7aa36a');
    gr.addColorStop(1, '#4f7f4f');
    this._dalatPoly(g, ridge, gr);

    for (let i = 0; i < 1400; i++) {
      const x = this._dalatRange(-DALAT_PAD, DALAT_W + DALAT_PAD);
      const t = this._dalatRand();
      const y = ridge(x) + 3 + t * 130;
      const r = 2.5 + t * 3.5;
      const hue = this._dalatHue(x);
      const sat = this._dalatRange(45, 70);
      const light = this._dalatRange(68, 86);
      g.fillStyle = `hsl(${hue},${sat}%,${light}%)`;
      g.beginPath();
      g.arc(x, y, r, 0, 7);
      g.fill();
    }
  }

  // Đồi hoa cẩm tú cầu tiền cảnh: các khóm hoa to dần về phía dưới
  _drawDalatHydrangeaHills(g) {
    const ridge = x => this._dalatMeadowRidge(x);
    const gr = g.createLinearGradient(0, 760, 0, DALAT_H);
    gr.addColorStop(0, '#6aa04f');
    gr.addColorStop(1, '#2a5636');
    this._dalatPoly(g, ridge, gr);

    const items = [];
    for (let i = 0; i < 130; i++) {
      const x = this._dalatRange(-40, DALAT_W + 40);
      const t = Math.pow(this._dalatRand(), 1.4);
      items.push([x, ridge(x) + 12 + t * (DALAT_H + 30 - ridge(x)), 12 + t * 46, t]);
    }
    items.sort((a, b) => a[1] - b[1]);  // Khóm ở xa vẽ trước, khóm ở gần vẽ sau

    for (const [x, y, r] of items) {
      const isWhite = this._dalatRand() < .12;
      let hue;
      if (isWhite) hue = 260;
      else if (this._dalatRand() < .22) hue = this._dalatHue(this._dalatRange(0, DALAT_W));
      else hue = this._dalatHue(x);
      this._drawDalatHydrangea(g, x, y, r, hue, isWhite);
    }
  }

  // Một khóm cẩm tú cầu tròn: lá dưới nền, hàng trăm cánh hoa nhỏ
  _drawDalatHydrangea(g, x, y, r, h, white) {
    g.fillStyle = '#2f5a35';
    for (let i = 0; i < 7; i++) {
      const cx = x + this._dalatRange(-1, 1) * r * 1.1;
      const cy = y + r * this._dalatRange(.3, .85);
      const rot = this._dalatRange(-.6, .6);
      g.beginPath();
      g.ellipse(cx, cy, r * .5, r * .25, rot, 0, 7);
      g.fill();
    }

    g.fillStyle = white ? 'hsl(260,20%,62%)' : `hsl(${h},45%,45%)`;
    g.beginPath();
    g.arc(x, y, r, 0, 7);
    g.fill();

    for (let i = 0, n = r * 1.7 | 0; i < n; i++) {
      const a = this._dalatRand() * 6.283;
      const d = Math.sqrt(this._dalatRand()) * r * .88;
      const fx = x + Math.cos(a) * d;
      const fy = y + Math.sin(a) * d * .9;
      const light = (white ? 78 : 58) + (-(fx - x) * .25 - (fy - y) * .35) / r * 18 + this._dalatRange(-5, 8);
      const hue = h + this._dalatRange(-10, 10);
      const sat = white ? this._dalatRange(15, 30) : this._dalatRange(50, 75);
      g.fillStyle = `hsl(${hue},${sat}%,${light}%)`;
      g.beginPath();
      g.arc(fx, fy, r * .2, 0, 7);
      g.fill();
      g.fillStyle = 'rgba(255,255,255,.4)';  // Điểm sáng trên từng cánh hoa
      g.beginPath();
      g.arc(fx - 1, fy - 1, r * .06, 0, 7);
      g.fill();
    }
  }

  // Nhánh thông, dương xỉ, cỏ dại và hoa nhỏ ở tiền cảnh
  _drawDalatFoliages(g) {
    const dark = ['#14291f', '#1d3d2b', '#0e1d16'];
    const fern = ['#234a2c', '#3f7a3b', '#173320'];

    // Nhánh thông sẫm rủ từ hai bên
    for (let i = 0; i < 34; i++) {
      let x = this._dalatRange(-50, 70);
      let y = this._dalatRange(430, 850);
      let len = this._dalatRange(150, 300);
      let ang = this._dalatRange(-.5, .4);
      let droop = this._dalatRange(.005, .025);
      this._dalatBranch(g, x, y, len, ang, droop, dark);

      x = this._dalatRange(DALAT_W - 60, DALAT_W + 50);
      y = this._dalatRange(520, 880);
      len = this._dalatRange(150, 300);
      ang = Math.PI + this._dalatRange(-.4, .5);
      droop = -this._dalatRange(.005, .025);
      this._dalatBranch(g, x, y, len, ang, droop, dark);
    }

    // Dương xỉ xòe nan quạt ở các góc đáy tranh
    for (const x of [40, 260, 430, 1230, 1420, 1580]) {
      for (let i = 0; i < 9; i++) {
        const len = this._dalatRange(150, 230);
        const droop = (i < 4 ? -1 : 1) * this._dalatRange(.012, .03);
        this._dalatBranch(g, x, DALAT_H + 10, len, -Math.PI / 2 + (i - 4) * .2, droop, fern);
      }
    }

    // Cỏ lá dài
    const grass = ['#264d2c', '#2f6535', '#1d3b26', '#4d8a44'];
    g.lineCap = 'round';
    for (let i = 0; i < 220; i++) {
      const x = this._dalatRange(-20, DALAT_W + 20);
      const h = this._dalatRange(40, 170);
      g.strokeStyle = grass[i % 4];
      g.lineWidth = this._dalatRange(2, 5);
      g.beginPath();
      g.moveTo(x, DALAT_H + 5);
      const cpx = x + this._dalatRange(-30, 30);
      const endX = x + this._dalatRange(-50, 50);
      g.quadraticCurveTo(cpx, DALAT_H - h * .6, endX, DALAT_H - h);
      g.stroke();
    }

    // Hoa dại năm cánh: hồng, trắng, cam
    const petals = ['#f08aa4', '#ffffff', '#f2a05a', '#f7c6d6'];
    for (let i = 0; i < 70; i++) {
      const x = this._dalatRange(0, DALAT_W);
      const y = this._dalatRange(1030, 1190);
      const r = this._dalatRange(5, 9);
      g.fillStyle = petals[i % 4];
      for (let k = 0; k < 5; k++) {
        g.beginPath();
        g.ellipse(x + Math.cos(k * 1.2566) * r * .9, y + Math.sin(k * 1.2566) * r * .9, r * .6, r * .4, k * 1.2566, 0, 7);
        g.fill();
      }
      g.fillStyle = '#f6d34a';
      g.beginPath();
      g.arc(x, y, r * .35, 0, 7);
      g.fill();
    }
  }

  // Một nhánh thông có kim lá (không save/restore: giữ lineCap bo tròn cho lớp cỏ phía sau)
  _dalatBranch(g, x, y, len, ang, droop, cols) {
    const n = len / 7 | 0;
    let a = ang;
    let px = x;
    let py = y;
    g.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const k = 1 - i / n;
      a += droop;
      const nx = px + Math.cos(a) * 7;
      const ny = py + Math.sin(a) * 7;

      g.strokeStyle = cols[0];
      g.lineWidth = 2 + k * 3;
      g.beginPath();
      g.moveTo(px, py);
      g.lineTo(nx, ny);
      g.stroke();

      g.lineWidth = 1.3;
      g.strokeStyle = cols[i % 3];
      g.beginPath();
      const needle = 8 + k * 22;
      for (let s = -1; s <= 1; s += 2) {
        for (let j = 0; j < 2; j++) {
          const na = a + s * (.8 + j * .35 + this._dalatRand() * .2);
          g.moveTo(nx, ny);
          g.lineTo(nx + Math.cos(na) * needle, ny + Math.sin(na) * needle);
        }
      }
      g.stroke();
      px = nx;
      py = ny;
    }
  }

  // Tháp chuông cổ gạch đỏ, mái chóp nhọn, đồng hồ tròn và thánh giá
  _drawDalatBellTower(ctx, x, by, th) {
    ctx.save();
    const w = 62;
    const top = by - th;

    // Gian nhà thấp phía sau tháp
    ctx.fillStyle = '#a58478';
    ctx.fillRect(x - w / 2 - 120, by - th * .2, 120, th * .2);
    ctx.fillStyle = '#7a4b40';
    ctx.beginPath();
    ctx.moveTo(x - w / 2 - 130, by - th * .2);
    ctx.lineTo(x - w / 2 - 60, by - th * .32);
    ctx.lineTo(x - w / 2, by - th * .2);
    ctx.fill();

    // Thân tháp có dải gạch
    const gr = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
    gr.addColorStop(0, '#b57560');
    gr.addColorStop(1, '#7b4a3d');
    ctx.fillStyle = gr;
    ctx.fillRect(x - w / 2, by - th * .66, w, th * .66);
    ctx.strokeStyle = 'rgba(70,30,25,.22)';
    ctx.lineWidth = 1;
    for (let y = by - th * .66; y < by; y += 7) {
      ctx.beginPath();
      ctx.moveTo(x - w / 2, y);
      ctx.lineTo(x + w / 2, y);
      ctx.stroke();
    }

    // Tầng chuông có ba ô cửa vòm
    const bt = by - th * .66;
    const bh = th * .13;
    const sb = bt - bh;
    ctx.fillStyle = '#9c5f4c';
    ctx.fillRect(x - w * .46, sb, w * .92, bh);
    ctx.fillStyle = '#3a1f1b';
    for (let i = 0; i < 3; i++) {
      const ax = x - w * .3 + i * w * .3;
      ctx.beginPath();
      ctx.moveTo(ax - 5, bt - 3);
      ctx.lineTo(ax - 5, bt - bh * .65);
      ctx.arc(ax, bt - bh * .65, 5, Math.PI, 0);
      ctx.lineTo(ax + 5, bt - 3);
      ctx.fill();
    }

    // Mái chóp nhọn và hai tháp nhỏ ở góc
    ctx.fillStyle = '#8a4838';
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x + w * .5, sb);
    ctx.lineTo(x - w * .5, sb);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,200,170,.2)';
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x - w * .5, sb);
    ctx.lineTo(x - w * .08, sb);
    ctx.fill();
    ctx.fillStyle = '#7a3f31';
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(x + s * w * .43, sb - th * .07);
      ctx.lineTo(x + s * w * .5, sb);
      ctx.lineTo(x + s * w * .36, sb);
      ctx.fill();
    }

    // Thánh giá trên đỉnh
    ctx.strokeStyle = '#5b3a30';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, top - 22);
    ctx.lineTo(x, top);
    ctx.moveTo(x - 6, top - 15);
    ctx.lineTo(x + 6, top - 15);
    ctx.stroke();

    // Đồng hồ tròn
    const cy = by - th * .36;
    ctx.fillStyle = '#efe6d8';
    ctx.beginPath();
    ctx.arc(x, cy, w * .2, 0, 7);
    ctx.fill();
    ctx.strokeStyle = '#4a2b25';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, cy);
    ctx.lineTo(x, cy - w * .13);
    ctx.moveTo(x, cy);
    ctx.lineTo(x + w * .1, cy + 2);
    ctx.stroke();

    // Hai khe sáng nhỏ trên thân tháp
    ctx.fillStyle = '#3a1f1b';
    for (let i = 0; i < 2; i++) ctx.fillRect(x - w * .3 + i * w * .5, by - th * .56, 5, th * .09);
    ctx.restore();
  }

  // Thủy tạ hóng mát ven hồ (x: tâm, y: mặt sàn)
  _drawLakeGazebo(ctx, x, y) {
    ctx.save();

    // Sàn và bốn cột
    ctx.fillStyle = '#4c3a33';
    ctx.fillRect(x - 50, y - 3, 100, 5);
    ctx.strokeStyle = '#5a4538';
    ctx.lineWidth = 2.5;
    for (const i of [-42, -14, 14, 42]) {
      ctx.beginPath();
      ctx.moveTo(x + i, y - 3);
      ctx.lineTo(x + i, y - 34);
      ctx.stroke();
    }

    // Lan can
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 46, y - 14);
    ctx.lineTo(x + 46, y - 14);
    ctx.stroke();

    // Mái chóp gỗ, nửa trái hắt sáng
    ctx.fillStyle = '#7d5d49';
    ctx.beginPath();
    ctx.moveTo(x, y - 64);
    ctx.lineTo(x + 66, y - 32);
    ctx.lineTo(x - 66, y - 32);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,225,190,.22)';
    ctx.beginPath();
    ctx.moveTo(x, y - 64);
    ctx.lineTo(x - 66, y - 32);
    ctx.lineTo(x, y - 32);
    ctx.fill();

    // Chân cọc cắm xuống nước
    ctx.strokeStyle = '#3d2e28';
    ctx.lineWidth = 2;
    for (let i = -40; i <= 40; i += 20) {
      ctx.beginPath();
      ctx.moveTo(x + i, y + 2);
      ctx.lineTo(x + i, y + 16);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Sprite sương mù: một dải elip mờ mềm
  _makeDalatFogSprite() {
    const c = document.createElement('canvas');
    c.width = 800;
    c.height = 200;
    const g = c.getContext('2d');
    g.translate(400, 100);
    g.scale(1, .25);
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, 400);
    gr.addColorStop(0, 'rgba(228,224,240,.8)');
    gr.addColorStop(.6, 'rgba(228,224,240,.3)');
    gr.addColorStop(1, 'rgba(228,224,240,0)');
    g.fillStyle = gr;
    g.fillRect(-400, -400, 800, 800);
    return c;
  }

  // Sprite một đám mây gồm nhiều cụm tròn mờ
  _makeDalatCloudSprite(w, h, col) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const g = c.getContext('2d');
    for (let i = 0; i < 32; i++) {
      const x = w * this._dalatRange(.1, .9);
      const k = Math.max(.35, 1 - Math.abs(x / w - .5) * 1.4);
      const r = h * this._dalatRange(.18, .4) * k;
      const y = h * .72 - r * this._dalatRange(.2, .9);
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, `rgba(${col},.55)`);
      gr.addColorStop(1, `rgba(${col},0)`);
      g.fillStyle = gr;
      g.beginPath();
      g.arc(x, y, r, 0, 7);
      g.fill();
    }
    return c;
  }

  // ---- Các hiệu ứng chuyển động (vẽ lại mỗi khung hình) ----

  // Dải sương mù lững lờ trôi (speed âm: trôi ngược chiều)
  _drawDalatMist(ctx, sprite, t, y, speed, alpha, scale, count) {
    ctx.save();
    const sw = 800 * scale;
    ctx.globalAlpha = alpha;
    for (let i = 0; i < count; i++) {
      const x = ((i * (DALAT_W + sw) / count + t * speed / 1000) % (DALAT_W + sw)) - sw;
      ctx.drawImage(sprite, x, y + Math.sin(i * 2 + t * .0002) * 8 - 100 * scale * .5, sw, 200 * scale * .5);
    }
    ctx.restore();
  }

  // Mây núi sớm mai trôi nhẹ
  _drawDalatSoftClouds(ctx, clouds, t, px) {
    for (const c of clouds) {
      const x = ((c.x + c.w + t * c.sp / 1000) % (DALAT_W + c.w)) - c.w;
      ctx.drawImage(c.img, x + px * 2, c.y);
    }
  }

  // Đàn chim bay vỗ cánh
  _drawDalatBirds(ctx, birds, t) {
    ctx.save();
    ctx.strokeStyle = 'rgba(62,52,96,.85)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    for (const b of birds) {
      const x = ((b.x + t * b.sp / 1000) % (DALAT_W + 80)) - 40;
      const y = b.y + Math.sin(t * .0008 + b.ph) * 8;
      const flap = Math.sin(t * .008 + b.ph) * 5 * b.z;
      const s = 10 * b.z;
      ctx.beginPath();
      ctx.moveTo(x - s, y - flap);
      ctx.quadraticCurveTo(x - s * .4, y - s * .5 - flap, x, y);
      ctx.quadraticCurveTo(x + s * .4, y - s * .5 - flap, x + s, y - flap);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Gợn sóng lấp lánh li ti trên mặt hồ
  _drawLakeRipples(ctx, t) {
    ctx.save();
    ctx.fillStyle = 'rgba(240,230,248,.2)';
    for (let i = 0; i < 45; i++) {
      const k = Math.pow(i / 45, 1.6);
      const y = DALAT_HZ + 12 + k * 190;
      const x = ((i * 137.5) % DALAT_W) + Math.sin(t * .0006 + i) * 30;
      ctx.fillRect(x, y, 60 + (i % 5) * 40, 1.2 + k * 1.5);
    }
    ctx.restore();
  }

  // Cây đuôi chồn đung đưa trong gió
  _drawDalatCattails(ctx, cats, t, px) {
    ctx.save();
    ctx.lineCap = 'round';
    cats.forEach(([x, h], i) => {
      const sway = Math.sin(t * .0012 + i) * 8;
      const bx = x + px * 28;
      const tipX = bx + sway;
      const tipY = DALAT_H - h;
      ctx.strokeStyle = '#3b5a2f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bx, DALAT_H + 5);
      ctx.quadraticCurveTo(bx + sway * .3, DALAT_H - h * .5, tipX, tipY);
      ctx.stroke();
      ctx.fillStyle = '#6b3f25';
      ctx.beginPath();
      ctx.ellipse(tipX + sway * .1, tipY - 6, 5, 20, sway * .02, 0, 7);
      ctx.fill();
    });
    ctx.restore();
  }

  // Đom đóm vàng phát sáng, nhấp nháy trên đồi hoa
  _drawDalatFireflies(ctx, flies, t, px) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (const f of flies) {
      const x = f.x + Math.sin(t * .0004 + f.ph) * 40 + px * 20;
      const y = f.y + Math.cos(t * .0006 + f.ph) * 25;
      const a = .55 + .45 * Math.sin(t * .003 + f.ph);
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 22 * f.sz);
      glow.addColorStop(0, `rgba(255,200,80,${a})`);
      glow.addColorStop(1, 'rgba(255,170,40,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, 22 * f.sz, 0, 7);
      ctx.fill();

      ctx.strokeStyle = `rgba(255,236,170,${a})`;
      ctx.lineWidth = 2;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(t * .0008 + f.ph);
      ctx.strokeRect(-5 * f.sz, -5 * f.sz, 10 * f.sz, 10 * f.sz);
      ctx.restore();
    }
    ctx.restore();
  }

  // Viền tối nhẹ quanh khung tranh
  _drawDalatVignette(ctx) {
    ctx.save();
    const v = ctx.createRadialGradient(DALAT_W / 2, DALAT_H / 2, DALAT_H * .45, DALAT_W / 2, DALAT_H / 2, DALAT_H * .95);
    v.addColorStop(0, 'rgba(10,8,30,0)');
    v.addColorStop(1, 'rgba(10,8,30,.4)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, DALAT_W, DALAT_H);
    ctx.restore();
  }

  // Tiêu đề ĐÀ LẠT phía trên tranh
  _drawDalatTitle(ctx) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(30,20,60,.6)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = 'rgba(255,243,236,.94)';
    try { ctx.letterSpacing = '10px'; } catch (e) {}
    ctx.font = '600 56px Lora,Georgia,serif';
    ctx.fillText('ĐÀ LẠT', DALAT_W / 2 + 5, 118);
    try { ctx.letterSpacing = '3px'; } catch (e) {}
    ctx.font = 'italic 22px Lora,Georgia,serif';
    ctx.fillText('Hồ Xuân Hương và thung lũng thông', DALAT_W / 2, 156);
    ctx.restore();
  }

  // PANEL 8: TP. HCM (Landmark 81 hoa sen neon, Bitexco & Đại lộ ánh sáng)
  // ==========================================

  _rnd(n) {
    const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return s - Math.floor(s);
  }

  // ---- Hình học dòng sông & cao tốc (đường cong Bezier) -------------------
  _segs() {
    const w = this.width;
    const h = this.height;
    const P = (x, y) => ({ x: w * x, y: h * y });
    return {
      L1: [P(0, 0.88), P(0.20, 0.82), P(0.30, 0.74), P(0.34, 0.66)],
      L2: [P(0.34, 0.66), P(0.37, 0.58), P(0.42, 0.53), P(0.50, 0.505)],
      R1: [P(0.56, 0.505), P(0.60, 0.54), P(0.54, 0.60), P(0.60, 0.66)],
      R2: [P(0.60, 0.66), P(0.68, 0.73), P(0.76, 0.76), P(0.80, 0.84)],
      F1: [P(1.03, 0.66), P(0.80, 0.68), P(0.86, 0.80), P(0.64, 0.84)],
      F2: [P(0.64, 0.84), P(0.50, 0.87), P(0.44, 0.93), P(0.28, 1.0)]
    };
  }

  _bez(s, t) {
    const u = 1 - t;
    const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
    return {
      x: a * s[0].x + b * s[1].x + c * s[2].x + d * s[3].x,
      y: a * s[0].y + b * s[1].y + c * s[2].y + d * s[3].y
    };
  }

  _bezTo(ctx, s) {
    ctx.bezierCurveTo(s[1].x, s[1].y, s[2].x, s[2].y, s[3].x, s[3].y);
  }

  _riverPath(ctx) {
    const S = this._segs();
    ctx.beginPath();
    ctx.moveTo(S.L1[0].x, S.L1[0].y);
    this._bezTo(ctx, S.L1);
    this._bezTo(ctx, S.L2);
    ctx.lineTo(S.R1[0].x, S.R1[0].y);
    this._bezTo(ctx, S.R1);
    this._bezTo(ctx, S.R2);
    ctx.lineTo(this.width * 0.72, this.height);
    ctx.lineTo(0, this.height);
    ctx.closePath();
  }

  // =========================================================================
  // PANEL: TP. HỒ CHÍ MINH
  // =========================================================================
  _drawHoChiMinh(ctx) {
    ctx.save();
    const w = this.width;
    const h = this.height;

    // 1. Bầu trời ban ngày Sài Gòn (xanh trong, hửng nắng ở chân trời)
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.52);
    sky.addColorStop(0, '#1e7fc4');
    sky.addColorStop(0.35, '#4ea6dc');
    sky.addColorStop(0.65, '#8fd0e6');
    sky.addColorStop(0.88, '#e2e2ce');
    sky.addColorStop(1, '#f4ecd6');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h * 0.52);

    // 2. Sao đêm & mây tím
    this._drawAtmosphereEffects(ctx);

    // 3. Quầng sáng đô thị ở chân trời
    this._drawCityGlow(ctx, h * 0.5);

    // 4. Đường chân trời xa dày đặc cao ốc
    this._drawFarSkyline(ctx, h * 0.5);

    // 5. Mặt đất đô thị
    const land = ctx.createLinearGradient(0, h * 0.5, 0, h);
    land.addColorStop(0, '#6d7f6a');
    land.addColorStop(0.4, '#556652');
    land.addColorStop(1, '#3f4c3e');
    ctx.fillStyle = land;
    ctx.fillRect(0, h * 0.5, w, h * 0.5);

    // 6. Cụm cao ốc hai bờ
    this._drawMidBlocks(ctx);

    // 7. Landmark 81 (bên trái)
    this._drawLandmark81(ctx, w * 0.25, h * 0.57);

    // 8. Bitexco, bãi đáp trực thăng & chùm đèn (bên phải)
    this._drawBitexco(ctx, w * 0.76, h * 0.585);

    // 9. Dòng sông Sài Gòn uốn lượn
    this._drawRiver(ctx);

    // 10. Bờ sông, đường dạo & đèn
    this._drawRiverBanks(ctx);

    // 11. Công viên bờ trái: búp sen neon, nhà vòm, rặng dừa
    this._drawLotusPark(ctx, w * 0.20, h * 0.655);

    // 12. Thuyền chở hàng & tàu du lịch
    this._drawBoat(ctx, w * 0.47, h * 0.585, 0.7, 'barge', 0.2);
    this._drawBoat(ctx, w * 0.44, h * 0.655, 0.9, 'tour', 1.4);
    this._drawBoat(ctx, w * 0.56, h * 0.705, 1.0, 'barge', 2.6);
    this._drawBoat(ctx, w * 0.31, h * 0.80, 1.2, 'tour', 3.8);
    this._drawBoat(ctx, w * 0.50, h * 0.79, 1.3, 'barge', 5.0);

    // 13. Cầu tàu gỗ
    this._drawPier(ctx, w * 0.235, h * 0.778);

    // 14. Cao tốc trên cao với dòng xe
    this._drawFlyover(ctx);

    // 15. Chợ Bến Thành (tiền cảnh phải)
    this._drawBenThanh(ctx, w * 0.745, h);

    // 16. Lan can neon, cọ tiền cảnh
    this._drawForeground(ctx, w, h);

    ctx.restore();
  }

  // =========================================================================
  // BỘ HÀM PHỤ TRỢ MỸ THUẬT CHI TIẾT
  // =========================================================================

  // Mây trắng & chim trời (bầu trời ban ngày)
  _drawAtmosphereEffects(ctx) {
    const w = this.width;
    const h = this.height;
    ctx.save();

    const clouds = [
      { y: 0.14, len: 170, spd: 0.07, a: 0.55 },
      { y: 0.26, len: 200, spd: 0.045, a: 0.42 },
      { y: 0.06, len: 130, spd: 0.1, a: 0.5 },
      { y: 0.35, len: 180, spd: 0.055, a: 0.34 }
    ];
    clouds.forEach((c, i) => {
      const cx = ((this.scrollX * c.spd * 3 + i * 170) % (w + c.len * 2)) - c.len;
      const cy = h * c.y;
      ctx.fillStyle = `rgba(255, 255, 255, ${c.a})`;
      ctx.beginPath();
      ctx.ellipse(cx, cy, c.len * 0.5, 11, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + c.len * 0.2, cy - 8, c.len * 0.3, 10, 0, 0, Math.PI * 2);
      ctx.ellipse(cx - c.len * 0.22, cy - 4, c.len * 0.26, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      // bóng mây nhẹ phía dưới
      ctx.fillStyle = 'rgba(180, 205, 220, 0.22)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 8, c.len * 0.42, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Vài chú chim liệng
    ctx.strokeStyle = 'rgba(70, 90, 105, 0.55)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 5; i++) {
      const bx = (this._rnd(i + 21) * w + this.animTimer * (12 + i * 3)) % (w + 60) - 30;
      const by = h * (0.14 + this._rnd(i + 55) * 0.18);
      const flap = Math.sin(this.animTimer * 6 + i) * 2.4;
      ctx.beginPath();
      ctx.moveTo(bx - 4, by + flap);
      ctx.quadraticCurveTo(bx, by - 2, bx, by);
      ctx.quadraticCurveTo(bx, by - 2, bx + 4, by + flap);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Quầng sáng đô thị phía chân trời
  _drawCityGlow(ctx, y) {
    ctx.save();
    const g = ctx.createLinearGradient(0, y - 120, 0, y + 6);
    g.addColorStop(0, 'rgba(255, 236, 200, 0)');
    g.addColorStop(0.7, 'rgba(255, 232, 190, 0.22)');
    g.addColorStop(1, 'rgba(255, 240, 205, 0.4)');
    ctx.fillStyle = g;
    ctx.fillRect(0, y - 120, this.width, 126);
    ctx.restore();
  }

  // Đường chân trời xa: hai lớp cao ốc kèm cửa sổ lấp lánh
  _drawFarSkyline(ctx, baseY) {
    const w = this.width;
    ctx.save();
    const layers = [
      { col: '#74879a', step: 11, min: 24, max: 96, seed: 5, win: 'rgba(228, 238, 245, 0.42)' },
      { col: '#5d6f80', step: 9, min: 16, max: 66, seed: 41, win: 'rgba(240, 240, 228, 0.45)' }
    ];
    layers.forEach((L, li) => {
      for (let x = -4, i = 0; x < w + 6; x += L.step, i++) {
        const r = this._rnd(i + L.seed);
        const bh = L.min + r * (L.max - L.min);
        const bw = L.step + 1 + this._rnd(i + L.seed + 7) * 3;
        ctx.fillStyle = L.col;
        ctx.fillRect(x, baseY - bh, bw, bh + 2);
        ctx.fillStyle = L.win;
        for (let wy = baseY - bh + 4; wy < baseY - 3; wy += 5) {
          for (let wx = x + 2; wx < x + bw - 2; wx += 3.6) {
            const k = this._rnd(wx * 3.1 + wy * 1.7 + li);
            if (k > 0.55) {
              const tw = k > 0.93 ? 0.4 + 0.6 * Math.abs(Math.sin(this.animTimer * 2 + wx)) : 1;
              ctx.globalAlpha = tw;
              ctx.fillRect(wx, wy, 1.4, 1.8);
            }
          }
        }
        ctx.globalAlpha = 1;
      }
    });

    // Đốm sáng đô thị mờ ảo (bokeh) sát chân trời
    for (let i = 0; i < 60; i++) {
      const bx = this._rnd(i + 301) * w;
      const by = baseY - 14 + this._rnd(i + 401) * 16;
      ctx.fillStyle = `rgba(255, ${160 + (i % 4) * 25}, 230, ${0.25 + this._rnd(i) * 0.35})`;
      ctx.beginPath();
      ctx.arc(bx, by, 0.9 + this._rnd(i + 9) * 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Một tòa nhà: thân, cửa sổ và viền neon tùy chọn
  _drawBlock(ctx, x, base, bw, bh, col, win, neon) {
    ctx.save();
    ctx.fillStyle = col;
    ctx.fillRect(x, base - bh, bw, bh);

    ctx.fillStyle = win;
    for (let wy = base - bh + 4; wy < base - 3; wy += 5) {
      for (let wx = x + 2.5; wx < x + bw - 3; wx += 4.5) {
        const k = this._rnd(wx * 5.3 + wy * 2.9);
        if (k > 0.38) {
          ctx.globalAlpha = k > 0.9 ? 0.45 + 0.55 * Math.abs(Math.sin(this.animTimer * 1.7 + wx + wy)) : 1;
          ctx.fillRect(wx, wy, 2.4, 2);
        }
      }
    }
    ctx.globalAlpha = 1;

    if (neon) {
      ctx.strokeStyle = neon;
      ctx.lineWidth = 1.1;
      ctx.shadowColor = neon;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.moveTo(x, base);
      ctx.lineTo(x, base - bh);
      ctx.lineTo(x + bw, base - bh);
      ctx.lineTo(x + bw, base);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Cụm cao ốc hai bên Landmark & Bitexco
  _drawMidBlocks(ctx) {
    const w = this.width;
    const h = this.height;
    const blocks = [
      // Bên trái Landmark
      { x: 0.00, b: 0.62, bw: 16, bh: 74, col: '#5d6f80', win: '#dfeef4', neon: null },
      { x: 0.04, b: 0.64, bw: 20, bh: 96, col: '#4f6070', win: '#f5ebd2', neon: null },
      { x: 0.095, b: 0.63, bw: 16, bh: 60, col: '#465666', win: '#dfeef4', neon: null },
      { x: 0.14, b: 0.60, bw: 22, bh: 112, col: '#62748a', win: '#e8f4f8', neon: null },
      // Giữa Landmark và sông
      { x: 0.31, b: 0.585, bw: 16, bh: 70, col: '#5a6b7c', win: '#f5ebd2', neon: null },
      { x: 0.345, b: 0.56, bw: 14, bh: 54, col: '#6b6273', win: '#efe0e6', neon: null },
      // Bờ phải, trái Bitexco
      { x: 0.55, b: 0.545, bw: 14, bh: 48, col: '#565060', win: '#f5ebd2', neon: null },
      { x: 0.585, b: 0.555, bw: 18, bh: 76, col: '#4c6274', win: '#dfeef4', neon: null },
      { x: 0.63, b: 0.565, bw: 16, bh: 56, col: '#66596e', win: '#efe0e6', neon: null },
      // Phải Bitexco
      { x: 0.825, b: 0.63, bw: 40, bh: 66, col: '#c2693c', win: '#f6ecd6', neon: null },
      { x: 0.915, b: 0.62, bw: 20, bh: 168, col: '#546678', win: '#e4f2f6', neon: null },
      { x: 0.955, b: 0.64, bw: 26, bh: 130, col: '#635673', win: '#efe0e6', neon: null },
      { x: 0.865, b: 0.655, bw: 22, bh: 42, col: '#d9895a', win: '#f8f2de', neon: null }
    ];
    blocks.forEach(b => {
      this._drawBlock(ctx, w * b.x, h * b.b, b.bw, b.bh, b.col, b.win, b.neon);
    });
  }

  // Landmark 81: tháp nhọn nhiều tầng, viền neon xanh ngọc
  _drawLandmark81(ctx, cx, baseY) {
    ctx.save();
    const t = this.animTimer;

    // Hào quang xanh quanh tháp
    const aura = ctx.createRadialGradient(cx, baseY - 170, 10, cx, baseY - 170, 190);
    aura.addColorStop(0, 'rgba(150, 205, 235, 0.16)');
    aura.addColorStop(1, 'rgba(40, 210, 255, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, baseY - 170, 190, 0, Math.PI * 2);
    ctx.fill();

    // Chân đế podium
    ctx.fillStyle = '#0a2c58';
    ctx.fillRect(cx - 36, baseY - 22, 72, 22);
    ctx.fillStyle = '#4fe3ff';
    for (let px = cx - 32; px < cx + 32; px += 6) ctx.fillRect(px, baseY - 16, 2.4, 8);

    const tiers = [
      { w: 52, h: 118 }, { w: 44, h: 84 }, { w: 36, h: 62 }, { w: 28, h: 50 }, { w: 20, h: 34 }
    ];
    let y = baseY - 22;
    tiers.forEach((tr, i) => {
      const x = cx - tr.w / 2;
      const top = y - tr.h;
      const g = ctx.createLinearGradient(x, 0, x + tr.w, 0);
      g.addColorStop(0, '#0a4a86');
      g.addColorStop(0.5, '#14b0e6');
      g.addColorStop(1, '#0a4a86');
      ctx.fillStyle = g;
      ctx.fillRect(x, top, tr.w, tr.h);

      // Khung kính: đường đứng & ngang
      ctx.strokeStyle = 'rgba(160, 245, 255, 0.5)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (let vx = x + 4; vx < x + tr.w; vx += 4) {
        ctx.moveTo(vx, top);
        ctx.lineTo(vx, y);
      }
      ctx.stroke();
      ctx.strokeStyle = 'rgba(8, 40, 96, 0.55)';
      ctx.beginPath();
      for (let fy = top + 4; fy < y; fy += 5) {
        ctx.moveTo(x, fy);
        ctx.lineTo(x + tr.w, fy);
      }
      ctx.stroke();

      // Cửa sổ lấp lánh
      for (let k = 0; k < 14; k++) {
        const wx = x + 2 + this._rnd(i * 31 + k) * (tr.w - 5);
        const wy = top + 2 + this._rnd(i * 17 + k + 50) * (tr.h - 5);
        ctx.fillStyle = `rgba(255, 238, 170, ${0.3 + 0.7 * Math.abs(Math.sin(t * 1.5 + k + i))})`;
        ctx.fillRect(wx, wy, 2, 2);
      }

      // Viền neon hai cạnh
      ctx.save();
      ctx.strokeStyle = '#dff4fb';
      ctx.lineWidth = 1.3;
      ctx.shadowColor = 'rgba(160, 205, 225, 0.5)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, top);
      ctx.lineTo(x + tr.w, top);
      ctx.lineTo(x + tr.w, y);
      ctx.stroke();
      ctx.restore();

      // Đèn hồng ở các góc mái tầng
      ctx.fillStyle = '#ff4fd8';
      ctx.fillRect(x - 1, top - 1, 3, 2);
      ctx.fillRect(x + tr.w - 2, top - 1, 3, 2);

      y = top;
    });

    // Kim tháp
    ctx.strokeStyle = '#8ef5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.lineTo(cx, y - 34);
    ctx.stroke();

    const blink = Math.sin(t * 4) > 0;
    ctx.save();
    ctx.fillStyle = blink ? '#ffffff' : '#ff3355';
    ctx.shadowColor = blink ? '#9ff' : '#ff3355';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(cx, y - 35, 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  // Bitexco: búp sen, đỉnh vát, bãi đáp trực thăng
  _drawBitexco(ctx, bx, base) {
    ctx.save();
    const t = this.animTimer;

    const body = () => {
      ctx.beginPath();
      ctx.moveTo(bx - 22, base);
      ctx.lineTo(bx - 22, base - 170);
      ctx.quadraticCurveTo(bx - 22, base - 215, bx - 8, base - 250);
      ctx.lineTo(bx + 6, base - 205);
      ctx.quadraticCurveTo(bx + 22, base - 170, bx + 24, base - 120);
      ctx.lineTo(bx + 22, base);
      ctx.closePath();
    };

    // Quầng sáng tím
    const aura = ctx.createRadialGradient(bx, base - 130, 8, bx, base - 130, 140);
    aura.addColorStop(0, 'rgba(150, 200, 230, 0.16)');
    aura.addColorStop(1, 'rgba(150, 200, 230, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(bx, base - 130, 140, 0, Math.PI * 2);
    ctx.fill();

    // Thân tháp
    const g = ctx.createLinearGradient(bx - 22, 0, bx + 24, 0);
    g.addColorStop(0, '#5f8fb8');
    g.addColorStop(0.55, '#7fb2cf');
    g.addColorStop(1, '#a8d4e4');
    body();
    ctx.fillStyle = g;
    ctx.fill();

    // Vân ngang kính
    ctx.save();
    body();
    ctx.clip();
    ctx.strokeStyle = 'rgba(240, 250, 255, 0.5)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let fy = base - 250; fy < base; fy += 5) {
      ctx.moveTo(bx - 24, fy);
      ctx.lineTo(bx + 26, fy);
    }
    ctx.stroke();
    ctx.restore();

    // Viền neon xanh bên trái & hồng bên phải
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#4ff3ff';
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(bx - 22, base);
    ctx.lineTo(bx - 22, base - 170);
    ctx.quadraticCurveTo(bx - 22, base - 215, bx - 8, base - 250);
    ctx.stroke();
    ctx.strokeStyle = '#e6f2f8';
    ctx.shadowColor = 'rgba(160, 205, 225, 0.5)';
    ctx.beginPath();
    ctx.moveTo(bx - 8, base - 250);
    ctx.lineTo(bx + 6, base - 205);
    ctx.quadraticCurveTo(bx + 22, base - 170, bx + 24, base - 120);
    ctx.lineTo(bx + 22, base);
    ctx.stroke();
    ctx.restore();

    // Đèn đỉnh nhọn
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(160, 205, 225, 0.45)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(bx - 8, base - 252, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Bãi đáp trực thăng
    const hx = bx + 35;
    const hy = base - 126;
    ctx.fillStyle = '#4a5f70';
    ctx.fillRect(bx + 22, hy, 30, 3);
    ctx.fillStyle = '#e8f6fb';
    ctx.fillRect(bx + 22, hy + 3, 30, 1);

    // Chùm đèn pha từ trực thăng
    const hover = Math.sin(t * 1.2) * 3;
    const hcx = hx + 4 + Math.sin(t * 0.5) * 6;
    const hcy = hy - 16 + hover;
    const beam = ctx.createLinearGradient(hcx, hcy, hcx - 70, hcy - 110);
    beam.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
    beam.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(hcx, hcy);
    ctx.lineTo(hcx - 78, hcy - 100);
    ctx.lineTo(hcx - 24, hcy - 118);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(hcx, hcy);
    ctx.lineTo(hcx - 10, hcy - 128);
    ctx.lineTo(hcx + 30, hcy - 112);
    ctx.closePath();
    ctx.globalAlpha = 0.6;
    ctx.fill();
    ctx.globalAlpha = 1;

    // Trực thăng
    ctx.fillStyle = '#3b4d5c';
    ctx.beginPath();
    ctx.ellipse(hcx, hcy, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(hcx - 16, hcy - 1.5, 10, 1.4);
    ctx.fillRect(hcx - 1, hcy - 5, 2, 3);
    const rotor = 6 + Math.abs(Math.cos(t * 28)) * 11;
    ctx.fillRect(hcx - rotor, hcy - 5.6, rotor * 2, 1);
    ctx.fillStyle = '#ff3355';
    ctx.fillRect(hcx - 17, hcy - 2.4, 1.6, 1.6);

    ctx.restore();
  }

  // Dòng sông Sài Gòn: nước tím, phản chiếu neon, gợn sóng
  _drawRiver(ctx) {
    const w = this.width;
    const h = this.height;
    ctx.save();
    this._riverPath(ctx);
    const g = ctx.createLinearGradient(0, h * 0.5, 0, h);
    g.addColorStop(0, '#8fc0d2');
    g.addColorStop(0.1, '#6ba7bd');
    g.addColorStop(0.35, '#4a869f');
    g.addColorStop(0.7, '#33677f');
    g.addColorStop(1, '#24506a');
    ctx.fillStyle = g;
    ctx.fill();

    ctx.clip();

    // Phản chiếu Landmark 81 (xanh ngọc)
    for (let i = 0; i < 14; i++) {
      const rx = w * 0.30 + i * 8;
      const sh = Math.sin(this.animTimer * 1.8 + i) * 4;
      const ga = ctx.createLinearGradient(0, h * 0.54, 0, h * 0.86);
      ga.addColorStop(0, 'rgba(210, 240, 250, 0.26)');
      ga.addColorStop(1, 'rgba(210, 240, 250, 0)');
      ctx.fillStyle = ga;
      ctx.fillRect(rx + sh, h * 0.54, 3, h * 0.32);
    }
    // Phản chiếu Bitexco & bờ phải (hồng tím)
    for (let i = 0; i < 12; i++) {
      const rx = w * 0.55 + i * 7;
      const sh = Math.sin(this.animTimer * 1.5 + i * 1.3) * 4;
      const ga = ctx.createLinearGradient(0, h * 0.54, 0, h * 0.80);
      ga.addColorStop(0, 'rgba(230, 240, 240, 0.18)');
      ga.addColorStop(1, 'rgba(230, 240, 240, 0)');
      ctx.fillStyle = ga;
      ctx.fillRect(rx + sh, h * 0.54, 3, h * 0.26);
    }

    // Gợn sóng ngang trôi
    ctx.strokeStyle = 'rgba(226, 244, 250, 0.22)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 26; i++) {
      const y = h * 0.52 + i * (h * 0.02);
      const len = 22 + this._rnd(i + 3) * 46;
      const x = ((this._rnd(i + 9) * w + this.animTimer * (5 + (i % 5) * 2)) % (w + 120)) - 60;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Đèn đường vàng dọc bờ
  _drawLamp(ctx, x, y, s) {
    ctx.save();
    const flick = 0.85 + Math.sin(this.animTimer * 4 + x) * 0.08;
    const g = ctx.createRadialGradient(x, y, 0.5, x, y, 10 * s);
    g.addColorStop(0, `rgba(255, 225, 140, ${0.95 * flick})`);
    g.addColorStop(0.4, `rgba(255, 190, 90, ${0.35 * flick})`);
    g.addColorStop(1, 'rgba(255, 160, 60, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, 10 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff4c8';
    ctx.beginPath();
    ctx.arc(x, y, 1.3 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Bờ sông: viền sáng, đường dạo hồng, đèn đường
  _drawRiverBanks(ctx) {
    const S = this._segs();
    ctx.save();

    const bankStroke = (segs, lw, col, dx) => {
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(segs[0][0].x + dx, segs[0][0].y);
      segs.forEach(sg => {
        ctx.bezierCurveTo(sg[1].x + dx, sg[1].y, sg[2].x + dx, sg[2].y, sg[3].x + dx, sg[3].y);
      });
      ctx.stroke();
    };

    // Bờ trái: đường dạo ánh hồng + viền
    bankStroke([S.L1, S.L2], 7, 'rgba(255, 150, 200, 0.25)', -8);
    bankStroke([S.L1, S.L2], 1.6, '#6f8fe8', 0);
    // Bờ phải
    bankStroke([S.R1, S.R2], 1.6, '#6f8fe8', 0);
    bankStroke([S.R1, S.R2], 5, 'rgba(255, 190, 120, 0.2)', 6);

    // Đèn đường hai bờ
    [S.L1, S.L2].forEach((sg, si) => {
      for (let i = 0; i < 5; i++) {
        const p = this._bez(sg, 0.08 + i * 0.2);
        this._drawLamp(ctx, p.x - 8, p.y - 2, 0.9 + (si === 0 ? 0.2 : 0));
      }
    });
    [S.R1, S.R2].forEach((sg, si) => {
      for (let i = 0; i < 5; i++) {
        const p = this._bez(sg, 0.08 + i * 0.2);
        this._drawLamp(ctx, p.x + 6, p.y - 2, 0.9 + (si === 1 ? 0.2 : 0));
      }
    });
    ctx.restore();
  }

  // Cây dừa / cọ
  _drawPalm(ctx, x, y, s, dir) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.strokeStyle = '#06241f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-dir * 4, -16, dir * 3, -34);
    ctx.stroke();

    const angles = [-2.7, -2.2, -1.7, -1.2, -0.7, -0.2, 0.3];
    angles.forEach((a, i) => {
      ctx.fillStyle = i % 2 === 0 ? '#0b3b34' : '#104d41';
      ctx.beginPath();
      ctx.moveTo(dir * 3, -34);
      const ex = dir * 3 + Math.cos(a) * 22;
      const ey = -34 + Math.sin(a) * 15 + 6;
      ctx.quadraticCurveTo((dir * 3 + ex) * 0.5, ey - 10, ex, ey);
      ctx.quadraticCurveTo((dir * 3 + ex) * 0.5, ey - 3, dir * 3, -34);
      ctx.fill();
    });
    ctx.restore();
  }

  // Búp sen neon, nhà vòm, rặng dừa bờ trái
  _drawLotusPark(ctx, lx, ly) {
    const w = this.width;
    const h = this.height;
    ctx.save();

    // Mảng cây xanh tối
    ctx.fillStyle = '#0a1f2c';
    ctx.beginPath();
    ctx.ellipse(lx + 6, ly + 12, 58, 20, -0.15, 0, Math.PI * 2);
    ctx.fill();

    // Nhà vòm kính ven sông (bên trái)
    const dx = w * 0.085;
    const dy = h * 0.745;
    ctx.fillStyle = '#1a3a7a';
    ctx.beginPath();
    ctx.ellipse(dx, dy + 6, 40, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f2a60';
    ctx.fillRect(dx - 40, dy - 4, 80, 10);
    ctx.fillStyle = '#9af6ff';
    for (let px = dx - 36; px < dx + 36; px += 5) ctx.fillRect(px, dy - 2, 2.2, 6);
    ctx.fillStyle = '#3a5cc0';
    ctx.beginPath();
    ctx.ellipse(dx, dy - 4, 40, 8, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#4ff3ff';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.ellipse(dx, dy - 4, 40, 8, 0, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Rặng dừa
    this._drawPalm(ctx, lx - 38, ly + 22, 1.0, 1);
    this._drawPalm(ctx, lx + 44, ly + 14, 0.9, -1);
    this._drawPalm(ctx, lx + 64, ly + 24, 1.1, 1);
    this._drawPalm(ctx, lx - 18, ly + 34, 0.8, -1);

    // Búp sen neon hồng (nhịp thở)
    const pulse = 0.8 + Math.sin(this.animTimer * 2.4) * 0.2;
    const petals = [
      { a: -0.9, s: 34 }, { a: 0.9, s: 34 },
      { a: -0.45, s: 42 }, { a: 0.45, s: 42 },
      { a: 0, s: 50 }
    ];
    // Hào quang
    const lg = ctx.createRadialGradient(lx, ly - 14, 4, lx, ly - 14, 56);
    lg.addColorStop(0, `rgba(255, 90, 210, ${0.35 * pulse})`);
    lg.addColorStop(1, 'rgba(255, 90, 210, 0)');
    ctx.fillStyle = lg;
    ctx.beginPath();
    ctx.arc(lx, ly - 14, 56, 0, Math.PI * 2);
    ctx.fill();

    petals.forEach(p => {
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(p.a);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-p.s * 0.38, -p.s * 0.3, -p.s * 0.3, -p.s * 0.8, 0, -p.s);
      ctx.bezierCurveTo(p.s * 0.3, -p.s * 0.8, p.s * 0.38, -p.s * 0.3, 0, 0);
      ctx.fillStyle = 'rgba(120, 20, 110, 0.35)';
      ctx.fill();
      ctx.strokeStyle = '#ff6ee0';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = '#ff2fd0';
      ctx.shadowBlur = 10 * pulse;
      ctx.stroke();
      ctx.strokeStyle = '#ffe6fa';
      ctx.lineWidth = 0.8;
      ctx.shadowBlur = 0;
      ctx.stroke();
      ctx.restore();
    });
    ctx.restore();
  }

  // Thuyền chở hàng và tàu du lịch
  _drawBoat(ctx, x, y, s, type, phase) {
    ctx.save();
    const t = this.animTimer;
    y += Math.sin(t * 1.8 + phase) * 1.4;
    x += Math.sin(t * 0.12 + phase) * 10;

    // Vệt sáng phản chiếu dưới nước
    const rg = ctx.createLinearGradient(0, y + 4 * s, 0, y + 22 * s);
    rg.addColorStop(0, type === 'tour' ? 'rgba(255, 220, 150, 0.35)' : 'rgba(255, 180, 120, 0.2)');
    rg.addColorStop(1, 'rgba(255, 180, 120, 0)');
    ctx.fillStyle = rg;
    ctx.fillRect(x - 12 * s, y + 4 * s, 24 * s, 18 * s);

    // Vệt nước
    ctx.strokeStyle = 'rgba(230, 210, 255, 0.28)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 18 * s, y + 5 * s);
    ctx.lineTo(x - 34 * s, y + 9 * s);
    ctx.moveTo(x - 18 * s, y + 7 * s);
    ctx.lineTo(x - 30 * s, y + 12 * s);
    ctx.stroke();

    if (type === 'barge') {
      ctx.fillStyle = '#2e2020';
      ctx.beginPath();
      ctx.moveTo(x - 18 * s, y);
      ctx.lineTo(x + 20 * s, y);
      ctx.lineTo(x + 16 * s, y + 6 * s);
      ctx.lineTo(x - 15 * s, y + 6 * s);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#8a6a3a';
      ctx.beginPath();
      ctx.ellipse(x + 2 * s, y - 1 * s, 14 * s, 4.5 * s, 0, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#d8d0c8';
      ctx.fillRect(x - 17 * s, y - 6 * s, 7 * s, 6 * s);
      ctx.fillStyle = '#ffd166';
      ctx.fillRect(x - 15 * s, y - 4 * s, 2.4 * s, 2 * s);
    } else {
      ctx.fillStyle = '#2a2a52';
      ctx.fillRect(x - 17 * s, y, 34 * s, 5 * s);
      ctx.fillStyle = '#f0ecf8';
      ctx.fillRect(x - 15 * s, y - 6 * s, 30 * s, 6 * s);
      ctx.fillStyle = '#ffd166';
      for (let k = 0; k < 6; k++) ctx.fillRect(x - 13 * s + k * 4.6 * s, y - 4.4 * s, 2.8 * s, 2.4 * s);
      ctx.fillStyle = '#25a5a5';
      ctx.fillRect(x - 16 * s, y - 8.5 * s, 32 * s, 2.6 * s);
    }

    // Đèn đuôi
    ctx.fillStyle = '#ff3355';
    ctx.beginPath();
    ctx.arc(x - 19 * s, y + 1 * s, 1.1 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Cầu tàu gỗ ven sông
  _drawPier(ctx, px, py) {
    ctx.save();
    ctx.lineCap = 'square';
    ctx.strokeStyle = '#7a5a40';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + 52, py + 12);
    ctx.moveTo(px + 22, py + 6);
    ctx.lineTo(px + 40, py - 10);
    ctx.moveTo(px + 52, py + 12);
    ctx.lineTo(px + 74, py - 2);
    ctx.moveTo(px + 52, py + 12);
    ctx.lineTo(px + 66, py + 26);
    ctx.stroke();
    ctx.strokeStyle = '#c8a070';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px, py - 3);
    ctx.lineTo(px + 52, py + 9);
    ctx.moveTo(px + 52, py + 9);
    ctx.lineTo(px + 74, py - 5);
    ctx.stroke();
    ctx.restore();
  }

  // Cao tốc trên cao uốn lượn, xe chạy đèn sáng
  _drawFlyover(ctx) {
    const S = this._segs();
    ctx.save();

    const strokePath = (lw, col, off) => {
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(S.F1[0].x, S.F1[0].y + off);
      ctx.bezierCurveTo(S.F1[1].x, S.F1[1].y + off, S.F1[2].x, S.F1[2].y + off, S.F1[3].x, S.F1[3].y + off);
      ctx.bezierCurveTo(S.F2[1].x, S.F2[1].y + off, S.F2[2].x, S.F2[2].y + off, S.F2[3].x, S.F2[3].y + off);
      ctx.stroke();
    };

    strokePath(22, 'rgba(6, 4, 30, 0.45)', 6);   // bóng đổ
    ctx.save();
    ctx.shadowColor = '#5a8aff';
    ctx.shadowBlur = 8;
    strokePath(19, '#4a6fd0', 0);                // thành cầu sáng
    ctx.restore();
    strokePath(16, '#23214c', 0);                // mặt đường
    ctx.setLineDash([6, 8]);
    strokePath(1, 'rgba(255, 230, 160, 0.5)', 0);
    ctx.setLineDash([]);

    // Dòng xe: hai làn ngược chiều
    const pt = (u) => (u < 0.5 ? this._bez(S.F1, u * 2) : this._bez(S.F2, (u - 0.5) * 2));
    const cars = 12;
    for (let lane = 0; lane < 2; lane++) {
      for (let i = 0; i < cars; i++) {
        const sp = lane === 0 ? 0.045 : -0.035;
        let u = (this.animTimer * sp + i / cars + lane * 0.037) % 1;
        if (u < 0) u += 1;
        const p = pt(u);
        const p2 = pt(Math.min(0.999, u + 0.01));
        const dx = p2.x - p.x;
        const dy = p2.y - p.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const off = lane === 0 ? -3.2 : 3.2;
        const cx = p.x + nx * off;
        const cy = p.y + ny * off;
        const headlight = lane === 0;
        ctx.save();
        ctx.fillStyle = headlight ? '#fff2b0' : '#ff3b4a';
        ctx.shadowColor = headlight ? '#ffe680' : '#ff2030';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Đèn đường dọc cao tốc
    for (let i = 0; i < 7; i++) {
      const p = pt(0.03 + i * 0.15);
      this._drawLamp(ctx, p.x, p.y - 12, 0.9);
    }
    ctx.restore();
  }

  // Chợ Bến Thành: tháp đồng hồ, mái ngói, mái vòm sáng đèn
  _drawBenThanh(ctx, cx, groundY) {
    const h = this.height;
    ctx.save();
    const t = this.animTimer;

    // Hào quang ấm
    const warm = ctx.createRadialGradient(cx, h * 0.93, 10, cx, h * 0.93, 150);
    warm.addColorStop(0, 'rgba(255, 150, 60, 0.4)');
    warm.addColorStop(1, 'rgba(255, 120, 40, 0)');
    ctx.fillStyle = warm;
    ctx.beginPath();
    ctx.arc(cx, h * 0.93, 150, 0, Math.PI * 2);
    ctx.fill();

    // Cánh trái & phải
    const wing = (x0, x1) => {
      ctx.fillStyle = '#c0391f';
      ctx.beginPath();
      ctx.moveTo(x0, h * 0.945);
      ctx.lineTo((x0 + x1) / 2, h * 0.915);
      ctx.lineTo(x1, h * 0.945);
      ctx.closePath();
      ctx.fill();
      const wg = ctx.createLinearGradient(0, h * 0.945, 0, groundY);
      wg.addColorStop(0, '#ffb04a');
      wg.addColorStop(1, '#ff8a3a');
      ctx.fillStyle = wg;
      ctx.fillRect(x0, h * 0.945, x1 - x0, groundY - h * 0.945);
      ctx.fillStyle = '#7a1e1e';
      for (let ax = x0 + 6; ax < x1 - 8; ax += 16) {
        ctx.beginPath();
        ctx.arc(ax + 5, groundY - 22, 6, Math.PI, Math.PI * 2);
        ctx.lineTo(ax + 11, groundY);
        ctx.lineTo(ax - 1, groundY);
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = '#ff5a3a';
      for (let ax = x0 + 6; ax < x1 - 8; ax += 16) ctx.fillRect(ax + 1, groundY - 20, 8, 3);
    };
    wing(cx - 118, cx - 52);
    wing(cx + 52, cx + 118);

    // Sảnh chính
    const hg = ctx.createLinearGradient(0, h * 0.905, 0, groundY);
    hg.addColorStop(0, '#ffc050');
    hg.addColorStop(1, '#f08a2c');
    ctx.fillStyle = hg;
    ctx.fillRect(cx - 54, h * 0.915, 108, groundY - h * 0.915);
    ctx.fillStyle = '#b8321c';
    ctx.beginPath();
    ctx.moveTo(cx - 62, h * 0.918);
    ctx.lineTo(cx - 40, h * 0.898);
    ctx.lineTo(cx + 40, h * 0.898);
    ctx.lineTo(cx + 62, h * 0.918);
    ctx.closePath();
    ctx.fill();

    // Cửa sổ & cổng vòm sảnh
    ctx.fillStyle = '#ffe9a8';
    ctx.fillRect(cx - 40, h * 0.935, 9, 11);
    ctx.fillRect(cx + 31, h * 0.935, 9, 11);
    ctx.fillStyle = '#5a1a14';
    ctx.beginPath();
    ctx.arc(cx, groundY - 26, 12, Math.PI, Math.PI * 2);
    ctx.lineTo(cx + 12, groundY);
    ctx.lineTo(cx - 12, groundY);
    ctx.closePath();
    ctx.fill();

    // Tháp đồng hồ
    const tg = ctx.createLinearGradient(cx - 16, 0, cx + 16, 0);
    tg.addColorStop(0, '#e8892a');
    tg.addColorStop(0.5, '#ffb64a');
    tg.addColorStop(1, '#e8892a');
    ctx.fillStyle = tg;
    ctx.fillRect(cx - 16, h * 0.845, 32, h * 0.07);

    // Mái chuông nhiều tầng
    ctx.fillStyle = '#c8401a';
    ctx.beginPath();
    ctx.moveTo(cx - 26, h * 0.846);
    ctx.quadraticCurveTo(cx - 12, h * 0.838, cx, h * 0.816);
    ctx.quadraticCurveTo(cx + 12, h * 0.838, cx + 26, h * 0.846);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#e0562a';
    ctx.beginPath();
    ctx.moveTo(cx - 14, h * 0.826);
    ctx.quadraticCurveTo(cx - 6, h * 0.82, cx, h * 0.805);
    ctx.quadraticCurveTo(cx + 6, h * 0.82, cx + 14, h * 0.826);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.805);
    ctx.lineTo(cx, h * 0.788);
    ctx.stroke();
    ctx.save();
    ctx.fillStyle = '#ffe9a8';
    ctx.shadowColor = '#ffd166';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(cx, h * 0.787, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Đồng hồ
    const ccy = h * 0.875;
    ctx.fillStyle = '#fdfdf5';
    ctx.beginPath();
    ctx.arc(cx, ccy, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#6a3a1a';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.strokeStyle = '#2a1a14';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(cx, ccy);
    ctx.lineTo(cx + Math.cos(t * 0.2 - 1.57) * 6, ccy + Math.sin(t * 0.2 - 1.57) * 6);
    ctx.moveTo(cx, ccy);
    ctx.lineTo(cx + Math.cos(t * 0.02 - 0.5) * 4, ccy + Math.sin(t * 0.02 - 0.5) * 4);
    ctx.stroke();

    // Bảng tên
    ctx.fillStyle = '#7a1e10';
    ctx.font = 'bold 6.5px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CHỢ BẾN THÀNH', cx, h * 0.909);

    // Đám đông trước chợ
    for (let i = 0; i < 24; i++) {
      const px = cx - 108 + this._rnd(i + 500) * 216 + Math.sin(t * 0.6 + i) * 1.5;
      const py = h * 0.978 + this._rnd(i + 600) * h * 0.016;
      const cols = ['#ff5a5a', '#4aa8ff', '#ffe066', '#e8e8f0', '#ff8ad0'];
      ctx.fillStyle = cols[i % cols.length];
      ctx.fillRect(px - 1, py, 2.2, 4.2);
      ctx.fillStyle = '#e0b090';
      ctx.beginPath();
      ctx.arc(px, py - 1.4, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Lan can neon, cọ tiền cảnh, đốm sáng
  _drawForeground(ctx, w, h) {
    ctx.save();

    // Sàn đi bộ phía dưới trái
    ctx.fillStyle = '#18124a';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.905);
    ctx.lineTo(w * 0.43, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Lan can neon
    const rail = (dy, col, lw) => {
      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.shadowColor = col;
      ctx.shadowBlur = 7;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.885 + dy);
      ctx.lineTo(w * 0.43, h * 0.985 + dy);
      ctx.stroke();
      ctx.restore();
    };
    rail(0, '#4fe3ff', 2);
    rail(9, '#ff4fd8', 1.6);

    ctx.fillStyle = '#7a8fe8';
    for (let i = 0; i <= 9; i++) {
      const px = (w * 0.43 * i) / 9;
      const py = h * 0.885 + ((h * 0.1) * i) / 9;
      ctx.fillRect(px - 1.2, py, 2.4, 14);
    }

    // Cột neo
    [[w * 0.30, h * 0.945], [w * 0.37, h * 0.965]].forEach(([bx, by], i) => {
      ctx.fillStyle = '#3a3a78';
      ctx.fillRect(bx - 5, by - 12, 10, 14);
      ctx.fillStyle = i === 0 ? '#ff6a8a' : '#c8b0ff';
      ctx.beginPath();
      ctx.ellipse(bx, by - 12, 5, 2, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Cọ tiền cảnh
    this._drawPalm(ctx, w * 0.04, h * 0.93, 2.3, 1);
    this._drawPalm(ctx, w * 0.13, h * 0.98, 1.8, -1);
    this._drawPalm(ctx, w * 0.975, h * 0.93, 2.1, -1);
    this._drawPalm(ctx, w * 0.90, h * 0.98, 1.6, 1);

    // Đốm sáng lung linh
    for (let i = 0; i < 18; i++) {
      const fx = this._rnd(i + 700) * w;
      const fy = h * (0.52 + this._rnd(i + 800) * 0.4);
      const a = 0.15 + 0.5 * Math.abs(Math.sin(this.animTimer * 1.3 + i * 2.1));
      ctx.fillStyle = `rgba(255, 220, 250, ${a})`;
      ctx.fillRect(fx - 1, fy, 2, 0.8);
      ctx.fillRect(fx - 0.4, fy - 1, 0.8, 2);
    }
    ctx.restore();
  }

  _drawMienTayLegacy(ctx) {
    ctx.save();

    // 1. Tropical River Morning Sky
    const sky = ctx.createLinearGradient(0, 0, 0, this.height * 0.55);
    sky.addColorStop(0, '#0f2935');
    sky.addColorStop(0.5, '#2b635e');
    sky.addColorStop(1, '#81aba3');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height * 0.55);

    // 2. CẦU CẦN THƠ (Cable-Stayed Bridge in Far Distance)
    const bY = 280;
    const pylonX = this.width * 0.5;

    // Bridge Deck
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, bY, this.width, 6);

    // Twin Inverted-Y Pylons (Trụ tháp chữ Y ngược)
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4.0;
    ctx.beginPath();
    // Left leg
    ctx.moveTo(pylonX - 60, bY);
    ctx.lineTo(pylonX - 45, bY - 80);
    // Right leg
    ctx.moveTo(pylonX - 30, bY);
    ctx.lineTo(pylonX - 45, bY - 80);
    // Mast top
    ctx.lineTo(pylonX - 45, bY - 110);
    ctx.stroke();

    // Right pylon
    ctx.beginPath();
    ctx.moveTo(pylonX + 30, bY);
    ctx.lineTo(pylonX + 45, bY - 80);
    ctx.moveTo(pylonX + 60, bY);
    ctx.lineTo(pylonX + 45, bY - 80);
    ctx.lineTo(pylonX + 45, bY - 110);
    ctx.stroke();

    // Fan-Shaped Stay Cables (Dây văng rẻ quạt)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 1.0;
    for (let c = 1; c <= 6; c++) {
      ctx.beginPath();
      // From left pylon
      ctx.moveTo(pylonX - 45, bY - 80 - c * 4);
      ctx.lineTo(pylonX - 45 - c * 22, bY);
      ctx.moveTo(pylonX - 45, bY - 80 - c * 4);
      ctx.lineTo(pylonX - 45 + c * 14, bY);
      // From right pylon
      ctx.moveTo(pylonX + 45, bY - 80 - c * 4);
      ctx.lineTo(pylonX + 45 - c * 14, bY);
      ctx.moveTo(pylonX + 45, bY - 80 - c * 4);
      ctx.lineTo(pylonX + 45 + c * 22, bY);
      ctx.stroke();
    }

    // 3. Tiền Giang & Hậu Giang River Water
    const riverY = bY + 16;
    const rivGrad = ctx.createLinearGradient(0, riverY, 0, this.height);
    rivGrad.addColorStop(0, '#356658');
    rivGrad.addColorStop(0.6, '#1e4237');
    rivGrad.addColorStop(1, '#0e241d');
    ctx.fillStyle = rivGrad;
    ctx.fillRect(0, riverY, this.width, this.height - riverY);

    // 4. Rặng Dừa Nước 2 Bên Bờ Sông (Dense Tropical Coconut Palms)
    this._drawPalmGroves(ctx, 0, riverY, 1);
    this._drawPalmGroves(ctx, this.width, riverY, -1);

    // 5. CHỢ NỔI CÁI RĂNG (Floating Market Sampans Loaded with Tropical Fruits)
    const boats = [
      { x: 100, y: 440, fruit: '#ff5400', fruitName: 'Cam' },
      { x: 280, y: 430, fruit: '#2d6a4f', fruitName: 'Dưa hấu' },
      { x: 190, y: 480, fruit: '#ffd13b', fruitName: 'Xoài' },
      { x: 80,  y: 530, fruit: '#e07a5f', fruitName: 'Đu đủ' },
      { x: 310, y: 520, fruit: '#ffd166', fruitName: 'Khóm' },
      { x: 160, y: 580, fruit: '#52b788', fruitName: 'Dưa hấu' },
      { x: 260, y: 590, fruit: '#ff0054', fruitName: 'Thanh long' }
    ];

    boats.forEach((b, bi) => {
      const bob = Math.sin(this.animTimer * 3 + bi) * 4;
      const bx = b.x;
      const by = b.y + bob;

      // Wooden Boat Hull
      ctx.fillStyle = '#6f4e37';
      ctx.beginPath();
      ctx.moveTo(bx - 32, by);
      ctx.lineTo(bx + 32, by);
      ctx.lineTo(bx + 24, by + 12);
      ctx.lineTo(bx - 24, by + 12);
      ctx.closePath();
      ctx.fill();

      // Mounds of colorful tropical fruits
      ctx.fillStyle = b.fruit;
      ctx.beginPath();
      ctx.arc(bx - 8, by - 4, 8, 0, Math.PI * 2);
      ctx.arc(bx + 6, by - 6, 9, 0, Math.PI * 2);
      ctx.fill();

      // Merchant with Nón Lá (Conical palm-leaf hat)
      ctx.fillStyle = '#264653';
      ctx.fillRect(bx - 20, by - 14, 8, 14); // Áo bà ba
      // Nón Lá
      ctx.fillStyle = '#f4a261';
      ctx.beginPath();
      ctx.moveTo(bx - 26, by - 14);
      ctx.lineTo(bx - 16, by - 24);
      ctx.lineTo(bx - 6, by - 14);
      ctx.closePath();
      ctx.fill();

      // Oar (Mái chèo)
      ctx.strokeStyle = '#d4a373';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bx - 18, by - 10);
      ctx.lineTo(bx - 28, by + 16);
      ctx.stroke();
    });

    ctx.restore();
  }

  _drawPalmGroves(ctx, startX, startY, dir) {
    ctx.save();
    ctx.fillStyle = '#1b4332';
    // Riverbank mud edge
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(startX + dir * 85, startY + 120, startX + dir * 60, this.height);
    ctx.lineTo(startX, this.height);
    ctx.closePath();
    ctx.fill();

    // Coconut palm fronds (Lá dừa nước)
    ctx.strokeStyle = '#2d6a4f';
    ctx.lineWidth = 2.5;
    for (let p = 0; p < 8; p++) {
      const py = startY + 30 + p * 45;
      ctx.beginPath();
      ctx.moveTo(startX, py);
      ctx.quadraticCurveTo(startX + dir * 75, py - 25, startX + dir * 95, py + 15);
      ctx.stroke();
    }

    ctx.restore();
  }

  // =========================================================
  // PANEL 9: MIỀN TÂY — Chợ nổi Cái Răng & Cầu Cần Thơ
  //
  // The source demo is deliberately split into two pre-rendered canvases:
  // the dense forest / bridge are painted once, while only birds, mist,
  // water glints and boats are repainted every frame.
  // =========================================================
  _drawMienTay(ctx) {
    const scene = this._getMienTayScene();
    const w = this.width;
    const h = this.height;

    ctx.save();
    ctx.drawImage(scene.back, 0, 0, w, h);

    // Small moving elements stay intentionally light so Tier 9 remains smooth.
    this._mientayDrawBirds(ctx);
    this._mientayDrawMist(ctx, scene.fog, h * 0.53, 0.30, 8, 1);
    this._mientayDrawMist(ctx, scene.fog, h * 0.60, 0.16, 12, 2);
    this._mientayDrawFloatingHyacinth(ctx);

    scene.boats.forEach(boat => {
      if (boat.k === 't') {
        this._mientayDrawTourBoat(ctx, w * boat.x, h * boat.y, boat.s, boat.a, boat.col, boat.p);
      } else {
        this._mientayDrawFruitBoat(ctx, w * boat.x, h * boat.y, boat.s, boat.a, boat.c, boat.col, boat.p);
      }
    });

    this._mientayDrawWaterSparkles(ctx);
    ctx.drawImage(scene.front, 0, 0, w, h);
    ctx.restore();
  }

  _getMienTayScene() {
    const width = Math.max(1, Math.round(this.width));
    const height = Math.max(1, Math.round(this.height));
    if (this._mienTayScene &&
      this._mienTayScene.width === width &&
      this._mienTayScene.height === height) {
      return this._mienTayScene;
    }

    this._mientayUpdateBanks();
    const scene = {
      width,
      height,
      fog: this._mientayMakeFogSprite(),
      boats: [
        { k: 'f', x: 0.47, y: 0.545, s: 0.24, a: 0.10, c: 0, col: '#9a5aa8', p: 0.3 },
        { k: 'f', x: 0.55, y: 0.565, s: 0.27, a: -0.12, c: 2, col: '#c06a7a', p: 1.1 },
        { k: 'f', x: 0.40, y: 0.600, s: 0.36, a: -0.18, c: 2, col: '#9a5aa8', p: 2.0 },
        { k: 'f', x: 0.52, y: 0.610, s: 0.40, a: 0.12, c: 0, col: '#4a86b8', p: 2.7 },
        { k: 't', x: 0.36, y: 0.665, s: 0.62, a: -0.10, c: 0, col: '#3b6fb0', p: 0.7 },
        { k: 'f', x: 0.64, y: 0.635, s: 0.52, a: 0.26, c: 1, col: '#c0507a', p: 3.2 },
        { k: 't', x: 0.70, y: 0.675, s: 0.70, a: 0.06, c: 0, col: '#d8b878', p: 4.1 },
        { k: 'f', x: 0.44, y: 0.705, s: 0.66, a: 0.22, c: 3, col: '#9a5aa8', p: 5.0 },
        { k: 'f', x: 0.76, y: 0.735, s: 0.78, a: -0.12, c: 2, col: '#4a86b8', p: 5.8 },
        { k: 'f', x: 0.27, y: 0.775, s: 0.92, a: -0.20, c: 3, col: '#9a5aa8', p: 6.4 },
        { k: 'f', x: 0.40, y: 0.810, s: 0.98, a: 0.10, c: 1, col: '#c0507a', p: 7.0 },
        { k: 'f', x: 0.66, y: 0.815, s: 1.12, a: 0.18, c: 2, col: '#4a86b8', p: 7.9 },
        { k: 'f', x: 0.84, y: 0.865, s: 1.10, a: -0.16, c: 0, col: '#9a5aa8', p: 8.6 },
        { k: 'f', x: 0.30, y: 0.905, s: 1.30, a: -0.28, c: 2, col: '#9a5aa8', p: 9.3 },
        { k: 'f', x: 0.56, y: 0.925, s: 1.42, a: 0.04, c: 0, col: '#c0507a', p: 10.1 }
      ]
    };

    scene.back = this._mientayLayer(g => {
      this._mientayDrawSky(g);
      this._mientayDrawAtmosphere(g, 0);
      this._mientayDrawSunAndGlow(g, this.width * 0.5, this.height * 0.455);
      this._mientayDrawCanThoBridge(g, this.height * 0.405);
      this._mientayDrawHorizonMist(g);
      this._mientayDrawWaterBase(g);
      this._mientayDrawForest(g);
      this._mientayDrawStiltHut(g, this.width * 0.085, this.height * 0.795, 1.15, 1);
      this._mientayDrawStiltHut(g, this.width * 0.915, this.height * 0.715, 1.0, -1);
    });
    scene.front = this._mientayLayer(g => this._mientayDrawForeground(g));

    this._mienTayScene = scene;
    return scene;
  }

  _mientayLayer(draw) {
    const layer = document.createElement('canvas');
    layer.width = Math.max(1, Math.round(this.width));
    layer.height = Math.max(1, Math.round(this.height));
    const g = layer.getContext('2d');
    draw(g);
    return layer;
  }

  _mientayRnd(n) {
    const value = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return value - Math.floor(value);
  }

  _mientaySegs() {
    const w = this.width;
    const h = this.height;
    const P = (x, y) => ({ x: w * x, y: h * y });
    return {
      LB1: [P(0.43, 0.50), P(0.38, 0.56), P(0.26, 0.60), P(0.22, 0.66)],
      LB2: [P(0.22, 0.66), P(0.18, 0.72), P(0.10, 0.78), P(0.0, 0.82)],
      RB1: [P(0.57, 0.50), P(0.60, 0.55), P(0.70, 0.58), P(0.78, 0.63)],
      RB2: [P(0.78, 0.63), P(0.86, 0.68), P(0.94, 0.72), P(1.0, 0.74)]
    };
  }

  _mientayBez(segment, t) {
    const u = 1 - t;
    const a = u * u * u;
    const b = 3 * u * u * t;
    const c = 3 * u * t * t;
    const d = t * t * t;
    return {
      x: a * segment[0].x + b * segment[1].x + c * segment[2].x + d * segment[3].x,
      y: a * segment[0].y + b * segment[1].y + c * segment[2].y + d * segment[3].y
    };
  }

  _mientayBezTo(ctx, segment) {
    ctx.bezierCurveTo(segment[1].x, segment[1].y, segment[2].x, segment[2].y, segment[3].x, segment[3].y);
  }

  _mientayBezToRev(ctx, segment) {
    ctx.bezierCurveTo(segment[2].x, segment[2].y, segment[1].x, segment[1].y, segment[0].x, segment[0].y);
  }

  _mientayUpdateBanks() {
    const segs = this._mientaySegs();
    this._mienTayLeftBank = [];
    this._mienTayRightBank = [];
    [segs.LB1, segs.LB2].forEach(segment => {
      for (let i = 0; i <= 24; i++) this._mienTayLeftBank.push(this._mientayBez(segment, i / 24));
    });
    [segs.RB1, segs.RB2].forEach(segment => {
      for (let i = 0; i <= 24; i++) this._mienTayRightBank.push(this._mientayBez(segment, i / 24));
    });
  }

  _mientayBankX(side, y) {
    const points = side < 0 ? this._mienTayLeftBank : this._mienTayRightBank;
    if (y <= points[0].y) return points[0].x;
    for (let i = 1; i < points.length; i++) {
      if (y <= points[i].y) {
        const a = points[i - 1];
        const b = points[i];
        const amount = (y - a.y) / ((b.y - a.y) || 1);
        return a.x + (b.x - a.x) * amount;
      }
    }
    return points[points.length - 1].x;
  }

  _mientayWaterPath(ctx) {
    const segs = this._mientaySegs();
    const w = this.width;
    const h = this.height;
    ctx.beginPath();
    ctx.moveTo(segs.LB1[0].x, segs.LB1[0].y);
    this._mientayBezTo(ctx, segs.LB1);
    this._mientayBezTo(ctx, segs.LB2);
    ctx.lineTo(0, h);
    ctx.lineTo(w, h);
    ctx.lineTo(segs.RB2[3].x, segs.RB2[3].y);
    this._mientayBezToRev(ctx, segs.RB2);
    this._mientayBezToRev(ctx, segs.RB1);
    ctx.closePath();
  }

  _mientayDrawSky(ctx) {
    const w = this.width;
    const h = this.height;
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.52);
    sky.addColorStop(0, '#78aaa9');
    sky.addColorStop(0.28, '#a7cfbf');
    sky.addColorStop(0.55, '#eddcae');
    sky.addColorStop(0.80, '#f8c188');
    sky.addColorStop(1, '#f5ae77');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h * 0.55);
  }

  _mientayDrawAtmosphere(ctx, time = 0) {
    const w = this.width;
    const h = this.height;
    const clouds = [
      { x: 0.10, y: 0.20, s: 1.20 },
      { x: 0.34, y: 0.11, s: 0.70 },
      { x: 0.84, y: 0.19, s: 1.35 },
      { x: 0.92, y: 0.33, s: 0.95 },
      { x: 0.06, y: 0.34, s: 0.80 }
    ];
    ctx.save();
    clouds.forEach((cloud, i) => {
      const x = w * cloud.x + Math.sin(time * 0.06 + i * 1.7) * 18;
      const y = h * cloud.y;
      const s = cloud.s;
      ctx.fillStyle = 'rgba(245, 170, 130, 0.42)';
      ctx.beginPath();
      ctx.ellipse(x, y + 9 * s, 52 * s, 9 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 243, 222, 0.92)';
      ctx.beginPath();
      ctx.ellipse(x, y + 4 * s, 48 * s, 11 * s, 0, 0, Math.PI * 2);
      ctx.ellipse(x - 20 * s, y - 6 * s, 22 * s, 16 * s, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 6 * s, y - 14 * s, 26 * s, 20 * s, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 30 * s, y - 4 * s, 20 * s, 14 * s, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  _mientayDrawSunAndGlow(ctx, x, y) {
    ctx.save();
    const glow = ctx.createRadialGradient(x, y, 10, x, y, 210);
    glow.addColorStop(0, 'rgba(255, 240, 174, 0.88)');
    glow.addColorStop(0.32, 'rgba(255, 205, 130, 0.45)');
    glow.addColorStop(1, 'rgba(255, 190, 120, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 210, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 248, 204, 0.96)';
    ctx.beginPath();
    ctx.arc(x, y, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _mientayDrawCanThoBridge(ctx, deckY) {
    const w = this.width;
    const h = this.height;
    const pylons = [w * 0.27, w * 0.73];
    const topY = h * 0.185;
    ctx.save();

    ctx.lineWidth = 0.7;
    pylons.forEach(px => {
      for (let side = -1; side <= 1; side += 2) {
        for (let i = 0; i < 16; i++) {
          const anchorY = topY + 10 + i * ((deckY - topY) * 0.6 / 16);
          const reach = 14 + (15 - i) * 8.5;
          const endX = px + side * reach;
          const cable = ctx.createLinearGradient(px, anchorY, endX, deckY);
          cable.addColorStop(0, 'rgba(250, 252, 255, 0.74)');
          cable.addColorStop(1, 'rgba(255, 245, 225, 0.34)');
          ctx.strokeStyle = cable;
          ctx.beginPath();
          ctx.moveTo(px, anchorY);
          ctx.lineTo(endX, deckY);
          ctx.stroke();
        }
      }
    });

    pylons.forEach(px => {
      const baseY = h * 0.495;
      ctx.fillStyle = '#dfe9ec';
      ctx.beginPath();
      ctx.moveTo(px - 3, topY);
      ctx.lineTo(px + 3, topY);
      ctx.lineTo(px + 6, deckY - 22);
      ctx.lineTo(px - 6, deckY - 22);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#b4c7ce';
      ctx.beginPath();
      ctx.moveTo(px, topY);
      ctx.lineTo(px + 3, topY);
      ctx.lineTo(px + 6, deckY - 22);
      ctx.lineTo(px, deckY - 22);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#d3e0e4';
      ctx.beginPath();
      ctx.moveTo(px - 6, deckY - 22);
      ctx.lineTo(px - 1, deckY - 22);
      ctx.lineTo(px - 4, baseY);
      ctx.lineTo(px - 14, baseY);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#aebfc7';
      ctx.beginPath();
      ctx.moveTo(px + 1, deckY - 22);
      ctx.lineTo(px + 6, deckY - 22);
      ctx.lineTo(px + 14, baseY);
      ctx.lineTo(px + 4, baseY);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffd7a0';
      ctx.fillRect(px - 1.2, topY - 3, 2.4, 3);
    });

    const deck = ctx.createLinearGradient(0, deckY - 3, 0, deckY + 5);
    deck.addColorStop(0, '#d6e3e6');
    deck.addColorStop(1, '#9fb6bf');
    ctx.fillStyle = deck;
    ctx.fillRect(-4, deckY - 3, w + 8, 6);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(-4, deckY - 3, w + 8, 1);
    ctx.strokeStyle = 'rgba(210, 224, 230, 0.78)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-4, deckY - 6);
    ctx.lineTo(w + 4, deckY - 6);
    ctx.stroke();
    ctx.restore();
  }

  _mientayDrawHorizonMist(ctx) {
    const w = this.width;
    const h = this.height;
    ctx.save();
    ctx.fillStyle = 'rgba(150, 190, 180, 0.65)';
    ctx.beginPath();
    ctx.moveTo(w * 0.34, h * 0.505);
    ctx.quadraticCurveTo(w * 0.42, h * 0.478, w * 0.47, h * 0.492);
    ctx.quadraticCurveTo(w * 0.54, h * 0.474, w * 0.66, h * 0.505);
    ctx.closePath();
    ctx.fill();
    const veil = ctx.createLinearGradient(0, h * 0.40, 0, h * 0.58);
    veil.addColorStop(0, 'rgba(236, 246, 232, 0)');
    veil.addColorStop(0.5, 'rgba(236, 246, 232, 0.72)');
    veil.addColorStop(1, 'rgba(236, 246, 232, 0)');
    ctx.fillStyle = veil;
    ctx.fillRect(0, h * 0.40, w, h * 0.18);
    ctx.restore();
  }

  _mientayDrawWaterBase(ctx) {
    const w = this.width;
    const h = this.height;
    const segs = this._mientaySegs();
    ctx.save();
    this._mientayWaterPath(ctx);
    const water = ctx.createLinearGradient(0, h * 0.5, 0, h);
    water.addColorStop(0, '#d8ead5');
    water.addColorStop(0.10, '#d0e0a6');
    water.addColorStop(0.28, '#a6cb9c');
    water.addColorStop(0.55, '#68a690');
    water.addColorStop(0.80, '#3d8a7c');
    water.addColorStop(1, '#286e67');
    ctx.fillStyle = water;
    ctx.fill();
    ctx.clip();

    // A vertical strip of sunrise on the water.
    for (let i = 0; i < 18; i++) {
      const y = h * 0.505 + i * 9;
      const width = 70 - i * 2.4 + Math.sin(i * 0.9) * 6;
      const alpha = Math.max(0.06, 0.36 - i * 0.018);
      ctx.fillStyle = 'rgba(255, 244, 196, ' + alpha + ')';
      ctx.fillRect(w * 0.5 - width * 0.5, y, width, 2.6);
    }

    // Soft golden sediment patches.
    for (let i = 0; i < 8; i++) {
      const x = w * (0.2 + this._mientayRnd(i + 21) * 0.6);
      const y = h * (0.56 + this._mientayRnd(i + 31) * 0.3);
      ctx.fillStyle = 'rgba(236, 232, 150, 0.22)';
      ctx.beginPath();
      ctx.ellipse(x, y, 38 + i * 4, 9 + i, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < 34; i++) {
      const x = this._mientayRnd(i + 5) * w;
      const y = h * (0.53 + this._mientayRnd(i + 55) * 0.46);
      const length = 14 + this._mientayRnd(i + 8) * 26 + (y / h - 0.5) * 40;
      const alpha = 0.12 + this._mientayRnd(i + 3) * 0.14;
      ctx.strokeStyle = 'rgba(255, 255, 235, ' + alpha + ')';
      ctx.beginPath();
      ctx.ellipse(x, y, length, 2 + (y / h - 0.5) * 5, 0, Math.PI * 1.05, Math.PI * 1.95);
      ctx.stroke();
    }

    // Dark wet edge where jungle meets the river.
    ctx.strokeStyle = 'rgba(20, 70, 55, 0.35)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(segs.LB1[0].x, segs.LB1[0].y);
    this._mientayBezTo(ctx, segs.LB1);
    this._mientayBezTo(ctx, segs.LB2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(segs.RB1[0].x, segs.RB1[0].y);
    this._mientayBezTo(ctx, segs.RB1);
    this._mientayBezTo(ctx, segs.RB2);
    ctx.stroke();
    ctx.restore();
  }

  _mientayDrawPalmTree(ctx, x, y, scale, dark, light, lean, phase, motion = false) {
    const time = motion ? this.animTimer : 0;
    const topX = x + lean * 12 * scale;
    const topY = y - 48 * scale;
    ctx.save();
    ctx.strokeStyle = dark;
    ctx.lineWidth = Math.max(1.2, 3 * scale);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + lean * 2 * scale, y - 26 * scale, topX, topY);
    ctx.stroke();

    const sway = Math.sin(time * 1.1 + phase) * 0.06;
    const angles = [-3.0, -2.6, -2.2, -1.85, -1.5, -1.15, -0.8, -0.4, 0.0];
    angles.forEach((baseAngle, i) => {
      const angle = baseAngle + sway;
      const length = (21 + (i % 3) * 3) * scale;
      const endX = topX + Math.cos(angle) * length;
      const endY = topY + Math.sin(angle) * length * 0.6 + 9 * scale;
      const controlX = topX + Math.cos(angle) * length * 0.55;
      const controlY = topY + Math.sin(angle) * length * 0.6 - 5 * scale;
      ctx.fillStyle = i % 2 ? light : dark;
      ctx.beginPath();
      ctx.moveTo(topX, topY);
      ctx.quadraticCurveTo(controlX, controlY - 3 * scale, endX, endY);
      ctx.quadraticCurveTo(controlX, controlY + 4 * scale, topX, topY);
      ctx.fill();
    });

    ctx.fillStyle = '#4a3a20';
    ctx.beginPath();
    ctx.arc(topX - 1.5 * scale, topY + 3 * scale, 1.8 * scale, 0, Math.PI * 2);
    ctx.arc(topX + 1.8 * scale, topY + 3.5 * scale, 1.8 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _mientayDrawNipa(ctx, x, y, scale, dark, light, phase, motion = false) {
    const time = motion ? this.animTimer : 0;
    const sway = Math.sin(time * 1.3 + phase) * 0.05;
    ctx.save();
    for (let i = 0; i < 9; i++) {
      const angle = -2.45 + i * 0.2 + sway;
      const length = (22 + (i % 3) * 5) * scale;
      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;
      const direction = angle < -1.57 ? -1 : 1;
      const controlX = x + Math.cos(angle) * length * 0.5;
      const controlY = y + Math.sin(angle) * length * 0.6;
      ctx.fillStyle = i % 2 ? light : dark;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(controlX + 3.5 * scale * direction, controlY, endX, endY);
      ctx.quadraticCurveTo(controlX - 3.5 * scale * direction, controlY + 2 * scale, x, y);
      ctx.fill();
    }
    ctx.restore();
  }

  _mientayDrawForest(ctx) {
    const w = this.width;
    const h = this.height;
    const segs = this._mientaySegs();
    ctx.save();

    const land = ctx.createLinearGradient(0, h * 0.46, 0, h * 0.85);
    land.addColorStop(0, '#b0d2bc');
    land.addColorStop(0.35, '#5f9676');
    land.addColorStop(1, '#2a5c42');
    ctx.fillStyle = land;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.46);
    ctx.lineTo(segs.LB1[0].x, h * 0.46);
    ctx.lineTo(segs.LB1[0].x, segs.LB1[0].y);
    this._mientayBezTo(ctx, segs.LB1);
    this._mientayBezTo(ctx, segs.LB2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(w, h * 0.46);
    ctx.lineTo(segs.RB1[0].x, h * 0.46);
    ctx.lineTo(segs.RB1[0].x, segs.RB1[0].y);
    this._mientayBezTo(ctx, segs.RB1);
    this._mientayBezTo(ctx, segs.RB2);
    ctx.closePath();
    ctx.fill();

    const dark = ['#86b49e', '#6fa088', '#548c72', '#3b7658', '#27603f', '#1a4a30'];
    const light = ['#a6cdb4', '#8dbb9e', '#6ea585', '#4f8e69', '#37774f', '#25603c'];
    for (let row = 0; row < 6; row++) {
      const y = h * (0.485 + row * 0.042);
      const scale = 0.26 + row * 0.22;
      for (let side = -1; side <= 1; side += 2) {
        const bankX = this._mientayBankX(side, y);
        let x = bankX + side * (3 + scale * 5);
        let count = 0;
        while (x > -24 && x < w + 24 && count < 60) {
          const seed = row * 97 + count * 3 + (side > 0 ? 500 : 0);
          const random = this._mientayRnd(seed);
          ctx.fillStyle = dark[row];
          ctx.globalAlpha = 0.85;
          ctx.beginPath();
          ctx.ellipse(x, y - 9 * scale, 22 * scale, 13 * scale, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;

          if (count < 2) {
            this._mientayDrawNipa(ctx, x, y, scale * 1.05, dark[row], light[row], seed);
          } else {
            this._mientayDrawPalmTree(ctx, x, y, scale * (0.8 + random * 0.5), dark[row], light[row], (random - 0.5) * 2, seed);
            if (random > 0.55) {
              this._mientayDrawNipa(ctx, x + side * 8 * scale, y + 2 * scale, scale * 0.8, dark[row], light[row], seed + 3);
            }
          }
          x += side * 24 * scale * (0.75 + this._mientayRnd(seed + 1) * 0.7);
          count++;
        }
      }
    }
    ctx.restore();
  }

  _mientayDrawStiltHut(ctx, x, y, scale, direction) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * direction, scale);

    ctx.fillStyle = '#8a6a44';
    ctx.beginPath();
    ctx.moveTo(10, 4);
    ctx.lineTo(86, 12);
    ctx.lineTo(80, 24);
    ctx.lineTo(4, 14);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#5a4028';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      ctx.moveTo(10 + i * 8, 4 + i * 0.9);
      ctx.lineTo(4 + i * 8, 14 + i * 0.9);
    }
    ctx.stroke();

    ctx.fillStyle = '#4a3220';
    [[16, 14], [44, 18], [72, 22], [84, 14]].forEach(([px, py]) => {
      ctx.fillRect(px - 1.5, py, 3, 26);
    });
    ctx.fillStyle = 'rgba(255, 255, 240, 0.35)';
    [[16, 40], [44, 44], [72, 48], [84, 40]].forEach(([px, py]) => {
      ctx.fillRect(px - 5, py, 10, 1.4);
    });

    ctx.fillStyle = '#5a3d28';
    ctx.fillRect(-26, -18, 40, 24);
    ctx.strokeStyle = '#3a2618';
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      ctx.moveTo(-22 + i * 6, -18);
      ctx.lineTo(-22 + i * 6, 6);
    }
    ctx.stroke();
    ctx.fillStyle = '#20140c';
    ctx.fillRect(-6, -10, 10, 16);

    ctx.fillStyle = '#a8844e';
    ctx.beginPath();
    ctx.moveTo(-36, -16);
    ctx.lineTo(-8, -48);
    ctx.lineTo(24, -16);
    ctx.lineTo(18, -12);
    ctx.lineTo(-30, -12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d2ae72';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 9; i++) {
      const roofX = -34 + i * 7;
      ctx.moveTo(-8, -46);
      ctx.lineTo(roofX, -14);
    }
    ctx.stroke();
    ctx.fillStyle = '#7a5a30';
    ctx.fillRect(-36, -16, 60, 3);
    ctx.restore();
  }

  _mientayDrawForeground(ctx) {
    const w = this.width;
    const h = this.height;
    ctx.save();
    this._mientayDrawPalmTree(ctx, w * 0.04, h * 0.80, 3.0, '#16402b', '#235a3a', 1.2, 1.5);
    this._mientayDrawPalmTree(ctx, w * 0.17, h * 0.745, 2.0, '#1a4a30', '#2a6a44', 0.7, 3.1);
    this._mientayDrawPalmTree(ctx, w * 0.97, h * 0.775, 2.9, '#16402b', '#235a3a', -1.1, 2.2);
    this._mientayDrawNipa(ctx, w * 0.90, h * 0.77, 1.4, '#1a4a30', '#2c6c46', 0.4);

    const frond = (baseX, baseY, length, angle, primary, highlight) => {
      const endX = baseX + Math.cos(angle) * length;
      const endY = baseY + Math.sin(angle) * length;
      const midX = baseX + Math.cos(angle) * length * 0.5;
      const midY = baseY + Math.sin(angle) * length * 0.5 - length * 0.12;
      const normalX = -Math.sin(angle);
      const normalY = Math.cos(angle);
      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.quadraticCurveTo(midX + normalX * 14, midY + normalY * 14, endX, endY);
      ctx.quadraticCurveTo(midX - normalX * 6, midY - normalY * 6, baseX, baseY);
      ctx.fill();
      ctx.fillStyle = highlight;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.quadraticCurveTo(midX - normalX * 12, midY - normalY * 12, endX, endY);
      ctx.quadraticCurveTo(midX + normalX * 4, midY + normalY * 4, baseX, baseY);
      ctx.fill();
    };

    const left = [
      [0.02, 1.0, 130, -1.2], [0.05, 1.0, 150, -0.8], [0.10, 1.0, 120, -0.45],
      [0.0, 0.93, 110, -1.45], [0.14, 1.0, 100, -0.15]
    ];
    left.forEach((leaf, i) => {
      frond(w * leaf[0], h * leaf[1] + 6, leaf[2], leaf[3], '#103a28', i % 2 ? '#1f5a3a' : '#2a6c46');
    });
    const right = [
      [0.99, 1.0, 140, -1.9], [0.95, 1.0, 130, -2.4], [1.0, 0.94, 110, -1.65], [0.90, 1.0, 100, -2.8]
    ];
    right.forEach((leaf, i) => {
      frond(w * leaf[0], h * leaf[1] + 6, leaf[2], leaf[3], '#103a28', i % 2 ? '#1f5a3a' : '#2a6c46');
    });

    const shrub = ['#5a8a3a', '#7a9a3a', '#4a7a34', '#8aa646'];
    for (let i = 0; i < 28; i++) {
      const x = w * 0.01 + this._mientayRnd(i + 900) * w * 0.39;
      const y = h * (0.95 + this._mientayRnd(i + 950) * 0.07);
      ctx.fillStyle = shrub[i % shrub.length];
      ctx.beginPath();
      ctx.ellipse(x, y, 12 + this._mientayRnd(i) * 16, 7 + this._mientayRnd(i + 5) * 8, this._mientayRnd(i + 7) - 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  _mientayDrawBirds(ctx) {
    const w = this.width;
    const h = this.height;
    const time = this.animTimer;
    const birds = [
      { x: 0.20, y: 0.325, s: 1.10 }, { x: 0.27, y: 0.285, s: 0.90 },
      { x: 0.32, y: 0.345, s: 0.80 }, { x: 0.14, y: 0.375, s: 0.70 },
      { x: 0.36, y: 0.30, s: 0.60 }, { x: 0.62, y: 0.355, s: 0.90 },
      { x: 0.70, y: 0.335, s: 1.00 }, { x: 0.66, y: 0.385, s: 0.60 }
    ];
    ctx.save();
    ctx.strokeStyle = '#506272';
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    birds.forEach((bird, i) => {
      const x = w * bird.x + Math.sin(time * 0.3 + i) * 14 + Math.sin(this.scrollX * 0.01 + i) * 4;
      const y = h * bird.y + Math.cos(time * 0.4 + i * 1.3) * 5;
      const flap = Math.sin(time * 5 + i * 1.9);
      const size = bird.s;
      ctx.beginPath();
      ctx.moveTo(x - 10 * size, y - flap * 6 * size);
      ctx.quadraticCurveTo(x - 5 * size, y - 4 * size - flap * 4 * size, x, y);
      ctx.quadraticCurveTo(x + 5 * size, y - 4 * size - flap * 4 * size, x + 10 * size, y - flap * 6 * size);
      ctx.stroke();
    });
    ctx.restore();
  }

  _mientayMakeFogSprite() {
    const fog = document.createElement('canvas');
    fog.width = 700;
    fog.height = 160;
    const g = fog.getContext('2d');
    g.save();
    g.translate(fog.width / 2, fog.height / 2);
    g.scale(1, 0.22);
    const haze = g.createRadialGradient(0, 0, 0, 0, 0, fog.width * 0.48);
    haze.addColorStop(0, 'rgba(240, 250, 238, 0.9)');
    haze.addColorStop(0.58, 'rgba(240, 250, 238, 0.34)');
    haze.addColorStop(1, 'rgba(240, 250, 238, 0)');
    g.fillStyle = haze;
    g.fillRect(-fog.width / 2, -fog.width / 2, fog.width, fog.width);
    g.restore();
    return fog;
  }

  _mientayDrawMist(ctx, fog, y, alpha, speed, seed) {
    const w = this.width;
    const drawWidth = Math.max(250, w * 0.72);
    const drawHeight = drawWidth * 0.23;
    const span = w + drawWidth;
    ctx.save();
    ctx.globalAlpha = alpha;
    for (let i = 0; i < 6; i++) {
      const x = ((i * span / 5 + seed * 73 + this.scrollX * speed * 0.55) % span) - drawWidth;
      const floatY = y + Math.sin(this.animTimer * 0.4 + i + seed) * 3;
      ctx.drawImage(fog, x, floatY - drawHeight * 0.5, drawWidth, drawHeight);
    }
    ctx.restore();
  }

  _mientayDrawFloatingHyacinth(ctx) {
    const w = this.width;
    const h = this.height;
    ctx.save();
    for (let i = 0; i < 7; i++) {
      const x = w * (0.69 + i * 0.037) + Math.sin(this.animTimer * 0.4 + i) * 3;
      const y = h * (0.652 + i * 0.012);
      ctx.fillStyle = '#579747';
      ctx.beginPath();
      ctx.ellipse(x, y, 7, 2.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#6db75a';
      ctx.beginPath();
      ctx.ellipse(x - 2, y - 1.1, 3.5, 1.5, -0.3, 0, Math.PI * 2);
      ctx.ellipse(x + 2.4, y - 1.1, 3.3, 1.4, 0.25, 0, Math.PI * 2);
      ctx.fill();
      if (i % 2 === 0) {
        ctx.fillStyle = '#af7cdb';
        ctx.beginPath();
        ctx.arc(x + 1, y - 3.0, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  _mientayDrawWaterSparkles(ctx) {
    const w = this.width;
    const h = this.height;
    ctx.save();
    for (let i = 0; i < 28; i++) {
      const x = w * (0.24 + this._mientayRnd(i + 1200) * 0.58);
      const y = h * (0.60 + this._mientayRnd(i + 1300) * 0.34);
      const alpha = 0.08 + 0.47 * Math.abs(Math.sin(this.animTimer * 1.5 + i * 2.1));
      ctx.fillStyle = 'rgba(255, 255, 235, ' + alpha + ')';
      ctx.fillRect(x - 2, y, 4, 0.9);
      ctx.fillRect(x - 0.5, y - 1.5, 1, 3);
    }
    ctx.restore();
  }

  _mientayDrawFruitBoat(ctx, x, y, scale, angle, cargo, shirt, phase) {
    const time = this.animTimer;
    ctx.save();
    y += Math.sin(time * 1.6 + phase) * 1.3 * scale;
    ctx.translate(x, y);
    ctx.rotate(angle + Math.sin(time * 0.9 + phase) * 0.012);
    ctx.scale(scale, scale);

    // Wake and soft shadow make each moving boat sit on the water.
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.60)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-34, 4);
    ctx.quadraticCurveTo(-52, 10, -74, 20);
    ctx.moveTo(-34, 8);
    ctx.quadraticCurveTo(-48, 15, -66, 26);
    ctx.moveTo(30, 8);
    ctx.quadraticCurveTo(40, 14, 56, 16);
    ctx.stroke();
    ctx.fillStyle = 'rgba(10, 50, 45, 0.32)';
    ctx.beginPath();
    ctx.ellipse(0, 10, 38, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#6b4528';
    ctx.beginPath();
    ctx.moveTo(-36, -2);
    ctx.quadraticCurveTo(-18, 12, 2, 12);
    ctx.quadraticCurveTo(26, 11, 38, -4);
    ctx.quadraticCurveTo(20, -9, 0, -9);
    ctx.quadraticCurveTo(-22, -9, -36, -2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#3f2814';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = '#8b5e36';
    ctx.beginPath();
    ctx.ellipse(0, -4.5, 31, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    this._mientayDrawCargo(ctx, cargo);

    // Merchant in áo bà ba and conical hat.
    ctx.fillStyle = shirt;
    ctx.beginPath();
    ctx.moveTo(-27, -4);
    ctx.lineTo(-26, -17);
    ctx.quadraticCurveTo(-23, -20, -20, -17);
    ctx.lineTo(-19, -4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#e0b088';
    ctx.beginPath();
    ctx.arc(-23, -22, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ecd9a0';
    ctx.beginPath();
    ctx.moveTo(-23, -32);
    ctx.lineTo(-31, -22);
    ctx.lineTo(-15, -22);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#b89a5a';
    ctx.lineWidth = 0.7;
    ctx.stroke();

    const stroke = Math.sin(time * 1.5 + phase) * 3;
    ctx.strokeStyle = '#7a5230';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-21, -13);
    ctx.lineTo(16 + stroke, 8);
    ctx.lineTo(30 + stroke, 16);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(31 + stroke, 17, 6, 1.8, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  _mientayDrawCargo(ctx, cargo) {
    ctx.save();
    if (cargo === 0) {
      // Pineapples.
      for (let i = 0; i < 5; i++) {
        const x = -8 + i * 8.5;
        const y = -8 - (i % 2) * 2;
        ctx.fillStyle = '#f0b030';
        ctx.beginPath();
        ctx.ellipse(x, y, 3.8, 5.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(150, 90, 20, 0.7)';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(x - 3, y - 3);
        ctx.lineTo(x + 3, y + 3);
        ctx.moveTo(x + 3, y - 3);
        ctx.lineTo(x - 3, y + 3);
        ctx.stroke();
        ctx.fillStyle = '#3f9a3f';
        ctx.beginPath();
        ctx.moveTo(x - 3, y - 4.5);
        ctx.lineTo(x - 1.5, y - 11);
        ctx.lineTo(x, y - 5);
        ctx.lineTo(x + 1.5, y - 12);
        ctx.lineTo(x + 3, y - 4.5);
        ctx.closePath();
        ctx.fill();
      }
    } else if (cargo === 1) {
      // Watermelons plus one sliced fruit.
      for (let i = 0; i < 4; i++) {
        const x = -6 + i * 9;
        const y = -8 - (i % 2) * 2;
        ctx.fillStyle = '#2f8a45';
        ctx.beginPath();
        ctx.arc(x, y, 5.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1e6a30';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 3, y - 4);
        ctx.quadraticCurveTo(x - 1, y, x - 3, y + 4);
        ctx.moveTo(x + 2, y - 4.5);
        ctx.quadraticCurveTo(x + 4, y, x + 2, y + 4.5);
        ctx.stroke();
      }
      ctx.fillStyle = '#e23a4a';
      ctx.beginPath();
      ctx.arc(31, -7, 4.6, Math.PI, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#7ac85a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(31, -7, 4.6, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#20140c';
      ctx.fillRect(29, -9, 1, 1);
      ctx.fillRect(32, -9.4, 1, 1);
    } else if (cargo === 2) {
      // Bananas with oranges and green apples.
      ctx.strokeStyle = '#f6d23c';
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(-7 + i * 2.5, -6);
        ctx.quadraticCurveTo(-4 + i * 2.5, -16, 3 + i * 2, -13);
        ctx.stroke();
      }
      const colours = ['#f08a24', '#9ad24a', '#f08a24', '#e83a3a'];
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = colours[i % colours.length];
        ctx.beginPath();
        ctx.arc(10 + i * 5.5, -8 - (i % 2) * 2, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // A broad, colourful pile of mangoes and citrus.
      const colours = ['#f39a2a', '#f6c23c', '#9acd45', '#f06a2a', '#ffd84a'];
      for (let row = 0; row < 2; row++) {
        for (let i = 0; i < 7; i++) {
          ctx.fillStyle = colours[(i + row * 2) % colours.length];
          ctx.beginPath();
          ctx.arc(-10 + i * 5.6 + row * 2.8, -7.5 - row * 4, 3.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }

  _mientayDrawTourBoat(ctx, x, y, scale, angle, roofColour, phase) {
    const time = this.animTimer;
    ctx.save();
    y += Math.sin(time * 1.4 + phase) * 1.1 * scale;
    x += Math.sin(time * 0.15 + phase) * 6;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-46, 4);
    ctx.quadraticCurveTo(-64, 10, -88, 18);
    ctx.moveTo(-46, 8);
    ctx.quadraticCurveTo(-62, 15, -80, 26);
    ctx.moveTo(40, 6);
    ctx.quadraticCurveTo(52, 12, 70, 14);
    ctx.stroke();
    ctx.fillStyle = 'rgba(10, 50, 45, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 11, 50, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#6b4528';
    ctx.beginPath();
    ctx.moveTo(-48, -2);
    ctx.quadraticCurveTo(-26, 12, 0, 12);
    ctx.quadraticCurveTo(30, 12, 50, -4);
    ctx.lineTo(46, -6);
    ctx.lineTo(-44, -6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#3f2814';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = '#8a5a34';
    ctx.fillRect(-34, -18, 68, 13);
    ctx.fillStyle = '#2a1a10';
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.arc(-28 + i * 9.4, -11, 2.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = '#d8b878';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.arc(-28 + i * 9.4, -11, 2.3, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = roofColour;
    ctx.beginPath();
    ctx.moveTo(-40, -17);
    ctx.lineTo(-34, -25);
    ctx.lineTo(36, -25);
    ctx.lineTo(42, -17);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(-34, -25, 70, 2);
    ctx.restore();
  }
}
