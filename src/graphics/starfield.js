/**
 * Dynamic Sky & Weather Background System for Drunk Rocket 2.5
 * Supports 7 Living Atmospheres:
 * - Bình Minh & Hoàng Hôn: Gradient trời hửng sáng/chiều tà, đàn chim én pixel vỗ cánh bay qua
 * - Trời Nắng: Nắng vàng tỏa hào quang, bụi nắng lơ lửng
 * - Âm U: Mây xám trôi tầng tầng lớp lớp
 * - Trời Mưa: Hạt mưa rơi xiên, sóng gợn đáy sàn
 * - Mưa Giông: Mưa xối xả, chớp giật lóe sáng toàn màn hình
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
    this.lightningFlash = 0;
    this.lightningTimer = 0;

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
    for (let i = 0; i < 75; i++) {
      this.rainDrops.push({
        x: Math.random() * (this.width + 100) - 50,
        y: Math.random() * this.height,
        len: 12 + Math.random() * 14,
        speed: 480 + Math.random() * 260,
        vx: -90 - Math.random() * 60
      });
    }

    // 3. Clouds (Mây âm u)
    this.clouds = [];
    for (let i = 0; i < 6; i++) {
      this.clouds.push({
        x: Math.random() * this.width,
        y: 40 + i * 55 + Math.random() * 25,
        w: 90 + Math.random() * 80,
        h: 24 + Math.random() * 16,
        speed: 15 + Math.random() * 15,
        alpha: 0.25 + Math.random() * 0.2
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
      const dropCount = this.weather === 'storm' ? this.rainDrops.length : 40;
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
          this.lightningFlash = 0.85; // Bùng sáng chớp trắng
          this.lightningTimer = 3.5 + Math.random() * 4.5;
        }
        if (this.lightningFlash > 0) {
          this.lightningFlash -= dt * 4.0;
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

    // 3. Weather: Clouds (Mây âm u / Mưa)
    if (this.weather === 'clouds' || this.weather === 'rain' || this.weather === 'storm') {
      ctx.save();
      for (const c of this.clouds) {
        ctx.fillStyle = this.weather === 'storm' ? 'rgba(28, 22, 48, 0.65)' : 'rgba(180, 195, 215, 0.35)';
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
        // V-shape flying bird silhouette
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

    // 6. Weather: Rain (Hạt mưa xiên)
    if (this.weather === 'rain' || this.weather === 'storm') {
      ctx.save();
      ctx.strokeStyle = this.weather === 'storm' ? 'rgba(200, 225, 255, 0.65)' : 'rgba(160, 210, 255, 0.45)';
      ctx.lineWidth = this.weather === 'storm' ? 1.6 : 1.2;
      const dropCount = this.weather === 'storm' ? this.rainDrops.length : 40;
      for (let i = 0; i < dropCount; i++) {
        const d = this.rainDrops[i];
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + (d.vx / d.speed) * d.len, d.y + d.len);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 7. Lightning Flash (Chớp giật trời giông)
    if (this.lightningFlash > 0.02) {
      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.85, this.lightningFlash)})`;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.restore();
    }

    ctx.restore();
  }
}
