/**
 * Visual Atmosphere & Sky Weather Themes for Drunk Rocket 2.5
 * 7 Biomes / Sky Atmospheres matching score progression:
 * 1. Bình Minh (Dawn): Hồng cam tím mờ ảo, đàn chim én bay qua, tiếng chim hót buổi sớm.
 * 2. Trời Nắng (Sunny / Clear Day): Xanh da trời rực rỡ, ánh mặt trời chói chang, tiếng sóng biển vỗ bờ dào dạt.
 * 3. Âm U (Overcast / Cloudy): Xám chì u ám, mây cuộn dập dờn.
 * 4. Trời Mưa (Rainy): Mưa rơi xiên, sương mù, tiếng mưa rào êm êm.
 * 5. Mưa Giông (Thunderstorm): Mưa nặng hạt, chớp sét rạch ngang trời, tiếng sấm ầm ầm giòn tan!
 * 6. Hoàng Hôn (Sunset): Đỏ cam hoàng hôn tím lịm, đàn chim bay về tổ.
 * 7. Trời Tối (Starry Night / Cosmic Void): Đêm sao lấp lánh huyền bí, tiếng dế đêm / sấm xa.
 */
export const SKY_THEMES = {
  1: {
    tier: 1,
    name: 'BÌNH MINH',
    subName: 'DAWN HORIZON',
    skyTop: '#3b2d54',
    skyBottom: '#ff9e79',
    laserColor: '#ff4d6d',
    laserGlow: 'rgba(255, 77, 109, 0.45)',
    laserCore: '#ffffff',
    emitterCore: '#ffcf77',
    badgeText: 'TIER 1 • BÌNH MINH',
    weather: 'birds',
    ambientSound: 'birds'
  },
  2: {
    tier: 2,
    name: 'TRỜI NẮNG',
    subName: 'SUNNY CYAN',
    skyTop: '#0a4b78',
    skyBottom: '#48cae4',
    laserColor: '#00f0ff',
    laserGlow: 'rgba(0, 240, 255, 0.48)',
    laserCore: '#ffffff',
    emitterCore: '#ffd13b',
    badgeText: 'TIER 2 • TRỜI NẮNG',
    weather: 'sun',
    ambientSound: 'ocean'
  },
  3: {
    tier: 3,
    name: 'ÂM U',
    subName: 'OVERCAST HAZE',
    skyTop: '#1b263b',
    skyBottom: '#5c677d',
    laserColor: '#ffd13b',
    laserGlow: 'rgba(255, 209, 59, 0.48)',
    laserCore: '#ffffff',
    emitterCore: '#ffffff',
    badgeText: 'TIER 3 • ÂM U',
    weather: 'clouds',
    ambientSound: 'wind'
  },
  4: {
    tier: 4,
    name: 'TRỜI MƯA',
    subName: 'NEON RAIN',
    skyTop: '#0d1b2a',
    skyBottom: '#274060',
    laserColor: '#05ffa1',
    laserGlow: 'rgba(5, 255, 161, 0.50)',
    laserCore: '#ffffff',
    emitterCore: '#00f0ff',
    badgeText: 'TIER 4 • TRỜI MƯA',
    weather: 'rain',
    ambientSound: 'rain'
  },
  5: {
    tier: 5,
    name: 'MƯA GIÔNG',
    subName: 'THUNDERSTORM',
    skyTop: '#0b091a',
    skyBottom: '#1f1638',
    laserColor: '#e0aaff',
    laserGlow: 'rgba(224, 170, 255, 0.55)',
    laserCore: '#ffffff',
    emitterCore: '#c77dff',
    badgeText: 'TIER 5 • MƯA GIÔNG',
    weather: 'storm',
    ambientSound: 'thunder'
  },
  6: {
    tier: 6,
    name: 'HOÀNG HÔN',
    subName: 'TWILIGHT SUNSET',
    skyTop: '#240046',
    skyBottom: '#ff5400',
    laserColor: '#ff0054',
    laserGlow: 'rgba(255, 0, 84, 0.55)',
    laserCore: '#ffffff',
    emitterCore: '#ffbd00',
    badgeText: 'TIER 6 • HOÀNG HÔN',
    weather: 'birds_sunset',
    ambientSound: 'birds'
  },
  7: {
    tier: 7,
    name: 'TRỜI TỐI',
    subName: 'DEEP NIGHT COSMOS',
    skyTop: '#05070d',
    skyBottom: '#101426',
    laserColor: '#ff0077',
    laserGlow: 'rgba(255, 0, 119, 0.60)',
    laserCore: '#ffffff',
    emitterCore: '#00f0ff',
    badgeText: 'TIER 7 • ĐÊM VÔ TẬN',
    weather: 'stars',
    ambientSound: 'night'
  }
};

export const TIER_THEMES = SKY_THEMES;

export function getTierFromScore(score) {
  if (score >= 42) return 7; // Trời tối
  if (score >= 34) return 6; // Hoàng hôn
  if (score >= 26) return 5; // Mưa giông
  if (score >= 18) return 4; // Trời mưa
  if (score >= 11) return 3; // Âm u
  if (score >= 5)  return 2; // Trời nắng
  return 1;                  // Bình minh (0 - 4 điểm)
}

export function getThemeForScore(score) {
  const tier = getTierFromScore(score);
  return SKY_THEMES[tier] || SKY_THEMES[1];
}
