/**
 * Vietnam Scenic Landmarks Panoramic Overlook System for Drunk Rocket 2.5
 * 
 * Features 9 Iconic Destinations from North to South:
 * 1. Sa Pa: Ruộng bậc thang tầng lớp, đỉnh Fansipan mù sương & cáp treo
 * 2. Ninh Bình: Quần thể núi đá vôi Tràng An, dòng sông uốn lượn & thuyền nan
 * 3. Hà Nội: Tháp Rùa Hồ Gươm lung linh, cầu Thê Húc & Cầu Long Biên
 * 4. Huế: Cổng Ngọ Môn Kinh Thành, Kỳ Đài cờ đỏ & Cầu Tràng Tiền 6 vài 12 nhịp
 * 5. Đà Nẵng: Cầu Rồng vàng phun lửa rực rỡ, sông Hàn lung linh & cao ốc
 * 6. Hội An: Phố Cổ đèn lồng vàng ấm, thuyền hoa đăng sông Hoài & Chùa Cầu
 * 7. Đà Lạt: Rừng thông kim, tháp chuông cổ & sương mờ Hồ Xuân Hương
 * 8. TP. Hồ Chí Minh: Tòa Landmark 81 vươn cao, Bitexco búp sen & Sông Sài Gòn
 * 9. Miền Tây: Rặng dừa nước, ghe xuồng chợ nổi Cái Răng & Cầu Cần Thơ
 * 
 * Camera Transition:
 * - Smoothly tilts down from pure sky to reveal panoramic landscape below (easeInOutCubic)
 * - Atmospheric contrast fog ensures laser obstacle hitboxes remain 100% readable
 */

export const VIETNAM_LANDMARKS = [
  {
    id: 'sapa',
    name: 'SA PA • RUỘNG BẬC THANG & FANSIPAN',
    region: 'TÂY BẮC',
    palette: {
      water: '#1a3a3a',
      ground: '#2d5a27',
      hillFar: '#1d3824',
      hillNear: '#3e7b32',
      terraceEdge: '#529e41',
      accent: '#ffe169'
    }
  },
  {
    id: 'ninhbinh',
    name: 'NINH BÌNH • TRÀNG AN TAM CỐC',
    region: 'BẮC BỘ',
    palette: {
      water: '#133939',
      ground: '#1f3328',
      hillFar: '#182822',
      hillNear: '#2a4436',
      terraceEdge: '#446e57',
      accent: '#80ed99'
    }
  },
  {
    id: 'hanoi',
    name: 'HÀ NỘI • HỒ GƯƠM & THÁP RÙA',
    region: 'THỦ ĐÔ',
    palette: {
      water: '#0a233a',
      ground: '#182638',
      hillFar: '#1c1f33',
      hillNear: '#22334d',
      terraceEdge: '#ff4d6d',
      accent: '#ffd166'
    }
  },
  {
    id: 'hue',
    name: 'HUẾ • ĐẠI NỘI & CẦU TRÀNG TIỀN',
    region: 'CỐ ĐÔ',
    palette: {
      water: '#162238',
      ground: '#2a1e36',
      hillFar: '#1c142b',
      hillNear: '#3d2b4e',
      terraceEdge: '#f72585',
      accent: '#ffd166'
    }
  },
  {
    id: 'danang',
    name: 'ĐÀ NẴNG • CẦU RỒNG SÔNG HÀN',
    region: 'MIỀN TRUNG',
    palette: {
      water: '#0a1d37',
      ground: '#13294b',
      hillFar: '#0e1c36',
      hillNear: '#1f3a60',
      terraceEdge: '#00f0ff',
      accent: '#ff9e00'
    }
  },
  {
    id: 'hoian',
    name: 'HỘI AN • PHỐ CỔ & SÔNG HOÀI',
    region: 'QUẢNG NAM',
    palette: {
      water: '#1a192e',
      ground: '#332219',
      hillFar: '#201626',
      hillNear: '#472d20',
      terraceEdge: '#ffb703',
      accent: '#ff0054'
    }
  },
  {
    id: 'dalat',
    name: 'ĐÀ LẠT • HỒ XUÂN HƯƠNG & RỪNG THÔNG',
    region: 'TÂY NGUYÊN',
    palette: {
      water: '#112233',
      ground: '#1b3a2f',
      hillFar: '#132822',
      hillNear: '#274e40',
      terraceEdge: '#52b788',
      accent: '#d8bbff'
    }
  },
  {
    id: 'hcm',
    name: 'TP. HỒ CHÍ MINH • LANDMARK 81 & SÔNG SÀI GÒN',
    region: 'NAM BỘ',
    palette: {
      water: '#0b162c',
      ground: '#111e38',
      hillFar: '#0d1527',
      hillNear: '#1c2e54',
      terraceEdge: '#00f0ff',
      accent: '#ff007f'
    }
  },
  {
    id: 'mientay',
    name: 'MIỀN TÂY • SÔNG NƯỚC & CẦU CẦN THƠ',
    region: 'ĐỒNG BẰNG SÔNG CỬU LONG',
    palette: {
      water: '#163333',
      ground: '#1d422a',
      hillFar: '#142e20',
      hillNear: '#28593a',
      terraceEdge: '#70e000',
      accent: '#ffbe0b'
    }
  }
];

export class ScenicLandmarksManager {
  constructor(width = 400, height = 700) {
    this.width = width;
    this.height = height;

    this.currentIndex = 0;
    this.scrollX = 0;
    this.scrollSpeed = 35; // Tốc độ trôi cảnh quan tương ứng tốc độ bay

    // Camera Tilt / Reveal State
    // 0 = sky only, 1 = full landmark reveal
    this.pitch = 0;
    this.targetPitch = 0;
    this.pitchVelocity = 0;
    this.stateTimer = 4.0; // 4s đầu ở chế độ ngước trời
    this.isRevealed = false;

    // Hiệu ứng phun lửa Cầu Rồng
    this.dragonFireTimer = 0;

    // Banner hiển thị tên địa danh
    this.bannerAlpha = 0;
    this.bannerText = '';
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
  }

  setLandmarkByScore(score) {
    const idx = Math.floor(score / 7) % VIETNAM_LANDMARKS.length;
    if (idx !== this.currentIndex) {
      this.currentIndex = idx;
      this.bannerText = VIETNAM_LANDMARKS[idx].name;
      this.bannerAlpha = 1.0;
    }
  }

  update(dt, score = 0) {
    this.scrollX += this.scrollSpeed * dt;
    this.dragonFireTimer += dt * 4;

    this.setLandmarkByScore(score);

    // Chu kỳ tự động chuyển góc nhìn:
    // 14 giây chiêm ngưỡng cảnh quan -> 12 giây bay ngước nhìn mây trời
    this.stateTimer -= dt;
    if (this.stateTimer <= 0) {
      this.isRevealed = !this.isRevealed;
      this.targetPitch = this.isRevealed ? 1.0 : 0.0;
      this.stateTimer = this.isRevealed ? 16.0 : 12.0;

      if (this.isRevealed) {
        this.bannerText = VIETNAM_LANDMARKS[this.currentIndex].name;
        this.bannerAlpha = 1.0;
      }
    }

    // Smooth Easing cho góc camera (Cubic interpolation)
    const diff = this.targetPitch - this.pitch;
    this.pitch += diff * Math.min(1.0, dt * 1.8);

    if (this.bannerAlpha > 0) {
      this.bannerAlpha = Math.max(0, this.bannerAlpha - dt * 0.35);
    }
  }

  draw(ctx) {
    // Nếu camera đang ở góc ngước trời (pitch ~ 0), không tốn chi phí render phong cảnh
    if (this.pitch < 0.01) return;

    ctx.save();

    // Vị trí đường chân trời (Horizon Y):
    // Khi pitch = 1.0, chân trời hạ xuống để lộ 45% nửa dưới màn hình
    const maxHorizonY = this.height * 0.52;
    const currentHorizonY = this.height + (maxHorizonY - this.height) * this.pitch;
    const landHeight = this.height - currentHorizonY;

    // 1. Water Surface / Base River Reflection
    const landmark = VIETNAM_LANDMARKS[this.currentIndex] || VIETNAM_LANDMARKS[0];
    const pal = landmark.palette;

    const riverGrad = ctx.createLinearGradient(0, currentHorizonY, 0, this.height);
    riverGrad.addColorStop(0, pal.hillFar);
    riverGrad.addColorStop(0.35, pal.water);
    riverGrad.addColorStop(1, '#080c14');
    ctx.fillStyle = riverGrad;
    ctx.fillRect(0, currentHorizonY, this.width, landHeight);

    // 2. Render từng địa danh đặc trưng theo index
    switch (landmark.id) {
      case 'sapa':
        this._drawSapa(ctx, currentHorizonY, pal);
        break;
      case 'ninhbinh':
        this._drawNinhBinh(ctx, currentHorizonY, pal);
        break;
      case 'hanoi':
        this._drawHanoi(ctx, currentHorizonY, pal);
        break;
      case 'hue':
        this._drawHue(ctx, currentHorizonY, pal);
        break;
      case 'danang':
        this._drawDaNang(ctx, currentHorizonY, pal);
        break;
      case 'hoian':
        this._drawHoiAn(ctx, currentHorizonY, pal);
        break;
      case 'dalat':
        this._drawDaLat(ctx, currentHorizonY, pal);
        break;
      case 'hcm':
        this._drawHoChiMinh(ctx, currentHorizonY, pal);
        break;
      case 'mientay':
        this._drawMienTay(ctx, currentHorizonY, pal);
        break;
      default:
        this._drawDaNang(ctx, currentHorizonY, pal);
    }

    // 3. Lớp sương khí quyển mỏng (Atmospheric Scrim Contrast Fog)
    // Đảm bảo các cột laser neon ở tiền cảnh luôn nổi bật và sắc nét 100%
    const fogGrad = ctx.createLinearGradient(0, currentHorizonY - 40, 0, this.height);
    fogGrad.addColorStop(0, 'rgba(11, 14, 20, 0.05)');
    fogGrad.addColorStop(0.3, 'rgba(11, 14, 20, 0.32)');
    fogGrad.addColorStop(1, 'rgba(11, 14, 20, 0.58)');
    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, currentHorizonY - 40, this.width, landHeight + 40);

    // 4. Banner tên địa danh retro arcade ở góc dưới
    if (this.bannerAlpha > 0.02) {
      ctx.save();
      ctx.globalAlpha = Math.min(1.0, this.bannerAlpha * this.pitch);
      const bY = this.height - 24;

      ctx.fillStyle = 'rgba(15, 20, 32, 0.85)';
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.2;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;

      ctx.fillRect(16, bY - 18, this.width - 32, 24);
      ctx.strokeRect(16, bY - 18, this.width - 32, 24);

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`📍 ${landmark.name}`, this.width / 2, bY - 2);
      ctx.restore();
    }

    ctx.restore();
  }

  // --- CÁC HÀM VẼ PROCEDURAL CHO TỪNG ĐỊA DANH ---

  // 1. Sa Pa: Ruộng bậc thang & Fansipan
  _drawSapa(ctx, hY, pal) {
    ctx.save();
    // Dãy núi Fansipan xa xa
    ctx.fillStyle = pal.hillFar;
    ctx.beginPath();
    ctx.moveTo(0, hY + 10);
    ctx.lineTo(80, hY - 60);
    ctx.lineTo(190, hY + 20);
    ctx.lineTo(310, hY - 75); // Đỉnh Fansipan
    ctx.lineTo(this.width, hY);
    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.fill();

    // Ruộng bậc thang uốn lượn từng tầng màu vàng - xanh
    for (let i = 0; i < 5; i++) {
      const stepY = hY + 25 + i * 28;
      ctx.fillStyle = i % 2 === 0 ? pal.hillNear : pal.ground;
      ctx.beginPath();
      ctx.moveTo(0, stepY);
      for (let x = 0; x <= this.width; x += 40) {
        const wave = Math.sin((x + this.scrollX * 0.4 + i * 50) * 0.03) * 12;
        ctx.lineTo(x, stepY + wave);
      }
      ctx.lineTo(this.width, this.height);
      ctx.lineTo(0, this.height);
      ctx.fill();

      // Viền bậc thang lúa vàng
      ctx.strokeStyle = pal.terraceEdge;
      ctx.lineWidth = 2.0;
      ctx.stroke();
    }
    ctx.restore();
  }

  // 2. Ninh Bình: Núi đá vôi Tràng An & dòng sông xanh
  _drawNinhBinh(ctx, hY, pal) {
    ctx.save();
    // Các chóp núi đá vôi sừng sững đặc trưng Tam Cốc
    const peaks = [
      { x: 30, w: 70, h: 90 },
      { x: 130, w: 90, h: 115 },
      { x: 250, w: 80, h: 85 },
      { x: 340, w: 75, h: 105 }
    ];
    peaks.forEach((p, idx) => {
      const px = ((p.x - this.scrollX * 0.25) % (this.width + 120)) - 40;
      ctx.fillStyle = idx % 2 === 0 ? pal.hillFar : pal.hillNear;
      ctx.beginPath();
      ctx.moveTo(px, hY + 50);
      ctx.quadraticCurveTo(px + p.w * 0.2, hY - p.h, px + p.w * 0.5, hY - p.h + 8);
      ctx.quadraticCurveTo(px + p.w * 0.8, hY - p.h + 12, px + p.w, hY + 50);
      ctx.fill();
    });

    // Thuyền nan mộc mạc lướt trên sông
    const boatX = ((200 - this.scrollX * 0.5) % this.width + this.width) % this.width;
    ctx.fillStyle = '#a9714b';
    ctx.fillRect(boatX, hY + 65, 24, 5);
    ctx.fillStyle = '#fefae0';
    ctx.beginPath();
    ctx.arc(boatX + 12, hY + 62, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 3. Hà Nội: Tháp Rùa Hồ Gươm & Cầu Long Biên
  _drawHanoi(ctx, hY, pal) {
    ctx.save();
    // Cầu Long Biên nhịp thép phía xa
    ctx.strokeStyle = 'rgba(120, 140, 180, 0.45)';
    ctx.lineWidth = 1.6;
    const bridgeY = hY + 20;
    for (let x = 0; x < this.width; x += 45) {
      ctx.strokeRect(x, bridgeY - 14, 42, 14);
      ctx.beginPath();
      ctx.moveTo(x, bridgeY);
      ctx.lineTo(x + 21, bridgeY - 14);
      ctx.lineTo(x + 42, bridgeY);
      ctx.stroke();
    }

    // Đảo Tháp Rùa giữa hồ
    const towerX = this.width * 0.5;
    const towerY = hY + 55;
    // Đảo cỏ xanh
    ctx.fillStyle = '#1e3f20';
    ctx.beginPath();
    ctx.ellipse(towerX, towerY + 16, 55, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tháp Rùa 3 tầng cổ kính
    ctx.fillStyle = '#d4a373';
    ctx.fillRect(towerX - 22, towerY - 6, 44, 22);
    ctx.fillRect(towerX - 16, towerY - 22, 32, 16);
    ctx.fillRect(towerX - 10, towerY - 34, 20, 12);
    // Mái ngói cong cổ truyền
    ctx.fillStyle = '#b7094c';
    ctx.fillRect(towerX - 25, towerY - 8, 50, 3);
    ctx.fillRect(towerX - 18, towerY - 24, 36, 3);
    ctx.fillRect(towerX - 12, towerY - 36, 24, 3);

    // Cửa vòm Tháp Rùa phát sáng vàng ấm
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(towerX - 6, towerY + 2, 12, 14);
    ctx.fillRect(towerX - 4, towerY - 16, 8, 10);
    ctx.restore();
  }

  // 4. Huế: Cổng Ngọ Môn Đại Nội & Cầu Tràng Tiền
  _drawHue(ctx, hY, pal) {
    ctx.save();
    // Thành quách Đại Nội trầm mặc
    ctx.fillStyle = '#2b1b36';
    ctx.fillRect(0, hY - 10, this.width, 35);
    // Các vọng lâu trên thành
    for (let bx = 30; bx < this.width; bx += 90) {
      ctx.fillStyle = '#8b263e';
      ctx.fillRect(bx, hY - 30, 36, 20);
      ctx.fillStyle = '#ffd166';
      ctx.fillRect(bx - 4, hY - 34, 44, 4); // Mái ngói lưu ly vàng
    }

    // Cầu Tràng Tiền 6 vài 12 nhịp bắc qua Sông Hương
    const cY = hY + 60;
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.2;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    for (let cx = 10; cx < this.width; cx += 65) {
      ctx.beginPath();
      ctx.arc(cx + 32, cY + 5, 30, Math.PI, 0, false);
      ctx.stroke();
      ctx.strokeRect(cx, cY + 5, 64, 4);
    }
    ctx.restore();
  }

  // 5. Đà Nẵng: Cầu Rồng vàng phun lửa & Sông Hàn
  _drawDaNang(ctx, hY, pal) {
    ctx.save();
    // Cao ốc hiện đại ven bờ sông Hàn
    const bldgs = [
      { x: 10, w: 34, h: 65, c: '#00f0ff' },
      { x: 50, w: 42, h: 85, c: '#ffd166' },
      { x: 100, w: 30, h: 55, c: '#00f0ff' },
      { x: 280, w: 38, h: 75, c: '#ff0054' },
      { x: 325, w: 45, h: 90, c: '#00f0ff' }
    ];
    bldgs.forEach(b => {
      ctx.fillStyle = '#0f1c32';
      ctx.fillRect(b.x, hY - b.h + 20, b.w, b.h);
      // Đèn cửa sổ neon
      ctx.fillStyle = b.c;
      for (let wy = hY - b.h + 26; wy < hY + 10; wy += 12) {
        ctx.fillRect(b.x + 6, wy, b.w - 12, 2.5);
      }
    });

    // CẦU RỒNG ĐÀ NẴNG (Thân rồng uốn lượn màu vàng kim)
    const bridgeY = hY + 50;
    // Mặt cầu
    ctx.fillStyle = '#22324e';
    ctx.fillRect(0, bridgeY, this.width, 10);

    // Thân rồng uốn lượn 3 nhịp vòm vàng rực
    ctx.strokeStyle = '#ffb703';
    ctx.lineWidth = 5.5;
    ctx.shadowColor = '#ffb703';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(80, bridgeY, 40, Math.PI, 0, false);
    ctx.arc(165, bridgeY, 45, Math.PI, 0, false);
    ctx.arc(255, bridgeY, 45, Math.PI, 0, false);
    ctx.stroke();

    // Đầu Rồng ở mố cầu bên phải
    const headX = 305;
    const headY = bridgeY - 32;
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.moveTo(headX, headY + 12);
    ctx.lineTo(headX + 28, headY);
    ctx.lineTo(headX + 32, headY + 18);
    ctx.lineTo(headX + 16, headY + 28);
    ctx.closePath();
    ctx.fill();

    // Mắt Rồng ruby phát sáng
    ctx.fillStyle = '#ff0054';
    ctx.fillRect(headX + 18, headY + 8, 4, 4);

    // CẦU RỒNG PHUN LỬA RỰC CHÁY (Fire Breathing VFX)
    const fireFlicker = Math.sin(this.dragonFireTimer * 6) * 10;
    const fireLen = 50 + fireFlicker;
    const fGrad = ctx.createRadialGradient(headX + 32, headY + 12, 4, headX + 32 + fireLen * 0.7, headY + 10, fireLen);
    fGrad.addColorStop(0, '#ffffff');
    fGrad.addColorStop(0.2, '#ffee55');
    fGrad.addColorStop(0.6, '#ff5400');
    fGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');

    ctx.fillStyle = fGrad;
    ctx.beginPath();
    ctx.moveTo(headX + 32, headY + 8);
    ctx.quadraticCurveTo(headX + 50 + fireLen * 0.5, headY - 14, headX + 32 + fireLen, headY + 12);
    ctx.quadraticCurveTo(headX + 50 + fireLen * 0.5, headY + 28, headX + 32, headY + 20);
    ctx.fill();

    ctx.restore();
  }

  // 6. Hội An: Phố Cổ đèn lồng vàng ấm & Chùa Cầu
  _drawHoiAn(ctx, hY, pal) {
    ctx.save();
    // Dãy nhà cổ mái ngói rêu phong 2 bên bờ sông Hoài
    for (let x = 0; x < this.width; x += 55) {
      ctx.fillStyle = '#ffb703'; // Tường vàng đặc trưng Hội An
      ctx.fillRect(x, hY - 15, 50, 45);
      // Mái ngói âm dương rêu phong
      ctx.fillStyle = '#4a2810';
      ctx.beginPath();
      ctx.moveTo(x - 5, hY - 15);
      ctx.lineTo(x + 25, hY - 32);
      ctx.lineTo(x + 55, hY - 15);
      ctx.fill();

      // Dây treo lồng đèn lung linh
      ctx.fillStyle = (x % 110 === 0) ? '#ff0054' : '#ffd166';
      ctx.beginPath();
      ctx.arc(x + 15, hY - 6, 4.5, 0, Math.PI * 2);
      ctx.arc(x + 35, hY - 6, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hoa đăng trôi bập bềnh trên sông Hoài
    for (let f = 0; f < 6; f++) {
      const flX = ((f * 65 + this.scrollX * 0.3) % this.width);
      const flY = hY + 45 + (f % 3) * 12;
      ctx.fillStyle = '#ff0054';
      ctx.beginPath();
      ctx.arc(flX, flY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffee55';
      ctx.beginPath();
      ctx.arc(flX, flY - 1, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 7. Đà Lạt: Rừng thông & sương mờ Hồ Xuân Hương
  _drawDaLat(ctx, hY, pal) {
    ctx.save();
    // Đồi thông kim chập chùng
    for (let tx = 0; tx < this.width; tx += 28) {
      const treeH = 45 + ((tx * 7) % 35);
      ctx.fillStyle = '#1b4332';
      ctx.beginPath();
      ctx.moveTo(tx + 14, hY - treeH);
      ctx.lineTo(tx, hY + 15);
      ctx.lineTo(tx + 28, hY + 15);
      ctx.fill();

      ctx.fillStyle = '#2d6a4f';
      ctx.beginPath();
      ctx.moveTo(tx + 14, hY - treeH + 15);
      ctx.lineTo(tx + 3, hY + 25);
      ctx.lineTo(tx + 25, hY + 25);
      ctx.fill();
    }

    // Làn sương trắng bảng lảng mặt hồ
    ctx.fillStyle = 'rgba(216, 230, 245, 0.28)';
    ctx.fillRect(0, hY + 25, this.width, 24);
    ctx.restore();
  }

  // 8. TP. Hồ Chí Minh: Landmark 81 & Sông Sài Gòn
  _drawHoChiMinh(ctx, hY, pal) {
    ctx.save();
    // Dãy skyline Sài Gòn hiện đại
    // 1. Bitexco Financial Tower (Búp sen)
    const bitX = 90;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(bitX, hY - 95, 34, 115);
    // Sân đỗ trực thăng chìa ra
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(bitX - 10, hY - 55, 14, 4);

    // 2. LANDMARK 81 (Tòa tháp chọc trời cao vút)
    const lmX = 230;
    // Bó ống giật cấp
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(lmX - 24, hY - 70, 48, 90);
    ctx.fillRect(lmX - 16, hY - 125, 32, 60);
    ctx.fillRect(lmX - 9, hY - 170, 18, 50);
    // Đỉnh tháp kim cương spire phát sáng vươn mây
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(lmX, hY - 170);
    ctx.lineTo(lmX, hY - 215);
    ctx.stroke();

    // Dải đèn LED neon chạy dọc tháp
    ctx.fillStyle = '#ff007f';
    ctx.fillRect(lmX - 2, hY - 165, 4, 175);

    // Ánh đèn phản chiếu lung linh mặt nước sông Sài Gòn
    const refGrad = ctx.createLinearGradient(0, hY + 30, 0, this.height);
    refGrad.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
    refGrad.addColorStop(0.5, 'rgba(255, 0, 127, 0.20)');
    refGrad.addColorStop(1, 'rgba(10, 15, 30, 0)');
    ctx.fillStyle = refGrad;
    ctx.fillRect(lmX - 35, hY + 30, 70, this.height - hY - 30);
    ctx.restore();
  }

  // 9. Miền Tây: Rặng dừa nước, chợ nổi Cái Răng & Cầu Cần Thơ
  _drawMienTay(ctx, hY, pal) {
    ctx.save();
    // Cầu Cần Thơ dây văng sừng sững
    const pylonX = 180;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(pylonX, hY - 95);
    ctx.lineTo(pylonX - 16, hY + 25);
    ctx.moveTo(pylonX, hY - 95);
    ctx.lineTo(pylonX + 16, hY + 25);
    ctx.stroke();

    // Các dây văng hình cánh quạt
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.55)';
    ctx.lineWidth = 1.0;
    for (let c = 15; c <= 85; c += 22) {
      ctx.beginPath();
      ctx.moveTo(pylonX, hY - 95 + c * 0.4);
      ctx.lineTo(pylonX - c, hY + 25);
      ctx.moveTo(pylonX, hY - 95 + c * 0.4);
      ctx.lineTo(pylonX + c, hY + 25);
      ctx.stroke();
    }

    // Rặng dừa nước xanh rì rào bên bờ
    for (let d = 0; d < this.width; d += 35) {
      if (Math.abs(d - pylonX) < 40) continue;
      ctx.fillStyle = '#2d6a4f';
      ctx.beginPath();
      ctx.arc(d + 15, hY + 20, 14, Math.PI, 0, false);
      ctx.fill();
    }

    // Ghe xuồng chợ nổi chở dưa hấu, hoa trái
    const boatX = ((100 - this.scrollX * 0.4) % this.width + this.width) % this.width;
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(boatX, hY + 50, 32, 6);
    // Trái cây dưa hấu tròn xoe
    ctx.fillStyle = '#52b788';
    ctx.beginPath();
    ctx.arc(boatX + 10, hY + 48, 3, 0, Math.PI * 2);
    ctx.arc(boatX + 18, hY + 48, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
