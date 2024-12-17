import { app, shell, BrowserWindow , ipcMain , dialog } from 'electron'
import * as path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

import EventRouter from "./router/EventRouter";
import routers from "./router/router.template";

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux'
      ? {
          icon: path.join(__dirname, '../../build/icon.png')
        }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  const eventRouter = new EventRouter();
  eventRouter.addApi('app', app)
  eventRouter.addApi('window', mainWindow)
  eventRouter.addApi('dialog', dialog)
  eventRouter.addApi('BrowserWindow', BrowserWindow)
  eventRouter.addRoutes(routers);

  //接收渲染进程，主入口
  ipcMain.handle('renderer-to-main', (e, data) => {
    //data是渲染进程，传递过来的参数
    //eventRouter是一个对象
    eventRouter.router(data);
  })


  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()


  ipcMain.handle('updates', async ( event, args) => {
    const mainWindowItem = new BrowserWindow({
      width: 600,
      height: 300,
      show: false,
      autoHideMenuBar: true,
      ...(process.platform === 'linux'
        ? {
            icon: path.join(__dirname, '../../build/icon.png')
          }
        : {}),
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })


    mainWindowItem.on('ready-to-show', () => {
      mainWindowItem.show()
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindowItem.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      mainWindowItem.loadFile(path.join(__dirname, '../renderer/index.html'))
    }


  })



  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
