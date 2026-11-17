/**
 * Floating Energy Cells / Plasma Crystals for Drunk Rocket 2.0
 * Drifts in space between laser pillars. Can be collected by rocket or sucked in by Drunk Magnet.
 */
export class EnergyCell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.radius = 8;
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.isCollected = false;
    this.isMagnetized = false;
    this.vx = 0;
    this.vy = 0;
  }

  update(dt, speed, rocket, hasMagnet = false) {
    this.pulsePhase += dt * 6;

    if (hasMagnet && !this.isCollected) {
      const dx = rocket.x - this.x;
      const dy = rocket.y - this.y;
      const dist = Math.hypot(dx, dy);
      const magnetRange = 185;

      if (dist < magnetRange) {
        this.isMagnetized = true;
        const pullForce = 850 * (1 - dist / magnetRange) + 320;
        this.vx += (dx / dist) * pullForce * dt;
        this.vy += (dy / dist) * pullForce * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
      } else {
        this.isMagnetized = false;
        this.x -= speed * dt;
        this.y = this.baseY + Math.sin(this.pulsePhase) * 6;
      }
    } else {
      this.x -= speed * dt;
      this.y = this.baseY + Math.sin(this.pulsePhase) * 6;
    }
  }

  isOffscreen() {
    return this.x + this.radius < -40;
  }

  checkCollision(rocket) {
    if (this.isCollected) return false;
    const dx = rocket.x - this.x;
    const dy = rocket.y - this.y;
    const dist = Math.hypot(dx, dy);
    return dist < (rocket.radius + this.radius + 4);
  }
}

export class EnergyCellManager {
  constructor(gameWidth = 400, gameHeight = 700) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.cells = [];
    this.spawnTimer = 1.0;
  }

  reset() {
    this.cells = [];
    this.spawnTimer = 1.0;
  }

  spawn(x, y) {
    this.cells.push(new EnergyCell(x, y));
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
      const grad = ctx.createRadialGradient(cell.x, cell.y, 2, cell.x, cell.y, r + 10);
      grad.addColorStop(0, cell.isMagnetized ? 'rgba(0, 240, 255, 0.95)' : 'rgba(255, 209, 59, 0.95)');
      grad.addColorStop(0.5, cell.isMagnetized ? 'rgba(0, 240, 255, 0.4)' : 'rgba(255, 209, 59, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cell.x, cell.y, r + 10, 0, Math.PI * 2);
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
