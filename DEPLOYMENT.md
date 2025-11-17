# Hướng Dẫn Triển Khai Desktop App

## Vấn Đề Hiện Tại
Electron desktop app gặp lỗi 500 khi kết nối WebSocket qua `/api/socket/io` trên Render vì Next.js API routes không ổn định với Socket.IO trong môi trường serverless.

## Giải Pháp: Socket Server Riêng

### 1. Tạo Service Socket Riêng Trên Render

**Bước 1: Tạo Web Service mới**
1. Truy cập [Render Dashboard](https://dashboard.render.com/)
2. Chọn "New +" → "Web Service"
3. Kết nối với repo GitHub: `nhatanhvodev/Web-Chattingv1`
4. Cấu hình service:
   - **Name**: `web-chatting-socket` (hoặc tên khác)
   - **Region**: Chọn cùng region với app chính
   - **Branch**: `master`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node socket-server.js`
   - **Plan**: Free hoặc Starter

**Bước 2: Thêm Environment Variables**
```
CORS_ORIGIN=https://web-chatting-tmnv.onrender.com
NODE_ENV=production
```

**Bước 3: Deploy**
- Nhấn "Create Web Service"
- Đợi deploy xong, lấy URL (ví dụ: `https://web-chatting-socket.onrender.com`)

### 2. Cập Nhật App Chính

**Thêm vào `.env` local:**
```env
NEXT_PUBLIC_SOCKET_URL=https://web-chatting-socket.onrender.com
```

**Thêm Environment Variable trên Render (app chính):**
```
NEXT_PUBLIC_SOCKET_URL=https://web-chatting-socket.onrender.com
```

**Redeploy app chính** để áp dụng biến mới.

### 3. Test Desktop App

**Chạy local:**
```powershell
# Terminal 1: Next.js dev
npm run dev

# Terminal 2: Socket server
npm run socket:dev

# Terminal 3: Electron
npm run dev:desktop
```

Thêm vào `.env` local để test:
```
NEXT_PUBLIC_SOCKET_URL=http://localhost:4001
```

**Build production desktop:**
```powershell
# Đóng tất cả app Electron đang chạy
Get-Process electron,node -ErrorAction SilentlyContinue | Stop-Process -Force

# Xóa dist cũ
Remove-Item -Path dist -Recurse -Force -ErrorAction SilentlyContinue

# Build
npm run desktop:build
```

Chạy file `.exe` trong `dist/win-unpacked/WebChatting.exe`.

### 4. Kiểm Tra Hoạt Động

**Socket server health:**
```
https://web-chatting-socket.onrender.com/health
```
Phải trả về: `{"status":"ok","uptime":...}`

**Console trong Electron:**
- Không còn lỗi 500
- Thấy "Live: Real-time updates" badge
- Socket kết nối thành công

### 5. Cấu Trúc Cuối Cùng

```
Render Services:
├─ web-chatting-tmnv (Next.js)
│  └─ ENV: NEXT_PUBLIC_SOCKET_URL=https://web-chatting-socket.onrender.com
└─ web-chatting-socket (Socket.IO standalone)
   └─ ENV: CORS_ORIGIN=https://web-chatting-tmnv.onrender.com

Desktop App (Electron):
└─ Đọc từ .env: DESKTOP_PROD_URL=https://web-chatting-tmnv.onrender.com
└─ App tự lấy NEXT_PUBLIC_SOCKET_URL từ Next.js

```

## Lưu Ý

- **Free tier Render**: Service có thể sleep sau 15 phút không hoạt động. Lần đầu kết nối sẽ mất ~30-60s để wake up.
- **Cổng (PORT)**: `socket-server.js` tự động dùng `process.env.PORT` (Render tự gán), không cần config.
- **CORS**: Đảm bảo `CORS_ORIGIN` chứa đúng domain app chính.
- **Persistence**: Socket.IO dùng trong memory, khi server restart thì mất hết kết nối. Client tự reconnect.

## Troubleshooting

**Lỗi vẫn 500:**
- Kiểm tra socket service có chạy: `/health`
- Xem Render logs của socket service
- Đảm bảo `NEXT_PUBLIC_SOCKET_URL` đã được set đúng và redeploy

**Desktop app không kết nối:**
- Mở DevTools (F12), xem Console
- Kiểm tra Network tab, tìm request tới socket URL
- Verify `.env` có đúng `DESKTOP_PROD_URL`

**Chat không real-time:**
- Socket connected nhưng không nhận message → kiểm tra các API route socket messages có hoạt động
- Free tier Render: kiểm tra database connection (có thể bị limit)
