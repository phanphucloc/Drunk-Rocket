import { PhysicsEngine } from '../core/physics.js';

export class LaserPillar {
  constructor(x, gapY, gapHeight, width = 52) {
    this.x = x;
    this.gapY = gapY;
    this.gapHeight = gapHeight;
    this.width = width;
    this.passed = false;
    this.emitterHeight = 24;
    this.pulsePhase = Math.random() * Math.PI * 2;
  }

  get topY() {
    return this.gapY - this.gapHeight / 2;
  }

  get bottomY() {
    return this.gapY + this.gapHeight / 2;
  }

  update(dt, speed) {
    this.x -= speed * dt;
    this.pulsePhase += dt * 8;
  }

  isOffscreen() {
    return this.x + this.width < -50;
  }

  /**
   * Collision check against rocket
   */
  collidesWith(rocket) {
    // 1. Top pillar (from y=0 to this.topY)
    if (PhysicsEngine.checkCircleAABB(
      rocket.x, rocket.y, rocket.radius,
      this.x, 0, this.width, this.topY
    )) {
      return true;
    }

    // 2. Bottom pillar (from y=this.bottomY to 2000)
    if (PhysicsEngine.checkCircleAABB(
      rocket.x, rocket.y, rocket.radius,
      this.x, this.bottomY, this.width, 2000
    )) {
      return true;
    }

    return false;
  }
}

export class LaserPillarManager {
  constructor(gameWidth = 400, gameHeight = 700) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.pillars = [];
    this.speed = 190;           // Horizontal scroll speed (px/s)
    this.spawnInterval = 1.85;  // Seconds between spawns
    this.spawnTimer = 0;
    this.minGapY = 160;
    this.maxGapY = 520;
    this.gapHeight = 145;       // Height of safe corridor
  }

  reset() {
    this.pillars = [];
    this.spawnTimer = 0.5; // Quick first obstacle
  }

  update(dt, rocket, onScore) {
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawn();
      this.spawnTimer = this.spawnInterval;
    }

    for (let i = this.pillars.length - 1; i >= 0; i--) {
      const p = this.pillars[i];
      p.update(dt, this.speed);

      // Score detection
      if (!p.passed && p.x + p.width / 2 < rocket.x) {
        p.passed = true;
        if (onScore) onScore();
      }

      // Cleanup offscreen
      if (p.isOffscreen()) {
        this.pillars.splice(i, 1);
      }
    }
  }

  spawn() {
    // Generate randomized gap position with slight safety margin
    const gapY = this.minGapY + Math.random() * (this.maxGapY - this.minGapY);
    const pillar = new LaserPillar(this.gameWidth + 30, gapY, this.gapHeight);
    this.pillars.push(pillar);
  }

  checkCollision(rocket) {
    for (const p of this.pillars) {
      if (p.collidesWith(rocket)) {
        return true;
      }
    }
    return false;
  }
}
