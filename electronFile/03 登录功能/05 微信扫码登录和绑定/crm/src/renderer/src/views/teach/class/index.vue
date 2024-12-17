<template>
   <el-container>
    <el-header>
        <el-form>
            <el-form-item style="display: block;">
                <el-button icon="documentAdd" @click='showDialog=true' v-auth="'teach:class:add'">新增</el-button>
            </el-form-item>
        </el-form>
    </el-header>
    <el-main>

        <el-table :data="tableData" style="width: 100%" border stripe>
            <el-table-column label="班级名称" prop="className"/>
            <el-table-column label="开班时间" prop="beginDate"/>
            <el-table-column label="学员人数" prop="fullPeople">
                <template #default="{row}">
                    {{ row.applyNum ? row.applyNum : 0  }} / {{ row.fullPeople }}
                </template>
            </el-table-column>

            <el-table-column label="主讲老师" prop="mainTeacherUsername" />
            <el-table-column label="学管老师" prop="manageTeacherUsername"/>
            <el-table-column label="助教老师" prop="assistTeacherUsername"/>
            <el-table-column label="班级状态" prop="status">
                <template #default="{row}">
                    <template
                        v-for="item in dicts.crm_class_status"
                        :key="item.id"
                    >   
                        <el-tag v-if="row.status == item.v ">{{  item.k }}</el-tag>
                    </template>
                </template>
            </el-table-column>

            <el-table-column label="授课方式" prop="teachingMethod">
                <template #default="{row}">
                    <template
                        v-for="item in dicts.crm_teaching_method"
                        :key="item.id"
                    >   
                        <el-tag v-if="row.status == item.v ">{{  item.k }}</el-tag>
                    </template>
                </template>
            </el-table-column>

            <el-table-column label="上课时间" prop="teachingDay" :formatter="transDay" width="200"/>
            
            <el-table-column label="操作" width="150" fixed="right">
                <template #default="{row}">
                    <el-button-group>
                    <el-button text type="primary" icon="Edit">上课点名</el-button>
                    <el-button text type="primary" icon="Plus">添加学员</el-button>
                    <el-button text type="primary" icon="CircleCheck">恢复开班</el-button>
                    <el-button text icon="Edit">编辑班级</el-button>
                    <el-button text type="danger" icon="Delete">删除班级</el-button>
                    </el-button-group>
                </template>
            </el-table-column>

        </el-table>

    </el-main>
    <el-footer>底部</el-footer>
   </el-container>

   <classDialog
        v-model:showDialog="showDialog"
        v-if="showDialog"
        @change="getClass"
   ></classDialog>

 
</template>

<script setup lang="ts" name="班级管理">
//组件
import classDialog from './classDialog.vue'
//api
import { classPage } from './api'
//vue
import { ref , reactive , onBeforeMount , getCurrentInstance  } from 'vue'
//请求参数
let params = reactive({
    current:1,
    size:10
})
//组件数据
let tableData = ref([]);
let showDialog = ref(false);

//生命周期
const { proxy } = getCurrentInstance();
onBeforeMount(()=>{
    //传递字典参数
    proxy.sendDicts(['crm_class_status','crm_teaching_method']);

    getClass();
})

//获取列表数据
const getClass = async ()=>{
    let res = await classPage( params );
    let {  total , records } = res.data;
    tableData.value = records;
    // console.log(  records  )
    //crm_class_status
}

//格式1,2,3转换为星期X
const transDay = ( row, column, cellValue, index )=>{

    if(!cellValue) return '';
    let arr = cellValue.split(',');
    arr.sort().forEach( (item,index)=>{
        switch( item ){
            case '1':
                arr[index] = '星期一';
            break;

            case '2':
                arr[index] = '星期二';
            break;

            case '3':
                arr[index] = '星期三';
            break;

            case '4':
                arr[index] = '星期四';
            break;

            case '5':
                arr[index] = '星期五';
            break;

            case '6':
                arr[index] = '星期六';
            break;

            case '7':
                arr[index] = '星期日';
            break;
        }
    })
    cellValue = arr.toString() + '\n' + row.teachingTime;
    return cellValue;
}

</script>
