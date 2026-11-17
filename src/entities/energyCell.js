/**
 * Floating Energy Cells / Plasma Crystals for Drunk Rocket 2.0
 * Swarms of 2-4 playful moving orbs floating through space.
 * Only charges Overdrive energy (+4% each) toward Smash without accelerating level score!
 */
export class EnergyCell {
  constructor(x, y, vx = -60, vy = 0) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = 7;
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.floatSpeed = 2.5 + Math.random() * 3.5;
    this.floatAmp = 12 + Math.random() * 16;
    this.isCollected = false;
    this.isMagnetized = false;
  }

  update(dt, speed, rocket, hasMagnet = false) {
    this.pulsePhase += dt * this.floatSpeed;

    if (hasMagnet && !this.isCollected) {
      const dx = rocket.x - this.x;
      const dy = rocket.y - this.y;
      const dist = Math.hypot(dx, dy);
      const magnetRange = 220; // Broad magnet suction range

      if (dist < magnetRange) {
        this.isMagnetized = true;
        const pullForce = 950 * (1 - dist / magnetRange) + 420;
        this.vx += (dx / dist) * pullForce * dt;
        this.vy += (dy / dist) * pullForce * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        return;
      }
    }

    this.isMagnetized = false;
    // Dynamic floating motion (drifts left and bobs up and down)
    this.x -= (speed + 25) * dt;
    this.y = this.baseY + Math.sin(this.pulsePhase) * this.floatAmp;
  }

  isOffscreen() {
    return this.x + this.radius < -40;
  }

  checkCollision(rocket) {
    if (this.isCollected) return false;
    const dx = rocket.x - this.x;
    const dy = rocket.y - this.y;
    const dist = Math.hypot(dx, dy);
    return dist < (rocket.radius + this.radius + 6);
  }
}

export class EnergyCellManager {
  constructor(gameWidth = 400, gameHeight = 700) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.cells = [];
  }

  reset() {
    this.cells = [];
  }

  /**
   * Spawns a cluster of 2 to 4 animated floating energy orbs
   */
  spawnCluster(startX, centerY, count = 3) {
    for (let i = 0; i < count; i++) {
      const offsetX = i * 26 + (Math.random() - 0.5) * 15;
      const offsetY = (Math.random() - 0.5) * 60;
      const cellY = Math.min(Math.max(centerY + offsetY, 120), 580);
      this.cells.push(new EnergyCell(startX + offsetX, cellY));
    }
  }

  update(dt, speed, rocket, hasMagnet, onCollect) {
    for (let i = this.cells.length - 1; i >= 0; i--) {
      const cell = this.cells[i];
      cell.update(dt, speed, rocket, hasMagnet);

      if (!cell.isCollected && cell.checkCollision(rocket)) {
        cell.isCollected = true;
        if (onCollect) onCollect(cell);
        this.cells.splice(i, 1);
        continue;
      }

      if (cell.isOffscreen() || cell.isCollected) {
        this.cells.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    for (const cell of this.cells) {
      if (cell.isCollected) continue;

      ctx.save();
      const pulse = Math.sin(cell.pulsePhase);
      const r = cell.radius + pulse * 1.5;

      // Outer glowing halo
      const grad = ctx.createRadialGradient(cell.x, cell.y, 2, cell.x, cell.y, r + 12);
      grad.addColorStop(0, cell.isMagnetized ? 'rgba(0, 240, 255, 0.95)' : 'rgba(255, 209, 59, 0.95)');
      grad.addColorStop(0.5, cell.isMagnetized ? 'rgba(0, 240, 255, 0.4)' : 'rgba(255, 209, 59, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cell.x, cell.y, r + 12, 0, Math.PI * 2);
      ctx.fill();

      // Rotating diamond crystal
      ctx.translate(cell.x, cell.y);
      ctx.rotate(cell.pulsePhase * 0.75);

      ctx.fillStyle = cell.isMagnetized ? '#00f0ff' : '#ffd13b';
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r, 0);
      ctx.lineTo(0, r);
      ctx.lineTo(-r, 0);
      ctx.closePath();
      ctx.fill();

      // Outer rim
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // White inner sparkle core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }
}
