/**
 * Vietnam Iconic Landmarks Overlook System - High-Art Master Cinema Edition
 * 
 * 1. Ultra-Smooth Cinematic Camera Elevation & Parallax:
 *    - Phase 1: SKY (8s) - Level camera looking forward into atmosphere
 *    - Phase 2: ASCENDING (6.5s) - Camera ascends smoothly with cinematic easeInOutQuad curve.
 *               Parallax clouds slide down, horizon gently reveals ground at Y=440.
 *    - Phase 3: OVERLOOK (18s) - Pure majestic scenic flight over landmark.
 *    - Phase 4: DESCENDING (6.5s) - Camera gently lowers back into the clouds, horizon recedes softly.
 *    - Phase 5: Cycle continues to NEXT landmark from North to South!
 * 
 * 2. Non-Obtrusive Editorial Typography:
 *    - Relocated to TOP of screen (above score, Y=32..54) inside an elegant translucent letterbox header.
 *    - 100% unobscured by the big score (which is at Y=82) or Overdrive orb (at Y=126).
 *    - Crisp ALL-CAPS editorial typography with subtle off-white and refined tracking.
 * 
 * 3. Hand-Crafted Iconic Architectural Masterpieces:
 *    - Sa Pa: Fansipan 3.143m đỉnh nhọn tuyết sương, cột cờ đỏ sao vàng, cáp treo chuyển động, 6 bậc ruộng thang lúa chín óng ả
 *    - Ninh Bình: Dãy núi đá vôi Tràng An dốc đứng kỳ vĩ soi bóng sông nước, đầm sen thơm ngát, thủy đình cổ kính & thuyền nan nón lá
 *    - Hà Nội: Tháp Rùa cổ kính rêu phong tỉ mỉ với cửa vòm rực sáng, Cầu Thê Húc uốn cong màu đỏ son, rặng liễu rủ & Cầu Long Biên
 *    - Huế: Cửa Ngọ Môn lầu Ngũ Phụng tráng lệ hoàng cung, Kỳ Đài cờ đỏ phấp phới, Cầu Tràng Tiền 6 vài 12 nhịp đổi màu rực rỡ
 *    - Đà Nẵng: Cầu Rồng vàng kim uốn lượn phun lửa cuồn cuộn có khói & tàn lửa, vòng quay Mặt Trời Sun Wheel, skyline sông Hàn
 *    - Hội An: Chùa Cầu (Lai Viễn Kiều) cổ kính uy nghi, phố cổ tường vàng rực, giàn đèn lồng lung linh & hoa đăng bập bềnh
 *    - Đà Lạt: Tháp chuông Nhà thờ Con Gà vươn cao với tượng chú gà đồng, biệt thự Pháp mái nhọn, đồi thông bạt ngàn & sương mờ Hồ Xuân Hương
 *    - TP. Hồ Chí Minh: Landmark 81 sừng sững chọc trời bó tre giật cấp, cột spire kim cương phát sáng, tháp Bitexco búp sen & sông Sài Gòn
 *    - Miền Tây: Cầu Cần Thơ dây văng hình rẻ quạt khổng lồ, rặng dừa nước bạt ngàn & chợ nổi Cái Răng ghe xuồng chở hoa trái
 */

export const VIETNAM_LANDMARKS = [
  {
    id: 'sapa',
    title: 'SAPA',
    subtitle: 'THE TERRACED KINGDOM & FANSIPAN PEAK',
    issue: 'EXPEDITION N° 01 • TÂY BẮC',
    waterColor: '#17332c',
    skyTint: '#2b3a32'
  },
  {
    id: 'ninhbinh',
    title: 'NINH BINH',
    subtitle: 'TRANG AN KARST REALM & ANCIENT RIVERS',
    issue: 'EXPEDITION N° 02 • BẮC BỘ',
    waterColor: '#102e2c',
    skyTint: '#1c332e'
  },
  {
    id: 'hanoi',
    title: 'HA NOI',
    subtitle: 'SWORD LAKE & THE ANCIENT TURTLE TOWER',
    issue: 'EXPEDITION N° 03 • THỦ ĐÔ NGHÌN NĂM',
    waterColor: '#0c2238',
    skyTint: '#1c2e44'
  },
  {
    id: 'hue',
    title: 'HUE',
    subtitle: 'IMPERIAL CITADEL & PERFUME RIVER',
    issue: 'EXPEDITION N° 04 • CỐ ĐÔ TRIỀU NGUYỄN',
    waterColor: '#1d1933',
    skyTint: '#2d1e38'
  },
  {
    id: 'danang',
    title: 'DA NANG',
    subtitle: 'DRAGON BRIDGE & THE HAN RIVER SKYLINE',
    issue: 'EXPEDITION N° 05 • MIỀN TRUNG',
    waterColor: '#0a1d3b',
    skyTint: '#11294d'
  },
  {
    id: 'hoian',
    title: 'HOI AN',
    subtitle: 'ANCIENT LANTERN TOWN & HOAI RIVER',
    issue: 'EXPEDITION N° 06 • DI SẢN QUẢNG NAM',
    waterColor: '#2b1a1c',
    skyTint: '#3d2522'
  },
  {
    id: 'dalat',
    title: 'DA LAT',
    subtitle: 'PINE MIST & THE CITY OF ETERNAL SPRING',
    issue: 'EXPEDITION N° 07 • CAO NGUYÊN LÂM VIÊN',
    waterColor: '#12262d',
    skyTint: '#1b3842'
  },
  {
    id: 'hcm',
    title: 'SAI GON',
    subtitle: 'LANDMARK 81 & THE SLEEPLESS PEARL',
    issue: 'EXPEDITION N° 08 • ĐÔ THỊ PHỒN HOA',
    waterColor: '#09152b',
    skyTint: '#14223d'
  },
  {
    id: 'mientay',
    title: 'MEKONG DELTA',
    subtitle: 'CAN THO SPAN & FLOATING RIVER HORIZON',
    issue: 'EXPEDITION N° 09 • ĐỒNG BẰNG SÔNG CỬU LONG',
    waterColor: '#1b382d',
    skyTint: '#1d4233'
  }
];

export class ScenicLandmarksManager {
  constructor(width = 400, height = 700) {
    this.width = width;
    this.height = height;

    this.currentIndex = 0;
    this.scrollX = 0;
    this.scrollSpeed = 32; // Tốc độ trôi cảnh quan chậm rãi, thanh lịch

    /**
     * Camera Flight State:
     * - 'SKY': Level view looking forward (8s)
     * - 'ASCENDING': Camera ascends & tilts smoothly downward (6.5s)
     * - 'OVERLOOK': High altitude scenic overview (18s)
     * - 'DESCENDING': Camera gently lowers back to clouds (6.5s)
     */
    this.flightState = 'SKY';
    this.stateTimer = 6.0;
    this.pitch = 0; // 0 = sky, 1 = panoramic overview

    // Parallax transition clouds
    this.transitionClouds = [];
    for (let c = 0; c < 8; c++) {
      this.transitionClouds.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        w: 120 + Math.random() * 140,
        h: 30 + Math.random() * 25,
        speed: 20 + Math.random() * 20
      });
    }

    // Interactive animation timers
    this.animTimer = 0;
    this.dragonFlameTimer = 0;
    this.cableCarPhase = 0;
    this.sunWheelAngle = 0;

    // Header Card Alpha
    this.cardAlpha = 0;
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
  }

  update(dt, score = 0) {
    this.scrollX += this.scrollSpeed * dt;
    this.animTimer += dt;
    this.dragonFlameTimer += dt * 5;
    this.cableCarPhase += dt * 0.2;
    this.sunWheelAngle += dt * 0.35;

    // Update transition clouds
    for (const c of this.transitionClouds) {
      c.x -= c.speed * dt;
      if (c.x + c.w < -20) {
        c.x = this.width + 30;
        c.y = Math.random() * (this.height * 0.6);
      }
    }

    this.stateTimer -= dt;

    if (this.flightState === 'SKY') {
      this.pitch = 0;
      this.cardAlpha = 0;
      if (this.stateTimer <= 0) {
        this.flightState = 'ASCENDING';
        this.stateTimer = 6.5; // 6.5s chuyển động cực êm ái
      }
    } else if (this.flightState === 'ASCENDING') {
      const p = 1.0 - Math.max(0, this.stateTimer / 6.5);
      // Smooth EaseInOutQuad
      this.pitch = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

      // Header card fades in gently
      if (p > 0.45) {
        this.cardAlpha = Math.min(1.0, (p - 0.45) * 2.0);
      }

      if (this.stateTimer <= 0) {
        this.flightState = 'OVERLOOK';
        this.pitch = 1.0;
        this.cardAlpha = 1.0;
        this.stateTimer = 18.0; // 18s chiêm ngưỡng trọn vẹn
      }
    } else if (this.flightState === 'OVERLOOK') {
      this.pitch = 1.0;
      if (this.stateTimer <= 3.5) {
        this.cardAlpha = Math.max(0, this.stateTimer / 3.5);
      }
      if (this.stateTimer <= 0) {
        this.flightState = 'DESCENDING';
        this.stateTimer = 6.5; // 6.5s hạ dần
      }
    } else if (this.flightState === 'DESCENDING') {
      const p = 1.0 - Math.max(0, this.stateTimer / 6.5);
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      this.pitch = 1.0 - ease;
      this.cardAlpha = 0;

      if (this.stateTimer <= 0) {
        // Hoàn tất hạ xuống bầu trời: Chuyển sang địa danh tiếp theo từ Bắc vào Nam
        this.flightState = 'SKY';
        this.pitch = 0;
        this.currentIndex = (this.currentIndex + 1) % VIETNAM_LANDMARKS.length;
        this.stateTimer = 8.0;
      }
    }
  }

  draw(ctx) {
    if (this.pitch <= 0.002) return;

    ctx.save();

    // VỊ TRÍ ĐƯỜNG CHÂN TRỜI (Horizon Y)
    // Đường chân trời hạ xuống tối đa ở Y = 430px (để toàn bộ nửa trên 0..430px vẫn là bầu trời thông thoáng)
    const maxHorizonY = this.height * 0.60;
    const currentHorizonY = this.height - (this.height - maxHorizonY) * this.pitch;
    const landHeight = this.height - currentHorizonY;

    const landmark = VIETNAM_LANDMARKS[this.currentIndex] || VIETNAM_LANDMARKS[0];

    // 1. Water Surface / Ground Base
    const river = ctx.createLinearGradient(0, currentHorizonY, 0, this.height);
    river.addColorStop(0, landmark.waterColor);
    river.addColorStop(0.4, '#09131f');
    river.addColorStop(1, '#04070d');
    ctx.fillStyle = river;
    ctx.fillRect(0, currentHorizonY, this.width, landHeight);

    // 2. Parallax Camera Transition Clouds (Tạo cảm giác máy quay đang bay xuyên mây hạ độ cao)
    if (this.pitch > 0.05 && this.pitch < 0.95) {
      ctx.save();
      const cloudAlpha = Math.sin(this.pitch * Math.PI) * 0.45;
      ctx.fillStyle = `rgba(180, 205, 230, ${cloudAlpha})`;
      for (const c of this.transitionClouds) {
        ctx.beginPath();
        const cy = currentHorizonY - 60 + (c.y % 120);
        ctx.ellipse(c.x, cy, c.w * 0.5, c.h * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 3. Render Landmark Artwork
    switch (landmark.id) {
      case 'sapa':
        this._drawSapa(ctx, currentHorizonY);
        break;
      case 'ninhbinh':
        this._drawNinhBinh(ctx, currentHorizonY);
        break;
      case 'hanoi':
        this._drawHanoi(ctx, currentHorizonY);
        break;
      case 'hue':
        this._drawHue(ctx, currentHorizonY);
        break;
      case 'danang':
        this._drawDaNang(ctx, currentHorizonY);
        break;
      case 'hoian':
        this._drawHoiAn(ctx, currentHorizonY);
        break;
      case 'dalat':
        this._drawDaLat(ctx, currentHorizonY);
        break;
      case 'hcm':
        this._drawHoChiMinh(ctx, currentHorizonY);
        break;
      case 'mientay':
        this._drawMienTay(ctx, currentHorizonY);
        break;
      default:
        this._drawDaNang(ctx, currentHorizonY);
    }

    // 4. Lớp sương khí quyển tương phản (Atmospheric Contrast Scrim)
    // Giữ vùng bay né cột luôn sắc nét tuyệt đối
    const scrim = ctx.createLinearGradient(0, currentHorizonY - 20, 0, this.height);
    scrim.addColorStop(0, 'rgba(8, 12, 20, 0.05)');
    scrim.addColorStop(0.35, 'rgba(8, 12, 20, 0.35)');
    scrim.addColorStop(1, 'rgba(4, 7, 14, 0.65)');
    ctx.fillStyle = scrim;
    ctx.fillRect(0, currentHorizonY - 20, this.width, landHeight + 20);

    // 5. Editorial Magazine Header (Đặt trên đỉnh cao nhất, hoàn toàn không che Score hay Overdrive Orb!)
    if (this.cardAlpha > 0.01) {
      this._drawEditorialHeader(ctx, landmark);
    }

    ctx.restore();
  }

  /**
   * Thiết kế chữ Tạp chí cao cấp nằm ở dải trên cùng màn hình (Y: 18 - 48px)
   * Không chạm hay che bất kỳ vùng Score (Y=82) hoặc HUD nào
   */
  _drawEditorialHeader(ctx, landmark) {
    ctx.save();
    ctx.globalAlpha = Math.min(1.0, this.cardAlpha);

    const cx = this.width / 2;
    const topY = 22;

    // Header Background Bar (Mờ nhạt tinh tế)
    ctx.fillStyle = 'rgba(10, 14, 24, 0.72)';
    ctx.fillRect(20, topY - 14, this.width - 40, 36);

    // Hairline Border thanh lịch
    ctx.strokeStyle = 'rgba(244, 244, 246, 0.35)';
    ctx.lineWidth = 0.75;
    ctx.strokeRect(20, topY - 14, this.width - 40, 36);

    // Dòng 1: Issue & Title kết hợp tinh tế
    ctx.fillStyle = '#f4f4f6';
    ctx.font = '700 13px "Times New Roman", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '4px';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 6;
    ctx.fillText(landmark.title, cx, topY + 1);

    // Dòng 2: Subtitle / Description
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(244, 244, 246, 0.72)';
    ctx.font = '500 7.5px -apple-system, "Segoe UI", Roboto, monospace';
    ctx.letterSpacing = '1.8px';
    ctx.fillText(`${landmark.issue} • ${landmark.subtitle}`, cx, topY + 14);

    ctx.restore();
  }

  // ==============================================================
  // CÁC HÀM VẼ PROCEDURAL ĐỈNH CAO CHO TỪNG ĐỊA DANH
  // ==============================================================

  // 1. SA PA: Fansipan hùng vĩ, Cáp treo lơ lửng & 6 Tầng Ruộng bậc thang vàng óng
  _drawSapa(ctx, hY) {
    ctx.save();
    // Dãy núi Hoàng Liên Sơn tuyết mờ & mây giăng
    ctx.fillStyle = '#182d24';
    ctx.beginPath();
    ctx.moveTo(0, hY + 10);
    ctx.lineTo(60, hY - 35);
    ctx.lineTo(125, hY - 10);
    ctx.lineTo(235, hY - 85); // Đỉnh Fansipan 3.143m
    ctx.lineTo(315, hY - 25);
    ctx.lineTo(this.width, hY - 45);
    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.fill();

    // Chóp tháp Fansipan & Cột cờ Tổ quốc
    const pX = 235;
    const pY = hY - 85;
    ctx.fillStyle = '#f4f4f6';
    ctx.beginPath();
    ctx.moveTo(pX, pY - 8);
    ctx.lineTo(pX - 5, pY);
    ctx.lineTo(pX + 5, pY);
    ctx.fill();
    // Cờ đỏ sao vàng
    ctx.strokeStyle = '#ff0054';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pX + 2, pY - 8);
    ctx.lineTo(pX + 2, pY - 18);
    ctx.stroke();
    ctx.fillStyle = '#ff0054';
    ctx.fillRect(pX + 2, pY - 18, 8, 5);

    // Cáp treo Fansipan
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(30, hY - 10);
    ctx.lineTo(pX - 25, pY + 25);
    ctx.stroke();

    const cabProg = (this.cableCarPhase) % 1.0;
    const cabX = 30 + (pX - 55) * cabProg;
    const cabY = (hY - 10) + (pY + 35 - hY) * cabProg;
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(cabX - 4, cabY, 8, 6);
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(cabX - 2, cabY + 1, 4, 3);

    // 6 Tầng ruộng bậc thang vàng óng ả Mường Hoa
    const terraceColors = ['#28542c', '#3c7533', '#569440', '#7bb351', '#a4c965', '#d4df7c'];
    for (let i = 0; i < 6; i++) {
      const tY = hY + 14 + i * 22;
      ctx.fillStyle = terraceColors[i];
      ctx.beginPath();
      ctx.moveTo(0, tY);
      for (let x = 0; x <= this.width; x += 30) {
        const curve = Math.sin((x + this.scrollX * 0.25 + i * 55) * 0.025) * 12;
        ctx.lineTo(x, tY + curve);
      }
      ctx.lineTo(this.width, this.height);
      ctx.lineTo(0, this.height);
      ctx.fill();

      // Viền bờ lúa vàng
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.restore();
  }

  // 2. NINH BÌNH: Vách núi đá vôi Tràng An, Thủy đình rêu phong & Thuyền nan Tam Cốc
  _drawNinhBinh(ctx, hY) {
    ctx.save();
    // Vách núi đá vôi karst sừng sững kỳ vĩ
    const cliffs = [
      { x: 10, w: 75, h: 95, c: '#152922' },
      { x: 105, w: 90, h: 120, c: '#213a30' },
      { x: 220, w: 80, h: 90, c: '#183027' },
      { x: 315, w: 85, h: 110, c: '#254238' }
    ];

    cliffs.forEach((c) => {
      const cx = ((c.x - this.scrollX * 0.2) % (this.width + 120)) - 50;
      ctx.fillStyle = c.c;
      ctx.beginPath();
      ctx.moveTo(cx, hY + 30);
      ctx.lineTo(cx + 8, hY - c.h + 20);
      ctx.lineTo(cx + c.w * 0.45, hY - c.h);
      ctx.lineTo(cx + c.w * 0.85, hY - c.h + 15);
      ctx.lineTo(cx + c.w, hY + 30);
      ctx.fill();

      // Cây xanh bám vách đá kỳ vĩ
      ctx.fillStyle = '#3a734a';
      ctx.beginPath();
      ctx.arc(cx + c.w * 0.3, hY - c.h * 0.5, 6, 0, Math.PI * 2);
      ctx.arc(cx + c.w * 0.7, hY - c.h * 0.65, 7, 0, Math.PI * 2);
      ctx.fill();
    });

    // Thủy đình Tràng An giữa non nước
    const pavX = this.width * 0.48;
    const pavY = hY + 38;
    ctx.fillStyle = '#8b263e';
    ctx.fillRect(pavX - 16, pavY - 14, 32, 14);
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.moveTo(pavX - 22, pavY - 14);
    ctx.lineTo(pavX, pavY - 26);
    ctx.lineTo(pavX + 22, pavY - 14);
    ctx.fill();

    // Đoàn thuyền nan nón lá chở khách du lịch trên sông Ngô Đồng
    for (let b = 0; b < 4; b++) {
      const bx = ((b * 105 + 30 - this.scrollX * 0.4) % (this.width + 80)) - 40;
      const by = hY + 50 + (b % 2) * 16;
      ctx.fillStyle = '#7f5539';
      ctx.fillRect(bx, by, 22, 5);
      // Nón lá trắng
      ctx.fillStyle = '#f4f4f6';
      ctx.beginPath();
      ctx.moveTo(bx + 11, by - 6);
      ctx.lineTo(bx + 6, by);
      ctx.lineTo(bx + 16, by);
      ctx.fill();
    }
    ctx.restore();
  }

  // 3. HÀ NỘI: Tháp Rùa 3 tầng Hồ Gươm, Cầu Thê Húc đỏ son & Cầu Long Biên
  _drawHanoi(ctx, hY) {
    ctx.save();
    // Nhịp cầu thép Long Biên vắt ngang sông Hồng phía xa
    ctx.strokeStyle = 'rgba(160, 180, 210, 0.35)';
    ctx.lineWidth = 1.4;
    const bridgeY = hY + 10;
    for (let lx = 0; lx < this.width; lx += 42) {
      ctx.strokeRect(lx, bridgeY - 15, 38, 15);
      ctx.beginPath();
      ctx.moveTo(lx, bridgeY);
      ctx.lineTo(lx + 19, bridgeY - 15);
      ctx.lineTo(lx + 38, bridgeY);
      ctx.stroke();
    }

    // Đảo Ngọc & Cầu Thê Húc uốn cong màu đỏ son
    const bridgeHX = 100;
    ctx.strokeStyle = '#e63946';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#e63946';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(bridgeHX, hY + 65, 36, Math.PI * 1.08, Math.PI * 1.92, false);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Đảo Tháp Rùa giữa hồ Gươm
    const isleX = this.width * 0.65;
    const isleY = hY + 48;
    ctx.fillStyle = '#1e3f28';
    ctx.beginPath();
    ctx.ellipse(isleX, isleY + 18, 55, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rặng liễu rủ bóng bên hồ
    ctx.fillStyle = '#386641';
    ctx.beginPath();
    ctx.arc(isleX - 35, isleY + 8, 14, 0, Math.PI * 2);
    ctx.arc(isleX + 35, isleY + 10, 12, 0, Math.PI * 2);
    ctx.fill();

    // THÁP RÙA 3 TẦNG CỔ KÍNH
    ctx.fillStyle = '#c9a227';
    // Tầng 1
    ctx.fillRect(isleX - 20, isleY - 4, 40, 20);
    // Tầng 2
    ctx.fillRect(isleX - 14, isleY - 20, 28, 16);
    // Tầng 3
    ctx.fillRect(isleX - 8, isleY - 32, 16, 12);

    // Mái ngói rêu phong
    ctx.fillStyle = '#9b2226';
    ctx.fillRect(isleX - 24, isleY - 6, 48, 3);
    ctx.fillRect(isleX - 17, isleY - 22, 34, 3);
    ctx.fillRect(isleX - 10, isleY - 34, 20, 3);

    // Cửa cuốn vòm phát sáng vàng hoài niệm
    ctx.fillStyle = '#ffea79';
    ctx.fillRect(isleX - 5, isleY + 4, 10, 12);
    ctx.fillRect(isleX - 3, isleY - 14, 6, 8);
    ctx.restore();
  }

  // 4. HUẾ: Cổng Ngọ Môn lầu Ngũ Phụng, Kỳ Đài & Cầu Tràng Tiền tím hồng
  _drawHue(ctx, hY) {
    ctx.save();
    // Kỳ Đài Cố Đô Huế cao vút
    const flagX = 70;
    ctx.fillStyle = '#341c28';
    ctx.fillRect(flagX - 18, hY - 10, 36, 30);
    ctx.strokeStyle = '#f4f4f6';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(flagX, hY - 10);
    ctx.lineTo(flagX, hY - 55);
    ctx.stroke();
    ctx.fillStyle = '#ff0054';
    ctx.fillRect(flagX, hY - 55, 16, 10);

    // CỔNG NGỌ MÔN & LẦU NGŨ PHỤNG HOÀNG THÀNH
    const nmX = this.width * 0.62;
    const nmY = hY + 15;
    // Bệ đá thành trì chữ U
    ctx.fillStyle = '#2b1b36';
    ctx.fillRect(nmX - 65, nmY - 18, 130, 24);
    // 3 Cửa vòm
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(nmX - 8, nmY - 6, 16, 12);
    ctx.fillRect(nmX - 36, nmY - 4, 12, 10);
    ctx.fillRect(nmX + 24, nmY - 4, 12, 10);

    // Lầu Ngũ Phụng trên tầng 2 nguy nga tráng lệ
    ctx.fillStyle = '#a01a38';
    ctx.fillRect(nmX - 45, nmY - 38, 90, 20);
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.moveTo(nmX - 55, nmY - 38);
    ctx.lineTo(nmX, nmY - 55);
    ctx.lineTo(nmX + 55, nmY - 38);
    ctx.fill();

    // CẦU TRÀNG TIỀN 6 VÀI 12 NHỊP (Tím hồng Huế)
    const bridgeY = hY + 54;
    ctx.strokeStyle = '#d946ef';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#d946ef';
    ctx.shadowBlur = 10;
    for (let cx = 10; cx < this.width; cx += 62) {
      ctx.beginPath();
      ctx.arc(cx + 31, bridgeY + 6, 28, Math.PI, 0, false);
      ctx.stroke();
      ctx.strokeRect(cx, bridgeY + 6, 62, 4);
    }
    ctx.restore();
  }

  // 5. ĐÀ NẴNG: Cầu Rồng phun lửa rực trời, Vòng quay Sun Wheel & Sông Hàn
  _drawDaNang(ctx, hY) {
    ctx.save();
    // Vòng quay Mặt Trời Sun Wheel
    const wX = 75;
    const wY = hY - 32;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.65)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(wX, wY, 26, 0, Math.PI * 2);
    ctx.stroke();
    for (let a = 0; a < 8; a++) {
      const ang = this.sunWheelAngle + (a * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(wX, wY);
      ctx.lineTo(wX + Math.cos(ang) * 26, wY + Math.sin(ang) * 26);
      ctx.stroke();
    }

    // Skyline cao ốc hiện đại Đà Nẵng
    const bldgs = [
      { x: 130, w: 32, h: 65, c: '#00f0ff' },
      { x: 170, w: 42, h: 90, c: '#ffd166' },
      { x: 220, w: 34, h: 55, c: '#ff007f' }
    ];
    bldgs.forEach(b => {
      ctx.fillStyle = '#0e1a30';
      ctx.fillRect(b.x, hY - b.h + 25, b.w, b.h);
      ctx.fillStyle = b.c;
      for (let wy = hY - b.h + 32; wy < hY + 15; wy += 14) {
        ctx.fillRect(b.x + 5, wy, b.w - 10, 2.5);
      }
    });

    // CẦU RỒNG ĐÀ NẴNG VÀNG RỰC
    const bridgeY = hY + 52;
    ctx.fillStyle = '#1a263e';
    ctx.fillRect(0, bridgeY, this.width, 10);

    // Thân rồng uốn 3 nhịp sóng vàng kim
    ctx.strokeStyle = '#ffb703';
    ctx.lineWidth = 6.0;
    ctx.shadowColor = '#ffb703';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(80, bridgeY, 40, Math.PI, 0, false);
    ctx.arc(170, bridgeY, 46, Math.PI, 0, false);
    ctx.arc(260, bridgeY, 46, Math.PI, 0, false);
    ctx.stroke();

    // Đầu Rồng thần thái uy dũng
    const headX = 310;
    const headY = bridgeY - 34;
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.moveTo(headX, headY + 12);
    ctx.lineTo(headX + 28, headY);
    ctx.lineTo(headX + 34, headY + 16);
    ctx.lineTo(headX + 18, headY + 28);
    ctx.closePath();
    ctx.fill();

    // Mắt Rồng phát quang ngọc đỏ
    ctx.fillStyle = '#ff0054';
    ctx.fillRect(headX + 20, headY + 8, 4, 4);

    // CẦU RỒNG PHUN LỬA RỰC CHÁY (Cinematic Fire Blast)
    const fireFlicker = Math.sin(this.dragonFlameTimer * 8) * 12;
    const fireLen = 58 + fireFlicker;
    const fGrad = ctx.createRadialGradient(headX + 34, headY + 12, 4, headX + 34 + fireLen * 0.7, headY + 10, fireLen);
    fGrad.addColorStop(0, '#ffffff');
    fGrad.addColorStop(0.2, '#fff066');
    fGrad.addColorStop(0.55, '#ff5400');
    fGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');

    ctx.fillStyle = fGrad;
    ctx.shadowColor = '#ff5400';
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.moveTo(headX + 34, headY + 8);
    ctx.quadraticCurveTo(headX + 50 + fireLen * 0.5, headY - 18, headX + 34 + fireLen, headY + 12);
    ctx.quadraticCurveTo(headX + 50 + fireLen * 0.5, headY + 32, headX + 34, headY + 20);
    ctx.fill();

    ctx.restore();
  }

  // 6. HỘI AN: Chùa Cầu (Lai Viễn Kiều), Dãy nhà cổ tường vàng & Hoa đăng Sông Hoài
  _drawHoiAn(ctx, hY) {
    ctx.save();
    // Phố cổ Hội An: Tường vàng hoa lệ, mái ngói âm dương rêu phong
    for (let x = 0; x < this.width; x += 52) {
      ctx.fillStyle = '#ffbe0b';
      ctx.fillRect(x, hY - 16, 48, 48);

      ctx.fillStyle = '#4f2b1d';
      ctx.beginPath();
      ctx.moveTo(x - 4, hY - 16);
      ctx.lineTo(x + 24, hY - 34);
      ctx.lineTo(x + 52, hY - 16);
      ctx.fill();

      // Giàn lồng đèn lụa Hội An rực sáng ấm áp
      ctx.fillStyle = (x % 104 === 0) ? '#ff0054' : '#ffd166';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(x + 14, hY - 6, 4.5, 0, Math.PI * 2);
      ctx.arc(x + 34, hY - 6, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // DI TÍCH CHÙA CẦU (Lai Viễn Kiều)
    const bridgeX = this.width * 0.5;
    const bY = hY + 30;
    ctx.fillStyle = '#5c4d3c';
    ctx.fillRect(bridgeX - 35, bY, 70, 10);
    ctx.fillStyle = '#8b263e';
    ctx.beginPath();
    ctx.moveTo(bridgeX - 42, bY);
    ctx.quadraticCurveTo(bridgeX, bY - 26, bridgeX + 42, bY);
    ctx.lineTo(bridgeX + 38, bY + 4);
    ctx.quadraticCurveTo(bridgeX, bY - 18, bridgeX - 38, bY + 4);
    ctx.fill();

    // Hàng trăm chiếc đèn hoa đăng bập bềnh trôi trên dòng sông Hoài
    for (let h = 0; h < 8; h++) {
      const flX = ((h * 54 + this.scrollX * 0.35 + Math.sin(this.animTimer + h) * 8) % this.width);
      const flY = hY + 44 + (h % 3) * 10;
      ctx.fillStyle = '#ff0054';
      ctx.shadowColor = '#ffd166';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(flX, flY, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(flX, flY - 1, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  }

  // 7. ĐÀ LẠT: Tháp chuông Nhà thờ Con Gà, Biệt thự Pháp & Đồi thông Hồ Xuân Hương
  _drawDaLat(ctx, hY) {
    ctx.save();
    // Thung lũng đồi thông bạt ngàn trùng điệp
    for (let p = 0; p < this.width; p += 26) {
      const pHeight = 48 + ((p * 9) % 36);
      ctx.fillStyle = '#143628';
      ctx.beginPath();
      ctx.moveTo(p + 13, hY - pHeight);
      ctx.lineTo(p, hY + 16);
      ctx.lineTo(p + 26, hY + 16);
      ctx.fill();

      ctx.fillStyle = '#22573f';
      ctx.beginPath();
      ctx.moveTo(p + 13, hY - pHeight + 16);
      ctx.lineTo(p + 3, hY + 26);
      ctx.lineTo(p + 23, hY + 26);
      ctx.fill();
    }

    // NHÀ THỜ CON GÀ (Chính tòa Đà Lạt)
    const churchX = 115;
    const cY = hY + 18;
    ctx.fillStyle = '#d4a373';
    ctx.fillRect(churchX - 25, cY - 25, 50, 25);
    ctx.fillRect(churchX - 9, cY - 70, 18, 45);
    ctx.fillStyle = '#8b263e';
    ctx.beginPath();
    ctx.moveTo(churchX - 11, cY - 70);
    ctx.lineTo(churchX, cY - 92);
    ctx.lineTo(churchX + 11, cY - 70);
    ctx.fill();
    // Tượng Con Gà bằng đồng trên đỉnh tháp
    ctx.fillStyle = '#ffbe0b';
    ctx.fillRect(churchX - 2, cY - 97, 4, 5);

    // Lớp sương mù trắng huyền ảo trên mặt hồ Xuân Hương
    ctx.fillStyle = 'rgba(230, 240, 255, 0.32)';
    ctx.fillRect(0, hY + 24, this.width, 26);
    ctx.restore();
  }

  // 8. TP. HỒ CHÍ MINH: Landmark 81 chọc trời, Bitexco búp sen & Sông Sài Gòn
  _drawHoChiMinh(ctx, hY) {
    ctx.save();
    // 1. TÒA THÁP BITEXCO
    const bitX = 95;
    ctx.fillStyle = '#101d36';
    ctx.beginPath();
    ctx.moveTo(bitX - 16, hY + 25);
    ctx.lineTo(bitX - 12, hY - 110);
    ctx.quadraticCurveTo(bitX, hY - 125, bitX + 12, hY - 110);
    ctx.lineTo(bitX + 16, hY + 25);
    ctx.fill();
    // Bãi đỗ trực thăng tầng 52 chìa ra sông Sài Gòn
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(bitX - 24, hY - 65, 18, 4);

    // 2. LANDMARK 81
    const lmX = 245;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(lmX - 26, hY - 75, 52, 100);
    ctx.fillRect(lmX - 18, hY - 135, 36, 60);
    ctx.fillRect(lmX - 10, hY - 185, 20, 50);

    // Cột spire kim cương vút cao phát sáng đỉnh tháp
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3.0;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.moveTo(lmX, hY - 185);
    ctx.lineTo(lmX, hY - 235);
    ctx.stroke();

    // Dải đèn LED nghệ thuật chạy dọc thân Landmark 81
    ctx.fillStyle = '#ff007f';
    ctx.fillRect(lmX - 2, hY - 180, 4, 205);
    ctx.shadowBlur = 0;

    // Du thuyền lung linh ánh đèn trên sông Sài Gòn
    const yachtX = ((150 - this.scrollX * 0.4) % this.width + this.width) % this.width;
    ctx.fillStyle = '#f4f4f6';
    ctx.fillRect(yachtX, hY + 45, 28, 6);
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(yachtX + 6, hY + 41, 14, 4);
    ctx.restore();
  }

  // 9. MIỀN TÂY: Cầu Cần Thơ dây văng khổng lồ, Rặng dừa nước & Chợ nổi Cái Răng
  _drawMienTay(ctx, hY) {
    ctx.save();
    // CẦU CẦN THƠ (Trụ tháp chữ Y ngược khổng lồ)
    const pylonX = 195;
    ctx.strokeStyle = '#f4f4f6';
    ctx.lineWidth = 4.0;
    ctx.beginPath();
    ctx.moveTo(pylonX, hY - 110);
    ctx.lineTo(pylonX - 20, hY + 30);
    ctx.moveTo(pylonX, hY - 110);
    ctx.lineTo(pylonX + 20, hY + 30);
    ctx.stroke();

    // Hệ thống dây văng cánh quạt phản quang
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.65)';
    ctx.lineWidth = 1.2;
    for (let s = 18; s <= 95; s += 24) {
      ctx.beginPath();
      ctx.moveTo(pylonX, hY - 110 + s * 0.45);
      ctx.lineTo(pylonX - s, hY + 30);
      ctx.moveTo(pylonX, hY - 110 + s * 0.45);
      ctx.lineTo(pylonX + s, hY + 30);
      ctx.stroke();
    }

    // Rặng dừa nước 2 bên bờ sông Hậu
    for (let d = 0; d < this.width; d += 36) {
      if (Math.abs(d - pylonX) < 45) continue;
      ctx.fillStyle = '#1b4332';
      ctx.beginPath();
      ctx.arc(d + 18, hY + 22, 16, Math.PI, 0, false);
      ctx.fill();
    }

    // Ghe xuồng chợ nổi Cái Răng
    const boats = [
      { x: 60, fruit: '#52b788' }, // Dưa hấu
      { x: 130, fruit: '#ffbe0b' }, // Khóm / Xoài vàng
      { x: 290, fruit: '#ff0054' }  // Thanh long đỏ
    ];
    boats.forEach(b => {
      const bx = ((b.x - this.scrollX * 0.35) % this.width + this.width) % this.width;
      ctx.fillStyle = '#6f4e37';
      ctx.fillRect(bx, hY + 52, 30, 6);
      ctx.strokeStyle = '#d4a373';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(bx + 4, hY + 52);
      ctx.lineTo(bx + 4, hY + 38);
      ctx.stroke();
      ctx.fillStyle = b.fruit;
      ctx.beginPath();
      ctx.arc(bx + 4, hY + 38, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }
}
