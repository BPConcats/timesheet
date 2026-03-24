const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openBottomLeftWindow: () => ipcRenderer.send('open-bottom-left-window'),
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  closeTimer: () => ipcRenderer.send('timer-close'),
  closeApp: () => ipcRenderer.send('app-close'),
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
});