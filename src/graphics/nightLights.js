/**
 * Đèn sáng khi trời tối (mưa giông, đêm sao, sương mù...).
 * =====================================================================
 * Dữ liệu thuần khai báo theo từng địa danh — muốn thêm/bớt đèn thì chỉ sửa
 * mảng trong NIGHT_LIGHTS[themeId]. Toạ độ tính theo khung vẽ 400 x 700.
 *
 * Các loại đèn:
 *   { type: 'lamp',    x, y }                       — đèn dầu / đèn bàn thờ
 *   { type: 'boat',    x, y }                       — đèn trên thuyền (có vệt loang)
 *   { type: 'windows', x, y, w, h, cols, rows, lit } — ô cửa sổ sáng (lit = tỉ lệ sáng 0..1)
 *   { type: 'string',  x1, y1, x2, y2, n }           — chuỗi lồng đèn / đèn cầu
 *
 * Ban ngày (level = 0) không vẽ gì nên vẫn chân thực.
 */

const WARM = '255, 196, 120';
const COOL = '190, 220, 255';

// Hash ổn định để cửa sổ nào sáng/đỏ nhấp nháy cố định giữa các frame
function hash(n) {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
}

export const NIGHT_LIGHTS = {
  // ---------------------------------------------------------------- SA PA
  sapa: [
    { type: 'lamp', x: 65, y: 531 },
    { type: 'lamp', x: 352, y: 429 },
    { type: 'windows', x: 340, y: 418, w: 34, h: 12, cols: 3, rows: 1, lit: 0.8 },
    { type: 'lamp', x: 95, y: 214 },
    { type: 'lamp', x: 192, y: 233 },
    { type: 'lamp', x: 60, y: 524, cool: true }
  ],

  // ------------------------------------------------------------- NINH BÌNH
  ninhbinh: [
    { type: 'boat', x: 150, y: 455 },
    { type: 'boat', x: 262, y: 556 },
    { type: 'boat', x: 330, y: 586 },
    { type: 'lamp', x: 62, y: 452 },
    { type: 'windows', x: 48, y: 442, w: 32, h: 12, cols: 2, rows: 1, lit: 0.7 }
  ],

  // ---------------------------------------------------------------- HÀ NỘI
  hanoi: [
    // Tháp Rùa: 3 tầng cửa vòm sáng
    { type: 'windows', x: 174, y: 408, w: 72, h: 96, cols: 3, rows: 4, lit: 0.55 },
    // Cầu Long Biên: đèn dọc thành cầu
    { type: 'string', x1: 0, y1: 347, x2: 175, y2: 343, n: 6 },
    { type: 'string', x1: 255, y1: 343, x2: 400, y2: 347, n: 6 },
    // Nhà cao tầng phía xa
    { type: 'windows', x: 280, y: 328, w: 60, h: 34, cols: 4, rows: 3, lit: 0.45 }
  ],

  // ------------------------------------------------------------------ HUẾ
  hue: [
    // Cầu Tràng Tiền: chuỗi đèn theo vòm
    { type: 'string', x1: 200, y1: 424, x2: 290, y2: 404, n: 5 },
    { type: 'string', x1: 290, y1: 404, x2: 380, y2: 424, n: 5 },
    // Đại Nội: cửa sổ điện
    { type: 'windows', x: 120, y: 330, w: 74, h: 62, cols: 3, rows: 3, lit: 0.5 },
    { type: 'lamp', x: 152, y: 300 },
    { type: 'boat', x: 250, y: 560 }
  ],

  // -------------------------------------------------------------- ĐÀ NẴNG
  danang: [
    // Cao ốc ven sông Hàn
    { type: 'windows', x: 178, y: 208, w: 150, h: 118, cols: 8, rows: 9, lit: 0.42 },
    // Cầu Rồng: đèn dọc thành cầu + đèn mắt rồng
    { type: 'string', x1: 0, y1: 492, x2: 200, y2: 486, n: 7 },
    { type: 'string', x1: 200, y1: 486, x2: 400, y2: 492, n: 7 },
    { type: 'lamp', x: 268, y: 452 },
    { type: 'lamp', x: 300, y: 458 }
  ],

  // --------------------------------------------------------------- HỘI AN
  hoian: [
    { type: 'boat', x: 270, y: 466 },
    { type: 'boat', x: 140, y: 556 },
    { type: 'lamp', x: 198, y: 402 },
    { type: 'lamp', x: 286, y: 402 },
    { type: 'windows', x: 36, y: 300, w: 40, h: 44, cols: 2, rows: 3, lit: 0.55 }
  ],

  // --------------------------------------------------------------- ĐÀ LẠT
  dalat: [
    { type: 'windows', x: 268, y: 392, w: 44, h: 22, cols: 3, rows: 2, lit: 0.6 },
    { type: 'lamp', x: 264, y: 408 },
    { type: 'lamp', x: 110, y: 470 },
    { type: 'lamp', x: 330, y: 520 }
  ],

  // --------------------------------------------------------------- TP.HCM
  hcm: [
    // Landmark 81
    { type: 'windows', x: 72, y: 62, w: 46, h: 226, cols: 4, rows: 11, lit: 0.5 },
    // Bitexco
    { type: 'windows', x: 288, y: 168, w: 26, h: 168, cols: 2, rows: 9, lit: 0.45 },
    // Toà nhà nâu bên phải
    { type: 'windows', x: 330, y: 392, w: 28, h: 70, cols: 2, rows: 5, lit: 0.5 },
    // Đèn đường dưới chân
    { type: 'lamp', x: 150, y: 560 },
    { type: 'lamp', x: 250, y: 580 }
  ],

  // ------------------------------------------------------------- MIỀN TÂY
  mientay: [
    { type: 'boat', x: 60, y: 483 },
    { type: 'boat', x: 128, y: 437 },
    { type: 'boat', x: 215, y: 470 },
    { type: 'boat', x: 300, y: 455 },
    { type: 'boat', x: 148, y: 494 },
    { type: 'boat', x: 60, y: 512 },
    { type: 'boat', x: 300, y: 512 },
    { type: 'boat', x: 112, y: 574 },
    { type: 'boat', x: 232, y: 574 },
    { type: 'lamp', x: 40, y: 600 },
    { type: 'lamp', x: 340, y: 596 }
  ]
};

export function drawNightLights(ctx, theme, level, time) {
  if (!theme || level <= 0.01) return;
  const defs = NIGHT_LIGHTS[theme.id];
  if (!defs || defs.length === 0) return;

  const lv = Math.max(0, Math.min(1, level));
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  for (let i = 0; i < defs.length; i++) {
    const d = defs[i];
    const flicker = 0.86 + hash(i * 7 + 1) * 0.14 + Math.sin(time * (1.6 + hash(i) * 2) + i) * 0.05;

    if (d.type === 'lamp') {
      const a = lv * 0.9 * flicker;
      const col = d.cool ? COOL : WARM;
      ctx.fillStyle = `rgba(${col}, ${a * 0.14})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${col}, ${a * 0.26})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255, 246, 214, ${a})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 1.9, 0, Math.PI * 2);
      ctx.fill();
    } else if (d.type === 'boat') {
      const a = lv * 0.95 * flicker;
      ctx.fillStyle = `rgba(${WARM}, ${a * 0.16})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255, 238, 196, ${a})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 2.1, 0, Math.PI * 2);
      ctx.fill();
      // vệt loang xuống mặt nước
      ctx.fillStyle = `rgba(${WARM}, ${a * 0.22})`;
      ctx.fillRect(d.x - 1, d.y + 3, 2, 11);
      ctx.fillStyle = `rgba(${WARM}, ${a * 0.12})`;
      ctx.fillRect(d.x - 2.4, d.y + 3, 4.8, 9);
    } else if (d.type === 'windows') {
      const cols = d.cols || 3;
      const rows = d.rows || 3;
      const cw = d.w / cols;
      const ch = d.h / rows;
      const litRate = d.lit === undefined ? 0.5 : d.lit;
      for (let cx2 = 0; cx2 < cols; cx2++) {
        for (let ry = 0; ry < rows; ry++) {
          const idx = i * 31 + cx2 * 13 + ry * 7;
          if (hash(idx) > litRate) continue;
          const wx = d.x + cx2 * cw + cw * 0.5;
          const wy = d.y + ry * ch + ch * 0.5;
          const wa = lv * (0.4 + hash(idx + 3) * 0.45) * flicker;
          // cửa sổ xa: chấm ấm nhỏ + quầng mờ
          ctx.fillStyle = `rgba(${WARM}, ${wa * 0.3})`;
          ctx.beginPath();
          ctx.arc(wx, wy, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(255, 232, 182, ${wa * 0.85})`;
          ctx.beginPath();
          ctx.arc(wx, wy, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (d.type === 'string') {
      const n = d.n || 5;
      for (let k = 0; k < n; k++) {
        const t = n === 1 ? 0 : k / (n - 1);
        const lx = d.x1 + (d.x2 - d.x1) * t;
        const ly = d.y1 + (d.y2 - d.y1) * t - Math.sin(t * Math.PI) * 5;
        const la = lv * (0.6 + hash(i * 17 + k) * 0.4) * flicker;
        ctx.fillStyle = `rgba(${WARM}, ${la * 0.22})`;
        ctx.beginPath();
        ctx.arc(lx, ly, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255, 242, 205, ${la})`;
        ctx.beginPath();
        ctx.arc(lx, ly, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  ctx.restore();
}
