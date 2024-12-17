import http from "@utils/request"

interface IuserPage{
    current:Number;
    size:Number;
    unitId:String;
}

//用户列表
export const userPage = ( data:IuserPage )=>{
    return http.get('/system/user/page', data , { } ) 
}
