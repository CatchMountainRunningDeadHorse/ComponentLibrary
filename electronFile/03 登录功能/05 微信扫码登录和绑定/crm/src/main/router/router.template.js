import EventRoute from "./EventRoute"

const routers = new Array();
const path = require('path');

/**
 *  关闭窗口
 */
routers.push(
  new EventRoute('close-window', 'event', (api, data = {}) => {
    api.app.quit()
  })
)

/**
 *  最小化窗口
 */
routers.push(
  new EventRoute('min-window', 'event', (api, data = {}) => {
    api.window.minimize();
  })
)


/**
 *  微信扫码登录
 *  微信绑定
 */
routers.push(
  new EventRoute('wx', 'event', (api, data = {}) => {
    
    let token = data.data?.token;

    const wxWindow = new api.BrowserWindow({
      width: 900,
      height: 670,
      show: false,
      parent:api.window,
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

    wxWindow.on('ready-to-show', () => {
      wxWindow.show()
    })

    //打开微信提供的页面 ==> 后端给前端提供
    wxWindow.loadURL('http://www.xuexiluxian.cn:9999/oauth/wechat');


    //监听url发生改变，如果发生改变触发以下方法
    wxWindow.webContents.on('will-navigate', (e) => {

      const webContents = wxWindow.webContents
      // // 过滤url地址，只监听需要的url
      const filter = {urls: ['*://www.xuexiluxian.cn/oauth/*']}

      webContents.session.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        details.url = details.url.replace("www.xuexiluxian.cn", "www.xuexiluxian.cn:9999")
        details.requestHeaders['WechatOauthType'] = 'login'
        if ( token ) {
          details.requestHeaders['WechatOauthType'] = 'bind'
          details.requestHeaders['Authorization'] = token
        }
        callback({requestHeaders: details.requestHeaders})
      })

      //请求完成
      webContents.session.webRequest.onCompleted(filter, (details) => {
        const params = new URLSearchParams(new URL(details.url).search)
        const code = params.get("code")
        // 1. 通知渲染进程
        // a.绑定：调接口
        if ( token ) {
          api.window.webContents.send('main-to-renderer', {
            name: 'wechat-bind',
            event: 'event',
            data: code
          })
        } else {
          // b.登录：调接口 ==> 主进程给渲染进程通信
          api.window.webContents.send('main-to-renderer', {
            name: 'wechat-login',
            event: 'event',
            data: code
          })
        }
        // 2. 关闭当前窗体
        wxWindow.close()
        // 3. 销毁当前窗体
        wxWindow.destroy()
      })
    })

  })
)



export default routers
