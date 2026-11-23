# DRUNK ROCKET 3.0 — CÁNH DIỀU SAY GIÓ · HÀNH TRÌNH GIÓ VIỆT
**Chủ đề văn hoá:** "Diều Sáo bay dọc Việt Nam"
**Trạng thái:** Design Doc (định hướng nghệ thuật + gameplay, chờ triển khai theo pha)
**Mục tiêu:** Giữ vòng lặp "rage-game" vui nhộn cho giới trẻ, nhưng thay toàn bộ "lớp vỏ sci-fi" bằng một bộ nhận diện văn hoá Việt **thống nhất và liên quan chặt chẽ với nhau**, đồng thời kể một câu chuyện xuyên suốt để giới thiệu Việt Nam cho bạn bè quốc tế.

---

## 1. Tầm nhìn (Vision)

Một **con diều sáo** (loại diều truyền thống có ống sáo kêu "vi vu" khi bay) bị gió cuốn tuột khỏi tay người thả trong một ngày hội làng. Thay vì rơi xuống, nó **"say gió"** — say rượu cần ngày hội lẫn say niềm vui — và bắt đầu bay dọc đất nước từ **đỉnh Fansipan lộng gió** xuôi về **gió mùa sông Cửu Long**, gom từng **ngọn gió** của mỗi vùng miền để trở thành **"Diều Rồng"** huyền thoại.

Cái hay: **gió** là sợi dây nối mọi thứ — gió nâng cánh diều, gió là chướng ngại lẫn phần thưởng, và 9 vùng miền của Việt Nam mỗi nơi có một "ngọn gió" đặc trưng (gió núi Sa Pa, gió biển Đà Nẵng, gió đồng bằng Cửu Long…).

---

## 2. Bảng "tái sinh" yếu tố (Sci-fi → Văn hoá Việt)

| Hiện tại | Thành | Vì sao liên quan |
|---|---|---|
| Tên lửa (rocket) | **Con Diều Sáo** (mắt to hài, lưỡi lè, đuôi nheo nhiều màu) | Diều = "bay" → thay thế tên lửa một cách tự nhiên |
| Luồng lửa đẩy (thruster flame) | **Luồng gió + đuôi nheo phất phới + vệt sao** | Diều được gió nâng, không đốt lửa |
| Cột kim loại + sọc cảnh báo | **Cổng tre làng** quấn **dây pháo đỏ / dây đèn lồng** | Diều đâm vào tre/dây = rối dây, đứt diều |
| Tia laser (lối an toàn) | **Luồng gió lành / dải lụa đào** đánh dấu "cửa gió" | Diều bay xuyên qua luồng gió an toàn |
| Hạt năng lượng (Energy Cell) | **Ngọn gió lành (bông gió)** — chùm bọt/gió vàng | Diều **đón gió** để nạp năng lượng |
| Thanh Drunk-Meter | **Thanh Gió** ("ĐỘ LỘNG GIÓ") | Đón đủ gió → diều "lộng gió" |
| Supernova Smash | **PHÓNG CAO / LỘNG GIÓ** — diều vút lên phá cổng tre | Phần thưởng đỉnh cao: bay xuyên chướng ngại |
| 6 Perk (Nano Hull, Beer Bubble…) | **Bùa hộ mệnh ngày hội** (xem §5) | Bùa = "phép" giúp diều qua cổng |
| Ghost + bia mộ | **Diều đứt dây** — xác diều + nơ thắt + tên bạn | "Ngươi vừa bay qua chỗ diều @MausBot rơi" |
| Rank điểm | **Cánh Bèo → Diều Giấy → Diều Sáo → Diều Rồng** | Rank = hành trình trưởng thành của cánh diều |
| Share card | "Tôi thả con diều say gió, bay 42 cổng tre…" | Lan truyền thử thách |

---

## 3. Vòng lặp liên kết (The Wind Loop)

```
Diều đón NGỌN GIÓ (hạt năng lượng)
   │
   ▼ (nạp THANH GIÓ — "say gió")
Đầy gió → PHÓNG CAO phá CỔNG TRE
   │
   ▼ (vượt 1 chặng = 1 vùng miền)
Chọn BÙA HỘ MỆNH ngày hội
   │
   ▼ (tiếp tục bay + near-miss nạp gió nhanh)
Điểm/Rank "hóa Diều Rồng" + Diều đứt dây + thẻ thách đố
```

Mấu chốt giữ nguyên cơ chế đã có (Near-Miss nạp nhanh → Smash → Perk Draft mỗi 7 điểm) — chỉ đổi **lớp vỏ + tên gọi** để người chơi cũ không bị lạc, người chơi mới thấy văn hoá Việt ngay từ giây đầu.

---

## 4. Cốt truyện — 9 Chương (tương ứng 9 màn)

> *"Ngày hội làng, chú bé thả con diều sáo mới tinh. Một cơn gió giật, dây đứt — diều bay vút đi, say rượu cần và say gió. Cụ Rùa thầm thì: 'Muốn không rơi, hãy gom đủ Gió của chín miền, rồi ngươi sẽ hoá Diều Rồng.'"*

| Chương | Vùng | "Ngọn gió" đặc trưng | Dòng editorial (đổi từ "EXPEDITION N° X") |
|---|---|---|---|
| 1 | Sa Pa | Gió núi Tây Bắc | "CHƯƠNG 1 · GIÓ NÚI FANSIPAN" |
| 2 | Ninh Bình | Gió sông Ngô Đồng | "CHƯƠNG 2 · GIÓ KHE ĐÁ TRÀNG AN" |
| 3 | Hà Nội | Gió hồ Gươm | "CHƯƠNG 3 · GIÓ HỒ GƯƠM" |
| 4 | Huế | Gió sông Hương | "CHƯƠNG 4 · GIÓ SÔNG HƯƠNG" |
| 5 | Đà Nẵng | Gió biển Sơn Trà | "CHƯƠNG 5 · GIÓ BIỂN SƠN TRÀ" |
| 6 | Hội An | Gió sông Hoài (đèn lồng) | "CHƯƠNG 6 · GIÓ ĐÈN LỒNG" |
| 7 | Đà Lạt | Gió thông cao nguyên | "CHƯƠNG 7 · GIÓ THÔNG ĐÀ LẠT" |
| 8 | TP. HCM | Gió phồn hoa đô thị | "CHƯƠNG 8 · GIÓ ĐÔ THỊ" |
| 9 | Miền Tây | Gió mùa Cửu Long | "CHƯƠNG 9 · GIÓ MÙA CỬU LONG — HOÁ DIỀU RỒNG" |

Mỗi chương mở ra 1–2 câu chuyện ngắn (trên banner dưới màn hình hoặc overlay lúc đổi tier), giới thiệu địa danh theo kiểu "postcard" cho người nước ngoài.

---

## 5. Bộ Perk (Bùa hộ mệnh ngày hội)

| Perk cũ | Bùa mới | Hiệu ứng (giữ nguyên cơ chế) |
|---|---|---|
| Nano Hull | 🍃 **Lá Sen Che Thân** | Diều nhỏ 25%, lách khe dễ |
| Beer Bubble | 🫧 **Bọt Rượu Cần** | Khiên đỡ 1 va chạm |
| Quantum Drift | 👻 **Xuyên Gió** | Tàng hình xuyên cổng sau mỗi tap |
| Adrenaline Junkie | 👁 **Mắt Diều Tinh** | Near-miss rộng gấp đôi, điểm cao |
| Chain Reaction | 🧨 **Pháo Dây Chuyền** | Phá 2 cổng liên tiếp |
| Magnet Core | 🌪 **Vó Hút Gió** | Hút hạt gió trôi nổi |

---

## 6. Hướng dẫn nghệ thuật & âm thanh

- **Nhân vật:** thân diều hình cánh cung với hoạ tiết dân gian (đối xứng, đỏ-vàng-ngọc lam); 2 mắt to lệch (giữ chất hài "say"), lưỡi lè; **đuôi nheo 3–5 dải** phất theo hướng bay; khi thrust → toả **vệt gió + bông gió**, khi lộng gió (smash) → thêm sọc tốc độ + cờ đuôi nheo dài.
- **Chướng ngại:** trụ tre xanh có đốt, dây pháo đỏ/lồng đèn chăng ngang; luồng gió an toàn là dải sáng trắng ngà (thay tia laser). Đâm vào → "bùm" pháo + vụn tre + rối dây (hiệu ứng hài, không đổ máu).
- **Âm thanh:** giữ synth 8-bit nhưng thay sample — thrust = "vi vu" gió + tiếng sáo diều; ăn gió = "tinh tinh"; smash = pháo + gió rít; thời tiết vẫn dùng hệ thống đã có (mưa/gió/sấm…). Tiếng sáo diều có thể synth bằng chuỗi nốt luyến nhẹ.
- **Phông chữ/HUD:** giữ kiểu monospace neon nhưng nhuộm tông dân gian khi cần; các label đổi theo bảng §2.

---

## 7. Lộ trình triển khai (theo pha, mỗi pha đều chạy/kiểm thử được)

| Pha | Nội dung | File chính | Trạng thái |
|---|---|---|---|
| 0 | Đổi toàn bộ label/editorial (không phá gameplay) | `themes.js`, `hud.js`, `index.html` | ✅ xong |
| 1 | Nhân vật = **Con Diều Sáo** (vẽ + wind thrust + lộng gió + đứt dây) | `renderer.js` (`drawRocket`) | ✅ xong |
| 2 | Chướng ngại = **Cổng tre + dây pháo + lồng đèn + luồng gió an toàn** | `renderer.js` (`drawLaserHazard`) | ✅ xong |
| 3 | Hạt năng lượng = **Ngọn gió lành** + bình **Gió** trên HUD | `energyCell.js`, `hud.js` | ✅ xong |
| 4 | **Bùa hộ mệnh** (6 thẻ) + **Diều đứt dây** (ghost) + **Cấp bậc** trên Game Over | `perks.js`, `ghosts.js`, `hud.js` | ✅ xong |
| 5 | Cốt truyện 9 chương + overlay chuyện khi sang chương + màn kết "Diều Rồng" | `themes.js`, `game.js`, `storyOverlay.js` | ✅ xong |

Ghi chú Pha 4: cấp bậc hiện tính theo điểm — `CÁNH BÈO (<6) → DIỀU GIẤY (6–14) → DIỀU SÁO (15–29) → DIỀU RỒNG (30+)`.

Ghi chú Pha 5:
- Mỗi tier có `story` (tiếng Việt) + `storyEn` (tiếng Anh) — hiện thành thẻ cốt truyện 4 giây khi sang chương mới.
- Chạm mốc **30 điểm** lần đầu trong ván → màn kết `DIỀU RỒNG!` + âm thanh huy chương + chớp sáng.
- Chương cao nhất từng mở được lưu ở `localStorage['dieu_say_gio_chapter']`.

---

## 8. Nguyên tắc mở rộng (giữ từ kiến trúc hiện tại)

- **Thêm màn mới:** thêm 1 entry trong `TIER_THEMES` (kèm `weatherStage.horizon`) → tranh + thời tiết + chương tự chạy.
- **Thêm thời tiết mới:** thêm 1 entry `PRESETS` + (tuỳ chọn) 1 hàm trong `EFFECTS`.
- **Đổi nhân vật/trang trí:** mỗi thứ ở một nơi duy nhất (`renderer.js`, `energyCell.js`…) nên đổi một chỗ là toàn game theo.

---

## 9. Vòng đời 5 VÒNG & quản lí địa danh

Toàn bộ nằm trong **`src/core/progression.js`** — sửa 1 chỗ là cả game theo:

```js
export const LAPS = [
  { id: 1, kite: 1, landmarks: null },              // null = dùng DEFAULT_LANDMARKS
  { id: 2, kite: 2, landmarks: [1, 2, 3] },         // ví dụ: vòng 2 chỉ 3 địa danh
  ...
];
export const DEFAULT_LANDMARKS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const POINTS_PER_CHAPTER = 6;   // số điểm để qua 1 địa danh
```

| Muốn làm gì | Sửa ở đâu |
|---|---|
| Giảm / tăng số địa danh mỗi vòng | độ dài mảng `landmarks` của vòng đó |
| Đổi địa danh vòng 2 khác vòng 1 | điền mảng riêng cho vòng 2 |
| Thêm địa danh mới | thêm 1 mục vào `TIER_THEMES` rồi thêm số hiệu vào `DEFAULT_LANDMARKS` / mảng vòng |
| Đổi nhịp độ (bao nhiêu điểm 1 chương) | `POINTS_PER_CHAPTER` |
| Đổi diều của từng vòng | `LAPS[i].kite` (1..5) + bảng `KITE_STAGES` |

Hết 5 vòng, game lặp lại vòng cuối (vô tận), diều giữ cấp cao nhất.
`getProgression(score)` trả về `{ lapNumber, chapterNumber, kiteStage, theme, ... }`.

**5 cấp diều** (`KITE_STAGES`): 1 Diều Giấy → 2 Diều Sáo (thêm sáo tre) → 3 Diều Lụa (đuôi dài, màu lụa) → 4 Diều Ngọc (đốm sáng) → 5 Diều Rồng (quầng vàng + râu rồng).

---

## 10. Đa ngôn ngữ (VI / EN)

- **`src/i18n.js`**: `t(key, vars)`, `pick(vi, en)`, `setLang`, `toggleLang`, `onLangChange`, `applyDomI18n`.
- Chuỗi HTML: gắn `data-i18n="key"` (hoặc `data-i18n-title`) → tự dịch khi đổi ngôn ngữ.
- Chuỗi trên canvas: luôn gọi `t(...)` tại thời điểm vẽ → đổi ngôn ngữ là đổi ngay frame sau.
- Dữ liệu địa danh: mỗi theme có `story` / `storyEn` / `windEn` / `descEn`.
- Bùa: mỗi perk có `nameEn` / `descEn`.
- Nút **EN/VI** trên toolbar, lưu lựa chọn vào `localStorage['dieu_say_gio_lang']`.
- Thêm ngôn ngữ mới: thêm 1 nhánh trong `DICT` + 1 nút.

---

## 11. Giao diện & font

- Palette: mực `#0b1512` · giấy dó `#f3ead6` · vàng thếp `#e8b84b` · ngọc bích `#2fb894` · đỏ son `#c8372d` (CSS variables trong `style.css`).
- Font: **Be Vietnam Pro** (Google Fonts, hỗ trợ đủ dấu tiếng Việt) cho UI + canvas; số điểm dùng monospace.
- Nút/thanh công cụ: dạng "thẻ giấy" viền vàng, bo tròn, hover đổi sang nền vàng.
- Modal (Bảng vàng · Cốt truyện · Kĩ năng): nền mực, viền vàng, hoa văn góc tròn.
- Hai màn mới: **📖 CỐT TRUYỆN** (9 chương, khoá/mở theo tiến trình) và **🎴 KĨ NĂNG** (6 bùa) — `src/ui/infoPanels.js`.

---

## 12. Đèn ban đêm (night lights)

File: **`src/graphics/nightLights.js`** — dữ liệu thuần khai báo, toạ độ theo khung 400×700:

```js
export const NIGHT_LIGHTS = {
  danang: [
    { type: 'windows', x: 178, y: 208, w: 150, h: 118, cols: 8, rows: 9, lit: 0.42 },
    { type: 'string',  x1: 0, y1: 492, x2: 200, y2: 486, n: 7 },
    { type: 'lamp',    x: 268, y: 452 }
  ],
  ...
};
```

| Loại | Ý nghĩa |
|---|---|
| `lamp` | đèn dầu / đèn nhà (quầng mềm + điểm sáng, nhấp nháy nhẹ) |
| `boat` | đèn trên thuyền + vệt loang xuống mặt nước |
| `windows` | ô cửa sổ sáng (tỉ lệ `lit`, vị trí ổn định bằng hash) |
| `string` | chuỗi đèn cầu / lồng đèn dọc một đường |

- Độ sáng do `game.nightLevel` (0..1) điều khiển, tự tăng khi `weather.isDark` (đêm sao, mưa giông, sương) và giảm về 0 khi trời sáng ⇒ **ban ngày không sáng**.
- Muốn thêm/bớt đèn: chỉ sửa mảng của địa danh đó. Muốn thêm loại đèn mới: thêm 1 nhánh trong `drawNightLights`.
- Ban đêm đèn không tốn thêm chi phí đáng kể (đo ~9.8ms/frame ở chế độ đêm so với ~10.8ms ban ngày).

---

## 13. Sự cố "treo game" & tối ưu hiệu năng (đã xử lý)

**Nguyên nhân gốc:** `Game.loop()` đặt `requestAnimationFrame(this.loop)` ở **cuối** hàm, nên chỉ cần 1 exception trong `update()`/`render()` là vòng lặp không bao giờ được lên lịch lại ⇒ game đứng hình vĩnh viễn (không bấm gì được).

Exception thực tế: trong `StoryOverlay._drawEnding` có `const t = this.elapsed;` — biến `t` (thời gian) **che mất hàm dịch `t()`**, nên khi thẻ "Diều Rồng" hiện ra (≥ 30 điểm) thì gọi `t('kite.5')` → `TypeError: t is not a function` → treo.

**Đã sửa:**
1. Đổi tên biến thời gian thành `time` trong `_drawEnding` (và `elapsed` trong `_alpha`).
2. Bọc `update()` + `render()` trong `try/catch`: lỗi được log ra console (`game.lastError`) và **vòng lặp vẫn tiếp tục** ⇒ không bao giờ treo cứng nữa.
3. Tối ưu hiệu năng (đo bằng `tools/perf-probe2.html`, Chrome headless, software raster):

| Cảnh | Trước | Sau |
|---|---|---|
| 3 cổng tre | 18.30 ms | **12.13 ms** |
| 3 cổng + mưa | 19.62 ms | **13.45 ms** |
| Màn READY | 17.36 ms | **9.00 ms** |
| Chọn bùa | 18.00 ms | **10.19 ms** |

Cách tối ưu: bỏ toàn bộ `createLinearGradient`/`createRadialGradient` tạo lại mỗi frame ở cổng tre (thay bằng dải màu phẳng + vòng sáng chồng), cache cỡ chữ banner (`_fitFontSize` + `OffscreenCanvas`), giảm số hạt gió.

**Công cụ kiểm tra:** `tools/perf-probe2.html` (đo từng cảnh), `tools/crash-probe2.html` (chạy 140 chương/vòng liên tiếp, đổi ngôn ngữ, bắt exception).

---

## 14. Cấp bậc = cấp diều (bỏ mốc 30 điểm)

- **Đã bỏ** mốc "30 điểm hoá Diều Rồng" và thẻ kết tương ứng.
- **Cấp bậc giờ theo VÒNG**: vòng 1 → Diều Giấy, vòng 2 → Diều Sáo, vòng 3 → Diều Lụa, vòng 4 → Diều Ngọc, vòng 5 → Diều Rồng.
- Thẻ Game Over hiện: `CẤP BẬC: DIỀU NGỌC · VÒNG 4` (lấy từ `options.kiteStage` + `options.lapNumber`).
- READY hiện `DIỀU: DIỀU SÁO`… theo cấp hiện tại.

### 5 cấp diều — dáng khác nhau rõ rệt (`KITE_STAGES` trong `progression.js`)

| Cấp | Tên | Dáng | Đặc điểm nhận ra ngay |
|---|---|---|---|
| 1 | Diều Giấy | thoi giấy | vàng, viền đỏ, 2 đuôi, **nhỏ nhất** |
| 2 | Diều Sáo | thoi giấy | **2 ống sáo tre** trên đỉnh, 3 đuôi |
| 3 | Diều Lụa | thoi lụa + **2 cánh lụa lớn** | kem ngà, hoa văn lụa, tua dài |
| 4 | Diều Ngọc | **lục giác** | ngọc bích viền vàng, **ngọc phát sáng**, vòng hào quang |
| 5 | Diều Rồng | **đầu rồng** | bờm đỏ, sừng, râu, nanh, quầng vàng |

Mỗi cấp còn lớn dần (`scale` 1.00 → 1.22) nên nhìn là biết đang ở vòng nào.
Xem nhanh: `tools/kite-stages.html`.

---

## 15. Bầu trời ban ngày (đã sửa cho chân thực)

Trước đây một số màn vẽ sẵn bầu trời đêm/chạng vạng nên khi trời nắng vẫn tím như ban đêm.

| Màn | Trước | Sau |
|---|---|---|
| **TP. HCM** | đêm tím/hồng neon, có sao | **trời xanh ban ngày**, mây trắng, chim, sông xanh, toà nhà xám xanh, Bitexco thuỷ tinh xanh |
| **Huế** | chạng vạng tím + **mặt trăng** | **trời xanh ban ngày** + **mặt trời**, mây trắng, cầu Tràng Tiền thép sáng, sông Hương xanh |
| Sa Pa, Ninh Bình, Hà Nội, Đà Nẵng, Hội An, Đà Lạt, Miền Tây | — | đã kiểm tra, phù hợp (nắng vàng / hoàng hôn nhẹ) |

Ban đêm hoặc mưa giông vẫn tối chân thực nhờ hệ thống thời tiết (`_relightSky`) — không còn cảnh "nắng mà trời đêm".

---

## 16. Nhịp độ & trải nghiệm người chơi (UX pass)

### Vấn đề
- Địa danh / thời tiết / hộp bùa đổi quá nhanh → người chơi không kịp "thuộc" cảnh, mất nhịp.
- Thẻ giới thiệu địa danh nằm giữa phía trên → **che lối bay**, dễ đâm vào cổng.
- Người chơi mải ngắm cảnh (đúng mục tiêu "quảng bá Việt Nam") nên dễ mất dấu nhân vật.

### Nguyên tắc thiết kế đã áp dụng
1. **Không che lối bay**: không có thẻ nền lớn nào trong lúc chơi. Mọi thông tin giới thiệu nằm ở **rìa màn hình** (góc dưới-trái + banner đáy).
2. **Nhịp "thở"**: mỗi vùng miền đủ dài để ngắm (≈22 giây), sự kiện (bùa / thời tiết / địa danh) **lệch pha** để không dồn cục.
3. **Nhân vật luôn nổi**: thêm bóng mờ dưới thân diều ⇒ phông tranh sáng cỡ nào vẫn thấy nhân vật.
4. **Giới thiệu kiểu AAA**: letterbox mỏng + vignette + tiêu đề khu vực trượt nhẹ, tự tan sau 3.2s (không bấm gì, không chặn).
5. **Nội dung văn hoá dời sang chỗ "rảnh"**: câu chuyện chương hiện ở **màn READY** (đọc lúc chuẩn bị bay) và màn **📖 CỐT TRUYỆN** — không chen vào lúc đang né cổng.

### Thông số nhịp độ (trước → sau)
| Sự kiện | Trước | Sau | Lý do |
|---|---|---|---|
| Qua địa danh mới | 6 điểm (~11s) | **12 điểm (~22s)** | đủ thời gian ngắm cảnh + đổi nhịp |
| Hộp bùa (perk) | 7 điểm, trùng chương | **12 điểm, lệch pha** (mốc 6, 18, 30…) | không dồn 2 sự kiện cùng lúc |
| Thời tiết | 18s (+0–8s) | **30s (+0–14s)** | mỗi thời tiết đủ lâu để "sống" trong cảnh |
| Thẻ giới thiệu | thẻ lớn trên màn, 4s | **tiêu đề góc dưới, 3.2s, không nền** | không che lối bay |

### Cách hiển thị giới thiệu địa danh mới
- Letterbox 9px trên/dưới (vùng không có lối bay) + vignette 4 góc.
- Góc dưới-trái: `VÒNG 1 · CHƯƠNG 03` (ngọc) → **HÀ NỘI** (lớn, kem) → `GIÓ HỒ GƯƠM` (vàng).
- Trượt nhẹ 16px từ trái khi xuất hiện; tan dần; **không có khung nền** nên vẫn thấy cổng tre phía sau.
- Toàn bộ câu chuyện chữ dài → màn READY + màn Cốt truyện.

### Gợi ý bước tiếp (chưa làm)
- Độ khó tăng dần theo vòng (`spawnInterval` 1.85s → 1.35s) để 22 giây/chương không bị nhàm.
- "Safe start": 1.2s bất tử ngay sau mỗi lần đổi chương (tránh oan do đang ngắm cảnh).
- Nhạc nền chuyển tông theo địa danh (hiện chỉ đổi ambient theo thời tiết).

---

## 17. Chuyển cảnh mượt + ô giới thiệu địa danh (bản 2)

### Vì sao trước đây đổi chương bị giật
`ScenicLandmarks.draw()` khi `fadeProgress < 1` vẽ **cả bức tranh cũ và mới trong cùng một frame** và giữ trạng thái đó suốt **1 giây** ⇒ mỗi frame nặng gấp đôi, đúng lúc đổi chương.

**Đã sửa:**
- Chỉ vẽ **một** bức tranh mỗi frame. Nửa đầu hiện tranh cũ, nửa sau hiện tranh mới.
- Phủ **màn mực** (0 → đậm → 0) + vệt vàng mảnh ở mép màn mực ⇒ chuyển cảnh như "cuộn tranh".
- Tổng thời gian ~0.66s; frame chuyển cảnh ≈ 15ms (p95 20ms) thay vì gấp đôi trước đây.
- Lần đầu vẽ một địa danh mới vẫn có 1 frame bake (~200ms) nhưng **nằm đúng lúc màn mực đang phủ kín** nên không nhìn thấy.

### 1.2 giây bất tử
- `game.invincibleTimer = 1.2` mỗi khi đổi chương/vòng (và 1.0s lúc bắt đầu ván).
- Bỏ qua va chạm biên + cổng trong thời gian này.
- Hiển thị: diều nhấp nháy nhẹ + vòng ngọc quanh thân ⇒ người chơi biết mình đang được bảo vệ.

### Ô giới thiệu địa danh (góc phải, luôn hiện)
- **Gỡ bỏ** banner mô tả địa danh có nền đen ở đáy màn hình.
- Thay bằng **ô nhỏ ở góc dưới-phải** (HTML, bấm được): `VÒNG 1 · CHƯƠNG 03` / **HÀ NỘI** / `GIÓ HỒ GƯƠM`.
- Sang địa danh mới: ô **nhấp sáng 0.75s** (chipFlash) — không còn thẻ lớn che lối bay.
- Diều bay vào đúng góc đó → ô tự mờ còn 22% (`.is-ghost`) để không che nhân vật.
- **Bấm vào ô** → popup chi tiết: tên địa danh, vòng/chương/ngọn gió, câu chuyện (VN/EN), **3 chi tiết văn hoá** (`theme.facts` / `factsEn`).
- Dữ liệu chi tiết nằm trong `themes.js` — thêm/sửa 1 dòng là xong.

---

## 18. Độ khó tăng dần theo vòng

Bảng `DIFFICULTY` trong `progression.js` (chỉ tăng **nhịp**, không thu hẹp khe — tránh ức chế):

| Vòng | spawnInterval | Nghỉ sau mỗi N cổng | Cổng / 60 giây (đo thực tế) |
|---|---|---|---|
| 1 | 1.85s | 10 | **31** |
| 2 | 1.72s | 10 | ~33 |
| 3 | 1.60s | 9 | **36** |
| 4 | 1.48s | 9 | ~39 |
| 5+ | 1.36s | 8 | **42** |

- "Nhịp thở": cứ N cổng thì `spawnTimer` cộng thêm 0.45–0.55s để mắt nghỉ.
- `game.difficulty = difficultyFor(prog.lapIndex)` → truyền vào `pillars.update(...)`.
- Muốn chỉnh độ khó: sửa đúng bảng `DIFFICULTY` (không đụng code khác).

## 19. Nhạc nền riêng cho từng vùng miền

- Mỗi theme có `music: { id, root, scale, step, lead, bassEvery, gain, filter }` (xem `themes.js`).
- `AudioSynthesizer.setMusicTheme(cfg)` — **crossfade ~1.1s**; `updateMusicTick(dt)` phát nốt theo bước thời gian, bước đi mềm trên thang âm (không lặp y nguyên).
- 9 vùng = 9 "chất nhạc" khác nhau: Sa Pa chậm/ngũ cung trầm, Hà Nội đàn tranh (triangle), Huế nhã nhạc chậm, Đà Nẵng trong sáng, TP.HCM synthpop nhanh (square), Miền Tây sáo đồng bằng…
- Tắt/mở tiếng giờ áp cho **cả ambient lẫn nhạc** (`toggleMute` ramp gain) — trước đây tắt tiếng không thật sự tắt ambient.
- Kiểm thử: `tools/music-probe.html` (chạy 9 theme × 40 bước, `errors=0`, AudioContext running).

## 20. Âm lượng riêng & tiếng lên cấp diều

- **Hai bus âm thanh độc lập**: `musicGainNode` (nhạc nền) và `sfxGainNode` (hiệu ứng + môi trường). Trước đây mọi thứ đổ thẳng ra `destination` nên không thể chỉnh riêng.
- **Nút ⚙ trên toolbar** mở modal Cài đặt với 2 thanh trượt: `Nhạc nền` (0–100%) và `Hiệu ứng` (0–100%).
- Giá trị lưu vào `localStorage` (`dieu_music_vol`, `dieu_sfx_vol`), áp lại ngay khi mở game.
- Nút 🔊 giờ tắt **cả ba lớp** (nhạc / hiệu ứng / môi trường) — trước đây tắt tiếng không thật sự tắt ambient.
- **Tiếng "lên dây" khi lên cấp diều** (`playKiteUpgrade(stage)`): 4 nốt đi lên + 1 tiếng trầm, **cao độ khác nhau cho 5 cấp** (G4 → D5). Phát đúng lúc sang vòng mới.
- Kiểm thử: `tools/music-probe.html` → 9 theme + mute + volume + 5 tiếng lên cấp, `errors=0`.

## 21. Sự cố "bật max âm lượng nhưng không có tiếng" (đã sửa)

**Nguyên nhân:** `_ensureSfxBus()` tạo bus rồi nối bằng `_dest()` — mà `_dest()` lại trả về *chính bus vừa tạo*:

```js
this.sfxGainNode = this.ctx.createGain();
this.sfxGainNode.connect(this._dest());   // _dest() === this.sfxGainNode  -> tự nối vào chính nó
```

⇒ bus tự nối vào chính nó, **không bao giờ chạm tới loa** ⇒ mọi hiệu ứng + ambient im lặng (nhạc nền đi đường riêng nên chỉ còn tiếng rất nhỏ).

**Đã sửa:** nối thẳng `bus.connect(this.ctx.destination)`; `_dest()` chỉ tạo bus khi còn thiếu.
**Kiểm chứng:** `tools/offline-audio-test.html` dựng lại đúng đồ thị trong `OfflineAudioContext` rồi render:
`SFX render: peak = 0.6405 · rms = 0.0708` ⇒ có tín hiệu thật.
(Đo bằng `AnalyserNode` trong headless bị 0.0 kể cả với oscillator thuần → không dùng được.)

## 22. Tự động PAUSE khi mở popup

- `game.setPaused(true/false)`: bỏ qua toàn bộ `update()` (thế giới đứng yên), vẫn `render()` frame tĩnh, và xoá tap đang chờ để không bị nhảy khi mở lại.
- `main.js` theo dõi **mọi modal** (`leaderboard / story / skills / landmark / settings`) bằng `MutationObserver` + `setInterval` dự phòng → mở popup nào cũng tự pause, đóng thì chạy tiếp.
- Khi pause: nhạc nền **duck xuống 35%** (`setMusicDuck`) cho dễ đọc chữ, resume thì trả lại 100%.
- Kiểm chứng: `tools/pause-probe.html` → trong 120 frame pause, `y` không đổi (0.000); resume thì diều rơi tiếp ⇒ **PAUSE OK**.

## 23. Sự cố "không nghe thấy nhạc nền" (đã sửa)

**Nguyên nhân:** âm lượng bị **giảm 2 lần**:
```js
peak nốt  = cfg.gain * 0.55     // 0.16 * 0.55 = 0.088
bus gain  = cfg.gain * volume   // 0.16 * 0.8  = 0.128
=> đỉnh thực tế ≈ 0.011  (~-39 dB)  -> gần như im lặng
```
So với hiệu ứng (đỉnh ~0.5–0.6) thì nhạc nhỏ hơn ~40 lần.

**Đã sửa — tách rõ 2 tầng:**
| Tầng | Ý nghĩa | Giá trị |
|---|---|---|
| `peak` của nốt | độ to *tương đối* trong bản nhạc | lead 0.5 · bass 0.75 |
| `musicGainNode` (bus) | độ to *tổng* của nhạc | `MUSIC_BUS_GAIN (0.7) × cân bằng vùng × volume × duck` |

- Bỏ hẳn việc nhân `cfg.gain` vào cả hai tầng; `cfg.gain` chỉ còn dùng để **cân bằng nhẹ** giữa các vùng.
- Dùng `setTargetAtTime` thay vì ramp tuyệt đối (bền khi AudioContext còn *suspended*), và **áp lại gain sau khi `resume()`**.
- Nốt đầu tiên phát sau 0.05s (trước là 0.1s).
- **Hạ ambient** từ 0.65 → **0.42** để nhạc nền không bị tiếng mưa/gió lấn.

**Kiểm chứng (render offline, không phải đoán):**
```
#1 sapa     : bus=0.560  peak=0.5729  rms=0.0553
#2 ninhbinh : bus=0.595  peak=0.5391  rms=0.0468
SFX         : peak=0.6405
```
⇒ Nhạc và hiệu ứng giờ **cùng tầm** (0.54–0.64), trước đây nhạc chỉ ~0.06.

---

## 24. Game Feel Pass 1 + hệ "5 Hình × 5 Sắc"

### A. Tiến trình tách khỏi điểm số (nhịp thời tiết luôn ổn định)
- **Chương tính theo SỐ CỔNG ĐÃ VƯỢT**: `GATES_PER_CHAPTER = 12` (~22–25 giây/tỉnh).
- Điểm (Near-Miss +2/+4, Smash +3, hạt gió) **chỉ dùng cho bảng xếp hạng** → người chơi giỏi không còn "nhảy tỉnh" sau 8 giây.
- `_syncProgression()` là **nguồn sự thật duy nhất** (cảnh / thời tiết / nhạc / chip / cấp diều), gọi ở mọi lần tăng cổng.

### B. Diều = Hình dáng (theo VÒNG) × Phẩm sắc (theo TỈNH)
| Phẩm sắc | Tỉnh trong vòng | Mốc cổng |
|---|---|---|
| 1. Bạch Nguyệt | 1–2 | 0 |
| 2. Thanh Ngọc | 3–4 | 24 |
| 3. Tử Vân | 5–6 | 48 |
| 4. Hoàng Kim | 7–8 | 72 |
| 5. Ngũ Sắc (cầu vồng) | 9 | 96 |

- Hình dáng đổi theo vòng: Giấy → Sáo → Lụa → Ngọc → Rồng (**mốc 108 / 216 / 324 / 432 cổng** — giữ nguyên độ danh giá).
- Nguyên tắc: **phẩm sắc chỉ đổi bảng màu**; **cấp vòng đổi khung xương** (cánh, sáo, hào quang, đầu rồng) ⇒ "Trắng của cấp mới" luôn đẹp hơn "Ngũ Sắc của cấp cũ".
- Ngũ Sắc: viền + hoạ tiết chuyển màu theo thời gian (hsl quay).

### C. Lộng Gió = lao xuyên cổng thật
- Không xoá cột từ xa nữa: diều lao tới với **world speed ×3.4**, tự căn theo khe cổng.
- Chạm cột nào → cột đó **nổ tung**, **hit-stop 45ms**, rung màn hình, +3 điểm, `smashPillarsLeft--`.
- Pháo Dây Chuyền: `nextSmashChain = 2` + 35% năng lượng → cú kế tiếp xuyên **2 cổng**; quả cầu hiện **huy hiệu ×2**.
- Kết thúc: giảm tốc về 1.0, diều trôi về làn bay, **bất tử 0.7s**.

### D. Kích hoạt 1 ngón: NHẤN GIỮ 240ms
- Bỏ double-tap và bấm-quả-cầu (2 đường cướp quyền điều khiển).
- Vật lý: mỗi tap cho `THRUST_VY = -350`, trọng lực `1050` → đỉnh sau **333ms**; giữ 240ms vẫn đang bay lên ⇒ không tụt độ cao.
- `input.holdProgress` (0..1) sẵn sàng cho vòng nạp quanh diều.

### E. Cân bằng & UX kèm theo
| Mục | Trước | Sau |
|---|---|---|
| Bọt Rượu Cần | 1 cổng | **4 cổng / 1 hit** |
| Xuyên Gió | 2 cổng | **4 cổng** |
| Vó Hút Gió | 220px | **260px** |
| Pháo Dây Chuyền | +100% + nổ ngay | **cú sau phá 2 cổng + 35%** |
| Nhịp bốc bùa | 1.0 + 3.5 + 1.0s | **0.45 + 2.4 + 0.7s** (mỗi 12 cổng, lệch pha) |
| Khoá restart | 0.1s | **0.55s** |
| Bảng xếp hạng | tự mở mỗi lần chết | **chỉ khi lập kỷ lục** |
| Âm thanh | không giới hạn | **DynamicsCompressor (limiter) ở đầu ra** |

### F. Kiểm chứng
`tools/gameplay-probe.html` → **ALL GAMEPLAY CHECKS PASSED**:
- 12 cổng → chương 2 · 24 → sắc 2 · 60 → sắc 3 · 108 → vòng 2 / hình 2 / sắc 1
- Lộng Gió: cột **không** bị xoá lúc kích hoạt → bị húc vỡ khi va chạm (+3), speedMul về 1, bất tử sau khi hạ cánh
- Pháo Dây Chuyền: phá **2 cổng thật** rồi reset
- Nhấn 300ms → kích hoạt; tap 80ms → **không** kích hoạt

`tools/audit-runtime.html` → 9 địa danh × 3 thời tiết, `errors=0`.
`tools/kite-colors.html` → bảng 5×5 để duyệt thẩm mỹ.

### G. Còn lại (chưa làm trong pass này)
- Trần mềm (nảy 3 lần/2s) — chưa làm.
- Hạt gió +5% + combo — vẫn +2%.
- `effectiveTier = min(9, tier + lap*2)` để vòng 2 không bị "đứng yên" lại.
- Meta-progression (Sổ tay bưu thiếp / Hũ gió / mở khoá bùa) — mới ở mức đề xuất.

---

## 25. Bản vá 27/11: Diều Sáo, Smash, âm thanh đêm + phần còn lại

### A. Diều Sáo (cấp 2) — giờ là một bước nâng cấp rõ ràng
Trước đây cấp 2 chỉ là "cấp 1 + ống sáo" nên khi nhìn **Diều Sáo Trắng** cạnh **Diều Giấy Ngũ Sắc** thì thấy như bị xuống cấp.

Đã thiết kế lại **chỉ riêng cấp 2** (vẫn phải dưới cấp 3):
| Thêm cho cấp 2 | Cấp 1 | Cấp 3 (vẫn cao hơn) |
|---|---|---|
| Thân **rộng hơn**, mép sau lượn (dáng cánh cung) | thoi nhỏ | thân 2 tầng + **cánh lụa lớn** |
| **2 vây nhỏ** trên/dưới | không | cánh lụa chiếm 2/3 thân |
| **Viền vàng kép** bên trong | 1 viền đỏ | viền đỏ + hoạ tiết hoa văn lụa |
| **Núm tua** vàng ở đuôi + sáo tre | không sáo | sáo + tua lụa dài uốn sóng |
| 3 đuôi nheo | 2 đuôi | 3 đuôi dài hơn |

⇒ "Trắng của cấp 2" đã chi tiết hơn "Ngũ Sắc của cấp 1", nhưng vẫn thua cấp 3 về khung xương.

### B. Sửa lỗi KHÔNG THỂ SMASH (3 nguyên nhân)
1. **Hướng dẫn vẫn ghi "chạm đúp"** dù đã đổi sang nhấn-giữ ⇒ người chơi làm sai thao tác.
   → Sửa copy: `Chạm: bay | GIỮ 0.2s: Lộng gió`, băng-rôn `🌪 GIỮ TAY 0.2s: LỘNG GIÓ!`.
2. **Bàn phím không kích hoạt được**: `_onKeyDown` chỉ set `isPressed` mà không set `holdStart/_holdArmed`.
   → Đã thêm; giữ `Space/W/↑` 0.2s là Lộng Gió, nhả ra thì huỷ.
3. **Không có phản hồi trực quan khi giữ** ⇒ người chơi không biết đã đúng.
   → Thêm **vòng nạp vàng** quanh diều khi giữ (0 → 100%).
4. Giảm ngưỡng giữ **240ms → 200ms**; thêm **timeout 1.1s** cho cú lao (tránh kẹt khi phía trước không có cổng).

### C. Âm thanh ban đêm
- Ambient `night` trước đây chỉ có 1 tiếng drone 80Hz → nay thêm:
  - **Dế kêu** (`playCricketChirp`): 2–4 xung sine 3.9–4.8kHz, mỗi 1.1–2.7s.
  - **Ếch ộp** (`playFrogCroak`): sawtooth 145–210Hz qua bandpass + LFO rung, mỗi 4–8.5s.
- Đo bằng render offline: **dế peak 0.055 · ếch peak 0.077** (đúng tầm nền, không lấn nhạc).

### D. Ba việc còn lại đã xong
| Việc | Kết quả |
|---|---|
| **Trần mềm** | Chạm mép trên: nảy xuống (`vy = +140`), **3 lần trong 2s** mới chết; rơi đáy vẫn chết |
| **Hạt gió** | **+5%** (trước +2%), ăn **3 hạt liên tiếp trong 1.6s → +1 điểm** |
| **effectiveTier** | Vòng 2+ cộng `lapIndex × 2` vào tier cổng (min 9) ⇒ cổng vẫn nghiêng/dập dềnh, không "đứng yên" lại |

### E. Kiểm chứng
`tools/gameplay-probe.html` → **ALL GAMEPLAY CHECKS PASSED** (12/24/60/108 cổng, Lộng Gió húc vỡ cổng thật, chain 2 cổng, nhấn giữ).
`tools/gameplay-probe2.html` → **ALL CHECKS PASSED**:
- `keydown Space → armed` · `giữ 260ms → smashRequested` · `keyup → nhả`
- `chạm trần lần 1: KHÔNG chết` · `bị đẩy xuống (vy=140)` · `3 lần → chết`
- `hạt gió +5%` · `3 hạt → +1 điểm`
- `vòng 2: pillar tier = 3`
`tools/night-audio-test.html` → **NIGHT AUDIO OK**.
`tools/audit-runtime.html` → 27 render, `errors=0`.

---

## 26. Bản vá Smash (điểm số, cảm giác, túi bùa)

### A. Điểm số Smash: đúng 1 điểm / 1 cổng
- Trước: mỗi cổng bị húc cho **+3 điểm**, cộng thêm điểm "qua cổng" nếu cột kịp tính ⇒ cảm giác "được điểm rất nhiều".
- Sau: **+1 điểm mỗi cổng** (Pháo Dây Chuyền 2 cổng = +2), và cổng bị húc **cũng tính là đã qua cổng** (`gatesPassed += 1` + `_syncProgression()`), nên chương/vòng/túi bùa vẫn chạy đúng nhịp.

### B. Cảm giác "lao xuyên và húc vỡ" (nguyên nhân cũ)
Trước đây cột bị **xoá từ xa** nên diều chỉ lướt qua khoảng trống. Bản này:
1. Không xoá trước — cột vẫn trôi tới, diều lao tới, **va chạm thật** mới vỡ.
2. Nổ ở **đúng hai trụ** (trên + dưới) thay vì giữa khe, kèm **một vụ nổ trung tâm**.
3. **Hit-stop 55ms** + **chớp trắng ấm** + **rung 0.16s** (`hud.triggerRamImpact()`) ngay lúc vỡ.
4. **Mũi lao sáng** (nón gradient) phía trước diều trong suốt cú lướt.
5. Tốc độ thế giới **×2.6** (trước ×3.4) + diều tiến 160px/s ⇒ cú lướt kéo dài ~0.3s, đủ để *thấy* mình xuyên qua cổng.
6. Hạ cánh: giảm tốc, trôi về làn bay, **bất tử 0.7s**; có **timeout 1.1s** nếu phía trước không có cổng.

### C. Túi bùa không xuất hiện (nguyên nhân thật)
`perks.checkMilestone()` bị đặt **trong `_onNearMiss()`** thay vì `_onScore()` ⇒ chỉ khi lướt sát cột mới kiểm tra mốc; người chơi qua cổng bình thường (hoặc smash) **không bao giờ mở túi**.
Đã chuyển sang `_onScore()` với **số cổng** (`gatesPassed`), giữ nguyên logic lệch pha: mốc **6, 18, 30, 42…** cổng.

### D. Kiểm chứng (`tools/smash-test.html`, môi trường sạch, mỗi ca một Game mới)
```
PASS 1 cổng: bị húc vỡ
PASS 1 cổng: +1 điểm            (score = 1)
PASS 1 cổng: gates +1           (gates = 1)
PASS 1 cổng: kết thúc dash      (19 frame ≈ 0.32s)
PASS chain: cả 2 bị phá
PASS chain: +2 điểm
SMASH TEST PASSED
```
`tools/gameplay-probe2.html` → `PASS smash 1 cổng -> +1 điểm`, `PASS cổng 6 -> mở túi bùa`.

---

## 27. Smash "lao tới", tiến độ chương, Sổ tay bưu thiếp

### A. Smash giờ là một cú LAO có quỹ đạo
Trước: diều gần như đứng yên, thế giới lao nhanh ×2.6 ⇒ cảm giác "cột tự bay tới".
Nay:
- `smashStartX → smashTargetX` với **ease-out** trong **0.34–0.62s**, quãng lao thực đo **~156px**.
- Thế giới **chậm lại 0.55×** trong lúc lao ⇒ mắt thấy rõ *diều tiến về phía trước*.
- Mũi diều chạm mép trụ (+8px) mới vỡ: nổ **hai trụ + tâm**, hit-stop 55ms, chớp trắng, rung.
- **Pháo Dây Chuyền**: hết quỹ đạo mà còn cổng thì **nối dài cú lao** sang cổng kế (không hạ cánh non).
- Kết thúc: trôi về làn bay (0.24s), bất tử 0.7s, **cooldown 0.35s** chống smash liên tiếp.

### B. Một địa danh = 12 CỔNG (giờ hiển thị rõ)
Người chơi thấy lúc 18 điểm, lúc vài cột vì **điểm** (near-miss +2/+4, smash +1, combo hạt gió) khác **cổng**.
Nay ô địa danh ghi thẳng: `VÒNG 1 · CHƯƠNG 01 · 7/12` + **thanh tiến độ** vàng→ngọc, cập nhật từng cổng.
⇒ Muốn hoàn thành 1 địa danh: **12 cổng** (near-miss/smash vẫn cộng điểm nhưng không rút ngắn chương).

### C. Sổ tay bưu thiếp (meta-progression lưu vĩnh viễn)
- Nút **📮** trên thanh công cụ (trước ⚙) → modal **9 địa danh × 6 kiểu thời tiết = 54 tem**.
- Ghi tem tự động mỗi 0.5s khi đang chơi: gặp tổ hợp (địa danh × thời tiết) lần đầu → toast `📮 TEM BƯU THIẾP MỚI!`.
- Lưu `localStorage['dieu_stamps_v1']`, **không** ảnh hưởng điểm/sức mạnh ⇒ không phá bảng xếp hạng.
- VI/EN đầy đủ; modal tự pause game (đã thêm `stamps-modal` vào danh sách pause).

### D. Hâm nóng cảnh (hết khựng khi vào vùng mới)
`scenic.preWarmAll()` vẽ thử lần lượt 9 địa danh vào canvas tạm trong lúc ở màn READY (cách nhau 24ms),
nên lần đầu vào Đà Lạt/… không còn frame dựng hình ~220ms.

### E. Kiểm chứng
```
SMASH TEST PASSED
  lao tới 156px · cổng vỡ · +1 điểm · gates +1 · về làn bay x=97
  chain: 2 cổng vỡ · +2 điểm
AUDIT 9 địa danh × 3 thời tiết: errors=0
```

---

## 28. Mô hình điểm thống nhất (thay mục 24.A và 27.B)

### A. Nguồn điểm
| Hành động | Điểm |
|---|---|
| Vượt 1 cổng | **+1** |
| Near-miss (lướt sát cột) | **+2** (cố định, không nhân hệ số) |
| Lộng Gió húc vỡ 1 cổng | **+1** (Pháo Dây Chuyền 2 cổng = **+2**) |
| Combo 3 hạt gió | **+0 điểm** (chỉ +5% năng lượng/hạt và hiệu ứng) |

### B. Chương tính theo ĐIỂM
- `POINTS_PER_CHAPTER = 15` — **15 điểm = xong 1 địa danh**.
- 1 vòng = 9 địa danh × 15 = **135 điểm**; Diều Rồng (vòng 5) ở mốc **540 điểm**.
- Ô địa danh hiển thị `VÒNG n · CHƯƠNG xx · 7/15` + thanh tiến độ, cập nhật sau **mọi** thay đổi điểm
  (cổng, near-miss, smash) ⇒ không còn cảm giác "lúc 18 điểm, lúc vài cột".
- `_syncProgression()` đọc thẳng `this.score` (bỏ `gatesPassed` khỏi đường tiến trình).

### C. Hệ quả cân bằng (ghi nhận có chủ đích)
- Người chơi giỏi (near-miss nhiều) **qua địa danh nhanh hơn** ⇒ thấy nhiều thời tiết/địa danh hơn — đúng ý "chương dựa vào điểm".
- Đổi lại nhịp thời tiết không còn cố định 22–25s/tỉnh; mỗi tỉnh ngắn nhất ~15 cổng khi chơi sạch.

### D. Kiểm chứng (`tools/score-probe.html`)
```
PASS 14 điểm -> vẫn chương 1 (ch=1)
PASS 15 điểm -> chương 2 (ch=2)
PASS 15 điểm -> vẫn sắc 1 (tỉnh 2)
PASS near-miss +2 điểm (delta=2)
PASS smash 1 cổng +1 điểm (delta=1)
PASS 3 hạt gió: KHÔNG cộng điểm (score=50)
PASS 3 hạt gió: vẫn +5%/hạt (meter=15)
SCORE MODEL PASSED
```
`tools/smash-test.html` → **SMASH TEST PASSED** (lao 156px, +1 điểm/cổng, chain +2).
`tools/audit-runtime.html` → 27 render, `errors=0`.

---

## 29. Độ nét DPR, PWA offline, danh hiệu, cấu hình

### A. Render theo DPR (nét trên mobile/retina)
- `resize()` nhân backing store theo `devicePixelRatio` (giới hạn ≤3) và đặt `ctx.setTransform(dpr,0,0,dpr,0,0)`.
- Hệ toạ độ logic **vẫn 400×700** nên mọi code vẽ không phải sửa.
- Đo: DPR 1 → backing 400×700, scale 1; DPR 2 → backing **800×1400**, scale 2, toạ độ logic giữ nguyên.

### B. PWA — chơi offline
- `sw.js`: cache-first cho shell game (HTML/CSS/JS/asset), **không** cache API bảng xếp hạng.
- Đăng ký trong `main.js`, chỉ khi `http/https`.
- Khi sửa code: tăng `CACHE` version trong `sw.js` để người chơi nhận bản mới.

### C. Tạm dừng khi ẩn tab
- `visibilitychange` → `game.setPaused(true)` khi ẩn; hiện lại thì đồng bộ theo modal.
- Tránh chết oan khi chuyển app và tiết kiệm pin.

### D. Cấu hình 1 chỗ
- `src/config.js`: `leaderboardUrl`, `leaderboardEnabled`, `leaderboardMinScore`.
- `game.js` và `ghosts.js` đọc từ đây (hết hard-code URL ở 2 nơi).

### E. Danh hiệu sưu tầm (từ Sổ tay bưu thiếp)
| Số tem | Danh hiệu |
|---|---|
| 0–4 | Tập Bay |
| 5–11 | Bạn Của Gió |
| 12–23 | Lãng Khách Gió |
| 24–41 | Thợ Săn Bưu Thiếp |
| 42–53 | Người Giữ Ký Ức Việt Nam |
| 54 | Đại Sứ Bốn Mùa |

Hiện ở màn kết thúc: `DANH HIỆU: …` (VI/EN).

### F. Kiểm chứng
```
DPR TEST PASSED
  DPR 1: backing 400x700, scale 1
  DPR 2: backing 800x1400, scale 2, toạ độ logic 400x700
SCORE MODEL PASSED
AUDIT 9 địa danh × 3 thời tiết: errors=0
```

### G. Chưa làm (ghi lại có chủ đích)
- **Bundle/minify**: kiến trúc là "no build step" (ES module thuần, chạy trực tiếp).
  575KB chưa nén ≈ 60–90KB sau gzip (server bật gzip/brotli là đủ cho canvas game).
  Nếu cần bundle thật thì thêm `tools/build.mjs` dùng esbuild và sinh `dist/` riêng, giữ `src/` cho dev.
- **Bảng xếp hạng thật**: vẫn là worker demo; đổi URL trong `src/config.js` là xong.

---

## 30. Smash liền mạch (thay cách làm ở mục 27.A)

### A. Vì sao trước đây "giật rồi đứng im" / "bị ngắt quãng"
1. Cú lướt dùng **ease-out tới một điểm đích** ⇒ diều tăng tốc rồi **phanh dần và dừng** ngay sau cột.
2. Chỉ **diều** di chuyển, thế giới lại chạy chậm 0.55× ⇒ không có cảm giác "màn hình chạy theo".
3. Mỗi lần húc vỡ lại set **hit-stop 55ms** ⇒ cú lướt bị cắt thành từng khúc.
4. Bản nâng cấp "nối dài" đặt lại `smashTime` ⇒ ease-out thứ hai ⇒ khựng giữa 2 cột.

### B. Cách làm mới
| Thành phần | Cách làm |
|---|---|
| Chuyển động | **Tuyến tính/không đổi tốc độ**: diều tiến **96px** trong 0.22s (ease-out nhẹ) rồi **giữ**, phần "lướt" do thế giới cuộn |
| Thế giới | `speedMul = 3.4` **không đổi suốt cú lướt** ⇒ màn hình trôi đều, không giật |
| Thời lượng | **cố định**: 0.62s (1 cột) / 0.85s (2 cột) ⇒ đủ húc cột + vượt đoạn sang cột kế |
| Hit-stop | **Bỏ hoàn toàn** khi húc (chỉ còn chớp sáng + rung 0.16s, không dừng thời gian) |
| Nối cột (chain) | Không reset thời gian; chỉ đếm `smashPillarsLeft` ⇒ 2 cột trong **một** cú lướt |
| Hạ cánh | `speedMul` giảm **từ từ** 3.4 → 1 trong ~0.24s + trôi về làn bay |
| Giới hạn | Không húc quá `smashPillarsLeft` cột ⇒ không cộng điểm thừa |

### C. Đo độ mượt (`tools/smash-test.html`)
| Chỉ số | Smash thường | Smash nâng cấp |
|---|---|---|
| Cột bị phá | 1 | 2 |
| Điểm | +1 | +2 |
| Diều tiến | 96px | 96px |
| Frame lùi | **0** | **0** |
| Hit-stop | **0 frame** | **0 frame** |
| `speedMul` | **3.4 hằng số** | **3.4 hằng số** |
| Biến thiên tốc độ cuộn (CV) | **0.000** | **0.000** |
| Thời lượng | 37 frame (~0.62s) | 50 frame (~0.83s) |

⇒ Không còn frame đứng yên, không đổi tốc độ đột ngột, chain dài hơn nhưng vẫn liền một mạch.

### D. Kiểm chứng khác
`tools/audit-runtime.html` → 27 render, `errors=0`.
Ảnh khung giữa cú lướt: `docs/screenshots/smash-visual.png` (cổng vỡ ở hai trụ, diều đang xuyên qua).

---

## 31. Sửa 2 bug Smash + 2 cải thiện (thay mục 28.B về số điểm/chương)

### A. BUG 1 — vừa qua cột rồi Smash thì nổ cột phía sau, diều không lướt
Nguyên nhân: bộ lọc mục tiêu là `p.x + p.width > rocket.x` ⇒ **cột vừa đi qua vẫn lọt vào danh sách**,
nên cột sau lưng bị húc và cú lướt "dừng" ngay.
Đã sửa:
- Chỉ lấy cột **phía trước**: `p.x > rocket.x + 6` (cả khi chọn mục tiêu và khi húc).
- Trong vòng lặp húc: `if (pillar.x < rocket.x - 8) continue` ⇒ không bao giờ nổ cột sau lưng.
- **Thời lượng = điểm giữa** cột vừa phá và cột kế:
  `tReach(px) = (px - noseX) / (pillarSpeed × 3.4)`, `duration = (t_last + t_next) / 2`
  ⇒ diều kết thúc cú lướt đúng **khoảng giữa 2 cột** (không cột nào phía trước: lướt 0.5s).
- Chain: lấy 2 cột phía trước, cùng một cú lướt, không reset thời gian.

### B. BUG 2 — chọn Pháo Dây Chuyền làm tụt thanh gió
Sót dòng `drunkMeter -= 35` trong `perks.selectCard()` (di sản của cơ chế "tặng 35% rồi trừ lại").
Đã xoá ⇒ nhận thẻ **không mất năng lượng**, vẫn được `+35%` và cú Lộng Gió kế tiếp phá 2 cổng.

### C. Cải thiện 1 — quên bấm lại sau khi lướt
`_endSmash()` tự tặng **một nhịp đẩy** (`thrust()`, vy = −350, có âm thanh + hạt) ⇒ diều không rơi ngay
khi người chơi chưa kịp tap.

### D. Cải thiện 2 — 10 điểm / chương
`POINTS_PER_CHAPTER = 10` (trước 15): 1 vòng = 9 × 10 = **90 điểm**, Diều Rồng = **360 điểm**.
Ô địa danh tự hiển thị `x/10`.

### E. Kiểm chứng (`tools/smash-test.html`, mỗi ca một Game mới)
```
PASS BUG1: cột PHÍA SAU không bị húc        (behindDestroyed=false)
PASS BUG1: cột PHÍA TRƯỚC bị húc            (frontDestroyed=true)
PASS BUG1: +1 điểm (không nổ cột sau)        (score=1)
PASS BUG1: diều tiến tới                     (dx=96)
PASS BUG1: không lùi / không hit-stop        (back=0, frames=0)
PASS KHÔNG có cột phía trước: vẫn lướt       (frames=30, score=0)
PASS chain: cả 2 cột phía trước bị phá       (c1=true c2=true, +2 điểm)
PASS chain: cuộn đều 3.4x
PASS BUG2: chọn Pháo Dây Chuyền KHÔNG tụt thanh gió (meter=100)
PASS BUG2: có cường hoá 2 cổng               (next=2)
PASS SAU SMASH: có nhịp đẩy tự động          (vy=-350, thrusting=true)
PASS POINTS_PER_CHAPTER = 10 · 9 điểm -> chương 1 · 10 điểm -> chương 2
ALL BUG FIXES PASSED
```
`tools/audit-runtime.html` → 27 render, `errors=0`.

---

## 32. Sửa triệt để "nổ cột phía sau" (thay cách sửa ở mục 31.A)

### A. Vì sao lần sửa trước chưa dứt
Lần trước chỉ so `pillar.x < rocket.x - 8`. Nhưng khi người chơi **vừa bay qua cổng**, cột đó vẫn
đang *chứa* diều: `x_cột ≈ 95`, `x_diều ≈ 100` ⇒ điều kiện `95 < 92` **sai** ⇒ cột vẫn bị húc.
Ngoài ra vòng lặp duyệt *mọi* cột trong mảng nên cột tự sinh / cột đang đi qua đều có thể lọt.

### B. Cách sửa đúng: chốt mục tiêu theo ĐỐI TƯỢNG ngay lúc kích hoạt
```js
const ahead = pillars.filter(p => !p.isDestroyed && p.x > rocket.x + rocket.radius)  // chỉ phía trước mũi
                     .sort((a, b) => a.x - b.x);
this.smashTargets = ahead.slice(0, this.smashPillarsLeft);   // chốt 1 hoặc 2 cột
```
- Trong suốt cú lướt chỉ duyệt `smashTargets` ⇒ **không một cột nào khác có thể bị nổ**, kể cả cột
  vừa bay qua, cột tự sinh, hay cột đang chứa diều.
- Mỗi mục tiêu chỉ vỡ khi tới mũi diều (`x_cột <= x_diều + radius + 12`), nên vụ nổ luôn ở **phía trước**.
- `smashTargets` được dọn ở `_endSmash()` và `_restart()`.

### C. Kiểm chứng quét 7 vị trí (`tools/smash-test.html`)
Với cột sau lưng đặt ở x = **40, 60, 80, 95, 100, 104, 110** (diều ở x ≈ 100) và cột phía trước ở x = 330:
```
PASS BUG1: KHÔNG cột sau lưng nào bị húc (7 vị trí) — hits=0 [40:o 60:o 80:o 95:o 100:o 104:o 110:o]
PASS BUG1: cột phía trước luôn bị húc            — miss=0
PASS BUG1: cột ĐANG CHỨA diều không bị húc       — insideDestroyed=false
PASS BUG1: cột kế tiếp vẫn bị húc
PASS chain: cả 2 cột phía trước bị phá · +2 điểm · cuộn đều 3.4x
PASS BUG2: chọn Pháo Dây Chuyền KHÔNG tụt thanh gió (meter=100)
PASS SAU SMASH: tự đẩy một nhịp (vy=-350)
PASS POINTS_PER_CHAPTER=10 · 9→chương 1 · 10→chương 2
```
`tools/audit-runtime.html` → 27 render, `errors=0`.

---

## 33. Quãng lướt Smash theo KHÔNG GIAN + sửa nhoè canvas

### A. Quãng lướt không còn "cứng"
Trước: `duration` tính từ vị trí cột lúc kích hoạt ⇒ quãng lướt cố định theo thời gian,
không khớp khi cột đã ở sát hoặc ở rất xa → lúc dừng ngay trong cột, lúc vượt quá xa.

Nay điều kiện kết thúc là **không gian, không phải thời gian**:
```js
behindRight = mép phải cột vừa phá (cập nhật mỗi frame)
aheadLeft   = mép trái cột còn sống gần nhất phía trước
midX        = (behindRight + aheadLeft) / 2      // chính giữa 2 cột
kết thúc khi rocket.x >= midX   (hoặc quá 1.6s để chống kẹt)
```
- Diều **luôn dừng ở khoảng giữa** cột vừa phá và cột kế ⇒ không bao giờ nằm trong cột nào,
  nên người chơi tap/nhảy lên ngay sau đó **không đâm vào trụ vừa lướt qua**.
- Nếu chưa có cột phía trước: dùng `behindRight + 320` làm mốc ⇒ vẫn có một đoạn lướt đã tay.
- Chain 2 cột: vòng lặp húc đủ 2 cột rồi mới xét `midX` (giữa cột thứ 2 và cột thứ 3) ⇒ liền mạch.
- Trong lúc lướt diều tự căn khe cổng (`smashAlignY`) nên không đâm trụ.

Đo (`tools/smash-midpoint.html`):
```
PASS A: cột trước bị phá · dừng SAU cột vừa phá
PASS B: cột gần bị phá · cột sau lưng KHÔNG bị phá
PASS B: dừng ở GIỮA cột vừa phá và cột kế (kiteX=200, giữa 100 và 298)
PASS C: chain phá 2 cột · +2 điểm · dừng trước cột thứ 3 (kiteX=200 < 320)
MIDPOINT TEST PASSED
```

### B. Vì sao chữ/hình trên canvas bị nhoè (còn nút DOM thì nét)
- Nút "Thách Đố / Lưu điểm / ô địa danh" là **DOM** → trình duyệt vẽ ở độ phân giải màn hình ⇒ nét.
- Chữ trong popup, con diều, cột, background là **canvas**. Sau khi thêm DPR, backing chỉ là
  `400×dpr`, trong khi CSS phóng canvas lên `713×1249` (scale 1.78) ⇒ **phóng to 1.78×** ⇒ nhoè toàn bộ.
- Sửa: backing = **kích thước hiển thị × DPR**, transform = `backing/400`.
  Đo ở cửa sổ 800×1400: `css=713×1249 → backing=713×1249`, transform 1.783 ⇒ **1:1, không phóng to**.
  Trên máy DPR 2: backing `1426×2498` ⇒ vẫn 1:1.
Đo (`tools/sharp-probe.html`):
```
PASS backing = css × dpr (713x1249)
PASS không bị phóng to (backing >= css)
PASS transform = backing/400 (1.783)
SHARP TEST PASSED
```
`tools/audit-runtime.html` → 27 render, `errors=0`.

---

## 34. Sửa lỗi cảnh bị lệch/nhoè (Ninh Bình thuyền trên núi, Hà Nội lệch)

### A. Nguyên nhân
Khi bật DPR, mình đặt transform nền cho canvas hiển thị (`backing/400`). Nhưng nhiều bộ vẽ cảnh
dùng **transform tuyệt đối** để vẽ theo hệ toạ độ tranh gốc:
- `scenicLandmarks.js`: `ctx.setTransform(view.s, …)` (Ninh Bình, Sa Pa) và
  `ctx.setTransform(1,0,0,1,0,0)` + `drawImage(scene.bg, 0, 0)` (Hà Nội, Huế, Đà Nẵng).
- `setTransform` **ghi đè** transform nền ⇒ các lớp vẽ ra với tỉ lệ 1:1 trong *backing pixels*.
- Backing lúc đó là `713×1249` (do CSS phóng) ⇒ lớp 400×700 chỉ phủ góc trên-trái ⇒
  **thuyền Ninh Bình nằm giữa trời, Hà Nội/Huế/Đà Nẵng lệch khung**.

### B. Cách sửa: vẽ vào buffer 400×700 rồi blit MỘT lần
```
Game.render():
  1) this.ctx = this.bctx (canvas đệm 400×700, transform = identity)
     → _renderScene() vẽ toàn bộ cảnh như cũ (mọi setTransform(1,…) vẫn đúng)
  2) this.ctx = canvas hiển thị (backing = css × dpr)
     → drawImage(buffer, 0, 0, canvas.width, canvas.height)
```
- Không phải sửa 30 chỗ `setTransform` trong 8.000 dòng vẽ cảnh.
- Canvas hiển thị vẫn **nét theo DPR** (blit 1:1 từ buffer, không phóng to).
- Chi phí: 1 lần blit toàn khung (GPU) — audit vẫn 16–27ms/frame.

### C. Kiểm chứng
- `tools/scenic-probe.html?tier=2`: view `s=0.483, offY=202.9`; thuyền ở **y ≈ 524–593** (đúng mặt sông).
- Trong game `preview_game.html?score=12` (Ninh Bình): thuyền **nằm trên sông**, HUD "NINH BÌNH".
- `tools/scenic-probe.html?tier=3` (Hà Nội): Tháp Rùa + cầu Long Biên đúng khung 400×700.
- `tools/tier-sheet.html`: 9 địa danh vẽ đúng hệ toạ độ.
- `tools/audit-runtime.html`: 27 render, `errors=0`.

### D. Lưu ý cho người chơi đã cài PWA
Service Worker cache bản cũ ⇒ cần **tăng version cache** (đã lên `dieu-say-gio-v2`);
lần mở đầu tiên sau cập nhật cần **hard refresh** (Ctrl/Cmd+Shift+R) một lần.

---

## 35. Tải trước (loading) + giảm lag trên điện thoại

### A. Vì sao cảnh vẫn "bể" sau bản trước
Bản sửa buffer **bị revert** (working tree quay về HEAD) nên lỗi quay lại:
các module cảnh gọi `ctx.setTransform(1,0,0,1,0,0)` ghi đè transform DPR → lớp 400×700 chỉ phủ
góc trên-trái của backing lớn ⇒ thuyền Ninh Bình trên trời, Hà Nội/Huế/Đà Nẵng lệch.
Đã áp lại **pipeline buffer** và lần này **commit** để không mất nữa.

### B. Lag trên điện thoại — nguyên nhân
1. **Vẽ cảnh ở độ phân giải backing**: trước đây cảnh 400×700 được vẽ trực tiếp vào canvas
   backing `css×DPR` (điện thoại 390×844 DPR 3 ⇒ ~1080×2340) ⇒ mỗi frame tô lại 2.5 triệu pixel
   cho các lớp tranh + gradient + shadow.
2. **Bake giữa lúc chơi**: `preWarmAll()` chạy rải trong lúc READY, nếu người chơi vào game ngay
   thì mỗi lần bake (~50–250ms) làm khựng đúng lúc đang bay.
3. **DPR 3** (một số máy) nhân chi phí lên ~2.25× so với DPR 2 mà mắt gần như không thấy khác.

### C. Đã sửa
| Việc | Trước | Sau |
|---|---|---|
| Vẽ cảnh | ở backing (1080×2340) | vào **buffer 400×700**, blit 1 lần |
| Bake cảnh | rải trong lúc chơi | **tải trước ở màn hình loading** |
| DPR | ≤ 3 | **≤ 2** (máy yếu ≤ 1.5) |
| Blit smoothing | `high` | `low` (rẻ hơn, mắt không phân biệt) |
| Màn hình chờ | không có | **"ĐANG TẢI…" + thanh tiến độ 1/9…9/9** |

### D. Đo (`tools/audit-runtime.html?dpr=2`)
- Render 27 khung (9 địa danh × 3 thời tiết), `errors=0`.
- Trung bình 12–25ms/khung; các tier nặng nhất (Hà Nội/HCM/Miền Tây) trong bản **trước** đạt
  63–70ms ở DPR 2 (do vẽ ở backing) — sau khi chuyển sang buffer + DPR cap, chi phí vẽ cảnh
  không còn phụ thuộc kích thước màn hình.
- Đo trên máy thật vẫn nên bật DevTools Performance; nếu còn giật, bước tiếp theo là bake
  vignette/glow thành lớp tĩnh (đã liệt kê trong backlog).

---

## 36. Giải quyết CẢ HAI: cảnh đúng vị trí VÀ nét

### A. Vì sao trước đây phải chọn một trong hai
| Cách | Vị trí | Độ nét |
|---|---|---|
| Vẽ trực tiếp ở backing + transform DPR | ❌ `setTransform(1,…)` ghi đè ⇒ cảnh lệch | ✅ nét |
| Vẽ vào buffer 400×700 rồi blit | ✅ đúng | ❌ phóng 400→800+ ⇒ mờ |

### B. Cách giải cả hai (đang dùng)
Tách **hai hệ toạ độ**:
1. **Scenic vẽ trong hệ PIXEL BACKING** (`scenic.resize(canvas.width, canvas.height)`, ctx identity):
   - Các lớp tranh được **bake đúng bằng kích thước backing** (713×1249, hoặc 800×1400 khi DPR 2)
     ⇒ không còn phóng ảnh ⇒ **nét**.
   - Các `setTransform` tuyệt đối trong 8.000 dòng vẽ cảnh **vẫn đúng** vì hệ này chính là backing.
2. **Game (diều, cột, HUD, thời tiết) vẫn ở hệ 400×700** với transform nền `backing/400`.

Thêm lớp bảo hiểm: mọi `setTransform` của scenic được **cộng dồn với transform nền**
(`_viewT`, `_resetView`, WeakMap theo từng canvas) — nếu sau này có ai đổi hệ toạ độ, cảnh vẫn không lệch.

### C. Load & hiệu năng
- Bake 9 địa danh **một lần** ở màn hình "ĐANG TẢI…" (tiến độ 1/9 → 9/9), ở đúng độ phân giải backing.
- Font Google **có timeout 1.5s**: mạng chậm/chặn font không làm kẹt màn hình tải.
- DPR ≤ 2 (máy yếu ≤ 1.5) để chi phí bake/vẽ không tăng vô ích.
- Không còn bake giữa lúc chơi; không còn blit toàn khung mỗi frame.

### D. Kiểm chứng
```
tools/sharp-probe.html:  css=713×1249  backing=713×1249  transform=1.783
                          -> PASS backing = css × dpr · PASS không phóng to
tools/scenic-probe.html?tier=3&dpr=2:  backing 800×1400, Tháp Rùa + cầu Long Biên đúng khung, nét
tools/scenic-probe.html?tier=2&dpr=2:  thuyền đúng mặt sông
preview_game.html?tier=3:              trong game Hà Nội đúng, HUD nét
```

---

## 37. Bố cục chuyên nghiệp cho MỌI tỉ lệ màn hình

### A. Vấn đề
Game có khung chơi 400×700 (dọc). Khi cửa sổ **rộng hơn** hoặc **thấp hơn** nhiều, khung bị lọt thỏm giữa
một vùng tối, UI (thanh công cụ, nút hành động) lại bám mép **cửa sổ** nên trông rời rạc.

### B. Giải pháp (3 lớp)
1. **Nền mờ "cinematic"**: một canvas `#scene-backdrop` phía sau, mỗi 3 frame vẽ lại chính khung game
   (cover-fit) ở 1/6 độ phân giải + `filter: blur(18px) saturate(1.25) brightness(0.82)`.
   → vùng trống hai bên trở thành "ánh xạ" của cảnh đang chơi, không còn khoảng đen.
2. **UI bám mép CANVAS** thay vì mép cửa sổ: `layoutOverlay()` đặt thanh công cụ ngay phải khung
   (hoặc sát trong mép phải nếu không đủ chỗ), nút "Thách Đố/Lưu điểm" canh giữa theo khung.
3. **Định cỡ bằng `visualViewport`** (không dùng `100vh`): canvas luôn vừa vùng nhìn thấy,
   xử lý đúng thanh địa chỉ co giãn trên mobile. Kèm **tự chữa**: mỗi 800ms so lại kích thước,
   lệch là `resize()` (xoay máy, zoom, thanh địa chỉ…).
   Bỏ `image-rendering: pixelated` (gây răng cưa khi đổi cỡ) và thêm viền/đổ bóng nhẹ cho khung.

### C. Đo thực tế
`?debug=1` in ra console:
```
DLG vv=744x1049 inner=744x1049 css=599x1049 scale=1.499 rect=599x1049
```
→ khung 599×1049 vừa đúng viewport 744×1049 (thừa 2 bên 72px mỗi phía do game dọc).

Ba tỉ lệ đã chụp: **1400×820** (rộng), **760×1200** (cao), **1200×560** (thấp) — xem
`docs/screenshots/layout-wide.png`, `layout-tall.png`, `layout-short.png`.

### D. Giữ nguyên 2 yêu cầu trước
- **Không bể cảnh**: scenic vẫn vẽ trong hệ pixel backing + transform cộng dồn (`_viewT`).
- **Không mờ**: canvas hiển thị = `css × DPR` (DPR ≤ 2, máy yếu ≤ 1.5), vẽ trực tiếp ở độ phân giải đó.

---

## 38. Chốt bố cục: sửa "lệch" tận gốc (thay mục 37)

### A. Vì sao vẫn lệch sau mục 37
File `game.js` bị **trộn hai kiến trúc**: phần `resize()` đã chuyển sang "vẽ trực tiếp ở backing",
nhưng `render()` vẫn còn **buffer 400×700** cũ. Kết quả: cảnh được vẽ với `scenic.resize(backing)`
nhưng lại ghi vào buffer 400×700 ⇒ **cắt và lệch**; HUD thì vẽ ở hệ backing ⇒ thẻ kết thúc lệch khỏi nền.
Ngoài ra **rung màn hình (shake)** chỉ áp cho HUD/entity, **không áp cho cảnh nền** ⇒ khi va chạm,
thẻ/nút bị đẩy lệch so với tranh.

### B. Đã dọn dứt điểm
1. **Bỏ hoàn toàn buffer** — chỉ còn một đường vẽ: canvas hiển thị, backing = `css × DPR`.
2. **Scenic vẽ ở hệ pixel backing**, `scenic.resize(canvas.width, canvas.height)`; transform cảnh
   dùng `setTransform` **cộng dồn** với nền (`_viewT/_resetView`, WeakMap).
3. **Shake gộp vào transform nền** cho **cả cảnh lẫn HUD/entity** ⇒ mọi thứ rung cùng nhau, không lệch.
4. **Kích thước theo `visualViewport`** + tự chữa mỗi 800ms (`fit()` so khung thực với khung đúng).
5. **Thanh công cụ responsive**: màn hình < 900px chỉ hiện icon để không đè khung chơi;
   `layoutOverlay()` luôn bám mép canvas (ngoài nếu đủ chỗ, sát trong nếu không).

### C. Đo thực tế (`?debug=1`)
```
DLG vv=1384x669 css=382x669  → 1400×820: css=468x820 scale=1.171
tall  760×1200: css=599x1049 scale=1.499
wide  1400×820: css=468x820  scale=1.171
short 1200×560: css=320x560  scale=0.800
```
Canvas luôn đúng tỉ lệ 4:7, căn giữa; phần thừa được **nền mờ** (blur 16px, brightness 1.05) lấp
bằng chính khung đang chơi.

### D. Ảnh
`docs/screenshots/layout-wide.png`, `layout-tall.png`, `layout-short.png`.

---

## 39. Bỏ nền mờ + tối ưu lại cho mobile (chốt)

### A. Bỏ "cinematic backdrop"
Theo phản hồi (rối mắt), đã **xoá** `#scene-backdrop` (HTML + CSS + blit mỗi frame).
Vùng ngoài khung quay lại nền tối giản `#0b1512` — gọn, tập trung vào khung chơi.

### B. Tối ưu cho điện thoại (không đánh đổi 2 yêu cầu cũ)
| Việc | Trước | Sau |
|---|---|---|
| Blit nền mờ mỗi frame | có (tốn 1 lần copy toàn khung) | **bỏ** |
| Độ phân giải backing | `css × DPR` (có thể tới 4× logic trên tablet) | **≤ 2× logic** (cap tuyệt đối) |
| Máy yếu | — | **DPR ≤ 1.5** (RAM ≤ 4GB hoặc ≤ 4 nhân) |
| Vẽ cảnh | trực tiếp ở backing (nét) | giữ nguyên — **một** đường vẽ duy nhất |

### C. Giữ nguyên 2 cam kết
- **Không bể cảnh**: scenic vẽ ở hệ pixel backing, `setTransform` cộng dồn với nền (`_viewT/_resetView`).
- **Không mờ label/HUD**: HUD/entity vẽ ở hệ 400×700 với transform nền `backing/400`, rasterize đúng độ phân giải hiển thị.

### D. Đo (`?debug=1`)
```
wide  1400×820 → css=468×820   scale=1.171  backing ≤ 936×1640 (cap 2×)
tall  760×1200 → css=599×1049  scale=1.499
short 1200×560 → css=320×560   scale=0.800
```
Render call (audit): steady **0.4–3 ms**; `errors=0`.

### E. Ghi chú
Bản "lớp cảnh riêng ≤1.5×" đã thử nhưng gây **seam** ở màn cao (cảnh không phủ hết canvas),
nên đã bỏ — ưu tiên đúng hiển thị hơn là tiết kiệm vài ms.

---

## 40. Vì sao mobile vẫn giật — và cách sửa

### A. Thủ phạm thật: bloom của thời tiết đọc lại pixel mỗi frame
`weather.drawSky()` khi có bloom:
1. `drawImage(ctx.canvas, …)` thu nhỏ **toàn bộ canvas** vào scratch,
2. **`getImageData()`** để đo độ sáng khung hình,
3. composite `multiply`/`lighter` phủ lại toàn canvas.

`getImageData` buộc GPU **đọc ngược về CPU** ⇒ stall pipeline; Chrome còn cảnh báo
*"Multiple readback operations using getImageData are faster with willReadFrequently"*.
Trên điện thoại đây là nguyên nhân giật chính, không phải cảnh nền.

### B. Đã sửa
| Việc | Trước | Sau |
|---|---|---|
| scratch canvas | 1/4, không cờ | **1/6 (1/8 máy yếu)** + `willReadFrequently: true` |
| `getImageData` | mỗi 12 frame | **mỗi 24 frame** |
| Cả khối bloom | mỗi frame | **mỗi 2 frame**; **máy yếu: tắt hẳn** |
| Hạt hiệu ứng | luôn đầy | máy yếu: **giảm 1/2** |
| shadowBlur HUD | luôn bật | máy yếu: **tắt** (chữ vẫn nét, chỉ bỏ quầng) |

### C. Tự điều chỉnh theo FPS thực (quan trọng nhất)
Trong `loop()` đo **EMA thời gian khung** (dt thật, nên phản ánh cả lúc GPU nghẽn):
- `> 19ms` (~dưới 52fps) → hạ 1 bậc; `< 15ms` → nâng lại 1 bậc.
| Bậc | DPR trần | Bloom | Khác |
|---|---|---|---|
| 0 | 2.0 | bật | — |
| 1 | 1.5 | **tắt** | — |
| 2 | 1.25 | tắt | tắt shadow HUD, giảm 1/2 hạt |

### D. Đo (`tools/perf-layers.html`, cùng canvas 199×349 css)
| Bậc | render | weather.sky | backing |
|---|---|---|---|
| 0 | 5.22 ms | 9.74 ms | 398×698 |
| 1 | **1.01 ms** | **0.05 ms** | 299×524 |
| 2 | **0.91 ms** | **0.06 ms** | 249×436 |

⇒ Máy yếu tự rơi về bậc 1–2 trong ~1.5 giây đầu, giật gần như biến mất.

### E. Không đánh đổi 2 cam kết
- **Không bể cảnh**: scenic vẫn vẽ ở hệ pixel backing, `setTransform` cộng dồn (`_viewT/_resetView`).
- **Không mờ label**: HUD/entity vẽ ở hệ 400×700 với `backing/400`; chỉ hạ DPR khi máy **không đủ FPS**
  (1.5× vẫn nét; 1.25× chỉ ở máy rất yếu, và tự nâng lại khi rảnh).

---

## 41. Sửa lỗi TREO khi bấm Space vào game

### A. Nguyên nhân
Khối "tự điều chỉnh chất lượng" được chèn **ngay đầu `loop()`**, nhưng lại dùng biến `dt`
trong khi `const dt = …` được khai báo **phía dưới**. JavaScript ném
`ReferenceError: Cannot access 'dt' before initialization` **ở mọi khung hình**, và vì đoạn này nằm
**ngoài `try/catch`** nên `loop()` chết ngay từ frame đầu ⇒ game đứng hình (nhấn Space chỉ đổi state
nhưng không có vòng lặp nào vẽ/ cập nhật).

### B. Sửa
- Chuyển khối tự điều chỉnh xuống **sau** dòng khai báo `dt`.
- (Đã có sẵn) `try/catch` + `requestAnimationFrame` đặt **cuối** loop để một lỗi bất ngờ không giết vòng lặp.

### C. Kiểm chứng
`tools/start-probe.html` (giả lập Space):
```
PASS vào game bằng Space — state=PLAYING
PASS vòng lặp vẫn chạy
PASS không có lỗi vòng lặp
START OK
```
Chạy thật với `?auto=1` (tự bấm Space sau 1.2s): diều bay, HUD cập nhật, console **không** còn lỗi.

### D. Ghi chú
Thêm cờ `?auto=1` (chỉ để test) và `?debug=1` (in số đo `DLG …`) — không ảnh hưởng người chơi thường.

---

## 42. Áp bản vá gameplay (theo audit) — đã sửa gì, giữ gì

### A. Đã sửa (đúng như audit)
| Nhóm | Nội dung |
|---|---|
| **P0 restart** | `_restart()` reset `ceilingHits/ceilingTimer`, `cellCombo(+Timer)`, `smashCooldown`, `smashTargets`, `lastSmashedPillar`, `holdProgress`, `_lastStampKey`, `invincibleTimer`, `pillars.tierBoost`; resize hoãn chạy ở đây |
| **P0 vệt nón** | `_drawSmashLance()` chuyển từ `update()` sang `render()` (ngay trước `drawRocket`) |
| **Smash** | Bỏ `smashTargets` tĩnh → đánh dấu `ignoredBySmash` cho cột sau lưng; húc **đủ số cột thật** kể cả cột mới sinh trong lúc lướt; `lastSmashedPillar` để tính `midX` (hết lỗi `.find()` lấy cột 1); `hitStopTimer = 0.045`; trần lao `targetX = min(220, start+110)`; bỏ `smashTimeout` NaN; `smashMaxDuration` 1.4/2.2s |
| **Tốc độ khi lướt** | `energyCells.update` và `ghosts.update` nhận `speed × speedMul`; `spawnTimer` cũng nhân `speedMul` |
| **Cột vòng 2+** | `effectiveTier` tính **trước** các nhánh độ khó; `reset()` xoá `tierBoost` |
| **Near-Miss** | Chỉ **gắn cờ** khi lướt sát, **thưởng sau khi vượt hẳn** cột; `bonus = 2 × nearMissMultiplier` (bùa Mắt Diều Tinh có tác dụng) |
| **Bùa** | Mọi lá bùa: 0.8s bất tử khi hết post-draft + `resetHold()`; Xuyên Gió `quantumMaxCooldown = 2.2s` |
| **Vó Hút Gió** | `magnetRange = 260` + chặn `dist > 0.001` (hết NaN) |
| **Điều khiển** | `HOLD_MS = 235`; phím `Shift`/`E` trên PC; bấm Quả Cầu **không còn** yêu cầu `score >= 10`; vòng nạp chỉ hiện sau 45% (hết nháy) |
| **Hiệu năng** | Bậc chất lượng chỉ đổi cờ nhẹ; `resize()` hoãn tới lúc READY/GAMEOVER (`_pendingPerfResize`); bỏ `setInterval` trong `startAutoFit` |
| **Combo hạt gió** | 3 hạt liên tiếp: **+8% năng lượng** (vẫn không cộng điểm) |

### B. Giữ nguyên (có lý do)
- **Chương tính theo ĐIỂM, 10 điểm/địa danh**: đây là lựa chọn trực tiếp của bạn ở các lượt trước
  (15 → 10 điểm), không phải sơ suất. Audit đề nghị quay lại "12 CỔNG" — mình **không tự đảo** quyết định đó.
  `gatesPassed` vẫn được đếm song song (dùng cho mốc bùa/thống kê), nên nếu muốn đổi sang gates-only
  thì chỉ cần sửa `_syncProgression()` gọi `getProgression(this.gatesPassed)` và đặt `POINTS_PER_CHAPTER = 12`.
- **Không bật lại nền mờ cinematic** (bạn đã yêu cầu bỏ).

### C. Kiểm chứng (`tools/regress-probe.html`)
```
PASS chạm trần 3 lần -> chết
PASS restart: ceilingHits = 0
PASS restart: bay bình thường, không chết
PASS smash: cột vỡ · +1 điểm · có hit-stop 45ms · đứng sau cột vừa phá
PASS chain: cả 2 cột bị phá · +2 điểm
PASS near-miss: chưa vượt -> chưa cộng điểm
PASS bùa: hết post-draft -> bất tử 0.8s
ALL REGRESSION CHECKS PASSED
```
`tools/start-probe.html` → START OK · Ánh gameplay: cảnh đúng, HUD nét.

### D. Ghi chú còn lại
- `POINTS_PER_CHAPTER` hiện 10 (theo lựa chọn của bạn). Nếu muốn nhịp thời tiết dài hơn (~22–25s/tỉnh),
  nâng lên 12 và chuyển sang đếm cổng như mục B.

---

## 43. Chốt 4 điểm cuối + chống nhàm khi livestream

### A. 4 điểm cuối của audit (đã vá)
| # | Vấn đề | Sửa |
|---|---|---|
| 1 | `gatesPassed` cộng mà không dùng | `_syncProgression()` gọi `getProgression(this.gatesPassed)`; chip dùng `gatesPassed % POINTS_PER_CHAPTER`; `pillars.update(..., gatesPassed, ...)`; `checkMilestone(gatesPassed)`; **`POINTS_PER_CHAPTER = 12`** |
| 2 | Bùa Mắt Diều Tinh hụt cổng thứ 3 | Trong `hasPassedCompletely`: **`onNearMiss` chạy TRƯỚC `onScore`** (vẫn chỉ thưởng sau khi vượt cột) |
| 3 | Cộng đúp `tierBoost` | Bỏ dòng `effectiveTier` thứ hai ở cuối `spawn()`; dùng `tier` đã cộng boost |
| 4 | Ba lỗi biên | Lưu `bestScore` khi húc vỡ bằng Smash; `resetHold()` trong `selectCard()`; `LaserPillarManager.reset()` xoá `tierBoost` |

### B. Chống nhàm khi livestream (3 thứ bạn nêu)
1. **Cùng địa danh nhưng khác ánh sáng theo vòng** — `LAP_MOODS` phủ lên tranh ngay sau khi vẽ cảnh:
   | Vòng | Sắc thái | Cách phủ |
   |---|---|---|
   | 1 | nguyên bản | — |
   | 2 | hoàng hôn ấm | `multiply #ffb45c @0.34` |
   | 3 | đêm xanh | `multiply #3b4f9e @0.55` |
   | 4 | sương ngọc | `screen #7fd8c4 @0.16` |
   | 5 | giông rồng | `multiply #a83226 @0.46` |
2. **Cổng tre đổi sắc theo vòng** — `LAP_GATE_ACCENTS` (đỏ son → cam nghệ → tím → vàng kim → đỏ rồng)
   áp cho đèn lồng + quả cầu trên cổng, nên khán giả nhìn là biết đang ở vòng mấy.
3. **Chuyển chương nhẹ như phim, không rung** — `hud.triggerChapterTransition()`:
   tối viền mờ dần 0.9s + **dải vàng quét** từ trên xuống, **không** dùng shake/flash của va chạm
   (trước đây `triggerSmashEffects()` làm người chơi tưởng chết).

### C. Kiểm chứng
```
tools/regress-probe.html
PASS chạm trần 3 lần -> chết · restart sạch · bay bình thường
PASS smash: +1 điểm · hit-stop 45ms · dừng sau cột
PASS chain: 2 cột · +2 điểm
PASS near-miss: chưa vượt -> chưa cộng điểm
PASS bùa: hết post-draft -> bất tử 0.8s
ALL REGRESSION CHECKS PASSED
```
Ảnh: `docs/screenshots/lap1.png` (V1 sáng), `lap2.png` (V2 hoàng hôn), `lap3.png` (V3 đêm xanh).

### D. Gợi ý thêm để livestream lâu dài (chưa làm)
- Mỗi vòng gán **weather preset ưu tiên** (V2 mưa, V3 sao, V5 giông) để cảnh đổi mạnh hơn nữa.
- Thêm **banner chương kiểu phim** (tên tỉnh + câu thơ) chỉ hiện 2s ở góc, không che đường bay.
- Chế độ "stream camera": zoom nhẹ theo diều + viền mờ (tùy chọn trong ⚙).

---

## 44. Banner chương kiểu phim + Stream camera

### A. Banner chương (2 giây, góc trên-trái)
- `hud.showChapterBanner(theme, lap, chapter)`: ghi tên tỉnh + phụ danh + **câu thơ** (lấy từ
  `editorialDesc`, cắt "TÊN — " ở đầu, giới hạn 33 ký tự + `…`, có đo bề rộng để không tràn khung).
- Vẽ ở **góc trên-trái** (y = 10), khung 198px, nền ink mờ + vạch vàng dọc.
- Fade in 0.25s / fade out 0.35s, tổng 2s; **không che đường bay** (kite bay giữa màn hình).
- Kích hoạt tự động khi đổi chương trong `_syncProgression()` (chỉ lúc `PLAYING`).

### B. Stream camera (tuỳ chọn trong ⚙)
- Công tắc **"Stream camera (zoom nhẹ theo diều)"** — lưu `localStorage['dieu_stream_cam']`.
- Khi bật: canvas được **CSS transform** `scale(1.08)` + dịch nhẹ theo vị trí diều
  (không vẽ lại, gần như miễn phí); tắt là trả `transform = ''`.
- Chỉ áp khi `state === 'PLAYING'`, nên READY/menu vẫn khung chuẩn.
- Tham số test: `?cam=1` (bật nhanh), `?banner=1` (hiện thử banner).

### C. Lỗi nghiêm trọng phát hiện kèm (đã sửa)
Khi bỏ `effectiveTier` trùng ở `spawn()`, còn sót `tier: effectiveTier` trong lúc tạo pillar ⇒
`ReferenceError` mỗi lần sinh cột ⇒ **cột không bao giờ xuất hiện** mà không báo gì rõ ràng.
Đã sửa thành `tier` và thêm kiểm thử "cột sinh ra sau 3s" vào `tools/regress-probe.html`.

### D. Kiểm chứng
```
PASS cột sinh ra sau 3s — n=2
PASS banner chương có dữ liệu — name=SA PA
ALL REGRESSION CHECKS PASSED
```
Ảnh: `docs/screenshots/chapter-banner.png`, `docs/screenshots/stream-camera.png`.

---

## 45. Gộp thông tin địa danh về một chỗ + cổng đổi theo vòng

### A. Chỉ còn MỘT ô thông tin địa danh (góc dưới-phải)
- Bỏ **banner canvas** ở góc trên-trái (và trigger trong `_syncProgression`).
- Ô `#landmark-chip` được **thiết kế lại theo kiểu banner**: vạch vàng-ngọc bên trái,
  dòng 1 = **tên tỉnh** (14px, đậm), dòng 2 = **phụ danh** (9px, vàng), dòng 3 = **câu thơ** (9px nghiêng, cắt `…`).
- Vẫn **bấm vào để mở popup** chi tiết địa danh như trước (handler cũ giữ nguyên), vẫn có
  hiệu ứng `is-new` và tự mờ khi diều bay vào góc.

### B. Số cổng trong chương → cạnh điểm
- Bỏ khỏi ô địa danh; HUD vẽ **`x/12` nhỏ** ngay bên phải điểm số (11px, vàng).
- Dữ liệu do game truyền qua `options.gatesInChapter` / `gatesPerChapter`.

### C. Cổng tre đổi theo vòng (không còn giống hệt nhau)
| Vòng | Lồng đèn | Tua | Dải vàng | Quầng sáng |
|---|---|---|---|---|
| 1 | đỏ son | 1 | — | đỏ |
| 2 | cam nghệ | 2 | — | cam |
| 3 | tím | 2 | ✓ | tím |
| 4 | vàng kim | 3 | ✓ | vàng |
| 5 | đỏ rồng | 4 | ✓ | đỏ |

### D. "Near limit" không còn đổi màu theo địa danh
Trước đây quầng sáng cổng lấy `theme.laserGlow` (mỗi tỉnh một màu) ⇒ tín hiệu nguy hiểm bị nhiễu.
Nay quầng lấy **`lapStyle.glow`** theo bảng vòng, còn chữ **Near-Miss** giữ màu ngọc cố định
`#2fb894` — tín hiệu cảnh báo luôn nhất quán.

### E. Kiểm chứng
```
ALL REGRESSION CHECKS PASSED   (cột sinh ra · smash · chain · near-miss · bùa · restart)
```
Ảnh: `docs/screenshots/chip-banner.png` (ô địa danh mới), `docs/screenshots/gate-lap3.png` (cổng tím + dải vàng).

---

## 46. Dây diều + 10 điểm/chương + caption địa danh kiểu phim

### A. Dây diều (kite string)
`drawKiteString(ctx, rocket, time, isSmash, w, h)` trong `renderer.js`:
- Neo ở **góc dưới-trái ngoài màn hình** (người thả đứng dưới đất), nối vào **đuôi diều**.
- Vẽ **bezier 2 lớp**: bóng tối (dễ thấy trên nền sáng) + sợi sáng mảnh.
- **Võng 96px** khi bay thường (trọng lực), **34px + rung** khi Lộng Gió (dây căng).
- Thêm **đoạn nối vàng** ở đuôi + nút buộc nhỏ → cảm giác dây thật, không "lơ lửng".
- Vẽ **trước** diều (sau cảnh/cột/hạt) nên luôn nằm dưới diều, trên nền.

### B. 10 điểm/chương
`POINTS_PER_CHAPTER = 10` (number 10 in HUD `x/10`, chip bỏ thanh tiến trình).

### C. Ô địa danh: caption phim, không nền
- Bỏ nền/border/shadow/backdrop — chỉ còn **vạch nhấn dọc** (vàng→ngọc) + 3 dòng chữ.
- Tên tỉnh `rgba(243,234,214,.92)`, phụ danh vàng `.82`, câu thơ nghiêng `.6`, có `text-shadow`
  nhẹ để đọc được trên nền sáng/tối; vẫn **bấm để mở popup**.
- Vẫn ở **góc dưới-phải**, tự mờ khi diều bay vào góc.

### D. Kiểm chứng
- Ảnh: `docs/screenshots/kite-string.png`, `docs/screenshots/caption-chip.png`.
- `ALL REGRESSION CHECKS PASSED` (cột · smash · chain · near-miss · bùa · restart).

---

## 47. Cột/gió đổi mạnh theo vòng · near-miss đổi theo địa danh · đêm hết nhấp nháy · đuôi diều dài dần

### A. Cột tre: đổi hẳn CHẤT LIỆU theo vòng (không chỉ đổi đèn)
| Vòng | Chất liệu cột | Lá | Đèn | Tua | Dải vàng |
|---|---|---|---|---|---|
| 1 | tre xanh | xanh | đỏ son | 1 | — |
| 2 | tre mật (vàng nâu) | vàng | cam nghệ | 2 | — |
| 3 | trúc tím | tím | tím | 2 | ✓ |
| 4 | trúc kim (vàng kim) | vàng kim | vàng kim | 3 | ✓ |
| 5 | trúc rồng (đỏ nâu) | đỏ | đỏ rồng | 4 | ✓ |

### B. Gió giữa cột: đổi tông + mật độ mạnh hơn
| Vòng | Màu gió | Độ đậm | Số vệt |
|---|---|---|---|
| 1 | trắng ngọc `#d6fff6` | 0.055 | 3 |
| 2 | mật ong `#ffe6b0` | 0.085 | 4 |
| 3 | tím `#e2c6ff` | 0.105 | 5 |
| 4 | kim quang `#ffeeb0` | 0.125 | 6 |
| 5 | gió lửa `#ffb49a` | 0.150 | 8 |

### C. Near-miss đổi màu theo ĐỊA DANH
`hud.showNearMiss(bonus, color)`; game truyền `theme.nearMissColor || theme.laserColor`.
Mỗi tỉnh có tông cảnh báo riêng nhưng vẫn đậm, đọc rõ.

### D. Ban đêm hết "giật" ánh sáng
Nguyên nhân: bloom chỉ **composite ở frame chẵn** (frame lẻ bỏ) ⇒ quầng sáng bật/tắt 30Hz, rõ nhất khi trời tối.
Sửa: vẫn chụp khung mỗi 2 frame nhưng **giữ bản đã chụp và composite MỌI frame** (`_glowReady`)
⇒ sáng đều, không nhấp nháy, vẫn tiết kiệm ~50% chi phí readback.

### E. Đuôi diều dài & đẹp dần theo vòng
- Chiều dài gốc: 30 → 46 → 62 → 78 → 96 px; số dải tăng tới 6.
- Từ vòng 2: thêm **hạt cườm** trên đuôi; từ vòng 3: thêm **ruy băng dài** phía sau (2 dải từ vòng 4).
- Biên độ lượn tăng theo vòng ⇒ nhìn "bay" hơn, đúng cảm giác diều lớn dần.

### F. Kiểm chứng
`ALL REGRESSION CHECKS PASSED`. Ảnh: `docs/screenshots/lap1-gate.png`, `docs/screenshots/lap4-gate.png`.

---

## 48. Meta-progression (Hũ Gió) + màu vòng 2 + chốt 4 điểm của chuyên gia

### A. Meta-progression: đã có những gì
| Hạng mục | Trạng thái |
|---|---|
| Sổ tay bưu thiếp (📮, 9×6 tem) | **đã có từ trước** |
| Hũ Gió (tiền tệ tích luỹ) | **mới** — `src/core/meta.js` |
| Nâng cấp vĩnh viễn | **mới** — 3 mục trong 🏺 |
| Mở khoá bùa | **mới** — 3 bùa khoá sau Hũ Gió |

**Kiếm gió**: cuối mỗi ván `⌊cổng/4⌋` gió (chết là cộng), cộng thêm theo tem mới.
**Nâng cấp** (`localStorage['dieu_meta_v1']`):
| Nâng cấp | Tác dụng | Giá | Cấp |
|---|---|---|---|
| Khởi đầu đầy gió | +15% năng lượng đầu ván / cấp | 8 → +60% | 4 |
| Vó gió rộng | +70px tầm hút hạt / cấp | 12 | 2 |
| Combo hạt gió | combo 3 hạt +4% / cấp | 10 | 2 |

**Mở khoá bùa**: Lá Sen / Bọt Rượu Cần / Mắt Diều Tinh mở sẵn; **Xuyên Gió 14**, **Vó Hút Gió 12**,
**Pháo Dây Chuyền 16**. Bảng rút bùa chỉ ra bùa đã mở (`perks.js` lọc bằng `isPerkUnlocked`).

### B. Vòng 2 đổi màu (hết trùng vàng với vòng 4)
V2 từ "tre mật" (vàng nâu) → **trúc ngọc lam** `#8fe0c8 / #4fa891 / #2f6f5e`, lá `#6fc9ae`.
Bảng chất liệu: V1 tre xanh · **V2 ngọc lam** · V3 trúc tím · V4 trúc kim · V5 trúc rồng.

### C. 4 điểm chuyên gia (đã áp)
1. Bỏ `invincibleTimer = smashMaxDuration + 0.2` khi kích Lộng Gió ⇒ hết dư ~1.6s bất tử, `_endSmash()` cấp đúng 0.7s.
2. `_onNearMiss()` bỏ `ghosts.spawnForPillar()` + `_syncProgression()` (onScore ngay sau đã làm) ⇒ không đúp xác diều.
3. `quantumTimer 1.8 → 1.2s` (trên hồi 2.2s) ⇒ Xuyên Gió cần canh nhịp, không còn 82% bất tử.
4. `LAP_MOODS` phủ **overscan −30/+60** ⇒ không hở viền khi rung màn hình.

**Giữ nguyên 10 điểm/chương** (yêu cầu trực tiếp của bạn). Để tránh trùng nhịp Bùa ↔ đổi tỉnh:
`milestoneInterval 12 → 10`, mốc đầu **5** (5, 15, 25, …) ⇒ không bao giờ trùng 10, 20, 30.

### D. Tinh chỉnh khác
- `streamCam` zoom **1.05** + dịch ±3px (trước 1.08/4.8px) ⇒ không cắt lẹm HUD.
- `_restart()` gọi `setLandmark(..., false, 0, POINTS_PER_CHAPTER)` đủ tham số.
- Gió giữa cột + chất liệu cột vẫn đổi mạnh theo vòng (mục 47).

### E. Kiểm chứng
`ALL REGRESSION CHECKS PASSED`; ảnh `docs/screenshots/windjar.png`, `docs/screenshots/lap2-teal.png`.

---

## 49. Vá 3 lỗi P1 sau khi tích hợp Hũ Gió

### A. P1 — nâng cấp không áp ở ván đầu
`_applyMetaUpgrades()` được tách riêng và gọi ở **cuối `constructor()`** (sau khi mọi field đã khởi tạo),
`_restart()`, và **ngay sau khi mua** trong Hũ Gió. Trước đây gọi sớm ở đầu constructor nên
`this.drunkMeter = 0` (dòng sau) ghi đè mất phần năng lượng khởi đầu.

### B. P1 — perks.js lệch mốc + mô tả + chưa lọc
- `lastMilestoneScore`: constructor và `reset()` đều **−6** (mốc 6, 18, 30…), `milestoneInterval = 12`.
- Mô tả Xuyên Gió: `1.8s` → **`1.2s`** (cả VI và EN) khớp code.
- `triggerDraft()` giờ lọc `isPerkUnlocked(meta, p.id)`; nếu chưa đủ 3 lá thì fallback toàn bộ danh mục.

### C. P1 — nhịp chương & bùa
`POINTS_PER_CHAPTER = 12`, `milestoneInterval = 12`, mốc đầu 6 ⇒ **lệch pha vĩnh viễn**
(chương 12, 24, 36… · bùa 6, 18, 30…), mỗi tỉnh ~22–24 giây, không còn dừng chọn bùa dày.

### D. P2 — hút gió thụ động + dọn code
- `energyCell.update`: khi **không** có bùa Vó Hút Gió mà có nâng cấp, vẫn hút trong bán kính
  `magnetBonus` (70/140px) với lực yếu (260·(1−d/r)+90); có bùa thì cộng dồn `260 + magnetBonus`.
- `_restart()` truyền đủ 6 tham số cho `infoPanels.setLandmark()`.
- Xoá code chết `destroyFrontPillar()` / `destroyFrontPillars()` trong `laserPillar.js`.

### E. Kiểm chứng (`tools/regress-probe.html`)
```
PASS nâng cấp Hũ Gió áp ngay ván đầu — meter=15 magnet=70
PASS mốc mở bùa đầu = 6
PASS restart sạch · smash +1/hit-stop · chain 2 cột · near-miss sau khi vượt · bùa 0.8s
ALL REGRESSION CHECKS PASSED
```

---

## 50. Chốt: 10 cổng/chương + thời gian chọn bùa giảm dần theo vòng

### A. 10 cổng/chương (quyết định cuối)
`POINTS_PER_CHAPTER = 10`. Số cổng để mở bùa **độc lập** với chương:
`milestoneInterval = 12`, `lastMilestoneScore = -7` ⇒ mốc bùa **5, 17, 29, 41, 53…**
(tất cả ≡ 5 hoặc 7 mod 10 ⇒ **không bao giờ** trùng bội số 10 = đổi chương).

| Cổng | 5 | 10 | 17 | 20 | 29 | 30 | 41 | 50 |
|---|---|---|---|---|---|---|---|---|
| Sự kiện | 🎴 bùa | 🏞 đổi tỉnh | 🎴 | 🏞 | 🎴 | 🏞 | 🎴 | 🏞 |

### B. Thời gian chọn bùa theo vòng
| Vòng | Giới hạn | Lý do |
|---|---|---|
| **1** | **không giới hạn** | Người mới đọc 3 thẻ, hiểu Lộng Gió/bùa; không bị ép bấm |
| **2** | **6.0s** | Bắt đầu có sức ép nhưng vẫn rộng (~2s/thẻ) |
| **3** | 4.5s | Đã quen, cần quyết nhanh hơn |
| **4** | 3.5s | Trung bình cho người khá |
| **5+** | 2.5s | Sàn cho rage-game: ~0.8s/thẻ, không phá nhịp |

**Cân đối:** đọc 3 thẻ cần tối thiểu ~1.6–2s; sàn 2.5s đủ đọc tên + biểu tượng, còn 6s ở V2 là
"cầu nối" giữa tự do và sức ép. Hai pha chờ (trước 0.45s, sau 0.7s) giữ nguyên.
Hết giờ tự chọn **lá 1** (đã ghi rõ trên thẻ "1, 2, 3").

### C. UI
- Vòng 1: dòng chữ **"Bao nhiêu thời gian cũng được"** (xanh), không đếm ngược, không tự chọn.
- Vòng 2+: đếm ngược; **≤1.2s chuyển đỏ** để báo sắp hết giờ.

### D. Kiểm chứng
```
PASS 10 cổng/chương
PASS POINTS_PER_CHAPTER = 10
PASS bùa V1 không giới hạn
PASS bùa V1: chờ 30s vẫn không tự chọn
PASS bùa V2 = 6s · quá 6s tự chọn
PASS bùa V5 = 2.5s
PASS mốc mở bùa đầu = 5
ALL REGRESSION CHECKS PASSED
```
