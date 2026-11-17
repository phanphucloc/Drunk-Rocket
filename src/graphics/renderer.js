/**
 * Canvas 2D Vector & Pixel-Art Entity Renderer
 * Cyber Neon Arcade Palette with Goofy Comedic Cartoon Styling
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
  HAZARD_BLACK: '#0b0e14',
  BEER_BOTTLE: '#2e7d32',
  BEER_FOAM: '#fff9c4'
};

/**
 * Functional export for rocket preview / rendering
 * Super goofy, drunken Gen-Z rocket with wobbly cross-eyes, derpy tongue / beer bottle
 */
export function drawRocket(ctx, x, y, options = {}) {
  const angle = options.angle || 0;
  const isThrusting = !!options.isThrusting;
  const scale = options.scale || 1.0;
  const dizzyTime = options.dizzyTime || 0;
  const isQuantum = !!options.isQuantum;
  const isDead = !!options.isDead;
  const isSmashing = !!options.isSmashing;
  const justScored = !!options.justScored;

  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  // Quantum Ghostly / Semi-Transparent Phase
  if (isQuantum) {
    ctx.globalAlpha = 0.38;

    // Chromatic aberration glitch silhouettes
    ctx.save();
    ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(-4, 0, 16, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 59, 92, 0.3)';
    ctx.beginPath();
    ctx.ellipse(4, 0, 16, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 1. Thruster flame (Mega Burner if Supernova Smashing, else drunken farts/flickers)
  if (isSmashing) {
    // Massive Dragon Supernova Fire Trail
    const flameLen = 42 + Math.sin(dizzyTime * 50) * 12;

    // Outermost violet/red inferno
    ctx.fillStyle = '#ff0055';
    ctx.beginPath();
    ctx.moveTo(-16, -10);
    ctx.lineTo(-16 - flameLen, 0);
    ctx.lineTo(-16, 10);
    ctx.closePath();
    ctx.fill();

    // Intense Gold flame
    ctx.fillStyle = '#ffd13b';
    ctx.beginPath();
    ctx.moveTo(-16, -7);
    ctx.lineTo(-16 - flameLen * 0.75, 0);
    ctx.lineTo(-16, 7);
    ctx.closePath();
    ctx.fill();

    // White-hot plasma core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-16, -4);
    ctx.lineTo(-16 - flameLen * 0.45, 0);
    ctx.lineTo(-16, 4);
    ctx.closePath();
    ctx.fill();
  } else if (isThrusting) {
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

  // 4. Main Chubby Rocket Fuselage
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

  // Nose Cone Tip (Goofy soft rubber nose)
  ctx.fillStyle = isDead ? '#666666' : '#ff3b5c';
  ctx.beginPath();
  ctx.arc(14, 0, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // 5. Hilarious Comic Eyes & Facial Expressions
  if (isDead) {
    // X_X Dead eyes
    ctx.strokeStyle = '#0b0e14';
    ctx.lineWidth = 1.8;
    // Left eye X
    ctx.beginPath();
    ctx.moveTo(0, -5); ctx.lineTo(6, 0);
    ctx.moveTo(6, -5); ctx.lineTo(0, 0);
    ctx.stroke();
    // Mouth crying down
    ctx.beginPath();
    ctx.arc(6, 6, 3, Math.PI, 0);
    ctx.stroke();
  } else {
    // Big Derpy Cock-eyed Eyeballs (One big, one small for maximum goofy vibe)
    // Left Big Eye
    ctx.fillStyle = PALETTE.WHITE;
    ctx.beginPath();
    ctx.arc(4, -3, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PALETTE.NAVY;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Right Small Cross-Eye
    ctx.fillStyle = PALETTE.WHITE;
    ctx.beginPath();
    ctx.arc(10, -1, 4.0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Dazed Drunk Pupils wobbling in different directions (cross-eyed)
    const p1x = Math.sin(dizzyTime * 7) * 2.2;
    const p1y = Math.cos(dizzyTime * 6) * 1.8;
    const p2x = Math.cos(dizzyTime * 8) * 1.5;
    const p2y = Math.sin(dizzyTime * 9) * 1.5;

    ctx.fillStyle = PALETTE.VOID;
    ctx.beginPath();
    ctx.arc(4 + p1x, -3 + p1y, 2.0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10 + p2x, -1 + p2y, 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Specular eye shine
    ctx.fillStyle = PALETTE.WHITE;
    ctx.fillRect(3 + p1x, -4 + p1y, 1.2, 1.2);
    ctx.fillRect(9 + p2x, -2 + p2y, 1.0, 1.0);

    // Cute Rosy Drunk Cheeks (Blushing)
    ctx.fillStyle = 'rgba(255, 59, 92, 0.65)';
    ctx.beginPath();
    ctx.arc(2, 4, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Derpy Tongue Sticking Out (😛) or Happy Woohoo smile
    if (justScored) {
      // Big happy open mouth shouting "HEYYY!"
      ctx.fillStyle = '#0b0e14';
      ctx.beginPath();
      ctx.arc(8, 4, 3.5, 0, Math.PI);
      ctx.fill();
      ctx.fillStyle = '#ff3b5c';
      ctx.beginPath();
      ctx.arc(8, 5, 2, 0, Math.PI);
      ctx.fill();
    } else {
      // Goofy tongue sticking out
      ctx.strokeStyle = PALETTE.ROCKET_DARK;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(7, 3, 2.5, 0, Math.PI * 0.9);
      ctx.stroke();

      // Pink tongue
      ctx.fillStyle = '#ff3b5c';
      ctx.beginPath();
      ctx.ellipse(8, 6, 2.2, 3.2, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cute mini beer bottle taped to the side
    ctx.save();
    ctx.translate(-4, 6);
    ctx.rotate(0.3);
    // Green glass bottle body
    ctx.fillStyle = PALETTE.BEER_BOTTLE;
    ctx.fillRect(0, 0, 7, 3.5);
    // Bottle neck
    ctx.fillRect(7, 1, 3, 1.5);
    // Foam cap
    ctx.fillStyle = PALETTE.BEER_FOAM;
    ctx.fillRect(10, 0.5, 2, 2.5);
    ctx.restore();
  }

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
  static drawRocket(ctx, rocket, options = {}) {
    drawRocket(ctx, rocket.x, rocket.y, {
      angle: rocket.angle,
      isThrusting: rocket.isThrusting,
      scale: rocket.scale || (rocket.radius ? rocket.radius / 12 : 1.0),
      dizzyTime: (rocket.totalTime || 0) + (rocket.pupilX || 0),
      isQuantum: !!rocket.isQuantum || (rocket.quantumTimer > 0),
      isDead: !!options.isDead,
      isSmashing: !!options.isSmashing,
      justScored: !!options.justScored
    });
  }

  static drawLaserPillar(ctx, pillar, gameHeight = 700) {
    drawLaserHazard(ctx, pillar, gameHeight);
  }
}
