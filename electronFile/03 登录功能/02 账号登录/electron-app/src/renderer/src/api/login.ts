import request from "@utils/request";
import { UserRuleForm } from '@interface/login'

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

interface UsernameRequest{
	code:string
	msg:string
	data?:string
}

//用户登录
export const loginByJson = ( data:UserRuleForm ):Promise<UsernameRequest>=>{
    return request({
    	url:'/u/loginByJson',
    	method:'post',
		data
    })
}