"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const icon = path.join(__dirname, "../../resources/icon.png");
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    frame: false,
    //无边框窗口
    resizable: false,
    //无法调整窗口大小
    // titleBarStyle: 'hidden',//隐藏标题
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.on("close", () => {
    console.log("关闭窗口了");
  });
  electron.ipcMain.handle("custom-adsorption", (event, res) => {
    let x = res.appX;
    let y = res.appY;
    mainWindow.setPosition(x, y);
  });
  electron.ipcMain.handle("close-login", () => {
    mainWindow.close();
  });
  electron.ipcMain.handle("resize-window", () => {
    mainWindow.setSize(1200, 720);
    mainWindow.setMinimumSize(1e3, 500);
    mainWindow.center();
    mainWindow.setResizable(true);
  });
  electron.ipcMain.handle("out-login", () => {
    mainWindow.setSize(900, 670);
    mainWindow.center();
    mainWindow.setResizable(false);
  });
  electron.ipcMain.handle("win-close", () => {
    electron.app.exit();
  });
  electron.ipcMain.handle("min-win", () => {
    mainWindow.minimize();
  });
  electron.ipcMain.handle("max-win", () => {
    if (mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
    } else {
      mainWindow.setFullScreen(true);
    }
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
