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

  update(dt, speed, rocket, hasMagnet = false, magnetBonus = 0) {
    this.pulsePhase += dt * this.floatSpeed;

    if (hasMagnet && !this.isCollected) {
      const dx = rocket.x - this.x;
      const dy = rocket.y - this.y;
      const dist = Math.hypot(dx, dy);
      const magnetRange = 260 + (magnetBonus || 0); // khớp Vó Hút Gió + nâng cấp Hũ Gió

      if (dist > 0.001 && dist < magnetRange) {
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
    this.x -= speed * dt;
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
  /**
   * Spawns a scattered cluster of 2 to 4 animated floating energy orbs
   * positioned midway in the open corridor between the cleared pillar and upcoming pillar.
   */
  spawnCluster(centerX, centerY, count = 3) {
    const spacing = 34;
    const startX = centerX - ((count - 1) * spacing) / 2;
    for (let i = 0; i < count; i++) {
      const offsetX = i * spacing + (Math.random() - 0.5) * 16;
      const offsetY = (Math.random() - 0.5) * 70;
      const cellY = Math.min(Math.max(centerY + offsetY, 130), 570);
      this.cells.push(new EnergyCell(startX + offsetX, cellY));
    }
  }

  update(dt, speed, rocket, hasMagnet, onCollect, magnetBonus = 0) {
    for (let i = this.cells.length - 1; i >= 0; i--) {
      const cell = this.cells[i];
      cell.update(dt, speed, rocket, hasMagnet, magnetBonus);

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
      const magnet = cell.isMagnetized;

      // 1. Quầng gió sáng
      const grad = ctx.createRadialGradient(cell.x, cell.y, 2, cell.x, cell.y, r + 13);
      grad.addColorStop(0, magnet ? 'rgba(0, 240, 255, 0.95)' : 'rgba(216, 255, 244, 0.95)');
      grad.addColorStop(0.45, magnet ? 'rgba(0, 240, 255, 0.35)' : 'rgba(150, 236, 212, 0.34)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cell.x, cell.y, r + 13, 0, Math.PI * 2);
      ctx.fill();

      ctx.translate(cell.x, cell.y);
      ctx.rotate(cell.pulsePhase * 0.6);

      // 2. Các sợi gió (bông gió) xoè ra, hơi xoắn theo chiều gió
      const filaments = 7;
      for (let i = 0; i < filaments; i++) {
        const a = (i / filaments) * Math.PI * 2;
        const len = r + 3 + Math.sin(cell.pulsePhase * 2 + i) * 1.6;
        const tipA = a + 0.28;
        const tx = Math.cos(tipA) * len;
        const ty = Math.sin(tipA) * len;
        ctx.strokeStyle = magnet ? 'rgba(0, 240, 255, 0.9)' : 'rgba(226, 255, 246, 0.85)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 1.6, Math.sin(a) * 1.6);
        ctx.quadraticCurveTo(
          Math.cos(a + 0.5) * len * 0.6, Math.sin(a + 0.5) * len * 0.6,
          tx, ty
        );
        ctx.stroke();

        // Hạt gió ở đầu sợi
        ctx.fillStyle = magnet ? '#ffffff' : '#fffdf2';
        ctx.beginPath();
        ctx.arc(tx, ty, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Lõi ấm (giọt gió vàng)
      const core = ctx.createRadialGradient(0, 0, 0.5, 0, 0, r * 0.85);
      core.addColorStop(0, magnet ? '#ffffff' : '#fff8dc');
      core.addColorStop(0.55, magnet ? '#00f0ff' : '#ffd13b');
      core.addColorStop(1, magnet ? 'rgba(0, 240, 255, 0)' : 'rgba(255, 209, 59, 0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }
}
