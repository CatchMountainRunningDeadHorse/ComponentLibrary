import request from "@utils/request";
import { UserRuleForm , PhoneCodeForm , PhoneRuleForm } from '@interface/login'

interface ILoginRequest{
	code:string
	msg:string
	data?:string | null
}

//图形验证码
export const captchaImage = ( params:{
	key:string
} ):Promise<ArrayBuffer>=>{
    return request({
    	url:'/captcha/image',
		responseType:'arraybuffer',
		params
    })
}

//用户登录
export const loginByJson = ( data:UserRuleForm ):Promise<ILoginRequest>=>{
    return request({
    	url:'/u/loginByJson',
    	method:'post',
		data
    })
}

//登录动态验证码
export const loginCaptcha = ( data:PhoneCodeForm ):Promise<ILoginRequest>=>{
    return request({
    	url:'/captcha/sendRegisterOrLoginCaptcha',
		params:data
    })
}

//手机验证码登录
export const loginByMobile = ( data:PhoneRuleForm ):Promise<ILoginRequest>=>{
    return request({
    	url:'/u/loginByMobile',
    	method:'post',
		data
    })
}
