/**
 * Micro-Roguelite Perk System for Drunk Rocket 3.0
 * Manages drafting cards, pillar-based durations, resetting durations, and continuous random availability.
 */
import { t, getLang } from '../i18n.js';

export const PERK_CATALOG = [
  {
    id: 'nano_hull',
    name: 'Lá Sen Che Thân',
    nameEn: 'Lotus Leaf Veil',
    icon: '🍃',
    desc: 'Diều nhỏ lại 25% (Hiệu lực: qua 3 cổng)',
    descEn: 'Kite shrinks 25% (lasts 3 gates)',
    group: 'defense',
    durationPillars: 3,
    apply: (game) => {
      game.rocket.radius = Math.round(12 * 0.75); // 9px
      game.rocket.scale = 0.75;
      game.perkDurations.nano_hull = 3;
    },
    remove: (game) => {
      game.rocket.radius = 12;
      game.rocket.scale = 1.0;
      delete game.perkDurations.nano_hull;
    }
  },
  {
    id: 'beer_bubble',
    name: 'Bọt Rượu Cần',
    nameEn: 'Rice-Wine Bubble',
    icon: '🫧',
    desc: 'Khiên bọt đỡ 1 va chạm (Hiệu lực: 4 cổng)',
    descEn: 'Bubble shield blocks 1 hit (lasts 4 gates)',
    group: 'defense',
    durationPillars: 4,
    apply: (game) => {
      game.shieldActive = true;
      game.perkDurations.beer_bubble = 4;
    },
    remove: (game) => {
      game.shieldActive = false;
      delete game.perkDurations.beer_bubble;
    }
  },
  {
    id: 'quantum_drift',
    name: 'Xuyên Gió',
    nameEn: 'Wind Walker',
    icon: '👻',
    desc: 'Tàng hình xuyên cổng 1.8s sau mỗi cú chạm (qua 4 cổng)',
    descEn: 'Phase through gates 1.8s after each tap (4 gates)',
    group: 'defense',
    durationPillars: 4,
    apply: (game) => {
      game.hasQuantumDrift = true;
      game.quantumCooldownTimer = 0;
      game.perkDurations.quantum_drift = 4;
    },
    remove: (game) => {
      game.hasQuantumDrift = false;
      game.quantumTimer = 0;
      if (game.rocket) game.rocket.isQuantum = false;
      delete game.perkDurations.quantum_drift;
    }
  },
  {
    id: 'adrenaline_junkie',
    name: 'Mắt Diều Tinh',
    nameEn: 'Keen Kite Eye',
    icon: '👁',
    desc: 'Điểm Near-Miss tăng gấp đôi (Hiệu lực: qua 3 cổng)',
    descEn: 'Double Near-Miss score (lasts 3 gates)',
    group: 'offense',
    durationPillars: 3,
    apply: (game) => {
      game.nearMissMultiplier = 2;
      game.perkDurations.adrenaline_junkie = 3;
    },
    remove: (game) => {
      game.nearMissMultiplier = 1;
      delete game.perkDurations.adrenaline_junkie;
    }
  },
  {
    id: 'chain_reaction',
    name: 'Pháo Dây Chuyền',
    nameEn: 'Chain Firecrackers',
    icon: '🧨',
    desc: 'Cú Lộng Gió kế tiếp phá 2 cổng +35% năng lượng',
    descEn: 'Next Wind Burst smashes 2 gates (+35% charge)',
    group: 'offense',
    durationPillars: 0,
    apply: (game) => {
      game.nextSmashChain = 2;   // cú Lộng Gió KẾ TIẾP phá 2 cổng
      game.smashChainCount = 2;  // để HUD hiện huy hiệu ×2
      game.drunkMeter = Math.min(100, game.drunkMeter + 35);
    },
    remove: (game) => {
      game.nextSmashChain = 0;
      game.smashChainCount = 1;
    }
  },
  {
    id: 'drunk_magnet',
    name: 'Vó Hút Gió',
    nameEn: 'Wind Net',
    icon: '🌪',
    desc: 'Hút mọi hạt gió trong 260px (Hiệu lực: qua 3 cổng)',
    descEn: 'Pulls all wind orbs within 260px (lasts 3 gates)',
    group: 'utility',
    durationPillars: 3,
    apply: (game) => {
      game.hasDrunkMagnet = true;
      game.passiveChargeRate = 2;
      game.perkDurations.drunk_magnet = 3;
    },
    remove: (game) => {
      game.hasDrunkMagnet = false;
      game.passiveChargeRate = 0;
      delete game.perkDurations.drunk_magnet;
    }
  }
];

export class PerkDraftManager {
  constructor(game) {
    this.game = game;
    this.isDrafting = false;
    this.isPreDraft = false;
    this.preDraftTimer = 0;
    this.isPostDraft = false;
    this.postDraftTimer = 0;
    this.selectedCard = null;
    this.hoveredIndex = -1;
    this.draftCards = [];
    this.draftTimer = 0;
    this.draftMaxDuration = 2.4;
    this.lastMilestoneScore = -6; // mốc đầu ở 6 CỔNG, sau đó 18, 30... (lệch pha với chương)
    this.milestoneInterval = 12;
  }

  reset() {
    this.isDrafting = false;
    this.isPreDraft = false;
    this.preDraftTimer = 0;
    this.isPostDraft = false;
    this.postDraftTimer = 0;
    this.selectedCard = null;
    this.hoveredIndex = -1;
    this.draftCards = [];
    this.draftTimer = 0;
    this.lastMilestoneScore = -6;
  }

  checkMilestone(currentScore) {
    // If rocket is currently dashing in Supernova Smash, wait until dash finishes
    if (this.game && this.game.isSmashActive) return;
    if (this.isDrafting || this.isPreDraft || this.isPostDraft) return;

    if (currentScore >= this.lastMilestoneScore + this.milestoneInterval) {
      this.lastMilestoneScore = currentScore;
      // 1.0s pre-draft pause before showing cards
      this.isPreDraft = true;
      this.preDraftTimer = 0.45;
      if (this.game && this.game.rocket) {
        this.game.rocket.vx = 0;
        this.game.rocket.vy = 0;
      }
      if (this.game && this.game.audio) {
        this.game.audio.playMedal();
      }
    }
  }

  triggerDraft() {
    // REQUIREMENT: Mỗi thẻ bài xuất hiện nhiều lần và ngẫu nhiên (không bị chặn vĩnh viễn)
    const shuffled = [...PERK_CATALOG].sort(() => 0.5 - Math.random());
    this.draftCards = shuffled.slice(0, 3);
    this.isDrafting = true;
    this.hoveredIndex = -1;
    this.draftTimer = this.draftMaxDuration;

    if (this.game && this.game.audio) {
      this.game.audio.playScore();
    }
  }

  setHover(clientX, clientY) {
    if (!this.isDrafting || this.draftCards.length === 0) {
      this.hoveredIndex = -1;
      return;
    }

    const cardW = 320;
    const cardH = 75;
    const cardX = this.game.width / 2 - cardW / 2;
    const startY = 240;

    let found = -1;
    if (clientX >= cardX && clientX <= cardX + cardW) {
      for (let idx = 0; idx < this.draftCards.length; idx++) {
        const cardY = startY + idx * 95;
        if (clientY >= cardY && clientY <= cardY + cardH) {
          found = idx;
          break;
        }
      }
    }
    this.hoveredIndex = found;
  }

  selectCard(index) {
    if (!this.isDrafting || index < 0 || index >= this.draftCards.length) return;
    const perk = this.draftCards[index];

    this.selectedCard = perk;
    this.isDrafting = false;
    this.hoveredIndex = -1;

    // Apply or Reset perk duration back to full
    perk.apply(this.game);

    // Consume all inputs immediately
    if (this.game && this.game.input) {
      this.game.input.consumeTap();
      this.game.input.consumeDoubleTap();
      this.game.perkDraftCooldown = 0.5;
    }
    if (this.game && this.game.audio) {
      this.game.audio.playMedal();
    }

    if (perk.id === 'chain_reaction') {
      // Không nổ ngay nữa: chỉ cường hoá cú Lộng Gió kế tiếp (đúng mô tả thẻ)
      this.isPostDraft = false;
      this.selectedCard = null;
      this.draftCards = [];
      this.game.invincibleTimer = Math.max(this.game.invincibleTimer, 0.8);
    } else {
      // Các thẻ khác: 1.0s post-draft freeze pause để người chơi chuẩn bị
      this.isPostDraft = true;
      this.postDraftTimer = 0.7;
    }
  }

  onPassPillar() {
    if (!this.game || !this.game.perkDurations) return;

    for (const perk of PERK_CATALOG) {
      if (this.game.perkDurations[perk.id] !== undefined) {
        this.game.perkDurations[perk.id]--;
        // Khi đi qua đủ số cột -> hết hiệu lực, gọi remove()
        if (this.game.perkDurations[perk.id] <= 0) {
          perk.remove(this.game);
        }
      }
    }
  }

  update(dt) {
    // 1. Pre-draft 1.0s freeze
    if (this.isPreDraft) {
      this.preDraftTimer -= dt;
      if (this.preDraftTimer <= 0) {
        this.isPreDraft = false;
        this.triggerDraft();
      }
      return;
    }

    // 2. Card Drafting
    if (this.isDrafting) {
      this.draftTimer -= dt;
      if (this.draftTimer <= 0) {
        this.selectCard(0);
      }
      return;
    }

    // 3. Post-draft 1.0s ready pause
    if (this.isPostDraft) {
      this.postDraftTimer -= dt;
      if (this.postDraftTimer <= 0) {
        this.isPostDraft = false;
        this.selectedCard = null;
        this.draftCards = [];
        // Mọi lá bùa: 0.8s bất tử + reset giữ tay khi thả bay lại
        if (this.game) {
          this.game.invincibleTimer = Math.max(this.game.invincibleTimer, 0.8);
          if (this.game.input && this.game.input.resetHold) this.game.input.resetHold();
        }
      }
    }
  }

  draw(ctx, width, height) {
    // Pre-draft 1.0s pause display
    if (this.isPreDraft) {
      ctx.save();
      ctx.fillStyle = 'rgba(11, 14, 20, 0.75)';
      ctx.fillRect(0, 0, width, height);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffd13b';
      ctx.font = '900 24px monospace';
      ctx.fillText('🎋 ' + t('perk.preDraft') + ' 🎋', width / 2, 320);

      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 15px monospace';
      ctx.fillText(`${t('perk.opening')} (${Math.max(0, this.preDraftTimer).toFixed(1)}s)`, width / 2, 360);
      ctx.restore();
      return;
    }

    // Post-draft 1.0s ready pause display
    if (this.isPostDraft && this.selectedCard) {
      ctx.save();
      ctx.fillStyle = 'rgba(11, 14, 20, 0.8)';
      ctx.fillRect(0, 0, width, height);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#05ffa1';
      ctx.font = '900 22px monospace';
      ctx.fillText(`✔ ${t('perk.picked')}: ${this.selectedCard.icon} ${getLang() === 'en' ? (this.selectedCard.nameEn || this.selectedCard.name) : this.selectedCard.name}`, width / 2, 310);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(getLang() === 'en' ? (this.selectedCard.descEn || this.selectedCard.desc) : this.selectedCard.desc, width / 2, 340);

      ctx.fillStyle = '#ffd13b';
      ctx.font = '900 16px monospace';
      ctx.fillText(`🪁 ${t('perk.ready')}: ${Math.max(0, this.postDraftTimer).toFixed(1)}s`, width / 2, 380);
      ctx.restore();
      return;
    }

    if (!this.isDrafting || this.draftCards.length === 0) return;

    ctx.save();
    ctx.fillStyle = 'rgba(11, 14, 20, 0.82)';
    ctx.fillRect(0, 0, width, height);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd13b';
    ctx.font = '900 22px monospace';
    ctx.fillText('⭐ ' + t('perk.draftTitle') + ' ⭐', width / 2, 170);

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(`${t('perk.timer')}: ${Math.max(0, this.draftTimer).toFixed(1)}s (1, 2, 3)`, width / 2, 200);

    const cardW = 320;
    const cardH = 75;
    const startY = 240;

    this.draftCards.forEach((card, idx) => {
      const isHovered = idx === this.hoveredIndex;
      const cardY = startY + idx * 95;
      const cardX = width / 2 - cardW / 2;

      ctx.save();

      if (isHovered) {
        const growX = 8;
        const growY = 4;
        const hX = cardX - growX / 2;
        const hY = cardY - growY / 2;
        const hW = cardW + growX;
        const hH = cardH + growY;

        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 20;

        const grad = ctx.createLinearGradient(hX, hY, hX + hW, hY + hH);
        grad.addColorStop(0, 'rgba(42, 60, 110, 0.98)');
        grad.addColorStop(1, 'rgba(22, 32, 65, 0.98)');
        ctx.fillStyle = grad;
        ctx.fillRect(hX, hY, hW, hH);

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#ffd13b';
        ctx.strokeRect(hX, hY, hW, hH);

        ctx.fillStyle = '#ffd13b';
        ctx.font = '900 17px monospace';
        ctx.fillText(`★  [${idx + 1}] ${card.icon} ${getLang() === 'en' ? (card.nameEn || card.name) : card.name} ★`, width / 2, cardY + 28);

        ctx.fillStyle = '#ffffff';
        let descSizeH = 12;
        ctx.font = `bold ${descSizeH}px monospace`;
        while (descSizeH > 8 && ctx.measureText(getLang() === 'en' ? (card.descEn || card.desc) : card.desc).width > cardW - 22) {
          descSizeH -= 0.5;
          ctx.font = `bold ${descSizeH}px monospace`;
        }
        ctx.fillText(getLang() === 'en' ? (card.descEn || card.desc) : card.desc, width / 2, cardY + 54);
      } else {
        ctx.fillStyle = 'rgba(26, 31, 54, 0.92)';
        ctx.fillRect(cardX, cardY, cardW, cardH);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = idx === 0 ? '#ffd13b' : '#00f0ff';
        ctx.strokeRect(cardX, cardY, cardW, cardH);

        ctx.fillStyle = '#ffd13b';
        ctx.font = 'bold 16px monospace';
        ctx.fillText(`[${idx + 1}] ${card.icon} ${getLang() === 'en' ? (card.nameEn || card.name) : card.name}`, width / 2, cardY + 28);

        ctx.fillStyle = '#d0d7de';
        let descSizeN = 12;
        ctx.font = `${descSizeN}px monospace`;
        while (descSizeN > 8 && ctx.measureText(getLang() === 'en' ? (card.descEn || card.desc) : card.desc).width > cardW - 22) {
          descSizeN -= 0.5;
          ctx.font = `${descSizeN}px monospace`;
        }
        ctx.fillText(getLang() === 'en' ? (card.descEn || card.desc) : card.desc, width / 2, cardY + 54);
      }

      ctx.restore();
    });

    ctx.restore();
  }
}
