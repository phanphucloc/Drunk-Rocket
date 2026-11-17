import { InputManager } from './input.js';
import { Rocket } from '../entities/rocket.js';
import { LaserPillarManager } from '../entities/laserPillar.js';
import { Starfield } from '../graphics/starfield.js';
import { ParticleSystem } from '../graphics/particles.js';
import { EntityRenderer } from '../graphics/renderer.js';
import { AudioSynthesizer } from '../audio/audioSynth.js';
import { HUD } from '../ui/hud.js';
import { LeaderboardModal } from '../ui/leaderboardModal.js';
import { ShareCard } from '../ui/shareCard.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Virtual resolution (Aspect ratio 400x700 ~ 9:16 mobile portrait)
    this.width = 400;
    this.height = 700;
    this.scale = 1;

    // Game state: "READY", "PLAYING", "GAMEOVER"
    this.state = 'READY';

    // Core managers
    this.input = new InputManager(this.canvas);
    this.audio = new AudioSynthesizer();
    this.starfield = new Starfield(this.width, this.height);
    this.particles = new ParticleSystem();
    this.pillars = new LaserPillarManager(this.width, this.height);
    this.hud = new HUD(this.width, this.height);
    this.rocket = new Rocket(100, 320);
    this.leaderboard = new LeaderboardModal('https://drunk-rocket-backend.ppldhsp.workers.dev');

    // Scoring, Telemetry & Statistics
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('drunk_rocket_best') || '0', 10);
    this.deathCount = parseInt(localStorage.getItem('drunk_rocket_deaths') || '0', 10);
    this.flightStartTime = 0;
    this.lastFlightDurationMs = 0;

    // Timers
    this.lastTime = 0;
    this.totalTime = 0;
    this.timeSinceDeath = 0;
    this.isRunning = false;

    // DOM UI bindings
    this.btnLeaderboard = document.getElementById('btn-open-leaderboard');
    this.btnSound = document.getElementById('btn-toggle-sound');
    this.gameoverActions = document.getElementById('gameover-actions');
    this.btnShare = document.getElementById('btn-share-challenge');
    this.btnSaveScore = document.getElementById('btn-save-score');
    this.toastEl = document.getElementById('toast');

    this._onScore = this._onScore.bind(this);
    this.loop = this.loop.bind(this);

    this._initDomEvents();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  _initDomEvents() {
    this.btnLeaderboard?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.audio.playTap?.();
      this.leaderboard.show(0, 0);
    });

    this.btnSound?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.audio.playTap?.();
      this.audio.isMuted = !this.audio.isMuted;
      this.btnSound.innerText = this.audio.isMuted ? '🔇' : '🔊';
    });

    this.btnShare?.addEventListener('click', async (e) => {
      e.stopPropagation();
      this.audio.playTap?.();
      const res = await ShareCard.share(this.score, this.deathCount);
      if (res.success) {
        this._showToast(res.method === 'clipboard' ? '✅ Đã copy link thách đấu!' : '🚀 Đã mở chia sẻ!');
      } else {
        this._showToast('⚠️ Không thể chia sẻ tự động');
      }
    });

    this.btnSaveScore?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.audio.playTap?.();
      this.leaderboard.show(this.score, this.lastFlightDurationMs);
    });
  }

  _showToast(msg) {
    if (!this.toastEl) return;
    this.toastEl.innerText = msg;
    this.toastEl.classList.remove('hidden');
    setTimeout(() => {
      this.toastEl.classList.add('hidden');
    }, 2200);
  }

  resize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate scale to fit screen maintaining aspect ratio
    const scaleX = windowWidth / this.width;
    const scaleY = windowHeight / this.height;
    this.scale = Math.min(scaleX, scaleY);

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.canvas.style.width = `${Math.floor(this.width * this.scale)}px`;
    this.canvas.style.height = `${Math.floor(this.height * this.scale)}px`;
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }

  _onScore() {
    this.score++;
    this.audio.playScore();
    this.particles.emitScoreSparkles?.(this.rocket.x, this.rocket.y, 8);

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

    // Calculate flight duration telemetry (for anti-cheat)
    this.lastFlightDurationMs = Math.max(0, Math.floor(performance.now() - this.flightStartTime));

    this.rocket.die();
    this.particles.emitExplosion(this.rocket.x, this.rocket.y);
    this.hud.triggerCrashEffects();
    this.audio.playCrash();

    // Fanfare celebratory chime if player earned a medal (score >= 3)
    if (this.score >= 3) {
      setTimeout(() => {
        if (this.state === 'GAMEOVER') {
          this.audio.playMedal?.();
        }
      }, 450);
    }

    // Show Game Over action buttons
    if (this.gameoverActions) {
      this.gameoverActions.classList.remove('hidden');
    }
  }

  _restart() {
    if (this.gameoverActions) {
      this.gameoverActions.classList.add('hidden');
    }

    this.state = 'PLAYING';
    this.score = 0;
    this.rocket.reset();
    this.pillars.reset();
    this.particles.reset();
    this.flightStartTime = performance.now();

    // Give an initial slight thrust impulse
    this.rocket.vy = -200;
    this.audio.playThrust();
  }

  update(dt) {
    this.totalTime += dt;
    this.hud.update(dt);
    this.starfield.update(dt);
    this.particles.update(dt);

    // Don't process game taps when leaderboard modal is open
    if (this.leaderboard.isOpen) {
      this.input.consumeTap();
      return;
    }

    const hasTap = this.input.consumeTap();

    if (this.state === 'READY') {
      // Bob the rocket gently in ready state
      this.rocket.y = 320 + Math.sin(this.totalTime * 3) * 12;
      this.rocket.angle = Math.sin(this.totalTime * 3) * 0.1;

      if (hasTap) {
        this.state = 'PLAYING';
        this.flightStartTime = performance.now();
        this.rocket.vy = -300;
        this.audio.playThrust();
        this.particles.emitThrust(this.rocket.x, this.rocket.y, this.rocket.angle);
      }
    } else if (this.state === 'PLAYING') {
      if (hasTap) {
        this.audio.playThrust();
        this.particles.emitThrust(this.rocket.x, this.rocket.y, this.rocket.angle);
      }

      // Update rocket physics
      this.rocket.update(dt, hasTap, this.totalTime);

      // Continuous smoke trail if thrusting
      if (this.rocket.isThrusting && Math.random() < 0.4) {
        this.particles.emitThrust(this.rocket.x, this.rocket.y, this.rocket.angle);
      }

      // Update obstacles
      this.pillars.update(dt, this.rocket, this._onScore);

      // Collision checks
      // 1. Floor or Ceiling collision
      if (this.rocket.y - this.rocket.radius <= 0 || this.rocket.y + this.rocket.radius >= this.height) {
        this._die();
        return;
      }

      // 2. Pillar laser collisions
      if (this.pillars.checkCollision(this.rocket)) {
        this._die();
        return;
      }
    } else if (this.state === 'GAMEOVER') {
      this.timeSinceDeath += dt;

      // Instant Respawn (<0.1s lock out only to prevent accidental same-frame re-tap)
      if (this.timeSinceDeath >= 0.1 && hasTap) {
        this._restart();
      }
    }
  }

  render() {
    this.ctx.save();

    // Apply Screen Shake offset if active
    const shake = this.hud.getShakeOffset();
    this.ctx.translate(shake.x, shake.y);

    // 1. Draw Starfield Background
    this.starfield.draw(this.ctx);

    // 2. Draw Obstacles
    for (const p of this.pillars.pillars) {
      EntityRenderer.drawLaserPillar(this.ctx, p, this.height);
    }

    // 3. Draw Particles (Smoke & Debris)
    this.particles.draw(this.ctx);

    // 4. Draw Rocket
    EntityRenderer.drawRocket(this.ctx, this.rocket);

    // 5. Draw HUD & UI overlays
    this.hud.draw(
      this.ctx,
      this.state,
      this.score,
      this.bestScore,
      this.totalTime,
      this.timeSinceDeath
    );

    this.ctx.restore();
  }

  loop(timestamp) {
    if (!this.isRunning) return;

    // Delta time in seconds, clamped to 0.1s to prevent huge jumps
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    requestAnimationFrame(this.loop);
  }
}
