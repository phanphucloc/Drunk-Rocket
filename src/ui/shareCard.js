/**
 * Social Sharing and Challenge Generator
 */
export class ShareCard {
  static getChallengeText(score, deathCount = 1) {
    const url = window.location.href;
    return `🚀 Tôi vừa nổ tàu ${deathCount} lần trong Drunk Rocket nhưng chỉ đạt ${score} điểm. Liệu bạn có lái nổi qua 3 cột laser không? 🔥 ${url}`;
  }

  static async share(score, deathCount) {
    const text = this.getChallengeText(score, deathCount);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Drunk Rocket Challenge',
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
