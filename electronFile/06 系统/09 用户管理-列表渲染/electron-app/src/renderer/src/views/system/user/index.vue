<template>
    <div style="height: 100%;">
        <el-container>
            <el-main>
                <el-tabs type="border-card">
                    <el-tab-pane label="用户列表">
                        <el-card>
                            <el-form ref="formRef" :model="roleForm" label-width="100px">
                                <el-row :gutter="15">
                                    <el-col :span="8">
                                    <el-form-item label="用户名称" prop="username">
                                        <el-input placeholder="请输入登录账号" clearable v-model="roleForm.username"/>
                                    </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                    <el-form-item label="真实姓名" prop="realName">
                                        <el-input placeholder="请输入真实姓名" clearable v-model="roleForm.realName"/>
                                    </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                    <el-form-item label="邮箱" prop="email">
                                        <el-input placeholder="请输入用户邮箱" clearable v-model="roleForm.email"/>
                                    </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                    <el-form-item label="手机号码" prop="phone">
                                        <el-input placeholder="请输入手机号码" clearable v-model="roleForm.phone"/>
                                    </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                    <el-form-item label="性别" prop="gender">
                                        <el-select v-model="roleForm.gender" placeholder="请选择用户性别" clearable>
                                        <el-option v-for="item in dicts.system_global_gender" :key="item.v" :label="item.k" :value="item.v"/>
                                        </el-select>
                                    </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                    <el-form-item label="账号状态" prop="enabled">
                                        <el-select v-model="roleForm.enabled" placeholder="请选择账号状态" clearable>
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


<script setup lang="ts">
import { ref , reactive ,onBeforeMount , getCurrentInstance , ComponentInternalInstance } from 'vue'
import { userPage , Record } from '@api/systemUser'
const roleForm =  reactive({
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
let userList = ref<Record[]>([]);
const totals = ref(0);
onBeforeMount(()=>{
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    if( proxy ){
        (proxy as any).getDicts(['system_global_status','system_global_gender']);
    }
    getUser();
})

const getUser = async ()=>{
    let res = await userPage(roleForm);
    let { records , total } = res.data;
    totals.value = total;
    userList.value = records;
}

//分页-页码
const handleCurrentPageUpdate = ( page:number )=>{
    roleForm.current = page.toString();
    getUser();
}
//分页-一页显示多少条
const handlePageSizeUpdate = ( page:number  )=>{
    roleForm.size = page.toString();
    getUser();
}



</script>