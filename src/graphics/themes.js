/**
 * 8 Iconic Landmark Tiers for Drunk Rocket (Matching Vietnam Panorama Expedition)
 * Tier 1: SA PA (Fansipan & Ruộng bậc thang)
 * Tier 2: HÀ NỘI (Hồ Gươm, Tháp Rùa & Cầu Long Biên)
 * Tier 3: HUẾ (Đại Nội Ngọ Môn & Cầu Tràng Tiền)
 * Tier 4: ĐÀ NẴNG (Cầu Rồng phun lửa & Sông Hàn)
 * Tier 5: HỘI AN (Chùa Cầu & Phố cổ đèn lồng)
 * Tier 6: ĐÀ LẠT (Đồi thông, Nhà thờ & Hoa cẩm tú cầu)
 * Tier 7: TP. HCM (Landmark 81 hoa sen neon & Bitexco)
 * Tier 8: MIỀN TÂY (Cầu Cần Thơ & Chợ nổi Cái Răng)
 */
export const TIER_THEMES = {
  1: {
    tier: 1,
    id: 'sapa',
    name: 'SA PA',
    subName: 'TÂY BẮC HÙNG VĨ',
    badgeText: 'TIER 1 • SA PA',
    skyTop: '#718f9e',
    skyBottom: '#d0dfe7',
    laserColor: '#ff4d6d',
    laserGlow: 'rgba(255, 77, 109, 0.45)',
    laserCore: '#ffffff',
    emitterCore: '#ff9e79',
    ambientSound: 'wind',
    weather: 'clouds',
    pointsRequired: 5,
    baseScore: 0,
    editorialIssue: 'EXPEDITION N° 01 • TÂY BẮC',
    editorialDesc: 'SA PA — THE TERRACED KINGDOM & FANSIPAN PEAK'
  },
  2: {
    tier: 2,
    id: 'hanoi',
    name: 'HÀ NỘI',
    subName: 'THỦ ĐÔ NGHÌN NĂM',
    badgeText: 'TIER 2 • HÀ NỘI',
    skyTop: '#43344e',
    skyBottom: '#e69f88',
    laserColor: '#e63946',
    laserGlow: 'rgba(230, 57, 70, 0.45)',
    laserCore: '#ffffff',
    emitterCore: '#ffd13b',
    ambientSound: 'birds',
    weather: 'birds',
    pointsRequired: 7,
    baseScore: 5,
    editorialIssue: 'EXPEDITION N° 02 • ĐỒNG BẰNG BẮC BỘ',
    editorialDesc: 'HÀ NỘI — SWORD LAKE & THE ANCIENT TURTLE TOWER'
  },
  3: {
    tier: 3,
    id: 'hue',
    name: 'HUẾ',
    subName: 'CỐ ĐÔ HOÀNG GIA',
    badgeText: 'TIER 3 • HUẾ',
    skyTop: '#1b122e',
    skyBottom: '#4d3460',
    laserColor: '#d946ef',
    laserGlow: 'rgba(217, 70, 239, 0.50)',
    laserCore: '#ffffff',
    emitterCore: '#c77dff',
    ambientSound: 'ocean',
    weather: 'stars',
    pointsRequired: 8,
    baseScore: 12,
    editorialIssue: 'EXPEDITION N° 03 • CỐ ĐÔ TRIỀU NGUYỄN',
    editorialDesc: 'HUẾ — IMPERIAL CITADEL & TRÀNG TIỀN RAINBOW'
  },
  4: {
    tier: 4,
    id: 'danang',
    name: 'ĐÀ NẴNG',
    subName: 'CẦU RỒNG BIỂN XANH',
    badgeText: 'TIER 4 • ĐÀ NẴNG',
    skyTop: '#081329',
    skyBottom: '#18315b',
    laserColor: '#ffd13b',
    laserGlow: 'rgba(255, 209, 59, 0.50)',
    laserCore: '#ffffff',
    emitterCore: '#00f0ff',
    ambientSound: 'ocean',
    weather: 'stars',
    pointsRequired: 9,
    baseScore: 20,
    editorialIssue: 'EXPEDITION N° 04 • DUYÊN HẢI MIỀN TRUNG',
    editorialDesc: 'ĐÀ NẴNG — DRAGON BRIDGE & HAN RIVER SKYLINE'
  },
  5: {
    tier: 5,
    id: 'hoian',
    name: 'HỘI AN',
    subName: 'PHỐ CỔ ĐÈN LỒNG',
    badgeText: 'TIER 5 • HỘI AN',
    skyTop: '#091024',
    skyBottom: '#1a233d',
    laserColor: '#ff0054',
    laserGlow: 'rgba(255, 0, 84, 0.50)',
    laserCore: '#ffffff',
    emitterCore: '#ffd166',
    ambientSound: 'night',
    weather: 'stars',
    pointsRequired: 10,
    baseScore: 29,
    editorialIssue: 'EXPEDITION N° 05 • DI SẢN VĂN HÓA',
    editorialDesc: 'HỘI AN — LANTERN HERITAGE & JAPANESE BRIDGE'
  },
  6: {
    tier: 6,
    id: 'dalat',
    name: 'ĐÀ LẠT',
    subName: 'XỨ SỞ NGÀN HOA',
    badgeText: 'TIER 6 • ĐÀ LẠT',
    skyTop: '#252538',
    skyBottom: '#828fa6',
    laserColor: '#a8dadc',
    laserGlow: 'rgba(168, 218, 220, 0.50)',
    laserCore: '#ffffff',
    emitterCore: '#e0aaff',
    ambientSound: 'wind',
    weather: 'clouds',
    pointsRequired: 11,
    baseScore: 39,
    editorialIssue: 'EXPEDITION N° 06 • CAO NGUYÊN LÂM VIÊN',
    editorialDesc: 'ĐÀ LẠT — PINE MIST & HYDRANGEA BLOSSOMS'
  },
  7: {
    tier: 7,
    id: 'hcm',
    name: 'TP. HCM',
    subName: 'HÒN NGỌC VIỄN ĐÔNG',
    badgeText: 'TIER 7 • TP. HCM',
    skyTop: '#070514',
    skyBottom: '#1c1038',
    laserColor: '#00f0ff',
    laserGlow: 'rgba(0, 240, 255, 0.55)',
    laserCore: '#ffffff',
    emitterCore: '#ff0077',
    ambientSound: 'night',
    weather: 'stars',
    pointsRequired: 13,
    baseScore: 50,
    editorialIssue: 'EXPEDITION N° 07 • ĐÔ THỊ PHỒN HOA',
    editorialDesc: 'TP. HCM — LANDMARK 81 & NEON METROPOLIS'
  },
  8: {
    tier: 8,
    id: 'mientay',
    name: 'MIỀN TÂY',
    subName: 'ĐỒNG BẰNG SÔNG NƯỚC',
    badgeText: 'TIER 8 • MIỀN TÂY',
    skyTop: '#0d2532',
    skyBottom: '#35716a',
    laserColor: '#05ffa1',
    laserGlow: 'rgba(5, 255, 161, 0.55)',
    laserCore: '#ffffff',
    emitterCore: '#ffcf77',
    ambientSound: 'ocean',
    weather: 'clouds',
    pointsRequired: 15,
    baseScore: 63,
    editorialIssue: 'EXPEDITION N° 08 • ĐỒNG BẰNG SÔNG CỬU LONG',
    editorialDesc: 'MIỀN TÂY — CẦN THƠ SPAN & CÁI RĂNG FLOATING MARKET'
  }
};

export const SKY_THEMES = TIER_THEMES;

export function getTierFromScore(score) {
  if (score >= 63) return 8; // Miền Tây
  if (score >= 50) return 7; // TP. HCM
  if (score >= 39) return 6; // Đà Lạt
  if (score >= 29) return 5; // Hội An
  if (score >= 20) return 4; // Đà Nẵng
  if (score >= 12) return 3; // Huế
  if (score >= 5)  return 2; // Hà Nội
  return 1;                  // Sa Pa (0 - 4 điểm)
}

export function getThemeForScore(score) {
  const tier = getTierFromScore(score);
  return TIER_THEMES[tier] || TIER_THEMES[1];
}
