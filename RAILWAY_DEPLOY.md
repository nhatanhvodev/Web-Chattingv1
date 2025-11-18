# Railway Deployment Guide (Alternative to Fly.io)

## Why Railway?
- Free $5/month credit (no card required initially)
- 512MB RAM per service
- Simpler deployment
- Auto-SSL

## Deploy Socket Server

### Step 1: Sign up
1. Vào https://railway.app/
2. Sign up with GitHub

### Step 2: New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `nhatanhvodev/Web-Chattingv1`

### Step 3: Configure
1. Root Directory: `/` (để mặc định)
2. Start Command: `node socket-server.js`
3. Watch Paths: `socket-server.js`

### Step 4: Add Environment Variables
```
CORS_ORIGIN=*
NODE_ENV=production
PORT=${{PORT}}
```
(Railway tự inject $PORT)

### Step 5: Deploy
Click "Deploy" → Railway sẽ build và chạy

### Step 6: Get URL
- Vào Settings → Generate Domain
- Sẽ có dạng: `web-chatting-socket-production.up.railway.app`

### Step 7: Update CORS
Sau khi deploy Vercel, quay lại Railway:
```
CORS_ORIGIN=https://your-app.vercel.app
```
Redeploy.

### Step 8: Use in Vercel
Thêm env var trên Vercel:
```
NEXT_PUBLIC_SOCKET_URL=https://web-chatting-socket-production.up.railway.app
```

## Monitoring
- Railway Dashboard → Metrics
- Logs: Real-time trong dashboard

## Cost
- Free: $5/month allowance (~100 hours uptime cho socket server nhỏ)
- Paid: $5/month minimum nếu vượt quota

## Test
```powershell
curl https://web-chatting-socket-production.up.railway.app/health
```
