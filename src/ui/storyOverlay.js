/**
 * Story Overlay — thẻ cốt truyện chương & màn kết "Diều Rồng".
 * Hiện một thẻ ngắn khi sang chương mới (kèm 1 câu giới thiệu tiếng Việt + tiếng Anh
 * để bạn bè quốc tế hiểu địa danh), và màn chúc mừng khi hoá rồng.
 */
import { t, getLang } from '../i18n.js';

export class StoryOverlay {
  constructor(width = 400, height = 700) {
    this.width = width;
    this.height = height;
    this.phase = 'idle';       // idle | chapter | ending
    this.theme = null;
    this.meta = {};
    this.elapsed = 0;
    this.duration = 3.2;
    this.endingShown = false;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
  }

  showChapter(theme, isNew = true, meta = {}) {
    if (!theme) return;
    this.phase = 'chapter';
    this.theme = theme;
    this.meta = meta || {};
    this.elapsed = 0;
    this.duration = 3.2;
    this.isNewChapter = isNew;
    try {
      const key = 'dieu_say_gio_chapter';
      const best = parseInt(localStorage.getItem(key) || '0', 10);
      if (theme.tier > best) localStorage.setItem(key, String(theme.tier));
    } catch (e) { /* localStorage có thể bị chặn */ }
  }

  showEnding(theme) {
    this.phase = 'ending';
    this.theme = theme;
    this.elapsed = 0;
    this.duration = 6.0;
  }

  update(dt) {
    if (this.phase === 'idle') return;
    this.elapsed += dt;
    if (this.elapsed >= this.duration) {
      this.phase = 'idle';
      this.theme = null;
    }
  }

  get active() {
    return this.phase !== 'idle';
  }

  // Độ mờ: vào nhanh 0.35s, giữ, ra 0.6s
  _alpha() {
    const elapsed = this.elapsed;
    const fadeIn = 0.35;
    const fadeOut = 0.6;
    if (elapsed < fadeIn) return elapsed / fadeIn;
    if (elapsed > this.duration - fadeOut) return Math.max(0, (this.duration - elapsed) / fadeOut);
    return 1;
  }

  _wrap(ctx, text, maxW) {
    const words = String(text).split(' ');
    const lines = [];
    let cur = '';
    for (const w of words) {
      const t = cur ? cur + ' ' + w : w;
      if (ctx.measureText(t).width > maxW && cur) {
        lines.push(cur);
        cur = w;
      } else {
        cur = t;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  draw(ctx) {
    if (this.phase === 'idle' || !this.theme) return;
    ctx.save();
    ctx.globalAlpha = this._alpha();
    ctx.textAlign = 'center';

    if (this.phase === 'chapter') this._drawChapter(ctx);
    else this._drawEnding(ctx);

    ctx.restore();
  }

  _drawChapter(ctx) {
    // Giới thiệu địa danh kiểu AAA: letterbox + vignette + tiêu đề góc dưới-trái.
    // KHÔNG dùng thẻ nền lớn -> không che lối bay, người chơi vẫn thấy cổng tre.
    const theme = this.theme;
    const w = this.width;
    const h = this.height;
    const lang = getLang();

    // 1) Letterbox mỏng ở hai mép (vùng không có lối bay)
    const barH = 9;
    ctx.fillStyle = 'rgba(6, 12, 10, 0.55)';
    ctx.fillRect(0, 0, w, barH);
    ctx.fillRect(0, h - barH, w, barH);

    // 2) Vignette mềm: tối 4 góc, giữa vẫn trong
    const vg = ctx.createRadialGradient(w / 2, h * 0.46, h * 0.30, w / 2, h * 0.46, h * 0.78);
    vg.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vg.addColorStop(1, `rgba(6, 12, 10, ${0.30 * this._alpha()})`);
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);

    // 3) Tiêu đề khu vực: trượt nhẹ từ trái, chữ có bóng (không nền)
    const slide = (1 - Math.min(1, this.elapsed / 0.45)) * -16;
    const tx = 22 + slide;
    const labelY = h - 120;
    const nameY = h - 100;
    const windY = h - 84;

    // gạch vàng ngắn
    ctx.strokeStyle = 'rgba(232, 184, 75, 0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(tx, labelY - 10);
    ctx.lineTo(tx + 22, labelY - 10);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.letterSpacing = '2px';

    // dòng nhỏ: VÒNG 1 · CHƯƠNG 2
    const lap = this.meta.lap || 1;
    const chapter = this.meta.chapter || 1;
    ctx.fillStyle = 'rgba(127, 227, 196, 0.95)';
    ctx.font = '700 8.5px "Be Vietnam Pro", monospace';
    ctx.fillText(`${t('hud.lap')} ${lap} · ${t('hud.chapter')} ${String(chapter).padStart(2, '0')}`, tx, labelY);

    // tên địa danh
    ctx.fillStyle = '#f5edda';
    ctx.font = '800 21px "Be Vietnam Pro", Georgia, serif';
    ctx.letterSpacing = '0.5px';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 9;
    ctx.fillText(theme.name, tx, nameY);
    ctx.shadowBlur = 0;

    // tên ngọn gió (VI / EN)
    ctx.fillStyle = 'rgba(232, 184, 75, 0.92)';
    ctx.font = '700 8px "Be Vietnam Pro", monospace';
    ctx.letterSpacing = '1.6px';
    const wind = lang === 'en' ? (theme.windEn || '') : (theme.editorialIssue || '');
    ctx.fillText(wind.replace(/^.*·\s*/, ''), tx, windY);
  }

  _drawEnding(ctx) {
    const w = this.width;
    const h = this.height;
    // Lưu ý: KHÔNG đặt tên biến là `t` ở đây — sẽ che mất hàm dịch t() ở trên.
    const time = this.elapsed;
    const cardW = Math.min(w - 32, 366);
    const cardH = 196;
    const x = (w - cardW) / 2;
    const y = h * 0.28;

    // Nền tối dịu
    ctx.fillStyle = 'rgba(6, 9, 18, 0.55)';
    ctx.fillRect(0, 0, w, h);

    // Quầng vàng
    const glow = ctx.createRadialGradient(w / 2, y + cardH / 2, 10, w / 2, y + cardH / 2, cardW * 0.8);
    glow.addColorStop(0, 'rgba(232, 184, 75, 0.4)');
    glow.addColorStop(1, 'rgba(232, 184, 75, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, y - 80, w, cardH + 160);

    ctx.fillStyle = 'rgba(14, 26, 23, 0.94)';
    ctx.fillRect(x, y, cardW, cardH);
    ctx.strokeStyle = '#e8b84b';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, cardW - 2, cardH - 2);
    ctx.fillStyle = 'rgba(232, 184, 75, 0.45)';
    ctx.fillRect(x + 8, y + 7, cardW - 16, 1);

    const lang = getLang();
    const title = t('kite.5') + '!';

    // Tiêu đề
    const pulse = 1 + Math.sin(time * 6) * 0.03;
    ctx.save();
    ctx.translate(w / 2, y + 48);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = '#e8b84b';
    ctx.font = '800 28px "Be Vietnam Pro", ui-monospace, monospace';
    ctx.shadowColor = 'rgba(255, 190, 60, 0.8)';
    ctx.shadowBlur = 18;
    ctx.fillText(title, 0, 0);
    ctx.restore();

    ctx.fillStyle = '#7fe3c4';
    ctx.font = '700 9px "Be Vietnam Pro", monospace';
    ctx.letterSpacing = '2px';
    ctx.fillText(lang === 'en' ? 'NINE REGIONS OF WIND · ONE DRAGON KITE' : 'CHÚ DIỀU ĐÃ GOM ĐỦ GIÓ CHÍN MIỀN', w / 2, y + 70);

    ctx.letterSpacing = '0px';
    ctx.fillStyle = 'rgba(243, 234, 214, 0.94)';
    ctx.font = '11px "Be Vietnam Pro", monospace';
    const mainText = lang === 'en'
      ? 'From a tipsy paper kite to the golden Dragon Kite — nine rivers of Vietnam.'
      : 'Từ cánh diều giấy say rượu cần, qua chín con sông Việt, nó đã hoá rồng vàng.';
    const mainWrapped = this._wrap(ctx, mainText, cardW - 30);
    let ly = y + 94;
    for (const line of mainWrapped) {
      ctx.fillText(line, w / 2, ly);
      ly += 14;
    }

    ctx.fillStyle = 'rgba(169, 191, 180, 0.9)';
    ctx.font = 'italic 9px "Be Vietnam Pro", monospace';
    const subText = lang === 'en'
      ? 'Từ cánh diều giấy say rượu cần, qua chín con sông Việt, nó đã hoá rồng vàng.'
      : 'From a tipsy paper kite to the golden Dragon Kite — nine rivers of Vietnam.';
    const subWrapped = this._wrap(ctx, subText, cardW - 30);
    ly += 4;
    for (const line of subWrapped) {
      ctx.fillText(line, w / 2, ly);
      ly += 12;
    }

    ctx.fillStyle = '#e8b84b';
    ctx.font = '700 11px "Be Vietnam Pro", ui-monospace, monospace';
    ctx.fillText(t('ready.tap'), w / 2, y + cardH - 22);
  }
}
