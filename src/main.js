import { Game } from './core/game.js';
import { applyDomI18n, t, setLang, getLang } from './i18n.js';
import { infoPanels } from './ui/infoPanels.js';
import { initStampBook } from './ui/stampBook.js';

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

  // ---- TẢI TRƯỚC: dựng sẵn cảnh 9 địa danh + chờ font, rồi mới vào game ----
  const loadingEl = document.getElementById('loading-screen');
  const fillEl = document.getElementById('loading-fill');
  const subEl = document.getElementById('loading-sub');
  if (subEl) subEl.textContent = t('loading.sub');

  const finishLoading = () => {
    if (loadingEl) {
      loadingEl.classList.add('is-hidden');
      setTimeout(() => loadingEl.remove(), 420);
    }
    game.resize();
    game.startAutoFit();
    game.start();
    // ?banner=1 : hiện thử banner chương (kiểm thử)
    if (/[?&]banner=1/.test(location.search)) {
      setTimeout(() => { if (game.hud && game.hud.showChapterBanner) game.hud.showChapterBanner(game.currentTheme, game.lapNumber, game.chapterNumber); }, 900);
    }

    // ?auto=1 : tự bắt đầu để kiểm thử tự động
    if (/[?&]auto=1/.test(location.search)) {
      setTimeout(() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', key: ' ' })), 1200);
    }

  };

  (async () => {
    try {
      if (game.scenic && game.scenic.bakeAll) {
        await game.scenic.bakeAll((done, total) => {
          if (fillEl) fillEl.style.width = Math.round((done / total) * 100) + '%';
          if (subEl) subEl.textContent = done + '/' + total;
        });
      }
      if (document.fonts && document.fonts.ready) {
        // Không chờ font quá lâu: mạng chậm/chặn Google Fonts vẫn phải vào được game
        await Promise.race([
          document.fonts.ready,
          new Promise((r) => setTimeout(r, 1500))
        ]);
      }
    } catch (e) { /* lỗi dựng thử không chặn game */ }
    finishLoading();
  })();
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
  const MODAL_IDS = ['leaderboard-modal', 'story-modal', 'skills-modal', 'landmark-modal', 'settings-modal', 'stamps-modal'];
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

  // Ẩn tab / chuyển app: tạm dừng để không chết oan và không tốn pin
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (game && game.setPaused) game.setPaused(true);
      if (game && game._wasHidden !== undefined) game._wasHidden = true;
    } else {
      syncPause();
    }
  });
  syncPause();

  // Căn ô giới thiệu địa danh theo canvas (sau khi layout ổn định)
  // PWA: chơi offline sau lần tải đầu (chỉ khi chạy http/https)
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  // ---- Stream camera: zoom nhẹ theo diều (tuỳ chọn trong ⚙) ----
  {
    const KEY = 'dieu_stream_cam';
    const box = document.getElementById('setting-stream-cam');
    const apply = (on) => {
      if (game) game.streamCam = !!on;
      try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {}
    };
    if (box) {
      box.checked = localStorage.getItem(KEY) === '1';
      apply(box.checked);
      box.addEventListener('change', () => apply(box.checked));
    }
  }

  initStampBook();
  // ---- Canh UI theo MÉP CANVAS (không theo mép cửa sổ) ----
  const layoutOverlay = () => {
    const cv = document.getElementById('game-canvas');
    if (!cv) return;
    const r = cv.getBoundingClientRect();
    const pad = 10;

    const tb = document.getElementById('top-toolbar');
    if (tb) {
      const w = Math.ceil(tb.getBoundingClientRect().width) || 140;
      const gap = 12;
      // Ưu tiên bên phải canvas; nếu không đủ chỗ thì đặt SÁT MÉP PHẢI canvas (chồng nhẹ, vẫn gọn)
      let left = r.right + gap;
      if (left + w > window.innerWidth - 6) left = Math.max(6, r.right - w - 6);
      tb.style.left = Math.round(left) + 'px';
      tb.style.right = 'auto';
      tb.style.top = Math.round(Math.max(6, r.top + pad)) + 'px';
      tb.dataset.side = left < r.right ? 'in' : 'out';
    }

    const actions = document.getElementById('gameover-actions');
    if (actions) {
      actions.style.left = Math.round(r.left + r.width / 2) + 'px';
      actions.style.transform = 'translateX(-50%)';
      actions.style.bottom = Math.round(Math.max(12, window.innerHeight - r.bottom + 14)) + 'px';
    }
  };

  window.addEventListener('resize', () => setTimeout(layoutOverlay, 30));
  window.addEventListener('orientationchange', () => setTimeout(layoutOverlay, 180));
  setTimeout(layoutOverlay, 60);
  setTimeout(layoutOverlay, 400);
  setInterval(layoutOverlay, 600);

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
