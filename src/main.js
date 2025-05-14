const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.maximize()
  //Не забыть 
  //win.setMenuBarVisibility(false)⁡
  win.loadFile(path.join(__dirname, 'views', 'index.html'))
    .then(() => console.log('Page loaded successfully'))
    .catch(err => {
      console.error('Failed to load page:', err);
      win.loadURL(`data:text/html,<h1>Error loading application</h1><p>${err.message}</p>`);
    });

  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

