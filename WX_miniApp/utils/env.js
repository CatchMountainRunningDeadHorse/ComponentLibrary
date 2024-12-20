//小程序环境变量配置
const { miniProgram } = wx.getAccountInfoSync()

const { envVersion } = miniProgram

const env = {
  baseUrl: ''
}

switch (envVersion) {
  //开发版
  case 'develop':
    env.baseUrl = 'https://gmall-prod.atguigu.cn/mall-api'
    break
  //体验版
  case 'trial':
    env.baseUrl = 'https://gmall-prod.atguigu.cn/mall-api'
    break
  //正式版
  case 'release':
    env.baseUrl = 'https://gmall-prod.atguigu.cn/mall-api'
    break
  default:
    env.baseUrl = 'https://gmall-prod.atguigu.cn/mall-api'
    break
}

export { env }