import http from "@utils/request";

interface IUsersList{
    current:string;
    size:string;
    username?:string;
    realName?:string;
    email?:string;
    phone?:string;
    gender?:string;
    enabled?:string;
    unitId?:string;
}

export interface Record {
    id: string;
    username: string; // 用户名
    realName: string; // 真实姓名
    userType: number; // 用户类型（0：普通账号；1：超级管理员）
    email: string; // 用户邮箱
    phone: string; // 手机号码
    gender: number; // 用户性别（1：男；2：女；0：未知）
    avatar: string; // 头像路径
    enabled: number; // 帐号状态（0：禁用；1：正常）
    delFlag: number; // 是否删除（0：有效；1：删除）
    loginIp: string; // 最后登陆IP
    loginDate: number; // 最后登陆时间
    createBy: null | string;
    createTime: number;
    updateBy: string;
    updateTime: number;
    remark: null | string; // 备注
}
  
interface IUserListData {
    records: Record[];
    total: number;
    size: number;
    current: number;
    orders: any[];
    optimizeCountSql: boolean;
    searchCount: boolean;
    countId: null;
    maxLimit: null;
    pages: number;
}
  
interface IUserListRes {
    code: string;
    msg: string;
    data: IUserListData;
}

//用户列表
export const userPage = ( data:IUsersList ):Promise<IUserListRes>=>{
	return http.get<IUserListRes>('/system/user/page', data )
}
