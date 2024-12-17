import axios from './axios'


const request = (config) => {
    return axios({
        ...config
    })
        .then((res) => {
            return Promise.resolve(res)
        })
        .catch((error) => {
            return Promise.reject(error)
        })
}


export function get(url, params = {}, type = 'buss') {
    return request({
        url,
        params,
        method: 'get',
        urlType: type
    })
}
// 封装 get 请求方法
// export function get(url, params = {}, type = 'buss') {
//     return request({
//         url,
//         params,
//         method: 'get',
//         urlType: type
//     })
// }

// 封装 post 请求方法
export function post(url, data = {}, type = 'buss') {
    console.log(url,data);
    
    return request({
        url,
        data,
        method: 'post',
        urlType: type
    })
}

// 封装 put 请求方法
export function put(url, data = {}, type = 'buss') {
    return request({
        url,
        data,
        method: 'put',
        urlType: type
    })
}

// 封装 delete 请求方法
export function del(url, params = {}, type = 'buss') {
    return request({
        url,
        params,
        method: 'delete',
        urlType: type
    })
}