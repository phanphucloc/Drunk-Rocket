/**
 * Canvas 2D Vector & Pixel-Art Entity Renderer
 * Cyber Neon Arcade Palette with Goofy Comedic Cartoon Styling
 */
import { getKiteStyle } from '../core/progression.js';

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
 * Vẽ 5 CẤP DIỀU — mỗi cấp một dáng khác nhau rõ rệt:
 *   1 Diều Giấy  : thoi giấy vàng, 2 đuôi
 *   2 Diều Sáo   : thoi + 2 ống sáo tre + 3 đuôi
 *   3 Diều Lụa   : thoi lụa trắng ngà + 2 cánh lụa lớn + tua dài
 *   4 Diều Ngọc  : thân lục giác ngọc bích viền vàng + ngọc sáng + vòng hào quang
 *   5 Diều Rồng  : đầu rồng vàng, bờm đỏ, sừng, râu, nanh + quầng vàng
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

  // Hình dáng theo VÒNG (1..5) + phẩm sắc theo TỈNH trong vòng (1..5)
  const style = getKiteStyle(options.stage || 1, options.colorStage || 1);
  const shape = style.shape || 'paper';

  const paper = isDead ? '#8d939c' : style.paper;
  const paperLight = isDead ? '#b3b8bf' : style.light;
  const paperDark = isDead ? '#6d727a' : style.dark;
  let trim = isDead ? '#8a4a4f' : style.trim;
  let jade = isDead ? '#5f7f7a' : style.motif;

  // Phẩm sắc "Ngũ Sắc" (tỉnh cuối mỗi vòng): viền & hoạ tiết chuyển màu cầu vồng
  if (style.rainbow && !isDead) {
    const hue = (dizzyTime * 55) % 360;
    trim = `hsl(${hue.toFixed(0)}, 88%, 56%)`;
    jade = `hsl(${((hue + 150) % 360).toFixed(0)}, 82%, 62%)`;
  }
  const bamboo = '#8a6a3a';
  const bambooDark = '#5a4425';

  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(angle);
  ctx.scale(scale * (style.scale || 1), scale * (style.scale || 1));

  // Bất tử ngắn sau khi đổi chương: nhấp nháy nhẹ + vòng ngọc quanh diều
  const invincible = !!options.isInvincible && !isDead;
  if (invincible) {
    ctx.globalAlpha = 0.78 + Math.sin(dizzyTime * 16) * 0.14;
    ctx.strokeStyle = 'rgba(127, 227, 196, 0.6)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(-1, 0, 18, 0, Math.PI * 2);
    ctx.stroke();
  }

  // ---------------------------------------------------------------- quantum
  if (isQuantum) {
    ctx.globalAlpha = 0.38;
    ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(-4, 0, 16, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 59, 92, 0.3)';
    ctx.beginPath();
    ctx.ellipse(4, 0, 16, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ---------------------------------------------------------------- quầng sáng
  if ((isSmashing || style.aura) && !isDead) {
    const strong = isSmashing;
    const pulse = 1 + Math.sin(dizzyTime * (strong ? 18 : 5)) * 0.12;
    const radius = (strong ? 32 : 26) * pulse;
    const aura = ctx.createRadialGradient(0, 0, 4, 0, 0, radius);
    aura.addColorStop(0, `rgba(255, 236, 150, ${strong ? 0.75 : 0.34})`);
    aura.addColorStop(0.45, `rgba(255, 190, 80, ${strong ? 0.32 : 0.15})`);
    aura.addColorStop(1, 'rgba(255, 170, 60, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    if (strong) {
      ctx.strokeStyle = 'rgba(255, 246, 200, 0.7)';
      ctx.lineWidth = 1.6;
      for (let i = 0; i < 3; i++) {
        const a = dizzyTime * 13 + i * (Math.PI * 2 / 3);
        ctx.beginPath();
        ctx.arc(0, 0, 21 + i * 4, a, a + 1.1);
        ctx.stroke();
      }
    }
  }

  // Vòng hào quang ngọc (cấp 4)
  if (style.halo && !isDead) {
    ctx.strokeStyle = 'rgba(201, 162, 74, 0.55)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(-1, 0, 19, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(232, 248, 230, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(-1, 0, 21.5, 0, Math.PI * 2);
    ctx.stroke();
  }

  // ---------------------------------------------------------------- đuôi nheo
  const ribbonColors = [
    isDead ? '#9a8a5a' : style.trim,
    isDead ? '#8a4a4f' : '#ffd13b',
    isDead ? '#4f6b66' : style.motif,
    isDead ? '#b3b8bf' : style.light
  ];
  const ribbonCount = isDead ? 3 : Math.max(2, Math.min(4, style.tails || 3));
  ctx.lineCap = 'round';
  for (let i = 0; i < ribbonCount; i++) {
    const len = 30 - i * 4;
    const off = (i - (ribbonCount - 1) / 2) * 2.8;
    const w1 = Math.sin(dizzyTime * 7 + off) * 7;
    const w2 = Math.sin(dizzyTime * 7 + off + 1.4) * 9;
    ctx.strokeStyle = ribbonColors[i % ribbonColors.length];
    ctx.lineWidth = 2.6 - i * 0.25;
    ctx.beginPath();
    ctx.moveTo(-11, off * 0.5);
    ctx.bezierCurveTo(
      -11 - len * 0.35, off + w1,
      -11 - len * 0.7, off + w2,
      -11 - len, off + w2 * 0.55
    );
    ctx.stroke();
  }

  // ---------------------------------------------------------------- vệt gió
  if ((isThrusting || isSmashing) && !isDead) {
    ctx.save();
    ctx.strokeStyle = isSmashing ? 'rgba(255, 240, 170, 0.9)' : 'rgba(214, 242, 255, 0.75)';
    ctx.lineWidth = 1.6;
    const lines = isSmashing ? 5 : 3;
    for (let i = 0; i < lines; i++) {
      const off = (i - (lines - 1) / 2) * 5;
      const len = 9 + Math.sin(dizzyTime * 30 + i) * 3 + (isSmashing ? 14 : 0);
      ctx.beginPath();
      ctx.moveTo(-15, off);
      ctx.lineTo(-15 - len, off + Math.sin(dizzyTime * 18 + i) * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ================================================================ THÂN DIỀU
  // Bóng mờ phía sau: giúp diều luôn nổi bật trên phông tranh sáng (người chơi
  // mải ngắm cảnh vẫn thấy nhân vật)
  if (!isDead) {
    ctx.fillStyle = 'rgba(8, 14, 12, 0.16)';
    ctx.beginPath();
    ctx.ellipse(-1, 1.5, 17, 12.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const faceOffsetX = shape === 'dragon' ? 3 : 0;

  const drawFace = () => {
    if (isDead) {
      ctx.strokeStyle = '#0b0e14';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(5 + faceOffsetX, -6); ctx.lineTo(10 + faceOffsetX, -2);
      ctx.moveTo(10 + faceOffsetX, -6); ctx.lineTo(5 + faceOffsetX, -2);
      ctx.moveTo(11.5 + faceOffsetX, -3.5); ctx.lineTo(14.5 + faceOffsetX, -1);
      ctx.moveTo(14.5 + faceOffsetX, -3.5); ctx.lineTo(11.5 + faceOffsetX, -1);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(9 + faceOffsetX, 4, 2.6, Math.PI, 0);
      ctx.stroke();
      return;
    }

    // mắt to lác
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(5.6 + faceOffsetX, -3.6, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0b0e14';
    ctx.lineWidth = 1.1;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(10.4 + faceOffsetX, -1.4, 2.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const px = Math.sin(dizzyTime * 7) * 1.8;
    const py = Math.cos(dizzyTime * 6) * 1.5;
    ctx.fillStyle = '#0b0e14';
    ctx.beginPath();
    ctx.arc(5.6 + faceOffsetX + px, -3.6 + py, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10.4 + faceOffsetX + Math.sin(dizzyTime * 9) * 1.2, -1.4 + Math.cos(dizzyTime * 8) * 1.0, 1.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(4.8 + faceOffsetX + px, -4.7 + py, 1.1, 1.1);
    ctx.fillRect(10.0 + faceOffsetX, -2.4, 0.8, 0.8);

    // má ửng
    ctx.fillStyle = 'rgba(255, 59, 92, 0.5)';
    ctx.beginPath();
    ctx.ellipse(3.2 + faceOffsetX, 3.4, 2.6, 1.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // miệng / lưỡi
    if (justScored) {
      ctx.fillStyle = '#0b0e14';
      ctx.beginPath();
      ctx.arc(8 + faceOffsetX, 3.4, 3.0, 0, Math.PI);
      ctx.fill();
      ctx.fillStyle = '#ff7a9c';
      ctx.beginPath();
      ctx.arc(8 + faceOffsetX, 4.4, 1.8, 0, Math.PI);
      ctx.fill();
    } else {
      ctx.strokeStyle = paperDark;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(7.6 + faceOffsetX, 2.6, 2.3, 0, Math.PI * 0.9);
      ctx.stroke();
      ctx.fillStyle = '#ff7a9c';
      ctx.beginPath();
      ctx.ellipse(7.9 + faceOffsetX, 5.5, 2, 2.9, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  if (shape === 'dragon') {
    // ---- ĐẦU RỒNG ----
    // bờm đỏ sau đầu
    ctx.fillStyle = isDead ? '#7a5a5f' : trim;
    for (let i = 0; i < 3; i++) {
      const bx = 2 - i * 5;
      ctx.beginPath();
      ctx.moveTo(bx, -8);
      ctx.lineTo(bx - 4, -15 - i);
      ctx.lineTo(bx - 8, -7);
      ctx.closePath();
      ctx.fill();
    }

    // sừng
    ctx.strokeStyle = isDead ? '#7a6a4a' : '#e0c37a';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(6, dir * 8);
      ctx.quadraticCurveTo(0, dir * 16, -7, dir * 18);
      ctx.stroke();
    }

    // đầu
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.quadraticCurveTo(15, -8, 6, -9);
    ctx.quadraticCurveTo(-4, -9, -12, 0);
    ctx.quadraticCurveTo(-4, 9, 6, 9);
    ctx.quadraticCurveTo(15, 8, 20, 0);
    ctx.closePath();
    ctx.fillStyle = paper;
    ctx.fill();
    ctx.strokeStyle = trim;
    ctx.lineWidth = 2;
    ctx.stroke();

    // vảy sáng trên đầu
    if (!isDead) {
      ctx.fillStyle = 'rgba(255, 250, 215, 0.28)';
      ctx.beginPath();
      ctx.moveTo(17, -1);
      ctx.quadraticCurveTo(10, -7, 3, -8);
      ctx.quadraticCurveTo(9, -3, 17, -1);
      ctx.fill();
    }

    // hàm + nanh
    ctx.strokeStyle = trim;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(19, 1);
    ctx.quadraticCurveTo(15, 6, 8, 6.5);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 3; i++) {
      const fx = 16 - i * 3.4;
      ctx.beginPath();
      ctx.moveTo(fx, 4.4);
      ctx.lineTo(fx - 1.1, 7.4);
      ctx.lineTo(fx - 2.2, 4.4);
      ctx.closePath();
      ctx.fill();
    }

    drawFace();

    // râu rồng
    if (!isDead) {
      ctx.strokeStyle = '#d62828';
      ctx.lineWidth = 1.5;
      for (const dir of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(18, dir * 2);
        ctx.quadraticCurveTo(
          26 + Math.sin(dizzyTime * 5 + dir) * 2,
          dir * (6 + Math.sin(dizzyTime * 4) * 1.5),
          31,
          dir * (2 + Math.sin(dizzyTime * 6 + dir) * 2)
        );
        ctx.stroke();
      }
    }
  } else if (shape === 'jade') {
    // ---- DIỀU NGỌC (lục giác) ----
    ctx.beginPath();
    ctx.moveTo(17, 0);
    ctx.lineTo(9, -10.5);
    ctx.lineTo(-5, -11.5);
    ctx.lineTo(-13, 0);
    ctx.lineTo(-5, 11.5);
    ctx.lineTo(9, 10.5);
    ctx.closePath();
    ctx.fillStyle = paper;
    ctx.fill();
    ctx.strokeStyle = trim;
    ctx.lineWidth = 2.4;
    ctx.stroke();

    // viền vàng mảnh bên trong
    ctx.strokeStyle = 'rgba(201, 162, 74, 0.9)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(7.6, -8);
    ctx.lineTo(-4, -8.8);
    ctx.lineTo(-10.4, 0);
    ctx.lineTo(-4, 8.8);
    ctx.lineTo(7.6, 8);
    ctx.closePath();
    ctx.stroke();

    // viên ngọc phát sáng
    if (!isDead) {
      const pg = ctx.createRadialGradient(-3, 0, 1, -3, 0, 9);
      pg.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      pg.addColorStop(0.45, 'rgba(150, 240, 200, 0.85)');
      pg.addColorStop(1, 'rgba(47, 184, 148, 0)');
      ctx.fillStyle = pg;
      ctx.beginPath();
      ctx.arc(-3, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(-3, 0, 2.4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(120, 140, 130, 0.6)';
      ctx.beginPath();
      ctx.arc(-3, 0, 3.4, 0, Math.PI * 2);
      ctx.fill();
    }

    drawFace();
  } else {
    // ---- DIỀU GIẤY / LỤA ----
    if (style.wings && !isDead) {
      // cánh lụa lớn phía sau
      ctx.fillStyle = 'rgba(255, 246, 228, 0.88)';
      ctx.beginPath();
      ctx.moveTo(6, -5);
      ctx.quadraticCurveTo(-6, -27, -25, -21);
      ctx.quadraticCurveTo(-14, -9, -3, -3);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(6, 5);
      ctx.quadraticCurveTo(-6, 27, -25, 21);
      ctx.quadraticCurveTo(-14, 9, -3, 3);
      ctx.closePath();
      ctx.fill();
      // gân lụa
      ctx.strokeStyle = 'rgba(194, 69, 90, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(3, -4);
      ctx.quadraticCurveTo(-8, -18, -22, -19);
      ctx.moveTo(3, 4);
      ctx.quadraticCurveTo(-8, 18, -22, 19);
      ctx.stroke();
    }

    ctx.beginPath();
    if (shape === 'silk') {
      // thoi lụa bè ngang hơn
      ctx.moveTo(17, 0);
      ctx.quadraticCurveTo(9, -11, 0, -13);
      ctx.quadraticCurveTo(-9, -10, -13, 0);
      ctx.quadraticCurveTo(-9, 10, 0, 13);
      ctx.quadraticCurveTo(9, 11, 17, 0);
    } else if (style.stage === 2) {
      // DIỀU SÁO: thân "cánh cung" rộng hơn cấp 1, mép sau hơi lượn
      ctx.moveTo(18, 0);
      ctx.quadraticCurveTo(12, -9.5, 2, -13.5);
      ctx.quadraticCurveTo(-8, -10, -14, 0);
      ctx.quadraticCurveTo(-8, 10, 2, 13.5);
      ctx.quadraticCurveTo(12, 9.5, 18, 0);
    } else {
      ctx.moveTo(16, 0);
      ctx.quadraticCurveTo(10, -8, 1, -12);
      ctx.quadraticCurveTo(-8, -8, -12, 0);
      ctx.quadraticCurveTo(-8, 8, 1, 12);
      ctx.quadraticCurveTo(10, 8, 16, 0);
    }
    ctx.closePath();
    ctx.fillStyle = paper;
    ctx.fill();
    ctx.strokeStyle = trim;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // ---- DIỀU SÁO: 2 vây nhỏ + viền vàng kép + núm tua ----
    if (style.stage === 2 && !isDead) {
      // vây trên/dưới (nhỏ hơn nhiều so với cánh lụa cấp 3)
      ctx.fillStyle = paperLight;
      ctx.strokeStyle = trim;
      ctx.lineWidth = 1;
      for (const dir of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(4, dir * 10);
        ctx.quadraticCurveTo(-2, dir * 18, -10, dir * 14);
        ctx.quadraticCurveTo(-5, dir * 11, 1, dir * 9);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      // viền vàng mảnh bên trong
      ctx.strokeStyle = 'rgba(232, 184, 75, 0.85)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(14.5, 0);
      ctx.quadraticCurveTo(9, -7.5, 2, -10.6);
      ctx.quadraticCurveTo(-6.5, -7.6, -11.4, 0);
      ctx.quadraticCurveTo(-6.5, 7.6, 2, 10.6);
      ctx.quadraticCurveTo(9, 7.5, 14.5, 0);
      ctx.stroke();
      // núm tua ở đuôi
      ctx.fillStyle = '#ffd76a';
      ctx.beginPath();
      ctx.arc(-13, 0, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(179, 23, 42, 0.8)';
      ctx.lineWidth = 0.9;
      ctx.stroke();
    }

    // vệt sáng trên cánh
    if (!isDead) {
      ctx.fillStyle = 'rgba(255, 250, 215, 0.24)';
      ctx.beginPath();
      ctx.moveTo(13.5, -0.5);
      ctx.quadraticCurveTo(7, -7, 1.5, -9);
      ctx.quadraticCurveTo(-3, -6, -5, -3);
      ctx.quadraticCurveTo(4, -4, 13.5, -0.5);
      ctx.fill();
    }

    // xương tre
    ctx.strokeStyle = bamboo;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(-11, 0);
    ctx.moveTo(1, -11);
    ctx.lineTo(1, 11);
    ctx.stroke();
    ctx.fillStyle = bambooDark;
    for (const kx of [-6, -1, 4, 9]) {
      ctx.beginPath();
      ctx.arc(kx, 0, 0.9, 0, Math.PI * 2);
      ctx.fill();
    }

    // hoạ tiết giữa cánh
    if (shape !== 'silk') {
      ctx.strokeStyle = trim;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(-3, 0, 4.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = jade;
      ctx.beginPath();
      ctx.arc(-3, 0, 1.7, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // hoa văn lụa
      ctx.strokeStyle = 'rgba(194, 69, 90, 0.75)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(-2, 0, 5.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-2, 0, 2.6, 0, Math.PI * 2);
      ctx.stroke();
    }

    drawFace();
  }

  // ================================================================ SÁO TRE
  if (style.flute && !isDead) {
    ctx.save();
    ctx.translate(1, -11.5);
    ctx.rotate(-1.0);
    ctx.fillStyle = bamboo;
    ctx.fillRect(-1.4, -7.5, 2.8, 7.5);
    ctx.fillStyle = bambooDark;
    ctx.fillRect(-1.4, -7.5, 2.8, 1.4);
    ctx.fillStyle = bamboo;
    ctx.fillRect(1.8, -5.5, 2.4, 5.5);
    ctx.fillStyle = bambooDark;
    ctx.fillRect(1.8, -5.5, 2.4, 1.2);
    ctx.restore();

    if (isThrusting || isSmashing) {
      ctx.strokeStyle = 'rgba(255, 246, 200, 0.6)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 2; i++) {
        const r = 5 + i * 3 + Math.sin(dizzyTime * 10 + i) * 1.2;
        ctx.beginPath();
        ctx.arc(3, -14, r, Math.PI * 1.15, Math.PI * 1.6);
        ctx.stroke();
      }
    }
  }

  // ================================================================ ĐỐM SÁNG
  if (style.sparkle && !isDead) {
    for (let i = 0; i < 3; i++) {
      const a = dizzyTime * 2.2 + i * (Math.PI * 2 / 3);
      const rr = 16 + Math.sin(dizzyTime * 3 + i) * 2;
      ctx.fillStyle = 'rgba(255, 250, 220, 0.85)';
      ctx.beginPath();
      ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr * 0.6, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (invincible) ctx.globalAlpha = 1;
  ctx.restore();
}

/**
 * CỔNG TRE LÀNG — thay cho cột laser kim loại.
 * Hai ống tre giữ nguyên toạ độ va chạm; dây pháo đỏ + lồng đèn đánh dấu vùng nguy hiểm;
 * khoảng trống ở giữa là LUỒNG GIÓ lành (thay cho tia laser).
 */
export function drawLaserHazard(ctx, pillar, gameHeight = 700, totalTime = 0, currentTheme = null) {
  const x = Math.floor(pillar.x);
  const w = pillar.width || 52;
  const topY = Math.floor(pillar.topY !== undefined ? pillar.topY : (pillar.gapY - (pillar.gapHeight || 140) / 2));
  const bottomY = Math.floor(pillar.bottomY !== undefined ? pillar.bottomY : (pillar.gapY + (pillar.gapHeight || 140) / 2));
  const emitterH = pillar.emitterHeight || 26;
  const pulsePhase = pillar.pulsePhase !== undefined ? pillar.pulsePhase : totalTime * 8;
  const isBeamActive = pillar.isBeamActive !== undefined ? pillar.isBeamActive : true;
  const angle = pillar.angle || 0;

  // Màu nhấn theo từng vùng miền (giữ bản sắc mỗi chương)
  const theme = pillar.theme || currentTheme || null;
  const accent = (theme && theme.laserColor) || '#e63946';
  const accentGlow = (theme && theme.laserGlow) || 'rgba(230, 57, 70, 0.45)';
  const lanternLight = (theme && theme.emitterCore) || '#ffd13b';
  const t = pulsePhase;

  ctx.save();
  if (angle !== 0) {
    const cx = x + w / 2;
    const cy = Math.floor(pillar.gapY !== undefined ? pillar.gapY : (topY + bottomY) / 2);
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.translate(-cx, -cy);
  }

  // ---------------------------------------------------------------------
  // 1. ỐNG TRE
  // ---------------------------------------------------------------------
  // Thân tre vẽ bằng dải màu phẳng (rẻ hơn gradient tạo mỗi frame rất nhiều)
  const pole = (fromY, toY) => {
    if (toY <= fromY) return;
    ctx.fillStyle = '#6fa44c';
    ctx.fillRect(x, fromY, w, toY - fromY);
    ctx.fillStyle = '#96c46a';
    ctx.fillRect(x + 2, fromY, w * 0.38, toY - fromY);
    ctx.fillStyle = '#4f7a38';
    ctx.fillRect(x + w * 0.72, fromY, w * 0.28, toY - fromY);

    // Đốt tre
    for (let ny = fromY + 46; ny < toY; ny += 46) {
      ctx.strokeStyle = 'rgba(54, 84, 34, 0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 1, ny);
      ctx.lineTo(x + w - 1, ny);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x + 1, ny + 2.6);
      ctx.lineTo(x + w - 1, ny + 2.6);
      ctx.stroke();
    }

    // Sáng/tối dọc thân trúc
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(x + 6, fromY, 4, toY - fromY);
    ctx.fillStyle = 'rgba(28, 46, 20, 0.26)';
    ctx.fillRect(x + w - 7, fromY, 5, toY - fromY);
  };

  pole(-140, topY - emitterH);
  pole(bottomY + emitterH, gameHeight + 140);

  // Lá trúc nhỏ ở hai đầu ống (phất theo gió)
  const leaf = (lx, ly, ang, len) => {
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(ang);
    ctx.fillStyle = '#5f9a3e';
    ctx.beginPath();
    ctx.ellipse(0, 0, len, len * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(30, 60, 24, 0.5)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();
  };
  const sway = Math.sin(t * 1.4) * 0.12;
  leaf(x - 3, topY - emitterH - 10, 2.4 + sway, 9);
  leaf(x + w + 3, topY - emitterH - 22, -2.5 - sway, 8);
  leaf(x - 3, bottomY + emitterH + 12, -2.4 - sway, 9);

  // ---------------------------------------------------------------------
  // 2. ĐẦU TRỤ: MẤU TRE + LỒNG ĐÈN
  // ---------------------------------------------------------------------
  const head = (hy) => {
    // Mấu tre ngang
    ctx.fillStyle = '#d9a441';
    ctx.fillRect(x - 4, hy - 5, w + 8, 11);
    ctx.fillStyle = '#a97a26';
    ctx.fillRect(x - 4, hy + 3.4, w + 8, 2.4);

    // Quầng lồng đèn — 3 vòng sáng chồng thay cho radial gradient (nhanh hơn)
    const lx = x + w / 2;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = accentGlow;
    const rings = [26, 17, 10];
    for (let ri = 0; ri < rings.length; ri++) {
      ctx.globalAlpha = 0.30 - ri * 0.03;
      ctx.beginPath();
      ctx.arc(lx, hy, rings[ri], 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    // Thân lồng đèn (luôn đỏ - vàng cho đúng văn hoá)
    ctx.fillStyle = '#d62828';
    ctx.beginPath();
    ctx.ellipse(lx, hy, w * 0.42, 9.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = lanternLight;
    ctx.lineWidth = 1;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.ellipse(lx + i * (w * 0.14), hy, w * 0.09, 9, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Tua rua vàng
    ctx.strokeStyle = lanternLight;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(lx, hy + 9);
    ctx.lineTo(lx, hy + 15);
    ctx.stroke();
  };

  head(topY - emitterH + 5);
  head(bottomY + emitterH - 5);

  // ---------------------------------------------------------------------
  // 3. DÂY PHÁO ĐỎ (báo hiệu vùng nguy hiểm)
  // ---------------------------------------------------------------------
  const firecrackers = (bandY) => {
    ctx.save();
    ctx.strokeStyle = '#b03a2e';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x + 3, bandY + 4);
    ctx.quadraticCurveTo(x + w / 2, bandY + 11, x + w - 3, bandY + 4);
    ctx.stroke();

    const n = 4;
    for (let i = 0; i < n; i++) {
      const fx = x + 5 + i * ((w - 10) / (n - 1));
      const fy = bandY + 4 + Math.sin((i / (n - 1)) * Math.PI) * 5;
      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(0.14 + Math.sin(t * 2 + i) * 0.05);
      ctx.fillStyle = '#e63946';
      ctx.fillRect(-3.4, 0, 6.8, 11);
      ctx.fillStyle = '#ffd13b';
      ctx.fillRect(-3.4, 8, 6.8, 3);
      ctx.fillStyle = '#8a6a3a';
      ctx.fillRect(-1, -2.6, 2, 3);
      ctx.restore();
    }
    ctx.restore();
  };

  firecrackers(topY - emitterH - 44);
  firecrackers(bottomY + emitterH + 20);

  // ---------------------------------------------------------------------
  // 4. LUỒNG GIÓ LÀNH (lối bay an toàn)
  // ---------------------------------------------------------------------
  if (isBeamActive && bottomY > topY) {
    const gapH = bottomY - topY;
    const pulse = Math.sin(pulsePhase * 0.5);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // Nền gió: các elip mềm chồng nhau (không tạo gradient mỗi frame)
    const rx = (w - 8) / 2;
    const ry = gapH / 2;
    const midY = (topY + bottomY) / 2;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const windAlphaBase = 0.055 + pulse * 0.012;
    for (let wi = 0; wi < 3; wi++) {
      ctx.globalAlpha = windAlphaBase * (1 - wi * 0.22);
      ctx.fillStyle = 'rgb(214, 255, 246)';
      ctx.beginPath();
      ctx.ellipse(x + w / 2, midY, rx * (1 - wi * 0.22), ry * (1 - wi * 0.22), 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    // Vệt gió chảy dọc
    ctx.strokeStyle = 'rgba(240, 255, 252, 0.8)';
    ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      const off = x + 9 + i * ((w - 18) / 3);
      const speed = 30 + i * 9;
      const y = topY + ((t * speed + i * 53) % (gapH + 60)) - 30;
      const len = 20 + (i % 3) * 8;
      const y2 = Math.min(bottomY, y + len);
      if (y2 <= topY) continue;
      ctx.lineWidth = 1.4 + (i % 2) * 0.8;
      ctx.beginPath();
      ctx.moveTo(off, Math.max(topY, y));
      ctx.quadraticCurveTo(off + Math.sin((y + i * 20) * 0.06) * 3.5, (y + y2) / 2, off, y2);
      ctx.stroke();
    }

    // Đốm gió lấp lánh
    for (let i = 0; i < 4; i++) {
      const gy = topY + ((t * (18 + i * 5) + i * 71) % (gapH + 30)) - 15;
      const gx = x + 12 + ((i * 37) % (w - 24)) + Math.sin(t * 2 + i) * 3;
      ctx.fillStyle = 'rgba(236, 255, 250, 0.55)';
      ctx.beginPath();
      ctx.arc(gx, Math.max(topY + 4, Math.min(bottomY - 4, gy)), 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
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
      justScored: !!options.justScored,
      stage: options.stage || rocket.kiteStage || 1,
      colorStage: options.colorStage || rocket.colorStage || 1
    });
  }

  static drawLaserPillar(ctx, pillar, gameHeight = 700, currentTheme = null) {
    drawLaserHazard(ctx, pillar, gameHeight, 0, currentTheme);
  }
}
