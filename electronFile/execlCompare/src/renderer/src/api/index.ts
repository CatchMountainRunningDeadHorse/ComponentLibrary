import { get, post } from '@renderer/http/request'
export const loginByJson = async (data) => {
    return await post('/auth/login', data)
}