// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //小程序更新
    // const updateManager = wx.getUpdateManager()
    // updateManager.onUpdateReady(function(){
    //   wx.showModal({
    //     title: '更新提示',
    //     content: '新版本已经准备好，是否重启应用？',
    //     success: (res) => {
    //       if (res.confirm) {
    //             // 强制当前小程序使用新版本并且会重启当前小程序
    //         updateManager.applyUpdate()
    //       }
    //     }
    //   })
    // })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
