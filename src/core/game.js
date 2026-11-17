import { InputManager } from './input.js';
import { Rocket } from '../entities/rocket.js';
import { LaserPillarManager } from '../entities/laserPillar.js';
import { EnergyCellManager } from '../entities/energyCell.js';
import { Starfield } from '../graphics/starfield.js';
import { ParticleSystem } from '../graphics/particles.js';
import { EntityRenderer } from '../graphics/renderer.js';
import { AudioSynthesizer } from '../audio/audioSynth.js';
import { HUD } from '../ui/hud.js';
import { LeaderboardModal } from '../ui/leaderboardModal.js';
import { PerkDraftManager } from './perks.js';
import { GhostManager } from '../entities/ghosts.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.width = 400;
    this.height = 700;
    this.scale = 1;

    this.state = 'READY';

    this.input = new InputManager(this.canvas);
    this.audio = new AudioSynthesizer();
    this.starfield = new Starfield(this.width, this.height);
    this.particles = new ParticleSystem();
    this.pillars = new LaserPillarManager(this.width, this.height);
    this.energyCells = new EnergyCellManager(this.width, this.height);
    this.hud = new HUD(this.width, this.height);
    this.rocket = new Rocket(100, 320);
    this.perks = new PerkDraftManager(this);
    this.ghosts = new GhostManager();

    // Active Perk Modifiers
    this.shieldActive = false;
    this.hasQuantumDrift = false;
    this.quantumTimer = 0;
    this.quantumCooldownTimer = 0;
    this.quantumMaxCooldown = 4.0;
    this.hasDrunkMagnet = false;
    this.magnetParticleTimer = 0;
    this.perkDraftCooldown = 0;
    this.nearMissMultiplier = 1;
    this.smashChainCount = 1;
    this.smashedCountInSupernova = 0;
    this.maxSmashCount = 1;
    this.passiveChargeRate = 0;
    this.perkDurations = {};

    // Visual expression feedback
    this.justScoredTimer = 0;

    this.leaderboard = new LeaderboardModal('https://drunk-rocket-backend.ppldhsp.workers.dev');

    // Scoring & Overdrive
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('drunk_rocket_best') || '0', 10);
    this.deathCount = parseInt(localStorage.getItem('drunk_rocket_deaths') || '0', 10);

    // Drunk-Meter Overdrive (0 to 100)
    this.drunkMeter = 0;
    this.isSmashActive = false;
    this.smashDuration = 0;
    this.smashTargetX = 100;
    this.originalRocketX = 100;

    // Timers
    this.lastTime = 0;
    this.totalTime = 0;
    this.timeSinceDeath = 0;
    this.runStartTime = 0;
    this.isRunning = false;

    this._onScore = this._onScore.bind(this);
    this._onNearMiss = this._onNearMiss.bind(this);
    this._onCollectCell = this._onCollectCell.bind(this);
    this.loop = this.loop.bind(this);

    // Pointer move listener for card hover effects
    this.canvas.addEventListener('pointermove', (e) => {
      if (this.perks && this.perks.isDrafting) {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = (e.clientX - rect.left) * (this.width / rect.width);
        const clientY = (e.clientY - rect.top) * (this.height / rect.height);
        this.perks.setHover(clientX, clientY);
        this.canvas.style.cursor = this.perks.hoveredIndex !== -1 ? 'pointer' : 'default';
      } else {
        this.canvas.style.cursor = 'default';
      }
    });

    // Pointer down listener for card selection
    this.canvas.addEventListener('pointerdown', (e) => {
      // Direct click on Overdrive Orb when full (center: cx = width/2, cy = 126, radius = 35)
      const rect = this.canvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) * (this.width / rect.width);
      const clickY = (e.clientY - rect.top) * (this.height / rect.height);
      const distToOrb = Math.hypot(clickX - this.width / 2, clickY - 126);
      if (this.state === 'PLAYING' && this.drunkMeter >= 100 && distToOrb <= 36) {
        e.preventDefault();
        e.stopPropagation();
        this._triggerSupernovaSmash();
        return;
      }
      if (this.perks && this.perks.isDrafting) {
        const rect = this.canvas.getBoundingClientRect();
        const clientY = (e.clientY - rect.top) * (this.height / rect.height);
        let cardIdx = -1;
        if (clientY >= 240 && clientY <= 315) cardIdx = 0;
        else if (clientY >= 335 && clientY <= 410) cardIdx = 1;
        else if (clientY >= 430 && clientY <= 505) cardIdx = 2;

        if (cardIdx !== -1) {
          e.preventDefault();
          e.stopPropagation();
          this.perks.selectCard(cardIdx);
          this.input.consumeTap();
          this.input.consumeDoubleTap();
        }
      }
    });

    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('keydown', (e) => {
      if (this.perks && this.perks.isDrafting) {
        let cardIdx = -1;
        if (e.key === '1') cardIdx = 0;
        else if (e.key === '2') cardIdx = 1;
        else if (e.key === '3') cardIdx = 2;

        if (cardIdx !== -1) {
          e.preventDefault();
          e.stopPropagation();
          this.perks.selectCard(cardIdx);
          this.input.consumeTap();
          this.input.consumeDoubleTap();
        }
      }
    });
  }

  resize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const scaleX = windowWidth / this.width;
    const scaleY = windowHeight / this.height;
    this.scale = Math.min(scaleX, scaleY);

    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }

  _restart() {
    this.score = 0;
    this.drunkMeter = 0;
    this.isSmashActive = false;
    this.smashDuration = 0;
    this.smashedCountInSupernova = 0;
    this.maxSmashCount = 1;
    this.rocket.reset(100, 320);
    this.rocket.scale = 1.0;
    this.rocket.radius = 12;
    this.rocket.isQuantum = false;
    this.justScoredTimer = 0;
    if (this.perks) this.perks.reset();
    this.shieldActive = false;
    this.hasQuantumDrift = false;
    this.quantumTimer = 0;
    this.quantumCooldownTimer = 0;
    this.hasDrunkMagnet = false;
    this.magnetParticleTimer = 0;
    this.perkDraftCooldown = 0;
    this.nearMissMultiplier = 1;
    this.smashChainCount = 1;
    this.passiveChargeRate = 0;
    this.perkDurations = {};
    this.pillars.reset();
    this.energyCells.reset();
    this.particles.reset();
    this.state = 'READY';
    this.timeSinceDeath = 0;
  }

  _onScore(pillar) {
    this.score += 1;
    this.justScoredTimer = 0.6; // Cheerful expression timer
    // Regular pillar gives +20% Overdrive
    this.drunkMeter = Math.min(100, this.drunkMeter + 20);
    this.audio.playScore(); // Cheerful "HEYYY!" sound
    this.particles.emitScoreSparkles(this.rocket.x + 20, this.rocket.y);

    const pX = pillar ? pillar.x + (pillar.width || 52) / 2 : this.rocket.x + 20;
    const pY = pillar ? pillar.gapY : this.rocket.y;
    this.particles.emitEnergySiphon(pX, pY, this.width / 2, 126, 9);

    // Spawn 2 to 4 moving floating energy particles behind the cleared pillar
    const clusterCount = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4 cells
    this.energyCells.spawnCluster(this.width + 45, pY, clusterCount);

    if (this.perks) this.perks.onPassPillar();

    if (this.perks) this.perks.checkMilestone(this.score);
    if (this.ghosts && pillar) this.ghosts.spawnForPillar(pillar, this.score);
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('drunk_rocket_best', this.bestScore.toString());
    }
  }

  _onNearMiss(pillar) {
    const bonus = 2 * this.nearMissMultiplier;
    this.score += bonus;
    this.justScoredTimer = 0.8;
    this.drunkMeter = Math.min(100, this.drunkMeter + (50 * this.nearMissMultiplier));
    this.audio.playNearMiss();
    this.hud.showNearMiss(bonus);
    this.particles.emitNearMiss(this.rocket.x, this.rocket.y);

    const pX = pillar ? pillar.x + (pillar.width || 52) / 2 : this.rocket.x + 20;
    const pY = pillar ? pillar.gapY : this.rocket.y;
    this.particles.emitEnergySiphon(pX, pY, this.width / 2, 126, 14);

    if (this.perks) this.perks.checkMilestone(this.score);
    if (this.ghosts && pillar) this.ghosts.spawnForPillar(pillar, this.score);
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('drunk_rocket_best', this.bestScore.toString());
    }
  }

  /**
   * Energy cell pickup: DOES NOT ADD LEVEL SCORE, ONLY CHARGES OVERDRIVE SMASH (+4% each)
   */
  _onCollectCell(cell) {
    this.drunkMeter = Math.min(100, this.drunkMeter + 4);
    if (this.audio.playCellCollect) {
      this.audio.playCellCollect();
    }
    this.particles.emitCellPickup(cell.x, cell.y);
    this.particles.emitEnergySiphon(cell.x, cell.y, this.width / 2, 126, 6);
  }

  _triggerSupernovaSmash(forcedChain = false) {
    if (this.isSmashActive) return;
    if (!forcedChain && this.drunkMeter < 100) return;

    this.isSmashActive = true;
    this.drunkMeter = 0;
    this.originalRocketX = this.rocket.x;
    const isChain = forcedChain || (this.smashChainCount >= 2);

    this.audio.playSmash();
    this.hud.triggerSmashEffects();

    // 1. Pha huy cot: Neu co Chain Reaction thi pha 2 cot, con Smash thuong thi pha 1 cot
    const targetCount = isChain ? 2 : 1;
    const smashedList = this.pillars.destroyFrontPillars(this.rocket.x, targetCount);

    // Xac dinh dich den (Destination X) dua vao vi tri cot xa nhat bi pha
    let targetX = this.rocket.x + 160;
    if (smashedList.length > 0) {
      const lastPillar = smashedList[smashedList.length - 1];
      targetX = lastPillar.x + (lastPillar.width || 52) / 2;
    } else {
      targetX = isChain ? this.width - 45 : this.width / 2 + 50;
    }

    // Gioi han dich den trong man hinh an toan
    this.smashTargetX = Math.min(this.width - 45, Math.max(this.rocket.x + 90, targetX));
    this.smashStartX = this.rocket.x;
    // Thoi gian luot: 0.95s cho 2 cot, 0.70s cho 1 cot
    this.smashTotalDuration = isChain ? 0.95 : 0.70;
    this.smashDuration = this.smashTotalDuration;

    // Kich hoat hieu ung no tung va cong diem (+3 moi cot)
    for (const smashed of smashedList) {
      this.score += 3;
      this.particles.emitPillarSmash(smashed.x + (smashed.width || 52) / 2, smashed.gapY || 350);
      if (this.ghosts) this.ghosts.spawnForPillar(smashed, this.score);
    }
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('drunk_rocket_best', this.bestScore.toString());
    }
  }

  _die() {
    if (this.state === 'GAMEOVER') return;
    this.state = 'GAMEOVER';
    this.timeSinceDeath = 0;
    this.deathCount++;
    localStorage.setItem('drunk_rocket_deaths', this.deathCount.toString());

    this.audio.playCrash(); // Comic "QUÉO QUÈO QUEO" failure sound
    this.hud.triggerCrashEffects();

    const safeX = typeof this.rocket.x === 'number' && !isNaN(this.rocket.x) ? this.rocket.x : 100;
    const safeY = typeof this.rocket.y === 'number' && !isNaN(this.rocket.y) ? Math.min(Math.max(this.rocket.y, 20), this.height - 20) : 350;
    this.particles.emitExplosion(safeX, safeY);

    const runDuration = performance.now() - this.runStartTime;
    if (this.ghosts) this.ghosts.submitGhost(localStorage.getItem('drunk_player_name') || 'ACE', this.score, safeY);
    if (this.leaderboard) {
      this.leaderboard.show(this.score, runDuration);
    }
  }

  update(dt) {
    this.totalTime += dt;
    this.hud.update(dt);
    this.particles.update(dt);
    this.starfield.update(dt, this.state === 'PLAYING' ? 1 : 0.2);

    if (this.leaderboard && this.leaderboard.isOpen) {
      this.input.consumeTap();
      this.input.consumeDoubleTap();
      return;
    }

    if (this.justScoredTimer > 0) {
      this.justScoredTimer -= dt;
    }

    // 1. Freeze game loop during Pre-draft (1.0s), Drafting, and Post-draft (1.0s)
    if (this.perks && (this.perks.isPreDraft || this.perks.isDrafting || this.perks.isPostDraft)) {
      // Freeze rocket velocity and orientation completely in mid-air
      this.rocket.vx = 0;
      this.rocket.vy = 0;
      this.input.consumeTap();
      this.input.consumeDoubleTap();
      this.perks.update(dt);
      return;
    }

    if (this.passiveChargeRate > 0) {
      this.drunkMeter = Math.min(100, this.drunkMeter + this.passiveChargeRate * dt);
    }

    // Drunk Magnet ambient suction VFX
    if (this.hasDrunkMagnet) {
      this.magnetParticleTimer += dt;
      if (this.magnetParticleTimer >= 0.3) {
        this.magnetParticleTimer = 0;
        this.particles.emitMagnetSuction(this.rocket.x, this.rocket.y, 2);
      }
    }

    // Quantum Drift cooldown timer
    if (this.quantumCooldownTimer > 0) {
      this.quantumCooldownTimer -= dt;
    }

    // Quantum Drift active duration timer
    if (this.quantumTimer > 0) {
      this.quantumTimer -= dt;
      this.rocket.isQuantum = (this.quantumTimer > 0);
      for (const p of this.pillars.pillars) {
        if (this.rocket.x >= p.x - 30 && this.rocket.x <= p.x + p.width + 30) {
          p.quantumPhased = true;
        }
      }
    } else {
      this.rocket.isQuantum = false;
    }

    const hasTap = this.input.consumeTap();
    const hasDoubleTap = this.input.consumeDoubleTap();

    if (this.state === 'READY') {
      this.rocket.y = 320 + Math.sin(this.totalTime * 4) * 8;
      this.rocket.rotation = Math.sin(this.totalTime * 3) * 0.1;

      if (hasTap || hasDoubleTap) {
        this.state = 'PLAYING';
        this.runStartTime = performance.now();
        this.rocket.thrust();
        this.audio.playThrust();
        this.particles.emitThrust(this.rocket.x, this.rocket.y, this.rocket.rotation);
      }
    } else if (this.state === 'PLAYING') {
      if (hasDoubleTap && this.drunkMeter >= 100) {
        this._triggerSupernovaSmash();
      }

      // Supernova Smash: Đốt cháy lửa rồng và lướt thẳng đến vị trí cột bị phá
      if (this.isSmashActive) {
        this.smashDuration -= dt;
        const elapsed = this.smashTotalDuration - this.smashDuration;
        const t = Math.min(1, Math.max(0, elapsed / this.smashTotalDuration));

        // Hàm chuyển động lướt phi tiêu (Ease-Out Cubic)
        const easeT = 1 - Math.pow(1 - t, 3);

        if (t < 0.72) {
          // Giai đoạn 1: Lướt thần tốc tới đích cột bị phá hủy
          const forwardT = t / 0.72;
          this.rocket.x = this.smashStartX + (this.smashTargetX - this.smashStartX) * (1 - Math.pow(1 - forwardT, 2.5));
          this.rocket.angle = -0.15; // Giữ mũi hướng thẳng về trước
          this.rocket.vy = 0; // Không bị rơi trong lúc lướt
        } else {
          // Giai đoạn 2: Trôi êm ái về vị trí bay chuẩn
          const returnT = (t - 0.72) / 0.28;
          this.rocket.x = this.smashTargetX + (this.originalRocketX - this.smashTargetX) * (returnT * returnT);
          this.rocket.vy = 0;
        }

        // Đốt lửa rồng phản lực cuồn cuộn phía sau đuôi
        this.particles.emitSmashFireTrail(this.rocket.x, this.rocket.y, this.rocket.angle || 0);

        // KHI KẾT THÚC HOÀN TOÀN CÚ LƯỚT: Trả về vị trí chuẩn và KIỂM TRA HIỆN BẢNG CHỌN THẺ BÀI!
        if (this.smashDuration <= 0) {
          this.isSmashActive = false;
          this.rocket.x = this.originalRocketX;
          this.rocket.vx = 0;
          this.rocket.vy = 0;

          // Chain Reaction dùng 1 lần là hết -> reset về 1 cột
          this.smashChainCount = 1;

          // Sau khi lướt xong cột mới kiểm tra điểm để hiện bảng chọn thẻ bài
          if (this.perks) {
            this.perks.checkMilestone(this.score);
          }
        }
      }

      if (hasTap && !this.isSmashActive) {
        this.rocket.thrust();
        this.audio.playThrust();
        this.particles.emitThrust(this.rocket.x, this.rocket.y, this.rocket.rotation);

        if (this.hasQuantumDrift && this.quantumCooldownTimer <= 0) {
          this.quantumTimer = 0.8;
          this.quantumCooldownTimer = this.quantumMaxCooldown;
          this.rocket.isQuantum = true;
          this.audio.playMedal();
        }
      }

      if (this.isSmashActive) {
        // Trong lúc đang Smash, giữ nguyên vị trí lướt và không cho trọng lực kéo rơi
        this.rocket.vy = 0;
        this.rocket.isThrusting = true;
      } else {
        this.rocket.update(dt, false, this.totalTime);
      }
      this.pillars.update(dt, this.rocket, this._onScore, this._onNearMiss);
      this.energyCells.update(dt, this.pillars.speed, this.rocket, this.hasDrunkMagnet, this._onCollectCell);
      if (this.ghosts) this.ghosts.update(dt, this.pillars.speed);

      // Boundary collision check (ceiling or floor)
      if (!this.isSmashActive && (this.rocket.y - this.rocket.radius <= 0 || this.rocket.y + this.rocket.radius >= this.height)) {
        this._die();
        return;
      }

      // Pillar collision check
      if (!this.isSmashActive && this.quantumTimer <= 0) {
        const collided = this.pillars.checkCollision(this.rocket);
        if (collided) {
          if (this.shieldActive) {
            this.shieldActive = false;
            collided.isDestroyed = true;
            this.hud.triggerSmashEffects();
            this.particles.emitPillarSmash(collided.x + (collided.width || 52) / 2, collided.gapY || 350);
            this.audio.playSmash();
            this.quantumTimer = 0.6;
            this.rocket.isQuantum = true;
          } else {
            this._die();
            return;
          }
        }
      }
    } else if (this.state === 'GAMEOVER') {
      this.timeSinceDeath += dt;
      if (this.timeSinceDeath >= 0.1 && (hasTap || hasDoubleTap)) {
        this._restart();
      }
    }
  }

  render() {
    this.ctx.save();

    const shake = this.hud.getShakeOffset();
    this.ctx.translate(shake.x, shake.y);

    this.starfield.draw(this.ctx);

    for (const p of this.pillars.pillars) {
      if (!p.isDestroyed) {
        EntityRenderer.drawLaserPillar(this.ctx, p, this.height);
      }
    }

    // Draw Floating Energy Cells
    this.energyCells.draw(this.ctx);

    this.particles.draw(this.ctx);

    if (this.ghosts) this.ghosts.draw(this.ctx);

    // Draw Drunk Magnet Field Lines around Rocket
    if (this.hasDrunkMagnet && !this.rocket.isDead && this.state !== 'GAMEOVER') {
      this.ctx.save();
      const mPulse = Math.sin(this.totalTime * 6) * 4;
      const mRadius = 40 + mPulse;

      this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
      this.ctx.lineWidth = 1.5;
      this.ctx.setLineDash([4, 6]);

      this.ctx.beginPath();
      this.ctx.arc(this.rocket.x, this.rocket.y, mRadius, -Math.PI * 0.7, Math.PI * 0.7);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.arc(this.rocket.x - 6, this.rocket.y, mRadius - 10, -Math.PI * 0.6, Math.PI * 0.6);
      this.ctx.stroke();

      this.ctx.fillStyle = '#00f0ff';
      this.ctx.font = 'bold 11px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('🧲 MAGNET', this.rocket.x, this.rocket.y - this.rocket.radius - 12);
      this.ctx.restore();
    }

    // Draw Rocket with funny comical styling
    EntityRenderer.drawRocket(this.ctx, this.rocket, {
      isDead: this.state === 'GAMEOVER',
      isSmashing: this.isSmashActive,
      justScored: this.justScoredTimer > 0
    });

    // Quantum Drift Hologram / Ready indicator
    if (this.hasQuantumDrift && this.state !== 'GAMEOVER') {
      if (this.quantumTimer > 0) {
        this.ctx.save();
        this.ctx.strokeStyle = '#00f0ff';
        this.ctx.lineWidth = 1.5;
        this.ctx.setLineDash([4, 4]);
        this.ctx.beginPath();
        this.ctx.arc(this.rocket.x, this.rocket.y, this.rocket.radius + 14, 0, Math.PI * 2);
        this.ctx.stroke();

        for (let qi = 0; qi < 3; qi++) {
          const qAngle = this.totalTime * 10 + qi * (Math.PI * 2 / 3);
          const qx1 = this.rocket.x + Math.cos(qAngle) * (this.rocket.radius + 6);
          const qy1 = this.rocket.y + Math.sin(qAngle) * (this.rocket.radius + 6);
          const qx2 = this.rocket.x + Math.cos(qAngle + 0.5) * (this.rocket.radius + 14);
          const qy2 = this.rocket.y + Math.sin(qAngle + 0.5) * (this.rocket.radius + 14);
          this.ctx.strokeStyle = '#ffffff';
          this.ctx.beginPath();
          this.ctx.moveTo(qx1, qy1);
          this.ctx.lineTo(qx2, qy2);
          this.ctx.stroke();
        }
        this.ctx.restore();
      } else if (this.quantumCooldownTimer <= 0) {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        this.ctx.lineWidth = 1.2;
        this.ctx.beginPath();
        this.ctx.arc(this.rocket.x, this.rocket.y, this.rocket.radius + 6, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
      }
    }

    // Beer Bubble Plasma Shield FX
    if (this.shieldActive && this.state !== 'GAMEOVER') {
      this.ctx.save();
      const pulse = Math.sin(this.totalTime * 8) * 2;
      const shRadius = this.rocket.radius + 12 + pulse;

      const grad = this.ctx.createRadialGradient(
        this.rocket.x, this.rocket.y, this.rocket.radius * 0.5,
        this.rocket.x, this.rocket.y, shRadius + 6
      );
      grad.addColorStop(0, 'rgba(0, 240, 255, 0.05)');
      grad.addColorStop(0.65, 'rgba(255, 209, 59, 0.15)');
      grad.addColorStop(0.95, 'rgba(0, 240, 255, 0.4)');
      grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(this.rocket.x, this.rocket.y, shRadius + 6, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = 10;
      this.ctx.lineWidth = 2.5;
      this.ctx.strokeStyle = '#00f0ff';
      this.ctx.beginPath();
      this.ctx.arc(this.rocket.x, this.rocket.y, shRadius, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.lineWidth = 1.2;
      this.ctx.strokeStyle = '#ffd13b';
      this.ctx.beginPath();
      this.ctx.arc(this.rocket.x - 3, this.rocket.y - 3, shRadius * 0.75, -Math.PI * 0.4, Math.PI * 0.2);
      this.ctx.stroke();

      for (let bi = 0; bi < 4; bi++) {
        const bAngle = this.totalTime * 4 + bi * (Math.PI / 2);
        const bx = this.rocket.x + Math.cos(bAngle) * shRadius;
        const by = this.rocket.y + Math.sin(bAngle) * shRadius;
        this.ctx.fillStyle = bi % 2 === 0 ? '#ffd13b' : '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    if (this.perks) this.perks.draw(this.ctx, this.width, this.height);
    this.hud.draw(
      this.ctx,
      this.state,
      this.score,
      this.bestScore,
      this.totalTime,
      this.timeSinceDeath,
      this.drunkMeter,
      this.isSmashActive,
      this.smashChainCount || 1
    );

    this.ctx.restore();
  }

  loop(timestamp) {
    if (!this.isRunning) return;

    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    requestAnimationFrame(this.loop);
  }
}
