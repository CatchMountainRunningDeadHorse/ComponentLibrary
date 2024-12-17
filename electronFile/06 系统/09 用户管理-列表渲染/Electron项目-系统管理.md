# 一、角色管理

1.1 布局

```
<template>
    <div style="height: 100%;">
        <el-container>
            <el-main>
                <el-tabs type="border-card">
                    <el-tab-pane label="角色列表">
                        <!--form-->
                        <el-card class="card-container">
                            <el-form>
                                <el-row :gutter="15">
                                    <el-col :span="8">
                                        <el-form-item label="角色名称" >
                                            <el-input placeholder="请输入角色编码"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="7">
                                        <el-form-item label="角色编码">
                                            <el-input placeholder="请输入角色编码"></el-input>
                                        </el-form-item></el-col>
                                    <el-col :span="9">
                                        <el-form-item label="状态">
                                            <el-select placeholder="请选择启动状态">
                                                <el-option>启用</el-option>
                                                <el-option>禁用</el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item>
                                            <el-button icon="search" type="primary">搜索</el-button>
                                            <el-button icon="refreshLeft">重置</el-button>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </el-card>
                        <!--table-->
                        <el-card>
                            <div class="toolbar">
                                <el-button icon="plus" type="primary">新增</el-button>
                            </div>
                            <el-table :data="tableData" border>
                                <el-table-column type="selection"></el-table-column>
                                <el-table-column prop='roleName' align="center" label="角色名称"></el-table-column>
                                <el-table-column prop='rolePerm' align="center" label="权限字符"></el-table-column>
                                <el-table-column label="是否启用" align="center">
                                    <el-tag>是</el-tag>
                                </el-table-column>
                                <el-table-column prop='createTime' align="center" label="创建时间"></el-table-column>
                                <el-table-column label="操作" align="center" width="220" fixed="right">
                                    <template #default="{ row }">
                                        <div class="sys-table-main-actions">
                                            <el-link icon="edit" type="primary" :underline="false">编辑</el-link>
                                            <el-link icon="delete" type="danger" :underline="false" style="margin: 0 8px">删除</el-link>
                                            <router-link class="el-link el-link--error" type="success" to="/">分配用户</router-link>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-card>
                    </el-tab-pane>
                    <el-tab-pane label="回收站">回收站</el-tab-pane>
                </el-tabs>
            </el-main>
        </el-container>
    </div>
</template>

<script setup lang="ts">
const tableData = [
    {
        roleName:'名称',
        rolePerm:'字符',
        createTime:'创建时间'
    },
    {
        roleName:'名称',
        rolePerm:'字符',
        createTime:'创建时间'
    },
    {
        roleName:'名称',
        rolePerm:'字符',
        createTime:'创建时间'
    }
]
</script>

<style scoped>
.card-container,.toolbar{
    margin-bottom:15px;
}
</style>
```

##### 1.2 api文件

```
import http from "@utils/request";

interface Irole{
    current:string;
    size:string;
    roleName?:string;
    rolePerm?:string;
    enabled?:string;
}

export interface Role {
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

export interface IroleApiResponse {
    code: string;
    msg: string;
    data: {
        records: Role[];
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
export const rolePage = ( data:Irole ):Promise<ApiResponse>=>{
	return http.get<ApiResponse>('/system/role/page', data )
}

```

##### 1.3 时间戳转换标准时间

```
interface Tool{
    dateFormat(date:string | number | Date , fmt?:string):string
}
const tool = {
    dateFormat:function( date , fmt='yyyy-MM-dd hh:mm:ss' ){
        date = new Date( date );
        let o = {
            'M+': date.getMonth() + 1,//月份
            'd+': date.getDate(),     //日
            'h+': date.getHours(),    //小时
            'm+': date.getMinutes(),  //分
            's+': date.getSeconds(),  //秒
            'q+': Math.floor((date.getMonth()+3)/3),//季度
            'S' : date.getMilliseconds() //毫秒
        }
        if(/(y+)/.test(fmt)){
            fmt = fmt.replace( RegExp.$1, (date.getFullYear()+'').substr( 4 - RegExp.$1.length)  );
        }
        for( let k in o ){
            if( new RegExp("("+k+")").test(fmt)  ){
                fmt = fmt.replace( RegExp.$1 , (RegExp.$1.length == 1) ? (o[k]) : (("00"+o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }   
}

export default tool; 
```



# 二、字典

##### 2.1 什么是后台管理系统的字典

```
字典管理主要用来维护和管理公用数据字典。
```



# 三、全局组件

##### 3.1 什么是全局组件

```
Vue全局组件是可以在任何地方使用的组件，而不仅仅局限于某个组件的作用域内。全局组件可以在Vue应用的任何组件中使用，无需额外导入或注册。

通常，在创建全局组件时，我们会在Vue应用的根组件或入口文件中进行注册。在注册之后，该组件就可以在应用的任何地方使用了。
```

##### 3.2 注册全局组件

```
//main.ts

//全局组件-分页
import pagination from '@components/pagination/index.vue'
app.component('pagination', pagination);
```

##### 3.3 分页组件

```
<template>
    <div class="pagination">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 50, 100, 200]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
    currentPage:{
        type:Number,
        default:1
    },
    pageSize:{
        type:Number,
        default:10
    },
    total:{
        type:Number,
        default:10
    }
})
const currentPage = ref(props.currentPage);
const pageSize = ref(props.pageSize);
const emits = defineEmits(['update:currentPage','update:pageSize'])

const handleSizeChange = ( page:number )=>{
    pageSize.value = page;
    emits('update:pageSize',page);
}
const handleCurrentChange = ( page:number )=>{
    currentPage.value = page;
    emits('update:currentPage',page);
}
</script>

<style scoped>
.pagination{
    display: flex;
    justify-content: flex-end;
    margin-top:15px;
}
</style>
```



# 四、新增角色

##### 4.1 菜单权限树

```
export interface IRoleMenuItem {
    id: string;
    name: string;
    parentId: string;
    sort: number;
    path: string;
    query: any;
    component: string;
    cache: number;
    type: number;
    visible: number;
    redirect: string;
    enabled: number;
    perms: string;
    icon: string;
    remark: string | null;
    createBy: string | null;
    createTime: string | null;
    updateBy: string | null;
    updateTime: string | null;
    children?: IRoleMenuItem[];
} 
interface IRoleMenu {
    code: string;
    msg: string;
    data: IRoleMenuItem[];
}
```

##### 4.2 新增角色

```
interface IRoleAdd {
    roleName: string;
    rolePerm: string;
    enabled: string;
    descript: string;
    permissionIds: string[];
}

interface IRoleAddData {
    code: number;
    msg: string;
    data: null;
}
```



# 五、用户管理

##### 5.1 布局

```
<template>
    <div style="height: 100%;">
        <el-container>
            <el-main>
                <el-tabs type="border-card">
                    <el-tab-pane label="用户列表">
                        <el-card>
                            <el-form ref="formRef" :model="searchForm" label-width="100px">
                                <el-row :gutter="15">
                                    <el-col :span="8">
                                    <el-form-item label="用户名称" prop="username">
                                        <el-input placeholder="请输入登录账号" clearable v-model="searchForm.username"/>
                                    </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                    <el-form-item label="真实姓名" prop="realName">
                                        <el-input placeholder="请输入真实姓名" clearable v-model="searchForm.realName"/>
                                    </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                    <el-form-item label="邮箱" prop="email">
                                        <el-input placeholder="请输入用户邮箱" clearable v-model="searchForm.email"/>
                                    </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                    <el-form-item label="手机号码" prop="phone">
                                        <el-input placeholder="请输入手机号码" clearable v-model="searchForm.phone"/>
                                    </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                    <el-form-item label="性别" prop="gender">
                                        <el-select v-model="searchForm.gender" placeholder="请选择用户性别" clearable>
                                        <el-option v-for="item in dicts.system_global_gender" :key="item.v" :label="item.k" :value="item.v"/>
                                        </el-select>
                                    </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                    <el-form-item label="账号状态" prop="enabled">
                                        <el-select v-model="searchForm.enabled" placeholder="请选择账号状态" clearable>
                                        <el-option v-for="item in dicts.system_global_status" :key="item.v" :label="item.k" :value="item.v"/>
                                        </el-select>
                                    </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                    <el-button type="primary" icon="search">搜索</el-button>
                                    <el-button icon="refresh">重置</el-button>
                                    </el-col>
                                </el-row>
                                </el-form>
                        </el-card>
                        <el-card style="margin-top:15px;">
                            <div class="toolbar" style="margin-bottom: 15px;">
                                <el-button type="primary" icon="plus">新增</el-button>
                            </div>
                            <el-table :data="userList" border>
                                <el-table-column align="center" type="selection"/>
                                <el-table-column label="用户姓名" prop="username" align="center"/>
                                <el-table-column label="真实姓名" prop="realName" align="center"/>
                                <el-table-column label="用户类型" prop="userType" width="100px">
                                    <template #default="{ row }">
                                        <div v-if="row.userType == 0 ">普通账号</div>
                                        <div v-if="row.userType == 1 ">超级管理员</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="手机号码" prop="phone" width="150" align="center"/>
                                <el-table-column label="用户性别" prop="gender" align="center">
                                    <template #default="{row}">
                                        <template v-for="item in dicts.system_global_gender">
                                            <div v-if="row.gender == item.v">{{ item.k }}</div>
                                        </template>
                                    </template>
                                </el-table-column>
                                <el-table-column label="账号状态" prop="enabled" align="center">
                                    <template #default="{row}">
                                        <template v-for="item in dicts.system_global_status">
                                            <el-tag v-if="row.enabled == item.v">{{ item.k }}</el-tag>
                                        </template>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="280" fixed="right">
                                    <template #default="{ row }">
                                        <div class="sys-table-main-actions">
                                            <el-link icon="edit" :underline="false" type="primary">编辑</el-link>
                                            <el-link icon="delete" :underline="false" type="danger" style="margin:0 15px;">删除</el-link>
                                            <el-link icon="Refresh" :underline="false" type="success">重置密码</el-link>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <pagination
                                :total="totals"
                                @update:current-page="handleCurrentPageUpdate"
                                @update:page-size="handlePageSizeUpdate"
                            ></pagination>
                        </el-card>
                    </el-tab-pane>
                    <el-tab-pane label="回收站">回收站</el-tab-pane>
                </el-tabs>
            </el-main>
        </el-container>
    </div>
</template>


const searchForm =  reactive({
        current: '1',
        size: '10',
        total: '0',
        username: '',
        realName: '',
        email: '',
        phone: '',
        gender: '',
        enabled: '',
        unitId: ''
})
```

##### 5.2 TS接口类型

```
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
```

