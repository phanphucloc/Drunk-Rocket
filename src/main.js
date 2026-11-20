import { Game } from './core/game.js';
import { applyDomI18n, t, setLang, getLang } from './i18n.js';
import { infoPanels } from './ui/infoPanels.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) {
    console.error('Không tìm thấy #game-canvas');
    return;
  }

  // Dịch toàn bộ nhãn HTML theo ngôn ngữ đã lưu
  // ?lang=en|vi — ép ngôn ngữ để kiểm tra
  const langParam = new URLSearchParams(location.search).get('lang');
  if (langParam === 'en' || langParam === 'vi') setLang(langParam);
  applyDomI18n();
  infoPanels.init();

  const game = new Game(canvas);
  game.start();
  window.game = game;

  // Nhãn nút âm thanh / ngôn ngữ theo i18n
  const btnSound = document.getElementById('btn-toggle-sound');
  if (btnSound) btnSound.title = t('toolbar.soundOn');
  const btnLang = document.getElementById('btn-toggle-lang');
  if (btnLang) {
    const span = btnLang.querySelector('[data-i18n]');
    if (span) span.textContent = t('toolbar.lang');
    btnLang.title = t('toolbar.langTitle');
  }

  // ?panel=story|skills|landmark — mở nhanh để kiểm tra giao diện
  const panel = new URLSearchParams(location.search).get('panel');
  if (panel === 'story' || panel === 'skills') {
    const btn = document.getElementById(panel === 'story' ? 'btn-open-story' : 'btn-open-skills');
    if (btn) btn.click();
  }
  if (panel === 'landmark') infoPanels.openLandmark();
  if (panel === 'settings') {
    const m = document.getElementById('settings-modal');
    if (m) m.classList.remove('hidden');
  }

  // ---- Cài đặt âm lượng (Nhạc / Hiệu ứng) ----
  const volMusic = document.getElementById('vol-music');
  const volSfx = document.getElementById('vol-sfx');
  const volMusicVal = document.getElementById('vol-music-val');
  const volSfxVal = document.getElementById('vol-sfx-val');

  const syncVol = () => {
    if (volMusic && volMusicVal) volMusicVal.textContent = volMusic.value + '%';
    if (volSfx && volSfxVal) volSfxVal.textContent = volSfx.value + '%';
  };

  if (game.audio) {
    if (volMusic) {
      volMusic.value = String(Math.round((game.audio.musicVolume ?? 0.8) * 100));
      volMusic.addEventListener('input', () => {
        game.audio.setMusicVolume(Number(volMusic.value) / 100);
        syncVol();
      });
    }
    if (volSfx) {
      volSfx.value = String(Math.round((game.audio.sfxVolume ?? 1) * 100));
      volSfx.addEventListener('input', () => {
        game.audio.setSfxVolume(Number(volSfx.value) / 100);
        syncVol();
      });
    }
  }
  syncVol();

  const btnSettings = document.getElementById('btn-open-settings');
  if (btnSettings) {
    btnSettings.addEventListener('pointerdown', (e) => e.stopPropagation());
    btnSettings.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const modal = document.getElementById('settings-modal');
      if (modal) modal.classList.remove('hidden');
    });
  }
  const btnCloseSettings = document.getElementById('btn-close-settings');
  if (btnCloseSettings) {
    btnCloseSettings.addEventListener('click', () => {
      const modal = document.getElementById('settings-modal');
      if (modal) modal.classList.add('hidden');
    });
  }
  const settingsModal = document.getElementById('settings-modal');
  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) settingsModal.classList.add('hidden');
    });
  }

  // ---- Tự động PAUSE khi có popup/bảng điểm/cài đặt đang mở ----
  const MODAL_IDS = ['leaderboard-modal', 'story-modal', 'skills-modal', 'landmark-modal', 'settings-modal'];
  const isAnyModalOpen = () => MODAL_IDS.some((id) => {
    const elm = document.getElementById(id);
    return elm && !elm.classList.contains('hidden');
  });
  const syncPause = () => {
    if (game && game.setPaused) game.setPaused(isAnyModalOpen());
  };
  new MutationObserver(syncPause).observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });
  setInterval(syncPause, 400); // dự phòng nếu có popup bật/tắt bằng cách khác
  syncPause();

  // Căn ô giới thiệu địa danh theo canvas (sau khi layout ổn định)
  infoPanels.positionChip();
  setTimeout(() => infoPanels.positionChip(), 250);

  // Khi font Google tải xong thì chữ trên canvas mới đúng nét
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (game.hud) game.hud.forceRedraw = true;
    });
  }

  console.log('🪁 Diều Say Gió Engine v3.0.0 started. Target: 60 FPS.');
});
