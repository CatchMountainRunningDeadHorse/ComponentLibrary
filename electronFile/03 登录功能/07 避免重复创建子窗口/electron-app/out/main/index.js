"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const icon = path.join(__dirname, "../../resources/icon.png");
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 1050,
    height: 700,
    resizable: false,
    titleBarStyle: "hidden",
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  const context = {
    // 是否退出应用
    allowQuitting: false,
    //显示 & 隐藏窗口
    isShow: false,
    //创建窗口的对象
    listWindow: null
  };
  const showWindow = () => {
    if (context.listWindow && !context.listWindow.isDestroyed()) {
      context.isShow = true;
      context.listWindow.show();
    }
  };
  const hideWindow = () => {
    if (context.listWindow && !context.listWindow.isDestroyed()) {
      context.isShow = false;
      context.listWindow.hide();
    }
  };
  const createListWindow = () => {
    context.listWindow = new electron.BrowserWindow({
      width: 400,
      height: 100,
      show: false,
      frame: false,
      resizable: false,
      autoHideMenuBar: true,
      ...process.platform === "linux" ? { icon } : {},
      webPreferences: {
        preload: path.join(__dirname, "../preload/index.js"),
        sandbox: false
      }
    });
    context.listWindow.on("ready-to-show", () => {
      let winHeight = electron.screen.getPrimaryDisplay().bounds.height;
      context.listWindow.setBounds({
        y: winHeight - 150
      });
      context.listWindow.show();
    });
    context.isShow = true;
    context.listWindow.on("close", () => {
      {
        hideWindow();
      }
    });
    if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
      context.listWindow.loadURL(process.env["ELECTRON_RENDERER_URL"] + "/#/list");
    } else {
      context.listWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
    }
  };
  electron.ipcMain.handle("new-list", () => {
    if (context.listWindow == null) {
      createListWindow();
    } else {
      if (context.isShow) {
        hideWindow();
      } else {
        showWindow();
      }
    }
  });
  if (context) {
    electron.ipcMain.handle("custom-list", (event, res) => {
      res.appX;
      res.appY;
      context.listWindow.setPosition(res.appX, res.appY);
    });
  }
  if (context) {
    electron.ipcMain.handle("close-list", () => {
      hideWindow();
    });
  }
  electron.ipcMain.handle("custom-adsorption", (event, res) => {
    res.appX;
    res.appY;
    mainWindow.setPosition(res.appX, res.appY);
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
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
