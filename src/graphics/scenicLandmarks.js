/**
 * Vietnam Iconic Landmarks Overlook System - Master Cinema Edition
 * 
 * Features:
 * 1. Seamless camera elevation cycle:
 *    - Flight in the sky (initial perspective, looking up/forward)
 *    - Camera ascends and tilts down smoothly (reveal panorama below)
 *    - Panoramic flight viewing the landmark
 *    - Camera descends back to sky perspective
 *    - On next ascent, shifts to the NEXT iconic Vietnamese destination from North to South!
 * 2. Editorial typography (High-end magazine aesthetic):
 *    - ALL-CAPS, subtle off-white (#f4f4f6), letter-spaced serif/clean grotesque look
 *    - Issue tag, geographic coordinate, elegant hairline dividers
 * 3. Highly crafted pixel-art procedural rendering for each landmark with signature architecture:
 *    - Sa Pa: Ruộng bậc thang Hoàng Su Phì, đỉnh Fansipan hùng vĩ, cáp treo & cột cờ
 *    - Ninh Bình: Non nước Tràng An, vách núi đá vôi kỳ vĩ soi bóng, đầm sen & thuyền nan
 *    - Hà Nội: Tháp Rùa cổ kính rêu phong, Cầu Thê Húc son đỏ uốn cong, Cầu Long Biên
 *    - Huế: Cửa Ngọ Môn lầu Ngũ Phụng tráng lệ, Cột cờ Kỳ Đài, Cầu Tràng Tiền 6 vài 12 nhịp
 *    - Đà Nẵng: Cầu Rồng uốn lượn phun lửa rực trời, vòng quay Mặt Trời Sun Wheel, sông Hàn
 *    - Hội An: Mái ngói âm dương Chùa Cầu, tường vàng phố cổ, hàng trăm hoa đăng sông Hoài
 *    - Đà Lạt: Tháp chuông Nhà thờ Con Gà, đồi thông sương mờ, biệt thự Pháp cổ Hồ Xuân Hương
 *    - TP. Hồ Chí Minh: Tòa Landmark 81 vươn chọc trời, búp sen Bitexco, Bến Bạch Đằng
 *    - Miền Tây: Cầu Cần Thơ dây văng khổng lồ, ghe xuồng tấp nập chợ nổi Cái Răng & rừng tràm
 */

export const VIETNAM_LANDMARKS = [
  {
    id: 'sapa',
    title: 'SAPA',
    subtitle: 'THE TERRACED KINGDOM & FANSIPAN PEAK',
    coords: '22°20′N 103°50′E • HOANG LIEN SON RANGE',
    region: 'NORTHERN HIGHLANDS',
    issue: 'EXPEDITION N° 01',
    waterColor: '#17332c',
    fogColor: 'rgba(28, 56, 46, 0.45)'
  },
  {
    id: 'ninhbinh',
    title: 'NINH BINH',
    subtitle: 'TRANG AN KARST REALM & ANCIENT RIVERS',
    coords: '20°15′N 105°58′E • UNESCO HERITAGE',
    region: 'RED RIVER DELTA',
    issue: 'EXPEDITION N° 02',
    waterColor: '#102e2c',
    fogColor: 'rgba(16, 46, 44, 0.45)'
  },
  {
    id: 'hanoi',
    title: 'HA NOI',
    subtitle: 'SWORD LAKE & THE ANCIENT TURTLE TOWER',
    coords: '21°01′N 105°51′E • THOUSAND-YEAR CAPITAL',
    region: 'HISTORIC HEARTLAND',
    issue: 'EXPEDITION N° 03',
    waterColor: '#0c2238',
    fogColor: 'rgba(18, 38, 62, 0.45)'
  },
  {
    id: 'hue',
    title: 'HUE',
    subtitle: 'IMPERIAL CITADEL & PERFUME RIVER',
    coords: '16°28′N 107°35′E • NGUYEN DYNASTY REALM',
    region: 'CENTRAL REALM',
    issue: 'EXPEDITION N° 04',
    waterColor: '#1d1933',
    fogColor: 'rgba(36, 26, 58, 0.45)'
  },
  {
    id: 'danang',
    title: 'DA NANG',
    subtitle: 'DRAGON BRIDGE & THE HAN RIVER SKYLINE',
    coords: '16°04′N 108°13′E • COASTAL METROPOLIS',
    region: 'CENTRAL COAST',
    issue: 'EXPEDITION N° 05',
    waterColor: '#0a1d3b',
    fogColor: 'rgba(14, 32, 64, 0.45)'
  },
  {
    id: 'hoian',
    title: 'HOI AN',
    subtitle: 'ANCIENT LANTERN TOWN & HOAI RIVER',
    coords: '15°53′N 108°20′E • TIMELESS TRADING PORT',
    region: 'QUANG NAM PROVINCE',
    issue: 'EXPEDITION N° 06',
    waterColor: '#2b1a1c',
    fogColor: 'rgba(54, 30, 24, 0.45)'
  },
  {
    id: 'dalat',
    title: 'DA LAT',
    subtitle: 'PINE MIST & THE CITY OF ETERNAL SPRING',
    coords: '11°56′N 108°26′E • CENTRAL HIGHLANDS',
    region: 'LAM VIEN PLATEAU',
    issue: 'EXPEDITION N° 07',
    waterColor: '#12262d',
    fogColor: 'rgba(20, 48, 56, 0.45)'
  },
  {
    id: 'hcm',
    title: 'SAI GON',
    subtitle: 'LANDMARK 81 & THE SLEEPLESS PEARL',
    coords: '10°46′N 106°40′E • FINANCIAL EPICENTER',
    region: 'SOUTHERN METROPOLIS',
    issue: 'EXPEDITION N° 08',
    waterColor: '#09152b',
    fogColor: 'rgba(12, 24, 52, 0.45)'
  },
  {
    id: 'mientay',
    title: 'MEKONG DELTA',
    subtitle: 'CAN THO SPAN & FLOATING RIVER HORIZON',
    coords: '10°02′N 105°47′E • NINE DRAGONS BASIN',
    region: 'SOUTHERN WATERWAYS',
    issue: 'EXPEDITION N° 09',
    waterColor: '#1b382d',
    fogColor: 'rgba(24, 56, 42, 0.45)'
  }
];

export class ScenicLandmarksManager {
  constructor(width = 400, height = 700) {
    this.width = width;
    this.height = height;

    this.currentIndex = 0;
    this.scrollX = 0;
    this.scrollSpeed = 38;

    /**
     * Camera Flight State Machine:
     * - 'SKY': Camera looks ahead into sky/clouds
     * - 'ASCENDING': Camera gradually rises, tilting lens down to reveal ground (3.2s)
     * - 'OVERLOOK': High altitude panoramic scenic flight (16s)
     * - 'DESCENDING': Camera gradually dips back into cloud ceiling (3.2s)
     */
    this.flightState = 'SKY';
    this.stateTimer = 8.0; // Initial 8s in pure sky
    this.pitch = 0; // 0.0 = pure sky, 1.0 = full panoramic overview

    // Visual animation timers
    this.dragonFireTimer = 0;
    this.lanternFloatTimer = 0;
    this.cableCarPhase = 0;
    this.sunWheelAngle = 0;

    // Editorial Title Card Animation
    this.cardAlpha = 0;
    this.cardSlide = 0;
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
  }

  update(dt, score = 0) {
    this.scrollX += this.scrollSpeed * dt;
    this.dragonFireTimer += dt * 4;
    this.lanternFloatTimer += dt;
    this.cableCarPhase += dt * 0.25;
    this.sunWheelAngle += dt * 0.4;

    this.stateTimer -= dt;

    if (this.flightState === 'SKY') {
      this.pitch = 0;
      if (this.stateTimer <= 0) {
        // Bắt đầu cất cánh bay lên cao nhìn xuống
        this.flightState = 'ASCENDING';
        this.stateTimer = 3.2; // 3.2s lướt camera cực kỳ mượt mà
        this.cardAlpha = 0;
        this.cardSlide = 20;
      }
    } else if (this.flightState === 'ASCENDING') {
      const progress = 1.0 - Math.max(0, this.stateTimer / 3.2);
      // Easing cubic in-out
      this.pitch = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Chuẩn bị xuất hiện bảng chữ tạp chí khi sắp hoàn tất lên cao
      if (progress > 0.4) {
        this.cardAlpha = Math.min(1.0, (progress - 0.4) * 2.2);
        this.cardSlide = (1.0 - this.cardAlpha) * 16;
      }

      if (this.stateTimer <= 0) {
        this.flightState = 'OVERLOOK';
        this.pitch = 1.0;
        this.stateTimer = 16.0; // 16s ngắm danh lam thắng cảnh
      }
    } else if (this.flightState === 'OVERLOOK') {
      this.pitch = 1.0;
      if (this.stateTimer <= 3.0) {
        // Làm mờ dần bảng chữ tạp chí trước khi hạ camera
        this.cardAlpha = Math.max(0, this.stateTimer / 3.0);
      }

      if (this.stateTimer <= 0) {
        // Bắt đầu hạ camera xuống trở lại bầu trời
        this.flightState = 'DESCENDING';
        this.stateTimer = 3.2;
      }
    } else if (this.flightState === 'DESCENDING') {
      const progress = 1.0 - Math.max(0, this.stateTimer / 3.2);
      // Easing cubic in-out hạ dần
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      this.pitch = 1.0 - ease;
      this.cardAlpha = 0;

      if (this.stateTimer <= 0) {
        // QUAY LẠI BẦU TRỜI HOÀN TẤT:
        // Chuyển sang địa danh tiếp theo từ Bắc vào Nam cho lần bay sau!
        this.flightState = 'SKY';
        this.pitch = 0;
        this.currentIndex = (this.currentIndex + 1) % VIETNAM_LANDMARKS.length;
        this.stateTimer = 9.0; // 9s bay trong bầu trời trước khi qua địa danh mới
      }
    }
  }

  draw(ctx) {
    if (this.pitch <= 0.005) return;

    ctx.save();

    // Vị trí chân trời (Horizon line hạ từ đáy 700 lên 380px)
    const targetHorizonY = this.height * 0.48;
    const currentHorizonY = this.height - (this.height - targetHorizonY) * this.pitch;
    const landHeight = this.height - currentHorizonY;

    const landmark = VIETNAM_LANDMARKS[this.currentIndex] || VIETNAM_LANDMARKS[0];

    // 1. Water Surface / Ground Gradient
    const waterGrad = ctx.createLinearGradient(0, currentHorizonY, 0, this.height);
    waterGrad.addColorStop(0, landmark.waterColor);
    waterGrad.addColorStop(0.5, '#0c1724');
    waterGrad.addColorStop(1, '#060a12');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, currentHorizonY, this.width, landHeight);

    // 2. Render Artwork chi tiết cho từng địa danh
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

    // 3. Cinematic Atmospheric Scrim Fog (Giữ nét 100% cho gameplay)
    const fog = ctx.createLinearGradient(0, currentHorizonY - 30, 0, this.height);
    fog.addColorStop(0, 'rgba(10, 14, 24, 0.05)');
    fog.addColorStop(0.35, 'rgba(10, 14, 24, 0.35)');
    fog.addColorStop(1, 'rgba(6, 10, 18, 0.65)');
    ctx.fillStyle = fog;
    ctx.fillRect(0, currentHorizonY - 30, this.width, landHeight + 30);

    // 4. Luxury Magazine / Editorial Typography Overlay
    if (this.cardAlpha > 0.01) {
      this._drawEditorialTypography(ctx, landmark);
    }

    ctx.restore();
  }

  /**
   * Thiết kế chữ phong cách Tạp chí cao cấp (Vogue / Kinfolk / National Geographic Traveller)
   * - In hoa toàn bộ, màu trắng nhạt thanh thoát (#f4f4f6)
   * - Spacing giãn dòng rộng, nét thanh mỏng, bố cục cân xứng điện ảnh
   */
  _drawEditorialTypography(ctx, landmark) {
    ctx.save();
    ctx.globalAlpha = Math.min(1.0, this.cardAlpha);

    const centerX = this.width / 2;
    const baseY = 82 + this.cardSlide;

    // Hairline Border Box
    ctx.strokeStyle = 'rgba(244, 244, 246, 0.35)';
    ctx.lineWidth = 0.75;
    ctx.strokeRect(30, baseY - 32, this.width - 60, 58);

    // 1. Issue & Region Header
    ctx.fillStyle = 'rgba(244, 244, 246, 0.65)';
    ctx.font = '600 8px -apple-system, "Segoe UI", Roboto, monospace';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '3px';
    ctx.fillText(`VIETNAM PANORAMA • ${landmark.issue}`, centerX, baseY - 18);

    // 2. Main Title (In hoa, thanh lịch, lớn nổi bật)
    ctx.fillStyle = '#f4f4f6';
    ctx.font = '700 16px "Times New Roman", Georgia, serif';
    ctx.letterSpacing = '5px';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 8;
    ctx.fillText(landmark.title, centerX, baseY + 2);

    // 3. Subtitle Description & Coords
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(244, 244, 246, 0.75)';
    ctx.font = '400 7.5px -apple-system, "Segoe UI", Roboto, monospace';
    ctx.letterSpacing = '1.5px';
    ctx.fillText(landmark.subtitle, centerX, baseY + 16);

    ctx.restore();
  }

  // ==========================================
  // CHI TIẾT TẠO HÌNH 9 ĐỊA DANH ĐIỆN ẢNH
  // ==========================================

  // 1. SA PA: Fansipan hùng vĩ, Cáp treo lơ lửng & Ruộng bậc thang Hoàng Su Phì
  _drawSapa(ctx, hY) {
    ctx.save();
    // Dãy núi Hoàng Liên Sơn tuyết mờ & mây giăng
    ctx.fillStyle = '#1c2e26';
    ctx.beginPath();
    ctx.moveTo(0, hY + 10);
    ctx.lineTo(65, hY - 45);
    ctx.lineTo(130, hY - 15);
    ctx.lineTo(240, hY - 95); // Đỉnh Fansipan 3.143m
    ctx.lineTo(310, hY - 30);
    ctx.lineTo(this.width, hY - 55);
    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.fill();

    // Kim tự tháp inox đỉnh Fansipan & cột cờ
    const peakX = 240;
    const peakY = hY - 95;
    ctx.fillStyle = '#f4f4f6';
    ctx.beginPath();
    ctx.moveTo(peakX, peakY - 8);
    ctx.lineTo(peakX - 6, peakY);
    ctx.lineTo(peakX + 6, peakY);
    ctx.fill();
    // Cờ đỏ sao vàng đỉnh nóc nhà Đông Dương
    ctx.strokeStyle = '#ff0054';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(peakX + 2, peakY - 8);
    ctx.lineTo(peakX + 2, peakY - 18);
    ctx.stroke();
    ctx.fillStyle = '#ff0054';
    ctx.fillRect(peakX + 2, peakY - 18, 7, 5);

    // Đường dây cáp treo Fansipan băng qua thung lũng
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(30, hY - 10);
    ctx.lineTo(peakX - 25, peakY + 25);
    ctx.stroke();

    // Cabin cáp treo di chuyển
    const cabProg = (this.cableCarPhase) % 1.0;
    const cabX = 30 + (peakX - 55) * cabProg;
    const cabY = (hY - 10) + (peakY + 35 - hY) * cabProg;
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(cabX - 4, cabY, 8, 6);
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(cabX - 2, cabY + 1, 4, 3);

    // 5 Tầng ruộng bậc thang vàng óng uốn lượn thung lũng Mường Hoa
    const terraceColors = ['#28542c', '#407a36', '#629e46', '#87b858', '#b5c96b'];
    for (let i = 0; i < 5; i++) {
      const tY = hY + 18 + i * 26;
      ctx.fillStyle = terraceColors[i];
      ctx.beginPath();
      ctx.moveTo(0, tY);
      for (let x = 0; x <= this.width; x += 35) {
        const curve = Math.sin((x + this.scrollX * 0.3 + i * 65) * 0.025) * 14;
        ctx.lineTo(x, tY + curve);
      }
      ctx.lineTo(this.width, this.height);
      ctx.lineTo(0, this.height);
      ctx.fill();

      // Rìa bờ đất ruộng bậc thang đón ánh sáng
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.restore();
  }

  // 2. NINH BÌNH: Quần thể núi đá vôi Tràng An soi bóng & thuyền nan Tam Cốc
  _drawNinhBinh(ctx, hY) {
    ctx.save();
    // Vách núi đá vôi sừng sững dốc đứng đặc trưng karst Tràng An
    const cliffs = [
      { x: 15, w: 75, h: 110, c: '#162822' },
      { x: 110, w: 95, h: 135, c: '#233d34' },
      { x: 225, w: 80, h: 105, c: '#193028' },
      { x: 320, w: 85, h: 125, c: '#27443a' }
    ];

    cliffs.forEach((c, idx) => {
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
      ctx.fillStyle = '#407a52';
      ctx.beginPath();
      ctx.arc(cx + c.w * 0.3, hY - c.h * 0.5, 6, 0, Math.PI * 2);
      ctx.arc(cx + c.w * 0.7, hY - c.h * 0.65, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    // Thủy đình rêu phong giữa hồ nước Tràng An
    const pavilionX = this.width * 0.5;
    const pavY = hY + 42;
    ctx.fillStyle = '#8b263e';
    ctx.fillRect(pavilionX - 16, pavY - 14, 32, 14);
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.moveTo(pavilionX - 22, pavY - 14);
    ctx.lineTo(pavilionX, pavY - 26);
    ctx.lineTo(pavilionX + 22, pavY - 14);
    ctx.fill();

    // Đoàn thuyền nan mộc chèo tay chở khách du lịch trên sông Ngô Đồng
    for (let b = 0; b < 4; b++) {
      const bx = ((b * 105 + 40 - this.scrollX * 0.45) % (this.width + 80)) - 40;
      const by = hY + 55 + (b % 2) * 16;
      ctx.fillStyle = '#7f5539';
      ctx.fillRect(bx, by, 22, 5);
      // Nón lá trắng tinh khôi của người chèo đò
      ctx.fillStyle = '#f4f4f6';
      ctx.beginPath();
      ctx.moveTo(bx + 11, by - 6);
      ctx.lineTo(bx + 6, by);
      ctx.lineTo(bx + 16, by);
      ctx.fill();
    }
    ctx.restore();
  }

  // 3. HÀ NỘI: Tháp Rùa Hồ Gươm, Cầu Thê Húc đỏ son & Cầu Long Biên
  _drawHanoi(ctx, hY) {
    ctx.save();
    // Nhịp cầu thép Long Biên vắt ngang sông Hồng phía xa
    ctx.strokeStyle = 'rgba(160, 180, 210, 0.35)';
    ctx.lineWidth = 1.4;
    const bridgeY = hY + 12;
    for (let lx = 0; lx < this.width; lx += 42) {
      ctx.strokeRect(lx, bridgeY - 15, 38, 15);
      ctx.beginPath();
      ctx.moveTo(lx, bridgeY);
      ctx.lineTo(lx + 19, bridgeY - 15);
      ctx.lineTo(lx + 38, bridgeY);
      ctx.stroke();
    }

    // Đảo Ngọc & Cầu Thê Húc uốn cong màu đỏ son
    const bridgeHX = 110;
    ctx.strokeStyle = '#e63946';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#e63946';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(bridgeHX, hY + 68, 38, Math.PI * 1.08, Math.PI * 1.92, false);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Đảo Rùa giữa hồ Gươm
    const isleX = this.width * 0.65;
    const isleY = hY + 52;
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

    // Các ô cửa cuốn vòm phát sáng vàng hoài niệm
    ctx.fillStyle = '#ffea79';
    ctx.fillRect(isleX - 5, isleY + 4, 10, 12);
    ctx.fillRect(isleX - 3, isleY - 14, 6, 8);
    ctx.restore();
  }

  // 4. HUẾ: Cửa Ngọ Môn lầu Ngũ Phụng, Cột cờ Kỳ Đài & Cầu Tràng Tiền đổi màu
  _drawHue(ctx, hY) {
    ctx.save();
    // Kỳ Đài Cố Đô Huế cao vút
    const flagX = 75;
    ctx.fillStyle = '#341c28';
    ctx.fillRect(flagX - 18, hY - 10, 36, 30);
    // Cột cờ & cờ đỏ
    ctx.strokeStyle = '#f4f4f6';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(flagX, hY - 10);
    ctx.lineTo(flagX, hY - 55);
    ctx.stroke();
    ctx.fillStyle = '#ff0054';
    ctx.fillRect(flagX, hY - 55, 16, 10);

    // CỬA NGỌ MÔN & LẦU NGŨ PHỤNG HOÀNG THÀNH HUẾ
    const ngoMonX = this.width * 0.62;
    const nmY = hY + 15;
    // Bệ đá thành trì chữ U
    ctx.fillStyle = '#2b1b36';
    ctx.fillRect(ngoMonX - 65, nmY - 18, 130, 24);
    // 3 Cửa vòm (Cửa chính giữa dành cho Vua)
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(ngoMonX - 8, nmY - 6, 16, 12);
    ctx.fillRect(ngoMonX - 36, nmY - 4, 12, 10);
    ctx.fillRect(ngoMonX + 24, nmY - 4, 12, 10);

    // Lầu Ngũ Phụng trên tầng 2 nguy nga tráng lệ
    ctx.fillStyle = '#a01a38';
    ctx.fillRect(ngoMonX - 45, nmY - 38, 90, 20);
    // Mái ngói hoàng lưu ly (vàng) & thanh lưu ly (xanh)
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.moveTo(ngoMonX - 55, nmY - 38);
    ctx.lineTo(ngoMonX, nmY - 55);
    ctx.lineTo(ngoMonX + 55, nmY - 38);
    ctx.fill();

    // CẦU TRÀNG TIỀN 6 VÀI 12 NHỊP VẮT QUA SÔNG HƯƠNG (Đổi màu Neon Huế tím - hồng)
    const bridgeY = hY + 58;
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
    // Vòng quay Mặt Trời Sun Wheel phía xa bên bờ sông
    const wheelX = 75;
    const wheelY = hY - 32;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.65)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(wheelX, wheelY, 26, 0, Math.PI * 2);
    ctx.stroke();
    // Các nan hoa phát sáng xoay tròn
    for (let a = 0; a < 8; a++) {
      const ang = this.sunWheelAngle + (a * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(wheelX, wheelY);
      ctx.lineTo(wheelX + Math.cos(ang) * 26, wheelY + Math.sin(ang) * 26);
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
    const bridgeY = hY + 54;
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
    const fireFlicker = Math.sin(this.dragonFireTimer * 8) * 12;
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

  // 6. HỘI AN: Chùa Cầu cổ kính, Dãy nhà phố cổ tường vàng & Hoa đăng Sông Hoài
  _drawHoiAn(ctx, hY) {
    ctx.save();
    // Phố cổ Hội An: Tường vàng hoa lệ, mái ngói âm dương rêu phong
    for (let x = 0; x < this.width; x += 52) {
      ctx.fillStyle = '#ffbe0b';
      ctx.fillRect(x, hY - 16, 48, 48);

      // Mái ngói cong cổ kính
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

    // DI TÍCH CHÙA CẦU (Lai Viễn Kiều) BẮC QUA LẠCH NƯỚC
    const bridgeX = this.width * 0.5;
    const bY = hY + 32;
    // Trụ cầu bằng đá cổ
    ctx.fillStyle = '#5c4d3c';
    ctx.fillRect(bridgeX - 35, bY, 70, 10);
    // Mái che bằng gỗ cong vút cổ truyền
    ctx.fillStyle = '#8b263e';
    ctx.beginPath();
    ctx.moveTo(bridgeX - 42, bY);
    ctx.quadraticCurveTo(bridgeX, bY - 26, bridgeX + 42, bY);
    ctx.lineTo(bridgeX + 38, bY + 4);
    ctx.quadraticCurveTo(bridgeX, bY - 18, bridgeX - 38, bY + 4);
    ctx.fill();

    // Hàng trăm chiếc đèn hoa đăng bập bềnh trôi trên dòng sông Hoài
    for (let h = 0; h < 8; h++) {
      const flX = ((h * 54 + this.scrollX * 0.35 + Math.sin(this.lanternFloatTimer + h) * 8) % this.width);
      const flY = hY + 46 + (h % 3) * 10;
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

    // NHÀ THỜ CON GÀ (Chính tòa Đà Lạt) VỚI THÁP CHUÔNG CỔ KÍNH
    const churchX = 115;
    const cY = hY + 18;
    // Gian thánh đường phong cách Romanesque
    ctx.fillStyle = '#d4a373';
    ctx.fillRect(churchX - 25, cY - 25, 50, 25);
    // Tháp chuông vươn cao 47m
    ctx.fillRect(churchX - 9, cY - 70, 18, 45);
    // Mái nhọn tháp chuông
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

  // 8. TP. HỒ CHÍ MINH: Landmark 81 chọc trời, Bitexco búp sen & Bến Bạch Đằng
  _drawHoChiMinh(ctx, hY) {
    ctx.save();
    // 1. TÒA THÁP BITEXCO (Búp sen vươn lên với bãi đáp trực thăng)
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

    // 2. LANDMARK 81 (Tòa nhà cao nhất Việt Nam, bó tre vươn mây)
    const lmX = 245;
    // Bó ống giật cấp vĩ đại
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
    // CẦU CẦN THƠ (Trụ tháp chữ Y ngược khổng lồ & Dây văng rẻ quạt)
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

    // Rặng dừa nước đung đưa bạt ngàn 2 bên bờ sông Hậu
    for (let d = 0; d < this.width; d += 36) {
      if (Math.abs(d - pylonX) < 45) continue;
      ctx.fillStyle = '#1b4332';
      ctx.beginPath();
      ctx.arc(d + 18, hY + 22, 16, Math.PI, 0, false);
      ctx.fill();
    }

    // Ghe xuồng chợ nổi Cái Răng với cây bẹo treo dưa hấu, khóm, xoài
    const boats = [
      { x: 60, fruit: '#52b788' }, // Dưa hấu
      { x: 130, fruit: '#ffbe0b' }, // Khóm / Xoài vàng
      { x: 290, fruit: '#ff0054' }  // Thanh long đỏ
    ];
    boats.forEach(b => {
      const bx = ((b.x - this.scrollX * 0.35) % this.width + this.width) % this.width;
      ctx.fillStyle = '#6f4e37';
      ctx.fillRect(bx, hY + 54, 30, 6);
      // Cây bẹo treo nông sản đầu ghe
      ctx.strokeStyle = '#d4a373';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(bx + 4, hY + 54);
      ctx.lineTo(bx + 4, hY + 40);
      ctx.stroke();
      ctx.fillStyle = b.fruit;
      ctx.beginPath();
      ctx.arc(bx + 4, hY + 40, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }
}
