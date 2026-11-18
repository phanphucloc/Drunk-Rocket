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
    this.gapHeight = 148;       // Generous height of safe corridor
    this.currentScore = 0;
    this.lastPillarGapY = 350;  // Anchor to smooth out consecutive height delta
  }

  reset() {
    this.pillars = [];
    this.speed = this.baseSpeed;
    this.spawnTimer = 0.5; // Quick first obstacle
    this.currentScore = 0;
    this.lastPillarGapY = 350;
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
   * Spawns a pillar with:
   * 1. Fair Smooth Height Progression (Giảm độ lệch quá xa giữa 2 cột liên tiếp):
   *    - Tier 1-2: maxDeltaY = 90px (dễ chịu, người chơi làm quen nhịp)
   *    - Tier 3-4: maxDeltaY = 135px (thử thách nhưng hoàn toàn lách được)
   *    - Tier 5-7: maxDeltaY = 175px (cao độ vừa vặn với độ dốc nhảy của tàu)
   * 2. Progressive Movement Tiers
   */
  spawn(score = 0) {
    const tier = getTierFromScore(score);
    const theme = getThemeForScore(score);

    // Calculate maximum allowable vertical shift from previous column
    let maxDeltaY = 90;
    if (tier >= 5) {
      maxDeltaY = 175;
    } else if (tier >= 3) {
      maxDeltaY = 135;
    }

    const rawDelta = (Math.random() * 2 - 1) * maxDeltaY;
    let gapY = this.lastPillarGapY + rawDelta;
    // Keep safely inside screen bounds
    gapY = Math.max(this.minGapY, Math.min(this.maxGapY, gapY));
    this.lastPillarGapY = gapY;

    let oscAmp = 0;
    let oscFreq = 0;
    let baseAngle = 0;
    let angleAmp = 0;
    let angleFreq = 0;
    let gapH = this.gapHeight;

    if (tier >= 6) {
      // Tier 6-7: Vừa nghiêng lắc trái phải VỪA di chuyển dập dềnh
      angleAmp = 0.08 + Math.random() * 0.03; // ±4.5° đến ±6.5°
      angleFreq = 1.4 + Math.random() * 0.4;
      baseAngle = 0;
      oscAmp = 22 + Math.random() * 12;      // 22px đến 34px
      oscFreq = 1.2 + Math.random() * 0.4;
      gapH = 152;
    } else if (tier === 5) {
      // Tier 5: Nghiêng lắc trái rồi nghiêng phải (Swaying pendulum)
      angleAmp = 0.09 + Math.random() * 0.03; // ±5.2° đến ±7.0°
      angleFreq = 1.5 + Math.random() * 0.4;
      baseAngle = 0;
      gapH = 148;
    } else if (tier === 4) {
      // Tier 4: Nghiêng góc cố định + Dập dềnh nhẹ
      baseAngle = (Math.random() < 0.5 ? -1 : 1) * (0.05 + Math.random() * 0.03);
      oscAmp = 24 + Math.random() * 14;
      oscFreq = 1.2 + Math.random() * 0.5;
      gapH = 148;
    } else if (tier === 3) {
      // Tier 3: Nghiêng góc cố định
      baseAngle = (Math.random() < 0.5 ? -1 : 1) * (0.06 + Math.random() * 0.04);
    } else if (tier === 2) {
      // Tier 2: Dập dềnh lên xuống êm dịu
      oscAmp = 28 + Math.random() * 14;
      oscFreq = 1.3 + Math.random() * 0.5;
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

    for (let i = 0; i < count; i++) {
      const p = candidates[i];
      p.isDestroyed = true;
      p.passed = true;
      destroyed.push(p);
    }

    this.spawnTimer = this.spawnInterval + (count >= 2 ? 0.9 : 0.4);
    return destroyed;
  }
}
