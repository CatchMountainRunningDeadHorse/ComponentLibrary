<template>
    <el-container>
        <el-header height="auto">
            <el-form
                class="role-top"
                :model="roleForm"
                inline
            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input placeholder="请输入角色名称" v-model="roleForm.roleName"></el-input>
                </el-form-item>

                <el-form-item label="角色编码" prop="rolePerm">
                    <el-input placeholder="请输入角色编码" v-model="roleForm.rolePerm"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-select v-model="roleForm.enabled">
                        <el-option
                            v-for="item in dicts.system_global_status"
                            :key="item.v"
                            :label="item.k"
                            :value="item.v"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item style="display: block;">
                    <el-button icon="search" @click="searchRole">搜索</el-button>
                    <el-button icon="refresh" @click="reset">重置</el-button>
                </el-form-item>

                <el-form-item style="display: block;">
                    <el-button icon="documentAdd" @click="addOrupdate" v-auth="'system:role:add'">新增</el-button>
                    <el-button icon="delete" @click="deleteAll" v-auth="'system:role:delete'">删除</el-button>
                </el-form-item>

            </el-form>
        </el-header>
        <el-main>
            <el-table 
                :data="tableData" 
                style="width: 100%"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="roleName" label="角色名称" width="180" />
                <el-table-column prop="rolePerm" label="权限编码" width="180" />
                <el-table-column prop="createTime" label="创建时间" :formatter="rendererDateTime"/>
                <el-table-column label="是否启用">
                    <template #default="{row}">
                        <template v-for="item in dicts.system_global_status">
                            <el-tag v-if="row.enabled == item.v"> {{  item.k  }}</el-tag>
                        </template> 
                    </template>  
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="deletes(scope.row)">删除</el-button>
                        <el-button link type="primary" size="small" @click="addOrupdate(scope.row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>

        <el-footer class="el-footer">
            <el-pagination
                v-model:current-page="currentPage"
                :total="totals"
                :page-size="size"
                :page-sizes="[10, 20, 30, 40]"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </el-footer>

        <!--新增和修改组件-->
        <addRole
            v-if="roleDialog.show"
            v-model:show="roleDialog.show"
            :updateRow="updateRow"
            @change="getRoleList"
        >
        </addRole>
    </el-container>
</template>


<script setup lang="ts" name="角色管理">

import { rolePage , roleDelete  } from './api/role'
import { onBeforeMount , reactive , ref , getCurrentInstance , onActivated } from 'vue';
import addRole from './add-role.vue'
//工具类
import tool from '@utils/tool';

const { proxy } = getCurrentInstance();

onActivated(()=>{
    console.log('被缓存');
})

onBeforeMount(async ()=>{
    console.log('生命周期');
    //传递字典参数
    proxy.sendDicts(['system_global_status']);
    //获取角色列表数据
    getRoleList();
})


//搜索
let roleForm = reactive({
    roleName:'', 
    rolePerm:'',
    enabled:''
})
const searchRole = ()=>{
    getRoleList();
}

//查询数据
let tableData = ref([]);
const getRoleList = async ()=>{

    let { roleName , rolePerm ,enabled  } = roleForm;

    let res = await rolePage({
        current:currentPage.value,
        size:size.value,
        roleName,
        rolePerm,
        enabled,   
    })
    let { records , total  } = res.data;
    tableData.value = records;
    totals.value = total;
}


//重置
const reset = ()=>{
    roleForm.roleName = '';
    roleForm.rolePerm = '';
    roleForm.enabled = '';
    getRoleList();
}

//新增 和 修改数据
let roleDialog = reactive({
    show:false
})

//新增 & 修改 操作
let updateRow = ref('');
const addOrupdate = ( e )=>{

    //修改操作
    if(  e  ){
        updateRow.value = e.id;
    }

    roleDialog.show = true;
    
}


//选中table
let ids = ref([]);
const handleSelectionChange = ( select )=>{
    ids.value = select.map( item => item.id);
}
//批量删除
const deleteAll = async ()=>{
   
    await Promise.all( ids.value.map((id)=> roleDelete( id ) ));
    getRoleList();
    
}

//删除操作
const deletes = async ( row )=>{
   let res = await roleDelete( row.id  );
   if( res.code == 200 ) ElMessage({type:'success',message:'删除成功'});
   getRoleList();
}

//时间戳转换为标准时间
const rendererDateTime = ( row, column, cellValue, index )=>{
    return tool.dateFormat(  cellValue , 'yyyy-MM-dd hh:mm:ss'  );
}

//当前页
let currentPage = ref(1);
//当前页显示个数
let size = ref(10);
//总个数
let totals = ref(0);

//current-page改变
const handleSizeChange = ( e )=>{
   size.value = e;
   getRoleList();
}

//page-size改变
const handleCurrentChange = ( e )=>{
    currentPage.value = e;
    getRoleList();
}

</script>

<style scoped>
.el-footer{
    display: flex;
    justify-content:  flex-end;
}
</style>