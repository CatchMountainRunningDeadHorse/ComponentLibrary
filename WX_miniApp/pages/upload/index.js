// pages/upload/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    wx.uploadFile({
      filePath: avatarUrl,  //要上传的文件路径
      name: 'name',  //文件对应的key，服务器需要根据key来获取文件的二进制信息
      url: 'https://gmall-prod.atguigu.cn/mall-api/fileUpload',  //开发者服务器地址、接口地址

      success:(res)=>{
        console.log(res);
      }
    })
    // this.setData({
    //   avatarUrl: avatarUrl,
    // })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})