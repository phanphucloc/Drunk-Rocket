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

    'ready.controls': 'Chạm: bay  |  GIỮ 0.2s: Lộng gió',
    'ready.tap': 'CHẠM HOẶC SPACE ĐỂ THẢ DIỀU',
    'ready.best': 'KỶ LỤC CỦA BẠN',
    'ready.kite': 'DIỀU',

    'tutorial.title': '🪁 CÁCH CHƠI',
    'tutorial.line1': '👆 Chạm để bay',
    'tutorial.line2': '🌪 Giữ để Lộng Gió khi Gió đầy',
    'tutorial.line3': '🎴 Chọn bùa bằng 1 / 2 / 3',
    'hud.lap': 'VÒNG',
    'hud.chapter': 'CHƯƠNG',
    'hud.overdrive': 'ĐỘ LỘNG GIÓ',
    'hud.need': 'CẦN',
    'hud.points': 'ĐIỂM',
    'hud.smashReady': '🌪 GIỮ TAY 0.2s: LỘNG GIÓ! 🌪',
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

    'loading.title': 'ĐANG TẢI…',
    'loading.sub': 'Đang dựng cảnh 9 vùng miền',

    'stamp.new': '📮 TEM BƯU THIẾP MỚI!',

    'title.1': 'TẬP BAY',
    'title.2': 'BẠN CỦA GIÓ',
    'title.3': 'LÃNG KHÁCH GIÓ',
    'title.4': 'THỢ SĂN BƯU THIẾP',
    'title.5': 'NGƯỜI GIỮ KÝ ỨC VIỆT NAM',
    'title.6': 'ĐẠI SỨ BỐN MÙA',
    'title.label': 'DANH HIỆU',

    'color.1': 'BẠCH NGUYỆT',
    'color.2': 'THANH NGỌC',
    'color.3': 'TỬ VÂN',
    'color.4': 'HOÀNG KIM',
    'color.5': 'ĐỎ RỒNG',

    'chapter.label': 'CHƯƠNG',
    'chapter.labelEn': 'CHAPTER',
    'chapter.new': 'CHƯƠNG MỚI',

    'storyOverlay.title': 'CỐT TRUYỆN · HÀNH TRÌNH GIÓ VIỆT',
    'storyOverlay.locked': 'CHƯA MỞ',
    'storyOverlay.close': 'ĐÓNG',
    'storyOverlay.intro': 'Chú diều sáo say rượu cần bị gió cuốn khỏi tay người thả. Muốn không rơi, nó phải gom đủ gió chín miền để hoá Diều Rồng.',

    'skills.title': 'KĨ NĂNG · BÙA HỘ MỆNH',
    'skills.close': 'ĐÓNG',
    'skills.note': 'Cứ 5 cổng đầu, rồi 17, 29… bạn chọn 1 bùa trong 3 bùa ngẫu nhiên.',

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
    'perk.noTimer': 'Bao nhiêu thời gian cũng được',
    'perk.timer': 'Thời gian',

    'settings.title': '⚙ CÀI ĐẶT',
    'settings.streamCam': 'Stream camera (zoom nhẹ theo diều)',
    'meta.title': 'HŨ GIÓ',
    'meta.wind': 'Gió tích luỹ',
    'meta.upgrades': 'Nâng cấp vĩnh viễn',
    'meta.perks': 'Mở khoá bùa',
    'meta.maxed': 'TỐI ĐA',
    'meta.unlock': 'MỞ',
    'meta.unlocked': 'Đã mở',
    'meta.up.start': 'Khởi đầu đầy gió',
    'meta.up.startDesc': 'Bắt đầu ván với +15% năng lượng mỗi cấp',
    'meta.up.magnet': 'Vó gió rộng',
    'meta.up.magnetDesc': 'Tăng tầm hút hạt gió',
    'meta.up.combo': 'Combo hạt gió',
    'meta.up.comboDesc': 'Combo 3 hạt thưởng thêm năng lượng',


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

    'ready.controls': 'Tap: fly  |  HOLD 0.2s: Wind Burst',
    'ready.tap': 'TAP OR PRESS SPACE TO FLY',
    'ready.best': 'YOUR BEST',
    'ready.kite': 'KITE',

    'tutorial.title': '🪁 HOW TO PLAY',
    'tutorial.line1': '👆 Tap to fly',
    'tutorial.line2': '🌪 Hold for Wind Burst when full',
    'tutorial.line3': '🎴 Pick a charm with 1 / 2 / 3',
    'hud.lap': 'LAP',
    'hud.chapter': 'CH.',
    'hud.overdrive': 'WIND POWER',
    'hud.need': 'NEED',
    'hud.points': 'PTS',
    'hud.smashReady': '🌪 HOLD 0.2s: WIND BURST! 🌪',
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

    'loading.title': 'LOADING…',
    'loading.sub': 'Preparing 9 regions',

    'stamp.new': '📮 NEW POSTCARD STAMP!',

    'title.1': 'FIRST FLIGHT',
    'title.2': 'FRIEND OF WIND',
    'title.3': 'WIND WANDERER',
    'title.4': 'POSTCARD HUNTER',
    'title.5': 'KEEPER OF VIETNAM',
    'title.6': 'AMBASSADOR OF SEASONS',
    'title.label': 'TITLE',

    'color.1': 'MOON WHITE',
    'color.2': 'JADE GREEN',
    'color.3': 'VIOLET CLOUD',
    'color.4': 'GOLDEN',
    'color.5': 'DRAGON RED',

    'chapter.label': 'CH.',
    'chapter.labelEn': 'CH.',
    'chapter.new': 'NEW CHAPTER',

    'storyOverlay.title': 'STORY · THE VIETNAM WIND TRAIL',
    'storyOverlay.locked': 'LOCKED',
    'storyOverlay.close': 'CLOSE',
    'storyOverlay.intro': 'A kite tipsy on festival rice wine is torn from its string. To stay airborne, it must gather the winds of nine regions and become the Dragon Kite.',

    'skills.title': 'SKILLS · FESTIVAL CHARMS',
    'skills.close': 'CLOSE',
    'skills.note': 'At gates 5, 17, 29… you pick 1 of 3 random charms.',

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
    'perk.noTimer': 'Take your time',
    'perk.timer': 'Time',

    'settings.title': '⚙ SETTINGS',
    'settings.streamCam': 'Stream camera (slight zoom)',
    'meta.title': 'WIND JAR',
    'meta.wind': 'Stored wind',
    'meta.upgrades': 'Permanent upgrades',
    'meta.perks': 'Perk unlocks',
    'meta.maxed': 'MAX',
    'meta.unlock': 'UNLOCK',
    'meta.unlocked': 'Unlocked',
    'meta.up.start': 'Windful start',
    'meta.up.startDesc': 'Start each run with +15% energy per level',
    'meta.up.magnet': 'Wide net',
    'meta.up.magnetDesc': 'Increase wind-cell magnet range',
    'meta.up.combo': 'Cell combo',
    'meta.up.comboDesc': 'Better reward for a 3-cell combo',


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
