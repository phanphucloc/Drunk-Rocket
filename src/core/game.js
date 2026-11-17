import { InputManager } from './input.js';
import { Rocket } from '../entities/rocket.js';
import { LaserPillarManager } from '../entities/laserPillar.js';
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
    this.hud = new HUD(this.width, this.height);
    this.rocket = new Rocket(100, 320);
    this.perks = new PerkDraftManager(this);
    this.ghosts = new GhostManager();
    this.shieldActive = false;
    this.hasQuantumDrift = false;
    this.quantumTimer = 0;
    this.perkDraftCooldown = 0;
    this.nearMissMultiplier = 1;
    this.smashChainCount = 1;
    this.smashedCountInSupernova = 0;
    this.maxSmashCount = 1;
    this.passiveChargeRate = 0;

    this.leaderboard = new LeaderboardModal('https://drunk-rocket-backend.ppldhsp.workers.dev');

    // Scoring & Overdrive
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('drunk_rocket_best') || '0', 10);
    this.deathCount = parseInt(localStorage.getItem('drunk_rocket_deaths') || '0', 10);

    // Drunk-Meter Overdrive (0 to 100)
    this.drunkMeter = 0;
    this.isSmashActive = false;
    this.smashDuration = 0;

    // Timers
    this.lastTime = 0;
    this.totalTime = 0;
    this.timeSinceDeath = 0;
    this.runStartTime = 0;
    this.isRunning = false;

    this._onScore = this._onScore.bind(this);
    this._onNearMiss = this._onNearMiss.bind(this);
    this.loop = this.loop.bind(this);

    this.canvas.addEventListener('pointerdown', (e) => {
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
          this.perkDraftCooldown = 0.25;
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
          this.perkDraftCooldown = 0.25;
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
    if (this.perks) this.perks.reset();
    this.shieldActive = false;
    this.hasQuantumDrift = false;
    this.quantumTimer = 0;
    this.perkDraftCooldown = 0;
    this.nearMissMultiplier = 1;
    this.smashChainCount = 1;
    this.passiveChargeRate = 0;
    this.pillars.reset();
    this.particles.reset();
    this.state = 'READY';
    this.timeSinceDeath = 0;
  }

  _onScore(pillar) {
    this.score += 1;
    // Exactly 5 points to 100% full Overdrive Smash (+20% per regular obstacle)
    this.drunkMeter = Math.min(100, this.drunkMeter + 20);
    this.audio.playScore();
    this.particles.emitScoreSparkles(this.rocket.x + 20, this.rocket.y);

    // Exciting energy siphon stream flying from cleared pillar directly into Overdrive Orb
    const pX = pillar ? pillar.x + (pillar.width || 52) / 2 : this.rocket.x + 20;
    const pY = pillar ? pillar.gapY : this.rocket.y;
    this.particles.emitEnergySiphon(pX, pY, this.width / 2, 126, 9);

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
    // Near-Miss offers instant high-voltage Overdrive charge (+50% base)
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

  _triggerSupernovaSmash() {
    if (this.drunkMeter < 100 || this.isSmashActive) return;

    this.isSmashActive = true;
    this.smashDuration = 0.85;
    this.drunkMeter = 0;
    this.smashedCountInSupernova = 0;
    this.maxSmashCount = this.smashChainCount || 1;

    this.audio.playSmash();
    this.hud.triggerSmashEffects();

    // Smash up to maxSmashCount columns ahead immediately
    const smashedList = this.pillars.destroyFrontPillars(this.rocket.x, this.maxSmashCount);
    for (const smashed of smashedList) {
      this.smashedCountInSupernova++;
      this.score += 3;
      this.particles.emitPillarSmash(smashed.x + smashed.width / 2, smashed.gapY);
      if (this.perks) this.perks.checkMilestone(this.score);
      if (this.ghosts) this.ghosts.spawnForPillar(smashed, this.score);
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        localStorage.setItem('drunk_rocket_best', this.bestScore.toString());
      }
    }
  }

  _die() {
    if (this.state === 'GAMEOVER') return;
    this.state = 'GAMEOVER';
    this.timeSinceDeath = 0;
    this.deathCount++;
    localStorage.setItem('drunk_rocket_deaths', this.deathCount.toString());

    this.audio.playCrash();
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

    // While drafting cards, suppress all inputs and freeze flight
    if (this.perks && this.perks.isDrafting) {
      this.input.consumeTap();
      this.input.consumeDoubleTap();
      this.perks.update(dt);
      return;
    }

    // Post-draft cooldown to prevent tap leaking into rocket thrust
    if (this.perkDraftCooldown > 0) {
      this.perkDraftCooldown -= dt;
      this.input.consumeTap();
      this.input.consumeDoubleTap();
    }

    if (this.passiveChargeRate > 0) {
      this.drunkMeter = Math.min(100, this.drunkMeter + this.passiveChargeRate * dt);
    }

    if (this.quantumTimer > 0) {
      this.quantumTimer -= dt;
      this.rocket.isQuantum = (this.quantumTimer > 0);
      // Guarantee safe passage: mark any pillar overlapping rocket during quantum drift
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
        if (this.hasQuantumDrift) {
          this.quantumTimer = 0.85;
          this.rocket.isQuantum = true;
        }
      }
    } else if (this.state === 'PLAYING') {
      if (hasDoubleTap && this.drunkMeter >= 100) {
        this._triggerSupernovaSmash();
      }

      if (this.isSmashActive) {
        this.smashDuration -= dt;
        this.rocket.vx = 280;
        this.particles.emitThrust(this.rocket.x, this.rocket.y, this.rocket.rotation, 6);

        // Chain Reaction: continuously smash oncoming pillars up to maxSmashCount
        if (this.smashedCountInSupernova < this.maxSmashCount) {
          for (const p of this.pillars.pillars) {
            if (!p.isDestroyed && p.x <= this.rocket.x + 120 && p.x + p.width >= this.rocket.x - 20) {
              p.isDestroyed = true;
              this.smashedCountInSupernova++;
              this.score += 3;
              this.audio.playSmash();
              this.hud.triggerSmashEffects();
              this.particles.emitPillarSmash(p.x + p.width / 2, p.gapY);
              if (this.perks) this.perks.checkMilestone(this.score);
              if (this.ghosts) this.ghosts.spawnForPillar(p, this.score);
              if (this.score > this.bestScore) {
                this.bestScore = this.score;
                localStorage.setItem('drunk_rocket_best', this.bestScore.toString());
              }
              if (this.smashedCountInSupernova >= this.maxSmashCount) break;
            }
          }
        }

        if (this.smashDuration <= 0) {
          this.isSmashActive = false;
          this.rocket.vx = 0;
        }
      }

      if (hasTap) {
        this.rocket.thrust();
        this.audio.playThrust();
        this.particles.emitThrust(this.rocket.x, this.rocket.y, this.rocket.rotation);
        if (this.hasQuantumDrift) {
          this.quantumTimer = 0.85;
          this.rocket.isQuantum = true;
        }
      }

      this.rocket.update(dt, false, this.totalTime);
      this.pillars.update(dt, this.rocket, this._onScore, this._onNearMiss);
      if (this.ghosts) this.ghosts.update(dt, this.pillars.speed);

      // Boundary collision check (ceiling or floor)
      if (this.rocket.y - this.rocket.radius <= 0 || this.rocket.y + this.rocket.radius >= this.height) {
        this._die();
        return;
      }

      // Pillar collision check
      if (!this.isSmashActive && this.quantumTimer <= 0) {
        const collided = this.pillars.checkCollision(this.rocket);
        if (collided) {
          if (this.shieldActive) {
            this.shieldActive = false; // Khiên vỡ
            collided.isDestroyed = true; // Cột bị phá hủy
            this.hud.triggerSmashEffects();
            this.particles.emitPillarSmash(collided.x + (collided.width || 52) / 2, collided.gapY || 350);
            this.audio.playSmash();
            this.quantumTimer = 0.6; // 0.6s bất tử sau khi vỡ khiên
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

    this.particles.draw(this.ctx);

    if (this.ghosts) this.ghosts.draw(this.ctx);

    // Draw Rocket (with quantum ghost transparency if active)
    EntityRenderer.drawRocket(this.ctx, this.rocket);

    // Cinematic Quantum Drift Hologram FX
    if (this.quantumTimer > 0) {
      this.ctx.save();
      this.ctx.strokeStyle = '#00f0ff';
      this.ctx.lineWidth = 1.5;
      this.ctx.setLineDash([4, 4]);
      this.ctx.beginPath();
      this.ctx.arc(this.rocket.x, this.rocket.y, this.rocket.radius + 14, 0, Math.PI * 2);
      this.ctx.stroke();

      // Quantum lightning flicker
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
    }

    // Cinematic Beer Bubble Plasma Shield FX
    if (this.shieldActive) {
      this.ctx.save();
      const pulse = Math.sin(this.totalTime * 8) * 2;
      const shRadius = this.rocket.radius + 12 + pulse;

      // 1. Atmospheric Plasma Outer Aura
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

      // 2. Dual Neon Resonant Energy Rings
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = 10;
      this.ctx.lineWidth = 2.5;
      this.ctx.strokeStyle = '#00f0ff';
      this.ctx.beginPath();
      this.ctx.arc(this.rocket.x, this.rocket.y, shRadius, 0, Math.PI * 2);
      this.ctx.stroke();

      // Secondary Gold Energy Crest
      this.ctx.lineWidth = 1.2;
      this.ctx.strokeStyle = '#ffd13b';
      this.ctx.beginPath();
      this.ctx.arc(this.rocket.x - 3, this.rocket.y - 3, shRadius * 0.75, -Math.PI * 0.4, Math.PI * 0.2);
      this.ctx.stroke();

      // 3. Orbiting Beer Foam Plasma Micro-Bubbles
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
      this.isSmashActive
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
