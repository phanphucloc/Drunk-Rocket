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

export class ScenicLandmarksManager {
  constructor(width = 400, height = 700) {
    this.width = width;
    this.height = height;

    this.currentTier = 1;
    this.prevTier = 1;
    this.fadeProgress = 1.0;

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
  }

  setTier(tier) {
    if (tier !== this.currentTier) {
      this.prevTier = this.currentTier;
      this.currentTier = tier;
      this.fadeProgress = 0.0;
    }
  }

  update(dt, tier = 1) {
    this.animTimer += dt;
    this.dragonFlameTimer += dt;
    this.cableCarPhase = (this.cableCarPhase + dt * 0.35) % 1.0;
    this.sunWheelAngle += dt * 0.25;
    this.scrollX += dt * 15;

    if (tier !== this.currentTier) {
      this.setTier(tier);
    }

    if (this.fadeProgress < 1.0) {
      this.fadeProgress = Math.min(1.0, this.fadeProgress + dt * 1.0);
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
      // Cross-fade blend
      ctx.save();
      ctx.globalAlpha = 1.0 - this.fadeProgress;
      this._drawLandmarkByTier(ctx, this.prevTier);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = this.fadeProgress;
      this._drawLandmarkByTier(ctx, this.currentTier);
      ctx.restore();
    } else {
      this._drawLandmarkByTier(ctx, this.currentTier);
    }

    // Atmospheric depth scrim (keeps background subtle so foreground obstacles pop out crystal clear)
    const scrim = ctx.createLinearGradient(0, 0, 0, this.height);
    scrim.addColorStop(0, 'rgba(10, 14, 24, 0.12)');
    scrim.addColorStop(0.5, 'rgba(10, 14, 24, 0.06)');
    scrim.addColorStop(1, 'rgba(10, 14, 24, 0.25)');
    ctx.fillStyle = scrim;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.restore();
  }

  _drawLandmarkByTier(ctx, tier) {
    switch (tier) {
      case 1: this._drawSapa(ctx); break;
      case 2: this._drawHanoi(ctx); break;
      case 3: this._drawHue(ctx); break;
      case 4: this._drawDaNang(ctx); break;
      case 5: this._drawHoiAn(ctx); break;
      case 6: this._drawDaLat(ctx); break;
      case 7: this._drawHoChiMinh(ctx); break;
      case 8: this._drawMienTay(ctx); break;
      default: this._drawSapa(ctx); break;
    }
  }

  // ==========================================
  // PANEL 1: SA PA (Fansipan, Cáp treo, Ruộng bậc thang)
  // ==========================================
  _drawSapa(ctx) {
    ctx.save();

    // 1. Sky Gradient
    const sky = ctx.createLinearGradient(0, 0, 0, this.height * 0.55);
    sky.addColorStop(0, '#718f9e');
    sky.addColorStop(0.6, '#a4c0cf');
    sky.addColorStop(1, '#d0dfe7');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height * 0.55);

    // 2. Far Mountain Peaks & Fansipan
    ctx.fillStyle = '#657f91';
    ctx.beginPath();
    ctx.moveTo(0, 220);
    ctx.lineTo(80, 120);
    ctx.lineTo(170, 75); // Fansipan Summit
    ctx.lineTo(260, 140);
    ctx.lineTo(340, 110);
    ctx.lineTo(this.width, 180);
    ctx.lineTo(this.width, 360);
    ctx.lineTo(0, 360);
    ctx.fill();

    // Fansipan Snowy Peak & Red Flag
    ctx.fillStyle = '#e8f1f5';
    ctx.beginPath();
    ctx.moveTo(150, 95);
    ctx.lineTo(170, 75);
    ctx.lineTo(190, 100);
    ctx.fill();

    // Vietnam Flag on Fansipan
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(170, 75);
    ctx.lineTo(170, 60);
    ctx.stroke();
    ctx.fillStyle = '#da251d';
    ctx.fillRect(170, 60, 9, 6);
    ctx.fillStyle = '#ff0';
    ctx.fillRect(173, 62, 3, 2);

    // Mid mountain range
    ctx.fillStyle = '#4e6576';
    ctx.beginPath();
    ctx.moveTo(0, 260);
    ctx.lineTo(90, 200);
    ctx.lineTo(190, 230);
    ctx.lineTo(300, 175);
    ctx.lineTo(this.width, 240);
    ctx.lineTo(this.width, 420);
    ctx.lineTo(0, 420);
    ctx.fill();

    // Cable car cables
    ctx.strokeStyle = 'rgba(40, 55, 70, 0.65)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(0, 140);
    ctx.lineTo(this.width, 260);
    ctx.moveTo(0, 160);
    ctx.lineTo(this.width, 280);
    ctx.stroke();

    // Sliding Cable Cars
    const cabins = [
      { color: '#e63946', offset: 0.18 },
      { color: '#ffd13b', offset: 0.48 },
      { color: '#ff6b35', offset: 0.82 }
    ];
    cabins.forEach(c => {
      const p = (this.cableCarPhase + c.offset) % 1.0;
      const cx = p * this.width;
      const cy = 140 + p * 120;
      // Arm
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, cy + 8);
      ctx.stroke();
      // Cabin
      ctx.fillStyle = c.color;
      ctx.fillRect(cx - 5, cy + 8, 10, 8);
      // Window
      ctx.fillStyle = '#d0f4ff';
      ctx.fillRect(cx - 3, cy + 10, 6, 3);
    });

    // 3. Ruộng bậc thang (Grand Terraced Rice Fields flowing down)
    const terraces = [
      { y: 310, col: '#8ec03f', h: 35 },
      { y: 340, col: '#7ca938', h: 42 },
      { y: 375, col: '#e5c138', h: 46 }, // Golden ripe harvest
      { y: 415, col: '#d4aa28', h: 52 },
      { y: 460, col: '#82b534', h: 58 },
      { y: 510, col: '#6d9c28', h: 65 },
      { y: 565, col: '#ffd13b', h: 75 },
      { y: 630, col: '#50751b', h: 80 }
    ];

    terraces.forEach((t, i) => {
      ctx.fillStyle = t.col;
      ctx.beginPath();
      const wave = Math.sin(i * 1.1) * 22;
      ctx.moveTo(0, t.y + wave);
      ctx.bezierCurveTo(this.width * 0.35, t.y - 14 + wave, this.width * 0.7, t.y + 20 - wave, this.width, t.y + wave);
      ctx.lineTo(this.width, this.height);
      ctx.lineTo(0, this.height);
      ctx.fill();

      // Terrace ridge lip
      ctx.strokeStyle = '#42331c';
      ctx.lineWidth = 1.8;
      ctx.stroke();
    });

    // Mountain rock outcroppings & wildflowers
    ctx.fillStyle = '#444d56';
    ctx.beginPath();
    ctx.ellipse(350, 480, 45, 25, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Wildflower dots (rhododendrons / dã quỳ)
    for (let f = 0; f < 12; f++) {
      ctx.fillStyle = f % 2 === 0 ? '#ff4d6d' : '#ffd13b';
      ctx.beginPath();
      ctx.arc(330 + (f * 7) % 55, 470 + (f * 5) % 30, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // ==========================================
  // PANEL 2: HÀ NỘI (Liễu rủ, Tháp Rùa & Cầu Long Biên)
  // ==========================================
  _drawHanoi(ctx) {
    ctx.save();

    // 1. Sunset Dusk Sky
    const sky = ctx.createLinearGradient(0, 0, 0, this.height * 0.6);
    sky.addColorStop(0, '#3b2844');
    sky.addColorStop(0.35, '#6a4058');
    sky.addColorStop(0.7, '#ba6868');
    sky.addColorStop(1, '#f7b08d');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height * 0.6);

    // 2. Long Biên Bridge spanning in the background
    const bY = 280;
    ctx.strokeStyle = 'rgba(75, 45, 60, 0.75)';
    ctx.lineWidth = 1.4;
    // Deck
    ctx.beginPath();
    ctx.moveTo(0, bY);
    ctx.lineTo(this.width, bY);
    ctx.stroke();

    // Cantilever steel truss spans
    for (let lx = 0; lx < this.width; lx += 42) {
      ctx.strokeRect(lx, bY - 16, 38, 16);
      ctx.beginPath();
      ctx.moveTo(lx, bY);
      ctx.lineTo(lx + 19, bY - 16);
      ctx.lineTo(lx + 38, bY);
      ctx.stroke();
      // Glowing streetlight dot
      ctx.fillStyle = '#ffe6a7';
      ctx.fillRect(lx + 18, bY - 18, 3, 3);
    }

    // 3. Hoàn Kiếm Lake Water (Sông Hồng / Hồ Gươm)
    const waterY = 320;
    const waterGrad = ctx.createLinearGradient(0, waterY, 0, this.height);
    waterGrad.addColorStop(0, '#2b3a4a');
    waterGrad.addColorStop(0.5, '#172738');
    waterGrad.addColorStop(1, '#0c1622');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, waterY, this.width, this.height - waterY);

    // Long Biên Bridge water reflection
    ctx.fillStyle = 'rgba(247, 176, 141, 0.15)';
    ctx.fillRect(0, waterY, this.width, 24);

    // 4. Đảo Rùa & Tháp Rùa (Centerpiece)
    const isleX = this.width * 0.5;
    const isleY = 460;

    // Grass Islet
    ctx.fillStyle = '#1c3d25';
    ctx.beginPath();
    ctx.ellipse(isleX, isleY + 28, 75, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Weeping willow shrubs on island
    ctx.fillStyle = '#2d5a37';
    ctx.beginPath();
    ctx.arc(isleX - 52, isleY + 18, 20, 0, Math.PI * 2);
    ctx.arc(isleX + 52, isleY + 18, 22, 0, Math.PI * 2);
    ctx.fill();

    // Tháp Rùa 3 Tầng Cổ Kính
    // Tier 1 (Base)
    ctx.fillStyle = '#9e8c6c';
    ctx.fillRect(isleX - 32, isleY - 10, 64, 38);
    // Tier 2
    ctx.fillRect(isleX - 22, isleY - 36, 44, 26);
    // Tier 3
    ctx.fillRect(isleX - 12, isleY - 56, 24, 20);

    // Roofs
    ctx.fillStyle = '#6b2024';
    ctx.fillRect(isleX - 38, isleY - 12, 76, 5);
    ctx.fillRect(isleX - 26, isleY - 38, 52, 4);
    ctx.fillRect(isleX - 15, isleY - 58, 30, 4);

    // Arched Windows & Doors (Glowing warm amber)
    ctx.fillStyle = '#ffeaa7';
    ctx.fillRect(isleX - 6, isleY + 4, 12, 18);
    ctx.fillRect(isleX - 24, isleY + 8, 8, 14);
    ctx.fillRect(isleX + 16, isleY + 8, 8, 14);
    ctx.fillRect(isleX - 4, isleY - 26, 8, 10);
    ctx.fillRect(isleX - 3, isleY - 50, 6, 8);

    // Tháp Rùa Water Reflection (Detailed mirror ripples)
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#9e8c6c';
    for (let r = 0; r < 8; r++) {
      const ry = isleY + 48 + r * 6;
      const rw = (54 - r * 5) + Math.sin(this.animTimer * 3 + r) * 6;
      ctx.fillRect(isleX - rw / 2, ry, rw, 3.5);
    }
    ctx.restore();

    // 5. Cành Liễu Rủ (Weeping Willow Draping from Top Corners)
    this._drawWillowBranch(ctx, 0, 0, 1);
    this._drawWillowBranch(ctx, this.width, 0, -1);

    ctx.restore();
  }

  _drawWillowBranch(ctx, startX, startY, dir) {
    ctx.save();
    ctx.strokeStyle = '#382b1d';
    ctx.lineWidth = 2.0;

    // Main branches
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(startX + dir * 60, startY + 40, startX + dir * 110, startY + 70, startX + dir * 140, startY + 110);
    ctx.stroke();

    // Hanging slender vines with leaves
    const vineEnds = [40, 75, 105, 135];
    vineEnds.forEach((vx, vi) => {
      const bx = startX + dir * vx;
      const by = startY + 20 + vi * 22;
      const vineLen = 70 + (vi % 2) * 35;
      const sway = Math.sin(this.animTimer * 2 + vi) * 8;

      ctx.strokeStyle = 'rgba(56, 102, 65, 0.75)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.bezierCurveTo(bx + dir * 10, by + vineLen * 0.5, bx + sway, by + vineLen * 0.8, bx + sway, by + vineLen);
      ctx.stroke();

      // Willow leaves
      ctx.fillStyle = '#588157';
      for (let ly = by + 12; ly < by + vineLen; ly += 10) {
        ctx.beginPath();
        ctx.ellipse(bx + sway * 0.5, ly, 4, 1.8, 0.4 * dir, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.restore();
  }

  // ==========================================
  // PANEL 3: HUẾ (Đại Nội Ngọ Môn & Cầu Tràng Tiền)
  // ==========================================
  _drawHue(ctx) {
    ctx.save();

    // 1. Imperial Twilight Sky
    const sky = ctx.createLinearGradient(0, 0, 0, this.height * 0.55);
    sky.addColorStop(0, '#1c1032');
    sky.addColorStop(0.5, '#351d4d');
    sky.addColorStop(1, '#5a356b');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height * 0.55);

    // Distant Ngự Bình Mountain Silhouettes
    ctx.fillStyle = '#2a163d';
    ctx.beginPath();
    ctx.moveTo(0, 240);
    ctx.lineTo(80, 180);
    ctx.lineTo(160, 210);
    ctx.lineTo(260, 160);
    ctx.lineTo(this.width, 220);
    ctx.lineTo(this.width, 360);
    ctx.lineTo(0, 360);
    ctx.fill();

    // 2. Đại Nội Ngọ Môn (Citadel Palace Walls & Lầu Ngũ Phụng)
    const nmX = this.width * 0.5;
    const nmY = 320;

    // Fortress Stone Wall
    ctx.fillStyle = '#48444c';
    ctx.fillRect(nmX - 110, nmY - 20, 220, 48);

    // Royal Gates (Cửa Ngọ Môn 3 lối)
    ctx.fillStyle = '#ffd13b';
    ctx.fillRect(nmX - 12, nmY + 2, 24, 26);
    ctx.fillStyle = '#d4aa28';
    ctx.fillRect(nmX - 48, nmY + 6, 16, 22);
    ctx.fillRect(nmX + 32, nmY + 6, 16, 22);

    // Lầu Ngũ Phụng (Second Tier)
    ctx.fillStyle = '#9b2226';
    ctx.fillRect(nmX - 70, nmY - 50, 140, 30);

    // Pillars
    ctx.fillStyle = '#d90429';
    for (let c = -60; c <= 60; c += 20) {
      ctx.fillRect(nmX + c - 2, nmY - 50, 4, 30);
    }

    // Golden Imperial Double-Roof (Mái ngói hoàng lưu ly)
    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath();
    ctx.moveTo(nmX - 90, nmY - 50);
    ctx.lineTo(nmX, nmY - 72);
    ctx.lineTo(nmX + 90, nmY - 50);
    ctx.fill();

    // Roof finials
    ctx.strokeStyle = '#ffbe0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(nmX - 92, nmY - 52);
    ctx.lineTo(nmX - 98, nmY - 58);
    ctx.moveTo(nmX + 92, nmY - 52);
    ctx.lineTo(nmX + 98, nmY - 58);
    ctx.stroke();

    // 3. Perfume River (Sông Hương)
    const riverY = 370;
    const rGrad = ctx.createLinearGradient(0, riverY, 0, this.height);
    rGrad.addColorStop(0, '#1a1f38');
    rGrad.addColorStop(0.5, '#101526');
    rGrad.addColorStop(1, '#080c18');
    ctx.fillStyle = rGrad;
    ctx.fillRect(0, riverY, this.width, this.height - riverY);

    // 4. CẦU TRÀNG TIỀN 6 VÀI 12 NHỊP (Rainbow Neon Arches)
    const bridgeY = 460;
    // Bridge Deck
    ctx.fillStyle = '#222d42';
    ctx.fillRect(0, bridgeY, this.width, 10);

    // Rainbow Neon Colors for each arch
    const archColors = ['#00f0ff', '#3a86ff', '#8338ec', '#ff006e', '#fb5607', '#05ffa1'];
    const spanW = this.width / 6;

    for (let i = 0; i < 6; i++) {
      const ax = i * spanW;
      const col = archColors[i];

      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.8;
      ctx.shadowColor = col;
      ctx.shadowBlur = 10;

      // Parabolic Steel Arch
      ctx.beginPath();
      ctx.moveTo(ax, bridgeY);
      ctx.quadraticCurveTo(ax + spanW / 2, bridgeY - 32, ax + spanW, bridgeY);
      ctx.stroke();

      // Vertical suspension trusses
      ctx.lineWidth = 1.0;
      ctx.shadowBlur = 0;
      for (let t = 1; t <= 3; t++) {
        const tx = ax + (spanW / 4) * t;
        const ty = bridgeY - Math.sin((t / 4) * Math.PI) * 28;
        ctx.beginPath();
        ctx.moveTo(tx, bridgeY);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }

      // Shimmering Rainbow River Reflections
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = col;
      for (let rf = 0; rf < 5; rf++) {
        const rfy = bridgeY + 16 + rf * 7;
        const rfw = spanW * 0.6 + Math.sin(this.animTimer * 3 + i + rf) * 8;
        ctx.fillRect(ax + spanW * 0.2, rfy, rfw, 3);
      }
      ctx.restore();
    }

    ctx.restore();
  }

  // ==========================================
  // PANEL 4: ĐÀ NẴNG (Cầu Rồng phun lửa, Skyline & Sông Hàn)
  // ==========================================
  _drawDaNang(ctx) {
    ctx.save();

    // 1. Midnight Blue Sky
    const sky = ctx.createLinearGradient(0, 0, 0, this.height * 0.55);
    sky.addColorStop(0, '#061022');
    sky.addColorStop(0.5, '#0c1d3c');
    sky.addColorStop(1, '#152e5a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height * 0.55);

    // 2. Modern City Skyline & Lit Windows
    const buildings = [
      { x: 10, w: 32, h: 140, col: '#122442' },
      { x: 48, w: 28, h: 175, col: '#162d52' },
      { x: 82, w: 40, h: 210, col: '#10223e' },
      { x: 128, w: 34, h: 160, col: '#14294a' },
      { x: 168, w: 46, h: 230, col: '#18335c' },
      { x: 220, w: 36, h: 185, col: '#122544' },
      { x: 262, w: 42, h: 200, col: '#152c50' },
      { x: 310, w: 38, h: 155, col: '#11223e' },
      { x: 354, w: 40, h: 170, col: '#132646' }
    ];

    const horizonY = 360;
    buildings.forEach(b => {
      ctx.fillStyle = b.col;
      ctx.fillRect(b.x, horizonY - b.h, b.w, b.h);

      // Lit Windows (Cyan, gold, white)
      for (let wy = horizonY - b.h + 12; wy < horizonY - 10; wy += 14) {
        for (let wx = b.x + 4; wx < b.x + b.w - 4; wx += 8) {
          if ((wx + wy) % 3 === 0) {
            ctx.fillStyle = (wx + wy) % 5 === 0 ? '#00f0ff' : '#ffeaa7';
            ctx.fillRect(wx, wy, 4, 6);
          }
        }
      }
    });

    // 3. Han River Water
    const waterGrad = ctx.createLinearGradient(0, horizonY, 0, this.height);
    waterGrad.addColorStop(0, '#0c1b33');
    waterGrad.addColorStop(0.5, '#071224');
    waterGrad.addColorStop(1, '#030814');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, horizonY, this.width, this.height - horizonY);

    // 4. CẦU RỒNG ĐÀ NẴNG (Golden Dragon Bridge)
    const bridgeY = 430;
    // Road Deck
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, bridgeY, this.width, 12);
    // Road Railing
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(0, bridgeY - 3, this.width, 3);

    // Golden Dragon Body (3 Undulating Arches)
    ctx.save();
    ctx.strokeStyle = '#ffb703';
    ctx.lineWidth = 8.0;
    ctx.shadowColor = '#fb8500';
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.moveTo(0, bridgeY);
    ctx.bezierCurveTo(45, bridgeY - 60, 85, bridgeY - 60, 130, bridgeY);
    ctx.bezierCurveTo(175, bridgeY - 70, 215, bridgeY - 70, 260, bridgeY);
    ctx.bezierCurveTo(295, bridgeY - 80, 325, bridgeY - 80, 355, bridgeY - 35);
    ctx.stroke();

    // Dragon Spine Fins
    ctx.fillStyle = '#ffd166';
    for (let fx = 20; fx < 350; fx += 18) {
      const prog = fx / 350;
      const fy = bridgeY - Math.abs(Math.sin(prog * Math.PI * 2.5)) * 55;
      ctx.fillRect(fx - 2, fy - 6, 4, 6);
    }

    // Dragon Head (Majestic raised golden head)
    const headX = 352;
    const headY = bridgeY - 45;
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.moveTo(headX, headY);
    ctx.lineTo(headX + 26, headY - 14);
    ctx.lineTo(headX + 38, headY + 5);
    ctx.lineTo(headX + 22, headY + 16);
    ctx.closePath();
    ctx.fill();

    // Dragon Eye
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(headX + 16, headY - 4, 4, 4);

    // 5. CINEMATIC FIRE BLAST (Phun lửa rực trời)
    const flameFlicker = Math.sin(this.dragonFlameTimer * 10) * 12;
    const flameLen = 65 + flameFlicker;
    const fGrad = ctx.createRadialGradient(headX + 38, headY + 4, 4, headX + 38 + flameLen * 0.7, headY + 2, flameLen);
    fGrad.addColorStop(0, '#ffffff');
    fGrad.addColorStop(0.2, '#ffd166');
    fGrad.addColorStop(0.6, '#ff5400');
    fGrad.addColorStop(0.9, '#d00000');
    fGrad.addColorStop(1, 'rgba(208, 0, 0, 0)');

    ctx.fillStyle = fGrad;
    ctx.beginPath();
    ctx.moveTo(headX + 36, headY);
    ctx.quadraticCurveTo(headX + 38 + flameLen * 0.5, headY - 22, headX + 38 + flameLen, headY + 2);
    ctx.quadraticCurveTo(headX + 38 + flameLen * 0.5, headY + 24, headX + 36, headY + 8);
    ctx.fill();

    // Drifting embers
    for (let em = 0; em < 8; em++) {
      const ex = headX + 38 + (em * 11 + Math.sin(this.animTimer * 8 + em) * 8);
      const ey = headY + (Math.sin(this.animTimer * 12 + em) * 14);
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(ex, ey, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Golden Water Reflections
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#ffb703';
    for (let wr = 0; wr < 8; wr++) {
      const wry = bridgeY + 20 + wr * 8;
      const wrw = 120 + Math.sin(this.animTimer * 4 + wr) * 30;
      ctx.fillRect(140, wry, wrw, 3);
    }

    ctx.restore();
    ctx.restore();
  }

  // ==========================================
  // PANEL 5: HỘI AN (Chùa Cầu, Phố cổ đèn lồng & Hoa đăng Sông Hoài)
  // ==========================================
  _drawHoiAn(ctx) {
    ctx.save();

    // 1. Midnight Sky
    const sky = ctx.createLinearGradient(0, 0, 0, this.height * 0.55);
    sky.addColorStop(0, '#070c1a');
    sky.addColorStop(0.6, '#10172e');
    sky.addColorStop(1, '#1b2342');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height * 0.55);

    // 2. Floating Sky Lanterns (Thiên đăng bay lên trời)
    for (const l of this.skyLanterns) {
      ctx.save();
      ctx.shadowColor = '#ffd166';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#ffbe0b';
      ctx.fillRect(l.x, l.y, l.size, l.size * 1.3);
      ctx.fillStyle = '#ff0054';
      ctx.fillRect(l.x + l.size * 0.2, l.y + l.size * 0.9, l.size * 0.6, 2);
      ctx.restore();
    }

    // 3. Ancient Town Yellow Shophouses (Hai bên bờ)
    const houseY = 380;
    // Left houses
    ctx.fillStyle = '#e5a93b';
    ctx.fillRect(0, houseY - 60, 130, 80);
    // Right houses
    ctx.fillRect(this.width - 130, houseY - 60, 130, 80);

    // Dark tiled eaves
    ctx.fillStyle = '#3a261a';
    ctx.beginPath();
    ctx.moveTo(-10, houseY - 60);
    ctx.lineTo(135, houseY - 60);
    ctx.lineTo(125, houseY - 50);
    ctx.lineTo(-10, houseY - 50);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(this.width - 135, houseY - 60);
    ctx.lineTo(this.width + 10, houseY - 60);
    ctx.lineTo(this.width + 10, houseY - 50);
    ctx.lineTo(this.width - 125, houseY - 50);
    ctx.fill();

    // Windows & Shutters
    ctx.fillStyle = '#22150c';
    ctx.fillRect(20, houseY - 45, 24, 30);
    ctx.fillRect(70, houseY - 45, 24, 30);
    ctx.fillRect(this.width - 95, houseY - 45, 24, 30);
    ctx.fillRect(this.width - 45, houseY - 45, 24, 30);

    // 4. Chùa Cầu (Japanese Covered Bridge / Lai Viễn Kiều in Center)
    const bridgeX = this.width * 0.5;
    const bY = houseY + 10;

    // Stone Bridge Piers
    ctx.fillStyle = '#5c5247';
    ctx.fillRect(bridgeX - 65, bY, 130, 16);
    ctx.fillRect(bridgeX - 45, bY + 16, 20, 24);
    ctx.fillRect(bridgeX + 25, bY + 16, 20, 24);

    // Wooden Covered Temple Structure
    ctx.fillStyle = '#8b263e';
    ctx.fillRect(bridgeX - 60, bY - 26, 120, 26);

    // Curved Traditional Tile Roof
    ctx.fillStyle = '#4a2818';
    ctx.beginPath();
    ctx.moveTo(bridgeX - 75, bY - 26);
    ctx.bezierCurveTo(bridgeX - 30, bY - 46, bridgeX + 30, bY - 46, bridgeX + 75, bY - 26);
    ctx.lineTo(bridgeX + 68, bY - 20);
    ctx.bezierCurveTo(bridgeX + 25, bY - 38, bridgeX - 25, bY - 38, bridgeX - 68, bY - 20);
    ctx.closePath();
    ctx.fill();

    // Temple Ridge Finial
    ctx.strokeStyle = '#ffbe0b';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(bridgeX - 8, bY - 44);
    ctx.lineTo(bridgeX + 8, bY - 44);
    ctx.stroke();

    // 5. Sông Hoài & Floating Flower Lanterns (Hoa đăng)
    const riverY = bY + 28;
    const rGrad = ctx.createLinearGradient(0, riverY, 0, this.height);
    rGrad.addColorStop(0, '#10162a');
    rGrad.addColorStop(0.5, '#090d1c');
    rGrad.addColorStop(1, '#04060e');
    ctx.fillStyle = rGrad;
    ctx.fillRect(0, riverY, this.width, this.height - riverY);

    // Flower Lanterns bobbing on water
    for (let f = 0; f < 10; f++) {
      const fx = ((f * 42 + Math.sin(this.animTimer + f) * 8) % (this.width - 40)) + 20;
      const fy = riverY + 20 + (f % 4) * 18;
      // Lotus base
      ctx.fillStyle = '#ff0054';
      ctx.beginPath();
      ctx.ellipse(fx, fy + 4, 8, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Candle Flame
      ctx.save();
      ctx.shadowColor = '#ffd166';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(fx, fy - 1, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 6. Top Corner Tiled Eaves & Hanging Lanterns (Matching Reference Image)
    this._drawHoiAnRoofLanterns(ctx, 0, 0, 1);
    this._drawHoiAnRoofLanterns(ctx, this.width, 0, -1);

    ctx.restore();
  }

  _drawHoiAnRoofLanterns(ctx, startX, startY, dir) {
    ctx.save();
    // Eaves
    ctx.fillStyle = '#2b1b12';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + dir * 85, startY);
    ctx.lineTo(startX + dir * 70, startY + 28);
    ctx.lineTo(startX, startY + 22);
    ctx.closePath();
    ctx.fill();

    // Curved eave tip
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(startX + dir * 65, startY + 26);
    ctx.lineTo(startX + dir * 75, startY + 28);
    ctx.stroke();

    // Hanging Lanterns
    const lanternX = [25, 55];
    lanternX.forEach((lx, li) => {
      const bx = startX + dir * lx;
      const by = startY + 25 + li * 4;
      const len = 30 + li * 15;

      // Cord
      ctx.strokeStyle = '#777';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx, by + len);
      ctx.stroke();

      // Glowing Silk Lantern
      ctx.save();
      ctx.shadowColor = li % 2 === 0 ? '#ff0054' : '#ffd166';
      ctx.shadowBlur = 10;
      ctx.fillStyle = li % 2 === 0 ? '#ff0054' : '#ffb703';
      ctx.beginPath();
      ctx.ellipse(bx, by + len + 8, 7, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      // Tassel
      ctx.strokeStyle = '#ffbe0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bx, by + len + 18);
      ctx.lineTo(bx, by + len + 26);
      ctx.stroke();
      ctx.restore();
    });

    ctx.restore();
  }

  // ==========================================
  // PANEL 6: ĐÀ LẠT (Đồi thông, Nhà thờ Con Gà & Hoa Cẩm Tú Cầu)
  // ==========================================
  _drawDaLat(ctx) {
    ctx.save();

    // 1. Romantic Morning Mist Sky
    const sky = ctx.createLinearGradient(0, 0, 0, this.height * 0.55);
    sky.addColorStop(0, '#242538');
    sky.addColorStop(0.4, '#494d66');
    sky.addColorStop(0.8, '#7d849e');
    sky.addColorStop(1, '#adb5cc');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height * 0.55);

    // 2. Multi-layered Pine Hills disappearing into fog
    const hillLayers = [
      { y: 220, col: '#535b75', trees: 16 },
      { y: 270, col: '#3e485e', trees: 20 },
      { y: 320, col: '#2b364a', trees: 24 }
    ];

    hillLayers.forEach(hl => {
      ctx.fillStyle = hl.col;
      ctx.beginPath();
      ctx.moveTo(0, hl.y);
      ctx.quadraticCurveTo(this.width * 0.5, hl.y - 25, this.width, hl.y + 10);
      ctx.lineTo(this.width, this.height);
      ctx.lineTo(0, this.height);
      ctx.fill();

      // Slender Pine Trees
      for (let tx = 10; tx < this.width; tx += hl.trees) {
        const ty = hl.y - 10 + Math.sin(tx * 0.05) * 15;
        // Trunk
        ctx.strokeStyle = '#1e2430';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx, ty - 26);
        ctx.stroke();
        // Foliage tiers
        ctx.fillStyle = hl.col;
        ctx.beginPath();
        ctx.moveTo(tx - 6, ty - 12);
        ctx.lineTo(tx, ty - 32);
        ctx.lineTo(tx + 6, ty - 12);
        ctx.fill();
      }
    });

    // 3. Con Gà Church Steeple (Nhà thờ Chính tòa Đà Lạt Spire)
    const chX = this.width * 0.78;
    const chY = 275;
    // Tower
    ctx.fillStyle = '#b08968';
    ctx.fillRect(chX - 10, chY - 45, 20, 50);
    // Spire
    ctx.fillStyle = '#7f4f24';
    ctx.beginPath();
    ctx.moveTo(chX - 12, chY - 45);
    ctx.lineTo(chX, chY - 80);
    ctx.lineTo(chX + 12, chY - 45);
    ctx.fill();
    // Cross
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(chX, chY - 86);
    ctx.lineTo(chX, chY - 80);
    ctx.moveTo(chX - 3, chY - 84);
    ctx.lineTo(chX + 3, chY - 84);
    ctx.stroke();

    // 4. Hồ Xuân Hương (Misty Lake)
    const lakeY = 360;
    const lGrad = ctx.createLinearGradient(0, lakeY, 0, this.height * 0.65);
    lGrad.addColorStop(0, '#5a657c');
    lGrad.addColorStop(1, '#333e54');
    ctx.fillStyle = lGrad;
    ctx.fillRect(0, lakeY, this.width, this.height * 0.65 - lakeY);

    // Drifting mist ribbons
    ctx.fillStyle = 'rgba(235, 240, 255, 0.35)';
    for (let m = 0; m < 3; m++) {
      const my = lakeY + 12 + m * 16;
      ctx.beginPath();
      ctx.ellipse(this.width * 0.5 + Math.sin(this.animTimer + m) * 25, my, 160, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Cánh Đồng Hoa Cẩm Tú Cầu (Sea of Blooming Hydrangeas covering bottom)
    const meadowY = 440;
    // Green lush meadow ground
    ctx.fillStyle = '#2d5a37';
    ctx.fillRect(0, meadowY, this.width, this.height - meadowY);

    const hydrangeaColors = ['#b8c0ff', '#e7c6ff', '#ffd6ff', '#c8b6ff', '#bbd0ff', '#f1c0e8'];
    for (let row = 0; row < 6; row++) {
      const ry = meadowY + 15 + row * 24;
      const count = 12 + row * 2;
      const step = this.width / count;

      for (let col = 0; col < count; col++) {
        const hx = col * step + (row % 2) * (step * 0.5);
        const hy = ry + Math.sin(col * 1.5 + row) * 6;
        const color = hydrangeaColors[(col + row * 3) % hydrangeaColors.length];

        // Hydrangea Cluster Head
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(hx, hy, 9 + (row * 1.5), 0, Math.PI * 2);
        ctx.fill();

        // Inner Petal Highlights
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(hx - 2, hy - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // ==========================================
  // PANEL 7: TP. HCM (Landmark 81 hoa sen neon, Bitexco & Đại lộ ánh sáng)
  // ==========================================
  _drawHoChiMinh(ctx) {
    ctx.save();

    // 1. Midnight Cyberpunk Sky
    const sky = ctx.createLinearGradient(0, 0, 0, this.height * 0.6);
    sky.addColorStop(0, '#060413');
    sky.addColorStop(0.5, '#120b29');
    sky.addColorStop(1, '#241042');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height * 0.6);

    // 2. Far Skyscrapers & Towers
    const skylineY = 460;
    ctx.fillStyle = '#100e26';
    ctx.fillRect(150, skylineY - 180, 48, 180);
    ctx.fillRect(210, skylineY - 220, 42, 220);
    ctx.fillRect(265, skylineY - 190, 52, 190);
    ctx.fillRect(328, skylineY - 240, 45, 240);

    // 3. Bitexco Financial Tower (Búp sen & Sân đỗ trực thăng)
    const bitX = 230;
    ctx.fillStyle = '#1c1b3d';
    ctx.beginPath();
    ctx.moveTo(bitX - 20, skylineY);
    ctx.quadraticCurveTo(bitX - 16, skylineY - 140, bitX - 5, skylineY - 260);
    ctx.lineTo(bitX + 5, skylineY - 260);
    ctx.quadraticCurveTo(bitX + 16, skylineY - 140, bitX + 20, skylineY);
    ctx.fill();

    // Cantilevered Helipad (Sân đỗ trực thăng phát sáng)
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.ellipse(bitX - 14, skylineY - 160, 16, 4, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // 4. LANDMARK 81 (Tòa nhà cao nhất Việt Nam & Bó tre giật cấp)
    const lmX = 75;
    // Stepped Tube Bundles
    ctx.fillStyle = '#151c38';
    ctx.fillRect(lmX - 35, skylineY - 150, 70, 150);
    ctx.fillRect(lmX - 25, skylineY - 260, 50, 110);
    ctx.fillRect(lmX - 16, skylineY - 350, 32, 90);
    ctx.fillRect(lmX - 8, skylineY - 420, 16, 70);

    // Glowing Neon Cyan Structural Lines
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(lmX - 35, skylineY - 150, 70, 150);
    ctx.strokeRect(lmX - 25, skylineY - 260, 50, 110);
    ctx.strokeRect(lmX - 16, skylineY - 350, 32, 90);
    ctx.strokeRect(lmX - 8, skylineY - 420, 16, 70);

    // Spire & Blinking Aviation Beacon
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(lmX, skylineY - 420);
    ctx.lineTo(lmX, skylineY - 465);
    ctx.stroke();

    ctx.save();
    ctx.fillStyle = Math.sin(this.animTimer * 6) > 0 ? '#ff0054' : '#ffffff';
    ctx.shadowColor = '#ff0054';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(lmX, skylineY - 465, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5. HOA SEN PHÁT SÁNG KHỔNG LỒ TẠI CHÂN LANDMARK 81 (Matching Reference Image)
    const lotusY = skylineY - 12;
    ctx.save();
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#ff007f';

    // Lotus Petals Layer 1
    ctx.beginPath();
    ctx.ellipse(lmX, lotusY, 48, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Lotus Petals Layer 2
    ctx.fillStyle = '#ff70a6';
    for (let p = -3; p <= 3; p++) {
      ctx.beginPath();
      ctx.ellipse(lmX + p * 12, lotusY - 10, 8, 18, (p * 0.15), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 6. Winding S-shaped Sài Gòn River & Glowing Highway Traffic
    const roadY = 460;
    const rGrad = ctx.createLinearGradient(0, roadY, 0, this.height);
    rGrad.addColorStop(0, '#0c152e');
    rGrad.addColorStop(1, '#050914');
    ctx.fillStyle = rGrad;
    ctx.fillRect(0, roadY, this.width, this.height - roadY);

    // River / Expressway S-Curve
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 24;
    ctx.beginPath();
    ctx.moveTo(this.width * 0.45, roadY);
    ctx.bezierCurveTo(this.width * 0.2, roadY + 80, this.width * 0.8, roadY + 140, this.width * 0.3, this.height);
    ctx.stroke();

    // Streaming Yellow Headlights & Red Taillights
    for (const t of this.trafficLights) {
      const p = t.progress;
      // Bezier point approximation
      const tx = (1 - p) * (1 - p) * (this.width * 0.45) + 2 * (1 - p) * p * (this.width * 0.3) + p * p * (this.width * 0.5);
      const ty = roadY + p * (this.height - roadY);
      ctx.fillStyle = t.lane === 'headlight' ? '#ffd13b' : '#ff0054';
      ctx.fillRect(tx - 2, ty - 2, 4, 4);
    }

    ctx.restore();
  }

  // ==========================================
  // PANEL 8: MIỀN TÂY (Cầu Cần Thơ, Rặng dừa nước & Chợ nổi Cái Răng)
  // ==========================================
  _drawMienTay(ctx) {
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
}
