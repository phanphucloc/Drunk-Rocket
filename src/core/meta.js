/**
 * Meta-progression: Hũ Gió (tiền tệ tích luỹ) + nâng cấp vĩnh viễn + mở khoá bùa.
 * Lưu ở localStorage, tách khỏi tiến trình từng ván.
 */
const KEY = 'dieu_meta_v1';

export const UPGRADES = [
  { id: 'start_meter', nameKey: 'meta.up.start', descKey: 'meta.up.startDesc', cost: 8, max: 4, step: 15 },
  { id: 'magnet', nameKey: 'meta.up.magnet', descKey: 'meta.up.magnetDesc', cost: 12, max: 2, step: 70 },
  { id: 'combo', nameKey: 'meta.up.combo', descKey: 'meta.up.comboDesc', cost: 10, max: 2, step: 4 }
];

/** Bùa mở sẵn từ đầu; các bùa còn lại mua bằng Hũ Gió. */
export const PERK_UNLOCK_COST = {
  nano_hull: 0,
  beer_bubble: 0,
  adrenaline_junkie: 0,
  quantum_drift: 14,
  chain_reaction: 16,
  drunk_magnet: 12
};

function blank() {
  return { wind: 0, levels: {}, perks: {} };
}

export function loadMeta() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    const parsed = JSON.parse(raw);
    return {
      wind: Math.max(0, Number(parsed.wind) || 0),
      levels: parsed.levels && typeof parsed.levels === 'object' ? parsed.levels : {},
      perks: parsed.perks && typeof parsed.perks === 'object' ? parsed.perks : {}
    };
  } catch (e) {
    return blank();
  }
}

export function saveMeta(meta) {
  try { localStorage.setItem(KEY, JSON.stringify(meta)); } catch (e) { /* bỏ qua */ }
}

/** Cộng Hũ Gió và trả về tổng mới. */
export function addWind(amount) {
  const meta = loadMeta();
  meta.wind = Math.max(0, meta.wind + Math.max(0, Math.round(amount)));
  saveMeta(meta);
  return meta.wind;
}

export function levelOf(meta, id) {
  return Math.max(0, Math.min(99, Number(meta.levels[id]) || 0));
}

export function upgradeCost(meta, def) {
  return def.cost + levelOf(meta, def.id) * Math.ceil(def.cost * 0.6);
}

export function buyUpgrade(id) {
  const def = UPGRADES.find(u => u.id === id);
  if (!def) return { ok: false, reason: 'unknown' };
  const meta = loadMeta();
  const lv = levelOf(meta, id);
  if (lv >= def.max) return { ok: false, reason: 'max' };
  const cost = upgradeCost(meta, def);
  if (meta.wind < cost) return { ok: false, reason: 'poor' };
  meta.wind -= cost;
  meta.levels[id] = lv + 1;
  saveMeta(meta);
  return { ok: true, meta };
}

export function isPerkUnlocked(meta, perkId) {
  const base = PERK_UNLOCK_COST[perkId];
  if (base === 0 || base === undefined) return true;
  return !!meta.perks[perkId];
}

export function unlockPerk(perkId) {
  const cost = PERK_UNLOCK_COST[perkId];
  if (!cost) return { ok: false, reason: 'unknown' };
  const meta = loadMeta();
  if (meta.perks[perkId]) return { ok: false, reason: 'owned' };
  if (meta.wind < cost) return { ok: false, reason: 'poor' };
  meta.wind -= cost;
  meta.perks[perkId] = true;
  saveMeta(meta);
  return { ok: true, meta };
}

/** Giá trị cộng dồn của một nâng cấp (0 nếu chưa mua). */
export function upgradeValue(id) {
  const def = UPGRADES.find(u => u.id === id);
  if (!def) return 0;
  return levelOf(loadMeta(), id) * def.step;
}

/** Thưởng Hũ Gió cuối ván: theo số cổng + tem mới. */
export function windRewardFor(gatesPassed, newStamps = 0) {
  return Math.floor(Math.max(0, gatesPassed) / 4) + Math.max(0, newStamps) * 2;
}
