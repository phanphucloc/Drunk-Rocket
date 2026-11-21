import { InputManager } from './input.js';
import { Rocket } from '../entities/rocket.js';
import { LaserPillarManager } from '../entities/laserPillar.js';
import { EnergyCellManager } from '../entities/energyCell.js';
import { Starfield } from '../graphics/starfield.js';
import { WeatherSystem } from '../graphics/weather.js';
import { ScenicLandmarksManager } from '../graphics/scenicLandmarks.js';
import { drawNightLights } from '../graphics/nightLights.js';
import { ParticleSystem } from '../graphics/particles.js';
import { EntityRenderer } from '../graphics/renderer.js';
import { AudioSynthesizer } from '../audio/audioSynth.js';
import { HUD } from '../ui/hud.js';
import { StoryOverlay } from '../ui/storyOverlay.js';
import { infoPanels } from '../ui/infoPanels.js';
import { LeaderboardModal } from '../ui/leaderboardModal.js';
import { ShareCard } from '../ui/shareCard.js';
import { PerkDraftManager } from './perks.js';
import { GhostManager } from '../entities/ghosts.js';
import { getProgression, getThemeForScore, difficultyFor, POINTS_PER_CHAPTER } from './progression.js';
import { toggleLang, t } from '../i18n.js';
import { recordStamp } from './stamps.js';
import { CONFIG } from '../config.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    // Canvas nền mờ (cinematic): lấp khoảng trống khi màn hình rộng/cao.
    this.bgCanvas = document.getElementById('scene-backdrop');
    this.bgCtx = this.bgCanvas ? this.bgCanvas.getContext('2d') : null;
    this._bgFrame = 0;
    // Vẽ cảnh vào buffer 400x700 rồi blit 1 lần sang canvas hiển thị:
    // mọi setTransform(1,0,0,1,0,0) trong 8k dòng vẽ cảnh vẫn đúng,
    // còn canvas hiển thị vẫn nét theo DPR mà không phải vẽ cảnh ở độ phân giải lớn.
    this.buffer = document.createElement('canvas');
    this.buffer.width = 400;
    this.buffer.height = 700;
    this.bctx = this.buffer.getContext('2d');

    this.width = 400;
    this.height = 700;
    this.scale = 1;

    this.state = 'READY';

    this.input = new InputManager(this.canvas);
    this.audio = new AudioSynthesizer();
    this.starfield = new Starfield(this.width, this.height);
    this.scenic = new ScenicLandmarksManager(this.width, this.height);
    // Thời tiết vẽ đè lên cảnh địa danh nên luôn nhìn thấy; starfield chỉ còn giữ nền trời.
    this.starfield.externalWeather = true;
    this.starfield.weather = 'none';
    this.weather = new WeatherSystem(this.width, this.height);
    this.weather.onAmbientChange = (ambient) => {
      if (this.audio && this.audio.setAmbientTheme) this.audio.setAmbientTheme(ambient);
    };
    this.weather.onLightning = () => {
      if (this.audio && this.audio.playThunderClap) this.audio.playThunderClap();
    };
    this.particles = new ParticleSystem();
    this.pillars = new LaserPillarManager(this.width, this.height);
    this.energyCells = new EnergyCellManager(this.width, this.height);
    this.hud = new HUD(this.width, this.height);
    this.story = new StoryOverlay(this.width, this.height);
    this.rocket = new Rocket(100, 320);
    this.perks = new PerkDraftManager(this);
    this.ghosts = new GhostManager();
    this.currentTheme = getThemeForScore(0);
    this.kiteStage = 1;
    this.colorStage = 1;
    this.gatesPassed = 0;
    this.difficulty = difficultyFor(0);
    this.lapNumber = 1;
    this.chapterNumber = 1;
    this._chapterGlobal = 0;
    this._progState = null;
    this.smashTargets = [];
    this.nextSmashChain = 0;
    this.smashPillarsLeft = 0;
    this.smashSpeedMul = 1;
    this.smashReturnTimer = 0;
    this.hitStopTimer = 0;
    this.holdProgress = 0;
    this.ceilingHits = 0;
    this.cellCombo = 0;
    this.cellComboTimer = 0;
    this.starfield.setTheme(this.currentTheme);
    this.weather.setTheme(this.currentTheme);
    if (this.audio && this.audio.setAmbientTheme) this.audio.setAmbientTheme(this.weather.ambient, true);
    if (this.audio && this.audio.setMusicTheme) this.audio.setMusicTheme(this.currentTheme.music, true);
    this.dragonCelebrated = false;
    this.introShown = false;
    this.paused = false;
    // Bất tử ngắn mỗi lần đổi chương (tránh chết oan khi cảnh vừa đổi, người chơi đang nhìn)
    this.invincibleTimer = 0;
    if (infoPanels) infoPanels.setLandmark(this.currentTheme, 1, 1);

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

    this.leaderboard = new LeaderboardModal(CONFIG.leaderboardUrl);

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

    // Kích hoạt sấm sét đồng bộ với chớp điện ảnh
    if (this.starfield) {
      this.starfield.onLightning = () => {
        if (this.audio) this.audio.playThunderClap();
      };
    }

    // Kết nối nút bấm thanh công cụ TOP, Âm thanh & Game Over
    this._bindToolbarButtons();

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
      if (this.state === 'PLAYING' && this.drunkMeter >= 100 && this.score >= 10 && distToOrb <= 36) {
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
    // Đo VISUAL VIEWPORT: đúng cả khi thanh địa chỉ mobile co giãn / desktop zoom.
    const vv = window.visualViewport;
    const vw = Math.max(1, Math.round((vv && vv.width) || window.innerWidth || 400));
    const vh = Math.max(1, Math.round((vv && vv.height) || window.innerHeight || 700));

    const sc = Math.min(vw / this.width, vh / this.height);
    const cssW = Math.max(1, Math.floor(this.width * sc));
    const cssH = Math.max(1, Math.floor(this.height * sc));
    this.scale = sc;

    const lowEnd = (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
                   (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    this.lowEnd = !!lowEnd;
    const dpr = Math.min(lowEnd ? 1.5 : 2, Math.max(1, window.devicePixelRatio || 1));
    this.dpr = dpr;

    this.canvas.style.width = cssW + 'px';
    this.canvas.style.height = cssH + 'px';
    this.canvas.width = Math.round(cssW * dpr);
    this.canvas.height = Math.round(cssH * dpr);

    this.baseSX = this.canvas.width / this.width;
    this.baseSY = this.canvas.height / this.height;
    if (this.ctx && this.ctx.setTransform) {
      this.ctx.setTransform(this.baseSX, 0, 0, this.baseSY, 0, 0);
    }

    if (this.bgCanvas) {
      const bw = Math.max(64, Math.round(cssW / 6));
      const bh = Math.max(64, Math.round(cssH / 6));
      if (this.bgCanvas.width !== bw) this.bgCanvas.width = bw;
      if (this.bgCanvas.height !== bh) this.bgCanvas.height = bh;
    }

    if (window.__DR_DEBUG) console.log('DLG vv=' + (window.visualViewport ? window.visualViewport.width + 'x' + window.visualViewport.height : '-') + ' inner=' + window.innerWidth + 'x' + window.innerHeight + ' css=' + cssW + 'x' + cssH + ' scale=' + sc.toFixed(3) + ' rect=' + Math.round(this.canvas.getBoundingClientRect().width) + 'x' + Math.round(this.canvas.getBoundingClientRect().height));
    if (this.scenic) this.scenic.resize(this.canvas.width, this.canvas.height);
    if (this.weather) this.weather.resize(this.width, this.height);
    if (this.story) this.story.resize(this.width, this.height);
  }

  /** Tự canh lại canvas khi khung hiển thị đổi (xoay máy, thanh địa chỉ, zoom...). */
  startAutoFit() {
    if (this._autoFit) return;
    this._autoFit = true;
    const fit = () => {
      const vv = window.visualViewport;
      const vw = Math.max(1, Math.round((vv && vv.width) || window.innerWidth || 1));
      const vh = Math.max(1, Math.round((vv && vv.height) || window.innerHeight || 1));
      const sc = Math.min(vw / this.width, vh / this.height);
      const expW = Math.max(1, Math.floor(this.width * sc)) + 'px';
      const expH = Math.max(1, Math.floor(this.height * sc)) + 'px';
      if (this.canvas.style.width !== expW || this.canvas.style.height !== expH) {
        this.resize();
      }
    };
    if (typeof ResizeObserver !== 'undefined') {
      try { this._ro = new ResizeObserver(fit); this._ro.observe(this.canvas.parentElement); } catch (e) {}
    }
    window.addEventListener('orientationchange', () => setTimeout(fit, 180));
    if (window.visualViewport) window.visualViewport.addEventListener('resize', fit);
    window.addEventListener('resize', fit);
    setInterval(fit, 800);
    setTimeout(fit, 60);
    setTimeout(fit, 400);
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
    this.currentTheme = getThemeForScore(0);
    this.kiteStage = 1;
    this.colorStage = 1;
    this.gatesPassed = 0;
    this.lapNumber = 1;
    this.difficulty = difficultyFor(0);
    this.chapterNumber = 1;
    this._chapterGlobal = 0;
    this._progState = null;
    this.nextSmashChain = 0;
    this.smashChainCount = 1;
    this.smashPillarsLeft = 0;
    this.smashSpeedMul = 1;
    this.smashReturnTimer = 0;
    this.hitStopTimer = 0;
    if (this.pillars) this.pillars.speedMul = 1;
    if (this.starfield) this.starfield.setTheme(this.currentTheme);
    if (this.weather) this.weather.setTheme(this.currentTheme);
    if (this.audio) {
      if (this.audio.stopLaserProximity) this.audio.stopLaserProximity();
      if (this.audio.stopAmbient) this.audio.stopAmbient();
    }
    const gameoverActions = document.getElementById('gameover-actions');
    if (gameoverActions) gameoverActions.classList.add('hidden');
    this.state = 'READY';
    this.timeSinceDeath = 0;
    this.dragonCelebrated = false;
    this.invincibleTimer = 0;
    if (infoPanels) infoPanels.setLandmark(this.currentTheme, 1, 1);
    if (this.audio && this.audio.setMusicTheme) this.audio.setMusicTheme(this.currentTheme.music, true);
    if (this.story) this.story.phase = 'idle';
  }

  /**
   * NGUON SU THAT DUY NHAT cho tien trinh: tinh lai tu SO CONG da vuot.
   * Diem (near-miss / smash / hat gio) KHONG lam nhay chuong -> nhip thoi tiet on dinh.
   */
  _syncProgression(force = false) {
    const prog = getProgression(this.score);
    const prev = this._progState;
    this._progState = prog;

    this.currentTheme = prog.theme;
    this.kiteStage = prog.kiteStage;
    this.colorStage = prog.colorStage;
    this.lapNumber = prog.lapNumber;
    this.chapterNumber = prog.chapterNumber;
    this._chapterGlobal = prog.globalChapter;
    this.difficulty = difficultyFor(prog.lapIndex);
    if (this.pillars) this.pillars.tierBoost = prog.lapIndex * 2;

    const chapterChanged = force || !prev || prog.globalChapter !== prev.globalChapter;
    const lapChanged = force || !prev || prog.lapNumber !== prev.lapNumber;

    if (chapterChanged || lapChanged) {
      this.starfield.setTheme(this.currentTheme);
      if (this.weather) this.weather.setTheme(this.currentTheme);
      if (this.scenic) this.scenic.setTier(this.currentTheme.tier);
      if (this.audio && this.audio.setMusicTheme) this.audio.setMusicTheme(this.currentTheme.music);
      this.hud.triggerSmashEffects();
      this.invincibleTimer = Math.max(this.invincibleTimer, 1.2);
      if (infoPanels) infoPanels.setLandmark(this.currentTheme, prog.lapNumber, prog.chapterNumber, true,
        this.score % POINTS_PER_CHAPTER, POINTS_PER_CHAPTER);
    }
    if (lapChanged && this.audio && this.audio.playKiteUpgrade) {
      this.audio.playKiteUpgrade(prog.kiteStage);
    }
    return prog;
  }

  _onScore(pillar) {
    this.score += 1;
    this.justScoredTimer = 0.6;

    // CONG da vuot la nguon tien trinh (chuong/vong/mau dieu);
    // diem chi dung cho bang xep hang.
    this._syncProgression();
    if (infoPanels) infoPanels.setLandmark(this.currentTheme, this.lapNumber, this.chapterNumber, false,
      this.score % POINTS_PER_CHAPTER, POINTS_PER_CHAPTER);

    // Mốc mở TÚI BÙA tính theo ĐIỂM
    if (this.perks) this.perks.checkMilestone(this.score);

    // Regular pillar gives +10% Overdrive (10 pillars cleared = 100% Smash ready)
    this.drunkMeter = Math.min(100, this.drunkMeter + 10);
    this.audio.playScore(); // Cheerful "HEYYY!" sound
    this.particles.emitScoreSparkles(this.rocket.x + 20, this.rocket.y);

    const pX = pillar ? pillar.x + (pillar.width || 52) / 2 : this.rocket.x + 20;
    const pY = pillar ? pillar.gapY : this.rocket.y;
    this.particles.emitEnergySiphon(pX, pY, this.width / 2, 126, 9);

    // Spawn 2 to 4 moving floating energy particles midway between the cleared pillar and upcoming pillar
    const upcomingPillars = this.pillars.pillars.filter(p => !p.passed && !p.isDestroyed && p.x > (pillar ? pillar.x : this.rocket.x));
    const nextPillar = upcomingPillars.length > 0 ? upcomingPillars[0] : null;

    let midX;
    if (nextPillar && pillar) {
      const clearedRight = pillar.x + (pillar.width || 52);
      midX = (clearedRight + nextPillar.x) / 2;
    } else if (pillar) {
      midX = pillar.x + (pillar.width || 52) + 160;
    } else {
      midX = this.rocket.x + 180;
    }

    const clusterCount = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4 cells
    const midY = (pillar && nextPillar) ? (pillar.gapY + nextPillar.gapY) / 2 : (pillar ? pillar.gapY : 350);
    this.energyCells.spawnCluster(midX, midY, clusterCount);

    if (this.perks) this.perks.onPassPillar();

    if (this.ghosts && pillar) this.ghosts.spawnForPillar(pillar, this.score);
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('drunk_rocket_best', this.bestScore.toString());
    }
  }

  _onNearMiss(pillar) {
    const bonus = 2;                 // Near-miss: +2 điểm cố định
    this.score += bonus;
    this._syncProgression();
    if (infoPanels) infoPanels.setLandmark(this.currentTheme, this.lapNumber, this.chapterNumber, false,
      this.score % POINTS_PER_CHAPTER, POINTS_PER_CHAPTER);
    this.justScoredTimer = 0.8;
    this.drunkMeter = Math.min(100, this.drunkMeter + (12 * this.nearMissMultiplier));
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
    // Hạt gió: +5% năng lượng, ăn liên tiếp 3 hạt trong 1.6s thì +1 điểm
    this.drunkMeter = Math.min(100, this.drunkMeter + 5);
    this.cellCombo = (this.cellCombo || 0) + 1;
    this.cellComboTimer = 1.6;
    if (this.cellCombo >= 3) {
      // Combo hạt gió chỉ để đã mắt — KHÔNG cộng điểm
      this.cellCombo = 0;
      this.particles.emitScoreSparkles(cell.x, cell.y);
    }
    if (this.audio.playCellCollect) {
      this.audio.playCellCollect();
    }
    this.particles.emitCellPickup(cell.x, cell.y);
    this.particles.emitEnergySiphon(cell.x, cell.y, this.width / 2, 126, 6);
  }

  /**
   * LONG GIO — lao xuyen cong that (khong con xoa cot tu xa).
   * Dieu lao toi; cham cot nao thi cot do no tung kem hit-stop 45ms.
   */
  /** Vệt nón sáng trước mũi diều khi đang Lộng Gió. */
  _drawSmashLance() {
    const ctx = this.ctx;
    const rx = this.rocket.x;
    const ry = this.rocket.y;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const grad = ctx.createLinearGradient(rx, ry, rx + 120, ry);
    grad.addColorStop(0, 'rgba(255, 236, 170, 0.75)');
    grad.addColorStop(1, 'rgba(255, 170, 60, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(rx + 10, ry - 3);
    ctx.lineTo(rx + 120, ry);
    ctx.lineTo(rx + 10, ry + 3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  _triggerSupernovaSmash(forcedChain = false) {
    if (this.isSmashActive) return;
    const isChain = (this.nextSmashChain >= 2) || forcedChain || (this.smashChainCount >= 2);
    if (!forcedChain && this.drunkMeter < 100) return;

    this.isSmashActive = true;
    this.drunkMeter = 0;
    this.originalRocketX = this.rocket.x;
    this.smashStartX = this.rocket.x;
    this.smashPillarsLeft = isChain ? 2 : 1;
    this.smashSpeedMul = 3.4;
    this.smashReturnTimer = 0;
    this.smashChainCount = isChain ? 2 : 1;
    if (isChain) this.nextSmashChain = 0;
    this.smashLunge = 110;

    // CHỈ cột phía trước mũi diều mới là mục tiêu (chốt theo đối tượng)
    const ahead = this.pillars.pillars
      .filter(p => !p.isDestroyed && p.x > this.rocket.x + this.rocket.radius)
      .sort((a, b) => a.x - b.x);
    this.smashTargets = ahead.slice(0, this.smashPillarsLeft);

    // Điều kiện kết thúc KHÔNG dùng quãng đường cứng:
    // dừng khi diều đã ở GIỮA cột vừa phá và cột kế tiếp (xem update).
    this.smashBehindRight = this.rocket.x;      // mép phải cột đã phá (cập nhật mỗi frame)
    this.smashTime = 0;
    this.smashMaxDuration = 1.6;                // chỉ là chốt an toàn
    this.smashDurationTotal = this.smashMaxDuration;

    const first = ahead[0] || null;
    this.smashAlignY = first ? first.gapY : this.rocket.y;

    this.audio.playSmash(isChain);
    this.hud.triggerSmashEffects();
    this.invincibleTimer = Math.max(this.invincibleTimer, 1.2);
  }

  /** Kết thúc cú Lộng Gió: hạ tốc, trôi về làn bay, bất tử ngắn + cooldown chống smash liên tiếp. */
  _endSmash() {
    this.isSmashActive = false;
    this.smashTargets = [];
    // QoL: người chơi hay quên bấm lại sau cú lướt -> tặng 1 nhịp đẩy để không rơi ngay
    if (this.state === 'PLAYING' && this.rocket && !this.rocket.isDead) {
      this.rocket.thrust();
      if (this.audio && this.audio.playThrust) this.audio.playThrust();
      this.particles.emitThrust(this.rocket.x, this.rocket.y, this.rocket.rotation);
    }
    this.smashSpeedMul = 1;
    if (this.pillars) this.pillars.speedMul = 1;
    this.smashReturnTimer = 0.24;
    this.invincibleTimer = Math.max(this.invincibleTimer, 0.7);
    this.smashChainCount = 1;
    this.smashCooldown = 0.35;          // không cho kích hoạt lại ngay
    if (this.input) this.input.smashRequested = false;
    if (this.perks) this.perks.checkMilestone(this.score);
  }

  /** Tạm dừng toàn bộ gameplay (dùng khi mở popup/bảng điểm/cài đặt). */
  setPaused(paused) {
    const next = !!paused;
    if (this.paused === next) return;
    this.paused = next;

    if (this.input) {
      this.input.consumeTap();
      this.input.consumeDoubleTap();
    }
    if (this.audio) {
      if (next) {
        if (this.audio.stopLaserProximity) this.audio.stopLaserProximity();
        if (this.audio.setMusicDuck) this.audio.setMusicDuck(0.35);
      } else if (this.audio.setMusicDuck) {
        this.audio.setMusicDuck(1);
      }
    }
  }

  _die() {
    if (this.state === 'GAMEOVER') return;
    this.state = 'GAMEOVER';
    if (this.audio && this.audio.stopLaserProximity) this.audio.stopLaserProximity();
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
    const gameoverActions = document.getElementById('gameover-actions');
    if (gameoverActions) gameoverActions.classList.remove('hidden');
    // Chi tu mo bang xep hang khi lap ky luc moi (tranh bat nguoi choi dong popup moi van)
    const isRecord = this.score > 0 && this.score >= this.bestScore;
    if (isRecord && this.leaderboard) {
      this.leaderboard.show(this.score, runDuration);
    } else {
      const act = document.getElementById('gameover-actions');
      if (act) act.classList.remove('hidden');
    }
  }

  update(dt) {
    // Hit-stop 45ms ngay luc huc vo cong (cam giac luc)
    if (this.hitStopTimer > 0) {
      this.hitStopTimer = Math.max(0, this.hitStopTimer - dt);
      if (this.input) {
        this.input.consumeTap();
        this.input.consumeDoubleTap();
      }
      return;
    }

    if (this.paused) {
      if (this.input) {
        this.input.consumeTap();
        this.input.consumeDoubleTap();
      }
      return;
    }
    this.totalTime += dt;
    this.hud.update(dt);
    if (this.audio && this.audio.updateAmbientTick) {
      this.audio.updateAmbientTick(dt);
    }
    if (this.audio && this.audio.updateMusicTick) {
      this.audio.updateMusicTick(dt);
    }
    this.particles.update(dt);
    this.starfield.update(dt, this.state === 'PLAYING' ? 1 : 0.2);
    if (this.scenic) this.scenic.update(dt, this.currentTheme ? this.currentTheme.tier : 1);
    if (this.weather) this.weather.update(dt);

    if (this.invincibleTimer > 0) this.invincibleTimer = Math.max(0, this.invincibleTimer - dt);
    // Sổ tay bưu thiếp: ghi tem khi gặp tổ hợp (địa danh × thời tiết) lần đầu
    this._stampTick = (this._stampTick || 0) + dt;
    if (this._stampTick >= 0.5 && this.state === 'PLAYING') {
      this._stampTick = 0;
      const weatherId = this.weather ? this.weather.current : null;
      const landmarkTier = this.currentTheme ? this.currentTheme.tier : null;
      const key = `${landmarkTier}:${weatherId}`;
      if (weatherId && landmarkTier && key !== this._lastStampKey) {
        this._lastStampKey = key;
        const isNew = recordStamp(landmarkTier, weatherId);
        if (isNew && this.hud && this.hud.showStampToast) this.hud.showStampToast(landmarkTier, weatherId);
      }
    }

    if (this.cellComboTimer > 0) {
      this.cellComboTimer -= dt;
      if (this.cellComboTimer <= 0) this.cellCombo = 0;
    }

    // Độ sáng của đèn ban đêm: trời càng tối (mưa giông, đêm, sương) đèn càng rõ
    const darkTarget = (this.weather && this.weather.isDark) ? 1 : 0;
    this.nightLevel = (this.nightLevel || 0) + (darkTarget - (this.nightLevel || 0)) * Math.min(1, dt * 2.2);
    if (this.story) this.story.update(dt);

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

    if (this.input.updateHold) this.input.updateHold(dt);
    const hasTap = this.input.consumeTap();
    const hasSmash = this.input.consumeSmash ? this.input.consumeSmash() : false;
    this.holdProgress = this.input.holdProgress || 0;

    if (this.state === 'READY') {
      if (this.leaderboard && this.leaderboard.isOpen) {
        this.input.consumeTap();
        this.input.consumeDoubleTap();
        return;
      }
      this.rocket.y = 320 + Math.sin(this.totalTime * 4) * 8;
      this.rocket.rotation = Math.sin(this.totalTime * 3) * 0.1;

      if (hasTap) {
        this.state = 'PLAYING';
        this.runStartTime = performance.now();
        this.invincibleTimer = Math.max(this.invincibleTimer, 1.0);
        this.rocket.thrust();
        this.audio.playThrust();
        if (this.audio.setAmbientTheme && this.weather) {
          this.audio.setAmbientTheme(this.weather.ambient || 'birds');
        }
        this.particles.emitThrust(this.rocket.x, this.rocket.y, this.rocket.rotation);
      }
    } else if (this.state === 'PLAYING') {
      if (this.smashCooldown > 0) this.smashCooldown = Math.max(0, this.smashCooldown - dt);
      if (hasSmash && this.drunkMeter >= 100 && (this.smashCooldown || 0) <= 0) {
        this._triggerSupernovaSmash();
      }

      // ===== LỘNG GIÓ: LƯỚT LIỀN MẠCH — thế giới cuộn đều, diều tiến một đoạn rồi giữ =====
      if (this.isSmashActive) {
        this.smashTimeout -= dt;
        this.smashTime += dt;

        // 1) Cú tiến ngắn (ease-out ~0.22s) — không giật, không dừng giữa chừng
        const lungeT = Math.min(1, this.smashTime / 0.22);
        this.rocket.x = this.smashStartX + (this.smashLunge || 96) * (1 - Math.pow(1 - lungeT, 2.2));

        // 2) Thế giới cuộn ĐỀU suốt cú lướt (không đổi tốc độ => không ngắt quãng)
        if (this.pillars) this.pillars.speedMul = this.smashSpeedMul;

        this.rocket.vy = 0;
        this.rocket.isThrusting = true;
        this.rocket.angle = -0.20;

        // 3) Căn khe cổng phía trước (mượt)
        const frontier = this.pillars.pillars.find(p2 => !p2.isDestroyed && p2.x + p2.width > this.rocket.x - 10);
        if (frontier) this.smashAlignY = frontier.gapY;
        this.rocket.y += (this.smashAlignY - this.rocket.y) * Math.min(1, dt * 12);

        // 4) Húc vỡ — CHỈ các cột đã chốt là "phía trước" lúc kích hoạt.
        //    Nhờ chốt theo đối tượng, cột vừa bay qua / cột tự sinh không bao giờ bị nổ.
        for (const pillar of (this.smashTargets || [])) {
          if (this.smashPillarsLeft <= 0) break;
          if (!pillar || pillar.isDestroyed || pillar.smashedByDash) continue;
          if (pillar.x > this.rocket.x + this.rocket.radius + 12) continue;   // chưa tới nơi
          {
            pillar.smashedByDash = true;
            pillar.isDestroyed = true;
            pillar.passed = true;

            const pcx = pillar.x + (pillar.width || 52) / 2;
            const halfGap = (pillar.gapHeight || 148) / 2;
            const topColY = Math.max(24, (pillar.gapY || 350) - halfGap);
            const botColY = Math.min(this.height - 24, (pillar.gapY || 350) + halfGap);
            this.particles.emitPillarSmash(pcx, topColY);
            this.particles.emitPillarSmash(pcx, botColY);
            this.particles.emitExplosion(pcx, (pillar.gapY || 350), 16);

            this.audio.playSmash(true);
            this.hud.triggerRamImpact();
            if (this.ghosts) this.ghosts.spawnForPillar(pillar, this.score);

            this.score += 1;               // +1 điểm mỗi cổng (chain 2 cổng = +2)
            this._syncProgression();
            if (infoPanels) infoPanels.setLandmark(this.currentTheme, this.lapNumber, this.chapterNumber, false,
              this.score % POINTS_PER_CHAPTER, POINTS_PER_CHAPTER);
            this.smashPillarsLeft -= 1;
          }
        }

        this._drawSmashLance();
        this.particles.emitSmashFireTrail(this.rocket.x, this.rocket.y, this.rocket.angle || 0);

        // ===== KẾT THÚC: dừng ở GIỮA cột vừa phá và cột kế tiếp =====
        // mép phải cột đã phá: lấy từ chính cột vừa húc (nếu còn trong mảng)
        const destroyed = (this.smashTargets || []).find(t => t && t.isDestroyed);
        if (destroyed) this.smashBehindRight = destroyed.x + (destroyed.width || 52);

        // cột còn sống gần nhất phía trước
        const aheadNow = this.pillars.pillars
          .filter(p2 => !p2.isDestroyed && p2.x > this.rocket.x + 4)
          .sort((a, b) => a.x - b.x)[0];

        const behindRight = this.smashBehindRight || this.rocket.x;
        const aheadLeft = aheadNow ? aheadNow.x : behindRight + 320;
        const midX = (behindRight + aheadLeft) / 2;

        const clearedAll = this.smashPillarsLeft <= 0;
        if (clearedAll && this.rocket.x >= midX) {
          this._endSmash();
        } else if (this.smashTime >= this.smashMaxDuration) {
          this._endSmash();
        }
      } else {
        // Hạ cánh: giảm tốc thế giới TỪ TỪ + trôi về làn bay (không phanh gấp)
        if (this.smashSpeedMul > 1) {
          this.smashSpeedMul = Math.max(1, this.smashSpeedMul - dt * 10);
        }
        if (this.pillars) this.pillars.speedMul = this.smashSpeedMul;
        if (this.smashReturnTimer > 0) {
          this.smashReturnTimer = Math.max(0, this.smashReturnTimer - dt);
          this.rocket.x += (this.originalRocketX - this.rocket.x) * Math.min(1, dt * 12);
        }
      }

      if (hasTap && !this.isSmashActive) {
        this.rocket.thrust();
        this.audio.playThrust();
        this.particles.emitThrust(this.rocket.x, this.rocket.y, this.rocket.rotation);

        if (this.hasQuantumDrift && this.quantumCooldownTimer <= 0) {
          this.quantumTimer = 1.8;
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
      this.pillars.update(dt, this.rocket, this._onScore, this._onNearMiss, this.score, this.difficulty);
      this.energyCells.update(dt, this.pillars.speed, this.rocket, this.hasDrunkMagnet, this._onCollectCell);
      if (this.ghosts) this.ghosts.update(dt, this.pillars.speed);

      // Proximity Laser Hum & Electric Crackle ("xẹt xẹt" gets louder as rocket approaches beam)
      if (!this.isSmashActive && this.quantumTimer <= 0) {
        let maxProximity = 0;
        for (const p of this.pillars.pillars) {
          if (p.isDestroyed) continue;
          if (p.x + p.width > this.rocket.x - 45 && p.x < this.rocket.x + 220) {
            const cx = p.x + p.width / 2;
            const cy = p.gapY;
            let rx = this.rocket.x;
            let ry = this.rocket.y;
            if (p.angle !== 0) {
              const cos = Math.cos(-p.angle);
              const sin = Math.sin(-p.angle);
              const dx = this.rocket.x - cx;
              const dy = this.rocket.y - cy;
              rx = cx + (dx * cos - dy * sin);
              ry = cy + (dx * sin + dy * cos);
            }

            // Distance to active vertical laser beam in the gap
            const clampedY = Math.max(p.topY, Math.min(p.bottomY, ry));
            const distToBeam = Math.hypot(rx - cx, ry - clampedY);

            // Distance to top/bottom emitter heads
            const distToTopHead = Math.hypot(rx - cx, ry - p.topY);
            const distToBottomHead = Math.hypot(rx - cx, ry - p.bottomY);
            const minDist = Math.min(distToBeam, distToTopHead, distToBottomHead);

            const dangerRadius = 180;
            if (minDist < dangerRadius) {
              const prox = Math.max(0, 1 - (minDist / dangerRadius));
              maxProximity = Math.max(maxProximity, prox);
            }
          }
        }
        if (this.audio && this.audio.updateLaserProximity) {
          this.audio.updateLaserProximity(maxProximity);
        }
      } else {
        if (this.audio && this.audio.stopLaserProximity) {
          this.audio.stopLaserProximity();
        }
      }

      // Boundary collision check (ceiling or floor)
      // TRẦN MỀM: chạm mép trên thì nảy nhẹ xuống (thả diều đụng tầng mây),
      // chỉ chết nếu chạm trần 3 lần trong 2 giây hoặc rơi xuống đáy.
      if (!this.isSmashActive && this.invincibleTimer <= 0) {
        if (this.rocket.y - this.rocket.radius <= 0) {
          this.rocket.y = this.rocket.radius + 1;
          this.rocket.vy = Math.max(this.rocket.vy, 140);
          this.ceilingHits = (this.ceilingHits || 0) + 1;
          this.ceilingTimer = 2.0;
          if (this.audio && this.audio.playThrust) this.audio.playThrust();
        }
        if (this.rocket.y + this.rocket.radius >= this.height) {
          this._die();
          return;
        }
      }
      if (this.ceilingTimer > 0) {
        this.ceilingTimer -= dt;
        if (this.ceilingTimer <= 0) this.ceilingHits = 0;
      }
      if ((this.ceilingHits || 0) >= 3) {
        this._die();
        return;
      }

      // Pillar collision check
      if (!this.isSmashActive && this.quantumTimer <= 0 && this.invincibleTimer <= 0) {
        const collided = this.pillars.checkCollision(this.rocket);
        if (collided) {
          if (this.shieldActive) {
            this.shieldActive = false;
            collided.isDestroyed = true;
            this.hud.triggerSmashEffects();
            this.particles.emitPillarSmash(collided.x + (collided.width || 52) / 2, collided.gapY || 350);
            this.audio.playSmash();
            this.quantumTimer = 1.2;
            this.rocket.isQuantum = true;
          } else {
            this._die();
            return;
          }
        }
      }
    } else if (this.state === 'GAMEOVER') {
      this.timeSinceDeath += dt;
      if (this.timeSinceDeath >= 0.55 && hasTap) {
        this._restart();
      }
    }
  }

  render() {
    const out = this.ctx;
    const outW = out.canvas.width;
    const outH = out.canvas.height;

    this.ctx = this.bctx;
    try {
      this._renderScene();
    } finally {
      this.ctx = out;
    }

    out.setTransform(1, 0, 0, 1, 0, 0);
    out.imageSmoothingEnabled = true;
    out.imageSmoothingQuality = 'low';   // blit 1 lần: 'low' rẻ hơn nhiều, mắt không phân biệt
    out.drawImage(this.buffer, 0, 0, outW, outH);
  
    // ---- Nền mờ phía sau: phủ kín màn hình theo kiểu "cover" ----
    if (this.bgCtx && this.bgCanvas) {
      this._bgFrame = (this._bgFrame + 1) % 3;
      if (this._bgFrame === 0) {
        const bw = this.bgCanvas.width;
        const bh = this.bgCanvas.height;
        const scale = Math.max(bw / this.width, bh / this.height);
        const dw = this.width * scale;
        const dh = this.height * scale;
        const dx = (bw - dw) / 2;
        const dy = (bh - dh) / 2;
        this.bgCtx.drawImage(this.canvas, dx, dy, dw, dh);
      }
    }
}

  _renderScene() {
    this.ctx.save();

    const shake = this.hud.getShakeOffset();
    this.ctx.translate(shake.x, shake.y);

    this.starfield.draw(this.ctx);
    // Scenic vẽ trong hệ PIXEL BACKING (nét tuyệt đối), rồi trả lại hệ 400x700.
    if (this.scenic) {
      const out = this.ctx;
      out.setTransform(1, 0, 0, 1, 0, 0);
      this.scenic.draw(out);
      out.setTransform(this.baseSX || 1, 0, 0, this.baseSY || 1, 0, 0);
      const sh2 = this.hud.getShakeOffset();
      out.translate(sh2.x, sh2.y);
    }
    // Thời tiết: lớp màu trời + mây + sao + nắng (nằm trên tranh, dưới nhân vật)
    if (this.weather) this.weather.drawSky(this.ctx);

    // Đèn cửa sổ / đèn thuyền / đèn cầu sáng lên khi trời tối
    drawNightLights(this.ctx, this.currentTheme, this.nightLevel || 0, this.totalTime || 0);

    for (const p of this.pillars.pillars) {
      if (!p.isDestroyed) {
        EntityRenderer.drawLaserPillar(this.ctx, p, this.height, this.currentTheme);
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
      this.ctx.fillText('🌪 VÓ HÚT GIÓ', this.rocket.x, this.rocket.y - this.rocket.radius - 12);
      this.ctx.restore();
    }

    // Draw Rocket with funny comical styling
    // Vòng nạp khi người chơi GIỮ để Lộng Gió (phản hồi trực quan)
    if (this.state === 'PLAYING' && this.holdProgress > 0 && this.drunkMeter >= 100) {
      const ctx = this.ctx;
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 215, 106, 0.9)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(this.rocket.x, this.rocket.y, 22, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * this.holdProgress);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(this.rocket.x, this.rocket.y, 25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    EntityRenderer.drawRocket(this.ctx, this.rocket, {
      isDead: this.state === 'GAMEOVER',
      isSmashing: this.isSmashActive,
      justScored: this.justScoredTimer > 0,
      isInvincible: this.invincibleTimer > 0 && this.state === 'PLAYING',
      stage: this.kiteStage || 1,
      colorStage: this.colorStage || 1
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

    // Mưa / tuyết / sét vẽ trước nhân vật và HUD (tạo cảm giác thời tiết ở sát ống kính)
    if (this.weather) this.weather.drawForeground(this.ctx);

    // Thẻ cốt truyện chương / màn kết Diều Rồng
    if (this.story) this.story.draw(this.ctx);

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
      this.smashChainCount || 1,
      this.currentTheme,
      {
        darkScene: this.weather ? this.weather.isDark : false,
        lapNumber: this.lapNumber,
        chapterNumber: this.chapterNumber,
        kiteStage: this.kiteStage,
        colorStage: this.colorStage,
        theme: this.currentTheme
      }
    );

    // Hiệu ứng ánh sáng điện ảnh (chớp sét toàn khung & vignette theo thời tiết)
    if (this.weather && this.weather.drawOverlay) {
      this.weather.drawOverlay(this.ctx);
    } else if (this.starfield && this.starfield.drawOverlay) {
      this.starfield.drawOverlay(this.ctx);
    }

    this.ctx.restore();
  }

  _bindToolbarButtons() {
    const btnTop = document.getElementById('btn-open-leaderboard');
    if (btnTop) {
      btnTop.addEventListener('pointerdown', (e) => e.stopPropagation());
      btnTop.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.leaderboard) {
          if (this.leaderboard.isOpen) {
            this.leaderboard.hide();
          } else {
            this.leaderboard.show(0, 0);
          }
        }
      });
    }

    const btnSound = document.getElementById('btn-toggle-sound');
    if (btnSound) {
      btnSound.addEventListener('pointerdown', (e) => e.stopPropagation());
      btnSound.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.audio) {
          const isMuted = this.audio.toggleMute();
          btnSound.textContent = isMuted ? '🔇' : '🔊';
          btnSound.title = t(isMuted ? 'toolbar.soundOff' : 'toolbar.soundOn');
          btnSound.classList.toggle('muted', isMuted);
          if (!isMuted && this.weather) {
            this.audio.setAmbientTheme(this.weather.ambient || 'birds', true);
          }
        }
      });
    }

    // Nút đổi ngôn ngữ VI / EN
    const btnLang = document.getElementById('btn-toggle-lang');
    if (btnLang) {
      btnLang.addEventListener('pointerdown', (e) => e.stopPropagation());
      btnLang.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLang();
        const span = btnLang.querySelector('[data-i18n]');
        if (span) span.textContent = t('toolbar.lang');
      });
    }

    const btnShare = document.getElementById('btn-share-challenge');
    if (btnShare) {
      btnShare.addEventListener('pointerdown', (e) => e.stopPropagation());
      btnShare.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const res = await ShareCard.share(this.score, this.deathCount);
        const toast = document.getElementById('toast');
        if (toast) {
          toast.textContent = res && res.method === 'clipboard' ? t('share.copied') : t('share.opened');
          toast.classList.remove('hidden');
          setTimeout(() => toast.classList.add('hidden'), 2500);
        }
      });
    }

    const btnSaveScore = document.getElementById('btn-save-score');
    if (btnSaveScore) {
      btnSaveScore.addEventListener('pointerdown', (e) => e.stopPropagation());
      btnSaveScore.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.leaderboard) {
          const runDuration = performance.now() - this.runStartTime;
          this.leaderboard.show(this.score, runDuration);
        }
      });
    }
  }

  loop(timestamp) {
    if (!this.isRunning) return;

    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    // Một lỗi bất ngờ trong update/render KHÔNG được phép làm chết vòng lặp
    // (trước đây requestAnimationFrame nằm sau update/render nên chỉ 1 exception
    // là game đứng hình vĩnh viễn, không bấm gì được nữa).
    try {
      if (!this.paused) {
        this.update(dt);
      } else if (this.input) {
        this.input.consumeTap();
        this.input.consumeDoubleTap();
      }
      this.render();
    } catch (err) {
      this.lastError = err;
      if (!this._errorLogged) {
        this._errorLogged = true;
        console.error('[Diều Say Gió] lỗi trong vòng lặp:', err);
      }
    }

    requestAnimationFrame(this.loop);
  }
}
