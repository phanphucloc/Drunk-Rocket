/**
 * Social Sharing and Challenge Generator — "Cánh Diều Say Gió"
 * Lời thách đố song ngữ: người chơi đọc theo ngôn ngữ đang chọn.
 */
import { getLang } from '../i18n.js';

export class ShareCard {
  static getChallengeText(score, deathCount = 1) {
    const url = window.location.href;
    if (getLang() === 'en') {
      return `🪁 I snapped the kite string ${deathCount} times on the Vietnam Wind Trail and scored only ${score}. Can you fly through 3 bamboo gates? 🔥 ${url}`;
    }
    return `🪁 Tôi vừa đứt dây diều ${deathCount} lần trên hành trình gió Việt Nam mà chỉ được ${score} điểm. Bạn có bay nổi qua 3 cổng tre không? 🔥 ${url}`;
  }

  static async share(score, deathCount) {
    const text = this.getChallengeText(score, deathCount);
    if (navigator.share) {
      try {
        await navigator.share({
          title: getLang() === 'en' ? 'Tipsy Kite — Challenge' : 'Cánh Diều Say Gió — Thử thách',
          text: text,
          url: window.location.href
        });
        return { success: true, method: 'share' };
      } catch (e) {
        // Fallback to clipboard if user canceled share
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      return { success: true, method: 'clipboard' };
    } catch (e) {
      return { success: false, error: e };
    }
  }
}
