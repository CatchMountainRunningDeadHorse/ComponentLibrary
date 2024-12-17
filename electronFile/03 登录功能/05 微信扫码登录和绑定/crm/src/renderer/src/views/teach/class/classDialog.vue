<template>

    <el-dialog
        v-model="show"
        title="新增班级"
        @close="close"
    >
        <el-form
            :model="ruleForm"
        >   
            <el-form-item label="班级名称" prop="className">
                <el-input v-model="ruleForm.className"></el-input>
            </el-form-item>

            <el-form-item label="授课方式" prop="teachingMethod">
               <el-radio-group v-model="ruleForm.teachingMethod">
                    <el-radio 
                        v-for="item in dicts.crm_teaching_method"
                        :label="item.v"
                    >
                        {{  item.k }}
                    </el-radio>
               </el-radio-group>
            </el-form-item>

            <el-form-item label="选择科目" prop="subjectName">
                <el-select v-model="ruleForm.subjectName">
                    <el-option
                        v-for="item in subjectList"
                        :key="item.id"
                        :label="item.subjectName"
                        :value="item.id"
                    >{{ item.subjectName  }}</el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="满班人数" prop="fullPeople">
                <el-input v-model="ruleForm.fullPeople"></el-input>
            </el-form-item>

            <el-form-item label="课时" prop="classHour">
                <el-input v-model="ruleForm.classHour"></el-input>
            </el-form-item>

            <el-form-item label="开班时间">
                <el-date-picker
                    v-model="chooseData"
                    type="daterange"
                    unlink-panels
                    range-separator="To"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    @change="studyTime"
                />
                
            </el-form-item>

            <el-form-item label="主讲老师" prop="mainTeacherId">

                <el-select v-model="ruleForm.mainTeacherId">
                    <template #empty>
                        <xlxTableSelect tableSelect="mainTeacherId">
                            <template #header>
                                <el-input placeholder="搜索内容" />
                                <el-button>搜索</el-button>
                            </template>

                            <template #tree>
                                <el-tree 
                                    :data="unitList" 
                                    :props="defaultProps"
                                    @node-click="onTreeClick"
                                />
                            </template>

                            <template #footer>
                                <el-pagination
                                    :page-size="20"
                                    :pager-count="11"
                                    layout="prev, pager, next"
                                    :total="10"
                                />
                            </template>
                        </xlxTableSelect>
                    </template>
                </el-select>
            </el-form-item>

            <el-form-item label="助教老师" prop="assistTeacherId">
                <el-select v-model="ruleForm.assistTeacherId">
                    <template #empty>
                        <xlxTableSelect tableSelect="assistTeacherId">
                            <template #header>
                                <el-input placeholder="搜索内容" />
                                <el-button>搜索</el-button>
                            </template>

                            <template #tree>
                                <el-tree 
                                    :data="unitList" 
                                    :props="defaultProps"
                                    @node-click="onTreeClick"
                                />
                            </template>

                            <template #footer>
                                <el-pagination
                                    :page-size="20"
                                    :pager-count="11"
                                    layout="prev, pager, next"
                                    :total="10"
                                />
                            </template>
                        </xlxTableSelect>
                    </template>
                </el-select>
            </el-form-item>

            <el-form-item label="学管老师" prop="manageTeacherId">
                <el-select v-model="ruleForm.manageTeacherId">
                    <template #empty>
                        <xlxTableSelect 
                            tableSelect="manageTeacherId"
                        >
                            <template #header>
                                <el-input placeholder="搜索内容" />
                                <el-button>搜索</el-button>
                            </template>

                            <template #tree>
                                <el-tree 
                                    :data="unitList" 
                                    :props="defaultProps"
                                    @node-click="onTreeClick"
                                />
                            </template>

                            <template #footer>
                                <el-pagination
                                    :page-size="20"
                                    :pager-count="11"
                                    layout="prev, pager, next"
                                    :total="10"
                                />
                            </template>
                        </xlxTableSelect>
                    </template>
                </el-select>
            </el-form-item>

            <el-form-item label="授课课时" prop="teachingDay">
                <el-checkbox-group v-model="ruleForm.teachingDay">
                    <el-checkbox-button
                        v-for="item in days"
                        :key="item.key"
                        :label="item.label"
                    >
                        {{ item.key }}
                    </el-checkbox-button>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="选择时间段" prop="teachingTime">
                <el-time-select
                    v-model="startTime"
                    :max-time="endTime"
                    placeholder="选择开始时间"
                    start="09:00"
                    step:="00:30"
                    end="23:00"
                >
                </el-time-select> 
               
                <span> 至 </span>

                <el-time-select
                    v-model="endTime"
                    :min-time="startTime"
                    start="09:00"
                    step:="00:30"
                    end="23:00"
                >
                </el-time-select>
            </el-form-item>

        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close">取消</el-button>
                <el-button @click="onSubmit">保存</el-button>
            </span>
        </template>


    </el-dialog>

</template>


<script setup lang="ts">
//组件
import xlxTableSelect from '@components/xlxTableSelect/index.vue'
//api
import { subjectPage  , classAdd  , unitTree } from './api'
//vue
import { reactive, ref ,onBeforeMount , getCurrentInstance } from 'vue'
import { unitList } from '@renderer/views/system/user/api/user';
//接收到的值
const props = defineProps({
    showDialog:Boolean
})
const show = ref(props.showDialog);

//表单数据
const ruleForm = reactive({
    className:'', //班级名称
    teachingMethod:'',//授课方式
    subjectName:'',//科目名称
    fullPeople:'', // 满班人数
    classHour:'', //课时
    beginDate:'', //开班时间
    endDate:'',  //结业时间
    mainTeacherId:'', //讲师
    assistTeacherId:'',//助教
    manageTeacherId:'',//学管
    teachingDay:[],//星期的
    teachingTime:''//时间段
})

let startTime = ref();//开始时间
let endTime = ref();//结束时间
let subjectList = ref([]);//科目列表
let chooseData = ref([]);//开班时间

let unitList = ref([]);//机构树
const defaultProps = { //机构树修改key
  label: 'name',
}
let unitId = ref('');//机构树id

let days = ref([
    {key:'星期一',label:'1'},
    {key:'星期二',label:'2'},
    {key:'星期三',label:'3'},
    {key:'星期四',label:'4'},
    {key:'星期五',label:'5'},
    {key:'星期六',label:'6'},
    {key:'星期日',label:'7'},
])

//生命周期
const { proxy } = getCurrentInstance();
onBeforeMount(async ()=>{
    //传递字典参数
    proxy.sendDicts(['crm_teaching_method']);
    //科目列表
    let subjectData = await subjectPage({
        current:1,
        size:10
    })
    const { records } = subjectData.data;
    subjectList.value = records;

    //用户列表
    //getUserList();
    //机构树
    let unitData = await unitTree();
    unitList.value = unitData.data[0].children;
})

//获取用户列表
// const getUserList = async ()=>{
//     let userData = await userPage({
//         current:1,
//         size:10,
//         unitId:unitId.value
//     })
//     let { total , records  }  = userData.data;
//     userList.value = records;
// }

//关闭dialog
const emit = defineEmits();
const close = ()=>{
  emit('update:showDialog',false);
}

//开班时间选择器
const studyTime = ( val )=>{
    ruleForm.beginDate = chooseData.value[0];
    ruleForm.endDate = chooseData.value[1];
}
//点击tree
const onTreeClick = ( node )=>{
    unitId.value = node.id;
    //getUserList();
}
//点击table
const tableClick = ( row )=>{
    ruleForm.mainTeacherId = row.realName;
}
//保存
const onSubmit = async ()=>{
    ruleForm.teachingDay = ruleForm.teachingDay.toString();
    ruleForm.teachingTime =  startTime.value + '-' + endTime.value;
    let res = await classAdd( ruleForm );
    if( res.code =='200' ){
        close();
        emit('change');
    }
}
</script>