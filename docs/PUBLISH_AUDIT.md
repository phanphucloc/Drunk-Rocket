# BÁO CÁO KIỂM TRA & ĐÁNH GIÁ PHÁT HÀNH — DIỀU SAY GIÓ (v3.0)

> Thời điểm audit: sau khi hoàn tất 3.0 + nhịp độ + âm thanh + pause.
> Cách làm: audit tĩnh toàn bộ 24 module, audit runtime (render 9 địa danh × 3 thời tiết),
> đo hiệu năng từng cảnh, kiểm thử âm thanh bằng render offline, kiểm thử pause, kiểm tra layout.

---

## 1. KẾT QUẢ AUDIT KỸ THUẬT

| Hạng mục | Kết quả | Ghi chú |
|---|---|---|
| Import toàn bộ module | ✅ 23/23 | không lỗi cú pháp |
| Render 9 địa danh × 3 thời tiết (nắng / đêm / mưa) | ✅ 27/27 | `errors=0` |
| Thẻ chương, chọn bùa, Game Over, popup địa danh | ✅ | render OK |
| i18n | ✅ VI/EN đủ | trừ 1 khoá động `kite.N` (đúng thiết kế) |
| Dữ liệu 9 vùng | ✅ | đủ story/facts/wind/music/weatherStage |
| Bộ nhớ | ✅ 7 MB heap | không rò rỉ sau hàng trăm frame |
| Âm thanh | ✅ đo bằng render offline | nhạc peak 0.57 · SFX 0.64 |
| Pause khi mở popup | ✅ | 120 frame đứng yên, resume chạy tiếp |
| **Canvas vừa màn hình** | ❌→✅ | **đã sửa trong audit này** (trước đó canvas 400×700 không scale → tràn trên điện thoại hẹp) |
| Hiệu năng khung hình (software raster) | ⚠️ 10–18 ms | GPU thật tốt hơn nhiều; riêng **Đà Lạt frame đầu 178 ms** |
| Chuyển cảnh | ⚠️ frame tệ nhất 74 ms | lần đầu vẽ mỗi địa danh; đã che bằng màn mực |
| Meta / PWA / icon | ❌→✅ | **đã bổ sung** (description, OG, manifest, icon) |

---

## 2. ĐÃ SỬA NGAY TRONG LẦN AUDIT

1. **Canvas không scale theo màn hình** (publish-blocker): `resize()` chỉ tính `scale` mà không áp CSS → điện thoại 360 px bị cắt 2 bên. Đã áp `style.width/height`.
2. **Bộ meta phát hành**: description, `theme-color`, Open Graph/Twitter card, `<link rel="manifest">`, icon SVG 128px, `manifest.webmanifest` (portrait, standalone).

---

## 3. MỨC ĐỘ SẴN SÀNG PHÁT HÀNH

| Kênh | Trạng thái | Việc còn thiếu |
|---|---|---|
| **Link web chơi ngay** (Cloudflare Pages/Netlify/GitHub Pages) | 🟡 **Gần được** — sau 3 việc P0 bên dưới | dọn mã chết, cấu hình backend, thêm hướng dẫn chơi lần đầu |
| **PWA cài được + offline** | 🟡 | cần service worker cache app shell (~1–2 h) |
| **Google Play / App Store** | 🔴 | cần wrapper (Capacitor), icon/screenshot bộ store, privacy policy, tài khoản dev ($25 / $99) |
| **itch.io / web game portals** | 🟢 Sẵn sàng nhất | chỉ cần zip + ảnh cover |

**Kết luận: chưa nên gọi là "publish chính thức", nhưng hoàn toàn có thể đưa link beta công khai sau 1 buổi làm P0.**

---

## 4. VIỆC PHẢI LÀM (theo ưu tiên)

### P0 — chặn phát hành (≈ 1 buổi)
1. ✅ Canvas fit màn hình *(đã xong)*.
2. ✅ Meta + manifest + icon *(đã xong)*.
3. **Dọn mã chết**: `storyOverlay.showChapter/showEnding` không còn dùng, cờ `dragonCelebrated`, `introShown`, ~12 khoá i18n thừa, `console.log` khi khởi động.
4. **Backend bảng điểm đang hard-code** `drunk-rocket-backend.ppldhsp.workers.dev` (2 chỗ). Phải đổi sang worker của bạn hoặc ẩn bảng điểm khi chưa có.
5. **Hướng dẫn chơi lần đầu**: 3 bước (chạm để bay · chạm đúp để Lộng Gió · chọn bùa), chỉ hiện 1 lần.
6. **Pause khi ẩn tab** (`visibilitychange`) để không chết oan khi chuyển app.

### P1 — chất lượng cảm nhận (≈ 2–3 ngày)
7. **Đà Lạt: frame đầu 178 ms** → tách dựng cache hoặc dựng trước trong lúc màn READY (máy yếu sẽ thấy khựng ~0.4 s).
8. **Render theo devicePixelRatio** (tối đa 2×): chữ HUD hiện hơi mờ trên điện thoại retina.
9. **Bundle + minify** (esbuild): 575 KB / 24 file → ~60 KB gzip, 1 request; thêm cache header.
10. **Service worker** (offline + cài PWA).
11. **Không tự mở bảng điểm mỗi lần chết** — chỉ mở khi lập kỷ lục hoặc khi bấm TOP.
12. **Cân bằng lại âm lượng** sau khi nghe thật (music 0.7 → có thể 0.5), thêm limiter chống vỡ tiếng.
13. **Giảm chuyển động** (tuỳ chọn cho người nhạy cảm): tắt rung màn hình / sét chớp mạnh.

### P2 — tăng giữ chân & lan truyền (≈ 1 tuần)
14. **Bộ sưu tập**: 9 con dấu vùng miền + 5 skin diều (đã có 5 cấp — chỉ cần màn "Bộ sưu tập").
15. **Thử thách hằng ngày**: cùng seed, cùng bùa → so điểm bạn bè.
16. **Ảnh chia sẻ** (snapshot canvas + khung "postcard" + QR) thay vì chỉ text.
17. **Thêm ngôn ngữ**: Nhật/Hàn/Trung/Pháp/Tây Ban Nha (khung i18n đã sẵn, mỗi ngôn ngữ ~1 ngày dịch).
18. **Analytics** (Plausible/Umami): đo D1, số ván, tỉ lệ chia sẻ.

---

## 5. ĐÁNH GIÁ KHẢ NĂNG ĐÓN NHẬN THỊ TRƯỜNG

### Định vị
**"Arcade postcard văn hoá"**: một game chạm-một-nút 2–4 phút/ván, khoác lớp tranh vẽ tay 9 vùng miền Việt Nam, song ngữ, có cốt truyện nhỏ (diều say → hoá rồng).

### Điểm mạnh (thật sự khác biệt)
- **Nhận diện hình ảnh mạnh**: 9 bức tranh thủ công (karst Tràng An, Hồ Gươm, Cầu Rồng, phố đèn lồng, chợ nổi) — hiếm game casual nào có.
- **Văn hoá có chiều sâu**: mỗi vùng có câu chuyện + 3 facts + ngọn gió riêng + bộ nhạc riêng → nội dung cho mạng xã hội.
- **Song ngữ Việt–Anh** → phục vụ cả người Việt lẫn khách quốc tế (điểm rất ít game Việt làm).
- **Không cần tải, mở link là chơi** → lan truyền cực nhanh, hợp TikTok/Facebook.
- **Vòng đời 5 vòng + nâng cấp diều** tạo cảm giác tiến bộ (hơn hẳn Flappy clone thuần).

### Điểm yếu (rủi ro thật)
- **Lõi gameplay vẫn là Flappy Bird 2013**: người chơi casual quen thuộc nhưng cũng nhanh chán; thiếu "meta" (mở khoá, nhiệm vụ, sưu tầm).
- **Chưa có lý do quay lại ngày mai**: không daily challenge, không streak, không huy hiệu.
- **Bảng điểm dựa backend demo** → nếu chết server, tính năng "đua bạn bè" mất.
- **Độ khó phẳng sau vòng 5** (1.36 s/cổng) — người giỏi sẽ hết mục tiêu.
- **Không có hướng dẫn**: "chạm đúp để Lộng Gió" và "bùa" phải tự mò.
- **Chưa có ảnh chia sẻ** — thứ quyết định viral của game casual.
- **Chưa offline/PWA**, chưa có bản app store.

### So sánh thị trường
| Nhóm | Ví dụ | Bài học |
|---|---|---|
| Flappy-like cổ điển | Flappy Bird, Crossy Road | Crossy Road thắng nhờ **nhân vật sưu tầm + skin** → game mình đã có 5 cấp diều, nên mở thành bộ sưu tập |
| Casual nghệ thuật | Alto's Odyssey, Monument Valley | Tranh đẹp + nhạc hay bán được cảm xúc; mình có lợi thế văn hoá bản địa |
| Game văn hoá Việt | (rất ít) | Khoảng trống thị trường: **chưa có game casual nào "khoe" 9 vùng miền theo cách này** |

### Ước lượng đón nhận (thận trọng)
- **Người Việt trong nước**: dễ viral cảm xúc (hoài niệm, tự hào) — tiềm năng **vài chục nghìn lượt chơi** nếu có 2–3 video TikTok tốt; tỉ lệ giữ chân D1 ước **15–20%** khi chưa có meta, **25–35%** nếu thêm bộ sưu tập + daily.
- **Khách quốc tế**: ngách nhỏ nhưng bền (nhóm thích "travel/culture games"); cần thêm 3–5 ngôn ngữ mới đáng kể.
- **Đua top**: chỉ có ý nghĩa khi bảng điểm thật + bạn bè, nếu không thì chỉ là "high score cá nhân".

---

## 6. ĐỀ XUẤT THỨ TỰ LÀM TIẾP

1. **Buổi 1**: P0 (dọn mã chết, backend riêng, hướng dẫn chơi, pause khi ẩn tab) → đưa link beta.
2. **Buổi 2**: P1.7–P1.11 (Đà Lạt preload, DPR, bundle, service worker) → PWA cài được, mượt trên máy yếu.
3. **Tuần tiếp**: P2.14–P2.16 (Bộ sưu tập 9 dấu + 5 skin, daily challenge, ảnh postcard chia sẻ) → đây là 3 thứ tăng giữ chân/viral mạnh nhất.
4. **Khi có 2–3 nghìn người chơi**: mới cân nhắc app store + kiếm tiền (skin/ads nhẹ).
