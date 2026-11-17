import { PhysicsEngine } from '../core/physics.js';
import { getThemeForScore, getTierFromScore } from '../graphics/themes.js';

export class LaserPillar {
  constructor(x, gapY, gapHeight, width = 52, options = {}) {
    this.x = x;
    this.baseGapY = gapY;
    this.gapY = gapY;
    this.gapHeight = gapHeight;
    this.width = width;
    this.passed = false;
    this.nearMissChecked = false;
    this.isDestroyed = false;
    this.quantumPhased = false;
    this.emitterHeight = 24;
    this.pulsePhase = Math.random() * Math.PI * 2;

    // Visual theme
    this.theme = options.theme || null;
    this.tier = options.tier || 1;

    // Dynamic difficulty movement (oscillating gapY & tilted/swaying angle)
    this.oscAmp = options.oscAmp || 0;
    this.oscFreq = options.oscFreq || 0;
    this.oscPhase = options.oscPhase !== undefined ? options.oscPhase : Math.random() * Math.PI * 2;

    this.baseAngle = options.baseAngle || 0;
    this.angleAmp = options.angleAmp || 0;
    this.angleFreq = options.angleFreq || 0;
    this.anglePhase = options.anglePhase !== undefined ? options.anglePhase : Math.random() * Math.PI * 2;
    this.angle = this.baseAngle;
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

    // Vertical bobbing oscillation
    if (this.oscAmp > 0) {
      this.oscPhase += dt * this.oscFreq;
      const targetY = this.baseGapY + Math.sin(this.oscPhase) * this.oscAmp;
      this.gapY = Math.max(130 + this.gapHeight / 2, Math.min(570 - this.gapHeight / 2, targetY));
    }

    // Tilted angular oscillation / sway (leaning left <-> right)
    if (this.angleAmp > 0) {
      this.anglePhase += dt * this.angleFreq;
      this.angle = this.baseAngle + Math.sin(this.anglePhase) * this.angleAmp;
    } else {
      this.angle = this.baseAngle;
    }
  }

  isOffscreen() {
    return this.x + this.width < -70;
  }

  /**
   * Check Near-Miss: Rocket passes very close (<16px margin) to top or bottom hazard
   * Coordinates are transformed into local unrotated pillar space for exact detection.
   */
  checkNearMiss(rocket) {
    if (this.isDestroyed || this.nearMissChecked) return false;

    const cx = this.x + this.width / 2;
    const cy = this.gapY;
    let rx = rocket.x;
    let ry = rocket.y;

    if (this.angle !== 0) {
      const cos = Math.cos(-this.angle);
      const sin = Math.sin(-this.angle);
      const dx = rocket.x - cx;
      const dy = rocket.y - cy;
      rx = cx + (dx * cos - dy * sin);
      ry = cy + (dx * sin + dy * cos);
    }

    // Check when rocket is horizontally passing through the pillar
    const inXRange = rx >= this.x - 10 && rx <= this.x + this.width + 10;
    if (inXRange) {
      const distToTop = (ry - rocket.radius) - this.topY;
      const distToBottom = this.bottomY - (ry + rocket.radius);

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
    const halfW = this.width / 2;
    const cx = this.x + halfW;
    const maxRightX = cx + halfW + Math.abs(Math.sin(this.angle || 0)) * 60;
    return tailX > maxRightX;
  }

  /**
   * Collision check against rocket (Pixel-perfect transformed AABB detection).
   */
  collidesWith(rocket) {
    if (this.isDestroyed || this.quantumPhased) return false;

    const cx = this.x + this.width / 2;
    const cy = this.gapY;
    let rx = rocket.x;
    let ry = rocket.y;

    if (this.angle !== 0) {
      const cos = Math.cos(-this.angle);
      const sin = Math.sin(-this.angle);
      const dx = rocket.x - cx;
      const dy = rocket.y - cy;
      rx = cx + (dx * cos - dy * sin);
      ry = cy + (dx * sin + dy * cos);
    }

    // 1. Top pillar (from ceiling above y=0 down to this.topY)
    if (PhysicsEngine.checkCircleAABB(
      rx, ry, rocket.radius,
      this.x, -600, this.width, this.topY + 600
    )) {
      return true;
    }

    // 2. Bottom pillar (from y=this.bottomY down past screen bottom)
    if (PhysicsEngine.checkCircleAABB(
      rx, ry, rocket.radius,
      this.x, this.bottomY, this.width, 1600
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
    this.baseSpeed = 190;
    this.speed = 190;           // Horizontal scroll speed (px/s)
    this.spawnInterval = 1.85;  // Seconds between spawns
    this.spawnTimer = 0;
    this.minGapY = 160;
    this.maxGapY = 520;
    this.gapHeight = 145;       // Height of safe corridor
    this.currentScore = 0;
  }

  reset() {
    this.pillars = [];
    this.speed = this.baseSpeed;
    this.spawnTimer = 0.5; // Quick first obstacle
    this.currentScore = 0;
  }

  update(dt, rocket, onScore, onNearMiss, score = 0) {
    this.currentScore = score;
    // Graceful slight horizontal speed scaling: +3 px/s every 5 points, capped at +24 px/s
    this.speed = this.baseSpeed + Math.min(Math.floor(score / 5) * 3, 24);

    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawn(score);
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

  /**
   * Spawns a pillar with progressive difficulty tiers and theme colors:
   * - Tier 1 (Score 0 - 5): Cột thẳng đứng cố định
   * - Tier 2 (Score 6 - 11): Cột di chuyển dập dềnh lên xuống
   * - Tier 3 (Score 12 - 18): Cột nghiêng góc cố định
   * - Tier 4 (Score 19 - 26): Cột nghiêng góc VÀ di chuyển lên xuống
   * - Tier 5 (Score 27 - 35): Cột nghiêng trái rồi nghiêng phải liên tục
   * - Tier 6 (Score 36+): Cột vừa nghiêng trái phải VỪA di chuyển lên xuống
   */
  spawn(score = 0) {
    const gapY = this.minGapY + Math.random() * (this.maxGapY - this.minGapY);
    const tier = getTierFromScore(score);
    const theme = getThemeForScore(score);

    let oscAmp = 0;
    let oscFreq = 0;
    let baseAngle = 0;
    let angleAmp = 0;
    let angleFreq = 0;
    let gapH = this.gapHeight;

    if (tier === 6) {
      // Tier 6: Vừa lắc lư nghiêng trái phải VỪA di chuyển lên xuống
      angleAmp = 0.09 + Math.random() * 0.04; // ±5.2° đến ±7.5°
      angleFreq = 1.5 + Math.random() * 0.4;  // Tần số lắc mượt mà ~3.5s/chu kỳ
      baseAngle = 0;
      oscAmp = 26 + Math.random() * 14;      // 26px đến 40px
      oscFreq = 1.2 + Math.random() * 0.5;   // 1.2 đến 1.7 rad/s
      gapH = 150; // Corridor 150px đảm bảo fair-play và lách được
    } else if (tier === 5) {
      // Tier 5: Các cột nghiêng trái rồi nghiêng phải liên tục (Swaying pendulum)
      angleAmp = 0.10 + Math.random() * 0.04; // ±5.8° đến ±8.0°
      angleFreq = 1.6 + Math.random() * 0.4;
      baseAngle = 0;
      gapH = 146;
    } else if (tier === 4) {
      // Tier 4: Nghiêng góc cố định + Dập dềnh lên xuống
      baseAngle = (Math.random() < 0.5 ? -1 : 1) * (0.06 + Math.random() * 0.04);
      oscAmp = 26 + Math.random() * 16;
      oscFreq = 1.3 + Math.random() * 0.6;
      gapH = 146;
    } else if (tier === 3) {
      // Tier 3: Nghiêng góc cố định
      baseAngle = (Math.random() < 0.5 ? -1 : 1) * (0.07 + Math.random() * 0.05); // ±4° đến ±7°
    } else if (tier === 2) {
      // Tier 2: Dập dềnh lên xuống
      oscAmp = 32 + Math.random() * 16;   // 32px đến 48px
      oscFreq = 1.4 + Math.random() * 0.6; // 1.4 đến 2.0 rad/s
    }

    const pillar = new LaserPillar(this.gameWidth + 30, gapY, gapH, 52, {
      oscAmp,
      oscFreq,
      baseAngle,
      angleAmp,
      angleFreq,
      theme,
      tier
    });

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

    const theme = getThemeForScore(this.currentScore);
    const tier = getTierFromScore(this.currentScore);

    // If fewer pillars available in front, spawn them dynamically so player sees and smashes them
    while (candidates.length < count) {
      let nextX;
      let nextGapY;

      if (candidates.length === 0) {
        nextX = Math.max(rocketX + 110, 200);
        nextGapY = this.minGapY + Math.random() * (this.maxGapY - this.minGapY);
      } else {
        const prevPillar = candidates[candidates.length - 1];
        nextX = Math.max(prevPillar.x + 120, prevPillar.x < 220 ? 320 : prevPillar.x + 140);
        nextGapY = Math.min(this.maxGapY, Math.max(this.minGapY, prevPillar.gapY + (Math.random() - 0.5) * 60));
      }

      const newPillar = new LaserPillar(nextX, nextGapY, this.gapHeight, 52, { theme, tier });
      this.pillars.push(newPillar);
      candidates.push(newPillar);
      candidates.sort((a, b) => a.x - b.x);
    }

    // Destroy target pillars in order from nearest to furthest
    for (let i = 0; i < count; i++) {
      const p = candidates[i];
      p.isDestroyed = true;
      p.passed = true;
      destroyed.push(p);
    }

    // Give safe recovery window after smash
    this.spawnTimer = this.spawnInterval + (count >= 2 ? 0.9 : 0.4);

    return destroyed;
  }
}
