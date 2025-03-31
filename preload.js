const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getSettings: () => ipcRenderer.sendSync('get-settings'),
  saveSettings: (settings) => ipcRenderer.send('save-settings', settings),
  showClock: () => ipcRenderer.send('show-clock'),
  onThemeChanged: (callback) => ipcRenderer.on('theme-changed', callback),
  onTimeFormatChanged: (callback) => ipcRenderer.on('time-format-changed', callback)
})