import request from '@utils/request'


export function loginByJson( data ){
	return request({
		url:'/u/loginByJson',
		method:'post',
		data
	})
}