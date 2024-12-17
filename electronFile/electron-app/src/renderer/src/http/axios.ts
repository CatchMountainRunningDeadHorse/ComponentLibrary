import axios from 'axios'

const service = axios.create({
    baseURL: '/api',
    timeout: 5000
})

service.interceptors.request.use(
    (confing) => {
        return confing
    }, (error) => {
        return Promise.reject(error)
    }
)

// response拦截器
service.interceptors.response.use(
    (response) => {
        // 对响应数据做些什么
        //console.log("response=>", response)
        if (response.status !== 200) {
            return Promise.reject('error')
        } else {
            const res = response.data
            if (!res.Success) {
                return ''
            }
            if (res.data != '') {
                res.data = JSON.parse(res.data)
            }
            return res
        }
    },
    (error) => {
        // 对响应错误做些什么
        return Promise.reject(error)
    }
)


export default service