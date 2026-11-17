import { PhysicsEngine } from '../core/physics.js';

export class LaserPillar {
  constructor(x, gapY, gapHeight, width = 52) {
    this.x = x;
    this.gapY = gapY;
    this.gapHeight = gapHeight;
    this.width = width;
    this.passed = false;
    this.nearMissChecked = false;
    this.isDestroyed = false;
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
   * Check Near-Miss: Rocket passes very close (<12px margin) to top or bottom hazard
   */
  checkNearMiss(rocket) {
    if (this.isDestroyed || this.nearMissChecked) return false;

    // Check when rocket is horizontally passing through the pillar
    const inXRange = rocket.x >= this.x - 10 && rocket.x <= this.x + this.width + 10;
    if (inXRange) {
      const distToTop = (rocket.y - rocket.radius) - this.topY;
      const distToBottom = this.bottomY - (rocket.y + rocket.radius);

      // Within close proximity but without colliding
      const nearMargin = 16;
      if ((distToTop > 0 && distToTop <= nearMargin) || (distToBottom > 0 && distToBottom <= nearMargin)) {
        this.nearMissChecked = true;
        return true;
      }
    }
    return false;
  }

  /**
   * Collision check against rocket
   */
  collidesWith(rocket) {
    if (this.isDestroyed) return false;

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

  update(dt, rocket, onScore, onNearMiss) {
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawn();
      this.spawnTimer = this.spawnInterval;
    }

    for (let i = this.pillars.length - 1; i >= 0; i--) {
      const p = this.pillars[i];
      p.update(dt, this.speed);

      // Near-Miss check
      if (!p.nearMissChecked && p.checkNearMiss(rocket)) {
        if (onNearMiss) onNearMiss(p);
      }

      // Normal score check
      if (!p.passed && p.x + p.width / 2 < rocket.x) {
        p.passed = true;
        if (onScore) onScore(p);
      }

      // Cleanup offscreen
      if (p.isOffscreen()) {
        this.pillars.splice(i, 1);
      }
    }
  }

  spawn() {
    const gapY = this.minGapY + Math.random() * (this.maxGapY - this.minGapY);
    const pillar = new LaserPillar(this.gameWidth + 30, gapY, this.gapHeight);
    this.pillars.push(pillar);
  }

  checkCollision(rocket) {
    for (const p of this.pillars) {
      if (p.collidesWith(rocket)) {
        return p; // Return collided pillar
      }
    }
    return null;
  }

  destroyFrontPillar(rocketX) {
    // Find closest pillar ahead of rocket to smash
    for (const p of this.pillars) {
      if (!p.isDestroyed && p.x + p.width > rocketX - 20) {
        p.isDestroyed = true;
        return p;
      }
    }
    return null;
  }
}