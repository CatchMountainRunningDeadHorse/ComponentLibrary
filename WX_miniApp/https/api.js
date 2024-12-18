import WxRequest from './request'
import { toast,modal } from './extendApi'

const instance = new WxRequest({
  baseUrl: 'https://gmall-prod.atguigu.cn/mall-api',
  timeout: 30000,
})

//配置请求拦截器（会覆盖掉默认的配置）
instance.interceptors.request = (config) => {
  //在请求发送之前做点什么...

  //在发送请求之前，需要先判断本地是否存在访问令牌 token
  const token = wx.getStorageSync('token')
  //如果存在 token，就需要在请求头中添加 token 字段
  if (token) {
    config.header['token'] = token
  }

  return config
}

//配置响应拦截器（会覆盖掉默认的配置）
instance.interceptors.response = async (response) => {
  //对服务器响应的数据做点什么...
  const { isSuccess, data } = response
  if (!isSuccess) {
    wx.showToast({
      title: '网络异常请重试',
      icon: 'error'
    })
    return response
  }

  //判断服务器响应的业务状态码
  switch (data.code) {
    //如果返回的状态码等于 200 ，说明请求成功，服务器成功响应了数据
    case 200:
      return data
    //如果返回的状态码等于 208 ，说明没有 token，或者 token 失效
    //就需要让用户登陆或者重新登陆
    case 208:
      const res = await modal({
        content: '鉴权失败，请重新登陆',
        showCancel: false,  // 不需要展示取消按钮
      })
      if (res) {
        //清除之前失效的 token ，同时要清除本地存储的全部信息
        wx.clearStorageSync()
        wx.navigateTo({
          url: '/pages/login/index',
        })
      }
      return Promise.reject(response)
    default:
      toast({
        title: data.message
      })
      return Promise.reject(response)
  }
}
export const getData = async (data = {}, config = {}) => {
  const res = await instance.get('/index/findBanner', data, config)
  return res
}

export const getData1 = async (data = {}, config = {}) => {
  const res = await instance.get('/cart/getCartList', data, config)
  return res
}