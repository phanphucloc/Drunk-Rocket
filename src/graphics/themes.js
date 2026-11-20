/**
 * 9 Iconic Landmark Tiers for Drunk Rocket (Matching Vietnam Panorama Expedition)
 * Tier 1: SA PA (Fansipan & Ruộng bậc thang)
 * Tier 2: NINH BÌNH (Tràng An - Tam Cốc Bích Động)
 * Tier 3: HÀ NỘI (Hồ Gươm, Tháp Rùa & Cầu Long Biên)
 * Tier 4: HUẾ (Đại Nội Ngọ Môn & Cầu Tràng Tiền)
 * Tier 5: ĐÀ NẴNG (Cầu Rồng phun lửa & Sông Hàn)
 * Tier 6: HỘI AN (Chùa Cầu & Phố cổ đèn lồng)
 * Tier 7: ĐÀ LẠT (Đồi thông, Nhà thờ & Hoa cẩm tú cầu)
 * Tier 8: TP. HCM (Landmark 81 hoa sen neon & Bitexco)
 * Tier 9: MIỀN TÂY (Cầu Cần Thơ & Chợ nổi Cái Răng)
 */
export const TIER_THEMES = {
  1: {
    tier: 1,
    id: 'sapa',
    name: 'SA PA',
    subName: 'TÂY BẮC HÙNG VĨ',
    badgeText: 'CHƯƠNG 1 • SA PA',
    // Bộ nhạc riêng của vùng miền (synth: thang âm + tiết tấu)
    music: { id: 'sapa', root: 196.0, scale: [0, 2, 3, 7, 9], step: 0.44, lead: 'sine', bassEvery: 6, gain: 0.16, filter: 1800 },
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
    editorialIssue: 'CHƯƠNG 01 · GIÓ NÚI FANSIPAN',
    editorialDesc: 'SA PA — VƯƠNG QUỐC RUỘNG BẬC THANG & ĐỈNH FANSIPAN',
    // Câu chuyện ngắn của chương (kèm bản tiếng Anh cho bạn bè quốc tế)
    story: 'Gió Tây Bắc giật mạnh, đứt dây diều. Chú diều say rượu cần lảo đảo bay về xuôi.',
    storyEn: 'A north-west gust snaps the string; tipsy on rice wine, the kite tumbles south.',
    windEn: 'FANSIPAN MOUNTAIN WIND',
    descEn: 'SA PA — TERRACED FIELDS & FANSIPAN PEAK',
    facts: [
      'Ruộng bậc thang Mường Hoa được người H\'Mông canh tác hàng trăm năm.',
      'Đỉnh Fansipan cao 3.147 m — nóc nhà Đông Dương.',
      'Gió núi mang theo mùa hoa đào, mận và dã quỳ.'
    ],
    factsEn: [
      'Mường Hoa terraces have been farmed by H\'Mong families for centuries.',
      'Fansipan peak rises to 3,147 m — the roof of Indochina.',
      'Mountain winds bring blooms of peach, plum and wild sunflowers.'
    ],
    // Vị trí đường chân trời (tỉ lệ chiều cao khung vẽ) để hệ thống thời tiết
    // đổi màu bầu trời cho đúng vùng trời của tranh này.
    weatherStage: { horizon: 0.58 }
  },
  2: {
    tier: 2,
    id: 'ninhbinh',
    name: 'NINH BÌNH',
    subName: 'TRÀNG AN & TAM CỐC BÍCH ĐỘNG',
    badgeText: 'CHƯƠNG 2 • NINH BÌNH',
    // Bộ nhạc riêng của vùng miền (synth: thang âm + tiết tấu)
    music: { id: 'ninhbinh', root: 220.0, scale: [0, 2, 4, 7, 9], step: 0.40, lead: 'triangle', bassEvery: 6, gain: 0.17, filter: 2200 },
    skyTop: '#fdf7d9',
    skyBottom: '#f7cd92',
    // Cột cổng đá giữa trời hoàng kim: tia laser hồng đào, đầu phát ánh hổ phách
    laserColor: '#ff2d55',
    laserGlow: 'rgba(255, 45, 85, 0.45)',
    laserCore: '#ffffff',
    emitterCore: '#ffb347',
    ambientSound: 'birds',
    weather: 'birds',
    pointsRequired: 7,
    baseScore: 5,
    editorialIssue: 'CHƯƠNG 02 · GIÓ KHE ĐÁ TRÀNG AN',
    editorialDesc: 'NINH BÌNH — KARST TRÀNG AN & SÔNG NGÔ ĐỒNG',
    // Câu chuyện ngắn của chương (kèm bản tiếng Anh cho bạn bè quốc tế)
    story: 'Diều lượn qua khe đá vôi Tràng An, sông Ngô Đồng xanh như ngọc.',
    storyEn: 'It slips between Tràng An karst towers above the emerald Ngô Đồng river.',
    windEn: 'TRÀNG AN KARST WIND',
    descEn: 'NINH BÌNH — TRÀNG AN KARST & NGÔ ĐỒNG RIVER',
    facts: [
      'Quần thể Tràng An là Di sản Thế giới kép của UNESCO.',
      'Thuyền nan đưa khách len qua hang tối dưới dãy núi đá vôi.',
      'Cố đô Hoa Lư — kinh đô đầu tiên của Việt Nam thế kỷ X.'
    ],
    factsEn: [
      'Tràng An is a dual UNESCO World Heritage site.',
      'Small rowing boats slip through dark caves beneath limestone peaks.',
      'Hoa Lư was Vietnam\'s first capital in the 10th century.'
    ],
    // Vị trí đường chân trời (tỉ lệ chiều cao khung vẽ) để hệ thống thời tiết
    // đổi màu bầu trời cho đúng vùng trời của tranh này.
    weatherStage: { horizon: 0.6 }
  },
  3: {
    tier: 3,
    id: 'hanoi',
    name: 'HÀ NỘI',
    subName: 'THỦ ĐÔ NGHÌN NĂM',
    badgeText: 'CHƯƠNG 3 • HÀ NỘI',
    // Bộ nhạc riêng của vùng miền (synth: thang âm + tiết tấu)
    music: { id: 'hanoi', root: 246.9, scale: [0, 2, 4, 7, 9], step: 0.34, lead: 'triangle', bassEvery: 8, gain: 0.18, filter: 3000 },
    skyTop: '#43344e',
    skyBottom: '#e69f88',
    laserColor: '#e63946',
    laserGlow: 'rgba(230, 57, 70, 0.45)',
    laserCore: '#ffffff',
    emitterCore: '#ffd13b',
    ambientSound: 'birds',
    weather: 'birds',
    pointsRequired: 8,
    baseScore: 12,
    editorialIssue: 'CHƯƠNG 03 · GIÓ HỒ GƯƠM',
    editorialDesc: 'HÀ NỘI — HỒ GƯƠM & THÁP RÙA',
    // Câu chuyện ngắn của chương (kèm bản tiếng Anh cho bạn bè quốc tế)
    story: 'Gió Hồ Gươm mang theo tiếng chuông và mùi cốm, diều chao qua Tháp Rùa.',
    storyEn: 'Sword Lake wind carries temple bells and green-rice scent past Turtle Tower.',
    windEn: 'SWORD LAKE WIND',
    descEn: 'HÀ NỘI — SWORD LAKE & TURTLE TOWER',
    facts: [
      'Hồ Gươm gắn với truyền thuyết trả gươm thần cho Rùa Vàng.',
      'Tháp Rùa ba tầng nằm giữa hồ — biểu tượng của thành phố.',
      'Cầu Long Biên do Pháp khánh thành năm 1903, dài 1.682 m.'
    ],
    factsEn: [
      'Sword Lake is tied to the legend of the Golden Turtle returning a magic sword.',
      'The three-tier Turtle Tower sits in the middle of the lake.',
      'Long Biên bridge opened in 1903, 1,682 m long.'
    ],
    // Vị trí đường chân trời (tỉ lệ chiều cao khung vẽ) để hệ thống thời tiết
    // đổi màu bầu trời cho đúng vùng trời của tranh này.
    weatherStage: { horizon: 0.52 }
  },
  4: {
    tier: 4,
    id: 'hue',
    name: 'HUẾ',
    subName: 'CỐ ĐÔ HOÀNG GIA',
    badgeText: 'CHƯƠNG 4 • HUẾ',
    // Bộ nhạc riêng của vùng miền (synth: thang âm + tiết tấu)
    music: { id: 'hue', root: 174.6, scale: [0, 1, 4, 5, 7, 8], step: 0.50, lead: 'sine', bassEvery: 5, gain: 0.15, filter: 1600 },
    skyTop: '#1b122e',
    skyBottom: '#4d3460',
    laserColor: '#d946ef',
    laserGlow: 'rgba(217, 70, 239, 0.50)',
    laserCore: '#ffffff',
    emitterCore: '#c77dff',
    ambientSound: 'ocean',
    weather: 'stars',
    pointsRequired: 9,
    baseScore: 20,
    editorialIssue: 'CHƯƠNG 04 · GIÓ SÔNG HƯƠNG',
    editorialDesc: 'HUẾ — ĐẠI NỘI NGỌ MÔN & CẦU TRÀNG TIỀN',
    // Câu chuyện ngắn của chương (kèm bản tiếng Anh cho bạn bè quốc tế)
    story: 'Qua Đại Nội, diều gặp gió sông Hương và sắc cầu vồng Tràng Tiền.',
    storyEn: 'Past the Imperial Citadel, the Hương River wind and the rainbow Tràng Tiền bridge.',
    windEn: 'HƯƠNG RIVER WIND',
    descEn: 'HUẾ — IMPERIAL CITADEL & TRÀNG TIỀN BRIDGE',
    facts: [
      'Đại Nội là trung tâm Kinh thành Huế, di sản UNESCO từ 1993.',
      'Cầu Tràng Tiền (1899) đổi màu bằng đèn LED về đêm.',
      'Sông Hương gắn với nhã nhạc cung đình Huế.'
    ],
    factsEn: [
      'The Imperial Citadel is the heart of Huế, a UNESCO site since 1993.',
      'Tràng Tiền bridge (1899) turns colours with LED lights at night.',
      'The Hương River is home to Huế royal court music.'
    ],
    // Vị trí đường chân trời (tỉ lệ chiều cao khung vẽ) để hệ thống thời tiết
    // đổi màu bầu trời cho đúng vùng trời của tranh này.
    weatherStage: { horizon: 0.55 }
  },
  5: {
    tier: 5,
    id: 'danang',
    name: 'ĐÀ NẴNG',
    subName: 'CẦU RỒNG BIỂN XANH',
    badgeText: 'CHƯƠNG 5 • ĐÀ NẴNG',
    // Bộ nhạc riêng của vùng miền (synth: thang âm + tiết tấu)
    music: { id: 'danang', root: 261.6, scale: [0, 2, 4, 7, 9, 11], step: 0.30, lead: 'triangle', bassEvery: 7, gain: 0.18, filter: 3200 },
    skyTop: '#081329',
    skyBottom: '#18315b',
    laserColor: '#ffd13b',
    laserGlow: 'rgba(255, 209, 59, 0.50)',
    laserCore: '#ffffff',
    emitterCore: '#00f0ff',
    ambientSound: 'ocean',
    weather: 'stars',
    pointsRequired: 10,
    baseScore: 29,
    editorialIssue: 'CHƯƠNG 05 · GIÓ BIỂN SƠN TRÀ',
    editorialDesc: 'ĐÀ NẴNG — CẦU RỒNG & SÔNG HÀN',
    // Câu chuyện ngắn của chương (kèm bản tiếng Anh cho bạn bè quốc tế)
    story: 'Rồng vàng phun lửa bên sông Hàn, gió biển Sơn Trà căng cánh diều.',
    storyEn: 'A fire-breathing dragon on the Hàn River; Sơn Trà sea wind fills the kite.',
    windEn: 'SƠN TRÀ SEA WIND',
    descEn: 'ĐÀ NẴNG — DRAGON BRIDGE & HÀN RIVER',
    facts: [
      'Cầu Rồng dài 666 m, phun lửa và phun nước vào cuối tuần.',
      'Bán đảo Sơn Trà là nơi sống của voọc chà vá chân nâu.',
      'Cầu quay sông Hàn được xây hoàn toàn bằng vốn Việt Nam.'
    ],
    factsEn: [
      'The Dragon Bridge is 666 m long and breathes fire at weekends.',
      'Sơn Trà peninsula shelters the rare red-shanked douc langur.',
      'The Hàn River swing bridge was built entirely with Vietnamese funds.'
    ],
    // Vị trí đường chân trời (tỉ lệ chiều cao khung vẽ) để hệ thống thời tiết
    // đổi màu bầu trời cho đúng vùng trời của tranh này.
    weatherStage: { horizon: 0.55 }
  },
  6: {
    tier: 6,
    id: 'hoian',
    name: 'HỘI AN',
    subName: 'PHỐ CỔ ĐÈN LỒNG',
    badgeText: 'CHƯƠNG 6 • HỘI AN',
    // Bộ nhạc riêng của vùng miền (synth: thang âm + tiết tấu)
    music: { id: 'hoian', root: 220.0, scale: [0, 2, 4, 7, 9], step: 0.36, lead: 'sine', bassEvery: 6, gain: 0.17, filter: 2400 },
    skyTop: '#091024',
    skyBottom: '#1a233d',
    laserColor: '#ff0054',
    laserGlow: 'rgba(255, 0, 84, 0.50)',
    laserCore: '#ffffff',
    emitterCore: '#ffd166',
    ambientSound: 'night',
    weather: 'stars',
    pointsRequired: 11,
    baseScore: 39,
    editorialIssue: 'CHƯƠNG 06 · GIÓ ĐÈN LỒNG',
    editorialDesc: 'HỘI AN — CHÙA CẦU & PHỐ CỔ ĐÈN LỒNG',
    // Câu chuyện ngắn của chương (kèm bản tiếng Anh cho bạn bè quốc tế)
    story: 'Phố cổ thả đèn, gió mang theo ánh lồng đèn và tiếng hát bài chòi.',
    storyEn: 'Lanterns drift over the old town; the wind carries their glow and folk songs.',
    windEn: 'LANTERN WIND',
    descEn: 'HỘI AN — JAPANESE BRIDGE & ANCIENT TOWN',
    facts: [
      'Phố cổ Hội An là Di sản Văn hoá Thế giới từ 1999.',
      'Chùa Cầu (1593) do thương nhân Nhật Bản xây dựng.',
      'Đèn lồng thả trên sông Hoài là nét đẹp đêm Rằm.'
    ],
    factsEn: [
      'Hội An Ancient Town has been a World Heritage site since 1999.',
      'The Japanese Covered Bridge dates back to 1593.',
      'Floating lanterns on the Hoài River light up every full-moon night.'
    ],
    // Vị trí đường chân trời (tỉ lệ chiều cao khung vẽ) để hệ thống thời tiết
    // đổi màu bầu trời cho đúng vùng trời của tranh này.
    weatherStage: { horizon: 0.52 }
  },
  7: {
    tier: 7,
    id: 'dalat',
    name: 'ĐÀ LẠT',
    subName: 'XỨ SỞ NGÀN HOA',
    badgeText: 'CHƯƠNG 7 • ĐÀ LẠT',
    // Bộ nhạc riêng của vùng miền (synth: thang âm + tiết tấu)
    music: { id: 'dalat', root: 196.0, scale: [0, 2, 4, 7, 9], step: 0.46, lead: 'triangle', bassEvery: 6, gain: 0.15, filter: 2000 },
    skyTop: '#252538',
    skyBottom: '#828fa6',
    laserColor: '#a8dadc',
    laserGlow: 'rgba(168, 218, 220, 0.50)',
    laserCore: '#ffffff',
    emitterCore: '#e0aaff',
    ambientSound: 'wind',
    weather: 'clouds',
    pointsRequired: 13,
    baseScore: 50,
    editorialIssue: 'CHƯƠNG 07 · GIÓ THÔNG ĐÀ LẠT',
    editorialDesc: 'ĐÀ LẠT — ĐỒI THÔNG & HỒ XUÂN HƯƠNG',
    // Câu chuyện ngắn của chương (kèm bản tiếng Anh cho bạn bè quốc tế)
    story: 'Gió thông se lạnh, diều lượn trên mặt Hồ Xuân Hương.',
    storyEn: 'Cool pine wind of the highlands, circling above Xuân Hương lake.',
    windEn: 'HIGHLAND PINE WIND',
    descEn: 'ĐÀ LẠT — PINE HILLS & XUÂN HƯƠNG LAKE',
    facts: [
      'Thành phố nằm ở độ cao 1.500 m, khí hậu ôn hoà quanh năm.',
      'Hồ Xuân Hương là hồ nhân tạo giữa lòng thành phố.',
      'Nhà thờ Con Gà (1931) mang kiến trúc Gothic Pháp.'
    ],
    factsEn: [
      'The city sits at 1,500 m with a mild climate all year round.',
      'Xuân Hương is a man-made lake in the heart of the city.',
      'The Domaine Church (1931) shows French Gothic architecture.'
    ],
    // Vị trí đường chân trời (tỉ lệ chiều cao khung vẽ) để hệ thống thời tiết
    // đổi màu bầu trời cho đúng vùng trời của tranh này.
    weatherStage: { horizon: 0.52 }
  },
  8: {
    tier: 8,
    id: 'hcm',
    name: 'TP. HCM',
    subName: 'HÒN NGỌC VIỄN ĐÔNG',
    badgeText: 'CHƯƠNG 8 • TP. HCM',
    // Bộ nhạc riêng của vùng miền (synth: thang âm + tiết tấu)
    music: { id: 'hcm', root: 261.6, scale: [0, 2, 3, 5, 7, 9, 10], step: 0.26, lead: 'square', bassEvery: 4, gain: 0.14, filter: 2600 },
    skyTop: '#070514',
    skyBottom: '#1c1038',
    laserColor: '#00f0ff',
    laserGlow: 'rgba(0, 240, 255, 0.55)',
    laserCore: '#ffffff',
    emitterCore: '#ff0077',
    ambientSound: 'night',
    weather: 'stars',
    pointsRequired: 15,
    baseScore: 63,
    editorialIssue: 'CHƯƠNG 08 · GIÓ ĐÔ THỊ',
    editorialDesc: 'TP. HCM — LANDMARK 81 & PHỐ NEON',
    // Câu chuyện ngắn của chương (kèm bản tiếng Anh cho bạn bè quốc tế)
    story: 'Nhà cao tầng chạm mây, diều lách qua ánh neon Landmark 81.',
    storyEn: 'Skyscrapers touch the clouds; the kite weaves through Landmark 81 neon.',
    windEn: 'CITY WIND',
    descEn: 'TP. HCM — LANDMARK 81 & NEON CITY',
    facts: [
      'Landmark 81 cao 461,2 m — toà nhà cao nhất Việt Nam.',
      'Chợ Bến Thành có từ 1914, biểu tượng của Sài Gòn.',
      'Quận 1 là trung tâm kinh tế với nhịp sống gần như không ngủ.'
    ],
    factsEn: [
      'Landmark 81 is 461.2 m tall — Vietnam\'s tallest building.',
      'Bến Thành Market dates from 1914 and symbolises Saigon.',
      'District 1 is the economic heart, alive almost around the clock.'
    ],
    // Vị trí đường chân trời (tỉ lệ chiều cao khung vẽ) để hệ thống thời tiết
    // đổi màu bầu trời cho đúng vùng trời của tranh này.
    weatherStage: { horizon: 0.5 }
  },
  9: {
    tier: 9,
    id: 'mientay',
    name: 'MIỀN TÂY',
    subName: 'ĐỒNG BẰNG SÔNG NƯỚC',
    badgeText: 'CHƯƠNG 9 • MIỀN TÂY',
    // Bộ nhạc riêng của vùng miền (synth: thang âm + tiết tấu)
    music: { id: 'mientay', root: 233.1, scale: [0, 2, 4, 5, 7, 9], step: 0.32, lead: 'triangle', bassEvery: 6, gain: 0.17, filter: 2400 },
    skyTop: '#0d2532',
    skyBottom: '#35716a',
    laserColor: '#05ffa1',
    laserGlow: 'rgba(5, 255, 161, 0.55)',
    laserCore: '#ffffff',
    emitterCore: '#ffcf77',
    ambientSound: 'ocean',
    weather: 'clouds',
    pointsRequired: 18,
    baseScore: 78,
    editorialIssue: 'CHƯƠNG 09 · GIÓ MÙA CỬU LONG',
    editorialDesc: 'MIỀN TÂY — CẦU CẦN THƠ & CHỢ NỔI CÁI RĂNG',
    // Câu chuyện ngắn của chương (kèm bản tiếng Anh cho bạn bè quốc tế)
    story: 'Gió mùa Cửu Long ùa về, chợ nổi Cái Răng tấp nập. Đây rồi — Vũ Môn!',
    storyEn: 'The Mekong monsoon arrives; Cái Răng floating market bustles. Here it is — the Dragon Gate!',
    windEn: 'MEKONG MONSOON',
    descEn: 'MEKONG DELTA — CẦN THƠ BRIDGE & CÁI RĂNG MARKET',
    facts: [
      'Cầu Cần Thơ dài 2,75 km — cầu dây văng lớn nhất Đông Nam Á khi khánh thành.',
      'Chợ nổi Cái Răng họp từ tinh mơ trên sông Hậu.',
      'Đồng bằng sông Cửu Long là vựa lúa lớn nhất Việt Nam.',
    ],
    factsEn: [
      'Cần Thơ Bridge is 2.75 km long, once Southeast Asia\'s largest cable-stayed span.',
      'Cái Răng floating market opens at dawn on the Hậu River.',
      'The Mekong Delta is Vietnam\'s largest rice basket.',
    ],
    // Vị trí đường chân trời (tỉ lệ chiều cao khung vẽ) để hệ thống thời tiết
    // đổi màu bầu trời cho đúng vùng trời của tranh này.
    weatherStage: { horizon: 0.52 }
  }
};

export const SKY_THEMES = TIER_THEMES;

export function getTierFromScore(score) {
  if (score >= 78) return 9; // Miền Tây
  if (score >= 63) return 8; // TP. HCM
  if (score >= 50) return 7; // Đà Lạt
  if (score >= 39) return 6; // Hội An
  if (score >= 29) return 5; // Đà Nẵng
  if (score >= 20) return 4; // Huế
  if (score >= 12) return 3; // Hà Nội
  if (score >= 5)  return 2; // Ninh Bình
  return 1;                  // Sa Pa (0 - 4 điểm)
}

export function getThemeForScore(score) {
  const tier = getTierFromScore(score);
  return TIER_THEMES[tier] || TIER_THEMES[1];
}
