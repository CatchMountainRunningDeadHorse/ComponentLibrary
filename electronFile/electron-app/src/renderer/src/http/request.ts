
import axios from './axios'

const RETRY_TIME = 3 // 重试次数// 执行请求的方法
function request(config, retry = 0) {
  return axios({
    ...config,
  })
    .then((res) => {
      return Promise.resolve(res)
    })
    .catch((error) => {
      if (retry >= RETRY_TIME) {
        // 重试次数超过了限制
        return Promise.reject(error)
      }
      retry++
      // 使用 Promise.reject 手动抛出异常，让 Promise.all 并发请求的方法中的 catch 捕获该异常，从而实现重试机制
      return Promise.reject(error)
    })
}

// 封装 get 请求方法
export function get(url, params = {}, type = 'buss') {
  return request({
    url,
    params,
    method: 'get',
    urlType: type
  })
}

// 封装 post 请求方法
export function post(url, data = {}, type = 'buss') {
  return request({
    url,
    data,
    method: 'post',
    urlType: type
  })
}