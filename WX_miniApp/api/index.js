import { instance } from '../https/instances'
//处理并发请求的接口
export const promiseAll = (...promise) => Promise.all(promise)

export const getData = (data = {}, config = {}) => instance.get('/index/findBanner111', data, config)

export const getData1 = (data = {}, config = {}) => instance.get('/cart/getCartList', data, config)