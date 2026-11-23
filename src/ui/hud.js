/**
 * Heads-Up Display (HUD) and UI Overlay Manager for Drunk Rocket 3.0 — "Diều Say Gió"
 * Palette: mực (ink) · giấy dó (paper) · vàng thếp (gold) · ngọc bích (jade) · đỏ son (red)
 */
import { t, getLang } from '../i18n.js';
import { getTitleKey } from '../core/stamps.js';

export class HUD {
  constructor(gameWidth = 400, gameHeight = 700) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;

    // Screen effects
    this.shakeDuration = 0;
    this.shakeIntensity = 0;
    this.flashDuration = 0;
    this.flashColor = 'rgba(255, 59, 92, 0.4)';

    // Near-Miss notification banner
    this.nearMissText = null;
    this.nearMissTimer = 0;
  }

  triggerCrashEffects() {
    this.shakeDuration = 0.18;
    this.shakeIntensity = 9;
    this.flashDuration = 0.08;
    this.flashColor = 'rgba(255, 59, 92, 0.4)';
  }

  /** Húc vỡ cổng: rung mạnh + chớp trắng ấm (tạo cảm giác lực va chạm). */
  triggerRamImpact() {
    this.shakeDuration = 0.16;
    this.shakeIntensity = 7;
    this.flashDuration = 0.07;
    this.flashColor = 'rgba(255, 244, 214, 0.42)';
  }

  /** Banner chương kiểu phim: tên tỉnh + câu thơ, 2 giây, góc trên-trái. */
  showChapterBanner(theme, lap = 1, chapter = 1) {
    if (!theme) return;
    const en = getLang() === 'en';
    const poem = en ? (theme.storyEn || theme.descEn || '') : (theme.editorialDesc || '');
    this.chapterBanner = {
      t: 2.0,
      max: 2.0,
      name: theme.name || '',
      sub: theme.subName || '',
      poem: String(poem || '').replace(/^[^—]*—\s*/, '').trim().slice(0, 64)
    };
  }

  /** Chuyển chương: mờ dần + đường vàng quét nhẹ, KHÔNG rung (khác hẳn va chạm). */
  triggerChapterTransition() {
    this.chapterFade = 0.9;          // giây
    this.chapterBand = 1;            // 1 -> 0, dải sáng quét qua
    // không đụng shakeIntensity/shakeDuration
  }

  triggerSmashEffects() {
    this.shakeDuration = 0.25;
    this.shakeIntensity = 12;
    this.flashDuration = 0.12;
    this.flashColor = 'rgba(0, 240, 255, 0.35)';
  }

  /** Toast nhỏ khi nhận tem bưu thiếp mới. */
  showStampToast(landmarkTier, weatherId) {
    this.stampToast = { t: 2.4, landmarkTier, weatherId };
  }

  showNearMiss(pointsBonus = 2) {
    this.nearMissText = t('hud.nearMiss', { n: pointsBonus });
    this.nearMissTimer = 0.7; // Display for 0.7s
  }

  update(dt) {
    if (this.chapterBanner && this.chapterBanner.t > 0) this.chapterBanner.t -= dt;
    if (this.chapterFade > 0) this.chapterFade = Math.max(0, this.chapterFade - dt);
    if (this.chapterBand > 0) this.chapterBand = Math.max(0, this.chapterBand - dt * 1.6);
    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
      if (this.shakeDuration <= 0) {
        this.shakeIntensity = 0;
      }
    }

    if (this.flashDuration > 0) {
      this.flashDuration -= dt;
    }

    if (this.nearMissTimer > 0) {
      this.nearMissTimer -= dt;
      if (this.nearMissTimer <= 0) {
        this.nearMissText = null;
      }
    }
  }

  /** Cắt chữ thành tối đa `maxLines` dòng vừa bề rộng maxW. */
  _wrapText(ctx, text, maxW, maxLines = 2) {
    const words = String(text).split(' ');
    const lines = [];
    let cur = '';
    for (const word of words) {
      const t2 = cur ? cur + ' ' + word : word;
      if (ctx.measureText(t2).width > maxW && cur) {
        lines.push(cur);
        cur = word;
        if (lines.length === maxLines - 1) break;
      } else {
        cur = t2;
      }
    }
    if (cur) lines.push(cur);
    return lines.slice(0, maxLines);
  }

  /**
   * Tìm cỡ chữ lớn nhất còn vừa khung, có cache theo (chữ + width) để
   * không phải measureText lặp lại mỗi frame.
   */
  _fitFontSize(text, start, min, maxWidth, fontOf) {
    if (!this._fontSizeCache) this._fontSizeCache = new Map();
    const key = maxWidth + '|' + text;
    const hit = this._fontSizeCache.get(key);
    if (hit !== undefined) return hit;

    let size = start;
    this.ctx = this.ctx || null;
    const ctx = this._measureCtx || (this._measureCtx = (typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(1, 1).getContext('2d')
      : document.createElement('canvas').getContext('2d')));
    ctx.font = fontOf(size);
    while (size > min && ctx.measureText(text).width > maxWidth) {
      size -= 0.25;
      ctx.font = fontOf(size);
    }
    if (this._fontSizeCache.size > 64) this._fontSizeCache.clear();
    this._fontSizeCache.set(key, size);
    return size;
  }

  getShakeOffset() {
    if (this.shakeDuration > 0) {
      return {
        x: (Math.random() - 0.5) * this.shakeIntensity * 2,
        y: (Math.random() - 0.5) * this.shakeIntensity * 2
      };
    }
    return { x: 0, y: 0 };
  }

  draw(ctx, state, score, bestScore, time, timeSinceDeath, drunkMeter = 0, isSmashActive = false, smashChainCount = 1, currentTheme = null, options = {}) {
    const cx = this.gameWidth / 2;

    // Draw Screen Flash
    if (this.flashDuration > 0) {
      ctx.fillStyle = this.flashColor;
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
    }

    ctx.save();
    ctx.textAlign = 'center';

    if (state === 'READY') {
      // Nền giấy mờ để chữ luôn đọc được trên mọi phông tranh (ngày / đêm / mưa)
      const panelW = 332;
      const panelH = 202;
      const panelX = cx - panelW / 2;
      const panelY = 128;
      ctx.fillStyle = 'rgba(10, 20, 17, 0.66)';
      ctx.fillRect(panelX, panelY, panelW, panelH);
      ctx.strokeStyle = 'rgba(232, 184, 75, 0.55)';
      ctx.lineWidth = 1;
      ctx.strokeRect(panelX + 0.5, panelY + 0.5, panelW - 1, panelH - 1);
      ctx.fillStyle = 'rgba(232, 184, 75, 0.4)';
      ctx.fillRect(panelX + 10, panelY + 6, panelW - 20, 1);

      // 1. Ready Title
      ctx.fillStyle = '#e8b84b';
      ctx.font = '800 30px "Be Vietnam Pro", ui-monospace, monospace';
      ctx.fillText(t('brand.name'), cx, 170);

      ctx.fillStyle = '#2fb894';
      ctx.font = '700 12px "Be Vietnam Pro", ui-monospace, monospace';
      ctx.letterSpacing = '1.2px';
      ctx.fillText(t('brand.tagline'), cx, 202);

      // Controls info
      ctx.fillStyle = '#a9bfb4';
      ctx.font = '13px "Be Vietnam Pro", ui-monospace, monospace';
      ctx.letterSpacing = '0px';
      ctx.fillText(t('ready.controls'), cx, 238);

      // Cấp diều hiện tại
      if (options && options.kiteStage) {
        ctx.fillStyle = 'rgba(127, 227, 196, 0.95)';
        ctx.font = '700 11px "Be Vietnam Pro", ui-monospace, monospace';
        const colorKey = 'color.' + Math.min(5, Math.max(1, (options && options.colorStage) || 1));
        ctx.fillText(`${t('ready.kite')}: ${t('kite.' + Math.min(5, options.kiteStage))} · ${t(colorKey)}`, cx, 266);
      }

      // Câu chuyện của địa danh hiện tại (đọc lúc rảnh, không che lúc bay)
      if (options && options.theme && options.theme.story) {
        const lang = getLang();
        const story = lang === 'en' ? (options.theme.storyEn || options.theme.story) : options.theme.story;
        ctx.fillStyle = 'rgba(207, 195, 168, 0.92)';
        ctx.font = 'italic 9.5px "Be Vietnam Pro", ui-monospace, monospace';
        const lines = this._wrapText(ctx, story, panelW - 34, 2);
        let sy = 288;
        for (const line of lines) {
          ctx.fillText(line, cx, sy);
          sy += 13;
        }
      }

      // Blinking prompt
      if (Math.sin(time * 6) > -0.2) {
        ctx.fillStyle = '#f3ead6';
        ctx.font = '800 14px "Be Vietnam Pro", ui-monospace, monospace';
        ctx.fillText(t('ready.tap'), cx, 460);
      }

      ctx.fillStyle = '#8fd6b8';
      ctx.font = '600 13px "Be Vietnam Pro", ui-monospace, monospace';
      ctx.fillText(`${t('ready.best')}: ${bestScore}`, cx, 520);
    } else if (state === 'PLAYING') {
      // Top Caret Accent (matching reference image)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - 7, 20);
      ctx.lineTo(cx, 26);
      ctx.lineTo(cx + 7, 20);
      ctx.stroke();

      // 2. In-Game Big Score Counter (Centered at Y=50)
      ctx.font = '900 44px monospace';
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#0b0e14';
      ctx.strokeText(`${score}`, cx, 52);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${score}`, cx, 52);

      // Số cổng đã vượt trong chương (nhỏ, cạnh điểm)
      const gatesIn = (options && options.gatesInChapter) || 0;
      const gatesMax = (options && options.gatesPerChapter) || 12;
      ctx.font = '800 11px "Be Vietnam Pro", ui-monospace, monospace';
      ctx.fillStyle = 'rgba(232, 184, 75, 0.95)';
      ctx.textAlign = 'left';
      ctx.fillText(`${gatesIn}/${gatesMax}`, cx + 36, 47);
      ctx.textAlign = 'center';

      // 3. Chapter Badge: VÒNG · ĐỊA DANH (có "viên thuốc" tối để luôn đọc rõ)
      if (currentTheme) {
        const lapNo = (options && options.lapNumber) || 1;
        const badge = `${t('hud.lap')} ${lapNo} · ${currentTheme.name}`;
        ctx.font = '800 11px "Be Vietnam Pro", ui-monospace, monospace';
        ctx.letterSpacing = '1.2px';
        const bw = Math.min(this.gameWidth - 24, ctx.measureText(badge).width + 16);
        ctx.fillStyle = 'rgba(10, 20, 17, 0.5)';
        if (typeof ctx.roundRect === 'function') {
          ctx.beginPath();
          ctx.roundRect(cx - bw / 2, 61, bw, 16, 8);
          ctx.fill();
        } else {
          ctx.fillRect(cx - bw / 2, 61, bw, 16);
        }
        ctx.fillStyle = currentTheme.laserColor || '#e8b84b';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        if (!this.noShadow) ctx.shadowBlur = 4;
        ctx.fillText(badge, cx, 72);
        ctx.shadowBlur = 0;
      }

      // 4. Spherical Cyber Energy Orb (Overdrive, Centered at Y=96, radius=16)
      const orbX = cx;
      const orbY = 96;
      const orbR = 16;
      const fillPct = Math.max(0, Math.min(1, drunkMeter / 100));
      const isFull = (drunkMeter >= 100 && score >= 5);

      // 4A. Outer Glow
      if (isFull) {
        const pulse = Math.sin(time * 12) * 4;
        const auraGrad = ctx.createRadialGradient(orbX, orbY, orbR * 0.5, orbX, orbY, orbR + 14 + pulse);
        auraGrad.addColorStop(0, 'rgba(255, 209, 59, 0.45)');
        auraGrad.addColorStop(0.5, 'rgba(65, 217, 176, 0.35)');
        auraGrad.addColorStop(1, 'rgba(65, 217, 176, 0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(orbX, orbY, orbR + 14 + pulse, 0, Math.PI * 2);
        ctx.fill();

        for (let li = 0; li < 4; li++) {
          const la = time * 14 + li * (Math.PI / 2);
          const lx1 = orbX + Math.cos(la) * (orbR + 2);
          const ly1 = orbY + Math.sin(la) * (orbR + 2);
          const lx2 = orbX + Math.cos(la + 0.45) * (orbR + 8 + Math.sin(time * 20 + li) * 2);
          const ly2 = orbY + Math.sin(la + 0.45) * (orbR + 8 + Math.sin(time * 20 + li) * 2);
          ctx.strokeStyle = li % 2 === 0 ? '#ffd13b' : '#00f0ff';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(lx1, ly1);
          ctx.lineTo(lx2, ly2);
          ctx.stroke();
        }
      } else {
        ctx.save();
        ctx.shadowColor = '#41d9b0';
        if (!this.noShadow) ctx.shadowBlur = 8;
        ctx.strokeStyle = 'rgba(65, 217, 176, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(orbX, orbY, orbR + 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 4B. Outer High-Tech Socket Casing
      ctx.fillStyle = '#101422';
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbR + 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Socket notches
      ctx.fillStyle = isFull ? '#ffd13b' : '#41d9b0';
      const notchAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
      for (const na of notchAngles) {
        const nx = orbX + Math.cos(na) * (orbR + 2);
        const ny = orbY + Math.sin(na) * (orbR + 2);
        ctx.fillRect(nx - 1, ny - 1, 2, 2);
      }

      // 4C. Inner Sphere & Plasma Liquid
      ctx.save();
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbR, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = '#060a14';
      ctx.fillRect(orbX - orbR, orbY - orbR, orbR * 2, orbR * 2);

      if (fillPct > 0) {
        const waterLevelY = (orbY + orbR) - (fillPct * orbR * 2);
        ctx.beginPath();
        ctx.moveTo(orbX - orbR - 4, orbY + orbR + 4);
        ctx.lineTo(orbX - orbR - 4, waterLevelY);

        for (let wx = orbX - orbR; wx <= orbX + orbR; wx += 2) {
          const waveHeight = fillPct >= 0.98 ? 0.6 : 2.0;
          const waveY = waterLevelY + Math.sin((wx * 0.25) + (time * 10)) * waveHeight;
          ctx.lineTo(wx, waveY);
        }

        ctx.lineTo(orbX + orbR + 4, waterLevelY);
        ctx.lineTo(orbX + orbR + 4, orbY + orbR + 4);
        ctx.closePath();

        const fluidGrad = ctx.createLinearGradient(orbX, orbY - orbR, orbX, orbY + orbR);
        if (isFull) {
          fluidGrad.addColorStop(0, '#ffffff');
          fluidGrad.addColorStop(0.3, '#ffd13b');
          fluidGrad.addColorStop(0.8, '#ff3b5c');
          fluidGrad.addColorStop(1, '#9b0024');
        } else {
          fluidGrad.addColorStop(0, '#ffffff');
          fluidGrad.addColorStop(0.2, '#d8fff2');
          fluidGrad.addColorStop(0.7, '#41d9b0');
          fluidGrad.addColorStop(1, '#0a5a48');
        }
        ctx.fillStyle = fluidGrad;
        ctx.fill();

        ctx.strokeStyle = isFull ? '#ffffff' : '#bff5e4';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Glass specular reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.ellipse(orbX - orbR * 0.35, orbY - orbR * 0.38, orbR * 0.38, orbR * 0.18, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Glass Ring Rim
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = isFull ? (Math.sin(time * 14) > 0 ? '#ffd13b' : '#41d9b0') : '#2e3856';
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbR, 0, Math.PI * 2);
      ctx.stroke();

      // 5. Overdrive Text (Centered at Y=122, matching reference image)
      ctx.font = 'bold 9.5px monospace';
      ctx.letterSpacing = '0.5px';
      if (isSmashActive) {
        ctx.fillStyle = '#ff3b5c';
        ctx.fillText(t('hud.smashing'), cx, 122);
      } else if (isFull) {
        ctx.fillStyle = '#e8b84b';
        ctx.fillText(t('hud.smashReady'), cx, 122);
      } else {
        // Nhãn năng lượng gió: đặt trên một "viên thuốc" tối để luôn đọc được
        // trên mọi phông tranh (ngày nắng, đêm, mưa).
        const pct = Math.floor(drunkMeter);
        const chainTag = smashChainCount >= 2 ? ' ' + t('hud.chain') : '';
        const label = `${t('hud.overdrive')}: ${pct}% · ${t('hud.need')} ${Math.max(0, 100 - pct)}%${chainTag}`;
        ctx.font = '700 10px "Be Vietnam Pro", ui-monospace, monospace';
        ctx.letterSpacing = '0.3px';
        const tw = Math.min(this.gameWidth - 24, ctx.measureText(label).width + 18);
        ctx.fillStyle = 'rgba(10, 20, 17, 0.55)';
        if (typeof ctx.roundRect === 'function') {
          ctx.beginPath();
          ctx.roundRect(cx - tw / 2, 112, tw, 17, 9);
          ctx.fill();
        } else {
          ctx.fillRect(cx - tw / 2, 112, tw, 17);
        }
        ctx.fillStyle = '#f3ead6';
        ctx.fillText(label, cx, 124);
        ctx.shadowBlur = 0;
      }

      // 6. Near-Miss Floating Notification
      if (this.nearMissText) {
        ctx.fillStyle = '#2fb894';
        ctx.font = '900 20px "Be Vietnam Pro", ui-monospace, monospace';
        ctx.fillText(this.nearMissText, cx, 185);
      }

      // (Banner mô tả địa danh đã bỏ — thông tin chuyển sang ô giới thiệu góc phải)
    } else if (state === 'GAMEOVER') {
      const cardY = 180;
      const cardW = 310;
      const cardH = 240;

      // Thẻ giấy dó: nền sáng, viền vàng thếp, chữ mực
      ctx.fillStyle = 'rgba(243, 234, 214, 0.96)';
      ctx.fillRect(cx - cardW / 2, cardY, cardW, cardH);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#c9a24a';
      ctx.strokeRect(cx - cardW / 2, cardY, cardW, cardH);
      ctx.fillStyle = 'rgba(201, 162, 74, 0.35)';
      ctx.fillRect(cx - cardW / 2 + 6, cardY + 6, cardW - 12, 2);

      ctx.fillStyle = '#b3172a';
      ctx.font = '800 24px "Be Vietnam Pro", ui-monospace, monospace';
      ctx.fillText(t('gameover.title'), cx, cardY + 46);

      ctx.fillStyle = '#1c2b26';
      ctx.font = '700 17px "Be Vietnam Pro", ui-monospace, monospace';
      ctx.fillText(`${t('gameover.score')}: ${score}`, cx, cardY + 86);

      ctx.fillStyle = '#8a6210';
      ctx.font = '700 15px "Be Vietnam Pro", ui-monospace, monospace';
      ctx.fillText(`${t('gameover.best')}: ${bestScore}`, cx, cardY + 114);

      // Cấp bậc = cấp diều của vòng hiện tại (mỗi vòng lên 1 cấp)
      const stageNo = Math.max(1, Math.min(5, (options && options.kiteStage) || 1));
      const lapNo = (options && options.lapNumber) || 1;
      ctx.fillStyle = '#197a5f';
      ctx.font = '800 13px "Be Vietnam Pro", ui-monospace, monospace';
      ctx.fillText(`${t('gameover.rank')}: ${t('kite.' + stageNo)} · ${t('hud.lap')} ${lapNo}`, cx, cardY + 138);

      // Danh hiệu sưu tầm (Sổ tay bưu thiếp)
      ctx.fillStyle = '#7a5a18';
      ctx.font = '700 11px "Be Vietnam Pro", ui-monospace, monospace';
      ctx.fillText(`${t('title.label')}: ${t(getTitleKey())}`, cx, cardY + 156);

      if (timeSinceDeath > 0.4) {
        if (Math.sin(time * 8) > -0.2) {
          ctx.fillStyle = '#b3172a';
          ctx.font = '800 13px "Be Vietnam Pro", ui-monospace, monospace';
          ctx.fillText(t('gameover.tap'), cx, cardY + 184);
        }
      }

      ctx.fillStyle = 'rgba(60, 78, 70, 0.85)';
      ctx.font = '11px "Be Vietnam Pro", ui-monospace, monospace';
      ctx.fillText(t('gameover.hint'), cx, cardY + 214);
    }

    ctx.restore();

    // ---- Chuyển chương: hiệu ứng điện ảnh nhẹ (KHÔNG rung) ----
    if (this.chapterFade > 0 || this.chapterBand > 0) {
      const a = Math.min(1, this.chapterFade / 0.9);
      const g = ctx.createLinearGradient(0, 0, 0, this.height);
      g.addColorStop(0, 'rgba(8, 20, 16, ' + (0.42 * a).toFixed(3) + ')');
      g.addColorStop(0.55, 'rgba(8, 20, 16, ' + (0.12 * a).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(8, 20, 16, ' + (0.50 * a).toFixed(3) + ')');
      ctx.save();
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, this.width, this.height);

      if (this.chapterBand > 0) {
        const p = 1 - this.chapterBand;
        const y = -40 + p * (this.height + 80);
        const band = ctx.createLinearGradient(0, y - 60, 0, y + 60);
        band.addColorStop(0, 'rgba(232, 184, 75, 0)');
        band.addColorStop(0.5, 'rgba(232, 184, 75, ' + (0.16 * this.chapterBand).toFixed(3) + ')');
        band.addColorStop(1, 'rgba(232, 184, 75, 0)');
        ctx.fillStyle = band;
        ctx.fillRect(0, y - 60, this.width, 120);
      }
      ctx.restore();
    }

    // Toast: nhận tem bưu thiếp mới
    if (this.stampToast && this.stampToast.t > 0) {
      const alpha = Math.min(1, this.stampToast.t / 0.4);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = '700 11px "Be Vietnam Pro", sans-serif';
      const txt = t('stamp.new');
      const w = ctx.measureText(txt).width + 26;
      const x = (this.width - w) / 2;
      const y = 108;
      ctx.fillStyle = 'rgba(11, 21, 18, 0.86)';
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(x, y, w, 24, 12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(232, 184, 75, 0.75)';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        ctx.fillRect(x, y, w, 24);
      }
      ctx.fillStyle = '#ffd76a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(txt, this.width / 2, y + 12);
      ctx.restore();
    }
  }
}
