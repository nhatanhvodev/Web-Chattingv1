# Fullstack Discord Clone: Next.js 13, React, Socket.io, Prisma, Tailwind, MySQL | Full Course 2023

Features:

- Real-time messaging using Socket.io
- Send attachments as messages using UploadThing
- Delete & Edit messages in real time for all users
- Create Text, Audio and Video call Channels
- 1:1 conversation between members
- 1:1 video calls between members
- Member management (Kick, Role change Guest / Moderator)
- Unique invite link generation & full working invite system
- Infinite loading for messages in batches of 10 (tanstack/query)
- Server creation and customization
- Beautiful UI using TailwindCSS and ShadcnUI
- Full responsivity and mobile UI
- Light / Dark mode
- Websocket fallback: Polling with alerts
- ORM using Prisma
- MySQL database using Planetscale
- Authentication with Clerk

### Prerequisites

**Node version 18.x.x**

### Install packages

```shell
npm i
```

### Setup .env file


```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=


DATABASE_URL=

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
```

### Setup Prisma

Add MySQL Database (I used PlanetScale)

```shell
npx prisma generate
npx prisma db push

```

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |
| `dev:desktop`   | Starts Next.js + Electron (desktop dev)   |
| `desktop:build` | Builds production Next.js + desktop app   |

## Desktop (Electron)

### Socket Server Riêng (Khuyến Nghị)

Do Next.js API routes không ổn định với WebSocket trên Render, đã tạo socket server riêng trong `socket-server.js`.

**Xem hướng dẫn chi tiết:** [DEPLOYMENT.md](./DEPLOYMENT.md)

### Phát triển Desktop Local

```shell
# Terminal 1: Next.js dev server
npm run dev

# Terminal 2: Socket server
npm run socket:dev

# Terminal 3: Electron
npm run dev:desktop
```

Thêm vào `.env`:
```
NEXT_PUBLIC_SOCKET_URL=http://localhost:4001
DESKTOP_PROD_URL=http://localhost:3000
```

### Build Desktop Production

```shell
# Đóng tất cả process
Get-Process electron,node -ErrorAction SilentlyContinue | Stop-Process -Force

# Xóa dist cũ
Remove-Item -Path dist -Recurse -Force -ErrorAction SilentlyContinue

# Build
npm run desktop:build
```

Output: `dist/win-unpacked/WebChatting.exe`

### Triển Khai Production

1. **Tạo Socket Service trên Render:**
   - Build: `npm install`
   - Start: `node socket-server.js`
   - ENV: `CORS_ORIGIN=https://web-chatting-tmnv.onrender.com`

2. **Cập nhật App Chính:**
   - Thêm ENV: `NEXT_PUBLIC_SOCKET_URL=https://your-socket-service.onrender.com`
   - Redeploy

3. **Desktop App:**
   - Cập nhật `.env`: `DESKTOP_PROD_URL=https://web-chatting-tmnv.onrender.com`
   - Build và phân phối `.exe`

Chi tiết đầy đủ xem [DEPLOYMENT.md](./DEPLOYMENT.md).
