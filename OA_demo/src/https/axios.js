import axios from 'axios'
import { ElMessage } from 'element-plus'
import { Decrypt, isJson } from './token'
import store from '@/store/index'

//业务api请求地址
// let baseURL = 'https://www.yoyangyun.com/YYT'
let baseURL = '/api'

//登录请求地址
// baseURL2 = "/YYLogin"
let baseURL2 = 'https://www.yoyangyun.com/YYBasic'

// 创建axios实例
const service = axios.create({
  timeout: 5000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// request拦截器
service.interceptors.request.use(
  async (config) => {
    // 在发送请求之前做些什么
    // console.log('store.getters.isTokenExpired', store.getters.isTokenExpired)
    // console.log('config', config)
    //store.dispatch('deleToken')
    if (Object.keys(config).includes('params')) {
      if (JSON.stringify(config.params) != '{}') {
        var moduleJson = JSON.parse(config.params.module)
        if (store.getters.isTokenExpired) {
          var sessionID = await store.dispatch('refreshToken')
          moduleJson.SessionID = sessionID
          config.params.module = JSON.stringify(moduleJson)
        }

        if (moduleJson.SessionID == '') {
          moduleJson.SessionID = store.getters.sessionID
          config.params.module = JSON.stringify(moduleJson)
        }
      }
    }

    switch (config.urlType) {
      case 'login':
        config.baseURL = baseURL2
        break
      case 'buss':
        config.baseURL = baseURL
        break
      default:
        config.baseURL = baseURL
    }

    return config
  },
  (error) => {
    // 对请求错误做些什么
    Promise.reject(error)
  }
)

// response拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么
    //console.log("response=>", response)
    if (response.status !== 200) {
      ElMessage({
        message: '服务器内部错误，请联系管理员',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('error')
    } else {
      store.commit('changeNetworkSuccess', true)
      const res = response.data
      if (Object.keys(res).includes('IsEncrypt') && res.IsEncrypt) {
        res.data = Decrypt(res.data)
      }
      if (!res.Success) {
        ElMessage({
          message: res.Msg,
          type: 'error',
          duration: 3 * 1000
        })
        return ''
      }
      if (res.data != '' && isJson(res.data)) {
        res.data = JSON.parse(res.data)
      }
      return res
    }
  },
  (error) => {
    // 对响应错误做些什么
    store.commit('changeNetworkSuccess', false)
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
