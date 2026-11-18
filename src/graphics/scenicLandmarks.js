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
  // PANEL 1: SA PA (Fansipan, Cáp treo, Ruộng bậc thang)
  
  // ==========================================
  // PANEL 1: SA PA (Bản nâng cấp chuẩn Vector 2D Art)
  // ==========================================
  _drawSapa(ctx) {
    ctx.save();
    const w = this.width;
    const h = this.height;

    // 1. Bầu trời (Sky Gradient)
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.55);
    sky.addColorStop(0, '#6a8596');
    sky.addColorStop(0.5, '#9ab4c4');
    sky.addColorStop(1, '#d4e3ec');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h * 0.55);

    // 2. Lớp mây nền phía xa
    this._drawSoftClouds(ctx, h * 0.28, 0.35, 4);

    // 3. Đỉnh Fansipan Hùng Vĩ (Bên phải)
    const peakX = w * 0.72;
    const peakY = h * 0.255;

    // Thân núi chính
    ctx.fillStyle = '#5c7285';
    ctx.beginPath();
    ctx.moveTo(w * 0.25, h * 0.48);
    ctx.lineTo(w * 0.52, h * 0.35);
    ctx.lineTo(peakX, peakY);
    ctx.lineTo(w * 0.88, h * 0.34);
    ctx.lineTo(w, h * 0.40);
    ctx.lineTo(w, h * 0.52);
    ctx.lineTo(w * 0.25, h * 0.52);
    ctx.closePath();
    ctx.fill();

    // Mảng tối tạo khối 3D cho sườn núi phải
    ctx.fillStyle = '#4b5f70';
    ctx.beginPath();
    ctx.moveTo(peakX, peakY);
    ctx.lineTo(w * 0.76, h * 0.35);
    ctx.lineTo(w * 0.69, h * 0.42);
    ctx.lineTo(w * 0.85, h * 0.48);
    ctx.lineTo(w, h * 0.40);
    ctx.lineTo(w * 0.88, h * 0.34);
    ctx.closePath();
    ctx.fill();

    // Tuyết phủ trên đỉnh Fansipan (Răng cưa tự nhiên)
    ctx.fillStyle = '#eef5f9';
    ctx.beginPath();
    ctx.moveTo(peakX, peakY);
    ctx.lineTo(peakX - 36, peakY + 26);
    ctx.lineTo(peakX - 22, peakY + 22);
    ctx.lineTo(peakX - 12, peakY + 33);
    ctx.lineTo(peakX, peakY + 23);
    ctx.lineTo(peakX + 14, peakY + 34);
    ctx.lineTo(peakX + 22, peakY + 25);
    ctx.lineTo(peakX + 35, peakY + 28);
    ctx.closePath();
    ctx.fill();

    // Bóng đổ trên tuyết (Bên phải)
    ctx.fillStyle = '#cad8e2';
    ctx.beginPath();
    ctx.moveTo(peakX, peakY);
    ctx.lineTo(peakX, peakY + 23);
    ctx.lineTo(peakX + 14, peakY + 34);
    ctx.lineTo(peakX + 22, peakY + 25);
    ctx.lineTo(peakX + 35, peakY + 28);
    ctx.closePath();
    ctx.fill();

    // 4. Lá cờ Việt Nam tung bay trên đỉnh Fansipan
    ctx.strokeStyle = '#2b3540';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(peakX, peakY);
    ctx.lineTo(peakX, peakY - 22);
    ctx.stroke();

    const flagWave = Math.sin(this.animTimer * 5) * 2.5;
    ctx.fillStyle = '#da251d';
    ctx.beginPath();
    ctx.moveTo(peakX, peakY - 22);
    ctx.quadraticCurveTo(peakX + 9, peakY - 24 + flagWave, peakX + 18, peakY - 21 + flagWave * 0.5);
    ctx.lineTo(peakX + 18, peakY - 10 + flagWave * 0.5);
    ctx.quadraticCurveTo(peakX + 9, peakY - 13 + flagWave, peakX, peakY - 10);
    ctx.closePath();
    ctx.fill();

    // Ngôi sao vàng 5 cánh
    this._drawStar(ctx, peakX + 9, peakY - 16 + flagWave * 0.6, 3.2, '#ffbe0b');

    // 5. Dãy núi đá sắc nhọn tiền cảnh (Bên trái & giữa)
    ctx.fillStyle = '#3d4f60';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.43);
    ctx.lineTo(w * 0.14, h * 0.38);
    ctx.lineTo(w * 0.23, h * 0.41);
    ctx.lineTo(w * 0.36, h * 0.34); // Đỉnh nhọn
    ctx.lineTo(w * 0.48, h * 0.41);
    ctx.lineTo(w * 0.58, h * 0.37);
    ctx.lineTo(w * 0.70, h * 0.45);
    ctx.lineTo(w * 0.83, h * 0.37);
    ctx.lineTo(w, h * 0.43);
    ctx.lineTo(w, h * 0.56);
    ctx.lineTo(0, h * 0.56);
    ctx.closePath();
    ctx.fill();

    // Đổ bóng vách đá núi tiền cảnh
    ctx.fillStyle = '#2f3e4d';
    ctx.beginPath();
    ctx.moveTo(w * 0.36, h * 0.34);
    ctx.lineTo(w * 0.41, h * 0.45);
    ctx.lineTo(w * 0.48, h * 0.41);
    ctx.closePath();
    ctx.fill();

    // 6. Biển mây mù giăng ngang thung lũng (Hiệu ứng trôi bồng bềnh)
    this._drawValleyMist(ctx, h * 0.46, 'rgba(222, 233, 240, 0.55)', 0.7);
    this._drawValleyMist(ctx, h * 0.53, 'rgba(232, 241, 246, 0.78)', -0.5);

    // 7. Hệ thống Cáp Treo Fansipan (2 dây cáp song song & Cabin chi tiết)
    const cStartY1 = h * 0.255, cEndY1 = h * 0.365;
    const cStartY2 = h * 0.263, cEndY2 = h * 0.373;

    ctx.strokeStyle = 'rgba(35, 48, 60, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, cStartY1);
    ctx.lineTo(w, cEndY1);
    ctx.moveTo(0, cStartY2);
    ctx.lineTo(w, cEndY2);
    ctx.stroke();

    const cabins = [
      { bodyCol: '#f5a623', bottomCol: '#d98200', offset: 0.22, wire: 1 },
      { bodyCol: '#38a3a5', bottomCol: '#22577a', offset: 0.38, wire: 2 },
      { bodyCol: '#c94a6a', bottomCol: '#8c2d46', offset: 0.68, wire: 2 }
    ];

    cabins.forEach(c => {
      const p = (this.cableCarPhase + c.offset) % 1.0;
      const cx = p * w;
      const cy = (c.wire === 1 ? cStartY1 : cStartY2) + p * (cEndY1 - cStartY1);
      this._drawDetailedCabin(ctx, cx, cy, c.bodyCol, c.bottomCol);
    });

    // 8. RUỘNG BẬC THANG MÙ CANG CHẢI (Chia 2 sườn đồi giao nhau, có độ dày thành ruộng 3D)
    // Sườn đồi bên phải (Xếp lớp từ trên xuống)
    const rightTerraces = [
      { y: h * 0.57, rx: w * 0.52, rw: w * 0.55, rh: 24, top: '#a7c947', side: '#657a24' },
      { y: h * 0.59, rx: w * 0.46, rw: w * 0.60, rh: 28, top: '#bad44b', side: '#738926' },
      { y: h * 0.61, rx: w * 0.40, rw: w * 0.65, rh: 32, top: '#d6cf46', side: '#897d22' },
      { y: h * 0.64, rx: w * 0.35, rw: w * 0.70, rh: 36, top: '#b8cc43', side: '#6b7b21' },
      { y: h * 0.67, rx: w * 0.30, rw: w * 0.75, rh: 40, top: '#e2be36', side: '#94741b' }
    ];
    rightTerraces.forEach(t => {
      this._drawTerraceStep(ctx, t.rx, t.y, t.rw, t.rh, t.top, t.side, false);
    });

    // Sườn đồi bên trái (Uốn lượn đè lên sườn phải)
    const leftTerraces = [
      { y: h * 0.59, lx: -w * 0.05, lw: w * 0.45, lh: 26, top: '#9ec242', side: '#5f7822' },
      { y: h * 0.62, lx: -w * 0.05, lw: w * 0.52, lh: 30, top: '#c6cf45', side: '#7d8022' },
      { y: h * 0.65, lx: -w * 0.05, lw: w * 0.58, lh: 34, top: '#e5be38', side: '#96721c' },
      { y: h * 0.68, lx: -w * 0.05, lw: w * 0.64, lh: 38, top: '#b8ca40', side: '#6d7c21' },
      { y: h * 0.72, lx: -w * 0.05, lw: w * 0.70, lh: 44, top: '#deb435', side: '#8f691b' }
    ];
    leftTerraces.forEach(t => {
      this._drawTerraceStep(ctx, t.lx, t.y, t.lw, t.lh, t.top, t.side, true);
    });

    // Các thảm ruộng lớn tiền cảnh phía dưới cùng (Uốn cong chữ S mềm mại)
    const bottomTerraces = [
      { y: h * 0.75, top: '#f0ca43', side: '#a37b1f', thick: 16, curve: 1 },
      { y: h * 0.80, top: '#c2cf46', side: '#788424', thick: 18, curve: -1 },
      { y: h * 0.85, top: '#e6b835', side: '#966c1a', thick: 20, curve: 1 },
      { y: h * 0.91, top: '#9bbd3e', side: '#59721e', thick: 22, curve: -1 },
      { y: h * 0.96, top: '#ecc642', side: '#99751d', thick: 24, curve: 1 }
    ];
    bottomTerraces.forEach(b => {
      this._drawFullWaveTerrace(ctx, b.y, b.top, b.side, b.thick, b.curve);
    });

    // 9. Chòi gỗ canh lúa (Wooden Stilt Huts)
    this._drawWoodenHut(ctx, w * 0.83, h * 0.56, 0.75); // Chòi nhỏ đồi phải
    this._drawWoodenHut(ctx, w * 0.16, h * 0.71, 1.0);  // Chòi lớn đồi trái

    // 10. Cụm đá tảng & Hoa dại Tây Bắc (Góc phải bên dưới)
    this._drawRockAndFlowers(ctx, w * 0.78, h * 0.73);

    ctx.restore();
  }

  // ==========================================
  // CÁC HÀM PHỤ TRỢ VẼ CHI TIẾT SA PA
  // ==========================================

  // Vẽ ngôi sao vàng trên cờ
  _drawStar(ctx, cx, cy, radius, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Vẽ cabin cáp treo bo tròn hiện đại
  _drawDetailedCabin(ctx, cx, cy, bodyCol, bottomCol) {
    ctx.save();
    // Bánh xe trượt trên cáp
    ctx.fillStyle = '#222';
    ctx.fillRect(cx - 4, cy - 1.5, 8, 3);

    // Cần treo chữ L
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy + 12);
    ctx.stroke();

    // Thân cabin
    const cw = 18, ch = 15;
    const rx = cx - cw / 2, ry = cy + 12;

    // Nửa trên cabin
    ctx.fillStyle = bodyCol;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(rx, ry, cw, ch, 4);
    } else {
      ctx.rect(rx, ry, cw, ch);
    }
    ctx.fill();

    // Nửa dưới cabin (Đậm màu hơn)
    ctx.fillStyle = bottomCol;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(rx, ry + ch * 0.55, cw, ch * 0.45, [0, 0, 4, 4]);
    } else {
      ctx.rect(rx, ry + ch * 0.55, cw, ch * 0.45);
    }
    ctx.fill();

    // 3 ô cửa kính phản quang
    ctx.fillStyle = '#cde8f6';
    ctx.fillRect(rx + 2, ry + 3, 3.5, 5.5);
    ctx.fillRect(rx + 6.8, ry + 3, 4.4, 5.5);
    ctx.fillRect(rx + 12.5, ry + 3, 3.5, 5.5);
    ctx.restore();
  }

  // Vẽ từng bậc thang lúa có vách đất 3D
  _drawTerraceStep(ctx, x, y, w, h, topCol, sideCol, isLeft) {
    ctx.save();
    const cx = isLeft ? x + w : x;

    // Vách đất dựng đứng (Side lip)
    ctx.fillStyle = sideCol;
    ctx.beginPath();
    ctx.ellipse(cx, y + 9, w, h, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mặt ruộng lúa phía trên (Top surface)
    ctx.fillStyle = topCol;
    ctx.beginPath();
    ctx.ellipse(cx, y, w, h * 0.88, 0, 0, Math.PI * 2);
    ctx.fill();

    // Đường viền bờ ruộng sắc nét
    ctx.strokeStyle = 'rgba(60, 45, 20, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
  }

  // Vẽ thảm ruộng bậc thang tiền cảnh chảy tràn màn hình
  _drawFullWaveTerrace(ctx, y, topCol, sideCol, thick, dir) {
    const w = this.width;
    const h = this.height;
    ctx.save();

    // Vách đất
    ctx.fillStyle = sideCol;
    ctx.beginPath();
    ctx.moveTo(0, y + thick);
    ctx.bezierCurveTo(w * 0.35, y + thick - 28 * dir, w * 0.65, y + thick + 28 * dir, w, y + thick - 10 * dir);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Mặt lúa
    ctx.fillStyle = topCol;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(w * 0.35, y - 28 * dir, w * 0.65, y + 28 * dir, w, y - 10 * dir);
    ctx.lineTo(w, y + thick - 10 * dir);
    ctx.bezierCurveTo(w * 0.65, y + thick + 28 * dir, w * 0.35, y + thick - 28 * dir, 0, y + thick);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Vẽ nhà sàn / chòi gỗ trên ruộng bậc thang
  _drawWoodenHut(ctx, x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Bóng đổ dưới đất
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 12, 22, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cột nhà sàn
    ctx.fillStyle = '#3d2616';
    ctx.fillRect(-13, 3, 2.5, 9);
    ctx.fillRect(-4, 4, 2.5, 8);
    ctx.fillRect(5, 4, 2.5, 8);
    ctx.fillRect(12, 3, 2.5, 9);

    // Vách gỗ
    ctx.fillStyle = '#7c5333';
    ctx.fillRect(-15, -10, 30, 14);
    ctx.fillStyle = '#5c3b22'; // Vách hông tối hơn
    ctx.fillRect(4, -10, 11, 14);

    // Ô cửa tối
    ctx.fillStyle = '#29170b';
    ctx.fillRect(-8, -5, 6, 9);

    // Mái tranh / Mái gỗ
    ctx.fillStyle = '#4a301c';
    ctx.beginPath();
    ctx.moveTo(-20, -9);
    ctx.lineTo(-4, -20);
    ctx.lineTo(19, -20);
    ctx.lineTo(6, -9);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#362112';
    ctx.beginPath();
    ctx.moveTo(6, -9);
    ctx.lineTo(19, -20);
    ctx.lineTo(22, -9);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Vẽ cụm đá tảng góc cạnh và thảm hoa dại
  _drawRockAndFlowers(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    const drawPolyRock = (pts, col) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      pts.forEach((p, idx) => idx === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]));
      ctx.closePath();
      ctx.fill();
    };

    // Các khối đá xếp chồng
    drawPolyRock([[-45, 18], [-32, -8], [-8, -12], [12, 18]], '#4a4e52');
    drawPolyRock([[-8, -12], [15, -22], [38, -5], [25, 20], [12, 18]], '#34373b');
    drawPolyRock([[-25, 22], [-10, 2], [18, 4], [30, 25]], '#5a5f63');
    drawPolyRock([[5, 25], [20, 5], [45, 8], [52, 28]], '#2b2d30');

    // Khóm cỏ xanh dưới chân đá
    ctx.fillStyle = '#3a6629';
    [[-35, 18], [-10, 22], [18, 25], [38, 26], [8, 2]].forEach(([gx, gy]) => {
      ctx.beginPath();
      ctx.arc(gx, gy, 8, Math.PI, 0);
      ctx.fill();
    });

    // Hoa dại nhiều màu (Hồng, Vàng, Trắng, Tím)
    const flowers = [
      [-38, 16, '#ff4d6d'], [-32, 14, '#ffd166'], [-14, 20, '#ff4d6d'],
      [-6, 19, '#ffffff'], [14, 22, '#ff4d6d'], [22, 24, '#ffd166'],
      [35, 23, '#b5838d'], [42, 25, '#ff4d6d'], [6, 0, '#ff4d6d'], [11, -2, '#ffd166']
    ];
    flowers.forEach(([fx, fy, col]) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(fx, fy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  // Vẽ mây nền tròn trịa
  _drawSoftClouds(ctx, baseY, alpha, count) {
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    for (let i = 0; i < count; i++) {
      const cx = ((i * 130 + this.scrollX * 0.25) % (this.width + 160)) - 80;
      const cy = baseY + (i % 2) * 18;
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.arc(cx + 22, cy - 8, 34, 0, Math.PI * 2);
      ctx.arc(cx + 48, cy, 26, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Vẽ dải sương mù thung lũng trôi nhẹ
  _drawValleyMist(ctx, y, color, speedMult) {
    ctx.save();
    ctx.fillStyle = color;
    const shift = Math.sin(this.animTimer * speedMult) * 25;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(this.width * 0.3 + shift, y - 22, this.width * 0.7 - shift, y + 22, this.width, y - 8);
    ctx.lineTo(this.width, y + 65);
    ctx.lineTo(0, y + 65);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }


  // ==========================================
  // PANEL 2: NINH BÌNH (Tràng An - Tam Cốc Bích Động)
  // ==========================================
  _drawNinhBinh(ctx) {
    ctx.save();
    const w = this.width;
    const h = this.height;

    // 1. Bầu trời (Warm Sunlight & Soft Gradient)
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.55);
    sky.addColorStop(0, '#fefae0'); // Nắng vàng nhạt phía trên
    sky.addColorStop(0.35, '#fde1b1');
    sky.addColorStop(0.7, '#f4cf9a');
    sky.addColorStop(1, '#e2efeb'); // Mờ dần khi xuống gần thung lũng
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h * 0.55);

    // 2. Mây bồng bềnh sau núi
    this._drawSoftNBMistyClouds(ctx, h * 0.32, 0.28, 3);

    // 3. Những cánh chim bay (Cảnh sắc Tràng An tự nhiên)
    this._drawFlockOfBirds(ctx);

    // 4. Quần thể núi đá vôi trùng điệp (Núi phía xa)
    ctx.fillStyle = '#6b7a5a'; // Núi xa nhất (Đồng màu sương)
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.48);
    ctx.lineTo(w * 0.45, h * 0.32);
    ctx.lineTo(w * 0.52, h * 0.42);
    ctx.lineTo(w * 0.61, h * 0.28);
    ctx.lineTo(w * 0.72, h * 0.45);
    ctx.lineTo(w, h * 0.3);
    ctx.lineTo(w, h * 0.52);
    ctx.lineTo(w * 0.2, h * 0.52);
    ctx.closePath();
    ctx.fill();

    // Dãy núi đá vôi hùng vĩ trung cảnh (Tầng núi chính)
    ctx.fillStyle = '#415a45'; // Tông xanh lá sẫm tự nhiên của thảm thực vật ôm núi
    ctx.beginPath();
    ctx.moveTo(0, h * 0.44);
    ctx.lineTo(w * 0.12, h * 0.36);
    ctx.lineTo(w * 0.22, h * 0.34);
    ctx.lineTo(w * 0.36, h * 0.43);
    ctx.lineTo(w * 0.48, h * 0.29);
    ctx.lineTo(w * 0.58, h * 0.45);
    ctx.lineTo(w * 0.7, h * 0.31);
    ctx.lineTo(w * 0.85, h * 0.27); // Ngọn núi nhô cao bên phải
    ctx.lineTo(w * 0.95, h * 0.38);
    ctx.lineTo(w, h * 0.32);
    ctx.lineTo(w, h * 0.6);
    ctx.lineTo(0, h * 0.6);
    ctx.closePath();
    ctx.fill();

    // Tạo khối đá cho các ngọn núi trung cảnh (Vách đá tối & sáng)
    ctx.fillStyle = '#314234'; // Bóng vách tối
    ctx.beginPath();
    ctx.moveTo(w * 0.12, h * 0.36);
    ctx.lineTo(w * 0.18, h * 0.44);
    ctx.lineTo(w * 0.28, h * 0.39);
    ctx.lineTo(w * 0.36, h * 0.43);
    ctx.lineTo(w * 0.48, h * 0.29);
    ctx.lineTo(w * 0.44, h * 0.4);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#5c7f55'; // Sườn núi nhận sáng nắng vàng
    ctx.beginPath();
    ctx.moveTo(w * 0.7, h * 0.31);
    ctx.lineTo(w * 0.85, h * 0.27);
    ctx.lineTo(w * 0.81, h * 0.42);
    ctx.closePath();
    ctx.fill();

    // 5. Cổng tam quan đền đài cổ (Góc trái bờ sông)
    this._drawAncientTempleGate(ctx, w * 0.24, h * 0.63, 0.85);

    // 6. Dòng sông Ngô Đồng (Sông xanh biếc, hiền hòa, trù phú)
    const riverY = h * 0.62;
    const rivGrad = ctx.createLinearGradient(0, riverY, 0, h);
    rivGrad.addColorStop(0, '#2a9d8f'); // Xanh ngọc bích Tràng An
    rivGrad.addColorStop(0.5, '#264653');
    rivGrad.addColorStop(1, '#1b3438');
    ctx.fillStyle = rivGrad;
    ctx.fillRect(0, riverY, w, h - riverY);

    // Vệt nước lấp lánh tự nhiên trên sông
    this._drawWaterRipples(ctx, riverY);

    // Dòng sông uốn lượn hình chữ S
    ctx.strokeStyle = '#327f71';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(w * 0.5, riverY);
    ctx.bezierCurveTo(w * 0.35, h * 0.72, w * 0.75, h * 0.84, w * 0.45, h);
    ctx.stroke();

    // 7. Thuyền nan mộc mạc và người lái thuyền (Floating on Ngo Dong River)
    const boats = [
      { x: w * 0.38, y: h * 0.71, scale: 0.6, oarPhase: 0 },
      { x: w * 0.62, y: h * 0.76, scale: 0.55, oarPhase: 1.5 },
      { x: w * 0.48, y: h * 0.85, scale: 0.7, oarPhase: 0.8 },
      { x: w * 0.53, y: h * 0.91, scale: 0.65, oarPhase: 2.1 }
    ];
    boats.forEach((b, idx) => {
      const bob = Math.sin(this.animTimer * 2.5 + idx) * 3;
      this._drawNinhBinhRowboat(ctx, b.x, b.y + bob, b.scale, b.oarPhase);
    });

    // 8. Rặng cây, thảm cỏ, lau sậy rậm rạp hai bên bờ
    this._drawLushFoliagePlanks(ctx, 0, h * 0.60, 1);
    this._drawLushFoliagePlanks(ctx, w, h * 0.65, -1);

    // 9. Cây bụi lớn rậm rạp sẫm màu tiền cảnh phía dưới
    this._drawForegroundRiverside(ctx, w * 0.05, h * 0.81);

    ctx.restore();
  }

  // ==========================================
  // CÁC HÀM PHỤ TRỢ CHI TIẾT NINH BÌNH
  // ==========================================

  // Vẽ đàn chim bay (Flock of Birds)
  _drawFlockOfBirds(ctx) {
    ctx.save();
    ctx.strokeStyle = '#3d4a36';
    ctx.lineWidth = 1.2;
    const birds = [
      { x: this.width * 0.68, y: this.height * 0.28, size: 6 },
      { x: this.width * 0.74, y: this.height * 0.26, size: 5 },
      { x: this.width * 0.62, y: this.height * 0.32, size: 7 },
      { x: this.width * 0.54, y: this.height * 0.36, size: 6.5 },
      { x: this.width * 0.49, y: this.height * 0.34, size: 5.5 }
    ];
    birds.forEach((bird, idx) => {
      const swing = Math.sin(this.animTimer * 6 + idx) * 2;
      const bx = bird.x - (this.animTimer * 10) % 250; // Trôi nhẹ qua trái
      const by = bird.y;

      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(bx + bird.size * 0.5, by - bird.size * 0.4 + swing, bx + bird.size, by);
      ctx.quadraticCurveTo(bx + bird.size * 1.5, by - bird.size * 0.4 + swing, bx + bird.size * 2, by);
      ctx.stroke();
    });
    ctx.restore();
  }

  // Vẽ cổng tam quan đá cổ kính ẩn hiện (Ancient Temple Gate)
  _drawAncientTempleGate(ctx, x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Mái ngói đền cổ màu đỏ sẫm bám rêu
    ctx.fillStyle = '#4a2318';
    // Mái tầng trên
    ctx.beginPath();
    ctx.moveTo(-15, -18);
    ctx.quadraticCurveTo(0, -28, 15, -18);
    ctx.lineTo(12, -14);
    ctx.quadraticCurveTo(0, -22, -12, -14);
    ctx.closePath();
    ctx.fill();

    // Mái tầng dưới rộng hơn
    ctx.beginPath();
    ctx.moveTo(-28, -6);
    ctx.quadraticCurveTo(0, -14, 28, -6);
    ctx.lineTo(24, -2);
    ctx.quadraticCurveTo(0, -8, -24, -2);
    ctx.closePath();
    ctx.fill();

    // Thân tháp và cột trụ đá phong rêu
    ctx.fillStyle = '#5c5247'; // Đá xám phong rêu
    ctx.fillRect(-18, -14, 36, 12);
    // Cổng chính
    ctx.fillRect(-24, -2, 48, 18);

    // Vòm cổng tam quan (Cổng đá cũ)
    ctx.fillStyle = '#171513';
    ctx.beginPath();
    ctx.arc(0, 16, 8, Math.PI, 0, false);
    ctx.lineTo(8, 16);
    ctx.lineTo(-8, 16);
    ctx.closePath();
    ctx.fill();

    // Cổng phụ hai bên
    ctx.beginPath();
    ctx.arc(-16, 16, 4, Math.PI, 0, false);
    ctx.lineTo(-12, 16);
    ctx.lineTo(-20, 16);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(16, 16, 4, Math.PI, 0, false);
    ctx.lineTo(20, 16);
    ctx.lineTo(12, 16);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Vẽ chiếc thuyền nan và người chèo (Thuyền nan mộc mạc)
  _drawNinhBinhRowboat(ctx, x, y, scale, oarPhase) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Thân thuyền nan mộc bằng tre đan/gỗ
    ctx.fillStyle = '#a68058';
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.quadraticCurveTo(0, 6, 18, 0);
    ctx.quadraticCurveTo(0, -4, -18, 0);
    ctx.closePath();
    ctx.fill();

    // Lớp gỗ lót sẫm màu phía trong thuyền
    ctx.fillStyle = '#7a5a3a';
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.quadraticCurveTo(0, 4, 14, 0);
    ctx.quadraticCurveTo(0, -2, -14, 0);
    ctx.closePath();
    ctx.fill();

    // Người row (Mặc quần áo sẫm, đội nón lá)
    ctx.fillStyle = '#264653';
    ctx.fillRect(-6, -8, 5, 8); // Áo bà ba sẫm
    ctx.fillStyle = '#f4a261'; // Nón lá mộc mạc
    ctx.beginPath();
    ctx.moveTo(-10, -8);
    ctx.lineTo(-4, -15);
    ctx.lineTo(2, -8);
    ctx.closePath();
    ctx.fill();

    // Du khách ngắm cảnh (Phía trước)
    ctx.fillStyle = '#e76f51';
    ctx.fillRect(4, -6, 5, 6);
    ctx.fillStyle = '#e9c46a'; // Nón lá/Mũ du khách
    ctx.beginPath();
    ctx.moveTo(1, -6);
    ctx.lineTo(6, -11);
    ctx.lineTo(11, -6);
    ctx.closePath();
    ctx.fill();

    // Mái chèo nhấp nhô dưới sông (Animated Oars)
    const oarSway = Math.sin(this.animTimer * 2 + oarPhase) * 6;
    ctx.strokeStyle = '#4a2f18';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-3, -2);
    ctx.lineTo(-10 + oarSway, 8);
    ctx.moveTo(-3, -2);
    ctx.lineTo(4 - oarSway, 8);
    ctx.stroke();

    ctx.restore();
  }

  // Vẽ rặng lau sậy & cây cối rậm rạp hai bên sườn núi
  _drawLushFoliagePlanks(ctx, startX, startY, dir) {
    ctx.save();
    ctx.fillStyle = '#1e3822'; // Màu bụi cỏ sẫm
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(startX + dir * 68, startY + 60, startX + dir * 52, this.height);
    ctx.lineTo(startX, this.height);
    ctx.closePath();
    ctx.fill();

    // Vẽ lá cọ, xum xuê thực vật (tropical palms / lau sậy)
    ctx.strokeStyle = '#2d4a22';
    ctx.lineWidth = 2.0;
    for (let p = 0; p < 9; p++) {
      const py = startY + 25 + p * 38;
      ctx.beginPath();
      ctx.moveTo(startX, py);
      ctx.quadraticCurveTo(startX + dir * 62, py - 18, startX + dir * 78, py + 12);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Vẽ cảnh bụi cây rực rỡ và lau sậy tự nhiên ở mặt nước (Bên trái dưới cùng)
  _drawForegroundRiverside(ctx, startX, startY) {
    ctx.save();
    ctx.translate(startX, startY);

    // Cây bụi lớn rậm rạp màu xanh sẫm
    ctx.fillStyle = '#0f241a';
    ctx.beginPath();
    ctx.arc(-20, 45, 32, 0, Math.PI * 2);
    ctx.arc(8, 32, 28, 0, Math.PI * 2);
    ctx.arc(38, 52, 24, 0, Math.PI * 2);
    ctx.fill();

    // Lá cọ và cỏ dại nhô cao lấp lánh
    ctx.strokeStyle = '#1d3f23';
    ctx.lineWidth = 2.2;
    for (let c = 0; c < 8; c++) {
      const cy = 40 + c * 8;
      const cx = -10 + c * 6;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.quadraticCurveTo(cx - 15, cy - 36, cx - 28, cy - 42);
      ctx.stroke();
    }

    // Các cụm lau sậy nhỏ
    ctx.fillStyle = '#d4a373'; // Màu bông lau vàng nhạt
    for (let r = 0; r < 5; r++) {
      const rx = 12 + r * 6;
      const ry = 42 - r * 3;
      ctx.fillRect(rx, ry, 2.5, 3.5);
    }
    ctx.restore();
  }

  // Vẽ mây sương nhạt trên đồi núi (Misty Clouds)
  _drawSoftNBMistyClouds(ctx, baseY, alpha, count) {
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    for (let i = 0; i < count; i++) {
      const cx = ((i * 150 + this.scrollX * 0.18) % (this.width + 180)) - 90;
      const cy = baseY + (i % 2) * 14;
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.arc(cx + 25, cy - 10, 38, 0, Math.PI * 2);
      ctx.arc(cx + 52, cy, 30, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Vẽ vệt lấp lánh gợn nước sông tự nhiên
  _drawWaterRipples(ctx, startY) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.0;
    for (let i = 0; i < 15; i++) {
      const ry = startY + 22 + i * 26;
      const rx = ((this.scrollX * 0.8 + i * 85) % this.width);
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + 42, ry);
      ctx.stroke();
    }
    ctx.restore();
  }


  // ==========================================
  // PANEL 3: HÀ NỘI (Tháp Rùa Hồ Gươm & Cầu Long Biên)
  // ==========================================
  _drawHanoi(ctx) {
    ctx.save();
    const w = this.width;
    const h = this.height;

    // 1. Bầu trời hoàng hôn / chập tối (Sunset Dusk Sky)
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.58);
    sky.addColorStop(0, '#382b4a'); // Tím tối trên cao
    sky.addColorStop(0.35, '#5e3e56');
    sky.addColorStop(0.65, '#9e5554');
    sky.addColorStop(0.9, '#e48a68');
    sky.addColorStop(1, '#fbd9ad'); // Cam nhạt sát chân trời
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h * 0.58);

    // 2. Mây chiều lãng đãng và mặt trăng, đàn chim
    this._drawSoftHNMistyClouds(ctx, h * 0.28, 0.22, 3);
    this._drawTinyMoon(ctx, w * 0.62, h * 0.12);
    this._drawHanoiBirds(ctx);

    // 3. Cầu Long Biên lịch sử (Cantilever Steel Truss Bridge in background)
    const bridgeY = h * 0.52;
    ctx.fillStyle = '#1e1a29'; // Màu bóng thép cũ của cầu
    ctx.fillRect(0, bridgeY, w, 8); // Mặt cầu

    // Các nhịp cầu thép uốn lượn (Truss spans)
    ctx.strokeStyle = '#1e1a29';
    ctx.lineWidth = 1.5;
    const spanWidth = 84;
    const numSpans = Math.ceil(w / spanWidth) + 1;
    for (let i = 0; i < numSpans; i++) {
      const sx = i * spanWidth - 40;
      ctx.beginPath();
      // Nhịp giàn thép chữ V ngược kiểu Long Biên
      ctx.moveTo(sx, bridgeY);
      ctx.lineTo(sx + spanWidth * 0.5, bridgeY - 32);
      ctx.lineTo(sx + spanWidth, bridgeY);
      ctx.stroke();

      // Các giằng thép chéo bên trong
      ctx.beginPath();
      ctx.moveTo(sx + spanWidth * 0.25, bridgeY);
      ctx.lineTo(sx + spanWidth * 0.5, bridgeY - 32);
      ctx.lineTo(sx + spanWidth * 0.75, bridgeY);
      ctx.moveTo(sx, bridgeY);
      ctx.lineTo(sx + spanWidth * 0.5, bridgeY - 16);
      ctx.lineTo(sx + spanWidth, bridgeY);
      ctx.stroke();

      // Các cột trụ cầu đỡ nhịp dưới nước
      ctx.fillStyle = '#1e1a29';
      ctx.fillRect(sx, bridgeY, 8, 28);
      ctx.fillRect(sx + spanWidth - 8, bridgeY, 8, 28);

      // Điểm sáng đèn đường li ti (Golden Bridge lights)
      ctx.fillStyle = '#ffbe0b';
      ctx.beginPath();
      ctx.arc(sx + spanWidth * 0.5, bridgeY - 3, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Mặt nước Hồ Gươm / Sông Hồng (Glow reflection)
    const waterY = bridgeY + 22;
    const waterGrad = ctx.createLinearGradient(0, waterY, 0, h);
    waterGrad.addColorStop(0, '#262942');
    waterGrad.addColorStop(0.4, '#1b1d30');
    waterGrad.addColorStop(1, '#0e0f1c');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, waterY, w, h - waterY);

    // Bóng phản chiếu cầu Long Biên nhạt nhòa trên sông
    ctx.fillStyle = 'rgba(247, 176, 141, 0.08)';
    ctx.fillRect(0, waterY, w, 32);

    // 5. Đảo ngọc Tháp Rùa cổ kính rực sáng (Turtle Tower & Isle in Center)
    const isleX = w * 0.61;
    const isleY = h * 0.71;

    // Thảm cỏ đảo ngọc xanh ngời dưới ánh đèn đêm
    const grdn = ctx.createRadialGradient(isleX, isleY + 12, 10, isleX, isleY + 12, 120);
    grdn.addColorStop(0, '#527942'); // Sáng rực bên trong
    grdn.addColorStop(0.6, '#354a2a');
    grdn.addColorStop(1, 'rgba(23, 43, 20, 0)'); // Chìm vào mặt nước tối
    ctx.fillStyle = grdn;
    ctx.beginPath();
    ctx.ellipse(isleX, isleY + 12, 105, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rặng cây, bụi cỏ nhỏ ven bờ đảo ngọc
    ctx.fillStyle = '#21331c';
    ctx.beginPath();
    ctx.arc(isleX - 70, isleY + 6, 10, 0, Math.PI * 2);
    ctx.arc(isleX - 45, isleY + 4, 13, 0, Math.PI * 2);
    ctx.arc(isleX + 45, isleY + 3, 14, 0, Math.PI * 2);
    ctx.arc(isleX + 68, isleY + 5, 11, 0, Math.PI * 2);
    ctx.fill();

    // VẼ THÁP RÙA 3 TẦNG CỔ KÍNH
    this._drawDetailedTurtleTower(ctx, isleX, isleY);

    // 6. Cành liễu rủ thơ mộng (Trôi từ mép trên hai bên bờ)
    this._drawCascadingWillow(ctx, 0, 0, 1);
    this._drawCascadingWillow(ctx, w, 0, -1);

    // 7. Chi tiết lan can đá Hồ Gươm & Biển báo xưa cũ (Góc trái tiền cảnh)
    this._drawLakePromenade(ctx, w * 0.02, h * 0.81);

    // Gợn nước đêm gợn nhẹ và phản chiếu lung linh
    this._drawNightWaterRipples(ctx, waterY, isleX, isleY);

    ctx.restore();
  }

  // ==========================================
  // CÁC HÀM PHỤ TRỢ CHI TIẾT HÀ NỘI
  // ==========================================

  // Vẽ Tháp Rùa cổ kính rực sáng tự nhiên
  _drawDetailedTurtleTower(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Ánh hào quang tỏa ra từ tháp
    const thapGlow = ctx.createRadialGradient(0, -25, 5, 0, -25, 75);
    thapGlow.addColorStop(0, 'rgba(255, 190, 11, 0.38)');
    thapGlow.addColorStop(0.5, 'rgba(255, 150, 0, 0.12)');
    thapGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = thapGlow;
    ctx.beginPath();
    ctx.arc(0, -25, 75, 0, Math.PI * 2);
    ctx.fill();

    // TẦNG 1 (Dưới cùng)
    ctx.fillStyle = '#6b5e4c'; // Đá xám nâu cổ
    ctx.fillRect(-34, -18, 68, 22);
    ctx.fillStyle = '#4a3f31'; // Mảng tối bên phải tạo khối
    ctx.fillRect(10, -18, 24, 22);

    // Tầng mái 1
    ctx.fillStyle = '#3a201c';
    ctx.beginPath();
    ctx.moveTo(-38, -18);
    ctx.quadraticCurveTo(0, -23, 38, -18);
    ctx.lineTo(34, -14);
    ctx.quadraticCurveTo(0, -18, -34, -14);
    ctx.closePath();
    ctx.fill();

    // Các vòm cửa Tầng 1 (Ánh sáng rực ấm từ bên trong)
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(-22, -2, 5, Math.PI, 0, false); ctx.lineTo(-17, 4); ctx.lineTo(-27, 4); ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -5, 7, Math.PI, 0, false); ctx.lineTo(7, 4); ctx.lineTo(-7, 4); ctx.fill();
    ctx.beginPath();
    ctx.arc(22, -2, 5, Math.PI, 0, false); ctx.lineTo(27, 4); ctx.lineTo(17, 4); ctx.fill();

    // TẦNG 2 (Giữa)
    ctx.fillStyle = '#7a6c58';
    ctx.fillRect(-24, -40, 48, 22);
    ctx.fillStyle = '#5c5040';
    ctx.fillRect(4, -40, 20, 22);

    // Tầng mái 2
    ctx.fillStyle = '#3a201c';
    ctx.beginPath();
    ctx.moveTo(-28, -40);
    ctx.quadraticCurveTo(0, -45, 28, -40);
    ctx.lineTo(24, -36);
    ctx.quadraticCurveTo(0, -40, -24, -36);
    ctx.closePath();
    ctx.fill();

    // Các vòm cửa Tầng 2 (Nhỏ hơn)
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(-14, -26, 3.5, Math.PI, 0, false); ctx.lineTo(-10.5, -18); ctx.lineTo(-17.5, -18); ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -28, 4.5, Math.PI, 0, false); ctx.lineTo(4.5, -18); ctx.lineTo(-4.5, -18); ctx.fill();
    ctx.beginPath();
    ctx.arc(14, -26, 3.5, Math.PI, 0, false); ctx.lineTo(17.5, -18); ctx.lineTo(10.5, -18); ctx.fill();

    // TẦNG 3 & ĐỈNH THÁP (Trên cùng)
    ctx.fillStyle = '#8c7d67';
    ctx.fillRect(-12, -56, 24, 16);
    ctx.fillStyle = '#6b5e4c';
    ctx.fillRect(2, -56, 10, 16);

    // Vòm cửa Tầng 3
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(0, -48, 3, Math.PI, 0, false); ctx.lineTo(3, -40); ctx.lineTo(-3, -40); ctx.fill();

    // Mái chóp nhỏ trên cùng (Kiểu lầu vọng)
    ctx.fillStyle = '#4a2318';
    ctx.beginPath();
    ctx.moveTo(-15, -56);
    ctx.quadraticCurveTo(0, -66, 15, -56);
    ctx.lineTo(12, -52);
    ctx.quadraticCurveTo(0, -60, -12, -52);
    ctx.closePath();
    ctx.fill();

    // Đỉnh chóp có trang trí mái rồng cách điệu
    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath();
    ctx.moveTo(-1, -66);
    ctx.lineTo(1, -66);
    ctx.lineTo(0, -71);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Vẽ cành liễu rủ đung đưa gió (Cascading Weeping Willow)
  _drawCascadingWillow(ctx, startX, startY, dir) {
    ctx.save();
    ctx.strokeStyle = '#241a12';
    ctx.lineWidth = 2.5;

    // Thân cành chính vươn ra từ góc khuất
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(startX + dir * 65, startY + 38, startX + dir * 110, startY + 58, startX + dir * 145, startY + 98);
    ctx.stroke();

    // Nhánh phụ và lá liễu mềm mại rủ xuống
    const points = [35, 70, 105, 135];
    points.forEach((offset, idx) => {
      const bx = startX + dir * offset;
      const by = startY + 22 + idx * 18;
      const length = 85 + (idx % 2) * 35;
      const sway = Math.sin(this.animTimer * 1.5 + idx) * 8; // Đung đưa nhẹ

      // Sợi dây lá liễu
      ctx.strokeStyle = 'rgba(46, 82, 51, 0.72)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.bezierCurveTo(bx + dir * 10, by + length * 0.4, bx + sway, by + length * 0.7, bx + sway, by + length);
      ctx.stroke();

      // Những cụm lá liễu mảnh nhỏ song song
      ctx.fillStyle = '#3a5f3e';
      for (let ly = by + 12; ly < by + length; ly += 9) {
        ctx.beginPath();
        ctx.ellipse(bx + (sway * (ly - by) / length) * 0.6, ly, 3.5, 1.5, 0.5 * dir, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.restore();
  }

  // Vẽ bờ lan can đá, biển báo cũ & khóm cây (Góc trái tiền cảnh)
  _drawLakePromenade(ctx, startX, startY) {
    ctx.save();
    ctx.translate(startX, startY);

    // Lan can đá cũ rêu phong (Balustrade)
    ctx.fillStyle = '#2f353a'; // Đá xám đậm
    ctx.fillRect(0, 48, 92, 10); // Tay vịn lan can
    ctx.fillRect(0, 75, 92, 6);  // Chân đỡ

    // Các con tiện lan can chẵn cách
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(10 + i * 16, 58, 6, 17);
    }
    // Trụ đá lan can lớn ở đầu
    ctx.fillStyle = '#42494f';
    ctx.fillRect(74, 40, 12, 45);

    // Biển báo & Cột biển báo cũ mang dấu ấn Hà Nội
    ctx.fillStyle = '#171513';
    ctx.fillRect(36, 12, 3, 40); // Cột biển
    ctx.fillStyle = '#1b2d35';  // Khung biển báo xanh sẫm
    ctx.fillRect(12, 18, 28, 8);
    ctx.fillRect(40, 24, 26, 8);

    // Viền trắng mảnh của biển báo cũ
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(13, 19, 26, 6);
    ctx.strokeRect(41, 25, 24, 6);

    // Rặng lau sậy & Cọ lùn ven bờ hồ tối
    ctx.fillStyle = '#0f1f14'; // Bụi cây đậm bóng đêm
    ctx.beginPath();
    ctx.arc(-22, 52, 36, 0, Math.PI * 2);
    ctx.arc(12, 45, 28, 0, Math.PI * 2);
    ctx.arc(42, 62, 22, 0, Math.PI * 2);
    ctx.fill();

    // Lá dừa/Cỏ dại xum xuê nhô lên
    ctx.strokeStyle = '#1e3822';
    ctx.lineWidth = 2.0;
    for (let c = 0; c < 9; c++) {
      const cy = 45 + c * 7;
      const cx = -12 + c * 5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.quadraticCurveTo(cx - 18, cy - 32, cx - 28, cy - 38);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Vẽ bóng tháp và gợn sóng Hồ Gươm lung linh đêm
  _drawNightWaterRipples(ctx, startY, thapX, thapY) {
    ctx.save();
    // Bóng nước rực rỡ từ Tháp Rùa
    ctx.globalAlpha = 0.32;
    ctx.fillStyle = '#ffd166';
    for (let r = 0; r < 8; r++) {
      const ry = thapY + 22 + r * 6;
      const rw = (58 - r * 4.5) + Math.sin(this.animTimer * 2.8 + r) * 6;
      ctx.fillRect(thapX - rw * 0.5, ry, rw, 2.5);
    }

    // Sóng nước li ti tự nhiên
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 12; i++) {
      const ry = startY + 35 + i * 28;
      const rx = ((this.scrollX * 0.55 + i * 95) % this.width);
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + 36, ry);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Mây Hà Nội đêm bồng bềnh
  _drawSoftHNMistyClouds(ctx, baseY, alpha, count) {
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    for (let i = 0; i < count; i++) {
      const cx = ((i * 160 + this.scrollX * 0.15) % (this.width + 160)) - 80;
      const cy = baseY + (i % 2) * 12;
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.arc(cx + 22, cy - 6, 35, 0, Math.PI * 2);
      ctx.arc(cx + 48, cy, 24, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Mặt trăng treo cao
  _drawTinyMoon(ctx, cx, cy) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();

    // Ánh hào quang mờ nhạt của trăng
    const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 25);
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Đàn chim đêm bay muộn
  _drawHanoiBirds(ctx) {
    ctx.save();
    ctx.strokeStyle = '#2b2438';
    ctx.lineWidth = 1.0;
    const birds = [
      { x: this.width * 0.48, y: this.height * 0.24, size: 5.5 },
      { x: this.width * 0.53, y: this.height * 0.22, size: 4.5 },
      { x: this.width * 0.43, y: this.height * 0.27, size: 5 }
    ];
    birds.forEach((bird, idx) => {
      const swing = Math.sin(this.animTimer * 5 + idx) * 1.8;
      const bx = bird.x - (this.animTimer * 7.5) % 200;
      const by = bird.y;

      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(bx + bird.size * 0.5, by - bird.size * 0.4 + swing, bx + bird.size, by);
      ctx.quadraticCurveTo(bx + bird.size * 1.5, by - bird.size * 0.4 + swing, bx + bird.size * 2, by);
      ctx.stroke();
    });
    ctx.restore();
  }

  
  // ==========================================
  // PANEL 4: HUẾ (Đại Nội Ngọ Môn, Kỳ Đài & Cầu Tràng Tiền - Masterpiece Edition)
  // ==========================================
  _drawHue(ctx) {
    ctx.save();
    const w = this.width;
    const h = this.height;

    // 1. Bầu trời hoàng hôn tím xứ Huế (Poetic Purple Twilight)
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.60);
    sky.addColorStop(0, '#1c1032');
    sky.addColorStop(0.22, '#351945');
    sky.addColorStop(0.45, '#562153');
    sky.addColorStop(0.68, '#883363');
    sky.addColorStop(0.85, '#bf556a');
    sky.addColorStop(1, '#f69974');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h * 0.60);

    // Mây hoàng hôn bồng bềnh, vầng trăng khuyết và đàn chim chiều
    this._drawSoftHueMistyClouds(ctx, h * 0.28, 0.28, 4);
    this._drawHueMoon(ctx, w * 0.62, h * 0.12);
    this._drawHueBirds(ctx);

    // 2. Dãy núi Ngự Bình mờ ảo phía xa & Rừng cây tím hoàng hôn
    const citadelY = h * 0.57;
    this._drawHueMountainsAndWoods(ctx, w, h, citadelY);

    // 3. Quần thể Đại Nội Kinh Thành Huế: Kỳ Đài cao vút & Cổng Ngọ Môn Lầu Ngũ Phụng
    this._drawHueCitadelComplex(ctx, w, h, citadelY);

    // 4. Dòng Sông Hương êm đềm (Perfume River)
    const riverY = h * 0.63;
    const rivGrad = ctx.createLinearGradient(0, riverY, 0, h);
    rivGrad.addColorStop(0, '#191535');
    rivGrad.addColorStop(0.4, '#100d24');
    rivGrad.addColorStop(1, '#070512');
    ctx.fillStyle = rivGrad;
    ctx.fillRect(0, riverY, w, h - riverY);

    // 5. CẦU TRÀNG TIỀN ĐỔI MÀU NEON (Trang Tien Steel Arches)
    const bridgeY = h * 0.655;
    this._drawTrangTienBridge(ctx, bridgeY);

    // 6. Ánh sáng Neon lung linh phản chiếu trên mặt nước Sông Hương
    this._drawHueNeonReflections(ctx, bridgeY);

    // 7. Hàng liễu rủ thơ mộng hai bên góc trên màn hình
    this._drawHueCascadingWillows(ctx, w, h);

    // 8. Bờ kè đá, lan can cổ kính và khóm cây bên bờ sông (Tiền cảnh trái)
    this._drawHuePromenade(ctx, w * 0.02, h * 0.82);

    ctx.restore();
  }

  // ==========================================
  // CÁC HÀM PHỤ TRỢ CHI TIẾT HUẾ
  // ==========================================

  // Núi Ngự Bình và rặng dừa, cây cối ven bờ thành
  _drawHueMountainsAndWoods(ctx, w, h, citadelY) {
    ctx.save();

    // Dãy núi Ngự Bình tím mờ xa xăm
    ctx.fillStyle = '#261838';
    ctx.beginPath();
    ctx.moveTo(0, citadelY - 35);
    ctx.quadraticCurveTo(w * 0.25, citadelY - 65, w * 0.48, citadelY - 30);
    ctx.quadraticCurveTo(w * 0.72, citadelY - 60, w, citadelY - 38);
    ctx.lineTo(w, citadelY + 20);
    ctx.lineTo(0, citadelY + 20);
    ctx.closePath();
    ctx.fill();

    // Tầng đồi cây thấp màu xanh tím thẫm
    ctx.fillStyle = '#1c2628';
    ctx.beginPath();
    ctx.moveTo(w * 0.28, citadelY - 10);
    for (let x = w * 0.28; x <= w; x += 35) {
      const cy = citadelY - 18 + Math.sin(x * 0.04) * 8;
      ctx.quadraticCurveTo(x + 18, cy, x + 35, citadelY - 10);
    }
    ctx.lineTo(w, citadelY + 20);
    ctx.lineTo(w * 0.28, citadelY + 20);
    ctx.closePath();
    ctx.fill();

    // Rặng dừa và cọ nhiệt đới ven bờ thành
    const palmPositions = [
      { x: w * 0.46, y: citadelY - 16, h: 26, scale: 0.9 },
      { x: w * 0.51, y: citadelY - 18, h: 32, scale: 1.1 },
      { x: w * 0.55, y: citadelY - 14, h: 24, scale: 0.85 },
      { x: w * 0.60, y: citadelY - 15, h: 28, scale: 0.95 }
    ];

    palmPositions.forEach(p => {
      ctx.save();
      ctx.strokeStyle = '#121d17';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y + p.h);
      ctx.quadraticCurveTo(p.x + 3, p.y + p.h * 0.5, p.x + 5, p.y);
      ctx.stroke();

      // Tán dừa xòe tròn
      ctx.fillStyle = '#182b20';
      const leaves = 7;
      for (let i = 0; i < leaves; i++) {
        const angle = (i / leaves) * Math.PI + 0.15;
        const lx = p.x + 5 + Math.cos(angle) * (18 * p.scale);
        const ly = p.y - Math.sin(angle) * (14 * p.scale);
        ctx.beginPath();
        ctx.moveTo(p.x + 5, p.y);
        ctx.quadraticCurveTo(p.x + 5 + Math.cos(angle) * 10, p.y - Math.sin(angle) * 14 - 4, lx, ly);
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = '#1d3326';
        ctx.stroke();
      }
      ctx.restore();
    });

    ctx.restore();
  }

  // Quần thể Kinh Thành: Thành lũy đá, Cổng Ngọ Môn & Kỳ Đài
  _drawHueCitadelComplex(ctx, w, h, citadelY) {
    ctx.save();

    // 1. Tường thành đá cổ kính kiên cố kiểu pháo đài Vauban
    const wallLeft = 0;
    const wallRight = w * 0.48;
    const wallTop = citadelY - 24;
    const wallHeight = 46;

    // Thân tường thành bằng đá sẫm
    ctx.fillStyle = '#3a333d';
    ctx.beginPath();
    ctx.moveTo(wallLeft, wallTop + 8);
    ctx.lineTo(w * 0.22, wallTop);
    ctx.lineTo(w * 0.32, wallTop + 6);
    ctx.lineTo(wallRight, wallTop + 14);
    ctx.lineTo(wallRight - 8, wallTop + wallHeight);
    ctx.lineTo(wallLeft, wallTop + wallHeight);
    ctx.closePath();
    ctx.fill();

    // Viền bờ đá đỉnh tường thành (Coping stone rim)
    ctx.fillStyle = '#574e5c';
    ctx.fillRect(wallLeft, wallTop - 2, wallRight - 4, 5);

    // Các dải gờ ngang phân tầng tường thành
    ctx.fillStyle = '#29242b';
    ctx.fillRect(wallLeft, wallTop + 16, wallRight - 6, 2.5);
    ctx.fillRect(wallLeft, wallTop + 32, wallRight - 10, 2);

    // Lỗ châu mai / Cửa vòm nhỏ phòng thủ
    ctx.fillStyle = '#1c181e';
    for (let bx = w * 0.04; bx < wallRight - 20; bx += 28) {
      ctx.fillRect(bx, wallTop + 10, 6, 5);
    }

    // 2. VẼ KỲ ĐÀI HUẾ (CỘT CỜ KINH THÀNH CAO VÚT HOÀNH TRÁNG)
    this._drawKyDai(ctx, w * 0.36, citadelY - 18);

    // 3. VẼ CỔNG NGỌ MÔN - LẦU NGŨ PHỤNG (Hoàng cung kép tráng lệ)
    this._drawNgoMon(ctx, w * 0.18, citadelY - 18);

    ctx.restore();
  }

  // Kỳ Đài Huế: Tháp đài nhiều tầng kiên cố, ban công tròn và cờ đỏ sao vàng lớn
  _drawKyDai(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Bệ đá móng Kỳ Đài
    ctx.fillStyle = '#4a3d34';
    ctx.fillRect(-26, 0, 52, 14);
    ctx.fillStyle = '#5c4d42';
    ctx.fillRect(-28, -4, 56, 4);

    // Tháp gạch Kỳ Đài vươn cao hình tháp thu nhỏ dần
    const towerH = 68;
    const towerBottomW = 34;
    const towerTopW = 22;

    ctx.fillStyle = '#7a6352';
    ctx.beginPath();
    ctx.moveTo(-towerBottomW * 0.5, 0);
    ctx.lineTo(-towerTopW * 0.5, -towerH);
    ctx.lineTo(towerTopW * 0.5, -towerH);
    ctx.lineTo(towerBottomW * 0.5, 0);
    ctx.closePath();
    ctx.fill();

    // Mảng bóng tối 3D cho bên phải tháp
    ctx.fillStyle = '#5c483a';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -towerH);
    ctx.lineTo(towerTopW * 0.5, -towerH);
    ctx.lineTo(towerBottomW * 0.5, 0);
    ctx.closePath();
    ctx.fill();

    // Các đường gờ viền đá phân tầng tháp
    ctx.fillStyle = '#8f7765';
    for (let r = 1; r <= 3; r++) {
      const ry = -r * 18;
      const rw = towerBottomW - r * 3;
      ctx.fillRect(-rw * 0.5, ry, rw, 3);
    }

    // Các ô cửa sổ tò vò vòm nhỏ trên thân tháp
    ctx.fillStyle = '#221914';
    ctx.fillRect(-3, -28, 6, 9);
    ctx.fillRect(-2.5, -46, 5, 8);

    // Vọng đài / Ban công quan sát tròn trên đỉnh tháp
    ctx.fillStyle = '#4a3d34';
    ctx.fillRect(-15, -towerH - 6, 30, 6);
    // Lan can ban công
    ctx.strokeStyle = '#8f7765';
    ctx.lineWidth = 1.6;
    ctx.strokeRect(-16, -towerH - 12, 32, 6);
    for (let b = -12; b <= 12; b += 6) {
      ctx.beginPath();
      ctx.moveTo(b, -towerH - 12);
      ctx.lineTo(b, -towerH - 6);
      ctx.stroke();
    }

    // Đỉnh chóp nón che cột cờ
    ctx.fillStyle = '#6e5645';
    ctx.beginPath();
    ctx.moveTo(-10, -towerH - 12);
    ctx.lineTo(0, -towerH - 18);
    ctx.lineTo(10, -towerH - 12);
    ctx.closePath();
    ctx.fill();

    // Cột cờ bằng thép vươn cao hùng dũng
    const poleTopY = -towerH - 65;
    ctx.strokeStyle = '#2b303a';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(0, -towerH - 18);
    ctx.lineTo(0, poleTopY);
    ctx.stroke();

    // Quả cầu đỉnh cột cờ mạ vàng
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(0, poleTopY, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // LÁ CỜ ĐỎ SAO VÀNG CỠ LỚN TUNG BAY HÙNG TRÁNG
    const flagW = 34;
    const flagH = 22;
    const wave1 = Math.sin(this.animTimer * 5.0) * 4.0;
    const wave2 = Math.cos(this.animTimer * 5.0) * 3.0;

    ctx.fillStyle = '#da251d';
    ctx.beginPath();
    ctx.moveTo(0, poleTopY + 2);
    ctx.quadraticCurveTo(flagW * 0.45, poleTopY + wave1, flagW, poleTopY + 2 + wave2);
    ctx.lineTo(flagW, poleTopY + 2 + flagH + wave2);
    ctx.quadraticCurveTo(flagW * 0.45, poleTopY + flagH + wave1, 0, poleTopY + 2 + flagH);
    ctx.closePath();
    ctx.fill();

    // Bóng đổ gợn cờ
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.moveTo(flagW * 0.5, poleTopY + 2 + wave1);
    ctx.lineTo(flagW, poleTopY + 2 + wave2);
    ctx.lineTo(flagW, poleTopY + 2 + flagH + wave2);
    ctx.lineTo(flagW * 0.5, poleTopY + flagH + wave1);
    ctx.closePath();
    ctx.fill();

    // Ngôi sao vàng năm cánh tỏa sáng giữa lá cờ
    this._drawStar(ctx, flagW * 0.48, poleTopY + 2 + flagH * 0.5 + (wave1 + wave2) * 0.5, 6.2, '#ffbe0b');

    ctx.restore();
  }

  // Cổng Ngọ Môn & Lầu Ngũ Phụng: Cổng chính, 3 vòm rực sáng, mái ngói lưu ly kép
  _drawNgoMon(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // 1. Đài nền cổng Ngọ Môn (Đá khối kiên cố)
    const baseW = 126;
    const baseH = 28;
    ctx.fillStyle = '#423b45';
    ctx.fillRect(-baseW * 0.5, 0, baseW, baseH);

    // Gờ trang trí trên đỉnh đài nền
    ctx.fillStyle = '#625866';
    ctx.fillRect(-baseW * 0.5 - 2, -3, baseW + 4, 4);

    // 3 CỔNG VÒM RỰC SÁNG ÁNH HOÀNG KIM (Ngự Đạo và Tả/Hữu Giáp Môn)
    // Cổng chính Ngự Đạo ở giữa (Lớn nhất)
    const gateGlow = ctx.createRadialGradient(0, baseH - 8, 2, 0, baseH - 8, 16);
    gateGlow.addColorStop(0, '#fff3b0');
    gateGlow.addColorStop(0.6, '#ffd166');
    gateGlow.addColorStop(1, '#ff9f1a');
    ctx.fillStyle = gateGlow;
    ctx.beginPath();
    ctx.arc(0, baseH - 12, 10, Math.PI, 0, false);
    ctx.lineTo(10, baseH);
    ctx.lineTo(-10, baseH);
    ctx.closePath();
    ctx.fill();

    // Cổng phụ Tả Giáp Môn (Bên trái)
    ctx.beginPath();
    ctx.arc(-32, baseH - 9, 7.5, Math.PI, 0, false);
    ctx.lineTo(-24.5, baseH);
    ctx.lineTo(-39.5, baseH);
    ctx.closePath();
    ctx.fill();

    // Cổng phụ Hữu Giáp Môn (Bên phải)
    ctx.beginPath();
    ctx.arc(32, baseH - 9, 7.5, Math.PI, 0, false);
    ctx.lineTo(39.5, baseH);
    ctx.lineTo(24.5, baseH);
    ctx.closePath();
    ctx.fill();

    // 2. LẦU NGŨ PHỤNG - TẦNG 1 (Điện lớn)
    const f1W = 110;
    const f1H = 18;
    ctx.fillStyle = '#8b2027'; // Sơn son thếp vàng
    ctx.fillRect(-f1W * 0.5, -f1H, f1W, f1H);

    // Hàng cột gỗ son
    ctx.fillStyle = '#e8ba7a';
    for (let c = -48; c <= 48; c += 16) {
      ctx.fillRect(c - 1.2, -f1H, 2.4, f1H);
    }

    // Các ô cửa sổ vàng ánh sáng
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(-22, -f1H + 4, 8, 9);
    ctx.fillRect(-4, -f1H + 4, 8, 9);
    ctx.fillRect(14, -f1H + 4, 8, 9);

    // MÁI TẦNG 1: Mái ngói Hoàng Lưu Ly cong vút đầu đao
    this._drawCurvedImperialRoof(ctx, 0, -f1H, 126, 10, '#f59e0b', '#d97706');

    // 3. LẦU NGŨ PHỤNG - TẦNG 2 (Chính điện thượng sảnh)
    const f2W = 66;
    const f2H = 16;
    ctx.fillStyle = '#99222b';
    ctx.fillRect(-f2W * 0.5, -f1H - 10 - f2H, f2W, f2H);

    // Cột và cửa sổ tầng 2
    ctx.fillStyle = '#e8ba7a';
    for (let c = -26; c <= 26; c += 13) {
      ctx.fillRect(c - 1, -f1H - 10 - f2H, 2, f2H);
    }
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(-15, -f1H - 10 - f2H + 3, 7, 9);
    ctx.fillRect(-3.5, -f1H - 10 - f2H + 3, 7, 9);
    ctx.fillRect(8, -f1H - 10 - f2H + 3, 7, 9);

    // MÁI TẦNG 2: Mái ngói thượng sảnh uốn cong rực rỡ
    this._drawCurvedImperialRoof(ctx, 0, -f1H - 10 - f2H, 84, 11, '#fbbf24', '#f59e0b');

    // Trang trí Rồng / Hồi văn trên bờ nóc đỉnh mái
    ctx.strokeStyle = '#ffa801';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-36, -f1H - 21 - f2H);
    ctx.quadraticCurveTo(-42, -f1H - 26 - f2H, -40, -f1H - 30 - f2H);
    ctx.moveTo(36, -f1H - 21 - f2H);
    ctx.quadraticCurveTo(42, -f1H - 26 - f2H, 40, -f1H - 30 - f2H);
    ctx.stroke();

    ctx.restore();
  }

  // Vẽ mái ngói cung đình uốn lượn đầu đao
  _drawCurvedImperialRoof(ctx, cx, cy, roofW, roofH, brightColor, darkColor) {
    ctx.save();
    ctx.translate(cx, cy);

    // Thân mái chính lợp ngói lưu ly
    ctx.fillStyle = brightColor;
    ctx.beginPath();
    ctx.moveTo(-roofW * 0.5 - 6, -2);
    ctx.quadraticCurveTo(0, -roofH - 2, roofW * 0.5 + 6, -2);
    ctx.quadraticCurveTo(roofW * 0.5, 4, roofW * 0.44, 4);
    ctx.quadraticCurveTo(0, -roofH + 4, -roofW * 0.44, 4);
    ctx.quadraticCurveTo(-roofW * 0.5, 4, -roofW * 0.5 - 6, -2);
    ctx.closePath();
    ctx.fill();

    // Bóng tối đổ dưới diềm mái
    ctx.fillStyle = darkColor;
    ctx.beginPath();
    ctx.moveTo(-roofW * 0.44, 4);
    ctx.quadraticCurveTo(0, -roofH + 4, roofW * 0.44, 4);
    ctx.lineTo(roofW * 0.44, 6);
    ctx.quadraticCurveTo(0, -roofH + 6, -roofW * 0.44, 6);
    ctx.closePath();
    ctx.fill();

    // Đầu đao uốn cong vút lên hai bên góc mái
    ctx.strokeStyle = brightColor;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-roofW * 0.5, 0);
    ctx.quadraticCurveTo(-roofW * 0.5 - 8, -4, -roofW * 0.5 - 10, -10);
    ctx.moveTo(roofW * 0.5, 0);
    ctx.quadraticCurveTo(roofW * 0.5 + 8, -4, roofW * 0.5 + 10, -10);
    ctx.stroke();

    ctx.restore();
  }

  // CẦU TRÀNG TIỀN: 3 nhịp vòm thép Parabol phát sáng Neon rực rỡ
  _drawTrangTienBridge(ctx, bridgeY) {
    const w = this.width;
    const h = this.height;
    ctx.save();

    // Mặt đường cầu Tràng Tiền (Bridge deck)
    const deckStartX = w * 0.36;
    const deckEndX = w;
    const deckWidth = deckEndX - deckStartX;

    // Bản mặt cầu dầm thép xám sẫm
    ctx.fillStyle = '#222633';
    ctx.fillRect(deckStartX, bridgeY, deckWidth, 8);

    // Lan can trên mặt cầu với các đốm sáng li ti
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.0;
    ctx.strokeRect(deckStartX, bridgeY - 4, deckWidth, 4);
    ctx.fillStyle = '#f8fafc';
    for (let lx = deckStartX + 12; lx < deckEndX; lx += 22) {
      ctx.fillRect(lx, bridgeY - 5, 2, 2);
    }

    // 3 VÀI (3 NHỊP LỚN) CẦU TRÀNG TIỀN PHÁT SÁNG NEON
    const archCount = 3;
    const spanW = deckWidth / archCount;

    // Màu sắc Neon từng nhịp chuẩn nghệ thuật:
    // Nhịp 1: Tím/Hồng Neon rực rỡ
    // Nhịp 2: Xanh ngọc Cyan Neon lung linh
    // Nhịp 3: Hồng Magenta Neon thơ mộng
    const neonThemes = [
      { primary: '#d946ef', secondary: '#c026d3', glow: '#a855f7' },
      { primary: '#06b6d4', secondary: '#22d3ee', glow: '#0891b2' },
      { primary: '#f43f5e', secondary: '#fb7185', glow: '#e11d48' }
    ];

    for (let i = 0; i < archCount; i++) {
      const ax = deckStartX + i * spanW;
      const theme = neonThemes[i];
      const archH = 34;

      // 1. DÂM VÒM CHÍNH PARABOL VỚI HIỆU ỨNG NEON GLOW
      ctx.save();
      ctx.shadowColor = theme.glow;
      ctx.shadowBlur = 12;
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 3.0;

      ctx.beginPath();
      ctx.moveTo(ax, bridgeY);
      ctx.quadraticCurveTo(ax + spanW * 0.5, bridgeY - archH * 2.0, ax + spanW, bridgeY);
      ctx.stroke();

      // Đường viền neon phụ bên trong
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = theme.secondary;
      ctx.beginPath();
      ctx.moveTo(ax + 4, bridgeY);
      ctx.quadraticCurveTo(ax + spanW * 0.5, bridgeY - archH * 2.0 + 3.5, ax + spanW - 4, bridgeY);
      ctx.stroke();
      ctx.restore();

      // 2. GIÀN THÉP CHÉO VÀ DẦM DỌC BÊN TRONG (TRUSS SYSTEM)
      ctx.save();
      ctx.strokeStyle = theme.secondary;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.85;

      const numTruss = 10;
      for (let j = 1; j < numTruss; j++) {
        const lx = ax + (spanW / numTruss) * j;
        // Chiều cao parabol tại vị trí lx
        const prog = j / numTruss;
        const archTopY = bridgeY - Math.sin(prog * Math.PI) * archH * 1.02;

        // Thanh đứng
        ctx.beginPath();
        ctx.moveTo(lx, bridgeY);
        ctx.lineTo(lx, archTopY);
        ctx.stroke();

        // Thanh giằng chéo
        if (j < numTruss - 1) {
          const nextX = ax + (spanW / numTruss) * (j + 1);
          const nextY = bridgeY - Math.sin(((j + 1) / numTruss) * Math.PI) * archH * 1.02;
          ctx.beginPath();
          ctx.moveTo(lx, bridgeY);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 3. MỐ TRỤ CẦU BÊ TÔNG CẮM XUỐNG SÔNG HƯƠNG
      ctx.fillStyle = '#161922';
      ctx.fillRect(ax + spanW - 6, bridgeY, 12, 30);
      ctx.fillStyle = '#232938';
      ctx.fillRect(ax + spanW - 7, bridgeY, 14, 4);
    }

    ctx.restore();
  }

  // PHẢN CHIẾU ÁNH SÁNG NEON TRÊN MẶT NƯỚC SÔNG HƯƠNG
  _drawHueNeonReflections(ctx, bridgeY) {
    const w = this.width;
    const h = this.height;
    ctx.save();

    const deckStartX = w * 0.36;
    const deckEndX = w;
    const deckWidth = deckEndX - deckStartX;
    const archCount = 3;
    const spanW = deckWidth / archCount;

    const neonColors = [
      'rgba(217, 70, 239, ', // Tím hồng
      'rgba(6, 182, 212, ',  // Cyan
      'rgba(244, 63, 94, '   // Hồng magenta
    ];

    // Vẽ từng vùng phản chiếu sóng nước nhấp nhô lấp lánh dưới mỗi nhịp cầu
    for (let i = 0; i < archCount; i++) {
      const centerX = deckStartX + i * spanW + spanW * 0.5;
      const colorBase = neonColors[i];

      const numRipples = 14;
      for (let r = 0; r < numRipples; r++) {
        const ry = bridgeY + 12 + r * 5.5;
        // Bề rộng dải sáng mở rộng dần theo chiều sâu phối cảnh mặt nước
        const spreadProgress = (r / numRipples);
        const waveW = spanW * (0.65 + spreadProgress * 0.45);
        const sway = Math.sin(this.animTimer * 2.8 + i * 1.5 + r * 0.45) * 8.0;

        // Cường độ sáng giảm dần từ gần cầu xuống đáy
        const alpha = Math.max(0.04, (0.42 - spreadProgress * 0.32));

        ctx.fillStyle = colorBase + alpha + ')';

        // Vẽ các vệt sóng ngang lăn tăn
        const segments = 4;
        for (let s = 0; s < segments; s++) {
          const segOffset = (s - segments * 0.5) * (waveW / segments);
          const segW = (waveW / segments) * 0.75 + Math.sin(this.animTimer * 4.0 + r + s) * 4;
          const segX = centerX + segOffset + sway;
          const segH = 2.0 + (r % 3 === 0 ? 1.0 : 0);

          ctx.beginPath();
          ctx.roundRect(segX - segW * 0.5, ry, segW, segH, 1.2);
          ctx.fill();
        }
      }
    }

    // Những gợn sóng đêm màu trắng bạc lướt nhẹ trên dòng sông
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.0;
    for (let j = 0; j < 8; j++) {
      const sy = bridgeY + 20 + j * 16;
      const sx = ((this.scrollX * 0.4 + j * 110) % w);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + 24, sy);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Hàng liễu rủ thơ mộng hai bên góc trên màn hình
  _drawHueCascadingWillows(ctx, w, h) {
    ctx.save();

    // Liễu rủ góc trái đỉnh màn hình
    this._drawLushWeepingWillows(ctx, 0, 0, 1);

    // Liễu rủ góc phải đỉnh màn hình
    this._drawLushWeepingWillows(ctx, w, 0, -1);

    ctx.restore();
  }

  // Vẽ các cành liễu buông dài và tán lá đung đưa
  _drawLushWeepingWillows(ctx, startX, startY, dir) {
    ctx.save();
    ctx.strokeStyle = '#1e141a';
    ctx.lineWidth = 2.8;

    // Cành nhánh chính vươn ra từ mép trên
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(startX + dir * 65, startY + 38, startX + dir * 120, startY + 65, startX + dir * 165, startY + 110);
    ctx.stroke();

    // Các nhánh liễu buông dài mềm mại
    const branches = [
      { offset: 35, yOff: 20, len: 110 },
      { offset: 68, yOff: 38, len: 145 },
      { offset: 102, yOff: 56, len: 165 },
      { offset: 135, yOff: 78, len: 135 },
      { offset: 165, yOff: 110, len: 95 }
    ];

    branches.forEach((b, idx) => {
      const bx = startX + dir * b.offset;
      const by = startY + b.yOff;
      const sway = Math.sin(this.animTimer * 1.8 + idx * 0.7) * (10 + idx * 2);

      // Nhánh mảnh buông xuống
      ctx.strokeStyle = 'rgba(46, 68, 48, 0.85)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.bezierCurveTo(
        bx + dir * 12, by + b.len * 0.35,
        bx + sway * 0.7, by + b.len * 0.7,
        bx + sway, by + b.len
      );
      ctx.stroke();

      // Tán lá liễu xếp dọc theo nhánh
      ctx.fillStyle = '#2f4b34';
      for (let ly = 12; ly < b.len; ly += 7) {
        const prog = ly / b.len;
        const curX = bx + sway * prog;
        const curY = by + ly;

        ctx.beginPath();
        ctx.ellipse(curX, curY, 3.8, 1.6, 0.4 * dir + sway * 0.02, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.restore();
  }

  // Tiền cảnh bờ kè, lan can đá cung đình, biển chỉ dẫn và khóm lau sậy
  _drawHuePromenade(ctx, startX, startY) {
    ctx.save();
    ctx.translate(startX, startY);

    // Lan can đá Cung Đình chạm khắc
    ctx.fillStyle = '#2a2228';
    ctx.fillRect(0, 48, 110, 10); // Tay vịn đá
    ctx.fillRect(0, 76, 110, 7);  // Chân bệ đỡ

    // Trụ lan can đá
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(8 + i * 18, 58, 7, 18);
    }

    // Cột bờ kè đá vuông
    ctx.fillStyle = '#3a3038';
    ctx.fillRect(92, 38, 14, 48);
    ctx.fillRect(90, 35, 18, 4);

    // Biển báo chỉ dẫn di tích
    ctx.fillStyle = '#141018';
    ctx.fillRect(40, 12, 4, 38);
    ctx.fillStyle = '#2a1e24';
    ctx.fillRect(16, 16, 28, 9);
    ctx.fillRect(44, 22, 26, 9);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.6;
    ctx.strokeRect(17, 17, 26, 7);
    ctx.strokeRect(45, 23, 24, 7);

    // Bụi cây nhiệt đới, dừa nước và rặng lau sậy rậm rạp
    ctx.fillStyle = '#0a140d';
    ctx.beginPath();
    ctx.arc(-20, 56, 38, 0, Math.PI * 2);
    ctx.arc(15, 48, 28, 0, Math.PI * 2);
    ctx.arc(52, 65, 24, 0, Math.PI * 2);
    ctx.fill();

    // Lá lau sậy uốn lượn
    ctx.strokeStyle = '#1a3320';
    ctx.lineWidth = 2.2;
    for (let c = 0; c < 9; c++) {
      const cy = 46 + c * 6;
      const cx = -12 + c * 6;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.quadraticCurveTo(cx - 18, cy - 32, cx - 30, cy - 38);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Mây hoàng hôn bồng bềnh mờ ảo Cố Đô
  _drawSoftHueMistyClouds(ctx, baseY, alpha, count) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 215, 225, ' + alpha + ')';
    for (let i = 0; i < count; i++) {
      const cx = ((i * 165 + this.scrollX * 0.18) % (this.width + 180)) - 90;
      const cy = baseY + (i % 2) * 14;
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.arc(cx + 25, cy - 8, 38, 0, Math.PI * 2);
      ctx.arc(cx + 55, cy, 28, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Đàn chim chiều vỗ cánh bay về tổ
  _drawHueBirds(ctx) {
    ctx.save();
    ctx.strokeStyle = '#2d1425';
    ctx.lineWidth = 1.2;
    const birds = [
      { x: this.width * 0.50, y: this.height * 0.29, size: 5.5 },
      { x: this.width * 0.56, y: this.height * 0.26, size: 4.5 },
      { x: this.width * 0.62, y: this.height * 0.32, size: 5.0 }
    ];
    birds.forEach((bird, idx) => {
      const swing = Math.sin(this.animTimer * 4.8 + idx) * 1.8;
      const bx = bird.x - (this.animTimer * 7.0) % 200;
      const by = bird.y;

      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(bx + bird.size * 0.5, by - bird.size * 0.45 + swing, bx + bird.size, by);
      ctx.quadraticCurveTo(bx + bird.size * 1.5, by - bird.size * 0.45 + swing, bx + bird.size * 2, by);
      ctx.stroke();
    });
    ctx.restore();
  }

  // Trăng khuyết mờ ảo xứ Huế
  _drawHueMoon(ctx, cx, cy) {
    ctx.save();
    const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 24);
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    glow.addColorStop(0.5, 'rgba(255, 235, 245, 0.15)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ==========================================
  // PANEL 5: ĐÀ NẴNG (Cầu Rồng, Sông Hàn & Bán đảo Sơn Trà - Cinematic Masterpiece)
  // ==========================================

  // ==========================================
  // PANEL 5: ĐÀ NẴNG (Cầu Rồng, Sông Hàn & Bán đảo Sơn Trà - Masterpiece)
  // ==========================================
  _drawDaNang(ctx) {
    ctx.save();
    const w = this.width;
    const h = this.height;

    // 1. Bầu trời đêm miền biển tím thẫm & ửng hồng hoàng hôn (Coastal Twilight Midnight Sky)
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.56);
    sky.addColorStop(0, '#040b1a');    // Đêm thẫm sẫm màu
    sky.addColorStop(0.20, '#08142c');
    sky.addColorStop(0.42, '#141c42');
    sky.addColorStop(0.62, '#2c2254'); // Tím thẫm huyền ảo
    sky.addColorStop(0.78, '#523a78'); // Ánh tím hoàng hôn miền Trung
    sky.addColorStop(0.90, '#825f92'); // Mờ ảo hắt sáng đô thị
    sky.addColorStop(1.00, '#cdaaa0'); // Vệt ửng hồng cam ấm áp sát chân trời biển
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h * 0.56);

    // 2. Sao trời & mây đêm bồng bềnh
    this._drawStarsAndMist(ctx, 32);
    this._drawSoftCoastalClouds(ctx, h * 0.22, 0.16, 4);

    const mountainsY = h * 0.52;

    // 3. Mặt trăng trên biển sát chân trời vịnh biển & Vệt trăng chiếu trên biển
    const moonX = w * 0.572;
    const moonY = h * 0.328;
    this._drawCoastalMoon(ctx, moonX, moonY);

    // 4. Bán đảo Sơn Trà sừng sững & Tượng Phật Bà Quan Âm Linh Ứng (Bên trái)
    this._drawSonTraPeninsula(ctx, w, h, mountainsY);
    this._drawLadyBuddha(ctx, w * 0.171, h * 0.429);

    // 5. Cầu vòm Thuận Phước / Cầu quay Sông Hàn bắc ngang vịnh (Phía xa)
    this._drawHanSwingBridge(ctx, w * 0.50, mountainsY);

    // 6. Skyline Cao ốc Đô thị Mỹ Khê & Vòng quay Mặt Trời Sun Wheel (Bên phải)
    this._drawMyKheSkylines(ctx, w * 0.70, mountainsY);
    this._drawSunWheel(ctx, w * 0.91, mountainsY - h * 0.08, Math.max(26, h * 0.075));

    // 7. Dòng Sông Hàn lung linh đêm (Han River)
    const riverY = h * 0.58;
    const rivGrad = ctx.createLinearGradient(0, riverY, 0, h);
    rivGrad.addColorStop(0, '#081428'); // Xanh sẫm đêm
    rivGrad.addColorStop(0.45, '#040c1a');
    rivGrad.addColorStop(1, '#02050b');
    ctx.fillStyle = rivGrad;
    ctx.fillRect(0, riverY, w, h - riverY);

    // Vệt trăng bạc phản chiếu mờ ảo trên mặt nước sông
    this._drawMoonWaterReflection(ctx, moonX, mountainsY, riverY);

    // 8. CẦU RỒNG PHUN LỬA HOÀNH TRÁNG (The Majestic Golden Dragon Bridge)
    const bridgeY = h * 0.675;
    this._drawDetailedDragonBridge(ctx, bridgeY);

    // 9. Ánh lửa và thân Rồng Vàng phản chiếu rực rỡ trên Sông Hàn
    this._drawDragonWaterReflections(ctx, bridgeY);

    // 10. Rừng dừa biển & Lan can bờ kè Bạch Đằng (Tiền cảnh)
    this._drawDanangPromenade(ctx, 0, h * 0.82);
    this._drawRightEmbankment(ctx, w, h * 0.74);

    // Sóng nước Sông Hàn đêm lăn tăn tự nhiên
    this._drawWaterTwinkles(ctx, riverY);

    ctx.restore();
  }

  // ==========================================
  // CÁC HÀM PHỤ TRỢ CHI TIẾT ĐÀ NẴNG
  // ==========================================

  _drawStarsAndMist(ctx, count) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (let i = 0; i < count; i++) {
      const sx = (i * 73 + Math.sin(this.animTimer * 1.5 + i) * 3) % this.width;
      const sy = (i * 29 + 8) % (this.height * 0.35);
      const twinkle = Math.sin(this.animTimer * 3.5 + i) * 0.5 + 0.5;
      ctx.globalAlpha = 0.25 + twinkle * 0.75;
      ctx.fillRect(sx, sy, 1.4, 1.4);
    }
    ctx.restore();
  }

  _drawCoastalMoon(ctx, cx, cy) {
    ctx.save();
    const glow = ctx.createRadialGradient(cx, cy, 4, cx, cy, 46);
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    glow.addColorStop(0.25, 'rgba(224, 242, 254, 0.55)');
    glow.addColorStop(0.65, 'rgba(186, 230, 253, 0.18)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, 46, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f0f9ff';
    ctx.beginPath();
    ctx.arc(cx, cy, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _drawMoonWaterReflection(ctx, cx, startY, riverY) {
    ctx.save();
    const mRef = ctx.createLinearGradient(cx, riverY, cx, this.height);
    mRef.addColorStop(0, 'rgba(224, 242, 254, 0.45)');
    mRef.addColorStop(0.35, 'rgba(186, 230, 253, 0.20)');
    mRef.addColorStop(0.75, 'rgba(125, 211, 252, 0.08)');
    mRef.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = mRef;
    ctx.beginPath();
    ctx.moveTo(cx - 18, riverY);
    ctx.lineTo(cx + 18, riverY);
    ctx.lineTo(cx + 45, this.height);
    ctx.lineTo(cx - 45, this.height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  _drawSonTraPeninsula(ctx, w, h, mountainsY) {
    ctx.save();
    // Lớp núi xa (Dãy Sơn Trà tím thẫm)
    ctx.fillStyle = '#111b2e';
    ctx.beginPath();
    ctx.moveTo(0, mountainsY);
    ctx.quadraticCurveTo(w * 0.10, mountainsY - 70, w * 0.18, mountainsY - 90);
    ctx.lineTo(w * 0.28, mountainsY - 60);
    ctx.quadraticCurveTo(w * 0.38, mountainsY - 26, w * 0.50, mountainsY);
    ctx.lineTo(w * 0.50, h * 0.60);
    ctx.lineTo(0, h * 0.60);
    ctx.closePath();
    ctx.fill();

    // Lớp núi gần (Đồi dốc hướng biển Sơn Trà)
    ctx.fillStyle = '#0a1324';
    ctx.beginPath();
    ctx.moveTo(0, mountainsY);
    ctx.quadraticCurveTo(w * 0.08, mountainsY - 48, w * 0.16, mountainsY - 58);
    ctx.lineTo(w * 0.25, mountainsY - 40);
    ctx.quadraticCurveTo(w * 0.34, mountainsY - 18, w * 0.45, mountainsY);
    ctx.lineTo(w * 0.45, h * 0.60);
    ctx.lineTo(0, h * 0.60);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  _drawLadyBuddha(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Hào quang Phật Bà rực sáng màu vàng ngọc
    const glow = ctx.createRadialGradient(0, -16, 2, 0, -16, 26);
    glow.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
    glow.addColorStop(0.4, 'rgba(253, 224, 71, 0.35)');
    glow.addColorStop(0.8, 'rgba(250, 204, 21, 0.10)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, -16, 26, 0, Math.PI * 2);
    ctx.fill();

    // Đài sen & bệ đá
    ctx.fillStyle = '#1e3047';
    ctx.fillRect(-12, 0, 24, 6);

    // Tượng Phật Bà Quan Âm màu trắng ngọc
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-4.5, 0);
    ctx.lineTo(-2, -26);
    ctx.lineTo(2, -26);
    ctx.lineTo(4.5, 0);
    ctx.closePath();
    ctx.fill();

    // Vạt áo cà sa thanh thoát
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-3, -6, 6, 5);
    ctx.restore();
  }

  _drawHanSwingBridge(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Nhịp vòm cầu Thuận Phước / cầu Sông Hàn
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, 12, 54, Math.PI * 1.05, Math.PI * 1.95, false);
    ctx.stroke();

    // Mặt cầu
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-60, 0, 120, 3.5);

    // Dây cáp treo xanh neon
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 0.8;
    for (let c = -5; c <= 5; c++) {
      ctx.beginPath();
      ctx.moveTo(c * 11, 0);
      const topY = -Math.sqrt(Math.max(0, 54 * 54 - (c * 11) * (c * 11))) + 12;
      ctx.lineTo(c * 11, topY);
      ctx.stroke();
    }
    ctx.restore();
  }

  _drawMyKheSkylines(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    const blocks = [
      { bx: 0, bw: 22, bh: 68, col: '#0d223f' },
      { bx: 26, bw: 28, bh: 104, col: '#112b4d' },
      { bx: 58, bw: 20, bh: 60, col: '#09182b' },
      { bx: 82, bw: 24, bh: 78, col: '#0e2540' },
      { bx: 110, bw: 26, bh: 54, col: '#0b1d35' }
    ];

    blocks.forEach(b => {
      ctx.fillStyle = b.col;
      ctx.fillRect(b.bx, -b.bh, b.bw, b.bh);

      // Ô cửa sổ sáng đèn ban đêm
      for (let wy = -b.bh + 6; wy < -4; wy += 8) {
        for (let wx = b.bx + 3; wx < b.bx + b.bw - 3; wx += 5) {
          if ((wx + wy) % 2 === 0) {
            ctx.fillStyle = (wx + wy) % 5 === 0 ? '#fde047' : '#38bdf8';
            ctx.fillRect(wx, wy, 2.5, 3.8);
          }
        }
      }
    });
    ctx.restore();
  }

  _drawSunWheel(ctx, x, y, radius) {
    ctx.save();
    ctx.translate(x, y);

    // Chân đế chữ A
    ctx.strokeStyle = '#1e3b63';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-14, radius + 8);
    ctx.moveTo(0, 0);
    ctx.lineTo(14, radius + 8);
    ctx.stroke();

    // Vành vòng quay màu hồng magenta rực rỡ
    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Các nan hoa xoay tròn
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 0.8;
    const numSpokes = 16;
    for (let s = 0; s < numSpokes; s++) {
      const angle = (s * 2 * Math.PI) / numSpokes + this.sunWheelAngle;
      const sx = Math.cos(angle) * radius;
      const sy = Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(sx, sy);
      ctx.stroke();

      // Cabin neon phát sáng
      ctx.fillStyle = (s % 3 === 0) ? '#ff0054' : '#00f0ff';
      ctx.beginPath();
      ctx.arc(sx, sy, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // ==========================================
  // CẦU RỒNG CHI TIẾT & CHUẨN XÁC THEO TRANH MẪU
  // ==========================================
  _drawDetailedDragonBridge(ctx, bridgeY) {
    const w = this.width;
    const h = this.height;
    ctx.save();

    // 1. DẦM MẶT CẦU BÊ TÔNG THÉP ĐÀ NẴNG (Bridge Deck)
    ctx.fillStyle = '#161c28';
    ctx.fillRect(w * 0.04, bridgeY, w * 0.96, 14);

    // Lan can dải đèn LED xanh dương
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(w * 0.04, bridgeY - 4, w * 0.96, 4);
    ctx.fillStyle = '#f8fafc';
    for (let lx = w * 0.05; lx < w; lx += 24) {
      ctx.fillRect(lx, bridgeY - 5, 2.4, 2.4);
    }

    // Các mố trụ cầu bê tông cắm xuống lòng sông
    ctx.fillStyle = '#10141e';
    const pierXs = [w * 0.13, w * 0.28, w * 0.49, w * 0.74];
    pierXs.forEach(px => {
      ctx.fillRect(px - 10, bridgeY, 20, 32);
      // Ánh đèn vàng hắt chân trụ
      ctx.fillStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.fillRect(px - 10, bridgeY + 2, 20, 6);
      ctx.fillStyle = '#10141e';
    });

    // 2. ĐUÔI RỒNG XÒE HOA SEN CÁCH ĐIỆU (Bờ Tây)
    const tailX = w * 0.06;
    ctx.save();
    ctx.fillStyle = '#ffb703';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(tailX, bridgeY);
    ctx.quadraticCurveTo(tailX - 20, bridgeY - 28, tailX - 14, bridgeY - 38);
    ctx.quadraticCurveTo(tailX - 2, bridgeY - 24, tailX, bridgeY - 14);
    ctx.quadraticCurveTo(tailX + 4, bridgeY - 30, tailX + 16, bridgeY - 38);
    ctx.quadraticCurveTo(tailX + 20, bridgeY - 24, tailX + 8, bridgeY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 3. 3 NHỊP VÒM THÉP UỐN LƯỢN RỒNG VÀNG (3 Steel Arches)
    // Tọa độ chuẩn theo tranh tham chiếu:
    // Nhịp 1: w * 0.06 -> w * 0.20, đỉnh tại w * 0.130 (cao 50px)
    // Nhịp 2: w * 0.19 -> w * 0.38, đỉnh tại w * 0.282 (cao 78px - nhịp chính cao nhất)
    // Nhịp 3: w * 0.41 -> w * 0.67, đỉnh tại w * 0.489 (cao 65px)
    // Cổ rồng: w * 0.67 -> w * 0.781
    // Đầu rồng: tại w * 0.781, bridgeY - 42

    const headEyeX = w * 0.781;
    const headEyeY = bridgeY - 42;

    const arches = [
      { startX: w * 0.06, endX: w * 0.20, peakX: w * 0.130, height: 50 },
      { startX: w * 0.19, endX: w * 0.38, peakX: w * 0.282, height: 78 },
      { startX: w * 0.41, endX: w * 0.67, peakX: w * 0.489, height: 65 }
    ];

    ctx.save();
    ctx.shadowColor = '#fb8500';
    ctx.shadowBlur = 12;

    arches.forEach(arch => {
      // Ống dưới (Lower tube arch)
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 5.6;
      ctx.beginPath();
      ctx.moveTo(arch.startX, bridgeY);
      ctx.quadraticCurveTo(arch.peakX, bridgeY - arch.height * 1.35, arch.endX, bridgeY);
      ctx.stroke();

      // Ống trên (Upper tube arch)
      ctx.strokeStyle = '#ffb703';
      ctx.lineWidth = 5.6;
      ctx.beginPath();
      ctx.moveTo(arch.startX, bridgeY - 4);
      ctx.quadraticCurveTo(arch.peakX, bridgeY - arch.height * 1.35 - 4, arch.endX, bridgeY - 4);
      ctx.stroke();

      // Highlight sáng trên sống ống
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.8;
      ctx.stroke();
    });
    ctx.restore();

    // Dây cáp treo thẳng đứng & gai vảy rồng dọc sống 3 nhịp
    arches.forEach(arch => {
      const numCables = 14;
      const span = arch.endX - arch.startX;
      for (let c = 1; c < numCables; c++) {
        const cx = arch.startX + (span / numCables) * c;
        const prog = c / numCables;
        const cy = bridgeY - Math.sin(prog * Math.PI) * arch.height;

        // Dây cáp
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(cx, bridgeY);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        // Gai vảy tam giác trên sống vòm
        ctx.fillStyle = '#ffb703';
        ctx.beginPath();
        ctx.moveTo(cx - 3, cy);
        ctx.lineTo(cx, cy - 7);
        ctx.lineTo(cx + 3, cy);
        ctx.closePath();
        ctx.fill();
      }
    });

    // 4. ĐẦU RỒNG THỜI LÝ & LUỒNG LỬA PHUN ĐIỆN ẢNH (Accurate Masterpiece)
    this._drawCinematicDragonHead(ctx, headEyeX, headEyeY);

    ctx.restore();
  }

  // ĐẦU RỒNG & LUỒNG LỬA CHUẨN XÁC NGHỆ THUẬT THEO TRANH MẪU
  _drawCinematicDragonHead(ctx, eyeX, eyeY) {
    ctx.save();
    ctx.translate(eyeX, eyeY);

    // Tỉ lệ scale tự co giãn chuẩn xác theo kích thước màn hình
    const scale = Math.max(0.24, Math.min(0.55, (this.width / 1200) * 0.55));
    ctx.scale(scale, scale);

    // 1. CỔ ỐNG KÉP & GAI VẢY DƯỚI BỤNG (Uốn lượn nối từ nhịp vòm thứ 3)
    ctx.save();
    ctx.fillStyle = '#d97706';
    const spines = [
      { x: -140, y: 100, w: 18, h: 24 },
      { x: -115, y: 106, w: 17, h: 22 },
      { x: -90,  y: 88,  w: 16, h: 20 },
      { x: -65,  y: 68,  w: 15, h: 18 },
      { x: -40,  y: 78,  w: 13, h: 16 }
    ];
    spines.forEach(sp => {
      ctx.beginPath();
      ctx.moveTo(sp.x, sp.y - 12);
      ctx.lineTo(sp.x - sp.w, sp.y + sp.h);
      ctx.lineTo(sp.x + sp.w * 0.4, sp.y + sp.h * 0.3);
      ctx.closePath();
      ctx.fill();
    });

    // Ống dưới
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-150, 118);
    ctx.quadraticCurveTo(-85, 75, -20, 42);
    ctx.stroke();

    ctx.strokeStyle = '#ffb703';
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(-150, 115);
    ctx.quadraticCurveTo(-85, 72, -20, 39);
    ctx.stroke();

    // Ống trên
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-140, 92);
    ctx.quadraticCurveTo(-75, 48, -10, 18);
    ctx.stroke();

    ctx.strokeStyle = '#ffb703';
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(-140, 89);
    ctx.quadraticCurveTo(-75, 45, -10, 15);
    ctx.stroke();

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-135, 86);
    ctx.quadraticCurveTo(-75, 42, -10, 12);
    ctx.stroke();

    // Khớp đai nối ống
    ctx.fillStyle = '#78350f';
    [-115, -80, -45].forEach(rx => {
      ctx.fillRect(rx - 3, rx * 0.65 + 115, 6, 28);
    });
    ctx.restore();

    // 2. SỪNG MÂY UỐN LƯỢN SAU GÁY (S-curved cloud horn with bulb curl)
    ctx.save();
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(-18, -22);
    ctx.bezierCurveTo(-45, -42, -75, -35, -88, -20);
    ctx.bezierCurveTo(-102, -5, -98, 12, -82, 10);
    ctx.bezierCurveTo(-68, 8, -72, -6, -86, -6);
    ctx.bezierCurveTo(-90, -6, -92, -3, -88, 0);
    ctx.bezierCurveTo(-82, 4, -88, 2, -86, -4);
    ctx.bezierCurveTo(-80, -14, -60, -20, -32, -10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-14, -23);
    ctx.bezierCurveTo(-38, -40, -65, -33, -78, -18);
    ctx.arc(-72, -8, 13, -Math.PI * 0.7, Math.PI * 0.9, false);
    ctx.quadraticCurveTo(-48, 4, -24, -4);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(-72, -8, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.moveTo(-10, -25);
    ctx.bezierCurveTo(-34, -40, -60, -33, -74, -20);
    ctx.stroke();
    ctx.restore();

    // 3. VÀNH BỜM RỒNG RỰC LỬA 3 TẦNG (Layered Flaming Mane Tufts)
    // Tầng ngoài tối (#b45309)
    ctx.fillStyle = '#b45309';
    const maneA = [
      [-22, -26, -75, -32, 16],
      [-26, -8,  -88, -10, 17],
      [-26, 10,  -84, 12,  17],
      [-22, 28,  -70, 32,  16],
      [-14, 44,  -52, 52,  15],
      [-2,  56,  -28, 68,  14],
      [14,  64,   -6, 76,  13]
    ];
    maneA.forEach(([bx, by, tx, ty, mw]) => {
      ctx.beginPath();
      ctx.moveTo(bx - mw * 0.5, by - mw * 0.3);
      ctx.quadraticCurveTo(tx * 0.6, ty * 0.7, tx, ty);
      ctx.quadraticCurveTo(tx * 0.7 + mw * 0.4, ty * 0.6 + mw * 0.4, bx + mw * 0.5, by + mw * 0.3);
      ctx.closePath();
      ctx.fill();
    });

    // Tầng giữa vàng kim (#f59e0b)
    ctx.fillStyle = '#f59e0b';
    const maneB = [
      [-14, -20, -58, -24, 14],
      [-18, -4,  -70, -6,  15],
      [-18, 12,  -66, 10,  15],
      [-14, 28,  -54, 26,  14],
      [-6,  40,  -38, 44,  13],
      [4,   50,  -16, 56,  12],
      [18,  56,    4, 62,  11]
    ];
    maneB.forEach(([bx, by, tx, ty, mw]) => {
      ctx.beginPath();
      ctx.moveTo(bx - mw * 0.5, by - mw * 0.3);
      ctx.quadraticCurveTo(tx * 0.6, ty * 0.7, tx, ty);
      ctx.quadraticCurveTo(tx * 0.7 + mw * 0.4, ty * 0.6 + mw * 0.4, bx + mw * 0.5, by + mw * 0.3);
      ctx.closePath();
      ctx.fill();
    });

    // Tầng trong vàng tươi (#fde047)
    ctx.fillStyle = '#fde047';
    const maneC = [
      [-6, -16, -42, -18, 12],
      [-10, 0,  -48, -2,  13],
      [-10, 14, -46, 8,   13],
      [-6,  26, -34, 22,  12],
      [2,   36, -18, 38,  11],
      [14,  42,   0, 44,  10]
    ];
    maneC.forEach(([bx, by, tx, ty, mw]) => {
      ctx.beginPath();
      ctx.moveTo(bx - mw * 0.5, by - mw * 0.3);
      ctx.quadraticCurveTo(tx * 0.6, ty * 0.7, tx, ty);
      ctx.quadraticCurveTo(tx * 0.7 + mw * 0.4, ty * 0.6 + mw * 0.4, bx + mw * 0.5, by + mw * 0.3);
      ctx.closePath();
      ctx.fill();
    });

    // 4. KHỐI ĐẦU, MÀO GỢN MÂY & HÀM GẦM PHUN LỬA
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.moveTo(-15, 25);
    ctx.lineTo(12, 18);
    ctx.lineTo(24, 0);
    // Vòm trán
    ctx.quadraticCurveTo(30, -14, 38, -18);
    // 3 gờ mào mây lượn sóng trên sống mũi
    ctx.quadraticCurveTo(46, -32, 56, -26); // Gờ 1
    ctx.quadraticCurveTo(66, -34, 76, -22); // Gờ 2
    ctx.quadraticCurveTo(86, -30, 98, -14); // Gờ 3 / Mũi rồng
    // Mũi bo tròn và môi trên
    ctx.quadraticCurveTo(104, 0, 92, 10);
    // Vòm miệng trên
    ctx.lineTo(54, 14);
    // Họng sâu
    ctx.lineTo(48, 20);
    // Hàm dưới
    ctx.lineTo(74, 36);
    ctx.quadraticCurveTo(80, 44, 66, 48);
    // Chòm râu cằm uốn lượn
    ctx.quadraticCurveTo(52, 56, 36, 40);
    ctx.quadraticCurveTo(18, 32, -15, 25);
    ctx.closePath();
    ctx.fill();

    // Hốc miệng tối màu huyết dụ
    ctx.fillStyle = '#3b0704';
    ctx.beginPath();
    ctx.moveTo(92, 10);
    ctx.lineTo(54, 14);
    ctx.lineTo(48, 20);
    ctx.lineTo(74, 36);
    ctx.quadraticCurveTo(84, 22, 92, 10);
    ctx.closePath();
    ctx.fill();

    // Răng nanh trắng sắc nhọn
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(90, 9);
    ctx.lineTo(87, 18);
    ctx.lineTo(81, 10);
    ctx.lineTo(78, 18);
    ctx.lineTo(72, 11);
    ctx.lineTo(64, 12);
    ctx.closePath();
    ctx.fill();

    // Răng dưới
    ctx.beginPath();
    ctx.moveTo(71, 35);
    ctx.lineTo(68, 26);
    ctx.lineTo(62, 32);
    ctx.closePath();
    ctx.fill();

    // Viền sáng sống mũi
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(38, -18);
    ctx.quadraticCurveTo(46, -32, 56, -26);
    ctx.quadraticCurveTo(66, -34, 76, -22);
    ctx.quadraticCurveTo(86, -30, 98, -14);
    ctx.stroke();

    // 5. MẮT RỒNG ĐÈN PHA PHÁT SÁNG NGHIÊNG
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 6. LUỒNG LỬA PHUN CUỘN TRÀO ĐIỆN ẢNH (Phun trực tiếp từ họng rồng)
    this._drawCinematicFlamePlume(ctx, 48, 14);

    ctx.restore();
  }

  // LUỒNG LỬA PHUN VECTOR 2D CHUẨN XÁC THEO MẪU REFERENCE
  _drawCinematicFlamePlume(ctx, mx, my) {
    ctx.save();

    const t = this.dragonFlameTimer || 0;
    const fPulse = Math.sin(t * 8) * 3;

    // 1. LỚP VỎ LỬA ĐỎ CAM NGOÀI CÙNG VỚI CÁC ĐẦU LƯỠI LỬA SẮC BÉN
    ctx.save();
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#ea580c';

    ctx.beginPath();
    ctx.moveTo(mx, my);
    // Đường cong dưới của luồng lửa
    ctx.quadraticCurveTo(mx + 30, my + 8, mx + 60, my + 10);
    ctx.quadraticCurveTo(mx + 110, my + 18, mx + 160, my + 20);
    ctx.quadraticCurveTo(mx + 220, my + 24, mx + 260, my + 10);
    // Thùy lửa cuộn tròn phía trước dưới
    ctx.quadraticCurveTo(mx + 300, my - 4, mx + 318, my - 38 + fPulse);
    // Ngọn lửa xa nhất
    ctx.quadraticCurveTo(mx + 332, my - 74, mx + 304, my - 108);
    // Các đỉnh lưỡi lửa cuộn cao phía trên
    ctx.quadraticCurveTo(mx + 280, my - 96, mx + 260, my - 128); // Lưỡi 1
    ctx.quadraticCurveTo(mx + 232, my - 110, mx + 202, my - 136); // Lưỡi 2
    ctx.quadraticCurveTo(mx + 172, my - 116, mx + 142, my - 124); // Lưỡi 3
    ctx.quadraticCurveTo(mx + 110, my - 98, mx + 82, my - 104);  // Lưỡi 4
    // Uốn lượn trở về miệng rồng
    ctx.quadraticCurveTo(mx + 52, my - 58, mx + 24, my - 22);
    ctx.quadraticCurveTo(mx + 6, my - 6, mx, my);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Chóp lửa đỏ thẫm trên các ngọn cao nhất
    ctx.fillStyle = '#dc2626';
    const redTips = [
      [mx + 258, my - 128, mx + 270, my - 136, mx + 244, my - 108],
      [mx + 200, my - 136, mx + 212, my - 144, mx + 186, my - 116],
      [mx + 140, my - 124, mx + 150, my - 132, mx + 126, my - 104],
      [mx + 304, my - 110, mx + 318, my - 116, mx + 290, my - 84],
      [mx + 316, my - 38,  mx + 326, my - 32,  mx + 296, my - 12]
    ];
    redTips.forEach(([x1, y1, x2, y2, x3, y3]) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.closePath();
      ctx.fill();
    });

    // 2. THÂN LỬA VÀNG CAM RỰC RỠ
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(mx + 4, my - 1);
    ctx.quadraticCurveTo(mx + 50, my + 6,  mx + 105, my + 8);
    ctx.quadraticCurveTo(mx + 170, my + 16, mx + 235, my + 4);
    ctx.quadraticCurveTo(mx + 280, my - 10, mx + 295, my - 56);
    ctx.quadraticCurveTo(mx + 298, my - 94, mx + 266, my - 100);
    ctx.quadraticCurveTo(mx + 245, my - 86, mx + 218, my - 112);
    ctx.quadraticCurveTo(mx + 196, my - 96, mx + 168, my - 108);
    ctx.quadraticCurveTo(mx + 130, my - 90, mx + 104, my - 86);
    ctx.quadraticCurveTo(mx + 62,  my - 44, mx + 28,  my - 14);
    ctx.closePath();
    ctx.fill();

    // 3. VÙNG NHIỆT VÀNG CHANH TƯƠI SÁNG
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(mx + 4, my);
    ctx.quadraticCurveTo(mx + 44, my + 3,  mx + 94, my + 3);
    ctx.quadraticCurveTo(mx + 142, my + 6,  mx + 198, my - 6);
    ctx.quadraticCurveTo(mx + 242, my - 24, mx + 248, my - 62);
    ctx.quadraticCurveTo(mx + 242, my - 84, mx + 212, my - 84);
    ctx.quadraticCurveTo(mx + 186, my - 72, mx + 162, my - 88);
    ctx.quadraticCurveTo(mx + 124, my - 72, mx + 94,  my - 62);
    ctx.quadraticCurveTo(mx + 48,  my - 28, mx + 18,  my - 8);
    ctx.closePath();
    ctx.fill();

    // 4. TIA LỬA TRẮNG NÓNG BỪNG PHUN THẲNG TỪ HỌNG
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(mx - 2, my);
    ctx.lineTo(mx + 38, my - 8);
    ctx.quadraticCurveTo(mx + 78, my - 12, mx + 118, my - 22);
    ctx.quadraticCurveTo(mx + 154, my - 32, mx + 172, my - 42);
    ctx.quadraticCurveTo(mx + 138, my - 50, mx + 102, my - 44);
    ctx.quadraticCurveTo(mx + 58,  my - 28, mx + 28,  my - 11);
    ctx.lineTo(mx - 2, my - 1);
    ctx.closePath();
    ctx.fill();

    // Bầu sáng trắng thứ 2 bên trong tâm lửa
    ctx.beginPath();
    ctx.ellipse(mx + 122, my - 32, 34, 18, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 5. TÀN LỬA & TIA SÁNG BAY VỌT TRONG GIÓ (Embers & Flying Sparks)
    ctx.fillStyle = '#fef08a';
    const embers = [
      [mx + 56,  my - 66, 14, 5.0, -0.6],
      [mx + 94,  my - 96, 16, 5.0, -0.7],
      [mx + 148, my - 128, 20, 5.5, -0.5],
      [mx + 198, my - 152, 18, 5.5, -0.4],
      [mx + 242, my - 144, 15, 5.0, -0.2],
      [mx + 292, my - 128, 12, 5.0, 0.2],
      [mx + 328, my - 58,  14, 5.0, 0.5],
      [mx + 312, my + 6,   15, 5.0, 0.7],
      [mx + 266, my + 26,  18, 5.5, 0.8],
      [mx + 208, my + 38,  16, 5.0, 0.6],
      [mx + 152, my + 34,  14, 5.0, 0.4]
    ];
    embers.forEach(([ex, ey, ew, eh, er]) => {
      ctx.save();
      ctx.translate(ex, ey);
      ctx.rotate(er);
      ctx.beginPath();
      ctx.ellipse(0, 0, ew * 0.5, eh * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    ctx.restore();
  }

  // ÁNH LỬA & THÂN RỒNG PHẢN CHIẾU TRÊN MẶT NƯỚC SÔNG HÀN
  _drawDragonWaterReflections(ctx, bridgeY) {
    const w = this.width;
    const h = this.height;
    ctx.save();

    // 1. Vệt phản chiếu ánh vàng của 3 nhịp vòm (Tương ứng với 3 vòm thép)
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = '#ffb703';
    for (let r = 0; r < 10; r++) {
      const ry = bridgeY + 20 + r * 7;
      const wave = Math.sin(this.animTimer * 2.8 + r) * 12;
      const rw1 = 45 + wave;
      const rw2 = 80 + wave;
      const rw3 = 85 + wave;
      ctx.fillRect(w * 0.130 - rw1 * 0.5, ry, rw1, 2.8);
      ctx.fillRect(w * 0.282 - rw2 * 0.5, ry, rw2, 3.2);
      ctx.fillRect(w * 0.489 - rw3 * 0.5, ry, rw3, 3.2);
    }

    // 2. Vệt phản chiếu rực cháy của Đầu Rồng & Luồng Lửa (Bên phải)
    ctx.globalAlpha = 0.60;
    ctx.fillStyle = '#f97316';
    for (let f = 0; f < 12; f++) {
      const fry = bridgeY + 18 + f * 7.5;
      const fWave = Math.sin(this.animTimer * 4.2 + f * 0.8) * 16;
      const fw = 110 + fWave + f * 5;
      const fx = w * 0.82 - fw * 0.4;
      ctx.fillRect(fx, fry, fw, 3.2);

      // Điểm sáng vàng rực ở tâm vệt lửa
      ctx.fillStyle = '#fde047';
      ctx.fillRect(fx + fw * 0.2, fry, fw * 0.4, 2.2);
      ctx.fillStyle = '#f97316';
    }

    ctx.restore();
  }

  _drawDanangPromenade(ctx, startX, startY) {
    ctx.save();
    ctx.translate(startX, startY);

    // Lan can đá bờ kè Bạch Đằng
    ctx.fillStyle = '#172338';
    ctx.fillRect(0, 48, 140, 10);
    ctx.fillRect(0, 76, 140, 7);
    for (let i = 0; i < 7; i++) {
      ctx.fillRect(8 + i * 20, 58, 8, 18);
    }
    ctx.fillStyle = '#1e2f47';
    ctx.fillRect(120, 38, 16, 48);
    ctx.fillRect(118, 35, 20, 4);

    // Cột đèn đường
    ctx.fillStyle = '#080e18';
    ctx.fillRect(45, 12, 4, 38);
    ctx.fillStyle = '#1a293d';
    ctx.fillRect(20, 16, 28, 9);
    ctx.fillRect(48, 22, 26, 9);

    // Bụi cây rậm rạp ven sông
    ctx.fillStyle = '#06101c';
    ctx.beginPath();
    ctx.arc(-20, 56, 44, 0, Math.PI * 2);
    ctx.arc(20, 48, 32, 0, Math.PI * 2);
    ctx.arc(60, 65, 28, 0, Math.PI * 2);
    ctx.fill();

    // Lá dừa/lau sậy uốn lượn
    ctx.strokeStyle = '#133522';
    ctx.lineWidth = 2.4;
    for (let c = 0; c < 9; c++) {
      const cy = 46 + c * 6;
      const cx = -12 + c * 6;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.quadraticCurveTo(cx - 20, cy - 36, cx - 34, cy - 42);
      ctx.stroke();
    }
    ctx.restore();
  }

  _drawRightEmbankment(ctx, w, startY) {
    ctx.save();
    ctx.fillStyle = '#0a1526';
    ctx.beginPath();
    ctx.moveTo(w, startY);
    ctx.lineTo(w * 0.78, this.height);
    ctx.lineTo(w, this.height);
    ctx.closePath();
    ctx.fill();

    // Rặng dừa bóng nước bên hữu ngạn
    ctx.fillStyle = '#050c18';
    ctx.beginPath();
    ctx.arc(w - 20, startY + 40, 36, 0, Math.PI * 2);
    ctx.arc(w - 60, startY + 70, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _drawSoftCoastalClouds(ctx, baseY, alpha, count) {
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    for (let i = 0; i < count; i++) {
      const cx = ((i * 180 + (this.scrollX || 0) * 0.14) % (this.width + 160)) - 80;
      const cy = baseY + (i % 2) * 14;
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.arc(cx + 25, cy - 6, 40, 0, Math.PI * 2);
      ctx.arc(cx + 55, cy + 2, 28, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  _drawWaterTwinkles(ctx, startY) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 12; i++) {
      const ry = startY + 28 + i * 25;
      const rx = (((this.scrollX || 0) * 0.52 + i * 88) % this.width);
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + 36, ry);
      ctx.stroke();
    }
    ctx.restore();
  }

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
