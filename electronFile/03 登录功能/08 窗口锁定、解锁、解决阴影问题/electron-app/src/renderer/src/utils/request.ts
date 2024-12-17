import axios from 'axios'

//1. 创建axios对象
const instance = axios.create({
  baseURL: '/api',
});

//2. 请求拦截器
instance.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

//3. 响应拦截器
instance.interceptors.response.use(function (response) {
    return response.data;
  }, function (error) {
    return Promise.reject(error);
});

export default instance;