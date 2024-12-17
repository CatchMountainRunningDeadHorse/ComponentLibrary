<template>
    <el-dialog
        v-model="show"
        title="新增科目"
        @close="close"
    >
        <el-form
            :model="form"
        >

            <el-form-item label="科目名称" prop="subjectName">
                <el-input type="text" v-model="form.subjectName"/>
            </el-form-item>

            <el-form-item label="售价" prop="amount">
                <el-input type="text" v-model="form.amount"/>
            </el-form-item>

            <el-form-item label="科目状态" prop="enabled">
                <el-radio-group v-model="form.enabled">
                    <el-radio
                        v-for="item in dicts.system_global_status"
                        :key="item.id"
                        :label="form.enabled==item.v?form.enabled:item.v "
                    >
                        {{ item.k }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            
            <el-form-item label="协议" prop="protocol">
                <wangEditor
                    v-model="form.protocol"
                    @onChange="onProtocolChange"
                ></wangEditor>
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
//api
import { subjectAdd } from './api/subject'
//vue
import { reactive, ref ,onBeforeMount , getCurrentInstance } from 'vue'
//组件
import wangEditor from './wangEditor.vue'
//表单数据
let form = reactive({
    "subjectName": "",//科目名称
    "amount": '',//售价
    "protocol": "",//协议（富文本）
    "enabled": "",//状态（1：启用；0：禁用）
})

//接收到的值
const props = defineProps({
    showSave:Boolean
})
const show = ref(props.showSave);

//生命周期
const { proxy } = getCurrentInstance();
onBeforeMount(async ()=>{
    //传递字典参数
    proxy.sendDicts(['system_global_status']);
})

//关闭dialog
const emit = defineEmits();
const close = ()=>{
  emit('update:showSave',false);
}

//保存
const onSubmit = async ()=>{

    let res = await subjectAdd(form);
    if(res.code == 200){
        //关闭dialog
        close();
        //更新列表
        emit('change');
    }
}

//富文本
const onProtocolChange = ( e:String )=>{
    form.protocol = e;
}
</script>