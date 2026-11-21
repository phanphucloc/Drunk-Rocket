/**
 * Cấu hình môi trường — sửa 1 chỗ duy nhất khi đổi backend.
 */
export const CONFIG = {
  // Worker bảng xếp hạng (Cloudflare Worker). Đổi sang backend thật ở đây.
  leaderboardUrl: 'https://drunk-rocket-backend.ppldhsp.workers.dev',
  // Bật/tắt gửi điểm lên mạng (tắt khi test offline)
  leaderboardEnabled: true,
  // Số điểm tối thiểu để gửi lên bảng
  leaderboardMinScore: 1
};
