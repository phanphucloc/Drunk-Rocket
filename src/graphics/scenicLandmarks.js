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
