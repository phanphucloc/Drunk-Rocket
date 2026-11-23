/**
 * Hũ Gió — cửa hàng meta-progression (nâng cấp vĩnh viễn + mở khoá bùa).
 */
import { t, getLang } from '../i18n.js';
import { PERK_CATALOG } from '../core/perks.js';
import {
  UPGRADES, PERK_UNLOCK_COST, loadMeta, levelOf, upgradeCost, buyUpgrade,
  isPerkUnlocked, unlockPerk
} from '../core/meta.js';

let onClose = null;

export function openWindJar(mount) {
  const modal = document.getElementById('windjar-modal');
  if (!modal) return null;
  modal.classList.remove('hidden');
  render(mount);
  return { close: () => modal.classList.add('hidden') };
}

export function initWindJar(game) {
  const modal = document.getElementById('windjar-modal');
  if (!modal) return;
  const closeBtn = document.getElementById('btn-close-windjar');
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });
  const btn = document.getElementById('btn-open-windjar');
  if (btn) btn.addEventListener('click', () => openWindJar(game));
}

function render(game) {
  const meta = loadMeta();
  const windEl = document.getElementById('windjar-count');
  if (windEl) windEl.textContent = String(meta.wind);

  // Nâng cấp
  const list = document.getElementById('windjar-upgrades');
  if (list) {
    list.innerHTML = '';
    for (const def of UPGRADES) {
      const lv = levelOf(meta, def.id);
      const maxed = lv >= def.max;
      const cost = upgradeCost(meta, def);
      const row = document.createElement('div');
      row.className = 'windjar-row';
      row.innerHTML =
        `<div class="windjar-info">
           <strong>${t(def.nameKey)}</strong>
           <small>${t(def.descKey)} · ${lv}/${def.max}</small>
         </div>
         <button class="arcade-btn windjar-buy" ${maxed ? 'disabled' : ''}>
           ${maxed ? t('meta.maxed') : `${cost} 🌬`}
         </button>`;
      const buy = row.querySelector('button');
      if (buy && !maxed) {
        buy.addEventListener('click', () => {
          const res = buyUpgrade(def.id);
          if (res.ok) { render(game); if (game && game.audio) game.audio.playMedal && game.audio.playMedal(); }
          else buy.classList.add('shake');
        });
      }
      list.appendChild(row);
    }
  }

  // Mở khoá bùa
  const perksEl = document.getElementById('windjar-perks');
  if (perksEl) {
    perksEl.innerHTML = '';
    for (const perk of PERK_CATALOG) {
      const cost = PERK_UNLOCK_COST[perk.id];
      const unlocked = isPerkUnlocked(meta, perk.id);
      const row = document.createElement('div');
      row.className = 'windjar-row' + (unlocked ? ' is-owned' : '');
      const label = getLang() === 'en' ? (perk.nameEn || perk.name) : perk.name;
      row.innerHTML =
        `<div class="windjar-info">
           <strong>${label}</strong>
           <small>${unlocked ? t('meta.unlocked') : `${cost} 🌬`}</small>
         </div>
         <button class="arcade-btn windjar-buy" ${unlocked ? 'disabled' : ''}>
           ${unlocked ? '✓' : t('meta.unlock')}
         </button>`;
      const btn = row.querySelector('button');
      if (btn && !unlocked) {
        btn.addEventListener('click', () => {
          const res = unlockPerk(perk.id);
          if (res.ok) render(game);
        });
      }
      perksEl.appendChild(row);
    }
  }
}
