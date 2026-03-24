const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let win;
let timerWindow;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, './preload.cjs')
    }
  });

  win.loadURL('http://localhost:5173'); // Vite dev server

  win.on('closed', () => {
    win = null;
  });
}

function createBottomLeftWindow() {
  if(!timerWindow) {
    const display = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = display.workArea;

    const winWidth = 320;
    const winHeight = 50;

    timerWindow = new BrowserWindow({
      width: winWidth,
      height: winHeight,
      x: 0,
      y: screenHeight,
      frame: false,
      alwaysOnTop: true,
      resizable: true,
      webPreferences: {
        contextIsolation: true,
        preload: path.join(__dirname, './preload.cjs')
      }
    });

    timerWindow.loadURL('http://localhost:5173/timer');
  }
}

ipcMain.on('open-bottom-left-window', () => {
  createBottomLeftWindow();
});

ipcMain.on('window-minimize', () => {
  if (BrowserWindow.getFocusedWindow()) {
    BrowserWindow.getFocusedWindow().minimize();
  }
});

ipcMain.on('timer-close', () => {
  timerWindow.close();
  timerWindow = null;
});

ipcMain.on('app-close', () => {
  BrowserWindow.getAllWindows().forEach(win => win.close());
  app.quit();
});

ipcMain.on('start-activity', (event, args) => {
  if (win) {
    win.webContents.send('start-activity', args);
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});