/**
 * Dynamic Sky & Weather Background System for Drunk Rocket 2.5
 * Supports 7 Living Atmospheres:
 * - Bình Minh & Hoàng Hôn: Gradient trời hửng sáng/chiều tà, đàn chim én pixel vỗ cánh bay qua
 * - Trời Nắng: Nắng vàng tỏa hào quang, bụi nắng lơ lửng, tiếng sóng biển vỗ bờ dào dạt
 * - Âm U: Mây xám trôi tầng tầng lớp lớp
 * - Trời Mưa: Hạt mưa rơi xiên, sóng gợn đáy sàn
 * - Mưa Giông (Thunderstorm): Hiệu ứng ánh sáng điện ảnh (Cinematic Lighting) với tia sét phân nhánh,
 *   chớp giật đa tầng (multi-strobe), ánh sáng tỏa viền mây (cloud rim bloom) và viền phim điện ảnh (film vignette)
 * - Trời Tối: Tinh vân sâu thẳm, sao băng vụt qua
 */
export class Starfield {
  constructor(width = 400, height = 700) {
    this.width = width;
    this.height = height;

    this.currentSkyTop = '#3b2d54';
    this.currentSkyBottom = '#ff9e79';
    this.targetSkyTop = '#3b2d54';
    this.targetSkyBottom = '#ff9e79';
    this.weather = 'birds';

    // Entities
    this.birds = [];
    this.rainDrops = [];
    this.clouds = [];
    this.stars = [];
    this.sunRaysPhase = 0;

    // Cinematic Storm Lightning System
    this.lightningFlash = 0;
    this.lightningTimer = 0;
    this.strobeTimer = 0;
    this.strikeX = 200;
    this.lightningBolts = [];
    this.onLightning = null;

    this._initElements();
  }

  setTheme(theme) {
    if (!theme) return;
    if (theme.skyTop) this.targetSkyTop = theme.skyTop;
    if (theme.skyBottom) this.targetSkyBottom = theme.skyBottom;
    if (theme.weather) this.weather = theme.weather;
  }

  _initElements() {
    // 1. Birds (Đàn chim én)
    this.birds = [];
    for (let i = 0; i < 7; i++) {
      this.birds.push({
        x: Math.random() * this.width,
        y: 60 + Math.random() * 200,
        speed: 55 + Math.random() * 35,
        wingPhase: Math.random() * Math.PI * 2,
        wingSpeed: 10 + Math.random() * 6,
        size: 3 + Math.random() * 2.5
      });
    }

    // 2. Rain drops (Hạt mưa)
    this.rainDrops = [];
    for (let i = 0; i < 85; i++) {
      this.rainDrops.push({
        x: Math.random() * (this.width + 120) - 60,
        y: Math.random() * this.height,
        len: 14 + Math.random() * 16,
        speed: 520 + Math.random() * 280,
        vx: -100 - Math.random() * 60
      });
    }

    // 3. Clouds (Mây âm u / giông bão)
    this.clouds = [];
    for (let i = 0; i < 6; i++) {
      this.clouds.push({
        x: Math.random() * this.width,
        y: 40 + i * 55 + Math.random() * 25,
        w: 95 + Math.random() * 85,
        h: 26 + Math.random() * 18,
        speed: 16 + Math.random() * 16,
        alpha: 0.28 + Math.random() * 0.2
      });
    }

    // 4. Stars (Sao đêm)
    this.stars = [];
    for (let i = 0; i < 45; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height - 100),
        size: Math.random() > 0.6 ? 2 : 1.2,
        twinkle: Math.random() * Math.PI * 2,
        speed: 20 + Math.random() * 25
      });
    }
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
    this._initElements();
  }

  _triggerLightningStrike() {
    this.lightningFlash = 1.0;
    this.strobeTimer = 0.42;
    this.strikeX = 50 + Math.random() * (this.width - 100);

    // Tạo tia sét chính và các nhánh con lan tỏa xé toang bầu trời
    const endX = this.strikeX + (Math.random() * 140 - 70);
    const endY = this.height * (0.60 + Math.random() * 0.35);
    this.lightningBolts = [this._generateBolt(this.strikeX, 0, endX, endY, 8, 26)];

    // Nhánh phụ cấp 1
    if (this.lightningBolts[0].length >= 4) {
      const midNode = this.lightningBolts[0][2];
      this.lightningBolts.push(this._generateBolt(midNode.x, midNode.y, midNode.x + (Math.random() * 100 - 50), midNode.y + 115, 4, 18));

      const lowerNode = this.lightningBolts[0][4];
      if (lowerNode) {
        this.lightningBolts.push(this._generateBolt(lowerNode.x, lowerNode.y, lowerNode.x + (Math.random() * 80 - 40), lowerNode.y + 90, 3, 14));
      }
    }

    // Kích hoạt đồng bộ âm thanh sấm sét rền vang
    if (typeof this.onLightning === 'function') {
      try { this.onLightning(); } catch (e) {}
    }
  }

  _generateBolt(x1, y1, x2, y2, segments, jitter) {
    const points = [{ x: x1, y: y1 }];
    const dx = (x2 - x1) / segments;
    const dy = (y2 - y1) / segments;

    for (let i = 1; i < segments; i++) {
      const px = x1 + dx * i + (Math.random() * jitter * 2 - jitter);
      const py = y1 + dy * i + (Math.random() * jitter * 0.6 - jitter * 0.3);
      points.push({ x: px, y: py });
    }
    points.push({ x: x2, y: y2 });
    return points;
  }

  update(dt) {
    // 1. Update birds
    if (this.weather === 'birds' || this.weather === 'birds_sunset') {
      for (const b of this.birds) {
        b.x += b.speed * dt;
        b.wingPhase += b.wingSpeed * dt;
        if (b.x > this.width + 40) {
          b.x = -40;
          b.y = 50 + Math.random() * 220;
        }
      }
    }

    // 2. Update rain & storm
    if (this.weather === 'rain' || this.weather === 'storm') {
      const dropCount = this.weather === 'storm' ? this.rainDrops.length : 45;
      for (let i = 0; i < dropCount; i++) {
        const d = this.rainDrops[i];
        d.y += d.speed * dt;
        d.x += d.vx * dt;
        if (d.y > this.height) {
          d.y = -20;
          d.x = Math.random() * (this.width + 120) - 20;
        }
      }

      // Lightning storm flashes
      if (this.weather === 'storm') {
        this.lightningTimer -= dt;
        if (this.lightningTimer <= 0) {
          this._triggerLightningStrike();
          this.lightningTimer = 3.2 + Math.random() * 3.6;
        }
        if (this.lightningFlash > 0) {
          this.lightningFlash -= dt * 2.6;
          this.strobeTimer -= dt;
          if (this.lightningFlash <= 0) {
            this.lightningFlash = 0;
            this.lightningBolts = [];
          }
        }
      }
    }

    // 3. Update clouds
    if (this.weather === 'clouds' || this.weather === 'rain' || this.weather === 'storm') {
      for (const c of this.clouds) {
        c.x -= c.speed * dt;
        if (c.x + c.w < -20) {
          c.x = this.width + 30;
          c.y = 40 + Math.random() * 220;
        }
      }
    }

    // 4. Update stars
    if (this.weather === 'stars') {
      for (const s of this.stars) {
        s.x -= s.speed * dt;
        s.twinkle += dt * 4;
        if (s.x < 0) {
          s.x = this.width;
          s.y = Math.random() * (this.height - 100);
        }
      }
    }

    // 5. Sun Rays
    if (this.weather === 'sun') {
      this.sunRaysPhase += dt * 0.8;
    }
  }

  draw(ctx) {
    ctx.save();

    // 1. Sky Gradient Background
    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    skyGrad.addColorStop(0, this.targetSkyTop);
    skyGrad.addColorStop(1, this.targetSkyBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Weather: Sun & Sun Rays (Trời Nắng)
    if (this.weather === 'sun') {
      ctx.save();
      const sunX = this.width * 0.78;
      const sunY = 90;
      // Glowing Sun Core
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 80);
      sunGlow.addColorStop(0, 'rgba(255, 240, 160, 0.95)');
      sunGlow.addColorStop(0.3, 'rgba(255, 209, 59, 0.55)');
      sunGlow.addColorStop(1, 'rgba(255, 209, 59, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 80, 0, Math.PI * 2);
      ctx.fill();

      // Sun disc
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. Weather: Clouds (Mây âm u / Mưa / Giông bão với viền sáng điện ảnh)
    if (this.weather === 'clouds' || this.weather === 'rain' || this.weather === 'storm') {
      ctx.save();
      const isStorm = this.weather === 'storm';
      const flash = isStorm ? this.lightningFlash : 0;

      for (const c of this.clouds) {
        if (isStorm && flash > 0.05) {
          // Hiệu ứng viền mây phát sáng bạc - xanh khi có sét rạch trời
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 24 * flash;
          ctx.fillStyle = `rgba(${Math.floor(120 + 135 * flash)}, ${Math.floor(140 + 115 * flash)}, 255, ${0.75 + 0.25 * flash})`;
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = isStorm ? 'rgba(22, 16, 40, 0.78)' : 'rgba(180, 195, 215, 0.35)';
        }
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, c.w * 0.5, c.h * 0.5, 0, 0, Math.PI * 2);
        ctx.ellipse(c.x + c.w * 0.25, c.y - 6, c.w * 0.35, c.h * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 4. Weather: Birds (Đàn chim én vỗ cánh bay)
    if (this.weather === 'birds' || this.weather === 'birds_sunset') {
      ctx.save();
      ctx.fillStyle = this.weather === 'birds_sunset' ? '#26042b' : '#2b1b36';
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 1.8;
      for (const b of this.birds) {
        const wingY = Math.sin(b.wingPhase) * (b.size * 1.2);
        ctx.beginPath();
        ctx.moveTo(b.x - b.size * 2, b.y + wingY);
        ctx.quadraticCurveTo(b.x - b.size, b.y, b.x, b.y + b.size * 0.6);
        ctx.quadraticCurveTo(b.x + b.size, b.y, b.x + b.size * 2, b.y + wingY);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 5. Weather: Stars (Đêm vô tận)
    if (this.weather === 'stars') {
      ctx.save();
      for (const s of this.stars) {
        const alpha = 0.4 + 0.6 * Math.sin(s.twinkle);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
      }
      ctx.restore();
    }

    // 6. Weather: Rain (Hạt mưa xiên sắc nét bắt sáng khi chớp giật)
    if (this.weather === 'rain' || this.weather === 'storm') {
      ctx.save();
      const isStorm = this.weather === 'storm';
      const flash = isStorm ? this.lightningFlash : 0;
      if (flash > 0.08) {
        // Hạt mưa phát sáng ánh kim bạc trong chớp sét
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.45 + 0.55 * flash})`;
        ctx.lineWidth = 2.2;
      } else {
        ctx.strokeStyle = isStorm ? 'rgba(200, 225, 255, 0.65)' : 'rgba(160, 210, 255, 0.45)';
        ctx.lineWidth = isStorm ? 1.6 : 1.2;
      }

      const dropCount = isStorm ? this.rainDrops.length : 45;
      for (let i = 0; i < dropCount; i++) {
        const d = this.rainDrops[i];
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + (d.vx / d.speed) * d.len, d.y + d.len);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 7. Cinematic Lightning Discharges & Volumetric Bloom (Hiệu ứng ánh sáng điện ảnh tia sét)
    if (this.weather === 'storm' && this.lightningFlash > 0.02) {
      ctx.save();
      const flicker = Math.sin(this.strobeTimer * 36) > -0.2 ? 1 : 0.45;
      const alpha = Math.min(1.0, this.lightningFlash * flicker);

      // Quầng sáng thể tích (Volumetric Radial Bloom) tỏa ra từ tâm điểm phóng sét
      const bloom = ctx.createRadialGradient(this.strikeX, 10, 10, this.strikeX, 110, 390);
      bloom.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.90})`);
      bloom.addColorStop(0.35, `rgba(180, 230, 255, ${alpha * 0.55})`);
      bloom.addColorStop(0.70, `rgba(140, 110, 255, ${alpha * 0.22})`);
      bloom.addColorStop(1, 'rgba(15, 10, 30, 0)');
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, this.width, this.height);

      // Vẽ tia sét nhánh ngoằn ngoèo chân thực với ánh sáng kép (Dual-layer Glow)
      if (this.lightningBolts && this.lightningBolts.length > 0) {
        for (const bolt of this.lightningBolts) {
          if (bolt.length < 2) continue;

          // Lớp 1: Vầng sáng ion hóa màu Cyan điện tích (Outer Aura)
          ctx.save();
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.8})`;
          ctx.lineWidth = 6.0;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'miter';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.moveTo(bolt[0].x, bolt[0].y);
          for (let i = 1; i < bolt.length; i++) {
            ctx.lineTo(bolt[i].x, bolt[i].y);
          }
          ctx.stroke();
          ctx.restore();

          // Lớp 2: Lõi hồ quang điện trắng nung sáng (Inner Pure White Core)
          ctx.save();
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.98})`;
          ctx.lineWidth = 2.4;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'miter';
          ctx.beginPath();
          ctx.moveTo(bolt[0].x, bolt[0].y);
          for (let i = 1; i < bolt.length; i++) {
            ctx.lineTo(bolt[i].x, bolt[i].y);
          }
          ctx.stroke();
          ctx.restore();
        }
      }
      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Cinematic Post-Processing Overlay
   * Viền đen điện ảnh (Vignette) & chớp giật ánh sáng toàn khung cảnh
   */
  drawOverlay(ctx) {
    if (this.weather !== 'storm') return;

    ctx.save();
    // 1. Cinematic Film Vignette (Góc tối điện ảnh tăng tương phản kịch tính)
    const vig = ctx.createRadialGradient(
      this.width * 0.5, this.height * 0.5, this.width * 0.35,
      this.width * 0.5, this.height * 0.5, this.width * 0.90
    );
    vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vig.addColorStop(1, 'rgba(5, 2, 12, 0.44)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Chớp lóe rực sáng toàn màn hình điện ảnh (Screen Illumination Flash)
    if (this.lightningFlash > 0.02) {
      const flicker = Math.sin(this.strobeTimer * 36) > -0.2 ? 1 : 0.45;
      const flashAlpha = Math.min(0.65, this.lightningFlash * 0.55 * flicker);
      ctx.fillStyle = `rgba(230, 245, 255, ${flashAlpha})`;
      ctx.fillRect(0, 0, this.width, this.height);
    }
    ctx.restore();
  }
}
