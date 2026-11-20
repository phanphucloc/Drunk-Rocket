/**
 * i18n — đa ngôn ngữ cho toàn game (VI / EN).
 *
 * Dùng:
 *   import { t, getLang, setLang, onLangChange, applyDomI18n } from '../i18n.js';
 *   t('toolbar.story')            // chuỗi theo ngôn ngữ hiện tại
 *   t('hud.nearMiss', { n: 3 })   // thay {n} bằng 3
 *
 * Thêm chuỗi mới: thêm 1 khoá vào cả `vi` và `en` — không phải sửa gì khác.
 * Thêm ngôn ngữ mới: thêm 1 nhánh trong DICT và 1 nút trong toolbar.
 */

const STORAGE_KEY = 'dieu_say_gio_lang';

const DICT = {
  vi: {
    'brand.name': 'DIỀU SAY GIÓ',
    'brand.tagline': 'CÁNH DIỀU BAY DỌC VIỆT NAM',

    'ready.controls': 'Chạm: Thả diều  |  Chạm đúp: Lộng gió',
    'ready.tap': 'CHẠM HOẶC SPACE ĐỂ THẢ DIỀU',
    'ready.best': 'KỶ LỤC CỦA BẠN',
    'ready.kite': 'DIỀU',

    'hud.lap': 'VÒNG',
    'hud.chapter': 'CHƯƠNG',
    'hud.overdrive': 'ĐỘ LỘNG GIÓ',
    'hud.need': 'CẦN',
    'hud.points': 'ĐIỂM',
    'hud.smashReady': '🌪 CHẠM ĐÚP: LỘNG GIÓ SẴN SÀNG! 🌪',
    'hud.smashing': '💨 LỘNG GIÓ! PHÁ CỔNG TRE! 💨',
    'hud.nearMiss': 'NEAR-MISS! +{n}',
    'hud.magnet': '🌪 VÓ HÚT GIÓ',
    'hud.chain': '[2 CỔNG]',

    'gameover.title': 'ĐỨT DÂY DIỀU!',
    'gameover.score': 'ĐIỂM',
    'gameover.best': 'KỶ LỤC',
    'gameover.rank': 'CẤP BẬC',
    'gameover.tap': 'CHẠM ĐỂ THẢ DIỀU LẠI',
    'gameover.hint': 'Né cổng tre & đón gió để Lộng Gió!',

    'rank.1': 'CÁNH BÈO',
    'rank.2': 'DIỀU GIẤY',
    'rank.3': 'DIỀU SÁO',
    'rank.4': 'DIỀU RỒNG',

    'kite.1': 'DIỀU GIẤY',
    'kite.2': 'DIỀU SÁO',
    'kite.3': 'DIỀU LỤA',
    'kite.4': 'DIỀU NGỌC',
    'kite.5': 'DIỀU RỒNG',

    'chapter.label': 'CHƯƠNG',
    'chapter.labelEn': 'CHAPTER',
    'chapter.new': 'CHƯƠNG MỚI',

    'storyOverlay.title': 'CỐT TRUYỆN · HÀNH TRÌNH GIÓ VIỆT',
    'storyOverlay.locked': 'CHƯA MỞ',
    'storyOverlay.close': 'ĐÓNG',
    'storyOverlay.intro': 'Chú diều sáo say rượu cần bị gió cuốn khỏi tay người thả. Muốn không rơi, nó phải gom đủ gió chín miền để hoá Diều Rồng.',

    'skills.title': 'KĨ NĂNG · BÙA HỘ MỆNH',
    'skills.close': 'ĐÓNG',
    'skills.note': 'Cứ 7 điểm, bạn chọn 1 bùa trong 3 bùa ngẫu nhiên.',

    'toolbar.top': 'TOP',
    'toolbar.story': 'CỐT TRUYỆN',
    'toolbar.skills': 'KĨ NĂNG',
    'toolbar.soundOn': 'ÂM THANH',
    'toolbar.soundOff': 'TẮT TIẾNG',
    'toolbar.lang': 'EN',
    'toolbar.langTitle': 'Chuyển sang English',

    'share.button': 'THÁCH ĐỐ',
    'share.save': 'LƯU ĐIỂM',
    'share.copied': '✅ Đã sao chép lời thách đố!',
    'share.opened': '🚀 Đang mở giao diện thách đố...',

    'leaderboard.title': 'BẢNG VÀNG ARCADE',
    'leaderboard.submit': 'GHI DANH KỶ LỤC',
    'leaderboard.today': 'HÔM NAY',
    'leaderboard.alltime': 'MỌI THỜI ĐẠI',
    'leaderboard.rank': 'HẠNG',
    'leaderboard.name': 'TÊN',
    'leaderboard.score': 'ĐIỂM',
    'leaderboard.date': 'NGÀY',
    'leaderboard.tag': 'TAG',
    'leaderboard.save': 'LƯU ĐIỂM',

    'perk.draftTitle': 'CHỌN BÙA HỘ MỆNH',
    'perk.preDraft': 'MỞ TÚI BÙA',
    'perk.opening': 'Đang mở túi bùa...',
    'perk.picked': 'ĐÃ CHỌN',
    'perk.ready': 'CHUẨN BỊ THẢ DIỀU',
    'perk.timer': 'Thời gian',

    'settings.title': '⚙ CÀI ĐẶT',
    'settings.music': 'Nhạc nền',
    'settings.sfx': 'Hiệu ứng',
    'settings.note': 'Âm lượng được lưu lại cho lần chơi sau.',

    'weather.sun': 'Nắng vàng',
    'weather.clouds': 'Âm u',
    'weather.rain': 'Mưa rào',
    'weather.storm': 'Mưa giông',
    'weather.stars': 'Đêm sao',
    'weather.snow': 'Mưa tuyết',
    'weather.fog': 'Sương mù',
    'weather.birds': 'Chim trời'
  },

  en: {
    'brand.name': 'TIPSY KITE',
    'brand.tagline': 'A KITE ACROSS VIETNAM',

    'ready.controls': 'Tap: fly  |  Double tap: Wind Burst',
    'ready.tap': 'TAP OR PRESS SPACE TO FLY',
    'ready.best': 'YOUR BEST',
    'ready.kite': 'KITE',

    'hud.lap': 'LAP',
    'hud.chapter': 'CH.',
    'hud.overdrive': 'WIND POWER',
    'hud.need': 'NEED',
    'hud.points': 'PTS',
    'hud.smashReady': '🌪 DOUBLE TAP: WIND BURST READY! 🌪',
    'hud.smashing': '💨 WIND BURST! BREAK THE GATES! 💨',
    'hud.nearMiss': 'NEAR-MISS! +{n}',
    'hud.magnet': '🌪 WIND NET',
    'hud.chain': '[2 GATES]',

    'gameover.title': 'STRING SNAPPED!',
    'gameover.score': 'SCORE',
    'gameover.best': 'BEST',
    'gameover.rank': 'RANK',
    'gameover.tap': 'TAP TO FLY AGAIN',
    'gameover.hint': 'Dodge bamboo gates & catch wind to burst!',

    'rank.1': 'DUCKWEED',
    'rank.2': 'PAPER KITE',
    'rank.3': 'FLUTE KITE',
    'rank.4': 'DRAGON KITE',

    'kite.1': 'PAPER KITE',
    'kite.2': 'FLUTE KITE',
    'kite.3': 'SILK KITE',
    'kite.4': 'JADE KITE',
    'kite.5': 'DRAGON KITE',

    'chapter.label': 'CH.',
    'chapter.labelEn': 'CH.',
    'chapter.new': 'NEW CHAPTER',

    'storyOverlay.title': 'STORY · THE VIETNAM WIND TRAIL',
    'storyOverlay.locked': 'LOCKED',
    'storyOverlay.close': 'CLOSE',
    'storyOverlay.intro': 'A kite tipsy on festival rice wine is torn from its string. To stay airborne, it must gather the winds of nine regions and become the Dragon Kite.',

    'skills.title': 'SKILLS · FESTIVAL CHARMS',
    'skills.close': 'CLOSE',
    'skills.note': 'Every 7 points you pick 1 of 3 random charms.',

    'toolbar.top': 'TOP',
    'toolbar.story': 'STORY',
    'toolbar.skills': 'SKILLS',
    'toolbar.soundOn': 'SOUND',
    'toolbar.soundOff': 'MUTED',
    'toolbar.lang': 'VI',
    'toolbar.langTitle': 'Chuyển sang tiếng Việt',

    'share.button': 'CHALLENGE',
    'share.save': 'SAVE SCORE',
    'share.copied': '✅ Challenge copied!',
    'share.opened': '🚀 Opening share sheet...',

    'leaderboard.title': 'GOLDEN ARCADE BOARD',
    'leaderboard.submit': 'SAVE YOUR RECORD',
    'leaderboard.today': 'TODAY',
    'leaderboard.alltime': 'ALL TIME',
    'leaderboard.rank': 'RANK',
    'leaderboard.name': 'NAME',
    'leaderboard.score': 'SCORE',
    'leaderboard.date': 'DATE',
    'leaderboard.tag': 'TAG',
    'leaderboard.save': 'SAVE',

    'perk.draftTitle': 'CHOOSE A CHARM',
    'perk.preDraft': 'OPENING CHARM BAG',
    'perk.opening': 'Opening charm bag...',
    'perk.picked': 'PICKED',
    'perk.ready': 'GET READY',
    'perk.timer': 'Time',

    'settings.title': '⚙ SETTINGS',
    'settings.music': 'Music',
    'settings.sfx': 'Effects',
    'settings.note': 'Volume is saved for your next visit.',

    'weather.sun': 'Golden sun',
    'weather.clouds': 'Overcast',
    'weather.rain': 'Rain',
    'weather.storm': 'Thunderstorm',
    'weather.stars': 'Starry night',
    'weather.snow': 'Snowfall',
    'weather.fog': 'Fog',
    'weather.birds': 'Birds'
  }
};

let current = 'vi';
const listeners = [];

try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'vi' || saved === 'en') current = saved;
} catch (e) { /* localStorage có thể bị chặn */ }

export function getLang() {
  return current;
}

export function setLang(lang) {
  if (lang !== 'vi' && lang !== 'en') return;
  if (lang === current) return;
  current = lang;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* bỏ qua */ }
  applyDomI18n();
  listeners.forEach(fn => {
    try { fn(lang); } catch (e) { /* bỏ qua */ }
  });
}

export function toggleLang() {
  setLang(current === 'vi' ? 'en' : 'vi');
  return current;
}

export function onLangChange(fn) {
  listeners.push(fn);
}

/** Dịch một khoá, thay {biến} nếu có. Thiếu khoá thì trả về chính khoá. */
export function t(key, vars) {
  const table = DICT[current] || DICT.vi;
  let str = table[key];
  if (str === undefined) str = (DICT.vi[key] !== undefined ? DICT.vi[key] : key);
  if (vars) {
    for (const k of Object.keys(vars)) {
      str = str.split('{' + k + '}').join(String(vars[k]));
    }
  }
  return str;
}

/** Chọn chuỗi theo ngôn ngữ: pick(vi, en) */
export function pick(viText, enText) {
  return current === 'en' ? (enText || viText) : viText;
}

/** Áp dụng dịch cho các phần tử HTML có data-i18n / data-i18n-ph */
export function applyDomI18n() {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = value;
    } else {
      el.textContent = value;
    }
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.getAttribute('data-i18n-title'));
  });
}
