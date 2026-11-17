# KẾ HOẠCH NÂNG CẤP GAMEPLAY: DRUNK ROCKET 2.0 (OVERDRIVE & ROGUELITE)
**Dự án:** Drunk Rocket (Tàu Say Rượu)  
**Vai trò:** Game Lead & Producer  
**Thư mục dự án:** `D:\project\game\Drunk-Rocket`  
**Phiên bản:** v2.3.0 - Delay 1.0s, Đốt lửa lướt Smash 2 cột, Cụm hạt năng lượng & Đồ họa/Âm thanh Hài hước Gen Z  
**Trạng thái:** ĐÃ CẬP NHẬT HOÀN THIỆN -> DEPLOY PRODUCTION  

---

## 1. ĐÁNH GIÁ & ĐỒNG THUẬN TỪ GAME LEAD
Bản nâng cấp **Drunk Rocket 2.3.0** tập trung vào độ mượt mà, tính công bằng và cảm xúc giải trí hài hước (Gen-Z Meme & Comic Feel) cho tựa game:
1. **Delay 1.0s trước & sau chọn thẻ:** Tăng từ 0.5s lên 1.0s giúp người chơi có đủ thời gian chuẩn bị ngón tay, hoàn toàn không bị trôi game hay giật vọt đâm trần.
2. **Cụm hạt năng lượng bay dập dềnh (Floating Energy Clusters):** Mỗi lần vượt cột sẽ sinh ra cụm 2 - 4 hạt năng lượng lơ lửng chuyển động sóng sin. Ăn hạt năng lượng **chỉ nạp Overdrive (+4% mỗi hạt) để tích lũy Smash nhanh hơn mà không tăng điểm level**, chống việc thăng cấp quá nhanh.
3. **Supernova Smash đốt lửa đuôi & Lướt tới cột thứ 2:** Tên lửa phun lửa rồng siêu tốc, lao vọt tới vị trí của cột thứ 2 bị phá hủy. Sau khi hoàn thành cú lướt mới kiểm tra mốc điểm chọn thẻ bài.
4. **Hitbox ghi điểm chuẩn xác (Vượt qua trọn vẹn cả đuôi tàu):** Tên lửa phải thoát hoàn toàn qua chướng ngại vật (`rocket.x - rocket.radius - 14 > pillar.x + pillar.width`) thì mới tính là vượt qua thành công.
5. **Đồ họa & Âm thanh Hài hước (Comedic Gen-Z Vibe):**
   * Tên lửa thiết kế siêu ngố: mắt to mắt nhỏ đảo lác xếch (`cross-eyed`), má ửng đỏ xỉn rượu, thè lưỡi ngộ nghĩnh hoặc cười toe toét, có chai bia mini buộc bên sườn tàu; khi nổ hiện mắt `X_X` mếu máo.
   * Âm thanh vượt cột vui nhộn: Tiếng hô reo `HEYYY! / WOO-HOO!` 4 nốt arpeggio réo rắt.
   * Âm thanh tử nạn trớ trêu: Đoạn kèn `QUÉO QUÈO QUEO` (Sad trombone fail slide) cực kỳ hài hước.

---

## 2. QUY CHUẨN KỸ THUẬT & THIẾT KẾ CƠ CHẾ v2.3.0

### 2.1. Nhịp độ Đóng băng 1.0s (1.0s Pre & Post-Draft Freeze)
* **Pre-Draft 1.0s Freeze:** Đóng băng toàn bộ chuyển động game trong 1.0s khi đạt mốc chọn thẻ bài (mỗi 7 điểm), phát âm thanh mở kho vũ khí.
* **Post-Draft 1.0s Ready Freeze:** Sau khi bấm chọn thẻ, giữ đóng băng thêm 1.0s hiển thị thẻ vừa chọn và đếm lùi `🚀 CHUẨN BỊ BAY TRONG: 1.0s`. Toàn bộ cú chạm/phím Space trong thời gian này được cô lập an toàn.

### 2.2. Cơ chế Cụm Hạt Năng Lượng (Energy Cells Overdrive Only)
* Khi tên lửa vượt qua 1 cột laser, một cụm từ **2 đến 4 hạt năng lượng** hình thoi phát sáng được sinh ra ở khoảng không phía sau cột.
* Các hạt năng lượng chuyển động sóng sin nhịp nhàng và trôi dạt dần sang trái.
* Khi ăn hạt: **+4% Overdrive** (không cộng điểm score), giúp tích đầy Quả cầu Smash mà không làm game bị spam chọn thẻ liên tục.
* Thẻ bài **🧲 Drunk Magnet:** Tự động hút mạnh mẽ mọi hạt năng lượng trong bán kính **220px** lao vút về phía tên lửa.

### 2.3. Supernova Smash Lướt Tới Cột Thứ Hai
* Khi bấm Double-Tap lúc quả cầu đầy 100%:
  * Tên lửa phun luồng lửa rồng rực rỡ dài 50px phía sau.
  * Phá hủy cùng lúc 2 cột liên tiếp phía trước và tăng tốc lướt vọt tới tọa độ của cột thứ hai bị phá hủy.
  * Khi cú lướt hoàn tất, tên lửa trở về vị trí bay chuẩn và hệ thống mới bắt đầu kiểm tra điều kiện mở bảng chọn thẻ bài.

### 2.4. Điều Kiện Tính Điểm Vượt Cột (Strict Tail Clearance)
* Điểm số và nạp Overdrive chỉ được kích hoạt khi mép đuôi động cơ của tên lửa (`tailX = rocket.x - rocket.radius - 14`) đã vượt hoàn toàn qua mép phải của cột laser (`pillar.x + pillar.width`).

### 2.5. Trải Nghiệm Thính Giác & Thị Giác Hài Hước
* Tên lửa thể hiện nét mặt say xỉn đáng yêu (mắt lác, lưỡi thè, má hồng, chai bia dắt sườn).
* Mỗi lần qua cột thành công: Miệng mở to reo hò `HEYYY!` cùng âm thanh vui tươi phấn khởi.
* Khi va chạm: Mắt biến thành `X_X`, miệng méo xệch cùng tiếng kèn trượt âm `QUÉO QUÈO QUEO` trêu ngươi nhưng đem lại tiếng cười vui vẻ cho người chơi trẻ.

---

## 3. TIÊU CHUẨN TỐI ƯU VÀ CAM KẾT HIỆU NĂNG
* Duy trì tổng bundle game (HTML + JS + CSS) < **70 KB**.
* Hoàn toàn sử dụng Canvas 2D procedurally và Web Audio API (0 byte external assets).
* 60 FPS ổn định trên thiết bị di động phổ thông.
