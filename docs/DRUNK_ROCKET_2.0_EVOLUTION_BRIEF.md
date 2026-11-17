# DRUNK ROCKET 2.0: OVERDRIVE & ROGUELITE EDITION
**Tác giả:** Game Ideator  
**Trạng thái:** Concept Revision (Tiến hóa Gameplay theo Meta 2024–2026)  
**Mục tiêu:** Thoát khỏi lối mòn Flappy Bird cổ điển, tạo vòng lặp nghiện kép: *Kỹ năng mạo hiểm + Xây dựng thẻ bài (Build) + Phá hủy giải tỏa*.

---

## 1. Triết lý Thiết kế: "The Triple Synergy Loop" (Sự Kết Hợp 3 Trong 1)

Thay vì đặt các tính năng rời rạc làm rối người chơi, cả 3 hướng được móc xích tự nhiên thành một chuỗi nhân quả mượt mà:

```
[Bay mạo hiểm Near-Miss] 
       │
       ▼ (Sạc đầy thanh Nộ 100%)
[Kích hoạt SMASH phá nát cột] 
       │
       ▼ (Tích điểm vượt mốc Milestone)
[Chọn Thẻ Nâng Cấp ROGUELITE Perk]
```

1. **Near-Miss (Mạo hiểm)** là công cụ nạp năng lượng nhanh nhất.
2. **Smash (Hủy diệt)** là phần thưởng giải tỏa để thoát khỏi thế bí và duy trì ván chơi.
3. **Roguelite Perk (Tiến hóa)** là động lực khiến mỗi ván chơi (Run) là một trải nghiệm độc nhất vô nhị.

---

## 2. Chi tiết Cơ chế Gameplay

### 2.1. Thao tác điều khiển (Tối giản nhưng có chiều sâu)
* **Single Tap (Chạm / Click / Space):** Phụt lửa bay chéo lên giữ nhịp (Drunk physics cơ bản).
* **Double Tap (Chạm đúp nhanh):** Kích hoạt **SUPERNOVA SMASH** khi thanh Năng lượng đầy 100%.

### 2.2. Hệ thống Năng lượng Cồn & Near-Miss Rush (Risk vs Reward)
* **Thanh Drunk-Meter (Năng lượng cồn):** Hiển thị ngay dưới thân tàu.
  * Bay an toàn ở giữa: **+1 điểm**, nạp chỉ +5% năng lượng.
  * **Near-Miss (Lướt sát cột < 8px):** 
    * Kích hoạt hiệu ứng điện giật, rung màn hình cực bốc, âm thanh "CHING!".
    * Nhận ngay **x2 đến x3 điểm**.
    * Nạp ngay **+35% Năng lượng** (Chỉ cần 3 cú lướt sát là đầy bình).
* **Supernova Smash (Húc hủy diệt):**
  * Khi bình đầy 100%, thân tàu bốc lửa cầu vồng.
  * Người chơi nhấp đúp: Tàu lao vút về phía trước trong 0.8 giây, **húc tan tành cột laser tiếp theo** thành hàng trăm hạt pixel vụn vỡ kèm âm thanh nổ đã tai!
  * Giúp người chơi chủ động "cứu bàn thua trông thấy" khi rơi vào khe quá hẹp.

### 2.3. Hệ thống Micro-Roguelite (Perk Draft)
Cứ mỗi **7 điểm tích lũy**, game rơi vào trạng thái *Bullet Time (chậm thời gian trong 2 giây)* và mở ra 3 thẻ nâng cấp ngẫu nhiên để người chơi chọn nhanh 1 thẻ:

| Nhóm Perk | Tên Thẻ Bài | Hiệu ứng |
| :--- | :--- | :--- |
| **Sinh tồn (Defense)** | *Nano Hull (Thu nhỏ)* | Tàu teo nhỏ 25%, lách qua khe hẹp cực dễ. |
| | *Beer Bubble (Khiên bọt)* | Cho phép va chạm 1 lần không chết; khiên vỡ tạo sóng đẩy chướng ngại vật ra xa. |
| | *Quantum Drift* | Sau mỗi cú tap, tàu tàng hình và đi xuyên vật thể trong 0.3s. |
| **Khuếch đại (Offense)** | *Adrenaline Junkie* | Tăng phạm vi nhận diện Near-Miss lên gấp đôi; điểm Near-Miss x5. |
| | *Chain Reaction* | Cú Smash húc nổ không chỉ 1 mà phá hủy luôn cả 2 cột tiếp theo. |
| | *Magnet Core* | Tự động hút các hạt điểm và năng lượng trôi nổi. |

---

## 3. Ý tưởng Bổ sung Mới: Đẩy mạnh Lan truyền & Meta Hiện đại

### 3.1. Tử địa Bạn bè (Ghost Wreckages)
* Lấy cảm hứng từ *Dark Souls / Nier*: Khi kết nối bảng xếp hạng Cloudflare D1, game lưu lại vị trí mà các người chơi trong Top/Bạn bè từng tử nạn.
* Trên đường bay, người chơi sẽ nhìn thấy **xác tàu pixel bốc khói kèm bia mộ nhỏ mang tên bạn bè** (ví dụ: *"RIP @MausBot - Died at Col 14"*).
* Khi bay vượt qua xác tàu của bạn bè, game phát popup vui nhộn: *"Gà vãi! Bạn vừa bỏ xa @MausBot"* -> Thúc đẩy sự cạnh tranh và chia sẻ link dìm hàng nhau.

### 3.2. Hiệu ứng "Say xỉn" Thính giác & Thị giác (Audiovisual Drunk State)
* Điểm số càng cao, hiệu ứng nền Neon Synthwave càng chuyển màu lượn sóng nhẹ nhàng (như đang nhìn qua lăng kính), nhạc nền 8-bit chiptune dập beat theo nhịp tim.
* Tạo trạng thái **Thôi miên (Flow State)** khiến người chơi khó dứt mắt khỏi màn hình.

---

## 4. Tóm tắt Giá trị Đột phá
1. **Không còn là bản sao Flappy Bird:** Có kỹ năng liều (Near-Miss), có quyền lực phá hủy (Smash), có chiến thuật chọn bài (Perk Draft).
2. **Giá trị chơi lại vô tận (Infinite Replayability):** Mỗi lần chơi là một bộ thẻ bài khác nhau.
3. **Viral tự nhiên:** Tính năng bia mộ bạn bè biến game offline thành một đấu trường so kè điểm số trực tiếp.
