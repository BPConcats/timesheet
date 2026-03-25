const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { exec } = require('child_process');

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

  // Use this for production builds
  win.loadFile(path.join(__dirname, '../dist/index.html'));

  // Uncomment this section of code to use for development.
  // Run 'npm run start' to start both the Svelte server and the
  // election application.
  /*const devServerUrl = 'http://localhost:5173';

  const loadWithRetry = () => {
    win.loadURL(devServerUrl).catch(() => {
      // Catching the error here prevents the app from crashing on the first fail
    });
  };

  win.webContents.on('did-fail-load', () => {
    console.log("Server not ready, retrying in 1s...");
    setTimeout(loadWithRetry, 1000);
  });

  loadWithRetry();*/

  win.on('closed', () => {
    win = null;
  });
}


function getWindowDisplay(targetWin) {
  if (!targetWin || targetWin.isDestroyed()) return screen.getPrimaryDisplay();
  const winBounds = targetWin.getBounds();
  return screen.getDisplayMatching(winBounds);
}

function createBottomLeftWindow() {
  if(!timerWindow) {
    const display = screen.getDisplayMatching(win.getBounds());
    const { x: displayX, y: displayY, width, height } = display.workArea;

    const winWidth = 320;
    const winHeight = 50;

    const targetX = displayX;
    const targetY = displayY + height;

    timerWindow = new BrowserWindow({
      width: winWidth,
      height: winHeight,
      x: targetX,
      y: targetY - winHeight,
      frame: false,
      alwaysOnTop: true,
      resizable: true,
      webPreferences: {
        contextIsolation: true,
        preload: path.join(__dirname, './preload.cjs')
      }
    });

    // Uncomment this line for local development
    // timerWindow.loadURL('http://localhost:5173');

    // Use this for production builds
    timerWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      hash: 'timer'
    });

    timerWindow.on('closed', () => {
      timerWindow = null;
    });
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

ipcMain.on('timer-stop', () => {
  timerWindow.setSize(320, 320, true);
});

ipcMain.on('timer-resume', () => {
  const display = screen.getDisplayMatching(win.getBounds());
  const { x: displayX, y: displayY, width, height } = display.workArea;

  const winWidth = 320;
  const winHeight = 50;

  const targetX = displayX;
  const targetY = displayY + height;
  timerWindow.setBounds({ x: targetX, y: targetY, width: winWidth, height: winHeight });
});

ipcMain.on('app-close', () => {
  BrowserWindow.getAllWindows().forEach(win => win.close());
  app.quit();
  if (process.platform === 'win32') {
    exec('taskkill /f /im node.exe'); 
  } else {
    exec('pkill -f vite');
  }
});

ipcMain.on('start-activity', (event, args) => {
  if (win) {
    win.webContents.send('start-activity', args);
  }
});

ipcMain.on('save-close', (event, args) => {
  if (win) {
    win.webContents.send('save-close', args);
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
