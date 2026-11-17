/**
 * Heads-Up Display (HUD) and UI Overlay Manager for Drunk Rocket 2.0
 * Renders Score, Near-Miss popups, Spherical Cyber Energy Orb (Overdrive), and Game Over Screen.
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

  draw(ctx, state, score, bestScore, time, timeSinceDeath, drunkMeter = 0, isSmashActive = false, smashChainCount = 1) {
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
      ctx.fillText('DRUNK ROCKET 2.0', cx, 170);

      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 15px monospace';
      ctx.fillText('⚡ OVERDRIVE & ROGUELITE ⚡', cx, 205);

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
      // 2. In-Game Big Score Counter
      ctx.font = '900 48px monospace';
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#0b0e14';
      ctx.strokeText(`${score}`, cx, 85);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${score}`, cx, 85);

      // 3. Spherical Cyber Energy Orb (Overdrive)
      const orbX = cx;
      const orbY = 126;
      const orbR = 21;
      const fillPct = Math.max(0, Math.min(1, drunkMeter / 100));
      const isFull = drunkMeter >= 100;

      // 3A. Explosive Aura / Outer Glow
      if (isFull) {
        const pulse = Math.sin(time * 12) * 5;
        // Multi-layer explosive aura
        const auraGrad = ctx.createRadialGradient(orbX, orbY, orbR * 0.5, orbX, orbY, orbR + 18 + pulse);
        auraGrad.addColorStop(0, 'rgba(255, 209, 59, 0.45)');
        auraGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.35)');
        auraGrad.addColorStop(0.85, 'rgba(255, 59, 92, 0.2)');
        auraGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(orbX, orbY, orbR + 18 + pulse, 0, Math.PI * 2);
        ctx.fill();

        // Orbiting electric lightning arcs
        for (let li = 0; li < 4; li++) {
          const la = time * 14 + li * (Math.PI / 2);
          const lx1 = orbX + Math.cos(la) * (orbR + 2);
          const ly1 = orbY + Math.sin(la) * (orbR + 2);
          const lx2 = orbX + Math.cos(la + 0.45) * (orbR + 10 + Math.sin(time * 20 + li) * 3);
          const ly2 = orbY + Math.sin(la + 0.45) * (orbR + 10 + Math.sin(time * 20 + li) * 3);
          ctx.strokeStyle = li % 2 === 0 ? '#ffd13b' : '#00f0ff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(lx1, ly1);
          ctx.lineTo(lx2, ly2);
          ctx.stroke();
        }
      } else {
        // Soft idle neon glow
        ctx.save();
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(orbX, orbY, orbR + 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 3B. Outer Metallic High-Tech Casing / Socket
      ctx.fillStyle = '#121624';
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbR + 3, 0, Math.PI * 2);
      ctx.fill();

      // Cardinal socket notches
      ctx.fillStyle = isFull ? '#ffd13b' : '#00f0ff';
      const notchAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
      for (const na of notchAngles) {
        const nx = orbX + Math.cos(na) * (orbR + 2);
        const ny = orbY + Math.sin(na) * (orbR + 2);
        ctx.fillRect(nx - 1.5, ny - 1.5, 3, 3);
      }

      // 3C. Inner Sphere & Animated Fluid/Plasma Surface
      ctx.save();
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbR, 0, Math.PI * 2);
      ctx.clip();

      // Sphere deep background
      ctx.fillStyle = '#080c16';
      ctx.fillRect(orbX - orbR, orbY - orbR, orbR * 2, orbR * 2);

      // Sphere grid lines
      ctx.strokeStyle = 'rgba(46, 56, 86, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(orbX - orbR, orbY);
      ctx.lineTo(orbX + orbR, orbY);
      ctx.moveTo(orbX, orbY - orbR);
      ctx.lineTo(orbX, orbY + orbR);
      ctx.stroke();

      // Fluid Wave Fill
      if (fillPct > 0) {
        const waterLevelY = (orbY + orbR) - (fillPct * orbR * 2);
        ctx.beginPath();
        ctx.moveTo(orbX - orbR - 5, orbY + orbR + 5);
        ctx.lineTo(orbX - orbR - 5, waterLevelY);

        // Sinusoidal wave ripple
        for (let wx = orbX - orbR; wx <= orbX + orbR; wx += 2) {
          const waveHeight = fillPct >= 0.98 ? 0.8 : 2.5;
          const waveY = waterLevelY + Math.sin((wx * 0.22) + (time * 9)) * waveHeight;
          ctx.lineTo(wx, waveY);
        }

        ctx.lineTo(orbX + orbR + 5, waterLevelY);
        ctx.lineTo(orbX + orbR + 5, orbY + orbR + 5);
        ctx.closePath();

        // Fluid color gradient
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

        // Fluid surface crest neon line
        ctx.strokeStyle = isFull ? '#ffffff' : '#00f0ff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Internal plasma bubbles
        for (let bi = 0; bi < 3; bi++) {
          const bProgress = (time * 1.6 + bi * 0.35) % 1;
          const by = (orbY + orbR) - bProgress * (fillPct * orbR * 2);
          const bx = orbX + Math.sin(time * 6 + bi * 2.2) * (orbR * 0.45);
          if (by >= waterLevelY && by <= orbY + orbR) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(bx, by, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Specular glass highlight reflection (Top-Left gloss curve)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.ellipse(orbX - orbR * 0.35, orbY - orbR * 0.38, orbR * 0.4, orbR * 0.2, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 3D. Glass Ring Rim
      ctx.lineWidth = 2;
      ctx.strokeStyle = isFull ? (Math.sin(time * 14) > 0 ? '#ffd13b' : '#00f0ff') : '#2e3856';
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbR, 0, Math.PI * 2);
      ctx.stroke();

      // 3E. Text Indicators
      if (isSmashActive) {
        ctx.fillStyle = '#ff3b5c';
        ctx.font = '900 13px monospace';
        if (smashChainCount >= 2) {
          ctx.fillText('⚡ CHAIN REACTION (2 CỘT)! ⚡', cx, orbY + orbR + 18);
        } else {
          ctx.fillText('💥 SUPERNOVA SMASH! 💥', cx, orbY + orbR + 18);
        }
      } else if (isFull) {
        ctx.fillStyle = '#ffd13b';
        ctx.font = 'bold 12px monospace';
        if (smashChainCount >= 2) {
          ctx.fillText('⚡ DOUBLE TAP: CHAIN SMASH (2 CỘT)! ⚡', cx, orbY + orbR + 18);
        } else {
          ctx.fillText('⚡ DOUBLE TAP: SMASH READY! ⚡', cx, orbY + orbR + 18);
        }
      } else {
        ctx.fillStyle = '#7d8aa8';
        ctx.font = 'bold 11px monospace';
        const chainTag = smashChainCount >= 2 ? ' [2 CỘT]' : '';
        ctx.fillText('OVERDRIVE: ' + Math.floor(drunkMeter) + '%' + chainTag, cx, orbY + orbR + 16);
      }

      // 4. Near-Miss Floating Notification
      if (this.nearMissText) {
        ctx.fillStyle = '#05ffa1';
        ctx.font = '900 20px monospace';
        ctx.fillText(this.nearMissText, cx, 185);
      }
    } else if (state === 'GAMEOVER') {
      // 5. Game Over Score Board
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

      let medal = 'CHƯA CÓ';
      let medalColor = '#6b7280';
      if (score >= 10) {
        medal = '🥇 VÀNG (PRO)';
        medalColor = '#ffd13b';
      } else if (score >= 6) {
        medal = '🥈 BẠC (KHÁ)';
        medalColor = '#e2e8f0';
      } else if (score >= 3) {
        medal = '🥉 ĐỒNG (TẠM)';
        medalColor = '#cd7f32';
      }

      ctx.fillStyle = medalColor;
      ctx.font = 'bold 15px monospace';
      ctx.fillText(`HUY HIỆU: ${medal}`, cx, cardY + 155);

      if (timeSinceDeath >= 0.1) {
        if (Math.sin(time * 8) > -0.2) {
          ctx.fillStyle = '#05ffa1';
          ctx.font = '900 16px monospace';
          ctx.fillText('👉 CHẠM ĐỂ CHƠI LẠI NGAY 👈', cx, cardY + cardH + 45);
        }
      }
    }

    ctx.restore();
  }
}
