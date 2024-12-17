import http from "@utils/request"

import {  IimageCode , IloginByJson , IloginCaptcha , IloginByMobile } from '@types/login'

//图形验证码
export const imageCode = ( data:IimageCode )=>{
    return http.get('/captcha/image', data , { responseType: "arraybuffer" , loading:true }) 
}
//用户登录
export const loginByJson = ( data:IloginByJson )=>{
    return http.post('/u/loginByJson', data , { loading:true }) 
}

//获取个人信息
export const getInfo = ()=>{
    return http.get('/personal/getInfo', { } , { loading:true }) 
}

//获取路由
export const getRouters = ( data:String )=>{
    return http.get(`/personal/getRouters/${data}`, {} , { loading:true }) 
}

//登录动态验证码
export const loginCaptcha = ( data:IloginCaptcha )=>{
    return http.get('/captcha/sendRegisterOrLoginCaptcha',  data  , {  }) 
}

//手机验证码登录
export const loginByMobile = ( data:IloginByMobile )=>{
    return http.post('/u/loginByMobile',  data  , { loading:true }) 
}

//获取AccessToken
export const getAccessToken = ( data:{code:String} )=>{
    return http.get('/oauth/getAccessToken',  data  , {  }) 
}

//检查绑定状态
export const wechatCheck = ()=>{
    return http.get('/personal/wechat/check',  {  }  , {  }) 
}