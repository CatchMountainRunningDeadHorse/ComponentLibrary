<template>
   <el-container>
    <el-header>
        <el-form>
            <el-form-item style="display: block;">
                <el-button icon="documentAdd" @click="add" v-auth="'teach:subject:add'">新增</el-button>
            </el-form-item>
        </el-form>
    </el-header>
    <el-main>

        <el-table :data="subjectList" style="width: 100%" >
            <el-table-column align="center" label="序号" width="80" type="index"  />
            <el-table-column prop="subjectName" label="科目名称" />
            <el-table-column prop="amount" label="售价" />

            <el-table-column prop="enabled" label="科目状态">
                <template #default="{row}">
                    <template
                        v-for="item in dicts.system_global_status"
                        :key="item.id"
                    >
                        <el-tag v-if="row.enabled == item.v ">{{  item.k }}</el-tag>
                    </template>
                </template>
            </el-table-column>


            <el-table-column label="协议">
                <template #default="{row}">
                    <el-button link type="primary" @click="protocol(row)">查看协议</el-button>
                </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作">
                <template #default>
                    <el-button link type="primary">编辑科目</el-button>
                    <el-button link type="primary">删除科目</el-button>
                </template>
            </el-table-column>

        </el-table>

    </el-main>
    <el-footer>底部</el-footer>
   </el-container>

   <!--新增dialog-->
   <saveDialog 
        v-if="showSave"
        v-model:showSave="showSave"
        @change="getSubject"
   ></saveDialog>
</template>

<script setup lang="ts" name="科目管理">
//vue
import { ref , onBeforeMount , reactive , getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance();
//api
import { subjectPage } from './api/subject'
//组件
import saveDialog from './saveDialog.vue'

//生命周期
onBeforeMount(()=>{
    //传递字典参数
    proxy.sendDicts(['system_global_status']);
    //渲染数据
    getSubject();
})

//科目列表数据
let subject = reactive({
    current:1,
    size:10
})
//渲染数据
let subjectList = ref([]);

//科目列表数据
const getSubject = async ()=>{
    let res = await subjectPage(subject);
    const { records , total } = res.data;
    subjectList.value = records;
    // console.log( records , total   )
}


//新增dialog数据
let showSave = ref( false );

//新增数据
const add = ()=>{
    showSave.value = true;
}
//查看协议
const protocol = ( row )=>{
    // console.log( row );
}

</script>
