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

  /**
   * Spawns exhaust puff particles behind rocket nozzle
   * @param {number} x - Rocket X position
   * @param {number} y - Rocket Y position
   * @param {number} angle - Rocket angle in radians
   * @param {number} count - Number of puffs to spawn
   */
  emitThrust(x, y, angle, count = 4) {
    const colors = ['#00f0ff', '#ffffff', '#ffd13b', '#ff3b5c'];

    for (let i = 0; i < count; i++) {
      const spread = (Math.random() - 0.5) * 0.45;
      const speed = 120 + Math.random() * 90;
      // Emit backward opposite to rocket facing angle
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
   * @param {number} x - Crash center X
   * @param {number} y - Crash center Y
   * @param {number} count - Particle count
   */
  emitExplosion(x, y, count = 28) {
    const colors = ['#ffd13b', '#ff3b5c', '#00f0ff', '#ffffff', '#d69e00'];

    // 1. Shrapnel & sparks
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 70 + Math.random() * 260;
      this.particles.push({
        type: 'debris',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.floor(Math.random() * 4),
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0.7 + Math.random() * 0.6,
        maxLife: 1.3,
        gravity: 580
      });
    }

    // 2. Shockwave expanding energy ring
    this.shockwaves.push({
      x,
      y,
      radius: 6,
      maxRadius: 65,
      speed: 280,
      color: '#ff3b5c',
      life: 0.25,
      maxLife: 0.25
    });

    // 3. Screen shake trigger
    this.shakeIntensity = 8;
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
        gravity: -50 // Float upward gently
      });
    }
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

      // Draw chunky pixel block
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
