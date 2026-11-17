/**
 * Canvas 2D Vector & Pixel-Art Entity Renderer
 * Cyber Neon Arcade Palette:
 * - Void: #0b0e14
 * - Navy: #1a1f36
 * - Bumblebee Yellow: #ffd13b
 * - Laser Red: #ff3b5c
 * - Cyber Cyan: #00f0ff
 * - Highscore Green: #05ffa1
 * - Pure White: #ffffff
 */

export const PALETTE = {
  VOID: '#0b0e14',
  NAVY: '#1a1f36',
  ROCKET: '#ffd13b',
  ROCKET_DARK: '#d69e00',
  ROCKET_LIGHT: '#ffe57f',
  LASER: '#ff3b5c',
  LASER_GLOW: 'rgba(255, 59, 92, 0.45)',
  CYAN: '#00f0ff',
  CYAN_GLOW: 'rgba(0, 240, 255, 0.4)',
  GREEN: '#05ffa1',
  WHITE: '#ffffff',
  METAL_DARK: '#121624',
  METAL_MID: '#1c2338',
  METAL_LIGHT: '#2e3856',
  HAZARD_YELLOW: '#ffd13b',
  HAZARD_BLACK: '#0b0e14'
};

/**
 * Functional export for standalone preview / tests
 */
export function drawRocket(ctx, x, y, options = {}) {
  const angle = options.angle || 0;
  const isThrusting = !!options.isThrusting;
  const scale = options.scale || 1.0;
  const dizzyTime = options.dizzyTime || 0;
  const mode = options.mode || 'pixel';

  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  // 1. Thruster flame (Dual-layer Animated Plasma)
  if (isThrusting) {
    const flicker = Math.sin(dizzyTime * 45) * 3 + Math.random() * 4;
    const flameLen = 14 + flicker;

    // Outer plasma flame (Neon Danger Red)
    ctx.fillStyle = PALETTE.LASER;
    ctx.beginPath();
    ctx.moveTo(-16, -6);
    ctx.lineTo(-16 - flameLen, 0);
    ctx.lineTo(-16, 6);
    ctx.closePath();
    ctx.fill();

    // Mid flame (Neon Bumblebee Yellow)
    ctx.fillStyle = PALETTE.ROCKET;
    ctx.beginPath();
    ctx.moveTo(-16, -4);
    ctx.lineTo(-16 - flameLen * 0.75, 0);
    ctx.lineTo(-16, 4);
    ctx.closePath();
    ctx.fill();

    // Core flame (Cyber Cyan & White Hot)
    ctx.fillStyle = PALETTE.CYAN;
    ctx.beginPath();
    ctx.moveTo(-16, -2);
    ctx.lineTo(-16 - flameLen * 0.45, 0);
    ctx.lineTo(-16, 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = PALETTE.WHITE;
    ctx.fillRect(-17, -1, 3, 2);
  }

  // 2. Thruster Nozzle
  ctx.fillStyle = PALETTE.METAL_LIGHT;
  ctx.fillRect(-18, -5, 4, 10);
  ctx.fillStyle = PALETTE.METAL_DARK;
  ctx.fillRect(-18, -3, 2, 6);

  // 3. Stabilization Wings / Fins
  // Top fin
  ctx.fillStyle = PALETTE.ROCKET_DARK;
  ctx.beginPath();
  ctx.moveTo(-10, -8);
  ctx.lineTo(-17, -14);
  ctx.lineTo(-6, -8);
  ctx.closePath();
  ctx.fill();

  // Bottom fin
  ctx.beginPath();
  ctx.moveTo(-10, 8);
  ctx.lineTo(-17, 14);
  ctx.lineTo(-6, 8);
  ctx.closePath();
  ctx.fill();

  // Fin highlight tips
  ctx.fillStyle = PALETTE.CYAN;
  ctx.fillRect(-17, -14, 2, 2);
  ctx.fillRect(-17, 13, 2, 2);

  // 4. Main Rocket Body (Chubby Aerodynamic Fuselage)
  ctx.fillStyle = PALETTE.ROCKET;
  ctx.beginPath();
  ctx.ellipse(0, 0, 16, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body Outline & Shadow Bevel
  ctx.strokeStyle = PALETTE.ROCKET_DARK;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Top Body Highlight
  ctx.fillStyle = PALETTE.ROCKET_LIGHT;
  ctx.beginPath();
  ctx.ellipse(-2, -5, 10, 3, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // Nose Cone Tip
  ctx.fillStyle = PALETTE.WHITE;
  ctx.beginPath();
  ctx.arc(12, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  // 5. Goofy "Drunk" Eye & Face
  // Eyeball (Big White Circle)
  ctx.fillStyle = PALETTE.WHITE;
  ctx.beginPath();
  ctx.arc(3, -2, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = PALETTE.NAVY;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Drunk Pupil - wobbles or rolls around
  const pupilOffsetX = Math.sin(dizzyTime * 8) * 2.2;
  const pupilOffsetY = Math.cos(dizzyTime * 7) * 2.0;
  ctx.fillStyle = PALETTE.VOID;
  ctx.beginPath();
  ctx.arc(3 + pupilOffsetX, -2 + pupilOffsetY, 2.0, 0, Math.PI * 2);
  ctx.fill();

  // Pupil white reflection glint
  ctx.fillStyle = PALETTE.WHITE;
  ctx.fillRect(2 + pupilOffsetX, -3 + pupilOffsetY, 1.2, 1.2);

  // Cheek Blush (Rosy Drunk Glow)
  ctx.fillStyle = 'rgba(255, 59, 92, 0.5)';
  ctx.beginPath();
  ctx.arc(1, 4, 3.2, 0, Math.PI * 2);
  ctx.fill();

  // Cute goofy mouth / hiccup expression
  ctx.strokeStyle = PALETTE.ROCKET_DARK;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(8, 4, 2, 0, Math.PI);
  ctx.stroke();

  ctx.restore();
}

/**
 * Functional export for standalone laser hazard preview / tests
 */
export function drawLaserHazard(ctx, pillar, gameHeight = 700, totalTime = 0) {
  const x = Math.floor(pillar.x);
  const w = pillar.width || 52;
  const topY = Math.floor(pillar.topY !== undefined ? pillar.topY : (pillar.gapY - (pillar.gapHeight || 140) / 2));
  const bottomY = Math.floor(pillar.bottomY !== undefined ? pillar.bottomY : (pillar.gapY + (pillar.gapHeight || 140) / 2));
  const emitterH = pillar.emitterHeight || 26;
  const pulsePhase = pillar.pulsePhase !== undefined ? pillar.pulsePhase : totalTime * 8;
  const isBeamActive = pillar.isBeamActive !== undefined ? pillar.isBeamActive : true;

  // 1. Top Metal Column (from ceiling y=0 down to topY)
  // Base metal
  ctx.fillStyle = PALETTE.METAL_DARK;
  ctx.fillRect(x, 0, w, topY);

  // Bevel shading
  ctx.fillStyle = PALETTE.METAL_MID;
  ctx.fillRect(x + 4, 0, w - 8, topY - emitterH);

  // Retro hazard warning stripes on top pillar
  drawHazardStripes(ctx, x + 6, Math.max(0, topY - emitterH - 30), w - 12, 24);

  // Top Emitter Head
  ctx.fillStyle = PALETTE.METAL_LIGHT;
  ctx.fillRect(x - 2, topY - emitterH, w + 4, emitterH);
  ctx.strokeStyle = PALETTE.CYAN;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - 2, topY - emitterH, w + 4, emitterH);

  // Top Emitter Glowing Energy Core (Cyan Pulsing)
  const corePulse = Math.sin(pulsePhase * 1.5) * 0.3 + 0.7;
  ctx.fillStyle = PALETTE.CYAN;
  ctx.fillRect(x + w / 2 - 8, topY - 8, 16, 7);
  ctx.fillStyle = PALETTE.WHITE;
  ctx.fillRect(x + w / 2 - 4, topY - 6, 8, 3);

  // 2. Bottom Metal Column (from bottomY to gameHeight)
  ctx.fillStyle = PALETTE.METAL_DARK;
  ctx.fillRect(x, bottomY, w, gameHeight - bottomY);

  // Bevel shading
  ctx.fillStyle = PALETTE.METAL_MID;
  ctx.fillRect(x + 4, bottomY + emitterH, w - 8, Math.max(0, gameHeight - bottomY - emitterH));

  // Retro hazard warning stripes on bottom pillar
  drawHazardStripes(ctx, x + 6, bottomY + emitterH + 6, w - 12, 24);

  // Bottom Emitter Head
  ctx.fillStyle = PALETTE.METAL_LIGHT;
  ctx.fillRect(x - 2, bottomY, w + 4, emitterH);
  ctx.strokeStyle = PALETTE.CYAN;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - 2, bottomY, w + 4, emitterH);

  // Bottom Emitter Glowing Energy Core
  ctx.fillStyle = PALETTE.CYAN;
  ctx.fillRect(x + w / 2 - 8, bottomY + 1, 16, 7);
  ctx.fillStyle = PALETTE.WHITE;
  ctx.fillRect(x + w / 2 - 4, bottomY + 3, 8, 3);

  // 3. Pulsing Deadly Laser Hazard Beam (Neon Red Energy Corridor)
  if (isBeamActive && bottomY > topY) {
    const pulse = Math.sin(pulsePhase);
    const beamW = 12 + pulse * 3;
    const beamX = x + (w - beamW) / 2;

    ctx.save();
    // High-energy Red Neon Glow
    ctx.shadowColor = PALETTE.LASER;
    ctx.shadowBlur = 14 + pulse * 5;

    // Wide atmospheric aura
    ctx.fillStyle = PALETTE.LASER_GLOW;
    ctx.fillRect(beamX - 6, topY, beamW + 12, bottomY - topY);

    // Main vibrant red laser beam
    ctx.fillStyle = PALETTE.LASER;
    ctx.fillRect(beamX, topY, beamW, bottomY - topY);

    // Intense White-Hot Plasma Center
    ctx.fillStyle = PALETTE.WHITE;
    ctx.fillRect(beamX + beamW / 2 - 1.5, topY, 3, bottomY - topY);

    // Electric plasma flickers / sparks
    const sparkCount = 3;
    for (let i = 0; i < sparkCount; i++) {
      const sparkY = topY + ((totalTime * 300 + i * 47) % (bottomY - topY));
      const sparkW = 6 + Math.random() * 8;
      ctx.fillStyle = PALETTE.WHITE;
      ctx.fillRect(x + (w - sparkW) / 2, sparkY, sparkW, 1.5);
    }

    ctx.restore();
  }
}

/**
 * Draws diagonal retro hazard warning stripes (Yellow & Black)
 */
function drawHazardStripes(ctx, x, y, width, height) {
  if (height <= 0 || width <= 0) return;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();

  ctx.fillStyle = PALETTE.HAZARD_YELLOW;
  ctx.fillRect(x, y, width, height);

  ctx.fillStyle = PALETTE.HAZARD_BLACK;
  const stripeW = 8;
  for (let sx = -height; sx < width; sx += stripeW * 2) {
    ctx.beginPath();
    ctx.moveTo(x + sx, y);
    ctx.lineTo(x + sx + stripeW, y);
    ctx.lineTo(x + sx + stripeW - height, y + height);
    ctx.lineTo(x + sx - height, y + height);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Standalone HUD draw function for previewing
 */
export function drawHUD(ctx, score, bestScore, options = {}) {
  const width = options.width || 400;
  const state = options.state || 'PLAYING';
  const cx = width / 2;

  ctx.save();
  ctx.textAlign = 'center';

  if (state === 'PLAYING') {
    ctx.font = '900 48px monospace';
    ctx.lineWidth = 6;
    ctx.strokeStyle = PALETTE.VOID;
    ctx.strokeText(`${score}`, cx, 85);
    ctx.fillStyle = PALETTE.WHITE;
    ctx.fillText(`${score}`, cx, 85);
  }
  ctx.restore();
}

/**
 * Main EntityRenderer class used by src/core/game.js
 */
export class EntityRenderer {
  static drawRocket(ctx, rocket) {
    if (rocket.isDead) return;

    drawRocket(ctx, rocket.x, rocket.y, {
      angle: rocket.angle,
      isThrusting: rocket.isThrusting,
      scale: 1.0,
      dizzyTime: (rocket.totalTime || 0) + (rocket.pupilX || 0)
    });
  }

  static drawLaserPillar(ctx, pillar, gameHeight = 700) {
    drawLaserHazard(ctx, pillar, gameHeight);
  }
}
