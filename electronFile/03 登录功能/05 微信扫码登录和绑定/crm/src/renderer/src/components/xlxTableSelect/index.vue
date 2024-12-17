<template>
    <div>
        <slot name="header"></slot>    
    </div>
    <div>
        <div>
           <slot name="tree"></slot>
        </div>
        <div>

            <el-table :data="userList" @row-click="tableClick">
                <el-table-column label="用户名称" prop="username"></el-table-column>
                <el-table-column label="真实姓名" prop="realName"></el-table-column>
            </el-table> 
        </div>
    </div>
    <div>
        <slot name="footer"></slot>    
    </div>
</template>

<script setup lang="ts">
//vue
import { ref  , onBeforeMount } from 'vue'
//接收到的值
const props = defineProps({
    tableSelect:String
})
const tableSelectData = ref(props.tableSelect);
//api
import { userPage } from '@api/user'
//用户列表
let userList = ref([]);
//生命周期
onBeforeMount(()=>{
    //用户列表
    getUserList();
})

//获取用户列表
const getUserList = async ()=>{
    let userData = await userPage({
        current:1,
        size:10,
        unitId:''
    })
    let { total , records  }  = userData.data;
    userList.value = records;
}

const tableClick = ( row )=>{
    //接收参数=>tableSelectData
    //console.log( row.realName )
    //console.log( tableSelectData.value   )
    //emit('change',tableSelectData.value )
}

</script>