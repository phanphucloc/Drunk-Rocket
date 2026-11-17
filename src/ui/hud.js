/**
 * Heads-Up Display (HUD) and UI Overlay Manager
 * Implements arcade pixel typography, screen shake, red flash, and medal badges.
 */
export class HUD {
  constructor(gameWidth = 400, gameHeight = 700) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;

    // Screen effects
    this.shakeDuration = 0;
    this.shakeIntensity = 0;
    this.flashDuration = 0;
  }

  triggerCrashEffects() {
    this.shakeDuration = 0.18; // 180ms screen shake
    this.shakeIntensity = 9;
    this.flashDuration = 0.08; // 80ms red flash
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

  draw(ctx, state, score, bestScore, time, timeSinceDeath) {
    const cx = this.gameWidth / 2;

    // Draw Screen Flash
    if (this.flashDuration > 0) {
      ctx.fillStyle = 'rgba(255, 59, 92, 0.4)';
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
    }

    ctx.save();
    ctx.textAlign = 'center';

    if (state === 'READY') {
      // 1. Ready Title
      ctx.fillStyle = '#ffd13b';
      ctx.font = 'bold 36px monospace';
      ctx.fillText('DRUNK ROCKET v1.1.0', cx, 180);

      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('⚡ TÀU SAY RƯỢU ⚡', cx, 215);

      // Blinking prompt
      if (Math.sin(time * 6) > -0.2) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px monospace';
        ctx.fillText('CHẠM HOẶC SPACE ĐỂ BAY', cx, 460);
      }

      // Best score banner
      ctx.fillStyle = '#a6b0cf';
      ctx.font = '14px monospace';
      ctx.fillText(`KỶ LỤC CỦA BẠN: ${bestScore}`, cx, 520);
    } else if (state === 'PLAYING') {
      // 2. In-Game Big Score Counter
      ctx.font = '900 48px monospace';
      // Black thick outline
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#0b0e14';
      ctx.strokeText(`${score}`, cx, 90);
      // Main text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${score}`, cx, 90);
    } else if (state === 'GAMEOVER') {
      // 3. Game Over Score Board
      const cardY = 190;
      const cardW = 300;
      const cardH = 220;

      // Outer Card Box
      ctx.fillStyle = 'rgba(22, 28, 46, 0.95)';
      ctx.fillRect(cx - cardW / 2, cardY, cardW, cardH);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#2e3856';
      ctx.strokeRect(cx - cardW / 2, cardY, cardW, cardH);

      // Game Over Header
      ctx.fillStyle = '#ff3b5c';
      ctx.font = '900 28px monospace';
      ctx.fillText('NỔ TÀU!', cx, cardY + 45);

      // Scores
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(`ĐIỂM: ${score}`, cx, cardY + 85);

      ctx.fillStyle = '#ffd13b';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`KỶ LỤC: ${bestScore}`, cx, cardY + 115);

      // Medal check
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

      // Instant Respawn prompt (enabled after 0.1s)
      if (timeSinceDeath >= 0.1) {
        if (Math.sin(time * 8) > -0.2) {
          ctx.fillStyle = '#05ffa1';
          ctx.font = '900 16px monospace';
          ctx.fillText('▶ CHẠM ĐỂ CHƠI LẠI NGAY ◀', cx, cardY + cardH + 45);
        }
      }
    }

    ctx.restore();
  }
}
