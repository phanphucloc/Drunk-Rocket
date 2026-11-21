/**
 * SỔ TAY BƯU THIẾP — meta-progression lưu qua các ván.
 * Mỗi lần bay qua một địa danh trong một kiểu thời tiết mới, người chơi nhận 1 con tem.
 * Không ảnh hưởng sức mạnh/điểm số nên không phá bảng xếp hạng.
 */
const STORAGE_KEY = 'dieu_stamps_v1';

export const WEATHER_KINDS = [
  { id: 'sun', icon: '☀', nameVi: 'Nắng', nameEn: 'Sunny' },
  { id: 'clouds', icon: '☁', nameVi: 'Mây', nameEn: 'Cloudy' },
  { id: 'rain', icon: '🌧', nameVi: 'Mưa', nameEn: 'Rain' },
  { id: 'storm', icon: '⛈', nameVi: 'Giông', nameEn: 'Storm' },
  { id: 'stars', icon: '🌙', nameVi: 'Đêm sao', nameEn: 'Starry night' },
  { id: 'fog', icon: '🌫', nameVi: 'Sương', nameEn: 'Fog' }
];

const VALID = new Set(WEATHER_KINDS.map(w => w.id));

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function write(map) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (e) { /* bộ nhớ đầy / chế độ riêng tư */ }
}

export function loadStamps() {
  return read();
}

/** Ghi tem mới; trả về true nếu đây là tem CHƯA từng có. */
export function recordStamp(landmarkTier, weatherId) {
  const tier = Number(landmarkTier);
  const kind = VALID.has(weatherId) ? weatherId : null;
  if (!tier || !kind) return false;
  const map = read();
  const key = `${tier}:${kind}`;
  if (map[key]) return false;
  map[key] = Date.now();
  write(map);
  return true;
}

export function countStamps() {
  return Object.keys(read()).length;
}

export function totalStamps(landmarkCount = 9) {
  return landmarkCount * WEATHER_KINDS.length;
}

export function hasStamp(map, tier, weatherId) {
  return !!map[`${tier}:${weatherId}`];
}

/** Danh hiệu suy ra từ số tem đã sưu tầm (hiển thị ở màn kết thúc). */
export function getTitleKey() {
  const n = countStamps();
  let step = 1;
  if (n >= 54) step = 6;
  else if (n >= 42) step = 5;
  else if (n >= 24) step = 4;
  else if (n >= 12) step = 3;
  else if (n >= 5) step = 2;
  return 'title.' + step;
}
