# KẾ HOẠCH NÂNG CẤP GAMEPLAY: DRUNK ROCKET 2.0 (OVERDRIVE & ROGUELITE)
**Dự án:** Drunk Rocket (Tàu Say Rượu)  
**Vai trò:** Game Lead & Producer  
**Thư mục dự án:** `D:\project\game\Drunk-Rocket`  
**Phiên bản:** v2.1.0 Roadmap - Cập nhật thông số Smash 5 điểm & Cyber Energy Orb  
**Trạng thái:** ĐÃ CẬP NHẬT THEO CHỈ ĐẠO MỚI NHẤT -> DEPLOY PRODUCTION  

---

## 1. ĐÁNH GIÁ & ĐỒNG THUẬN TỪ GAME LEAD
Bản đề xuất **Drunk Rocket 2.0: Overdrive & Roguelite Edition** đã giải quyết triệt để bài toán:
* Thoát khỏi cái bóng "nhàm chán / lặp lại" của Flappy Bird cổ điển.
* Giữ nguyên tính tối giản One-Tap (thêm Double-Tap trực quan) nhưng tạo ra chiều sâu chiến thuật và giải tỏa ức chế cực tốt thông qua **The Triple Synergy Loop**:
  `Bay mạo hiểm (Near-Miss) ➔ Đầy nộ phá cột (Supernova Smash) ➔ Chọn thẻ bài (Micro-Roguelite Draft)`.
* Tính năng xã hội **Bia mộ bạn bè (Ghost Wreckages)** tận dụng hoàn hảo hệ thống Cloudflare D1 để tạo độ cạnh tranh viral tự nhiên.

---

## 2. QUY CHUẨN THIẾT KẾ CƠ CHẾ & GIAO DIỆN (SPECIFICATIONS v2.1.0)

### 2.1. Cơ chế Overdrive & Mốc Smash 5 Điểm (Smash Threshold & Siphon VFX)
* **Tỷ lệ nạp năng lượng chuẩn:**
  * **Vượt cột thường (+20% Nộ / cột):** Người chơi vượt qua **5 cột (5 điểm)** là nạp đầy 100% Quả cầu Năng lượng Overdrive, cho phép kích hoạt ngay Supernova Smash đầu tiên.
  * **Cú lượn sát Near-Miss (+50% Nộ / lần):** Thưởng cực lớn cho kỹ năng né hiểm, chỉ cần 2 cú Near-Miss là đầy bình Smash.
* **Hiệu ứng Siphon Plasma Stream (VFX):**
  * Khi ghi điểm hoặc Near-Miss, một chùm hạt plasma năng lượng cao (Cyber Cyan & Gold) phóng thẳng từ tâm chướng ngại vật bị vượt qua và xoáy hút vào Quả cầu Overdrive trên đỉnh HUD.

### 2.2. Giao diện Quả Cầu Năng Lượng (Spherical Cyber Energy Orb)
* **Tạo hình & Hiệu ứng chất lỏng:**
  * Thay thế thanh bar ngang truyền thống bằng một **Cyber Energy Orb (Hình cầu)** bán kính 21px đặt tại vị trí trung tâm dưới điểm số.
  * Bên trong quả cầu chứa chất lỏng plasma chuyển động dập dềnh theo hàm sóng sin (`sin(time * 9)`), sủi bọt khí vi mô và có vệt phản quang kính Specular Reflection.
* **Trạng thái đầy 100% (Explosive Full Aura):**
  * Hào quang nộ bùng nổ đa lớp (Gold & Cyan) dao động mãnh liệt.
  * Các tia sét hồ quang điện (`lightning arcs`) xoay tròn xung quanh thành cầu.
  * Dòng chữ cảnh báo phát sáng nhấp nháy: `⚡ DOUBLE TAP: SMASH READY! ⚡`.

### 2.3. Thẻ bài Quantum Drift (Tàng hình & Phasing an toàn tuyệt đối)
* **Thời lượng:** Kéo dài lên **0.85 giây** sau mỗi cú tap (đủ thời gian vượt qua trọn vẹn bề dày cột laser và đuôi tên lửa).
* **Hiệu ứng thị giác Ghost Shader:**
  * Thân tàu chuyển sang trạng thái bán trong suốt (`globalAlpha = 0.38`).
  * Tách bóng ma màu sắc quang sai (`Chromatic Aberration Glitch`) màu Cyan/Magenta hai bên sườn tàu.
* **Cơ chế Phasing:** Cột laser khi bị tàu lướt xuyên sẽ tự động đánh dấu `quantumPhased = true`, đảm bảo người chơi không bao giờ bị kẹt chết tức tưởi khi hiệu ứng vừa hết.

### 2.4. Thẻ bài Chain Reaction (Húc nổ 2 cột liên tiếp)
* Khi kích hoạt Double Tap trong lúc có perk Chain Reaction:
  * Smash lập tức phá hủy **2 cột liên tiếp** phía trước tàu.
  * Hệ thống tiếp tục kiểm tra va chạm trong suốt 0.85s lao vọt để đảm bảo luôn húc tan tành đủ 2 chướng ngại vật liên tiếp, tạo cảm giác đắc thắng tột đỉnh.

### 2.5. Chống kẹt phím & rò rỉ cú chạm khi chọn Perk (Input Isolation)
* Khi bấm chọn thẻ bài (1, 2, 3 hoặc click cảm ứng):
  * Cú tap được cô lập, tiêu thụ (`consumeTap`) và kích hoạt bộ đếm thời gian cách ly `perkDraftCooldown = 0.25s`.
  * Loại bỏ hoàn toàn lỗi rò rỉ lực đẩy khiến tàu bị phóng giật lên trần nhà sau khi kết thúc Bullet-Time.

---

## 3. TIÊU CHUẨN TỐI ƯU VÀ CAM KẾT HIỆU NĂNG
* Duy trì tổng bundle game (HTML + JS + CSS) < **70 KB**.
* Hoàn toàn sử dụng Canvas 2D procedurally và Web Audio API (0 byte external assets).
* 60 FPS ổn định trên thiết bị di động phổ thông.
