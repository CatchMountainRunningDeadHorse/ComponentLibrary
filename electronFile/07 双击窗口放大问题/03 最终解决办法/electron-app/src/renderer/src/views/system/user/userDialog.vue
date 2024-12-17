<template>
    <el-dialog
        v-model="dialogVisible"
        width="800px"
        :title="userUpdateId!='' ? '修改用户' : '新增用户' "
        @close="close"
    >
        <template #default>
            <el-form
                :model="userForm"
                label-width="90px"
                class="user-editor-form"
            >
                <el-form-item label="用户名" prop="username" class="inline">
                    <el-input v-model="userForm.username" show-word-limit placeholder="请输入用户名" />
                </el-form-item>

                <el-form-item label="密码" prop="password" class="inline" v-if="!userForm.id">
                    <el-input type="password" v-model="userForm.password" show-word-limit placeholder="请输入用户密码" />
                </el-form-item>
                
                <el-form-item label="真实姓名" prop="realName" class="inline">
                    <el-input v-model="userForm.realName" placeholder="请输入真实姓名" />
                </el-form-item>

                <el-form-item label="邮箱" prop="email" class="inline" >
                    <el-input v-model="userForm.email" placeholder="请输入邮箱" />
                </el-form-item>

                <el-form-item label="性别" prop="gender" class="inline" >
                    <el-select v-model="userForm.gender" placeholder="请选择性别">
                        <el-option
                        v-for="item in dicts.system_global_gender"
                        :key="item.v"
                        :label="item.k"
                        :value="userForm.gender==item.v?userForm.gender:item.v "
                        >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="手机号码" prop="phone" class="inline">
                    <el-input v-model="userForm.phone" placeholder="请输入手机号码" />
                </el-form-item>
                
                <el-form-item label="启用状态" prop="enabled" class="inline">
                    <el-radio-group v-model="userForm.enabled">
                        <el-radio
                        v-for="item in dicts.system_global_status"
                        :key="item.v"
                        :label="userForm.enabled == item.v ? userForm.enabled : item.v "
                        :value="item.v"
                        >
                        {{ item.k }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="所属机构" prop="unitId" class="inline" >
                    <el-tree-select
                        class="treeList"
                        v-model="userForm.unitId"
                        placeholder="请选择所属机构"
                        :render-after-expand="false"
                        :data="unitTree"
                        :props="{ label: 'name' }"
                        :check-strictly="true"
                        :auto-expand-parent="true"
                        :default-expand-all="true"
                        node-key="id"
                    />
                </el-form-item>

                <el-form-item label="所属岗位" prop="postIds" class="inline">
                    <el-tree-select
                        class="treeList"
                        v-model="userForm.postIds"
                        placeholder="请选择所属岗位"
                        :render-after-expand="false"
                        :data="postTree"
                        :props="{ label: 'postName' }"
                        :auto-expand-parent="true"
                        :default-expand-all="true"
                        node-key="id"
                        show-checkbox
                        multiple
                    />
                </el-form-item>

                <el-form-item label="分配角色" prop="roleIds" class="inline">
                    <el-tree-select
                        class="treeList"
                        v-model="userForm.roleIds"
                        placeholder="请选择分配角色"
                        :render-after-expand="false"
                        :data="roleTree"
                        :props="{ label: 'roleName' }"
                        :auto-expand-parent="true"
                        :default-expand-all="true"
                        node-key="id"
                        show-checkbox
                        multiple
                    />
                </el-form-item>

                <el-form-item label="备注">
                    <el-input 
                        type="textarea" 
                        placeholder="请输入备注内容"
                        v-model='userForm.remark'
                        :maxlength="200"
                        show-word-limit
                    ></el-input>
                </el-form-item>

            </el-form>
        </template>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="onSubmit">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref , reactive , onBeforeMount ,  getCurrentInstance , ComponentInternalInstance } from 'vue'
import { unitList , IUnitList , IPostPage , postPage , IRole , rolePage ,IUser , userAdd , userGet , userUpdate} from '@api/systemUser'
const props = defineProps({
    dialogVisible:{
        type:Boolean,
        default:false
    },
    userUpdateId:{
        type:String,
        default:''
    }
})
const dialogVisible = ref(  props.dialogVisible );
const userUpdateId = ref( props.userUpdateId );
//表单数据
let userForm = reactive<Partial<IUser>>({
    username: '',
    password: '',
    realName: '',
    email: '',
    gender:'',
    phone:'',
    enabled:'',
    unitId:'',
    postIds:[],
    roleIds:[],
    remark:''
})

//所属机构
let unitTree = ref<IUnitList[]>([]);
const getUnitList = async ()=>{
    let res = await unitList();
    unitTree.value = res.data;
}
//所属岗位
let postTree = ref<IPostPage[]>([]);
const getPostPage = async ()=>{
    let res = await postPage();
    let { records } = res.data;
    postTree.value = records;
}
//角色列表
let roleTree = ref<IRole[]>([]);
const getRolePage = async ()=>{
    let res = await rolePage();
    let { records } = res.data;
    roleTree.value = records;
}

onBeforeMount(async ()=>{
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    if( proxy ){
        (proxy as any).getDicts(['system_global_gender','system_global_status']);
    }
    //编辑获取详情
     if( userUpdateId.value !='' ){
        let updateData = await userGet( userUpdateId.value );
        let { postIds ,  roleIds  , user } = updateData.data;
        Object.assign(userForm,user);
        userForm.roleIds = roleIds;
        userForm.postIds = postIds;
    }
    //所属机构
    getUnitList();
    //所属岗位
    getPostPage();
    //角色列表
    getRolePage();
})

//关闭dialog
const emit = defineEmits();
const close = ()=>{
    emit('update:dialogVisible',false);
}

//添加
const addUser = ()=>{
    userAdd(userForm);
}

//修改
const updateUser = ()=>{
    userUpdate(userForm);
}


//确认
const onSubmit = async ()=>{
    if( userUpdateId.value !='' ){
        await updateUser();
    }else{
        await addUser();
    }
    emit('userChange');
    close();
}
</script>

<style lang="scss" scoped>
.user-editor-form {
  :deep(.inline) {
    display: inline-flex;
    vertical-align: middle;
    width: 50%;
  }

  .treeList {
    padding: 2px;
    width: 100%;
  }
}
.inline{
    display: inline-flex;
    vertical-align: middle;
    width: 50%;
}
</style>