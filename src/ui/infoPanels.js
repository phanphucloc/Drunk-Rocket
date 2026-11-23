/**
 * InfoPanels — hai màn thông tin: CỐT TRUYỆN (9 chương) và KĨ NĂNG (6 bùa).
 * Dùng DOM (module) để dễ đọc chữ dài, tự cập nhật khi đổi ngôn ngữ.
 */
import { TIER_THEMES } from '../graphics/themes.js';
import { PERK_CATALOG } from '../core/perks.js';
import { LAPS } from '../core/progression.js';
import { POINTS_PER_CHAPTER } from '../core/progression.js';
import { t, getLang, onLangChange } from '../i18n.js';

const CHAPTER_KEY = 'dieu_say_gio_chapter';

function maxUnlockedTier() {
  try {
    return parseInt(localStorage.getItem(CHAPTER_KEY) || '0', 10) || 0;
  } catch (e) {
    return 0;
  }
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('hidden');
}

function hideModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('hidden');
}

export class InfoPanels {
  constructor() {
    this.bound = false;
    this.current = null;   // { theme, lap, chapter }
  }

  init() {
    if (this.bound) return;
    this.bound = true;

    const bind = (id, fn) => {
      const node = document.getElementById(id);
      if (node) node.addEventListener('click', fn);
    };

    bind('btn-open-story', () => {
      this.renderStory();
      showModal('story-modal');
    });
    bind('btn-open-skills', () => {
      this.renderSkills();
      showModal('skills-modal');
    });
    bind('btn-close-story', () => hideModal('story-modal'));
    bind('btn-close-skills', () => hideModal('skills-modal'));

    // Ô giới thiệu địa danh: chặn tap để không làm diều nhảy, rồi mở popup chi tiết
    const chip = document.getElementById('landmark-chip');
    if (chip) {
      chip.addEventListener('pointerdown', (e) => e.stopPropagation());
      chip.addEventListener('pointerup', (e) => e.stopPropagation());
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openLandmark();
      });
    }
    bind('btn-close-landmark', () => hideModal('landmark-modal'));

    const lmModal = document.getElementById('landmark-modal');
    if (lmModal) {
      lmModal.addEventListener('click', (e) => {
        if (e.target === lmModal) hideModal('landmark-modal');
      });
    }

    // Khi diều bay vào đúng góc có ô giới thiệu thì làm mờ ô đi (không che nhân vật)
    setInterval(() => {
      const chipEl = document.getElementById('landmark-chip');
      const g = window.game;
      if (!chipEl || !g || !g.rocket) return;
      const nearChip = g.rocket.x > 250 && g.rocket.y > 560;
      chipEl.classList.toggle('is-ghost', nearChip);
    }, 180);

    window.addEventListener('resize', () => this.positionChip());
    window.addEventListener('orientationchange', () => setTimeout(() => this.positionChip(), 120));
    setTimeout(() => this.positionChip(), 60);

    // Bấm ra ngoài thẻ để đóng
    ['story-modal', 'skills-modal'].forEach(id => {
      const modal = document.getElementById(id);
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) hideModal(id);
        });
      }
    });

    // Đổi ngôn ngữ -> vẽ lại danh sách đang mở
    onLangChange(() => {
      this.renderStory();
      this.renderSkills();
      if (this.current) this.setLandmark(this.current.theme, this.current.lap, this.current.chapter, false);
      this.renderLandmark();
    });
  }

  /** Cập nhật ô giới thiệu địa danh ở góc phải (luôn hiện). */
  setLandmark(theme, lap = 1, chapter = 1, animate = true, gatesInChapter = 0, gatesPerChapter = POINTS_PER_CHAPTER) {
    if (!theme) return;
    this.current = { theme, lap, chapter, gatesInChapter, gatesPerChapter };
    const lang = getLang();
    const chapEl = document.getElementById('chip-chapter');
    const nameEl = document.getElementById('chip-name');
    const windEl = document.getElementById('chip-wind');
    const chip = document.getElementById('landmark-chip');
    if (!chip) return;

    const gIn = Math.max(0, Math.min(gatesPerChapter, Math.floor(gatesInChapter)));
    // Banner: tên tỉnh (to) · phụ danh · câu thơ ngắn
    if (chapEl) chapEl.textContent = theme.name || '';
    if (nameEl) nameEl.textContent = theme.subName || '';
    if (windEl) {
      const raw = lang === 'en' ? (theme.descEn || theme.storyEn || '') : (theme.editorialDesc || '');
      const poem = String(raw).replace(/^[^—]*—\s*/, '').trim();
      windEl.textContent = poem.length > 44 ? poem.slice(0, 43) + '…' : poem;
    }
    const bar = document.getElementById('chip-progress-fill');
    if (bar) bar.style.width = Math.round((gIn / gatesPerChapter) * 100) + '%';
    chip.title = `${theme.name} · ${lap}/${chapter}`;

    if (animate) {
      chip.classList.remove('is-new');
      void chip.offsetWidth;   // ép chạy lại animation
      chip.classList.add('is-new');
    }
    this.positionChip();
  }

  /** Căn ô giới thiệu theo góc dưới-phải của canvas (canvas được căn giữa, có thể thu nhỏ). */
  positionChip() {
    const canvas = document.getElementById('game-canvas');
    const chip = document.getElementById('landmark-chip');
    if (!canvas || !chip) return;
    const r = canvas.getBoundingClientRect();
    const cw = chip.offsetWidth || 150;
    const chh = chip.offsetHeight || 56;
    chip.style.left = Math.round(r.right - cw - 10) + 'px';
    chip.style.top = Math.round(r.bottom - chh - 12) + 'px';
  }

  /** Vẽ nội dung popup chi tiết địa danh. */
  renderLandmark() {
    const cur = this.current;
    if (!cur) return;
    const { theme, lap, chapter } = cur;
    const lang = getLang();

    const titleEl = document.getElementById('lm-title');
    const subEl = document.getElementById('lm-sub');
    const storyEl = document.getElementById('lm-story');
    const factsEl = document.getElementById('lm-facts');
    const footEl = document.getElementById('lm-foot');

    if (titleEl) titleEl.textContent = theme.name;
    if (subEl) {
      const rawWind = lang === 'en' ? (theme.windEn || '') : (theme.editorialIssue || '');
      const wind = rawWind.replace(/^.*·\s*/, '');
      subEl.textContent = `${t('hud.lap')} ${lap} · ${t('hud.chapter')} ${String(chapter).padStart(2, '0')} · ${wind}`;
    }
    if (storyEl) {
      storyEl.textContent = lang === 'en' ? (theme.storyEn || theme.story || '') : (theme.story || '');
    }
    if (factsEl) {
      factsEl.innerHTML = '';
      const facts = (lang === 'en' ? (theme.factsEn || theme.facts) : theme.facts) || [];
      for (const fact of facts) {
        const li = document.createElement('li');
        li.textContent = fact;
        factsEl.appendChild(li);
      }
    }
    if (footEl) {
      footEl.textContent = lang === 'en'
        ? 'Tap the corner card anytime to read about the place you are flying over.'
        : 'Bấm ô giới thiệu ở góc phải bất cứ lúc nào để đọc về vùng đất bạn đang bay qua.';
    }
  }

  openLandmark() {
    this.renderLandmark();
    showModal('landmark-modal');
  }

  renderStory() {
    const list = document.getElementById('story-list');
    if (!list) return;
    const lang = getLang();
    const unlocked = maxUnlockedTier();
    list.innerHTML = '';

    const lapInfo = lang === 'en'
      ? `5 laps · ${LAPS.length} laps of the wind trail`
      : `5 vòng · hành trình gió Việt`;

    const ordered = Object.keys(TIER_THEMES)
      .map(k => TIER_THEMES[k])
      .sort((a, b) => a.tier - b.tier);

    for (const theme of ordered) {
      const isLocked = theme.tier > unlocked && unlocked > 0;
      const item = el('div', 'chapter-item' + (isLocked ? ' is-locked' : ''));
      item.appendChild(el('div', 'chapter-no', String(theme.tier).padStart(2, '0')));

      const body = el('div', 'chapter-body');
      body.appendChild(el('div', 'chapter-name', theme.name));
      const wind = lang === 'en' ? (theme.windEn || theme.editorialIssue) : theme.editorialIssue;
      body.appendChild(el('div', 'chapter-wind', wind || ''));
      body.appendChild(el('div', 'chapter-story', (lang === 'en' ? (theme.storyEn || theme.story) : theme.story) || ''));
      if (isLocked) body.appendChild(el('div', 'chapter-lock', t('storyOverlay.locked')));
      item.appendChild(body);
      list.appendChild(item);
    }

    // Ghi chú vòng đời
    const note = el('p', 'modal-intro', lapInfo);
    list.appendChild(note);
  }

  renderSkills() {
    const list = document.getElementById('skills-list');
    if (!list) return;
    const lang = getLang();
    list.innerHTML = '';

    for (const perk of PERK_CATALOG) {
      const item = el('div', 'skill-item');
      item.appendChild(el('span', 'skill-icon', perk.icon || '🎴'));

      const body = el('div', 'chapter-body');
      const name = lang === 'en' ? (perk.nameEn || perk.name) : perk.name;
      const desc = lang === 'en' ? (perk.descEn || perk.desc) : perk.desc;
      body.appendChild(el('div', 'skill-name', name));
      body.appendChild(el('div', 'skill-desc', desc));
      item.appendChild(body);
      list.appendChild(item);
    }
  }
}

export const infoPanels = new InfoPanels();
