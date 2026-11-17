/**
 * Particle System for Engine Smoke, Plasma Thrust, Explosion Debris & Score Sparkles
 * Cyber Neon Arcade Visual Effects
 */
export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.shockwaves = [];
    this.shakeIntensity = 0;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
  }

  reset() {
    this.particles = [];
    this.shockwaves = [];
    this.shakeIntensity = 0;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
  }

  addShockwave(x, y, color = '#ff3b5c', maxRadius = 65, speed = 280) {
    this.shockwaves.push({
      x: typeof x === 'number' && !isNaN(x) ? x : 200,
      y: typeof y === 'number' && !isNaN(y) ? y : 350,
      radius: 6,
      maxRadius,
      speed,
      color,
      life: 0.35,
      maxLife: 0.35
    });
  }

  triggerScreenShake(intensity = 8) {
    this.shakeIntensity = intensity;
  }

  /**
   * Spawns exhaust puff particles behind rocket nozzle
   */
  emitThrust(x, y, angle, count = 4) {
    const colors = ['#00f0ff', '#ffffff', '#ffd13b', '#ff3b5c'];

    for (let i = 0; i < count; i++) {
      const spread = (Math.random() - 0.5) * 0.45;
      const speed = 120 + Math.random() * 90;
      const vx = -Math.cos(angle + spread) * speed;
      const vy = -Math.sin(angle + spread) * speed;

      const nozzleOffset = 18;
      this.particles.push({
        type: 'thrust',
        x: x - Math.cos(angle) * nozzleOffset,
        y: y - Math.sin(angle) * nozzleOffset,
        vx,
        vy,
        size: 3 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0.28 + Math.random() * 0.18,
        maxLife: 0.45,
        gravity: 120
      });
    }
  }

  /**
   * Spawns explosive debris and shockwave ring when rocket crashes
   */
  emitExplosion(x, y, count = 28) {
    const safeX = typeof x === 'number' && !isNaN(x) ? x : 100;
    const safeY = typeof y === 'number' && !isNaN(y) ? y : 350;

    const colors = ['#ffd13b', '#ff3b5c', '#00f0ff', '#ffffff', '#d69e00'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 70 + Math.random() * 260;
      this.particles.push({
        type: 'debris',
        x: safeX,
        y: safeY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.floor(Math.random() * 4),
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0.7 + Math.random() * 0.6,
        maxLife: 1.3,
        gravity: 580
      });
    }

    this.addShockwave(safeX, safeY, '#ff3b5c', 65, 280);
    this.triggerScreenShake(8);
  }

  /**
   * Spawns golden celebration sparkles when passing a pillar / scoring
   */
  emitScoreSparkles(x, y, count = 10) {
    const colors = ['#05ffa1', '#ffd13b', '#ffffff'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 90;
      this.particles.push({
        type: 'sparkle',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0.4 + Math.random() * 0.3,
        maxLife: 0.7,
        gravity: -50
      });
    }
  }

  /**
   * Spawns electric sparks for Near-Miss close shave
   */
  emitNearMiss(x, y) {
    const colors = ['#00f0ff', '#ffffff', '#05ffa1'];
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 140 + Math.random() * 120;
      this.particles.push({
        type: 'nearmiss',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.5 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0.35 + Math.random() * 0.2,
        maxLife: 0.55,
        gravity: 0
      });
    }
    this.addShockwave(x, y, '#00f0ff', 45, 220);
  }

  /**
   * Spawns massive debris explosion when a laser pillar is smashed or shield bursts
   */
  emitPillarSmash(x, y) {
    const safeX = typeof x === 'number' && !isNaN(x) ? x : 200;
    const safeY = typeof y === 'number' && !isNaN(y) ? y : 350;

    const colors = ['#ff3b5c', '#ffd13b', '#ffffff', '#00f0ff'];
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 150 + Math.random() * 280;
      this.particles.push({
        type: 'smash',
        x: safeX + (Math.random() - 0.5) * 40,
        y: safeY + (Math.random() - 0.5) * 80,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0.5 + Math.random() * 0.35,
        maxLife: 0.85,
        gravity: 300
      });
    }
    this.addShockwave(safeX, safeY, '#ff3b5c', 85, 300);
    this.triggerScreenShake(8);
  }

  update(dt) {
    // Screen shake decay
    if (this.shakeIntensity > 0) {
      this.shakeOffsetX = (Math.random() - 0.5) * this.shakeIntensity * 2;
      this.shakeOffsetY = (Math.random() - 0.5) * this.shakeIntensity * 2;
      this.shakeIntensity -= dt * 25;
      if (this.shakeIntensity <= 0) {
        this.shakeIntensity = 0;
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
      }
    }

    // Update shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const s = this.shockwaves[i];
      s.life -= dt;
      s.radius += s.speed * dt;
      if (s.life <= 0 || s.radius >= s.maxRadius) {
        this.shockwaves.splice(i, 1);
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  }

  draw(ctx) {
    ctx.save();

    // 1. Draw Shockwave Rings
    for (const s of this.shockwaves) {
      const alpha = Math.max(0, s.life / s.maxLife);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 2. Draw Particles
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;

      const renderSize = Math.max(1, p.size * (p.life / p.maxLife));
      ctx.fillRect(
        Math.floor(p.x - renderSize / 2),
        Math.floor(p.y - renderSize / 2),
        Math.ceil(renderSize),
        Math.ceil(renderSize)
      );
    }

    ctx.restore();
  }
}
