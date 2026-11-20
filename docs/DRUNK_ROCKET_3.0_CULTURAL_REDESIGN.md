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









