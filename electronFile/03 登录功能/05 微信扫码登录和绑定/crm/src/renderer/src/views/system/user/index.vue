<template>
    <el-button link type="primary" size="small" v-auth="'system:user:add'" @click="add">新增</el-button>

    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="username" label="用户名称" width="180" />
        <el-table-column prop="realName" label="真实姓名" width="180" />
        <el-table-column prop="userType" label="用户类型" />
        <el-table-column prop="gender" label="用户性别" />
        <el-table-column prop="enabled" label="账户状态" />
        <el-table-column fixed="right" label="操作">
            <template #default>
                <el-button link type="primary" size="small">删除</el-button>
                <el-button link type="primary" size="small">修改</el-button>
            </template>
        </el-table-column>
    </el-table>

    <addUser
        v-if="roleDialog.show"
        v-model:show="roleDialog.show"
        @change="getUser"
    >
    </addUser>

</template>

<script setup lang="ts">
import { onBeforeMount, reactive , ref  } from 'vue';
import { userPage } from './api/user'
import addUser from './add-user.vue'

let tableData = ref([]);
let roleDialog = reactive({
    show:false
})

onBeforeMount(()=>{
    getUser();
})  

const getUser = async ()=>{
    const res = await userPage();
    const { records } = res.data;
    tableData.value = records;
}

//添加用户
const add = ()=>{
    roleDialog.show = true;
}
</script>