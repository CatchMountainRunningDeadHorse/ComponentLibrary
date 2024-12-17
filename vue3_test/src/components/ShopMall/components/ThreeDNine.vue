<template>
    <el-table
        ref="multipleTableRef"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
    >
        <el-table-column type="selection" width="55" />
        <el-table-column label="Date" width="120">
        <template #default="scope">{{ scope.row.registerDate }}</template>
        </el-table-column>
        <el-table-column property="userName" label="Name" width="500" />
        <el-table-column property="userNo" label="Address" show-overflow-tooltip />
    </el-table>
    <el-button type="primary" @click="submitInfo">发送</el-button>
    <div class="com-container flex">
        <el-tag v-for="item in modelNameArr" :key="item.name" type="danger" :class="['tag-item',selectType === item.name ? 'selected':'unselected']" @click="selectRobotType(item.name)">{{item.name}}</el-tag>
    </div>

    <div style="width: 800px;height: 400px;color: #000;border: 1px #000 solid;display: flex;flex-direction: row;justify-content: space-between;">
        <div>
            <el-input v-model="inputText" style="width: 240px" placeholder="Please input" />
            <div @click="selectTypes({id:0,text:'',fileTypes:'单行框'})">单行框</div>
            <el-divider />
            <div @click="selectTypes({id:1,text:'',fileTypes:'多行框'})">多行框</div>
            <el-divider />
            <div @click="selectTypes({id:2,text:'',fileTypes:'数字框'})">数字框</div>
            <el-divider />
            <div @click="selectTypes({id:3,text:'',fileTypes:'日期框'})">日期框</div>
            <el-divider />
            <div @click="selectTypes({id:4,text:'',fileTypes:'下拉框'})">下拉框</div>
        </div>
        <div>
            <div v-for="item in testArr" :key="item.id">{{ item.text }}----{{ item.fileTypes }}</div>
        </div>
    </div>

    <el-button type="info" @click="submit">提交</el-button>





</template>

<script setup>
    import { ref,getCurrentInstance, onMounted, onUnmounted } from 'vue'
    import { getData,postData }from '@/http/api'
    const globalProperties = getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
    const socket = globalProperties.$Tsocket
    const modelNameArr = ref([
        {name:'A-1'},
        {name:'A-2'},
        {name:'A-3'},
        {name:'A-4'},
        {name:'A-5'},
        {name:'A-6'},
    ])
    const selectType = ref('A-1')
    const tableData = ref([])

    const multipleSelection = ref([])

    onMounted(async() => {
        socket.registerCallBack('ThreeDNine',realData)
        let {data} = await getData('getUserList')
        tableData.value = data.data
    })

    onUnmounted(() => {
        socket.unRegisterCallBack('ThreeDNine')
    })

    const selectRobotType = () => {

    }
    const handleSelectionChange = (val) => {
        multipleSelection.value = []
        val.forEach(element => {
            multipleSelection.value.push(element.userNo)
        });
        
    }
    const submitInfo = () => {
        socket.send({
            action:'map',
            socketType:'ThreeDNine',
            chartName:JSON.stringify(multipleSelection.value),
            value:'#fff'
        })
    }
    const realData = () => {
        console.log('回调函数被执行了...');
    }
    const testArr = ref([])
    const inputText = ref('')
    const selectTypes = (e) => {
        e.text = inputText.value
        testArr.value.push(e)
    }


    const submit = async () => {
        const {data} = await postData('updateCon',{account:'3545313',userName:JSON.stringify(testArr.value)})
        console.log('倪总说就开始的科技感牛',data);
        if(data.code === 0){
            let {data} = await getData('getUserList')
            tableData.value = data.data
        }else{
            ElMessage({
                message:data.msg,
                type:"error"
            })
        }
    }
</script>

<style>
    .flex{
        display: flex;
        flex-wrap: wrap;
        padding: 50px 10px 20px 20px;
    }
    .tag-item{
        margin: 5px;
    }
    .selected{
        background-color: rgb(14, 230, 79);
        color: #fff;
    }
    .unselected{
        background-color: rgb(231, 7, 7);
        color: #fff;
    }
</style>
