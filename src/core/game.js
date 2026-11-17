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
    this.nearMissMultiplier = 1;
    this.smashChainCount = 1;
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
        if (clientY >= 240 && clientY <= 315) this.perks.selectCard(0);
        else if (clientY >= 335 && clientY <= 410) this.perks.selectCard(1);
        else if (clientY >= 430 && clientY <= 505) this.perks.selectCard(2);
      }
    });

    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('keydown', (e) => {
      if (this.perks && this.perks.isDrafting) {
        if (e.key === '1') this.perks.selectCard(0);
        if (e.key === '2') this.perks.selectCard(1);
        if (e.key === '3') this.perks.selectCard(2);
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
    this.rocket.reset(100, 320);
    if (this.perks) this.perks.reset();
    this.shieldActive = false;
    this.hasQuantumDrift = false;
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
    this.drunkMeter = Math.min(100, this.drunkMeter + 5); // +5% on normal pass
    this.audio.playScore();
    this.particles.emitScoreSparkles(this.rocket.x + 20, this.rocket.y);

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
    this.drunkMeter = Math.min(100, this.drunkMeter + (35 * this.nearMissMultiplier));
    this.audio.playNearMiss();
    this.hud.showNearMiss(bonus);
    this.particles.emitNearMiss(this.rocket.x, this.rocket.y);

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
    this.smashDuration = 0.8; // 0.8s smash rush
    this.drunkMeter = 0; // Consume energy

    this.audio.playSmash();
    this.hud.triggerSmashEffects();

    // Destroy closest pillar ahead
    for (let k = 0; k < this.smashChainCount; k++) {
      const smashed = this.pillars.destroyFrontPillar(this.rocket.x);
      if (smashed) {
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
  }

  _die() {
    this.state = 'GAMEOVER';
    this.timeSinceDeath = 0;
    this.deathCount++;
    localStorage.setItem('drunk_rocket_deaths', this.deathCount.toString());

    this.audio.playCrash();
    this.hud.triggerCrashEffects();
    this.particles.emitExplosion(this.rocket.x, this.rocket.y);

    const runDuration = performance.now() - this.runStartTime;
    if (this.ghosts) this.ghosts.submitGhost(localStorage.getItem('drunk_player_name') || 'ACE', this.score, this.rocket.y);
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

    if (this.perks && this.perks.isDrafting) {
      this.perks.update(dt);
      return; // Freeze main action while drafting in Bullet Time
    }

    if (this.passiveChargeRate > 0) {
      this.drunkMeter = Math.min(100, this.drunkMeter + this.passiveChargeRate * dt);
    }

    if (this.quantumTimer > 0) {
      this.quantumTimer -= dt;
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
        if (this.hasQuantumDrift) this.quantumTimer = 0.3;
      }
    } else if (this.state === 'PLAYING') {
      // Overdrive Smash Trigger
      if (hasDoubleTap && this.drunkMeter >= 100) {
        this._triggerSupernovaSmash();
      }

      // Handle Smash state timer
      if (this.isSmashActive) {
        this.smashDuration -= dt;
        this.rocket.vx = 280; // Boost forward
        this.particles.emitThrust(this.rocket.x, this.rocket.y, this.rocket.rotation, 6);
        if (this.smashDuration <= 0) {
          this.isSmashActive = false;
          this.rocket.vx = 0;
        }
      }

      // Single Tap Thrust
      if (hasTap) {
        this.rocket.thrust();
        this.audio.playThrust();
        this.particles.emitThrust(this.rocket.x, this.rocket.y, this.rocket.rotation);
        if (this.hasQuantumDrift) this.quantumTimer = 0.3;
      }

      this.rocket.update(dt, false, this.totalTime);
      this.pillars.update(dt, this.rocket, this._onScore, this._onNearMiss);
      if (this.ghosts) this.ghosts.update(dt, this.pillars.speed);

      // Boundary collision check
      if (this.rocket.y < 0 || this.rocket.y > this.height) {
        this._die();
        return;
      }

      // Pillar collision check (ignored if Smash is active or Quantum invulnerable)
      if (!this.isSmashActive && this.quantumTimer <= 0) {
        const collided = this.pillars.checkCollision(this.rocket);
        if (collided) {
          if (this.shieldActive) {
            this.shieldActive = false;
            collided.isDestroyed = true;
            this.hud.triggerSmashEffects();
            this.particles.emitPillarSmash(collided.x, collided.gapY);
            this.audio.playSmash();
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
    EntityRenderer.drawRocket(this.ctx, this.rocket);
    if (this.shieldActive) {
      this.ctx.strokeStyle = '#00f0ff';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(this.rocket.x, this.rocket.y, this.rocket.radius + 8, 0, Math.PI * 2);
      this.ctx.stroke();
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
