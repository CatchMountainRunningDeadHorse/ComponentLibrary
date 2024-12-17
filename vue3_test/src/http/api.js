import request from './request'
import request8 from './request8888'

//天气
export function weather(){
    return request({
        url:"/v7/weather/7d",
        method:"get"
    })
}
//实时空气质量
export function nowAir(){
    return request({
        url:"/v7/air/now",
        method:"get"
    })
}

//每日空气质量
export function dayAir(){
    return request({
        url:"/v7/air/5d",
        method:"get"
    })
}

export function getData(data){
    return request8({
        url:data,
        method:"get"
    })
}

export function postData(url,data){
    return request8({
        url:url,
        data:data,
        method:"post"
    })
}

