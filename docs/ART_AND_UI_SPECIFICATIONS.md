# TÀI LIỆU THIẾT KẾ MỸ THUẬT & GIAO DIỆN (ART & UI/UX SPECIFICATIONS)
**Dự án:** Drunk Rocket (Tàu Say Rượu)  
**Tác giả:** Game Artist & UI/UX Designer  
**Thư mục làm việc:** `D:\project\game\Drunk-Rocket`  
**Phiên bản:** v1.0.0  

---

## 1. Định Hướng Phong Cách Thị Giác (Art Direction)
* **Phong cách chủ đạo:** **Retro 8-bit Pixel Art** kết hợp bảng màu **Cyber Neon Arcade** có độ tương phản cao.
* **Tôn chỉ thiết kế:** 
  * Cực kỳ tối giản, dễ nhận diện vật thể trong 0.1 giây ở tốc độ di chuyển nhanh.
  * Hài hước, "ngố tàu", giải tỏa ức chế khi người chơi liên tục nổ máy bay.
  * Tối ưu tải web: Toàn bộ sprite và UI vector/pixel siêu nhẹ, đảm bảo tổng dung lượng game < 500KB.

---

## 2. Bảng Màu Chuẩn (Color Palette)

| Mã Hex | Tên màu | Mục đích sử dụng |
| :--- | :--- | :--- |
| `#0b0e14` | Deep Space Void | Màu nền chủ đạo (bầu trời vũ trụ tối sâu thẳm) |
| `#1a1f36` | Nebula Navy | Màu các lớp sao nền parallax xa, trần và sàn |
| `#ffd13b` | Rocket Bumblebee | Thân tàu vũ trụ chính, tạo điểm nhìn trung tâm nổi bật |
| `#ff3b5c` | Laser Danger Red | Chùm laser năng lượng chết người, cảnh báo va chạm |
| `#00f0ff` | Cyber Cyan | Cực phát năng lượng (Emitter), hiệu ứng phản lực |
| `#05ffa1` | Highscore Green | Màu điểm số mới, kỷ lục mới, nút hành động tích cực |
| `#ffffff` | Pure Pixel White | Ngôi sao nền, tròng mắt tàu, tia lửa vỡ vụn |

---

## 3. Thiết Kế Nhân Vật & Vật Thể (Sprites & Entities)

### 3.1. Tàu Vũ Trụ (Drunk Rocket)
* **Kích thước pixel:** `16 x 16` pixel (Scale 2x/3x trên Canvas tùy độ phân giải màn hình).
* **Đặc điểm tạo hình:**
  * Thân tròn bầu dục ngắn cụt, cánh tam giác nhỏ ngộ nghĩnh.
  * Cặp mắt to tròn màu trắng với con ngươi đen nhỏ xíu, mắt bị lác hoặc đảo tròng khi rơi ("say rượu").
  * Ống xả phía đuôi: Có 2 trạng thái lửa (Tắt khi trôi rơi, Phụt luồng lửa 3 màu Cam-Vàng-Trắng khi chạm màn hình).
* **Animation Frames:**
  1. `rocket_idle.png`: Tàu hơi nghiêng xuống, mắt chớp nhẹ.
  2. `rocket_thrust.png`: Tàu ngóc đầu lên góc 35 độ, lửa phụt mạnh ở đuôi.
  3. `rocket_die_particles`: 8 - 12 mảnh pixel văng tứ phía kèm vòng sóng shockwave tròn.

### 3.2. Chướng Ngại Vật (Laser Hazard Pillars)
* **Cấu tạo:**
  * **Đầu phát (Laser Emitters):** Khối kim loại pixel viền xám đậm `#2e3856`, lõi phát sáng Cyan nhấp nháy.
  * **Tia Laser (Laser Beam):** Cột năng lượng phát sáng màu Đỏ Neon `#ff3b5c`, có viền mờ 1 pixel tạo cảm giác điện áp cao.
* **Hitbox:** Lập trình theo chuẩn Pixel-perfect (Hitbox của tia laser tính chính xác theo luồng sáng, không tính viền glow).

### 3.3. Hậu Cảnh (Background Starfield)
* **Cơ chế Parallax 2 lớp:**
  * Lớp 1 (Sao xa): Kích thước 1x1 px, màu `#3a4a75`, trôi chậm 0.5px/frame.
  * Lớp 2 (Sao gần / Bụi vũ trụ): Kích thước 2x2 px, màu `#ffffff`, trôi 1.5px/frame.

---

## 4. Thiết Kế Giao Diện Người Dùng (UI/UX Design)

### 4.1. Triết lý Giao Diện
* **Zero Delay / Instant Feedback:** Không có màn hình chuyển cảnh gây nghẽn nhịp độ (flow state).
* **Responsive 100%:** Tự động scale vừa khít khung nhìn Mobile dọc (Portrait) và khung chữ nhật cố định trên PC màn ngang.

### 4.2. Màn Hình & Thành Phần UI
1. **Màn Hình Chờ (Ready Screen):**
   * Logo "DRUNK ROCKET" phong cách Pixel Typography ở 1/3 trên màn hình.
   * Dòng chữ nhấp nháy: `TAP HOẶC SPACE ĐỂ BAY` (font 8-bit pixelated).
   * Nút nhỏ góc trên bên phải: Bảng xếp hạng (Icon Cúp Vàng).

2. **In-game HUD (Giao diện trong ván chơi):**
   * Điểm số hiện tại (Current Score): Chữ số cực to ở giữa phía trên màn hình, viền đen dày để không bị lóa vào chướng ngại vật.
   * Không hiển thị bất kỳ thanh máu hay nút bấm che khuất tầm nhìn của người chơi.

3. **Game Over & Instant Respawn:**
   * Khi va chạm: Hiệu ứng **Screen Shake (150ms)** + Chớp đỏ màn hình (Flash Red 50ms).
   * Bảng điểm nhỏ trượt nhẹ từ trên xuống:
     * `SCORE: X` | `BEST: Y`
     * Huy hiệu thành tích (nếu đạt mốc): Đồng (3đ), Bạc (6đ), Vàng (10đ+).
   * Dòng nhắc: `CHẠM ĐỂ CHƠI LẠI NGAY` (sau 0.1s sau va chạm là nhận lệnh chơi lại).

4. **Nút Chia Sẻ Thách Đố (Viral Social Challenge):**
   * Nút `CHIA SẺ ĐIỂM` tích hợp Web Share API (hoặc Copy Link vào Clipboard).
   * Template text: *"🚀 Tôi vừa nổ tàu [X] lần trong Drunk Rocket nhưng chỉ đạt [Score] điểm. Liệu bạn có lái nổi qua 3 cột không? 👉 [URL]"*

5. **Bảng Xếp Hạng Toàn Cầu (Leaderboard Modal):**
   * Bảng pop-up tối giản kiểu Arcade: Top 10 ngày & Top 10 All-Time.
   * Ô nhập tên (3 ký tự phong cách Arcade cổ điển: ví dụ AAA, PRO, ACE).

---

## 5. Kế Hoạch Asset & Tối Ưu Âm Thanh (VFX & SFX)
* **VFX:**
  * Vẽ trực tiếp bằng mã nguồn HTML5 Canvas 2D (Particle emitter) thay vì load ảnh động GIF/spritesheet nặng:
    * Khói đuôi lửa (Particle tròn/vuông phai dần).
    * Hiệu ứng nổ mảnh tàu (8 khối pixel văng kèm gia tốc).
* **SFX (Audio):**
  * Ưu tiên dùng Web Audio API Oscillator (Tạo sóng sin/vuông retro 8-bit nguyên bản 0 bytes asset).
  * File âm thanh mẫu lưu tại `assets/audio/`:
    * `sfx_thrust.wav` (hoặc chiptune oscillator): Tiếng phụt hơi nén ngắn.
    * `sfx_score.wav`: Tiếng chuông 'ding' ngân vang 8-bit.
    * `sfx_crash.wav`: Tiếng vỡ kim loại kèm âm nổ trầm.

---

## 6. Cấu Trúc Thư Mục Asset tại `D:\project\game\Drunk-Rocket`

```
D:\project\game\Drunk-Rocket\
├── assets\
│   ├── sprites\       # Chứa các file ảnh sprite (nếu có bổ sung)
│   ├── audio\         # File âm thanh SFX nhẹ (< 20KB/file)
│   └── ui\            # Icon, phông chữ pixel web
├── docs\
│   ├── ART_AND_UI_SPECIFICATIONS.md  # Tài liệu mỹ thuật chi tiết này
│   └── DRUNK_ROCKET_CONCEPT_BRIEF.md # Bản Concept Brief của Game Ideator
└── src\               # Mã nguồn triển khai (Logic Dev & FE phụ trách)
```
