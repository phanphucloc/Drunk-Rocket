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
        { player_name: 'MAUSBOT', death_score: 4, y_pos: 340 },
        { player_name: 'ACE_PILOT', death_score: 9, y_pos: 420 },
        { player_name: 'DRUNK_DOG', death_score: 2, y_pos: 260 }
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
      // 1. Draw Broken Wreckage (Burnt pixel ship)
      ctx.fillStyle = '#4b5563';
      ctx.fillRect(w.x - 10, w.y - 8, 20, 16);
      ctx.fillStyle = '#ff3b5c';
      ctx.fillRect(w.x - 4, w.y - 4, 8, 8); // glowing damaged core

      // 2. Draw Smoke puff above wreck
      ctx.fillStyle = 'rgba(156, 163, 175, 0.6)';
      ctx.beginPath();
      ctx.arc(w.x, w.y - 14, 6, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw Tombstone Badge
      ctx.fillStyle = 'rgba(11, 14, 20, 0.85)';
      ctx.fillRect(w.x - 45, w.y + 14, 90, 20);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff3b5c';
      ctx.strokeRect(w.x - 45, w.y + 14, 90, 20);

      ctx.fillStyle = '#05ffa1';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`💀 ${w.name}`, w.x, w.y + 28);
    }
    ctx.restore();
  }
}