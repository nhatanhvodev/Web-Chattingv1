# Fly.io Deployment Guide

## Prerequisites
1. Cài Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
   ```powershell
   iwr https://fly.io/install.ps1 -useb | iex
   ```
2. Sign up/login: `flyctl auth signup` hoặc `flyctl auth login`

## Deploy Socket Server

### Step 1: Launch app
```powershell
cd D:\Zolo
flyctl launch --name web-chatting-socket --region sjc --no-deploy
```
(Chọn region gần Vercel: `sjc` San Jose hoặc `lax` LA cho US-West, `iad` Virginia cho US-East)

### Step 2: Set secrets (env vars)
```powershell
flyctl secrets set CORS_ORIGIN=https://your-vercel-app.vercel.app
```
(Thay `your-vercel-app.vercel.app` bằng domain Vercel thực sau khi deploy)

### Step 3: Deploy
```powershell
flyctl deploy
```

### Step 4: Get URL
```powershell
flyctl status
```
URL dạng: `https://web-chatting-socket.fly.dev`

### Step 5: Test health
```powershell
curl https://web-chatting-socket.fly.dev/health
```
Phải trả về: `{"status":"ok","uptime":...}`

## Vercel Deployment

### Step 1: Push code lên GitHub
```powershell
git add vercel.json fly.toml Dockerfile.socket .gitignore
git commit -m "Add Vercel and Fly.io configs"
git push origin master
```

### Step 2: Import vào Vercel
1. Vào https://vercel.com/new
2. Import repo `nhatanhvodev/Web-Chattingv1`
3. Framework Preset: Next.js (auto-detect)
4. Build Command: `prisma generate && next build` (hoặc để mặc định)
5. Output Directory: `.next`

### Step 3: Add Environment Variables
```
DATABASE_URL=postgresql://neondb_owner:YOUR_NEON_PASSWORD@ep-jolly-paper-ad43n1ar-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

UPLOADTHING_SECRET=YOUR_UPLOADTHING_SECRET
UPLOADTHING_APP_ID=YOUR_UPLOADTHING_APP_ID

LIVEKIT_API_KEY=YOUR_LIVEKIT_API_KEY
LIVEKIT_API_SECRET=YOUR_LIVEKIT_API_SECRET
NEXT_PUBLIC_LIVEKIT_URL=YOUR_LIVEKIT_URL

NEXT_PUBLIC_SOCKET_URL=https://web-chatting-socket.fly.dev
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```
(Thay tất cả giá trị YOUR_* bằng giá trị thực từ file .env local)

### Step 4: Deploy
Nhấn "Deploy" → Vercel tự động build & deploy

### Step 5: Update CORS
Sau khi có domain Vercel (ví dụ: `web-chatting-xyz.vercel.app`), cập nhật lại CORS_ORIGIN trên Fly.io:
```powershell
flyctl secrets set CORS_ORIGIN=https://web-chatting-xyz.vercel.app
```

Và redeploy socket:
```powershell
flyctl deploy
```

## Testing

1. Truy cập app Vercel: `https://your-app.vercel.app`
2. Đăng nhập Clerk
3. Tạo server, channel, gửi message
4. Kiểm tra WebSocket badge: "Live: Real-time updates"
5. Mở DevTools → Network → WS → thấy kết nối tới `web-chatting-socket.fly.dev`

## Monitoring

- Vercel logs: https://vercel.com/dashboard → project → Logs
- Fly.io logs: `flyctl logs`
- Fly.io metrics: `flyctl status` và https://fly.io/dashboard

## Cost

- Vercel: Free tier (100GB bandwidth/month, unlimited deployments)
- Fly.io: Free tier ($5 allowance/month, shared-cpu-1x với 256MB RAM miễn phí)
- Neon: Free tier (0.5GB storage, unlimited queries với connection pooling)

Tổng: ~$0/tháng với usage nhỏ.

## Rollback

Nếu gặp vấn đề:
- Vercel: Vào Deployments → chọn deployment cũ → "Promote to Production"
- Fly.io: `flyctl releases` → `flyctl releases rollback <version>`
