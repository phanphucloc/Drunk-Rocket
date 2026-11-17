/**
 * Visual Themes & Color Palettes for Difficulty Tiers in Drunk Rocket 2.5
 * Dynamic progression changes space background and deadly laser color as score climbs.
 */
export const TIER_THEMES = {
  1: {
    tier: 1,
    name: 'DEEP SPACE',
    bg: '#0b0e14',
    bgRgb: [11, 14, 20],
    starColor1: '#283256',
    starColor2: '#00f0ff',
    laserColor: '#ff3b5c',
    laserGlow: 'rgba(255, 59, 92, 0.45)',
    laserCore: '#ffffff',
    emitterCore: '#00f0ff',
    badgeText: 'TIER 1 • CYBER RED'
  },
  2: {
    tier: 2,
    name: 'ULTRA VIOLET',
    bg: '#110a1f',
    bgRgb: [17, 10, 31],
    starColor1: '#3d1c5a',
    starColor2: '#d03bff',
    laserColor: '#d03bff',
    laserGlow: 'rgba(208, 59, 255, 0.48)',
    laserCore: '#ffffff',
    emitterCore: '#ffd13b',
    badgeText: 'TIER 2 • VIOLET WAVE'
  },
  3: {
    tier: 3,
    name: 'TOXIC NEBULA',
    bg: '#071610',
    bgRgb: [7, 22, 16],
    starColor1: '#114529',
    starColor2: '#05ffa1',
    laserColor: '#05ffa1',
    laserGlow: 'rgba(5, 255, 161, 0.48)',
    laserCore: '#ffffff',
    emitterCore: '#00ffc4',
    badgeText: 'TIER 3 • ACID GREEN'
  },
  4: {
    tier: 4,
    name: 'SOLAR FLARE',
    bg: '#1a0d05',
    bgRgb: [26, 13, 5],
    starColor1: '#4a220c',
    starColor2: '#ff9933',
    laserColor: '#ff7b00',
    laserGlow: 'rgba(255, 123, 0, 0.50)',
    laserCore: '#ffffff',
    emitterCore: '#ffd13b',
    badgeText: 'TIER 4 • SOLAR AMBER'
  },
  5: {
    tier: 5,
    name: 'ELECTRIC ABYSS',
    bg: '#031422',
    bgRgb: [3, 20, 34],
    starColor1: '#0d3859',
    starColor2: '#00d4ff',
    laserColor: '#00d4ff',
    laserGlow: 'rgba(0, 212, 255, 0.52)',
    laserCore: '#ffffff',
    emitterCore: '#ffffff',
    badgeText: 'TIER 5 • HYPER SWAY'
  },
  6: {
    tier: 6,
    name: 'COSMIC SUPERNOVA',
    bg: '#1a0514',
    bgRgb: [26, 5, 20],
    starColor1: '#4d0d39',
    starColor2: '#ff0077',
    laserColor: '#ff0077',
    laserGlow: 'rgba(255, 0, 119, 0.55)',
    laserCore: '#ffffff',
    emitterCore: '#ffd13b',
    badgeText: 'TIER 6 • OVERDRIVE CHAOS'
  }
};

export function getTierFromScore(score) {
  if (score >= 36) return 6;
  if (score >= 27) return 5;
  if (score >= 19) return 4;
  if (score >= 12) return 3;
  if (score >= 6) return 2;
  return 1;
}

export function getThemeForScore(score) {
  const tier = getTierFromScore(score);
  return TIER_THEMES[tier] || TIER_THEMES[1];
}
