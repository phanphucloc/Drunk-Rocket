/**
 * Heads-Up Display (HUD) and UI Overlay Manager for Drunk Rocket 2.5
 * Layout matches Vietnam Panorama Expedition reference image:
 * - Score counter at Y=46
 * - Tier Badge at Y=68
 * - Spherical Cyber Energy Orb at Y=96
 * - Overdrive requirement indicator at Y=122
 * - Editorial Magazine Banner at bottom footer (Y=630-664), non-obstructive & collision-free
 */
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

  triggerSmashEffects() {
    this.shakeDuration = 0.25;
    this.shakeIntensity = 12;
    this.flashDuration = 0.12;
    this.flashColor = 'rgba(0, 240, 255, 0.35)';
  }

  showNearMiss(pointsBonus = 2) {
    this.nearMissText = `NEAR-MISS! +${pointsBonus}`;
    this.nearMissTimer = 0.7; // Display for 0.7s
  }

  update(dt) {
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

  getShakeOffset() {
    if (this.shakeDuration > 0) {
      return {
        x: (Math.random() - 0.5) * this.shakeIntensity * 2,
        y: (Math.random() - 0.5) * this.shakeIntensity * 2
      };
    }
    return { x: 0, y: 0 };
  }

  draw(ctx, state, score, bestScore, time, timeSinceDeath, drunkMeter = 0, isSmashActive = false, smashChainCount = 1, currentTheme = null) {
    const cx = this.gameWidth / 2;

    // Draw Screen Flash
    if (this.flashDuration > 0) {
      ctx.fillStyle = this.flashColor;
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
    }

    ctx.save();
    ctx.textAlign = 'center';

    if (state === 'READY') {
      // 1. Ready Title
      ctx.fillStyle = '#ffd13b';
      ctx.font = 'bold 34px monospace';
      ctx.fillText('DRUNK ROCKET 2.5', cx, 170);

      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 15px monospace';
      ctx.fillText('⚡ VIETNAM PANORAMA EXPEDITION ⚡', cx, 205);

      // Controls info
      ctx.fillStyle = '#a6b0cf';
      ctx.font = '13px monospace';
      ctx.fillText('Single Tap: Bay  |  Double Tap: Smash', cx, 240);

      // Blinking prompt
      if (Math.sin(time * 6) > -0.2) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px monospace';
        ctx.fillText('CHẠM HOẶC SPACE ĐỂ BAY', cx, 460);
      }

      ctx.fillStyle = '#05ffa1';
      ctx.font = '14px monospace';
      ctx.fillText(`KỶ LỤC CỦA BẠN: ${bestScore}`, cx, 520);
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

      // 3. Tier Badge (Centered at Y=70, matching reference image)
      if (currentTheme && currentTheme.badgeText) {
        ctx.font = '900 11px monospace';
        ctx.letterSpacing = '1.2px';
        ctx.fillStyle = currentTheme.laserColor || '#ff4d6d';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 4;
        ctx.fillText(currentTheme.badgeText, cx, 70);
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
        auraGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.35)');
        auraGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
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
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
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
      ctx.fillStyle = isFull ? '#ffd13b' : '#00f0ff';
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
          fluidGrad.addColorStop(0.2, '#00f0ff');
          fluidGrad.addColorStop(0.7, '#05ffa1');
          fluidGrad.addColorStop(1, '#005249');
        }
        ctx.fillStyle = fluidGrad;
        ctx.fill();

        ctx.strokeStyle = isFull ? '#ffffff' : '#00f0ff';
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
      ctx.strokeStyle = isFull ? (Math.sin(time * 14) > 0 ? '#ffd13b' : '#00f0ff') : '#2e3856';
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbR, 0, Math.PI * 2);
      ctx.stroke();

      // 5. Overdrive Text (Centered at Y=122, matching reference image)
      ctx.font = 'bold 9.5px monospace';
      ctx.letterSpacing = '0.5px';
      if (isSmashActive) {
        ctx.fillStyle = '#ff3b5c';
        ctx.fillText('💥 SUPERNOVA SMASH ACTIVE! 💥', cx, 122);
      } else if (isFull) {
        ctx.fillStyle = '#ffd13b';
        ctx.fillText('⚡ DOUBLE TAP: SMASH READY! ⚡', cx, 122);
      } else {
        ctx.fillStyle = 'rgba(240, 244, 255, 0.82)';
        const req = currentTheme ? (currentTheme.pointsRequired || 10) : 10;
        const base = currentTheme ? (currentTheme.baseScore || 0) : 0;
        const currentInTier = Math.max(0, score - base);
        const pct = Math.floor(drunkMeter);
        const chainTag = smashChainCount >= 2 ? ' [2 CỘT]' : '';
        ctx.fillText(`OVERDRIVE: ${pct}% (CẦN ${req} ĐIỂM: ${currentInTier}/${req})${chainTag}`, cx, 122);
      }

      // 6. Near-Miss Floating Notification
      if (this.nearMissText) {
        ctx.fillStyle = '#05ffa1';
        ctx.font = '900 20px monospace';
        ctx.fillText(this.nearMissText, cx, 185);
      }

      // 7. EDITORIAL MAGAZINE LANDMARK BANNER (Bottom Footer: Y=636-668, 100% collision-free)
      if (currentTheme && currentTheme.editorialDesc) {
        const bannerY = this.gameHeight - 60; // Y = 640
        const bannerH = 34;

        ctx.save();
        // Translucent luxury backdrop
        ctx.fillStyle = 'rgba(10, 14, 24, 0.78)';
        ctx.fillRect(20, bannerY - 14, this.gameWidth - 40, bannerH);

        // Elegant hairline border
        ctx.strokeStyle = 'rgba(244, 244, 246, 0.35)';
        ctx.lineWidth = 0.8;
        ctx.strokeRect(20, bannerY - 14, this.gameWidth - 40, bannerH);

        // Line 1: Issue & Region (All-Caps, letter-spaced)
        ctx.fillStyle = 'rgba(244, 244, 246, 0.75)';
        ctx.font = '600 7.5px -apple-system, "Segoe UI", Roboto, monospace';
        ctx.letterSpacing = '1.8px';
        ctx.fillText(currentTheme.editorialIssue || 'VIETNAM PANORAMA EXPEDITION', cx, bannerY - 1);

        // Line 2: Landmark & Cinematic Feature (All-Caps Serif)
        ctx.fillStyle = '#f4f4f6';
        ctx.font = '700 10.5px "Times New Roman", Georgia, serif';
        ctx.letterSpacing = '1.4px';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 4;
        ctx.fillText(currentTheme.editorialDesc || currentTheme.name, cx, bannerY + 13);
        ctx.restore();
      }
    } else if (state === 'GAMEOVER') {
      const cardY = 180;
      const cardW = 310;
      const cardH = 240;

      ctx.fillStyle = 'rgba(22, 28, 46, 0.95)';
      ctx.fillRect(cx - cardW / 2, cardY, cardW, cardH);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#2e3856';
      ctx.strokeRect(cx - cardW / 2, cardY, cardW, cardH);

      ctx.fillStyle = '#ff3b5c';
      ctx.font = '900 28px monospace';
      ctx.fillText('NỔ TÀU!', cx, cardY + 45);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(`ĐIỂM: ${score}`, cx, cardY + 85);

      ctx.fillStyle = '#ffd13b';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`KỶ LỤC: ${bestScore}`, cx, cardY + 115);

      if (timeSinceDeath > 0.4) {
        if (Math.sin(time * 8) > -0.2) {
          ctx.fillStyle = '#00f0ff';
          ctx.font = 'bold 14px monospace';
          ctx.fillText('CHẠM ĐỂ BAY LẠI', cx, cardY + 160);
        }
      }

      ctx.fillStyle = '#7d8aa8';
      ctx.font = '11px monospace';
      ctx.fillText('Né laser & nhặt Energy Orb để Overdrive!', cx, cardY + 210);
    }

    ctx.restore();
  }
}
