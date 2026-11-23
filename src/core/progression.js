/**
 * Vòng đời & tiến trình: 5 VÒNG, mỗi vòng nâng cấp chú diều.
 * =====================================================================
 * QUẢN LÍ ĐỊA DANH:
 *   - `DEFAULT_LANDMARKS` : danh sách mặc định (dùng khi vòng không khai báo riêng)
 *   - `LAPS[i].landmarks` : mảng số hiệu địa danh (1..9) của riêng vòng đó.
 *     + Để trống / null  -> dùng DEFAULT_LANDMARKS
 *     + Muốn đổi thứ tự, bớt, thêm hay chuyển địa danh giữa các vòng: chỉ sửa mảng này.
 *   - Thêm địa danh mới: thêm 1 mục vào TIER_THEMES (themes.js) rồi thêm số hiệu vào đây.
 *
 * VÒNG & DIỀU:
 *   - `LAPS[i].kite` : cấp diều của vòng (1..5) — quyết định hình dáng/màu diều.
 *   - Hết 5 vòng thì quay lại vòng cuối (chơi vô tận), diều giữ cấp cao nhất.
 * =====================================================================
 */

import { TIER_THEMES } from '../graphics/themes.js';

// Số CỔNG để qua 1 địa danh (chương). 12 cổng ~ 22-25 giây -> mỗi vùng miền đủ thời gian
// để thời tiết chuyển (nắng -> mưa -> đêm). Đổi 1 số này là đổi nhịp độ cả game.
// Chương tính theo SỐ CỔNG ĐÃ VƯỢT (không theo điểm) để nhịp thời tiết luôn ổn định,
// còn điểm (Near-Miss / Smash / hạt gió) chỉ dùng cho bảng xếp hạng.
export const POINTS_PER_CHAPTER = 12;
export const GATES_PER_CHAPTER = POINTS_PER_CHAPTER; // tương thích tên cũ

// Chia 5 phẩm sắc cho 9 tỉnh trong 1 vòng: 2 - 2 - 2 - 2 - 1
// (Trắng -> Xanh -> Tím -> Vàng -> Ngũ Sắc). Người chơi mới thấy "lên sắc" ngay ở tỉnh 3.
export const COLOR_SPLIT = [0, 0, 1, 1, 2, 2, 3, 3, 4];

/** 5 phẩm sắc trong 1 vòng — chỉ đổi BẢNG MÀU, không đổi hình dáng. */
export const KITE_COLORS = [
  { key: 'bach', nameKey: 'color.1', paper: '#f9f9f4', light: '#ffffff', dark: '#cdd5da', trim: '#9fb3c8', motif: '#7f9bb5' },
  { key: 'thanh', nameKey: 'color.2', paper: '#d9f6e3', light: '#f4fffa', dark: '#8ed2af', trim: '#2f9e6a', motif: '#7fe3c4' },
  { key: 'tu', nameKey: 'color.3', paper: '#eee1ff', light: '#fbf4ff', dark: '#b48ce0', trim: '#7b3fd4', motif: '#c9a2ff' },
  { key: 'hoang', nameKey: 'color.4', paper: '#ffe8a8', light: '#fff9de', dark: '#d9a83a', trim: '#c9902a', motif: '#ffd76a' },
  { key: 'ngusac', nameKey: 'color.5', paper: '#ffd76a', light: '#fff3c4', dark: '#e0a020', trim: '#e63946', motif: '#2fb894', rainbow: true }
];

// Danh sách địa danh mặc định (số hiệu tier trong themes.js)
export const DEFAULT_LANDMARKS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Cấu hình 5 vòng. Muốn mỗi vòng đi ít/many địa danh khác nhau thì điền mảng riêng.
 * Ví dụ: { id: 1, kite: 1, landmarks: [1, 2, 3] }
 */
export const LAPS = [
  { id: 1, kite: 1, nameVi: 'Vòng 1 · Khởi hành', nameEn: 'Lap 1 · Departure', landmarks: null },
  { id: 2, kite: 2, nameVi: 'Vòng 2 · Lên sáo', nameEn: 'Lap 2 · Flute', landmarks: null },
  { id: 3, kite: 3, nameVi: 'Vòng 3 · Dệt lụa', nameEn: 'Lap 3 · Silk', landmarks: null },
  { id: 4, kite: 4, nameVi: 'Vòng 4 · Kết ngọc', nameEn: 'Lap 4 · Jade', landmarks: null },
  { id: 5, kite: 5, nameVi: 'Vòng 5 · Hoá rồng', nameEn: 'Lap 5 · Dragon', landmarks: null }
];

/**
 * 5 cấp diều — renderer.js đọc bảng này để vẽ.
 * tails: số dải đuôi nheo, flute: có sáo tre, aura: quầng sáng, whiskers: râu rồng.
 */
export const KITE_STAGES = [
  {
    stage: 1, nameKey: 'kite.1', shape: 'paper', scale: 1.00,
    paper: '#ffd13b', light: '#ffe57f', dark: '#d69e00',
    trim: '#e63946', motif: '#19c6a6',
    tails: 2, flute: false, aura: false, whiskers: false
  },
  {
    stage: 2, nameKey: 'kite.2', shape: 'paper', scale: 1.06,
    paper: '#ffcf3d', light: '#ffeeb0', dark: '#d09a10',
    trim: '#d62828', motif: '#19c6a6',
    tails: 3, flute: true, aura: false, whiskers: false
  },
  {
    stage: 3, nameKey: 'kite.3', shape: 'silk', scale: 1.12,
    paper: '#f7e6c4', light: '#fff6e2', dark: '#c8a97a',
    trim: '#c2455a', motif: '#e8a0b4',
    tails: 3, flute: true, aura: false, whiskers: false, wings: true
  },
  {
    stage: 4, nameKey: 'kite.4', shape: 'jade', scale: 1.16,
    paper: '#b7e3bd', light: '#e6f8e4', dark: '#6fae7a',
    trim: '#c9a24a', motif: '#2fb894',
    tails: 4, flute: true, aura: false, whiskers: false, sparkle: true, halo: true
  },
  {
    stage: 5, nameKey: 'kite.5', shape: 'dragon', scale: 1.22,
    paper: '#ffd76a', light: '#fff2c0', dark: '#d9a52c',
    trim: '#b3172a', motif: '#e8b84b',
    tails: 4, flute: true, aura: true, whiskers: true, sparkle: true
  }
];

function lapLandmarks(lap) {
  const list = (lap && Array.isArray(lap.landmarks) && lap.landmarks.length) ? lap.landmarks : DEFAULT_LANDMARKS;
  return list.filter(tier => TIER_THEMES[tier]);
}

function themeFor(tier) {
  return TIER_THEMES[tier] || TIER_THEMES[1];
}

/**
 * Tính toàn bộ tiến trình từ điểm số:
 * { lapIndex, lap, lapNumber, chapterInLap, chapterNumber, globalChapter, kiteStage, theme }
 */
export function colorStageFor(chapterInLap = 0) {
  const idx = Math.max(0, Math.min(COLOR_SPLIT.length - 1, chapterInLap));
  return COLOR_SPLIT[idx] + 1; // 1..5
}

/** Tính tiến trình từ ĐIỂM (15 điểm = 1 địa danh).
 * { lapIndex, lap, lapNumber, chapterInLap, chapterNumber, globalChapter,
 *   kiteStage (hình dáng 1..5), colorStage (phẩm sắc 1..5), theme }
 */
export function getProgression(gatesPassed = 0) {
  const gates = Math.max(0, Math.floor(gatesPassed));
  const chapterIndex = Math.floor(gates / POINTS_PER_CHAPTER);
  let remaining = chapterIndex;

  for (let i = 0; i < LAPS.length; i++) {
    const list = lapLandmarks(LAPS[i]);
    if (remaining < list.length) {
      const tier = list[remaining];
      return {
        lapIndex: i,
        lap: LAPS[i],
        lapNumber: i + 1,
        chapterInLap: remaining,
        chapterNumber: remaining + 1,
        globalChapter: chapterIndex,
        kiteStage: LAPS[i].kite,
        colorStage: colorStageFor(remaining),
        theme: themeFor(tier)
      };
    }
    remaining -= list.length;
  }

  // Hết 5 vòng: lặp lại vòng cuối vô tận, giữ hình dáng + phẩm sắc cao nhất
  const lastIndex = LAPS.length - 1;
  const lastLap = LAPS[lastIndex];
  const list = lapLandmarks(lastLap);
  const idx = remaining % list.length;
  return {
    lapIndex: lastIndex,
    lap: lastLap,
    lapNumber: lastIndex + 1,
    chapterInLap: idx,
    chapterNumber: idx + 1,
    globalChapter: chapterIndex,
    kiteStage: lastLap.kite,
    colorStage: colorStageFor(idx),
    theme: themeFor(list[idx])
  };
}

/**
 * Độ khó theo vòng — chỉ tăng NHỊP, không thu hẹp khe (tránh ức chế).
 * spawnInterval: giây giữa 2 cổng. breatherEvery: cứ N cổng thì nghỉ 1 nhịp.
 * Muốn chỉnh độ khó: sửa đúng bảng dưới đây.
 */
export const DIFFICULTY = [
  { spawnInterval: 1.85, breatherEvery: 10, breatherPause: 0.55 }, // vòng 1
  { spawnInterval: 1.72, breatherEvery: 10, breatherPause: 0.5 },  // vòng 2
  { spawnInterval: 1.60, breatherEvery: 9, breatherPause: 0.5 },   // vòng 3
  { spawnInterval: 1.48, breatherEvery: 9, breatherPause: 0.45 },  // vòng 4
  { spawnInterval: 1.36, breatherEvery: 8, breatherPause: 0.45 }   // vòng 5+
];

export function difficultyFor(lapIndex = 0) {
  const idx = Math.max(0, Math.min(DIFFICULTY.length - 1, lapIndex));
  return DIFFICULTY[idx];
}

export function getThemeForScore(score = 0) {
  return getProgression(score).theme;
}

export function getTierFromScore(score = 0) {
  return getProgression(score).theme.tier;
}

/** Ghép hình dáng (theo vòng) + phẩm sắc (theo tỉnh trong vòng). */
export function getKiteStyle(stage = 1, colorStage = 1) {
  const si = Math.max(0, Math.min(KITE_STAGES.length - 1, Math.round(stage) - 1));
  const ci = Math.max(0, Math.min(KITE_COLORS.length - 1, Math.round(colorStage) - 1));
  const shape = KITE_STAGES[si];
  const color = KITE_COLORS[ci];
  return {
    ...shape,
    ...color,          // phẩm sắc ghi đè bảng màu
    colorStage: ci + 1,
    colorKey: color.key,
    nameKey: shape.nameKey
  };
}

/** Tổng số địa danh của cả 5 vòng (dùng cho màn cốt truyện) */
export function totalLandmarks() {
  const set = new Set();
  LAPS.forEach(lap => lapLandmarks(lap).forEach(t => set.add(t)));
  DEFAULT_LANDMARKS.forEach(t => { if (TIER_THEMES[t]) set.add(t); });
  return set.size;
}
