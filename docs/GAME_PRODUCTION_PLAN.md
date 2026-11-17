# KẾ HOẠCH SẢN XUẤT VÀ PHÂN RÃ CÔNG VIỆC (GAME PRODUCTION PLAN)
**Dự án:** Drunk Rocket (Tàu Say Rượu)  
**Vai trò:** Game Lead & Producer  
**Thư mục dự án:** `D:\project\game\Drunk-Rocket`  
**Phiên bản:** v1.0.0 — Kế hoạch khởi động sản xuất (Production Kick-off)  
**Trạng thái:** ĐÃ PHÊ DUYỆT CONCEPT & ART SPEC -> BƯỚC VÀO SẢN XUẤT  

---

## 1. ĐÁNH GIÁ & PHÊ DUYỆT TÀI LIỆU TIỀN KỲ (PRE-PRODUCTION SIGN-OFF)

Sau khi nghiên cứu và phản biện chi tiết các tài liệu từ các bộ phận:
1. **Concept Brief (Game Ideator):** **PHÊ DUYỆT (APPROVED)**.
   * *Đánh giá:* Game hook cực mạnh ("Rage game" kế thừa tinh hoa Flappy Bird nhưng có twist chuyển động say xỉn lệch hướng). Vòng lặp 0-second restart giải tỏa ức chế tức thì, tạo cảm giác thôi miên (flow state). Cơ chế thách đố xã hội (viral challenge) kết hợp Leaderboard là động lực cạnh tranh hoàn hảo.
2. **Art & UI/UX Specifications (Game Artist):** **PHÊ DUYỆT (APPROVED)**.
   * *Đánh giá:* Định hướng Retro 8-bit Pixel Art trên nền Cyber Neon tương phản cao rất trực quan và nổi bật. Giải pháp dựng VFX particle và SFX Web Audio trực tiếp trên Canvas 2D thay vì tải sprite/sound nặng giúp tối ưu bundle < 500KB, tải ngay lập tức trên mạng di động.
3. **Backend Architecture & D1 Schema (Cloudflare Backend):** **PHÊ DUYỆT (APPROVED)**.
   * *Đánh giá:* Tận dụng tối đa Free Tier (Pages + Workers + D1) đảm bảo 0đ chi phí vận hành. Schema SQLite tinh gọn, có index phục vụ cả top Daily và All-Time.

---

## 2. MỤC TIÊU DỰ ÁN & TIÊU CHUẨN KỸ THUẬT (PROJECT GOALS & KPIS)

* **Hiệu năng & Kích thước:**
  * Tổng dung lượng gói game (HTML + JS + Assets) < **500 KB**.
  * Chạy mượt mà **60 FPS** ổn định trên cả trình duyệt máy tính và điện thoại phổ thông.
  * Không giật lag khung hình khi kích hoạt hạt nổ hoặc vẽ nền parallax.
* **Độ trễ & Trải nghiệm (UX):**
  * **0-Second Respawn:** Thời gian hồi sinh sau va chạm < 0.1s khi người chơi chạm lại màn hình.
  * **One-Tap Simplicity:** Hỗ trợ mượt mà cả chuột/phím Space (PC) và Touch Screen (Mobile).
* **Hạ tầng & Vận hành:**
  * 100% Serverless trên Cloudflare (Cloudflare Pages frontend + Workers API backend + D1 Database).
  * Chi phí máy chủ: **0 VNĐ / 0 USD** theo định mức miễn phí.

---

## 3. LỘ TRÌNH PHÁT TRIỂN & CÁC GIAI ĐOẠN (TIMELINE & PHASES)

Lộ trình dự án được chia làm 4 Sprint/Giai đoạn kế tiếp nhau:

```
[Phase 1: Core Physics & Engine] ──> [Phase 2: Art & Sound Integration] ──> [Phase 3: Backend & Leaderboard] ──> [Phase 4: Polish & Launch]
         (Game Logic Dev)                       (Artist + Logic Dev)                  (Backend + Logic Dev)                    (Toàn đội)
```

### Phase 1: Core Engine & Physics Prototype (Sprint 1 - Nền tảng)
* **Trọng tâm:** Dựng khung Canvas 2D, vòng lặp game (Game Loop), vật lý tàu say rượu (quán tính rơi xiên trái, phản lực đẩy góc phải), sinh chướng ngại vật laser ngẫu nhiên, pixel-perfect hitbox collision.
* **Người phụ trách chính:** @Game Logic Dev.
* **Sản phẩm bàn giao:** Bản prototype Canvas chơi được trực tiếp trên trình duyệt, có tính điểm cơ bản và vòng lặp chết/hồi sinh.

### Phase 2: Visual Assets & Audio Synthesizer (Sprint 2 - Mỹ thuật & Âm thanh)
* **Trọng tâm:** Đưa bộ màu Cyber Neon và tạo hình Pixel Art của Tàu/Cột laser vào Canvas, tích hợp hệ thống hạt (VFX particles nổ/khói), nền Parallax Starfield, và bộ tổng hợp âm thanh Web Audio API (Chiptune 8-bit).
* **Người phụ trách chính:** @Game Artist phối hợp cùng @Game Logic Dev.
* **Sản phẩm bàn giao:** Game có diện mạo hoàn chỉnh chuẩn 8-bit retro arcade, âm thanh giòn giã sống động không tốn dung lượng tải.

### Phase 3: Cloudflare Backend & Social Leaderboard (Sprint 3 - Máy chủ & Đua top)
* **Trọng tâm:** Hoàn thiện Cloudflare Worker API `/api/leaderboard` và `/api/score`, kết nối cơ sở dữ liệu Cloudflare D1, chống gian lận thời gian/điểm số, tạo popup Bảng xếp hạng trong game và tính năng Copy Challenge Link.
* **Người phụ trách chính:** @Game Cloudflare Backend phối hợp cùng @Game Logic Dev.
* **Sản phẩm bàn giao:** Người chơi sau mỗi lượt game có thể lưu tên 3 ký tự lên bảng vàng, xem Top 10 ngày và chia sẻ kỷ lục qua mạng xã hội.

### Phase 4: Polish, Cross-Device QA & Deployment (Sprint 4 - Tinh chỉnh & Phát hành)
* **Trọng tâm:** Cân chỉnh độ khó (Game feel), khoảng cách khe hở giữa 2 cột laser, tốc độ trôi màn hình, tương thích đa độ phân giải màn hình (Responsive Viewport), test tải nhẹ và deploy lên Cloudflare Pages.
* **Người phụ trách:** Game Lead chỉ đạo toàn đội QA và kiểm thử nghiệm thu.
* **Sản phẩm bàn giao:** Bản game Production Release chạy trực tiếp trên URL Cloudflare Pages.

---

## 4. BẢNG PHÂN RÃ NHIỆM VỤ CHI TIẾT (TASK BREAKDOWN & MATRIX)

| Mã Task | Phân hệ | Mô tả nhiệm vụ chi tiết | Người phụ trách | Sản phẩm bàn giao (Deliverable) | Tiêu chí nghiệm thu (DoD) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DEV-01** | Core Loop | Thiết lập cấu trúc mã nguồn web (`index.html`, `src/main.js`, `src/engine/`) và vòng lặp Game Loop chuẩn `requestAnimationFrame`. | @Game Logic Dev | Khung dự án HTML5 Canvas | Game loop chạy ổn định 60fps, có delta time chống lệch frame. |
| **DEV-02** | Physics | Lập trình vật lý "Drunk Physics": rơi tự do có gia tốc chúc đầu & lệch trái; lực đẩy khi tap đẩy chếch góc 35° sang phải. | @Game Logic Dev | Module `physics.js` | Cảm giác lái tàu tròng trành, đúng chất "say xỉn", phản hồi ngay khi tap. |
| **DEV-03** | Obstacles | Bộ sinh chướng ngại vật ngẫu nhiên (Laser Pillars): khe hở di động theo dải ngẫu nhiên hợp lý, kiểm tra va chạm AABB/Pixel-perfect. | @Game Logic Dev | Module `obstacles.js` | Cột laser xuất hiện mượt mà, hitbox chuẩn xác không gây oan ức khi lách sát mép. |
| **DEV-04** | State & Flow | Xử lý các trạng thái game: Ready -> In-Game -> Game Over -> Instant Respawn (<0.1s khi nhấn lại). | @Game Logic Dev | Module `gameState.js` | Không có màn hình loading trễ; chết là bấm tap chơi lại ngay. |
| **ART-01** | Sprites/Draw | Cung cấp hàm vẽ vector/pixel tàu vũ trụ ngố và đầu phát emitter laser trực tiếp lên Canvas theo đúng màu spec. | @Game Artist | Module `renderer.js` / asset sprites | Tàu hiển thị đúng mắt lé, biểu cảm ngố, đúng mã màu `#ffd13b` & `#ff3b5c`. |
| **ART-02** | VFX & Starfield | Cài đặt hiệu ứng hạt nổ bùm pixel khi va chạm, khói phản lực khi bấm ga và nền Parallax Starfield 2 tầng. | @Game Artist | Module `vfx.js` & `starfield.js` | Hiệu ứng sinh động, dọn dẹp bộ nhớ hạt sạch sẽ, không tụt fps. |
| **ART-03** | Web Audio | Xây dựng bộ tổng hợp âm thanh Web Audio API (Oscillator 8-bit): tiếng xả ga `thrust`, tiếng ting `score`, tiếng nổ vỡ kim loại `crash`. | @Game Artist | Module `sound.js` | Âm thanh retro 8-bit không tốn 1 byte asset ngoài, phát ngay khi có tương tác. |
| **BE-01** | Worker API | Viết Cloudflare Worker xử lý route GET `/api/leaderboard` (Daily/All-time) và POST `/api/score`. | @Game Cloudflare Backend | Thư mục `backend/worker.js` & `wrangler.toml` | Trả về JSON chuẩn, latency < 50ms, xử lý CORS mượt mà cho Pages. |
| **BE-02** | Anti-Cheat | Xây dựng cơ chế xác thực điểm số hợp lệ: thời gian sinh tồn tối thiểu tương ứng với số cột vượt qua (`duration_ms` vs `score`). | @Game Cloudflare Backend | Hàm xác thực bảo vệ D1 | Chặn các request hack điểm phi lý trước khi ghi vào D1. |
| **FE-01** | UI & Social | Tích hợp modal Bảng xếp hạng Arcade (nhập 3 ký tự tên) và nút Chia sẻ Web Share API / Copy Challenge Text. | @Game Logic Dev + Backend | Modal UI trong game | Bấm nút chia sẻ tạo đúng nội dung viral; xem được Top 10 mượt mà. |
| **LEAD-01**| Tuning & QA | Cân bằng thông số trọng lực, lực đẩy, khoảng cách cột, độ rộng khe hở; kiểm thử trên thiết bị di động và máy tính. | @Game Lead | Báo cáo cân bằng & nghiệm thu | Tỷ lệ qua cột đầu tiên đạt ~20-30%, tạo động lực ức chế muốn chinh phục. |

---

## 5. QUY CHUẨN CẤU TRÚC MÃ NGUỒN (CODEBASE ARCHITECTURE)

Dự án được tổ chức đồng bộ trực tiếp tại `D:\project\game\Drunk-Rocket`:

```
D:\project\game\Drunk-Rocket\
├── index.html                   # Trang chủ chứa Canvas và viewport chuẩn mobile/desktop
├── style.css                    # Tối ưu giao diện toàn màn hình, chống cuộn/zoom vô ý
├── package.json                 # Cấu hình dự án (nếu dùng Vite/build tool tối giản)
├── src\
│   ├── main.js                  # Entry point khởi tạo Canvas và điều phối tổng thể
│   ├── core\
│   │   ├── game.js              # State manager và Main Loop (update, draw)
│   │   ├── input.js             # Xử lý sự kiện Touch / Click / Keyboard (Space)
│   │   └── physics.js           # Gia tốc trọng lực, vận tốc, lực đẩy xiên
│   ├── entities\
│   │   ├── rocket.js            # Đối tượng tàu vũ trụ (vị trí, góc nghiêng, trạng thái)
│   │   └── laserPillar.js       # Đối tượng cột laser và khe hẹp
│   ├── graphics\
│   │   ├── renderer.js          # Vẽ pixel-art các thực thể trực tiếp trên Canvas 2D
│   │   ├── starfield.js         # Nền sao Parallax 2 lớp chuyển động liên tục
│   │   └── particles.js         # Hệ thống hạt khói phản lực và mảnh vỡ khi nổ
│   ├── audio\
│   │   └── audioSynth.js        # Web Audio API tổng hợp âm thanh 8-bit retro
│   └── ui\
│       ├── hud.js               # Hiển thị điểm số số to in-game, chỉ báo Ready
│       ├── leaderboardModal.js  # Popup bảng xếp hạng Top Daily / All-time
│       └── shareCard.js         # Xử lý Web Share API và copy lời thách đố
├── backend\
│   ├── schema.sql               # Schema bảng điểm D1 SQLite
│   ├── wrangler.toml            # Cấu hình Cloudflare Workers & D1 binding
│   ├── worker.js                # Code xử lý API serverless
│   └── README.md                # Hướng dẫn deploy Cloudflare Pages & Workers
├── docs\
│   ├── DRUNK_ROCKET_CONCEPT_BRIEF.md    # Ý tưởng gốc từ Game Ideator
│   ├── ART_AND_UI_SPECIFICATIONS.md     # Quy chuẩn mỹ thuật từ Game Artist
│   └── GAME_PRODUCTION_PLAN.md          # Kế hoạch sản xuất chi tiết này (Game Lead)
└── assets\                              # Thư mục phụ lưu trữ các tài nguyên tĩnh
```

---

## 6. QUY TRÌNH PHỐI HỢP & ĐIỀU PHỐI TỨC THỜI (NEXT ACTIONS)

1. **Lệnh triển khai lập tức:** Giao việc cho **@Game Logic Dev** bắt tay ngay vào **Phase 1** dựng khung mã nguồn `src/` và Core Physics Canvas prototype tại `D:\project\game\Drunk-Rocket`.
2. **Hỗ trợ song song:** **@Game Artist** chuẩn bị các đoạn mã mẫu Canvas drawing cho thực thể Rocket và bảng màu chuẩn để ghép vào engine.
3. **Chuẩn bị hạ tầng:** **@Game Cloudflare Backend** hoàn thiện file `worker.js` và cấu hình `wrangler.toml` để sẵn sàng kết nối API khi Frontend hoàn tất Phase 2.