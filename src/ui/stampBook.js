import { TIER_THEMES } from '../graphics/themes.js';
import { getLang, onLangChange } from '../i18n.js';
import { loadStamps, countStamps, totalStamps, hasStamp, WEATHER_KINDS } from '../core/stamps.js';

/**
 * Nút 📮 + modal "SỔ TAY BƯU THIẾP".
 * Mỗi địa danh × mỗi kiểu thời tiết = 1 con tem (lưu localStorage).
 * Chỉ là sưu tầm — không ảnh hưởng điểm/sức mạnh.
 */
let overlay = null;
let gridEl = null;
let countEl = null;
let titleEl = null;
let hintEl = null;

const isEn = () => getLang() === 'en';
const tx = (vi, en) => (isEn() ? en : vi);

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function build() {
  overlay = el('div', 'modal-overlay hidden');
  overlay.id = 'stamps-modal';

  const card = el('div', 'modal-card modal-card--wide stamps-card');
  const head = el('div', 'modal-header');
  titleEl = el('h2', null, tx('SỔ TAY BƯU THIẾP', 'POSTCARD BOOK'));
  head.appendChild(titleEl);
  countEl = el('span', 'stamps-count', '0/0');
  head.appendChild(countEl);
  card.appendChild(head);

  hintEl = el('p', 'modal-intro stamps-hint', tx(
    'Bay qua mỗi địa danh trong các kiểu thời tiết khác nhau để sưu tầm tem.',
    'Fly through each landmark in different weather to collect its stamp.'));
  card.appendChild(hintEl);

  gridEl = el('div', 'stamps-grid');
  card.appendChild(gridEl);

  const actions = el('div', 'stamps-actions');
  const close = el('button', 'arcade-btn', tx('Đóng', 'Close'));
  close.type = 'button';
  close.addEventListener('click', hideStampBook);
  actions.appendChild(close);
  card.appendChild(actions);

  overlay.appendChild(card);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) hideStampBook(); });
  document.body.appendChild(overlay);
}

function render() {
  if (!gridEl) return;
  const map = loadStamps();
  const themes = Object.values(TIER_THEMES).filter(x => x && x.tier).sort((a, b) => a.tier - b.tier);
  gridEl.textContent = '';

  const head = el('div', 'stamps-row stamps-row-head');
  head.appendChild(el('div', 'stamps-cell stamps-landmark', ''));
  WEATHER_KINDS.forEach(k => {
    const c = el('div', 'stamps-cell stamps-weather', k.icon);
    c.title = isEn() ? k.nameEn : k.nameVi;
    head.appendChild(c);
  });
  gridEl.appendChild(head);

  themes.forEach(theme => {
    const row = el('div', 'stamps-row');
    row.appendChild(el('div', 'stamps-cell stamps-landmark', theme.name));
    WEATHER_KINDS.forEach(k => {
      const got = hasStamp(map, theme.tier, k.id);
      const cell = el('div', 'stamps-cell' + (got ? ' is-got' : ''), got ? k.icon : '·');
      cell.title = `${theme.name} — ${isEn() ? k.nameEn : k.nameVi}`;
      row.appendChild(cell);
    });
    gridEl.appendChild(row);
  });

  if (countEl) countEl.textContent = `${countStamps()}/${totalStamps(themes.length)}`;
}

export function showStampBook() {
  if (!overlay) build();
  render();
  overlay.classList.remove('hidden');
}

export function hideStampBook() {
  if (overlay) overlay.classList.add('hidden');
}

export function isStampBookOpen() {
  return !!overlay && !overlay.classList.contains('hidden');
}

/** Gắn nút 📮 vào thanh công cụ (#top-toolbar), ngay trước nút cài đặt. */
export function initStampBook() {
  if (document.getElementById('btn-open-stamps')) return;

  const btn = el('button', 'arcade-btn btn-square', '📮');
  btn.id = 'btn-open-stamps';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Postcard book');
  btn.title = tx('Sổ tay bưu thiếp', 'Postcard book');
  btn.addEventListener('pointerdown', (e) => e.stopPropagation());
  btn.addEventListener('pointerup', (e) => e.stopPropagation());
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    showStampBook();
  });

  const toolbar = document.getElementById('top-toolbar');
  const settings = document.getElementById('btn-open-settings');
  if (toolbar) {
    if (settings && settings.parentElement === toolbar) toolbar.insertBefore(btn, settings);
    else toolbar.appendChild(btn);
  } else {
    document.body.appendChild(btn);
  }

  onLangChange(() => {
    btn.title = tx('Sổ tay bưu thiếp', 'Postcard book');
    if (titleEl) titleEl.textContent = tx('SỔ TAY BƯU THIẾP', 'POSTCARD BOOK');
    if (hintEl) hintEl.textContent = tx(
      'Bay qua mỗi địa danh trong các kiểu thời tiết khác nhau để sưu tầm tem.',
      'Fly through each landmark in different weather to collect its stamp.');
    if (overlay && !overlay.classList.contains('hidden')) render();
  });
}
