/**
 * Micro-Roguelite Perk System for Drunk Rocket 2.0
 * Manages drafting cards, passive modifiers, and bullet-time effect.
 */
export const PERK_CATALOG = [
  {
    id: 'nano_hull',
    name: 'Nano Hull',
    icon: '🔬',
    desc: 'Co nhỏ tàu 25%, lách qua khe hẹp cực dễ',
    group: 'defense',
    apply: (game) => {
      game.rocket.radius = Math.round(game.rocket.radius * 0.75);
      game.rocket.scale = 0.75;
    }
  },
  {
    id: 'beer_bubble',
    name: 'Beer Bubble',
    icon: '🫧',
    desc: 'Khiên bọt cồn: Đỡ 1 lần va chạm tử nạn',
    group: 'defense',
    apply: (game) => {
      game.shieldActive = true;
    }
  },
  {
    id: 'quantum_drift',
    name: 'Quantum Drift',
    icon: '🌌',
    desc: 'Tàng hình và đi xuyên hoàn toàn cột 0.85s sau mỗi cú tap',
    group: 'defense',
    apply: (game) => {
      game.hasQuantumDrift = true;
    }
  },
  {
    id: 'adrenaline_junkie',
    name: 'Adrenaline Junkie',
    icon: '⚡',
    desc: 'Điểm Near-Miss tăng gấp đôi (+4 điểm & +60% Nộ)',
    group: 'offense',
    apply: (game) => {
      game.nearMissMultiplier = 2;
    }
  },
  {
    id: 'chain_reaction',
    name: 'Chain Reaction',
    icon: '💥',
    desc: 'Supernova Smash húc nổ luôn 2 cột liên tiếp',
    group: 'offense',
    apply: (game) => {
      game.smashChainCount = 2;
    }
  },
  {
    id: 'drunk_magnet',
    name: 'Drunk Magnet',
    icon: '🧲',
    desc: 'Tự động nạp năng lượng cồn +3% mỗi giây',
    group: 'utility',
    apply: (game) => {
      game.passiveChargeRate = 3;
    }
  }
];

export class PerkDraftManager {
  constructor(game) {
    this.game = game;
    this.activePerks = new Set();
    this.isDrafting = false;
    this.draftCards = [];
    this.draftTimer = 0;
    this.draftMaxDuration = 2.5; // 2.5 seconds Bullet Time
    this.lastMilestoneScore = 0;
    this.milestoneInterval = 7;   // Draft every 7 points
  }

  reset() {
    this.activePerks.clear();
    this.isDrafting = false;
    this.draftCards = [];
    this.draftTimer = 0;
    this.lastMilestoneScore = 0;
  }

  checkMilestone(currentScore) {
    if (this.isDrafting) return;
    if (currentScore >= this.lastMilestoneScore + this.milestoneInterval) {
      this.lastMilestoneScore = currentScore;
      this.triggerDraft();
    }
  }

  triggerDraft() {
    // Pick 3 unique random perks
    const available = PERK_CATALOG.filter(p => !this.activePerks.has(p.id));
    if (available.length === 0) return;

    const shuffled = [...available].sort(() => 0.5 - Math.random());
    this.draftCards = shuffled.slice(0, 3);
    this.isDrafting = true;
    this.draftTimer = this.draftMaxDuration;

    // Bullet time sound
    if (this.game.audio) {
      this.game.audio.playMedal();
    }
  }

  selectCard(index) {
    if (!this.isDrafting || index < 0 || index >= this.draftCards.length) return;
    const perk = this.draftCards[index];
    this.activePerks.add(perk.id);
    perk.apply(this.game);

    this.isDrafting = false;
    this.draftCards = [];

    // Clear and prevent any tap from leaking into rocket thrust
    if (this.game && this.game.input) {
      this.game.input.consumeTap();
      this.game.input.consumeDoubleTap();
      this.game.perkDraftCooldown = 0.25;
    }
  }

  update(dt) {
    if (this.isDrafting) {
      this.draftTimer -= dt;
      if (this.draftTimer <= 0) {
        // Auto pick first card if time runs out
        this.selectCard(0);
      }
    }
  }

  draw(ctx, width, height) {
    if (!this.isDrafting || this.draftCards.length === 0) return;

    ctx.save();
    // Dark overlay for bullet time focus
    ctx.fillStyle = 'rgba(11, 14, 20, 0.75)';
    ctx.fillRect(0, 0, width, height);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd13b';
    ctx.font = '900 22px monospace';
    ctx.fillText('⭐ CHỌN THẺ NÂNG CẤP (PERK) ⭐', width / 2, 170);

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(`Thời gian chọn: ${this.draftTimer.toFixed(1)}s (Bấm phím 1, 2, 3 hoặc chạm)`, width / 2, 200);

    // Draw 3 cards
    const cardW = 320;
    const cardH = 75;
    const startY = 240;

    this.draftCards.forEach((card, idx) => {
      const cardY = startY + idx * 95;
      const cardX = width / 2 - cardW / 2;

      // Card Box
      ctx.fillStyle = 'rgba(26, 31, 54, 0.95)';
      ctx.fillRect(cardX, cardY, cardW, cardH);
      ctx.lineWidth = 2;
      ctx.strokeStyle = idx === 0 ? '#ffd13b' : '#00f0ff';
      ctx.strokeRect(cardX, cardY, cardW, cardH);

      // Number badge
      ctx.fillStyle = '#ffd13b';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`[${idx + 1}] ${card.icon} ${card.name}`, cardX + 90, cardY + 28);

      // Description
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.fillText(card.desc, width / 2, cardY + 54);
    });

    ctx.restore();
  }
}
