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

  // Strip quotes from env variable if present
  const prodUrl = process.env.DESKTOP_PROD_URL ? process.env.DESKTOP_PROD_URL.replace(/"/g, '') : null;
  const defaultProdUrl = 'https://zolo-livid.vercel.app'; // Hardcode production URL
  const urlToLoad = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : (prodUrl || defaultProdUrl);

  console.log('Electron loading URL:', urlToLoad);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  win.loadURL(urlToLoad);
  win.webContents.openDevTools();

  // Debug events
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', errorCode, errorDescription, validatedURL);
  });

  win.webContents.on('did-finish-load', () => {
    console.log('Page loaded successfully');
  });

  win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log('Console:', message);
  });
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
