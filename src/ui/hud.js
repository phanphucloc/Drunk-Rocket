/**
 * Heads-Up Display (HUD) and UI Overlay Manager for Drunk Rocket 2.0
 * Renders Score, Near-Miss popups, Drunk-Meter Overdrive bar, and Game Over Screen.
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

  draw(ctx, state, score, bestScore, time, timeSinceDeath, drunkMeter = 0, isSmashActive = false) {
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
      ctx.fillText('★ OVERDRIVE & ROGUELITE ★', cx, 205);

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

      // 3. Drunk-Meter Energy Bar (Overdrive)
      const barW = 200;
      const barH = 15;
      const barX = cx - barW / 2;
      const barY = 102;

      // Energy Label
      ctx.fillStyle = "#7d8aa8";
      ctx.font = "bold 11px monospace";
      ctx.fillText("OVERDRIVE: " + Math.floor(drunkMeter) + "%", cx, barY - 4);

      // Background
      ctx.fillStyle = 'rgba(11, 14, 20, 0.8)';
      ctx.fillRect(barX, barY, barW, barH);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#2e3856';
      ctx.strokeRect(barX, barY, barW, barH);

      // Filled portion
      const fillW = Math.max(0, Math.min(barW, (drunkMeter / 100) * barW));
      if (drunkMeter >= 100) {
        // Blinking gold/cyan when full
        ctx.fillStyle = Math.sin(time * 12) > 0 ? '#ffd13b' : '#00f0ff';
      } else {
        ctx.fillStyle = '#00f0ff';
      }
      ctx.fillRect(barX + 1, barY + 1, Math.max(0, fillW - 2), barH - 2);

      // Overdrive ready text
      if (drunkMeter >= 100) {
        ctx.fillStyle = '#ffd13b';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('⚡ DOUBLE TAP: SMASH READY! ⚡', cx, barY + 26);
      } else if (isSmashActive) {
        ctx.fillStyle = '#ff3b5c';
        ctx.font = 'bold 13px monospace';
        ctx.fillText('💥 SUPERNOVA SMASH! 💥', cx, barY + 26);
      }

      // 4. Near-Miss Floating Notification
      if (this.nearMissText) {
        ctx.fillStyle = '#05ffa1';
        ctx.font = '900 20px monospace';
        ctx.fillText(this.nearMissText, cx, 160);
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