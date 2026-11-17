# KẾ HOẠCH NÂNG CẤP GAMEPLAY: DRUNK ROCKET 2.0 (OVERDRIVE & ROGUELITE)
**Dự án:** Drunk Rocket (Tàu Say Rượu)  
**Vai trò:** Game Lead & Producer  
**Thư mục dự án:** `D:\project\game\Drunk-Rocket`  
**Phiên bản:** v2.0.0 Roadmap — Kế hoạch tiến hóa sản phẩm  
**Trạng thái:** ĐÃ PHÊ DUYỆT CONCEPT 2.0 -> ĐƯA VÀO KẾ HOẠCH PHÁT TRIỂN TIẾP THEO  

---

## 1. ĐÁNH GIÁ & ĐỒNG THUẬN TỪ GAME LEAD
Bản đề xuất **Drunk Rocket 2.0: Overdrive & Roguelite Edition** từ Game Ideator đã giải quyết triệt để bài toán:
* Thoát khỏi cái bóng "nhàm chán / lặp lại" của Flappy Bird cổ điển.
* Giữ nguyên tính tối giản One-Tap (thêm Double-Tap trực quan) nhưng tạo ra chiều sâu chiến thuật và giải tỏa ức chế cực tốt thông qua **The Triple Synergy Loop**:
  `Bay mạo hiểm (Near-Miss) ──> Đầy nộ phá cột (Supernova Smash) ──> Chọn thẻ bài (Micro-Roguelite Draft)`.
* Tính năng xã hội **Bia mộ bạn bè (Ghost Wreckages)** tận dụng hoàn hảo hệ thống Cloudflare D1 để tạo độ cạnh tranh viral tự nhiên.

---

## 2. KẾ HOẠCH SPRINT & PHÂN RÃ NHIỆM VỤ CHO PHIÊN BẢN 2.0

Lộ trình nâng cấp được chia làm 3 Sprint kế tiếp:

```
[Sprint 2.1: Overdrive & Near-Miss] ──> [Sprint 2.2: Micro-Roguelite Deck] ──> [Sprint 2.3: Ghost Wreckages & Polish]
         (Logic Dev + Artist)                     (Logic Dev + UI)                         (Backend + Toàn đội)
```

### Sprint 2.1: Cơ chế Near-Miss Rush & Supernova Smash
* **Game Logic Dev:**
  * Lập trình vùng phát hiện Near-Miss (< 8px quanh cột laser).
  * Thêm thanh năng lượng `drunkMeter` (0 - 100%), tính điểm x2-x3 khi lướt sát.
  * Nhận diện thao tác Double-Tap kích hoạt trạng thái bất tử húc nổ 1 cột laser phía trước.
* **Game Artist:**
  * Thêm hiệu ứng hạt điện giật và tia sét Cyber Cyan khi kích hoạt Near-Miss.
  * Hiệu ứng vỡ vụn cột laser thành 50 mảnh pixel khi bị Smash.
  * Web Audio: Âm thanh giật điện "CHING" và âm thanh nổ đanh "SUPERNOVA BOOM".

### Sprint 2.2: Hệ thống Micro-Roguelite (Perk Draft System)
* **Game Logic Dev:**
  * Cài đặt cơ chế Bullet-Time (làm chậm game 80% trong 2s khi đạt mốc mỗi 7 điểm).
  * Bộ quản lý trạng thái Perk:
    * `Nano Hull`: Co nhỏ hitbox và scale của Rocket 25%.
    * `Beer Bubble`: Khiên năng lượng đỡ 1 mạng va chạm đầu tiên.
    * `Quantum Drift`: Tàng hình xuyên cột 0.3s sau mỗi tap.
    * `Chain Reaction`: Smash húc nổ 2 cột liên tiếp.
* **Game Artist & UI:**
  * Thiết kế 3 thẻ bài pixel dạng Arcade pop-up chọn nhanh trong 2 giây.

### Sprint 2.3: Bia mộ bạn bè (Ghost Wreckages) & Cloudflare D1 Sync
* **Game Cloudflare Backend:**
  * Mở rộng bảng `scores` hoặc tạo bảng `ghost_markers` trên Cloudflare D1 lưu tọa độ cột tử nạn của top người chơi / bạn bè.
  * API Endpoint `GET /api/ghosts` trả về danh sách vị trí tử nạn.
* **Game Logic Dev & Artist:**
  * Render xác tàu pixel bốc khói đen kèm bia mộ nhỏ mang tên người chơi trên Canvas.
  * Popup thông báo vui nhộn khi vượt qua xác tàu bạn bè.

---

## 3. TIÊU CHUẨN TỐI ƯU VÀ CAM KẾT HIỆU NĂNG
* Duy trì tổng bundle game (HTML + JS + CSS) < **70 KB**.
* Hoàn toàn sử dụng Canvas 2D procedurally và Web Audio API (0 byte external assets).
* 60 FPS ổn định trên thiết bị di động phổ thông.