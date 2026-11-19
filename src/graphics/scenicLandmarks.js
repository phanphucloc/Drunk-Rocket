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
    this._hoiAnScene = null;
    this._mienTayScene = null;
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
  // PANEL 5: ĐÀ NẴNG (MASTERPIECE CINEMATIC 2D ART)
  // Cầu Rồng Phun Lửa, Sông Hàn, Sơn Trà & Sun Wheel Khớp Chuẩn 100% Concept Art
  // ==========================================
  _drawDaNang(ctx) {
    ctx.save();
    const w = this.width;
    const h = this.height;

    // 1. Bầu trời đêm miền biển tím thẫm & mây cuộn Anime/Ghibli
    this._drawDaNangSkyAndClouds(ctx, w, h);

    // 2. Chân trời biển ửng hồng hoàng hôn, trăng tròn & vệt sáng trên vịnh
    this._drawDaNangMoonAndSea(ctx, w, h);

    // 3. Bán đảo Sơn Trà khối đa giác 3D hùng vĩ & Tượng Phật Bà Quan Âm tỏa hào quang
    this._drawSonTraAndLadyBuddha(ctx, w, h);

    // 4. Cầu quay Sông Hàn thanh mảnh ở trung cảnh xa
    this._drawHanRiverBridge(ctx, w, h);

    // 5. Skyline cao ốc Mỹ Khê (tháp neon Cyan rực sáng) & Vòng quay Sun Wheel lộng lẫy
    this._drawDaNangSkylineAndWheel(ctx, w, h);

    // 6. Mặt nước Sông Hàn sâu thẳm & sóng sánh phản chiếu
    this._drawHanRiverWater(ctx, w, h);

    // 7. CẦU RỒNG ĐÀ NẴNG HOÀNG TRÁNG (3 nhịp vòm thép vàng kim, cáp treo, vây lưng, bản cầu)
    this._drawDragonBridgeMasterpiece(ctx, w, h);

    // 8. Lan can đá Bạch Đằng góc dưới trái, rặng dừa & hoa viên tiền cảnh
    this._drawDaNangForegroundPromenade(ctx, w, h);

    ctx.restore();
  }

  // 1. Bầu trời đêm & Mây tầng cuộn kiểu Vector Anime
  _drawDaNangSkyAndClouds(ctx, w, h) {
    ctx.save();
    // Bầu trời chuyển sắc 5 tầng
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.52);
    sky.addColorStop(0, '#040916');    // Đêm sẫm đỉnh trời
    sky.addColorStop(0.28, '#0b142e'); // Xanh chàm thẫm
    sky.addColorStop(0.55, '#1e1c48'); // Tím đêm hoàng gia
    sky.addColorStop(0.78, '#3d255c'); // Tím hồng chuyển sắc
    sky.addColorStop(1.0, '#6e3c6a');  // Rực sáng đô thị ven biển
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h * 0.52);

    // Sao đêm: hạt sao lấp lánh & sao 4 cánh kim cương
    const t = (this.animTimer || 0);
    for (let i = 0; i < 36; i++) {
      const sx = ((i * 73 + 17) % (w - 20)) + 10;
      const sy = (i * 31 + 11) % (h * 0.30);
      const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(t * 2.5 + i));
      ctx.fillStyle = 'rgba(255, 255, 255, ' + twinkle + ')';

      if (i % 5 === 0) {
        // Sao 4 cánh kim cương
        ctx.fillRect(sx - 2.5, sy - 0.5, 5, 1);
        ctx.fillRect(sx - 0.5, sy - 2.5, 1, 5);
      } else {
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }
    }

    // Các cụm mây đêm cuộn bồng bềnh (Anime Clouds)
    const drawCloudCluster = (cx, cy, scale, colBack, colFront) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      // Lớp bóng mây tối phía sau
      ctx.fillStyle = colBack;
      ctx.beginPath();
      ctx.arc(-45, 10, 28, 0, Math.PI * 2);
      ctx.arc(-15, -12, 34, 0, Math.PI * 2);
      ctx.arc(25, -8, 30, 0, Math.PI * 2);
      ctx.arc(55, 12, 24, 0, Math.PI * 2);
      ctx.arc(0, 18, 38, 0, Math.PI * 2);
      ctx.fill();

      // Lớp mây sáng phía trên tạo khối 3D phồng
      ctx.fillStyle = colFront;
      ctx.beginPath();
      ctx.arc(-42, 6, 24, 0, Math.PI * 2);
      ctx.arc(-14, -14, 30, 0, Math.PI * 2);
      ctx.arc(22, -10, 26, 0, Math.PI * 2);
      ctx.arc(50, 8, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Mây góc trên bên trái
    drawCloudCluster(w * 0.18, h * 0.08, w / 700 * 0.85, 'rgba(22, 28, 56, 0.75)', 'rgba(48, 45, 82, 0.65)');
    // Mây góc trên bên phải
    drawCloudCluster(w * 0.82, h * 0.07, w / 700 * 0.95, 'rgba(26, 24, 58, 0.75)', 'rgba(56, 42, 88, 0.65)');
    // Mây mỏng lơ lửng lưng chừng trời
    drawCloudCluster(w * 0.48, h * 0.16, w / 700 * 0.70, 'rgba(32, 26, 64, 0.55)', 'rgba(64, 46, 96, 0.45)');

    ctx.restore();
  }

  // 2. Chân trời biển ửng hồng, Trăng tròn & Vệt trăng vịnh biển
  _drawDaNangMoonAndSea(ctx, w, h) {
    ctx.save();
    const horizonY = h * 0.38;
    const seaH = h * 0.06;

    // Dải chân trời biển ửng rực sắc hoàng hôn tím hồng
    const seaSkyGrad = ctx.createLinearGradient(0, horizonY - 25, 0, horizonY);
    seaSkyGrad.addColorStop(0, 'rgba(110, 60, 106, 0)');
    seaSkyGrad.addColorStop(0.5, 'rgba(195, 105, 130, 0.45)');
    seaSkyGrad.addColorStop(1, 'rgba(255, 165, 135, 0.75)');
    ctx.fillStyle = seaSkyGrad;
    ctx.fillRect(0, horizonY - 25, w, 25);

    // Mặt biển vịnh Đà Nẵng ở đường chân trời xa
    const seaGrad = ctx.createLinearGradient(0, horizonY, 0, horizonY + seaH);
    seaGrad.addColorStop(0, '#1c284e');
    seaGrad.addColorStop(0.5, '#142040');
    seaGrad.addColorStop(1, '#0e1834');
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, horizonY, w, seaH);

    // Mặt trăng tròn trên vịnh biển
    const moonX = w * 0.58;
    const moonY = h * 0.325;
    const moonR = Math.max(10, w * 0.025);

    // Hào quang tỏa tròn đa tầng của mặt trăng
    const glow = ctx.createRadialGradient(moonX, moonY, moonR * 0.5, moonX, moonY, moonR * 4.8);
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    glow.addColorStop(0.25, 'rgba(215, 235, 255, 0.45)');
    glow.addColorStop(0.6, 'rgba(170, 205, 255, 0.18)');
    glow.addColorStop(1, 'rgba(150, 190, 255, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR * 4.8, 0, Math.PI * 2);
    ctx.fill();

    // Đĩa trăng tròn phát sáng ngọc
    ctx.fillStyle = '#f0f7ff';
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    ctx.fill();

    // Vệt trăng chiếu rọi lấp lánh trên mặt biển xa
    const t = (this.animTimer || 0);
    ctx.fillStyle = 'rgba(240, 248, 255, 0.45)';
    for (let i = 0; i < 7; i++) {
      const ry = horizonY + 2 + i * 3.5;
      const rw = (moonR * 3.2 - i * 3) + Math.sin(t * 3.5 + i) * 4;
      ctx.fillRect(moonX - rw * 0.5, ry, rw, 1.8);
    }

    ctx.restore();
  }

  // 3. Bán đảo Sơn Trà khối đá đa giác 3D & Tượng Phật Bà Quan Âm Linh Ứng
  _drawSonTraAndLadyBuddha(ctx, w, h) {
    ctx.save();
    const baseY = h * 0.47;

    // A. LỚP NÚI SƠN TRÀ PHÍA XA (Đỉnh núi cao hùng vĩ)
    ctx.fillStyle = '#141c36';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.22);
    ctx.lineTo(w * 0.12, h * 0.17);  // Đỉnh Sơn Trà cao nhất
    ctx.lineTo(w * 0.22, h * 0.26);
    ctx.lineTo(w * 0.32, h * 0.24);  // Đỉnh phụ
    ctx.lineTo(w * 0.44, baseY);
    ctx.lineTo(0, baseY);
    ctx.closePath();
    ctx.fill();

    // Mảng sườn núi đổ bóng tối tạo góc cạnh 3D
    ctx.fillStyle = '#0d1326';
    ctx.beginPath();
    ctx.moveTo(w * 0.12, h * 0.17);
    ctx.lineTo(w * 0.18, h * 0.28);
    ctx.lineTo(w * 0.22, h * 0.26);
    ctx.closePath();
    ctx.fill();

    // B. LỚP ĐỒI RỪNG XANH THẪM PHÍA TRƯỚC (Bãi Bụt)
    ctx.fillStyle = '#080f1e';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.29);
    ctx.lineTo(w * 0.08, h * 0.27);
    ctx.quadraticCurveTo(w * 0.18, h * 0.31, w * 0.28, h * 0.37);
    ctx.lineTo(w * 0.38, baseY);
    ctx.lineTo(0, baseY);
    ctx.closePath();
    ctx.fill();

    // Rừng cây thông rậm rạp nhấp nhô
    ctx.fillStyle = '#050a14';
    for (let tx = 0; tx < w * 0.34; tx += 12) {
      const ty = h * 0.29 + (tx / (w * 0.34)) * (baseY - h * 0.29) - 4;
      ctx.beginPath();
      ctx.moveTo(tx - 6, ty + 10);
      ctx.lineTo(tx, ty);
      ctx.lineTo(tx + 6, ty + 10);
      ctx.closePath();
      ctx.fill();
    }

    // C. TƯỢNG PHẬT BÀ QUAN ÂM LINH ỨNG (Tỏa hào quang rực rỡ)
    const statueX = w * 0.175;
    const statueY = h * 0.435;
    const sH = Math.max(22, h * 0.045);

    // Hào quang vàng ấm tỏa rộng
    const bGlow = ctx.createRadialGradient(statueX, statueY - sH * 0.65, 2, statueX, statueY - sH * 0.65, sH * 1.5);
    bGlow.addColorStop(0, 'rgba(255, 225, 120, 0.85)');
    bGlow.addColorStop(0.35, 'rgba(255, 175, 60, 0.35)');
    bGlow.addColorStop(0.8, 'rgba(255, 140, 20, 0.10)');
    bGlow.addColorStop(1, 'rgba(255, 120, 0, 0)');
    ctx.fillStyle = bGlow;
    ctx.beginPath();
    ctx.arc(statueX, statueY - sH * 0.65, sH * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Tòa sen vàng cam
    ctx.fillStyle = '#e67e22';
    ctx.beginPath();
    ctx.ellipse(statueX, statueY, sH * 0.35, sH * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Thân Tượng Phật trắng ngọc thanh thoát
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(statueX - sH * 0.15, statueY);
    ctx.lineTo(statueX - sH * 0.18, statueY - sH * 0.45);
    ctx.lineTo(statueX - sH * 0.10, statueY - sH * 0.80);
    ctx.quadraticCurveTo(statueX, statueY - sH * 0.98, statueX + sH * 0.10, statueY - sH * 0.80);
    ctx.lineTo(statueX + sH * 0.18, statueY - sH * 0.45);
    ctx.lineTo(statueX + sH * 0.15, statueY);
    ctx.closePath();
    ctx.fill();

    // Bình cam lộ trên tay Phật
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(statueX - sH * 0.05, statueY - sH * 0.45, sH * 0.08, sH * 0.14);

    // Vành hào quang tròn sau đầu
    ctx.strokeStyle = '#fff3bf';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(statueX, statueY - sH * 0.82, sH * 0.20, 0, Math.PI * 2);
    ctx.stroke();

    // Cụm nhà resort dưới chân núi
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(w * 0.08, baseY - 12, 28, 12);
    ctx.fillRect(w * 0.13, baseY - 8, 22, 8);
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(w * 0.09, baseY - 9, 3, 3);
    ctx.fillRect(w * 0.11, baseY - 9, 3, 3);
    ctx.fillRect(w * 0.14, baseY - 6, 3, 3);

    ctx.restore();
  }

  // 4. Cầu quay Sông Hàn thanh mảnh ở trung cảnh
  _drawHanRiverBridge(ctx, w, h) {
    ctx.save();
    const cx = w * 0.49;
    const cy = h * 0.468;
    const span = w * 0.15;

    // Bản mặt cầu ngang
    ctx.fillStyle = '#1b2a47';
    ctx.fillRect(cx - span, cy, span * 2, 2.5);

    // Trụ cầu trung tâm & trụ bên
    ctx.fillStyle = '#0d1728';
    ctx.fillRect(cx - 5, cy + 2, 10, 8);
    ctx.fillRect(cx - span * 0.65, cy + 2, 6, 7);
    ctx.fillRect(cx + span * 0.65 - 6, cy + 2, 6, 7);

    // Trụ tháp cầu quay ở giữa
    ctx.fillStyle = '#2b4570';
    ctx.fillRect(cx - 2, cy - 20, 4, 20);

    // Dây văng tỏa đều 2 bên
    ctx.strokeStyle = 'rgba(180, 220, 255, 0.60)';
    ctx.lineWidth = 0.7;
    for (let i = 1; i <= 6; i++) {
      const off = i * (span * 0.12);
      ctx.beginPath();
      ctx.moveTo(cx, cy - 18);
      ctx.lineTo(cx - off, cy);
      ctx.moveTo(cx, cy - 18);
      ctx.lineTo(cx + off, cy);
      ctx.stroke();
    }

    // Vòm thép parabol thanh mảnh ôm qua trụ
    ctx.strokeStyle = '#5c88c7';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(cx - span * 0.72, cy);
    ctx.quadraticCurveTo(cx, cy - 36, cx + span * 0.72, cy);
    ctx.stroke();

    ctx.restore();
  }

  // 5. Skyline cao ốc Mỹ Khê (Tháp neon Cyan) & Vòng quay Sun Wheel
  _drawDaNangSkylineAndWheel(ctx, w, h) {
    ctx.save();
    const startX = w * 0.64;
    const baseY = h * 0.495;

    // A. DÃY CAO ỐC HIỆN ĐẠI
    const buildings = [
      { dx: 0,          bw: w * 0.038, bh: h * 0.065, col: '#101d36', win: '#00f5d4', neon: false },
      { dx: w * 0.042,  bw: w * 0.048, bh: h * 0.095, col: '#16294a', win: '#ffd166', neon: false },
      { dx: w * 0.095,  bw: w * 0.038, bh: h * 0.055, col: '#0d182d', win: '#00f5d4', neon: false },
      // Tòa tháp chính nổi bật với lưới LED Neon Cyan
      { dx: w * 0.138,  bw: w * 0.075, bh: h * 0.165, col: '#0c2238', win: '#72efdd', neon: true },
      { dx: w * 0.220,  bw: w * 0.060, bh: h * 0.118, col: '#172740', win: '#ffea9f', neon: false },
      { dx: w * 0.285,  bw: w * 0.052, bh: h * 0.075, col: '#101e33', win: '#00bbf9', neon: false }
    ];

    buildings.forEach(b => {
      const bx = startX + b.dx;
      if (bx > w) return;
      const by = baseY - b.bh;

      ctx.fillStyle = b.col;
      ctx.fillRect(bx, by, b.bw, b.bh);

      if (b.neon) {
        // Viền Neon Cyan rực sáng cho tòa nhà biểu tượng
        ctx.save();
        ctx.strokeStyle = '#00f5d4';
        ctx.lineWidth = 1.6;
        ctx.shadowColor = '#00f5d4';
        ctx.shadowBlur = 10;
        ctx.strokeRect(bx, by, b.bw, b.bh);
        // Đường sọc đứng neon ở giữa
        ctx.beginPath();
        ctx.moveTo(bx + b.bw * 0.5, by);
        ctx.lineTo(bx + b.bw * 0.5, baseY);
        ctx.stroke();
        ctx.restore();
      }

      // Cửa sổ vuông sáng đèn rực rỡ
      ctx.fillStyle = b.win;
      for (let wy = by + 4; wy < baseY - 4; wy += 5) {
        for (let wx = bx + 3; wx < bx + b.bw - 3; wx += 5) {
          if ((wx + wy) % 2 === 0) {
            ctx.fillRect(wx, wy, 2.5, 2);
          }
        }
      }
    });

    // B. VÒNG QUAY MẶT TRỜI (SUN WHEEL)
    const wheelX = w * 0.925;
    const wheelY = h * 0.355;
    const wheelR = Math.max(34, w * 0.095);

    ctx.save();
    ctx.translate(wheelX, wheelY);

    // Chân tháp đỡ chữ A
    ctx.strokeStyle = '#1a233a';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-wheelR * 0.35, wheelR + 12);
    ctx.moveTo(0, 0);
    ctx.lineTo(wheelR * 0.35, wheelR + 12);
    ctx.stroke();

    // Vành ngoài neon kép (Hồng tím & Cyan)
    ctx.save();
    ctx.strokeStyle = '#ff007f';
    ctx.lineWidth = 2.2;
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, wheelR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#00f5d4';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, 0, wheelR * 0.84, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Nan hoa xoay tròn & Cabin hành khách vàng rực
    const rot = (this.animTimer || 0) * 0.35;
    const spokes = 16;
    for (let i = 0; i < spokes; i++) {
      const a = rot + (i * Math.PI * 2) / spokes;
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(0, 245, 212, 0.85)' : 'rgba(255, 0, 127, 0.85)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * wheelR, Math.sin(a) * wheelR);
      ctx.stroke();

      // Cabin chở khách
      ctx.fillStyle = '#ffbe0b';
      ctx.beginPath();
      ctx.arc(Math.cos(a) * (wheelR * 0.92), Math.sin(a) * (wheelR * 0.92), 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Trục tròn trung tâm
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  // 6. Mặt nước Sông Hàn sâu thẳm & gợn sóng
  _drawHanRiverWater(ctx, w, h) {
    ctx.save();
    const riverY = h * 0.44;

    const waterGrad = ctx.createLinearGradient(0, riverY, 0, h);
    waterGrad.addColorStop(0, '#1c2e50');
    waterGrad.addColorStop(0.20, '#12203d');
    waterGrad.addColorStop(0.55, '#0a1428');
    waterGrad.addColorStop(1.0, '#040814');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, riverY, w, h - riverY);

    // Bờ kè hữu ngạn uốn lượn bên phải
    ctx.fillStyle = '#0f1826';
    ctx.beginPath();
    ctx.moveTo(w * 0.65, h * 0.50);
    ctx.lineTo(w, h * 0.54);
    ctx.lineTo(w, h);
    ctx.lineTo(w * 0.82, h);
    ctx.quadraticCurveTo(w * 0.70, h * 0.80, w * 0.78, h * 0.68);
    ctx.closePath();
    ctx.fill();

    // Viền kè đá bờ sông
    ctx.strokeStyle = '#3e526e';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(w * 0.82, h);
    ctx.quadraticCurveTo(w * 0.70, h * 0.80, w * 0.78, h * 0.68);
    ctx.stroke();

    ctx.restore();
  }

  // 7. CẦU RỒNG ĐÀ NẴNG (3 Nhịp vòm thép vàng, Đầu rồng thời Lý & Luồng lửa cuộn trào)
  _drawDragonBridgeMasterpiece(ctx, w, h) {
    ctx.save();

    // Hệ số tỉ lệ co giãn s giúp khớp chuẩn xác mọi kích cỡ màn hình
    const s = Math.max(0.52, Math.min(1.4, w / 700));

    // Mặt cầu đổ dốc nghiêng tự nhiên từ bờ tây sang bờ đông
    const bridgeStartY = h * 0.63;
    const leftY = bridgeStartY - 10 * s;
    const rightY = bridgeStartY + 28 * s;
    const getBridgeY = (x) => leftY + (x / w) * (rightY - leftY);

    // A. BÓNG NƯỚC PHẢN CHIẾU 3 NHỊP VÒM VÀNG ÓNG & LỬA PHUN
    this._drawDragonRiverReflections(ctx, w, h, s, getBridgeY);

    // B. CÁC TRỤ CẦU BÊ TÔNG ĐỠ DƯỚI SÔNG
    const pierPositions = [0.18, 0.44, 0.68];
    pierPositions.forEach(p => {
      const px = w * p;
      const py = getBridgeY(px);
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(px - 9 * s, py + 3 * s, 18 * s, 18 * s);
      ctx.fillStyle = '#4a2f15';
      ctx.fillRect(px + 2 * s, py + 3 * s, 7 * s, 18 * s);
    });

    // C. 3 NHỊP VÒM THÂN RỒNG VÀNG RỰC (Uốn lượn liên hoàn)
    // Tỉ lệ căn chỉnh tối ưu để Đầu Rồng & Lửa nằm trọn vẹn trong khung hình
    const arches = [
      { startX: w * 0.06, endX: w * 0.20, archH: 26 * s },  // Nhịp 1 nhỏ bên trái
      { startX: w * 0.21, endX: w * 0.45, archH: 62 * s },  // Nhịp 2 lớn nhất ở giữa
      { startX: w * 0.47, endX: w * 0.68, archH: 54 * s }   // Nhịp 3 vươn dài nối vào cổ rồng
    ];

    arches.forEach(a => {
      const sy = getBridgeY(a.startX);
      const ey = getBridgeY(a.endX);
      const midX = (a.startX + a.endX) * 0.5;
      const midY = (sy + ey) * 0.5 - a.archH;

      // Dây cáp treo mạ vàng buông thẳng tắp xuống mặt cầu
      ctx.strokeStyle = 'rgba(255, 230, 140, 0.70)';
      ctx.lineWidth = 1.0;
      const cables = 9;
      for (let c = 1; c < cables; c++) {
        const t = c / cables;
        const cx = (1 - t) * (1 - t) * a.startX + 2 * (1 - t) * t * midX + t * t * a.endX;
        const cy = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * midY + t * t * ey;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, getBridgeY(cx));
        ctx.stroke();
      }

      // Hàng vây lưng rồng nhọn hoắt vàng cam xếp đều dọc vòm
      ctx.fillStyle = '#ff9f1c';
      const fins = 12;
      for (let f = 1; f < fins; f++) {
        const t = f / fins;
        const fx = (1 - t) * (1 - t) * a.startX + 2 * (1 - t) * t * midX + t * t * a.endX;
        const fy = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * midY + t * t * ey;
        ctx.beginPath();
        ctx.moveTo(fx - 4 * s, fy);
        ctx.lineTo(fx + 2 * s, fy - 8 * s);
        ctx.lineTo(fx + 5 * s, fy + 2 * s);
        ctx.closePath();
        ctx.fill();
      }

      // Khung ống vòm chính vàng rực phát sáng
      ctx.save();
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 7.5 * s;
      ctx.shadowColor = '#ff9f1c';
      ctx.shadowBlur = 12 * s;
      ctx.beginPath();
      ctx.moveTo(a.startX, sy);
      ctx.quadraticCurveTo(midX, midY, a.endX, ey);
      ctx.stroke();

      // Viền cam đậm tạo khối 3D cho thân rồng
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.2 * s;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(a.startX, sy + 3 * s);
      ctx.quadraticCurveTo(midX, midY + 3 * s, a.endX, ey + 3 * s);
      ctx.stroke();
      ctx.restore();
    });

    // Đuôi rồng hoa sen cách điệu ở đầu cầu bên trái
    const tailX = w * 0.045;
    const tailY = getBridgeY(tailX);
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.moveTo(tailX + 10 * s, tailY);
    ctx.quadraticCurveTo(tailX - 5 * s, tailY - 22 * s, tailX + 4 * s, tailY - 26 * s);
    ctx.quadraticCurveTo(tailX + 14 * s, tailY - 20 * s, tailX + 14 * s, tailY);
    ctx.fill();

    // D. BẢN MẶT CẦU NGHIÊNG (Roadway Deck)
    ctx.fillStyle = '#222b3d';
    ctx.beginPath();
    ctx.moveTo(0, leftY);
    ctx.lineTo(w * 0.90, getBridgeY(w * 0.90));
    ctx.lineTo(w * 0.90, getBridgeY(w * 0.90) + 9 * s);
    ctx.lineTo(0, leftY + 9 * s);
    ctx.closePath();
    ctx.fill();

    // Dải đèn led cao tốc vàng ấm rực rỡ suốt chiều dài cầu
    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath();
    ctx.moveTo(0, leftY + 7 * s);
    ctx.lineTo(w * 0.90, getBridgeY(w * 0.90) + 7 * s);
    ctx.lineTo(w * 0.90, getBridgeY(w * 0.90) + 10 * s);
    ctx.lineTo(0, leftY + 10 * s);
    ctx.closePath();
    ctx.fill();

    // E. CỔ RỒNG, ĐẦU RỒNG THỜI LÝ & LUỒNG LỬA PHUN ĐIỆN ẢNH
    const neckX = w * 0.69;
    const neckY = getBridgeY(neckX);
    const headX = w * 0.77;
    const headY = neckY - 34 * s;

    this._drawCinematicDragonHeadAndFlame(ctx, neckX, neckY, headX, headY, s);

    ctx.restore();
  }

  // Chi tiết Đầu Rồng Thời Lý & Luồng Lửa Cuộn Trào (100% Faithful to Reference)
  _drawCinematicDragonHeadAndFlame(ctx, neckX, neckY, headX, headY, s) {
    ctx.save();

    // --- 1. CỔ RỒNG ỐNG KÉP & GAI BỤNG ---
    // Hàng gai nhọn dưới bụng cổ rồng
    ctx.fillStyle = '#d97706';
    const spineOffsets = [
      { t: 0.18, len: 14 * s, angle: 1.1 },
      { t: 0.38, len: 16 * s, angle: 0.9 },
      { t: 0.58, len: 18 * s, angle: 0.7 },
      { t: 0.78, len: 15 * s, angle: 0.5 }
    ];
    spineOffsets.forEach(sp => {
      const sx = neckX + (headX - neckX) * sp.t - 4 * s;
      const sy = neckY + (headY - neckY) * sp.t + 10 * s;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx - Math.cos(sp.angle) * sp.len, sy + Math.sin(sp.angle) * sp.len);
      ctx.lineTo(sx + 5 * s, sy + 3 * s);
      ctx.closePath();
      ctx.fill();
    });

    // Ống dưới (Cổ rồng)
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 14 * s;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(neckX, neckY + 4 * s);
    ctx.quadraticCurveTo(neckX + (headX - neckX) * 0.45, neckY + 2 * s, headX - 8 * s, headY + 16 * s);
    ctx.stroke();

    ctx.strokeStyle = '#ffb703';
    ctx.lineWidth = 9 * s;
    ctx.beginPath();
    ctx.moveTo(neckX, neckY + 2 * s);
    ctx.quadraticCurveTo(neckX + (headX - neckX) * 0.45, neckY, headX - 8 * s, headY + 14 * s);
    ctx.stroke();

    // Ống trên (Cổ rồng)
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 14 * s;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(neckX + 5 * s, neckY - 8 * s);
    ctx.quadraticCurveTo(neckX + (headX - neckX) * 0.52, neckY - 14 * s, headX - 4 * s, headY);
    ctx.stroke();

    ctx.strokeStyle = '#ffb703';
    ctx.lineWidth = 9 * s;
    ctx.beginPath();
    ctx.moveTo(neckX + 5 * s, neckY - 9 * s);
    ctx.quadraticCurveTo(neckX + (headX - neckX) * 0.52, neckY - 15 * s, headX - 4 * s, headY - 1 * s);
    ctx.stroke();

    // Sống ống highlight sáng bóng
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2.5 * s;
    ctx.beginPath();
    ctx.moveTo(neckX + 8 * s, neckY - 11 * s);
    ctx.quadraticCurveTo(neckX + (headX - neckX) * 0.52, neckY - 17 * s, headX - 4 * s, headY - 3 * s);
    ctx.stroke();

    // Khớp đai nối ống
    ctx.fillStyle = '#78350f';
    [0.3, 0.6, 0.85].forEach(t => {
      const rx = neckX + (headX - neckX) * t;
      const ry = neckY + (headY - neckY) * t;
      ctx.fillRect(rx - 2 * s, ry - 7 * s, 4 * s, 16 * s);
    });

    // --- 2. ĐẦU RỒNG & BỜM LỬA (Local Coordinate Space) ---
    ctx.save();
    ctx.translate(headX, headY);
    // Tỉ lệ scale chuẩn xác đảm bảo đầu rồng to rõ, sắc sảo và cân đối
    const headScale = s * 0.76;
    ctx.scale(headScale, headScale);

    // Sừng Mây Chữ S Sau Gáy (S-curved cloud horn)
    ctx.save();
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(-16, -20);
    ctx.bezierCurveTo(-42, -40, -72, -34, -84, -18);
    ctx.bezierCurveTo(-98, -4, -94, 12, -78, 10);
    ctx.bezierCurveTo(-66, 8, -70, -4, -82, -4);
    ctx.bezierCurveTo(-86, -4, -88, -2, -84, 0);
    ctx.bezierCurveTo(-78, 4, -84, 2, -82, -2);
    ctx.bezierCurveTo(-76, -12, -58, -18, -30, -8);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-12, -21);
    ctx.bezierCurveTo(-36, -38, -62, -32, -74, -16);
    ctx.arc(-68, -6, 12, -Math.PI * 0.7, Math.PI * 0.9, false);
    ctx.quadraticCurveTo(-44, 4, -22, -4);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(-68, -6, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(-8, -23);
    ctx.bezierCurveTo(-32, -38, -58, -31, -70, -18);
    ctx.stroke();
    ctx.restore();

    // Vành Bờm Rồng Rực Lửa 3 Tầng (Layered Flaming Mane Tufts)
    // Tầng 1: Hổ phách sẫm (#b45309)
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

    // Tầng 2: Vàng kim rực rỡ (#f59e0b)
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

    // Tầng 3: Vàng tươi ánh nắng (#fde047)
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

    // Khối Đầu & Hàm Rồng Thời Lý Gầm Mở Rộng
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

    // Hốc miệng sâu màu huyết dụ tối
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

    // Viền sáng mào rồng
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(38, -18);
    ctx.quadraticCurveTo(46, -32, 56, -26);
    ctx.quadraticCurveTo(66, -34, 76, -22);
    ctx.quadraticCurveTo(86, -30, 98, -14);
    ctx.stroke();

    // Mắt Rồng Tròn Luminous Đèn Pha Phát Sáng
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

    // --- 3. LUỒNG LỬA PHUN CUỘN TRÀO ĐIỆN ẢNH (Phun trực tiếp từ miệng rồng) ---
    const mx = 48;
    const my = 14;
    const fTimer = (this.dragonFlameTimer || 0) + (this.animTimer || 0);
    const fPulse = Math.sin(fTimer * 8) * 3;

    // A. Lớp vỏ lửa đỏ cam với các thùy lửa cuộn tròn & lưỡi lửa vuốt cong
    ctx.save();
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.quadraticCurveTo(mx + 30, my + 8, mx + 60, my + 10);
    ctx.quadraticCurveTo(mx + 110, my + 18, mx + 160, my + 20);
    ctx.quadraticCurveTo(mx + 220, my + 24, mx + 260, my + 10);
    ctx.quadraticCurveTo(mx + 300, my - 4, mx + 318, my - 38 + fPulse);
    ctx.quadraticCurveTo(mx + 332, my - 74, mx + 304, my - 108);
    ctx.quadraticCurveTo(mx + 280, my - 96, mx + 260, my - 128); // Lưỡi 1
    ctx.quadraticCurveTo(mx + 232, my - 110, mx + 202, my - 136); // Lưỡi 2
    ctx.quadraticCurveTo(mx + 172, my - 116, mx + 142, my - 124); // Lưỡi 3
    ctx.quadraticCurveTo(mx + 110, my - 98, mx + 82, my - 104);  // Lưỡi 4
    ctx.quadraticCurveTo(mx + 52, my - 58, mx + 24, my - 22);
    ctx.quadraticCurveTo(mx + 6, my - 6, mx, my);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Chóp lửa đỏ thẫm
    ctx.fillStyle = '#dc2626';
    const redTips = [
      [mx + 258, my - 128, mx + 270, my - 136, mx + 244, my - 108],
      [mx + 200, my - 136, mx + 212, my - 146, mx + 188, my - 118],
      [mx + 140, my - 124, mx + 150, my - 132, mx + 130, my - 110]
    ];
    redTips.forEach(([x1, y1, x2, y2, x3, y3]) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.closePath();
      ctx.fill();
    });

    // B. Thân lửa vàng cam rực cháy
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

    // C. Vùng nhiệt vàng tươi
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

    // D. Tia phản lực trắng nóng bừng từ họng
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

    ctx.beginPath();
    ctx.ellipse(mx + 122, my - 32, 34, 18, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // E. Tàn lửa & Tia sáng bay trong gió
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
      [mx + 208, my + 38,  16, 5.0, 0.6]
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
    ctx.restore();
  }

  // Bóng nước phản chiếu thân rồng vàng rực & luồng lửa dưới sông Hàn
  _drawDragonRiverReflections(ctx, w, h, s, getBridgeY) {
    ctx.save();
    const t = (this.animTimer || 0);

    // 1. Phản chiếu 3 vòm rồng
    const archReflections = [
      { cx: w * 0.13, cy: getBridgeY(w * 0.13) + 16 * s, maxW: 48 * s },
      { cx: w * 0.33, cy: getBridgeY(w * 0.33) + 18 * s, maxW: 82 * s },
      { cx: w * 0.57, cy: getBridgeY(w * 0.57) + 20 * s, maxW: 86 * s }
    ];

    archReflections.forEach(ar => {
      for (let i = 0; i < 9; i++) {
        const ratio = i / 9;
        const rw = Math.sin(ratio * Math.PI) * ar.maxW + Math.sin(t * 3.5 + i) * (7 * s);
        const ry = ar.cy + i * (4.2 * s);
        ctx.fillStyle = i < 4 ? 'rgba(255, 209, 102, 0.55)' : 'rgba(245, 158, 11, 0.35)';
        ctx.fillRect(ar.cx - rw * 0.5, ry, rw, 2.5 * s);
      }
    });

    // 2. Phản chiếu khổng lồ rực sáng của Đầu Rồng & Luồng Lửa dưới chân đầu rồng
    const flameRefX = w * 0.76;
    const flameRefY = getBridgeY(flameRefX) + 16 * s;

    // Vệt vàng óng của đầu rồng
    ctx.fillStyle = 'rgba(255, 183, 3, 0.50)';
    for (let i = 0; i < 8; i++) {
      const ry = flameRefY + i * 5 * s;
      const rw = (55 + Math.sin(t * 3 + i) * 12) * s;
      ctx.fillRect(flameRefX - rw * 0.5, ry, rw, 2.5 * s);
    }

    // Vệt lửa đỏ cam rực rỡ trải dài sang phải
    ctx.fillStyle = 'rgba(249, 115, 22, 0.60)';
    for (let f = 0; f < 12; f++) {
      const fry = flameRefY + f * 5.8 * s;
      const fWave = Math.sin(t * 4.2 + f * 0.8) * 16 * s;
      const fw = (95 + fWave + f * 5.5) * s;
      const fx = flameRefX + 18 * s;
      ctx.fillRect(fx, fry, fw, 2.8 * s);

      // Tâm sáng vàng tươi giữa vệt lửa
      ctx.fillStyle = 'rgba(253, 224, 71, 0.70)';
      ctx.fillRect(fx + fw * 0.22, fry, fw * 0.42, 1.8 * s);
      ctx.fillStyle = 'rgba(249, 115, 22, 0.60)';
    }

    ctx.restore();
  }

  // 8. Lan can bờ sông Bạch Đằng, hàng dừa & cây xanh tiền cảnh
  _drawDaNangForegroundPromenade(ctx, w, h) {
    ctx.save();

    // Sàn ngắm cảnh góc dưới trái
    const deckY = h * 0.88;
    ctx.fillStyle = '#131e33';
    ctx.beginPath();
    ctx.moveTo(w * 0.05, deckY);
    ctx.lineTo(w * 0.38, deckY);
    ctx.lineTo(w * 0.32, h);
    ctx.lineTo(w * 0.03, h);
    ctx.closePath();
    ctx.fill();

    // Lan can đá màu trắng/xanh lam nhạt thanh lịch (Khớp chuẩn hình tham khảo)
    ctx.strokeStyle = '#6c8ebf';
    ctx.lineWidth = 2.0;
    ctx.strokeRect(w * 0.06, deckY - 18, w * 0.31, 18);
    ctx.beginPath();
    ctx.moveTo(w * 0.06, deckY - 9);
    ctx.lineTo(w * 0.37, deckY - 9);
    ctx.stroke();

    for (let lx = w * 0.06; lx <= w * 0.37; lx += 18) {
      ctx.fillStyle = '#8da9d4';
      ctx.fillRect(lx - 1.5, deckY - 20, 3, 20);
    }

    // Bụi lá dừa nhiệt đới góc dưới trái
    this._drawPalmSil(ctx, w * 0.05, h * 0.84, 1);
    // Rặng dừa bóng đêm góc dưới phải
    this._drawPalmSil(ctx, w * 0.93, h * 0.79, -1);

    ctx.restore();
  }

  _drawPalmSil(ctx, x, y, dir) {
    ctx.save();
    ctx.translate(x, y);

    // Thân dừa uốn cong
    ctx.strokeStyle = '#040912';
    ctx.lineWidth = 5.5;
    ctx.beginPath();
    ctx.moveTo(0, 80);
    ctx.quadraticCurveTo(-dir * 8, 25, dir * 6, -35);
    ctx.stroke();

    // Tán lá dừa xòe cong
    ctx.fillStyle = '#060f1c';
    const angles = [-2.6, -2.0, -1.4, -0.7, -0.1, 0.5];
    angles.forEach(a => {
      ctx.beginPath();
      ctx.moveTo(dir * 6, -35);
      const ex = dir * 6 + Math.cos(a) * 38 * dir;
      const ey = -35 + Math.sin(a) * 32;
      ctx.quadraticCurveTo((dir * 6 + ex) * 0.5, ey - 10, ex, ey);
      ctx.quadraticCurveTo((dir * 6 + ex) * 0.5, ey - 2, dir * 6, -35);
      ctx.fill();
    });

    ctx.restore();
  }

  // ==========================================
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

    // 1. Bầu trời đêm đô thị (Navy - Tím - Hồng neon ở chân trời)
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.52);
    sky.addColorStop(0, '#060927');
    sky.addColorStop(0.35, '#1d1050');
    sky.addColorStop(0.65, '#5a1f86');
    sky.addColorStop(0.88, '#c23aa6');
    sky.addColorStop(1, '#ff6fc0');
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
    land.addColorStop(0, '#231452');
    land.addColorStop(0.4, '#171040');
    land.addColorStop(1, '#0d0930');
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

  // Sao đêm & mây tím
  _drawAtmosphereEffects(ctx) {
    const w = this.width;
    const h = this.height;
    ctx.save();
    for (let i = 0; i < 70; i++) {
      const sx = this._rnd(i + 1) * w;
      const sy = this._rnd(i + 91) * h * 0.34;
      const alpha = (0.2 + 0.7 * Math.abs(Math.sin(this.animTimer * 1.6 + i))) * (1 - sy / (h * 0.4));
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, alpha)})`;
      if (i % 9 === 0) {
        ctx.fillRect(sx - 2, sy - 0.5, 4, 1);
        ctx.fillRect(sx - 0.5, sy - 2, 1, 4);
      } else {
        ctx.fillRect(sx, sy, 1.1, 1.1);
      }
    }

    const clouds = [
      { y: 0.16, len: 150, spd: 0.08, a: 0.38 },
      { y: 0.27, len: 190, spd: 0.05, a: 0.34 },
      { y: 0.07, len: 120, spd: 0.11, a: 0.30 },
      { y: 0.36, len: 170, spd: 0.06, a: 0.30 }
    ];
    clouds.forEach((c, i) => {
      const cx = ((this.scrollX * c.spd * 3 + i * 170) % (w + c.len * 2)) - c.len;
      const cy = h * c.y;
      ctx.fillStyle = `rgba(110, 70, 170, ${c.a})`;
      ctx.beginPath();
      ctx.ellipse(cx, cy, c.len * 0.5, 11, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + c.len * 0.2, cy - 8, c.len * 0.3, 10, 0, 0, Math.PI * 2);
      ctx.ellipse(cx - c.len * 0.22, cy - 4, c.len * 0.26, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // Quầng sáng đô thị phía chân trời
  _drawCityGlow(ctx, y) {
    ctx.save();
    const g = ctx.createLinearGradient(0, y - 120, 0, y + 6);
    g.addColorStop(0, 'rgba(255, 80, 200, 0)');
    g.addColorStop(0.7, 'rgba(255, 90, 210, 0.28)');
    g.addColorStop(1, 'rgba(255, 140, 220, 0.5)');
    ctx.fillStyle = g;
    ctx.fillRect(0, y - 120, this.width, 126);
    ctx.restore();
  }

  // Đường chân trời xa: hai lớp cao ốc kèm cửa sổ lấp lánh
  _drawFarSkyline(ctx, baseY) {
    const w = this.width;
    ctx.save();
    const layers = [
      { col: '#3b2380', step: 11, min: 24, max: 96, seed: 5, win: 'rgba(255, 190, 240, 0.55)' },
      { col: '#241564', step: 9, min: 16, max: 66, seed: 41, win: 'rgba(255, 215, 150, 0.6)' }
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
      { x: 0.00, b: 0.62, bw: 16, bh: 74, col: '#1a2f66', win: '#33f0e0', neon: '#22d3ee' },
      { x: 0.04, b: 0.64, bw: 20, bh: 96, col: '#17275c', win: '#ffd166', neon: null },
      { x: 0.095, b: 0.63, bw: 16, bh: 60, col: '#102248', win: '#33f0e0', neon: '#22d3ee' },
      { x: 0.14, b: 0.60, bw: 22, bh: 112, col: '#1d3a78', win: '#8ef5ff', neon: '#38e8ff' },
      // Giữa Landmark và sông
      { x: 0.31, b: 0.585, bw: 16, bh: 70, col: '#1b2d66', win: '#ffd166', neon: null },
      { x: 0.345, b: 0.56, bw: 14, bh: 54, col: '#2a1c70', win: '#ff9de0', neon: '#ff4fd8' },
      // Bờ phải, trái Bitexco
      { x: 0.55, b: 0.545, bw: 14, bh: 48, col: '#241a66', win: '#ffd166', neon: null },
      { x: 0.585, b: 0.555, bw: 18, bh: 76, col: '#17306c', win: '#33f0e0', neon: '#22d3ee' },
      { x: 0.63, b: 0.565, bw: 16, bh: 56, col: '#2d1f78', win: '#ff9de0', neon: '#ff4fd8' },
      // Phải Bitexco
      { x: 0.825, b: 0.63, bw: 40, bh: 66, col: '#c2693c', win: '#ffe3a0', neon: null },
      { x: 0.915, b: 0.62, bw: 20, bh: 168, col: '#142a66', win: '#9af6ff', neon: '#22d3ee' },
      { x: 0.955, b: 0.64, bw: 26, bh: 130, col: '#3a1a78', win: '#ff9de0', neon: '#ff4fd8' },
      { x: 0.865, b: 0.655, bw: 22, bh: 42, col: '#d9895a', win: '#fff0c0', neon: null }
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
    aura.addColorStop(0, 'rgba(40, 210, 255, 0.30)');
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
      ctx.strokeStyle = '#4ff3ff';
      ctx.lineWidth = 1.3;
      ctx.shadowColor = '#22d3ee';
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
    aura.addColorStop(0, 'rgba(170, 70, 255, 0.35)');
    aura.addColorStop(1, 'rgba(170, 70, 255, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(bx, base - 130, 140, 0, Math.PI * 2);
    ctx.fill();

    // Thân tháp
    const g = ctx.createLinearGradient(bx - 22, 0, bx + 24, 0);
    g.addColorStop(0, '#3a1a8a');
    g.addColorStop(0.55, '#7a34e0');
    g.addColorStop(1, '#b24cf0');
    body();
    ctx.fillStyle = g;
    ctx.fill();

    // Vân ngang kính
    ctx.save();
    body();
    ctx.clip();
    ctx.strokeStyle = 'rgba(255, 190, 255, 0.35)';
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
    ctx.strokeStyle = '#ff4fd8';
    ctx.shadowColor = '#ff4fd8';
    ctx.beginPath();
    ctx.moveTo(bx - 8, base - 250);
    ctx.lineTo(bx + 6, base - 205);
    ctx.quadraticCurveTo(bx + 22, base - 170, bx + 24, base - 120);
    ctx.lineTo(bx + 22, base);
    ctx.stroke();
    ctx.restore();

    // Đèn đỉnh nhọn
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ff9de0';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(bx - 8, base - 252, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Bãi đáp trực thăng
    const hx = bx + 35;
    const hy = base - 126;
    ctx.fillStyle = '#26175e';
    ctx.fillRect(bx + 22, hy, 30, 3);
    ctx.fillStyle = '#4ff3ff';
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
    ctx.fillStyle = '#120b34';
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
    g.addColorStop(0, '#9a58c8');
    g.addColorStop(0.1, '#6a46b8');
    g.addColorStop(0.35, '#3f2f92');
    g.addColorStop(0.7, '#21186a');
    g.addColorStop(1, '#0e0a38');
    ctx.fillStyle = g;
    ctx.fill();

    ctx.clip();

    // Phản chiếu Landmark 81 (xanh ngọc)
    for (let i = 0; i < 14; i++) {
      const rx = w * 0.30 + i * 8;
      const sh = Math.sin(this.animTimer * 1.8 + i) * 4;
      const ga = ctx.createLinearGradient(0, h * 0.54, 0, h * 0.86);
      ga.addColorStop(0, 'rgba(60, 230, 255, 0.28)');
      ga.addColorStop(1, 'rgba(60, 230, 255, 0)');
      ctx.fillStyle = ga;
      ctx.fillRect(rx + sh, h * 0.54, 3, h * 0.32);
    }
    // Phản chiếu Bitexco & bờ phải (hồng tím)
    for (let i = 0; i < 12; i++) {
      const rx = w * 0.55 + i * 7;
      const sh = Math.sin(this.animTimer * 1.5 + i * 1.3) * 4;
      const ga = ctx.createLinearGradient(0, h * 0.54, 0, h * 0.80);
      ga.addColorStop(0, 'rgba(255, 90, 220, 0.26)');
      ga.addColorStop(1, 'rgba(255, 90, 220, 0)');
      ctx.fillStyle = ga;
      ctx.fillRect(rx + sh, h * 0.54, 3, h * 0.26);
    }

    // Gợn sóng ngang trôi
    ctx.strokeStyle = 'rgba(210, 180, 255, 0.16)';
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
