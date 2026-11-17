# CONCEPT BRIEF: DRUNK ROCKET (TÀU SAY RƯỢU)
**Thể loại:** Hyper-casual / Micro-Arcade (Rage & Instant-Restart)  
**Nền tảng mục tiêu:** Web (Mobile & PC), Cloudflare Pages  
**Backend & Database:** Cloudflare Worker + Cloudflare D1 (Global Leaderboard)  

---

## 1. Tổng quan & USP (Unique Selling Point)
* **Core Hook:** Một game "Rage-game" học hỏi từ công thức thành công của Flappy Bird: Luật chơi hiểu trong 1 giây, độ khó cực cao khiến người chơi chết sau 3-5 giây, tạo sự ức chế tích cực và thôi thúc "chơi lại ngay lập tức".
* **USP:** 
  * Cơ chế quán tính vật lý "say xỉn" (dễ mà khó kiểm soát).
  * 0-second restart (Hồi sinh tức thì, không menu chờ, chu kỳ ván chơi siêu nhanh).
  * Thang điểm cô đọng (1, 2, 3...) kết hợp link chia sẻ thách đố bạn bè kèm "chỉ số sỉ nhục/tự ái".

---

## 2. Bối cảnh & Phong cách Nghệ thuật (Art Style)
* **Đồ họa:** Retro Pixel Art 8-bit tối giản, màu sắc tương phản cao (phong cách Arcade cổ điển).
* **Nhân vật chính:** Chiếc tàu vũ trụ pixel mini mắt tròn ngố tàu, phụt khói trắng/lửa pixel mỗi khi kích hoạt động cơ.
* **Môi trường & Chướng ngại vật:** Hai cột năng lượng laser/trụ đá với khe hẹp ở giữa, khoảng cách và độ cao thay đổi ngẫu nhiên.
* **Hiệu ứng & Âm thanh:**
  * Hiệu ứng nổ bùm pixel và âm thanh kim loại vỡ vụn khi va chạm.
  * Âm thanh 'ting' giòn tan khi bay qua mỗi cột.
  * Tối ưu kích thước: Hoàn toàn dùng HTML5 Canvas 2D và Web Audio API tổng hợp âm thanh (Bundle toàn bộ game < 500KB).

---

## 3. Gameplay Mechanics & Điều khiển

### 3.1. Cơ chế điều khiển
* **One-Tap Control:** 1 chạm duy nhất.
  * **PC:** Nhấn phím `Space` hoặc click chuột trái.
  * **Mobile:** Chạm bất kỳ đâu trên màn hình.

### 3.2. Cơ chế vật lý & Core Loop
* **Quán tính:** Tàu tự động rơi chúc mũi xuống và lệch sang trái theo trọng lực.
* **Lực đẩy:** Mỗi lần chạm, tàu phụt lửa đẩy mạnh chéo lên bên phải.
* **Luật chơi:** Nhấp nhả đúng nhịp để giữ cân bằng và lách qua khe hẹp giữa 2 cột laser. 
* **Điều kiện thua:** Chạm vào cột laser, trần nhà hoặc sàn nhà.

### 3.3. Hệ thống điểm & Cạnh tranh
* Vượt qua 1 cặp cột = **+1 điểm**.
* Điểm 1-3: Nghiệp dư (80% người chơi dừng ở đây).
* Điểm 4-9: Tay lái cừ khôi.
* Điểm 10+: Huyền thoại (Top 1% bảng xếp hạng).

---

## 4. Tâm lý Giữ chân & Tính năng Lan truyền (Virality)
1. **Instant Respawn (0.1s):** Vừa nổ là reset ngay về vạch xuất phát, giữ người chơi trong trạng thái thôi miên (flow state).
2. **Near-miss Psychology:** Hitbox được lập trình cực sát (pixel-perfect), tạo cảm giác "chỉ thiếu 0.01 giây là qua".
3. **Thách đố bạn bè (Social Challenge Card):**
   * Tự tạo ảnh/text chia sẻ nhanh qua Web Share API / Copy Link:
     > *"Tôi đã nổ tàu 42 lần chỉ để đạt 3 điểm trong Drunk Rocket. Bạn có dám thử không? 👉 [Link game]"*
   * Tích hợp bảng xếp hạng Cloudflare D1 hiển thị Top Điểm trong ngày và Mọi thời đại.
