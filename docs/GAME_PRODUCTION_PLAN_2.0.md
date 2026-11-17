# KẾ HOẠCH NÂNG CẤP GAMEPLAY: DRUNK ROCKET 2.0 (OVERDRIVE & ROGUELITE)
**Dự án:** Drunk Rocket (Tàu Say Rượu)  
**Vai trò:** Game Lead & Producer  
**Thư mục dự án:** `D:\project\game\Drunk-Rocket`  
**Phiên bản:** v2.2.0 - Tinh chỉnh nhịp độ, Interactive Hover, Khắc phục lỗi Bất tử & Hạt năng lượng trôi nổi  
**Trạng thái:** ĐÃ CẬP NHẬT HOÀN THIỆN -> DEPLOY PRODUCTION  

---

## 1. ĐÁNH GIÁ & ĐỒNG THUẬN TỪ GAME LEAD
Bản nâng cấp **Drunk Rocket 2.2.0** hoàn thiện trải nghiệm Micro-Roguelite và Overdrive với 5 điểm cải tiến trọng yếu theo phản hồi trực tiếp:
1. **Dừng nhịp độ 0.5s trước & sau khi chọn thẻ (Pacing Grace Periods):** Tránh gây bất ngờ, giúp người chơi có thời gian chuẩn bị tâm lý và vị trí tay.
2. **Hiệu ứng Hover thẻ bài sống động (Card Interactive VFX):** Rê chuột phóng to thẻ, phát sáng viền neon vàng/cyan, nền chuyển màu và đổi con trỏ chuột `pointer`.
3. **Cân bằng Quantum Drift (Hồi chiêu 4s):** Triệt tiêu hoàn toàn lỗi tàng hình bất tử vĩnh viễn bằng cơ chế hồi chiêu chuẩn xác, giữ vững tính thử thách và công bằng.
4. **Hạt năng lượng trôi nổi (Floating Energy Cells):** Bổ sung các tinh thể năng lượng lơ lửng trong không gian giữa các cột để người chơi thu thập (+10% Nộ & +1 điểm).
5. **Thẻ bài Drunk Magnet & Magnetic Suction VFX:** Tự động hút các hạt năng lượng trong phạm vi 185px về tên lửa, đồng thời hiển thị từ trường neon và dòng hạt plasma bị hút vào tàu.

---

## 2. QUY CHUẨN THIẾT KẾ CƠ CHẾ & GIAO DIỆN (SPECIFICATIONS v2.2.0)

### 2.1. Nhịp độ Chọn Thẻ Bài (Pre-Draft & Post-Draft 0.5s Pauses)
* **Pre-Draft 0.5s Freeze:** Khi đạt mốc điểm chọn thẻ (mỗi 7 điểm), game đóng băng chuyển động trong 0.5s kèm thông báo chuẩn bị và âm thanh mở kho vũ khí.
* **Post-Draft 0.5s Ready Freeze:** Sau khi người chơi bấm chọn thẻ, giao diện giữ đóng băng thêm 0.5s hiển thị tên kỹ năng vừa nhận và đếm ngược `🚀 CHUẨN BỊ BAY TRONG: 0.5s`. Toàn bộ cú chạm/phím bấm trong thời gian này được cô lập, ngăn chặn việc tên lửa bị giật bay đâm trần.

### 2.2. Hiệu ứng Tương tác Hover Thẻ Bài (Interactive Card Hover)
* Khi con trỏ chuột rê vào bất kỳ thẻ bài nào:
  * Hộp thẻ mở rộng kích thước (+8px chiều ngang, +4px chiều dọc).
  * Viền đổi sang màu vàng Bumblebee rực rỡ kèm đổ bóng ánh sáng `shadowBlur = 20px` màu Cyber Cyan.
  * Nền chuyển sang gradient sáng màu công nghệ cao `rgba(42, 60, 110, 0.98)`.
  * Tiêu đề hiển thị ký hiệu nổi bật: `▶ [1] 🔬 Nano Hull ◀`.
  * Con trỏ chuột chuyển sang dạng bàn tay (`cursor: pointer`).

### 2.3. Sửa Lỗi Tàng hình Bất tử (Quantum Drift Cooldown)
* **Thời gian tàng hình:** 0.8 giây lướt xuyên cột an toàn.
* **Thời gian hồi chiêu (Cooldown):** **4.0 giây**.
* **Nguyên lý:** Nhấp tap trong lúc đang hồi chiêu chỉ đẩy tàu bay bình thường chứ không gia hạn thời gian tàng hình. Tàu chỉ có thể kích hoạt xuyên thấu lần tiếp theo sau khi đã hồi chiêu xong.
* **Chỉ báo HUD:** Khi hồi xong, quanh tàu xuất hiện vòng sáng Cyan báo hiệu sẵn sàng; khi kích hoạt, tàu chuyển sang dạng bóng ma tàng hình Hologram bán trong suốt (`globalAlpha = 0.38`).

### 2.4. Hạt Năng Lượng Trôi Nổi (Floating Energy Cells)
* Các tinh thể năng lượng Plasma hình thoi vàng/cyan lơ lửng dao động sóng sin nhịp nhàng giữa các khoảng trống cột laser.
* Khi tên lửa chạm vào:
  * Thu nhận ngay **+10% năng lượng Overdrive** và **+1 điểm thưởng**.
  * Bùng nổ pháo hoa hạt lấp lánh và sóng xung kích Shockwave vàng rực.

### 2.5. Thẻ bài Drunk Magnet & Magnetic Attraction VFX
* Khi sở hữu thẻ bài **🧲 Drunk Magnet**:
  * Bất kỳ hạt năng lượng nào trong phạm vi **185px** đều bị lực từ trường hút lao thẳng về phía tên lửa.
  * Hiển thị các đường sức từ trường neon đứt đoạn bao quanh thân tàu cùng nhãn `🧲 MAGNET`.
  * Định kỳ 0.35s hút các hạt plasma không gian hội tụ vào mũi tàu, trực quan hóa sức hút năng lượng.

---

## 3. TIÊU CHUẨN TỐI ƯU VÀ CAM KẾT HIỆU NĂNG
* Duy trì tổng bundle game (HTML + JS + CSS) < **70 KB**.
* Hoàn toàn sử dụng Canvas 2D procedurally và Web Audio API (0 byte external assets).
* 60 FPS ổn định trên thiết bị di động phổ thông.
