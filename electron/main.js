const { app, BrowserWindow } = require('electron');
// Load environment variables from root .env if present
try {
  require('dotenv').config();
} catch (e) {
  // dotenv optional; ignore if not installed
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    backgroundColor: '#1a1b1e',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const prodUrl = process.env.DESKTOP_PROD_URL; // set in .env or system env when building
  const urlToLoad = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : (prodUrl || 'https://YOUR-RENDER-DOMAIN');

  console.log('Electron loading URL:', urlToLoad);
  win.loadURL(urlToLoad);
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
