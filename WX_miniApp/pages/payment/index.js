// pages/payment/index.js
import { getData, getData1,promiseAll } from '../../api/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fruits: [
      { id: 1, name: '💕🍋🍅🍊' }
    ],
    loading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
  async sendRequest() {
    // const res = await instance.request({
    //   url:'/mall-api/index/findBanner',
    //   method:'GET'
    // })

    const res = await getData(null).catch((err)=>{
      console.log('33333333333333333333',err)
    })
    this.setData({
      loading:false
    })
    // const res = await getData1().catch((err)=>{
    //   console.log('33333333333333333333',err)
    // })

    //
    // await getData()
    // await getData1()
    // await getData()
    // await getData1()

    //使用promise.all同时发起多个请求
    // const res = await Promise.all([getData(),getData(),getData(),getData()])
    // const res = await promiseAll([getData(),getData(),getData(),getData(),getData(),getData(),getData(),getData(),getData()])
    // for(let i=0;i<res[0].length;i++){
    //   const aaa = await res[0][i]
    //   console.log('1111111111111', aaa)
    // }
    console.log('2222222222222222',res);
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