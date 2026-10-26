import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;
let overlayWindow: BrowserWindow | null = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: 'CuePilot - Control Center'
  });

  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (overlayWindow) overlayWindow.close();
  });
}

function createOverlayWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width } = primaryDisplay.workAreaSize;

  overlayWindow = new BrowserWindow({
    width: 600,
    height: 180,
    x: Math.floor(width / 2 - 300),
    y: 50,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  overlayWindow.loadFile(path.join(__dirname, '../overlay.html'));

  overlayWindow.on('closed', () => {
    overlayWindow = null;
  });
}

app.whenReady().then(() => {
  createMainWindow();
  createOverlayWindow();
});

ipcMain.on('update-prompt', (event, data) => {
  if (overlayWindow) {
    overlayWindow.webContents.send('display-prompt', data);
  }
});
