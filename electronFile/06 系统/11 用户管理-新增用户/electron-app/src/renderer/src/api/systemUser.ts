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

export interface IUnitList{
    address: string;
    code: string;
    codeseq: string;
    contact: string;
    createBy: string;
    createTime: number;
    delFlag: number;
    email: string;
    enabled: number;
    id: string;
    leaderId: string | null;
    mobile: string;
    name: string;
    parentId: string;
    system: number;
    updateBy: string | null;
    updateTime: number | null;
    web: string;
}

interface IUnitListData{
    code:string;
    msg:string;
    data:IUnitList[]
}
//机构列表
export const unitList = ():Promise<IUnitListData>=>{
	return http.get<IUnitListData>('/system/unit/list' )
}


export interface IPostPage {
    id: string; // 岗位ID
    postName: string; // 岗位名称
    postCode: string; // 岗位编码
    sort: number; // 排序
    enabled: number; // 是否启用（1：启用；0：禁用）
    remark: string | null; // 备注
    createBy: string | null;
    createTime: string | null;
    updateBy: string | null;
    updateTime: string | null;
}
  
interface IPostPageData {
    code: string;
    msg: string;
    data: {
      records: IPostPage[];
      total: number;
      size: number;
      current: number;
      orders: any[];
      optimizeCountSql: boolean;
      searchCount: boolean;
      countId: string | null;
      maxLimit: number | null;
      pages: number;
    };
}

//岗位列表
export const postPage = ():Promise<IPostPageData>=>{
	return http.get<IPostPageData>('/system/post/page' )
}


export interface IRole {
    id: string;
    roleName: string;
    rolePerm: string;
    unitId: string;
    dataPrivileges: number;
    enabled: number;
    createBy: string | null;
    createTime: number | null;
    updateBy: string | null;
    updateTime: number | null;
    descript: string | null;
}

interface IroleApiResponse {
    code: string;
    msg: string;
    data: {
        records: IRole[];
        total: number;
        size: number;
        current: number;
        orders: any[];
        optimizeCountSql: boolean;
        searchCount: boolean;
        countId: string | null;
        maxLimit: number | null;
        pages: number;
    };
}
//角色列表
export const rolePage = ():Promise<IroleApiResponse>=>{
	return http.get<IroleApiResponse>('/system/role/page')
}


export interface IUser {
    username?: string; // 用户名
    password?: string; // 密码
    realName?: string; // 真实姓名
    email?: string | null; // 邮箱
    gender?: string; // 用户性别（1：男；2：女；0：未知）
    avatar?: string | null; // 头像
    remark?: string | null; // 备注
    phone?: string; // 手机号
    enabled?: string; // 帐号状态（0：禁用；1：正常）
    roleIds?: string[]; // 角色
    postIds?: string[]; // 岗位
    unitId?: string; // 机构ID
}

interface IUserAdd{
    code:string;
    msg:string;
    data:null;
}
  
//添加用户
export const userAdd = ( data:IUser):Promise<IUserAdd>=>{
	return http.post<IUserAdd>('/system/user/add',data)
}
