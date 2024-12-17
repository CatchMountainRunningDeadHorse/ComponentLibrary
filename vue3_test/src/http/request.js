import axios from 'axios'
import { id,key,baseUrl1 } from '@/utils/constant'
import { ElMessage } from 'element-plus';

const service = axios.create({
    baseURL: baseUrl1,
    timeout: 5000,
    headers: {'X-Custom-Header': 'foobar'}
});

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.url = config.url + `?location=${id}&key=${key}`
    return config;
    }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(
    function (response) {
        // 2xx 范围内的状态码都会触发该函数。
        // 对响应数据做点什么
        let {data} = response
        if(data.code == 200) return data
        else {
            ElMessage({
                message:"查不到数据",
                type:"error"
            })
            return Promise.reject(response);
        }
    }, 
    function (error) {
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么
        ElMessage({
            message:error.message,
            type:"error"
        })
        return Promise.reject(error);
});

export default service