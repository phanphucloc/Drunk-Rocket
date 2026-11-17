# Drunk Rocket - Cloudflare Serverless Backend (0đ Free Tier)

Hệ thống backend serverless phục vụ lưu trữ điểm số và bảng xếp hạng Global Leaderboard cho Web Game **Drunk Rocket**.

## 1. Hạ tầng Cloudflare (Hoàn toàn 0đ Free Tier)
- **Cloudflare Pages:** Hosting frontend HTML5 Canvas tĩnh (< 500KB bundle), CDN toàn cầu không giới hạn băng thông.
- **Cloudflare Workers:** Serverless API xử lý logic xác thực và ghi/đọc điểm số (100,000 requests/ngày miễn phí).
- **Cloudflare D1 (SQLite Serverless):** Cơ sở dữ liệu lưu trữ điểm (5 triệu rows read/ngày, 100,000 rows write/ngày miễn phí).

## 2. Cấu trúc thư mục
```
backend/
├── schema.sql       # Cấu trúc bảng SQLite D1
├── wrangler.toml    # Cấu hình Cloudflare Worker & D1 binding
├── worker.js        # Serverless API logic (CORS, Anti-cheat, Leaderboard)
└── README.md        # Hướng dẫn thiết lập & triển khai
```

## 3. Các API Endpoints
- `GET /health`: Kiểm tra trạng thái hoạt động của Worker và kết nối D1.
- `GET /api/leaderboard?type=daily|alltime&limit=10`: Lấy top bảng xếp hạng theo ngày (24h qua) hoặc mọi thời đại.
- `POST /api/score`: Gửi điểm số lượt chơi.
  - Body:
    ```json
    {
      "player_name": "ABC",
      "score": 25,
      "duration_ms": 32000,
      "client_hash": "optional_sha256_hash"
    }
    ```
  - **Cơ chế chống gian lận (Anti-Cheat):**
    - Kiểm tra tỷ lệ thời gian sinh tồn / điểm số (`duration_ms >= score * 800ms`).
    - Giới hạn trần điểm số hợp lệ.
    - Chuẩn hóa tên arcade (1-6 ký tự in hoa).

## 4. Hướng dẫn thiết lập và triển khai

### Bước 1: Cài đặt Wrangler CLI
```bash
npm install -g wrangler
# Hoặc chạy trực tiếp qua npx
npx wrangler login
```

### Bước 2: Tạo cơ sở dữ liệu Cloudflare D1
```bash
# Tạo database D1
npx wrangler d1 create drunk_rocket_db
```
*Ghi lại `database_id` được sinh ra và cập nhật vào file `wrangler.toml`.*

### Bước 3: Khởi tạo bảng dữ liệu trên D1
```bash
# Chạy migration schema
npx wrangler d1 execute drunk_rocket_db --file=schema.sql --remote
```

### Bước 4: Test cục bộ (Local Development)
```bash
npx wrangler dev
```

### Bước 5: Triển khai lên Cloudflare Workers (Production)
```bash
npx wrangler deploy
```
