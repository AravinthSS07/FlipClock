// main.js
const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage, powerSaveBlocker } = require('electron');
const path = require('path');
const Store = require('electron-store').default;
const store = new Store();

// Initialize store for settings
let mainWindow;
let settingsWindow;
let powerSaveBlockerId = null;
let tray = null;

// Set default settings if not already set
if (!store.has('theme')) store.set('theme', 'dark');
if (!store.has('startOnStartup')) store.set('startOnStartup', false);
if (!store.has('use24Hour')) store.set('use24Hour', true);

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets/icon.png')
  });

  mainWindow.loadFile('index.html');
 
  // Start power save blocker when app is opened
  startPowerSaveBlocker();

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (powerSaveBlockerId !== null) {
      powerSaveBlocker.stop(powerSaveBlockerId);
      powerSaveBlockerId = null;
    }
  });

  mainWindow.on('blur', () => {
    if (powerSaveBlockerId !== null) {
      powerSaveBlocker.stop(powerSaveBlockerId);
      powerSaveBlockerId = null;
    }
  });

  mainWindow.on('focus', () => {
    startPowerSaveBlocker();
  });
}

function startPowerSaveBlocker() {
  if (powerSaveBlockerId === null) {
    powerSaveBlockerId = powerSaveBlocker.start('prevent-display-sleep');
    console.log('Power Save Blocker Started');
  }
}

function createSettingsWindow() {
  if (mainWindow) {
    mainWindow.loadFile('settings.html');
  }
}

function showClock() {
  if (mainWindow) {
    mainWindow.loadFile('index.html');
  }
}

/*
function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 400,
    height: 300,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  settingsWindow.loadFile('settings.html');

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}
*/

// Create application menu
function createAppMenu() {
  const menuTemplate = [
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: process.platform === 'darwin' ? 'Cmd+F' : 'F11',
          click: () => {
            if (mainWindow) {
              mainWindow.setFullScreen(!mainWindow.isFullScreen());
            }
          }
        },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' }
      ]
    },
    {
      label: 'Clock',
      click: () => showClock()
    },
    {
      label: 'Settings',
      click: () => createSettingsWindow()
    },
    {
      label: 'Quit',
      role: 'quit',
    }
  ];
  
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

// Create tray icon
function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'assets/icon.png'));
  tray = new Tray(icon);
 
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', click: () => { if (mainWindow) mainWindow.show(); else createMainWindow(); } },
    { label: 'Settings', click: () => createSettingsWindow() },
    { 
      label: 'Toggle Full Screen', 
      click: () => {
        if (mainWindow) {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }
    },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
 
  tray.setToolTip('Flip Clock');
  tray.setContextMenu(contextMenu);
 
  tray.on('click', () => {
    if (mainWindow) mainWindow.show();
    else createMainWindow();
  });
}

app.whenReady().then(() => {
  createMainWindow();
  createTray();
  createAppMenu();
 
  // Set app to start on login if enabled
  app.setLoginItemSettings({
    openAtLogin: store.get('startOnStartup')
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// IPC handlers
ipcMain.on('open-settings', () => {
  createSettingsWindow();
});

ipcMain.on('show-clock', () => {
  showClock();
});

ipcMain.on('toggle-fullscreen', () => {
  if (mainWindow) {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
  }
});

ipcMain.on('get-settings', (event) => {
  event.returnValue = {
    theme: store.get('theme'),
    startOnStartup: store.get('startOnStartup'),
    use24Hour: store.get('use24Hour')
  };
});

ipcMain.on('save-settings', (event, settings) => {
  store.set('theme', settings.theme);
  store.set('startOnStartup', settings.startOnStartup);
  store.set('use24Hour', settings.use24Hour);
 
  // Update startup settings
  app.setLoginItemSettings({
    openAtLogin: settings.startOnStartup
  });
 
  // Notify main window about theme change
  if (mainWindow) {
    mainWindow.webContents.send('theme-changed', settings.theme);
  }
});