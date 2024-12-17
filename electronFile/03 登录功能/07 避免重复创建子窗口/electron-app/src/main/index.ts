import { app, shell, BrowserWindow , ipcMain , screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1050,
    height: 700,
    resizable:false,
    titleBarStyle:'hidden',
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })


  //子窗口的对象
  const context = {
    // 是否退出应用
    allowQuitting: false,
    //显示 & 隐藏窗口
    isShow:false,
    //创建窗口的对象
    listWindow:null
  }
  //显示窗口
  const showWindow = ()=>{
    if( context.listWindow && !context.listWindow.isDestroyed() ){
      context.isShow = true;
      context.listWindow.show();
    }
  }
  //隐藏窗口
  const hideWindow = ()=>{
    if( context.listWindow && !context.listWindow.isDestroyed() ){
      context.isShow = false;
      context.listWindow.hide();
    }
  }
  //创建子窗口
  const createListWindow = ()=>{
    //创建窗口
    context.listWindow = new BrowserWindow({
      width: 400,
      height: 100,
      show: false,
      frame:false,
      resizable:false,
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })
    //显示窗口
    context.listWindow.on('ready-to-show', () => {
      
      let winHeight = screen.getPrimaryDisplay().bounds.height;
      context.listWindow.setBounds({
        y:winHeight-150
      })

      context.listWindow.show();
    })

    context.isShow = true;

    //关闭窗口
    context.listWindow.on('close',()=>{
       // 如果此时，应用并没有被退出，则终止默认行为，并且隐藏主窗口
       if (context.allowQuitting == false ) {
        hideWindow();
      } else {
        context.listWindow = null;
      }
    })


    //对应的页面
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      context.listWindow.loadURL(process.env['ELECTRON_RENDERER_URL']+'/#/list')
    } else {
      context.listWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
  }

  ipcMain.handle('new-list',()=>{
    if( context.listWindow == null ){
      createListWindow();
    }else{

      if(  context.isShow ){
        hideWindow();
      }else{
        showWindow();
      }
    }
  })

  if( context ){
    ipcMain.handle('custom-list',(event,res)=>{
      let x = res.appX;
      let y = res.appY;
      context.listWindow.setPosition(res.appX,res.appY);
    })
  }

  if( context ){
    ipcMain.handle('close-list',()=>{
      hideWindow();
    })
  }

  //拖拽窗口
  ipcMain.handle('custom-adsorption',(event,res)=>{
    let x = res.appX;
    let y = res.appY;
    mainWindow.setPosition(res.appX,res.appY);
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
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
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
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
