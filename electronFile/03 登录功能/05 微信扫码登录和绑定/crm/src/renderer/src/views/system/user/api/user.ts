import http from "@utils/request"

//用户列表
export const userPage = ( )=>{
    return http.get('/system/user/page', { } , { } ) 
}

//机构列表
export const unitList = ( )=>{
    return http.get('/system/unit/list', { } , { } ) 
}

interface IpostPage{
    current:String;
    size:String;
}
//岗位列表
export const postPage = ( data:IpostPage )=>{
    return http.get('/system/post/page',  data  , { } ) 
}

interface IrolePage{
    current:String;
    size:String;
}
//角色列表
export const rolePage = ( data:IrolePage )=>{
    return http.get('/system/role/page',  data  , { } ) 
}


interface IuserAdd{
    username: String;//用户名
    password: String;//密码
    realName: String;//真实姓名
    email: String;//邮箱
    gender: String;//用户性别（1：男；2：女；0：未知）
    avatar: String;//头像
    remark: String;//备注
    phone: String;//手机号
    enabled: String;//帐号状态（0：禁用；1：正常）
    roleIds: String[];//角色
    postIds: String[];//岗位
    unitId: String;//机构ID
}

//添加用户
export const userAdd = ( data:IuserAdd )=>{
    return http.post('/system/user/add',  data  , { } ) 
}