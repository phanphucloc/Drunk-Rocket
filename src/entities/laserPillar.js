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
    this.quantumPhased = false;
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
   * Check Near-Miss: Rocket passes very close (<16px margin) to top or bottom hazard
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
   * Check if rocket has COMPLETELY passed through the pillar including the tail
   * Rocket nose is at x + radius, tail is at x - radius - 14 (nozzle/flame edge)
   */
  hasPassedCompletely(rocket) {
    const tailX = rocket.x - (rocket.radius + 14);
    return tailX > (this.x + this.width);
  }

  /**
   * Collision check against rocket
   */
  collidesWith(rocket) {
    if (this.isDestroyed || this.quantumPhased) return false;

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

      // STRICT SCORING: Rocket must clear COMPLETELY past the column including its tail
      if (!p.passed && p.hasPassedCompletely(rocket)) {
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
        return p;
      }
    }
    return null;
  }

  destroyFrontPillar(rocketX) {
    return this.destroyFrontPillars(rocketX, 1)[0] || null;
  }

  destroyFrontPillars(rocketX, count = 1) {
    const destroyed = [];
    let candidates = this.pillars
      .filter(p => !p.isDestroyed && p.x + p.width > rocketX - 25)
      .sort((a, b) => a.x - b.x);

    // Neu so luong cot hien co truoc mat it hon count (vi du can pha 2 cot):
    // Tu dong spawn them cot de dam bao co du cot de nguoi choi nhin thay va pha huy
    while (candidates.length < count) {
      let nextX;
      let nextGapY;

      if (candidates.length === 0) {
        nextX = Math.max(rocketX + 110, 200);
        nextGapY = this.minGapY + Math.random() * (this.maxGapY - this.minGapY);
      } else {
        const prevPillar = candidates[candidates.length - 1];
        // Neu cot truoc o gan (< 220), dat cot 2 o khoang 320px
        // Neu cot truoc o xa, dat cot 2 cach cot 1 khoang 140px
        nextX = Math.max(prevPillar.x + 120, prevPillar.x < 220 ? 320 : prevPillar.x + 140);
        nextGapY = Math.min(this.maxGapY, Math.max(this.minGapY, prevPillar.gapY + (Math.random() - 0.5) * 60));
      }

      const newPillar = new LaserPillar(nextX, nextGapY, this.gapHeight);
      this.pillars.push(newPillar);
      candidates.push(newPillar);
      candidates.sort((a, b) => a.x - b.x);
    }

    // Pha huy chinh xac count cot theo thu tu tu gan den xa
    for (let i = 0; i < count; i++) {
      const p = candidates[i];
      p.isDestroyed = true;
      p.passed = true;
      destroyed.push(p);
    }

    // Gian cach thoi gian xuat hien cua cot ke tiep de nguoi choi an toan sau khi smash
    this.spawnTimer = this.spawnInterval + (count >= 2 ? 0.9 : 0.4);

    return destroyed;
  }
}