"use strict";
const electron = require("electron");
const path$1 = require("path");
const utils = require("@electron-toolkit/utils");
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespace(path$1);
class EventRouter {
  #api = {};
  #routers;
  constructor() {
    this.routers = new Array();
  }
  addRoute(route) {
    this.routers.push(route);
  }
  addRoutes(routers2) {
    this.routers = this.routers.concat(routers2);
  }
  removeRoute(name) {
    for (let i = 0; i < this.routers.length; i++) {
      if (this.routers[i].name === name) {
        this.routers.splice(i, 1);
      }
    }
  }
  router(data) {
    for (let i = 0; i < this.routers.length; i++) {
      let r = this.routers[i];
      if (data.name === r.name && r.callback) {
        r.callback(this.#api, data);
      }
    }
  }
  addApi(key, api) {
    this.#api[key] = api;
  }
}
class EventRoute {
  #name;
  #event;
  #callback;
  constructor(name, event, callback) {
    this.name = name;
    this.event = event;
    this.callback = callback;
  }
}
const routers = new Array();
const path = require("path");
routers.push(
  new EventRoute("close-window", "event", (api, data = {}) => {
    api.app.quit();
  })
);
routers.push(
  new EventRoute("min-window", "event", (api, data = {}) => {
    api.window.minimize();
  })
);
routers.push(
  new EventRoute("wx", "event", (api, data = {}) => {
    let token = data.data?.token;
    const wxWindow = new api.BrowserWindow({
      width: 900,
      height: 670,
      show: false,
      parent: api.window,
      autoHideMenuBar: true,
      ...process.platform === "linux" ? {
        icon: path.join(__dirname, "../../build/icon.png")
      } : {},
      webPreferences: {
        preload: path.join(__dirname, "../preload/index.js"),
        sandbox: false
      }
    });
    wxWindow.on("ready-to-show", () => {
      wxWindow.show();
    });
    wxWindow.loadURL("http://www.xuexiluxian.cn:9999/oauth/wechat");
    wxWindow.webContents.on("will-navigate", (e) => {
      const webContents = wxWindow.webContents;
      const filter = { urls: ["*://www.xuexiluxian.cn/oauth/*"] };
      webContents.session.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        details.url = details.url.replace("www.xuexiluxian.cn", "www.xuexiluxian.cn:9999");
        details.requestHeaders["WechatOauthType"] = "login";
        if (token) {
          details.requestHeaders["WechatOauthType"] = "bind";
          details.requestHeaders["Authorization"] = token;
        }
        callback({ requestHeaders: details.requestHeaders });
      });
      webContents.session.webRequest.onCompleted(filter, (details) => {
        const params = new URLSearchParams(new URL(details.url).search);
        const code = params.get("code");
        if (token) {
          api.window.webContents.send("main-to-renderer", {
            name: "wechat-bind",
            event: "event",
            data: code
          });
        } else {
          api.window.webContents.send("main-to-renderer", {
            name: "wechat-login",
            event: "event",
            data: code
          });
        }
        wxWindow.close();
        wxWindow.destroy();
      });
    });
  })
);
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? {
      icon: path__namespace.join(__dirname, "../../build/icon.png")
    } : {},
    webPreferences: {
      preload: path__namespace.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  const eventRouter = new EventRouter();
  eventRouter.addApi("app", electron.app);
  eventRouter.addApi("window", mainWindow);
  eventRouter.addApi("dialog", electron.dialog);
  eventRouter.addApi("BrowserWindow", electron.BrowserWindow);
  eventRouter.addRoutes(routers);
  electron.ipcMain.handle("renderer-to-main", (e, data) => {
    eventRouter.router(data);
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path__namespace.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.ipcMain.handle("updates", async (event, args) => {
    const mainWindowItem = new electron.BrowserWindow({
      width: 600,
      height: 300,
      show: false,
      autoHideMenuBar: true,
      ...process.platform === "linux" ? {
        icon: path__namespace.join(__dirname, "../../build/icon.png")
      } : {},
      webPreferences: {
        preload: path__namespace.join(__dirname, "../preload/index.js"),
        sandbox: false
      }
    });
    mainWindowItem.on("ready-to-show", () => {
      mainWindowItem.show();
    });
    if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
      mainWindowItem.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    } else {
      mainWindowItem.loadFile(path__namespace.join(__dirname, "../renderer/index.html"));
    }
  });
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
