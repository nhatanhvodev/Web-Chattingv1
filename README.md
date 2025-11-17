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

### Phát triển Desktop

1. Đảm bảo web dev chạy bình thường: `npm run dev:desktop` sẽ chạy song song Next.js (cổng 3000) và Electron.
2. Electron sẽ load `http://localhost:3000` ở chế độ dev.

```shell
npm run dev:desktop
```

### Build Desktop (Windows / macOS / Linux)

1. Thiết lập biến môi trường `DESKTOP_PROD_URL` trong file `.env` trỏ tới domain Render đã deploy (ví dụ: `https://your-render-domain.onrender.com`).
2. Chạy build:

```shell
setx DESKTOP_PROD_URL "https://your-render-domain.onrender.com"
npm run desktop:build
```

Output installer / artifact sẽ nằm trong thư mục `dist/` (electron-builder mặc định). Bạn có thể phân phối file `.exe` (Windows) hoặc `.dmg`/`.AppImage`.

### Ghi chú

- Hiện tại app desktop tải giao diện từ server Render (cần mạng). Để hỗ trợ offline, cần đóng gói build Next.js và phục vụ qua một HTTP server nội bộ hoặc chuyển sang static export nếu phù hợp logic.
- Có thể bổ sung: auto-update, tray icon, native notifications.
- Thay `YOUR-RENDER-DOMAIN` trong `electron/main.js` bằng domain thực tế.
