/**
 * Ghost Wrecks Manager (Sprint 2.3)
 * Fetches and renders player death markers & tombstones along the race track.
 */
export class GhostManager {
  constructor(apiBaseUrl = 'https://drunk-rocket-backend.ppldhsp.workers.dev') {
    this.apiBaseUrl = apiBaseUrl;
    this.ghosts = [];
    this.activeWrecks = [];
    this.fetchGhosts();
  }

  async fetchGhosts() {
    try {
      const res = await fetch(`${this.apiBaseUrl}/api/ghosts`);
      if (res.ok) {
        const data = await res.json();
        this.ghosts = data.ghosts || [];
      }
    } catch (e) {
      // Mock ghosts for offline demo
      this.ghosts = [
        { player_name: 'DIEU_SAY', death_score: 4, y_pos: 340 },
        { player_name: 'GIO_LON', death_score: 9, y_pos: 420 },
        { player_name: 'BAY_CAO', death_score: 2, y_pos: 260 }
      ];
    }
  }

  async submitGhost(playerName, score, y) {
    try {
      await fetch(`${this.apiBaseUrl}/api/ghosts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_name: playerName, death_score: score, y_pos: y })
      });
    } catch (e) {}
  }

  // Spawn ghost wreckage at matching obstacle score column
  spawnForPillar(pillar, currentScore) {
    const matched = this.ghosts.filter(g => g.death_score === currentScore + 1);
    for (const g of matched) {
      this.activeWrecks.push({
        name: g.player_name,
        x: pillar.x + pillar.width + 25,
        y: g.y_pos || 350,
        passed: false
      });
    }
  }

  update(dt, speed) {
    for (let i = this.activeWrecks.length - 1; i >= 0; i--) {
      const w = this.activeWrecks[i];
      w.x -= speed * dt;
      if (w.x < -100) {
        this.activeWrecks.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    ctx.save();
    for (const w of this.activeWrecks) {
      // 1. Xác diều rách (giấy vàng bạc màu, rách một góc)
      ctx.save();
      ctx.translate(w.x, w.y);
      ctx.rotate(-0.35);

      ctx.fillStyle = '#a9a06a';
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.quadraticCurveTo(8, -9, 0, -11);
      ctx.quadraticCurveTo(-8, -8, -11, 0);
      ctx.quadraticCurveTo(-6, 8, 1, 10);
      ctx.quadraticCurveTo(10, 6, 14, 0);
      ctx.closePath();
      ctx.fill();

      // Vết rách
      ctx.fillStyle = 'rgba(20, 24, 32, 0.75)';
      ctx.beginPath();
      ctx.moveTo(2, -6);
      ctx.lineTo(6, -1);
      ctx.lineTo(1, 2);
      ctx.closePath();
      ctx.fill();

      // Xương tre gãy
      ctx.strokeStyle = '#6b5a32';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(-2, 0);
      ctx.moveTo(0, -9);
      ctx.lineTo(0, 4);
      ctx.stroke();
      ctx.restore();

      // 2. Dây diều đứt quấn quanh
      ctx.strokeStyle = 'rgba(220, 214, 190, 0.7)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(w.x - 9, w.y + 2);
      ctx.quadraticCurveTo(w.x - 22, w.y + 10, w.x - 16, w.y - 8);
      ctx.stroke();

      // 3. Nén hương + khói (tưởng niệm chú diều xấu số)
      ctx.strokeStyle = '#8a5a34';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w.x + 16, w.y + 10);
      ctx.lineTo(w.x + 16, w.y - 2);
      ctx.stroke();
      ctx.fillStyle = '#ff8a4c';
      ctx.beginPath();
      ctx.arc(w.x + 16, w.y - 3, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(210, 214, 224, 0.45)';
      ctx.lineWidth = 1.4;
      for (let s = 0; s < 2; s++) {
        ctx.beginPath();
        ctx.moveTo(w.x + 16, w.y - 6 - s * 6);
        ctx.quadraticCurveTo(w.x + 20 + s * 2, w.y - 12 - s * 6, w.x + 16, w.y - 18 - s * 6);
        ctx.stroke();
      }

      // 4. Bảng tên người chơi
      ctx.fillStyle = 'rgba(11, 14, 20, 0.85)';
      ctx.fillRect(w.x - 50, w.y + 16, 100, 20);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#41d9b0';
      ctx.strokeRect(w.x - 50, w.y + 16, 100, 20);

      ctx.fillStyle = '#d8fff2';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`🪁 ${w.name}`, w.x, w.y + 30);
    }
    ctx.restore();
  }
}