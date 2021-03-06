import { app, BrowserWindow, protocol } from 'electron';
import path from 'path';
import { Constants } from './constants';
import { Editor } from './main/editor';
import { MainWindow } from './main/main.window';
import { Prefs } from './preferences';
// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

Prefs.createInstance({
  x: 0, y: 0,
  width: 1200, height: 800,
  maximized: true,
  lastPath: null,
});

const createWindow = (): void => {
  const mainWindow = new MainWindow({
    width: 1200,
    height: 800,
    maximizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  Constants.setup();
  protocol.interceptFileProtocol(Constants.protocolPrefix, (request, callback) => {
    const url = request.url.substr(Constants.protocol.length);
    callback({ path: path.normalize(`${Constants.staticDir}/${url}`) });
  });

  new Editor(mainWindow);

  if (!app.isPackaged) mainWindow.webContents.openDevTools();
};

app.on('ready', createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
