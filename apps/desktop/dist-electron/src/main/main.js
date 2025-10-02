"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const url_1 = require("url");
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = (0, path_1.dirname)(__filename);
function createWindow() {
    const mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: (0, path_1.join)(__dirname, '../preload/index.js'),
            sandbox: false,
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });
    mainWindow.webContents.setWindowOpenHandler(details => {
        electron_1.shell.openExternal(details.url);
        return { action: 'deny' };
    });
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
    }
    else {
        mainWindow.loadFile((0, path_1.join)(__dirname, '../renderer/index.html'));
    }
}
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
// IPC handlers for file operations and AI processing
electron_1.ipcMain.handle('process-powerpoint', async () => {
    // TODO: Implement PowerPoint processing logic
    return { success: true, extractedContent: [] };
});
electron_1.ipcMain.handle('analyze-content-gaps', async () => {
    // TODO: Implement gap analysis logic
    return { gaps: [], suggestions: [] };
});
