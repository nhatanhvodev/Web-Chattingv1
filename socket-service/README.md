# Socket Service (Fly.io)

Standalone Socket.IO server phục vụ realtime cho ứng dụng Zolo.

## Cấu trúc
- `socket-server.js`: mã nguồn Node.js thuần (CommonJS).
- `package.json`: chỉ bao gồm `socket.io` và `dotenv`.
- `Dockerfile`: image Node 20 Alpine, expose port 8080.
- `fly.toml`: cấu hình mẫu cho Fly.io (hãy đổi giá trị `app` theo tên app của bạn).

## Deploy nhanh
```bash
cd socket-service
fly auth login
fly launch --copy-config --no-deploy   # hoặc chỉnh sửa fly.toml rồi
fly secrets set CORS_ORIGIN="https://your-app.vercel.app,file://"
fly deploy
```

Sau khi chạy xong, Fly trả về URL dạng `https://<app>.fly.dev`. Gán URL này vào biến môi trường `NEXT_PUBLIC_SOCKET_URL` của ứng dụng Next.js và thêm domain vào `CORS_ORIGIN` nếu cần.

