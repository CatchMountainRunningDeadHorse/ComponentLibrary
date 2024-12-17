<template>
    <el-dialog
        v-model="dialogVisible"
        :title="roleUpdateId!='' ? '修改角色' : '新增角色' "
        width="600px"
        @close="close"
    >
        <template #default>
            <el-form
                :model="roleForm"
            >
                <el-form-item label="角色名称">
                    <el-input v-model="roleForm.roleName" placeholder="请输入角色名称"></el-input>
                </el-form-item>

                <el-form-item label="权限字符">
                    <el-input v-model="roleForm.rolePerm" placeholder="请输入权限字符"></el-input>
                </el-form-item>

                <el-form-item label="状态">
                    <el-radio-group v-model="roleForm.enabled">
                        <el-radio 
                            v-for="item in dicts.system_global_status"
                            :key="item.id"
                            :label="roleForm.enabled == item.v ? roleForm.enabled : item.v"
                        >{{ item.k }}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="菜单权限">
                    <div class="menu-item">
                        <el-checkbox    
                            v-model="permission.openAll"
                            @change="toggleTreeCollapse"
                        >展开/折叠</el-checkbox>

                        <el-checkbox
                            v-model="permission.selectAll"
                            @change="toggleTreeChecked"
                        >全选/全不选</el-checkbox>

                        <el-checkbox
                            v-model="permission.linkage"
                        >父子(联动/不联动)</el-checkbox>

                        <el-tree
                            ref="menuTreeRef"
                            :data="permission.treeList"
                            :props="permission.treeProps"
                            :check-strictly="!permission.linkage"
                            :default-expand-all="permission.openAll"
                            show-checkbox
                            node-key="id"
                            class="tree"
                        >
                        </el-tree>
                    </div>
                </el-form-item>

                <el-form-item label="备注">
                    <el-input 
                        type="textarea" 
                        placeholder="请输入备注内容"
                        v-model='roleForm.descript'
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
import { ElTree } from 'element-plus'
import { menuTree , IRoleMenuItem  , roleAdd , roleDetail , roleUpdate } from '@api/role'
const props = defineProps({
    dialogVisible:{
        type:Boolean,
        default:false
    },
    roleUpdateId:{
        type:String,
        default:''
    }
})
const dialogVisible = ref(  props.dialogVisible );
const roleUpdateId = ref( props.roleUpdateId );
//表单数据
const roleForm:{
    id?:string | undefined;
    roleName:string;
    rolePerm:string;
    enabled:string;
    descript:string | undefined;
} = reactive({
    "roleName": "",//角色名称
    "rolePerm": "",//角色权限编码
    "enabled": '1',//是否启用（0：禁用；1：启用）
    "descript": '',//描述
})

interface IPermission{
    treeList:IRoleMenuItem[];
    treeProps:{
        label:string;
    };
    linkage:boolean;
    openAll:boolean;
    selectAll:boolean;
}

//菜单树
let permission:IPermission = reactive({
    treeList:[],
    treeProps:{
        label:'name'
    },
    linkage:true,
    openAll:false,
    selectAll:false
})

//tree的dom
const menuTreeRef = ref<InstanceType<typeof ElTree>>();

onBeforeMount(async ()=>{

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    if( proxy ){
        (proxy as any).getDicts(['system_global_status']);
    }
    //获取权限菜单数据
    const menuData = await menuTree();
    permission.treeList = menuData.data;

    //编辑获取详情
    if( roleUpdateId.value !='' ){
        let updateData = await roleDetail( roleUpdateId.value );
        let data = updateData.data;
        let { roleName  , rolePerm , enabled , descript , id  } = data.role;
        roleForm.id = id;
        roleForm.roleName = roleName;
        roleForm.rolePerm = rolePerm;
        roleForm.enabled = enabled;
        roleForm.descript = descript?.toString();
        menuTreeRef.value?.setCheckedKeys( data.permissions );
    }
})



//展开 & 折叠
const toggleTreeCollapse = ( e:boolean )=>{
    let nodeMap = menuTreeRef.value!.store.nodesMap;
    Object.keys(  nodeMap ).forEach(key=>{
        nodeMap[key].expanded = e;
    })
}

//全选 & 全不选
const toggleTreeChecked = ( e:boolean )=>{
    let nodeMap = menuTreeRef.value!.store.nodesMap;
    Object.keys(  nodeMap ).forEach(key=>{
        nodeMap[key].checked = e;
    })
}

//关闭dialog
const emit = defineEmits();
const close = ()=>{
    emit('update:dialogVisible',false);
}



//新增
const addRole = async ()=>{
    await roleAdd({
        permissionIds:menuTreeRef.value!.getCheckedKeys() as string[],
        ...roleForm
    })
}

//修改
const updateRole = async()=>{
    await roleUpdate({
        permissionIds:menuTreeRef.value!.getCheckedKeys() as string[],
        ...roleForm
    })
}

//确认
const onSubmit = async ()=>{
    if( roleUpdateId.value !='' ){
        await updateRole();
    }else{
        await addRole();
    }
    close();
    emit('roleChange');
}
</script>

<style scoped>
.tree{
    margin-top: 0.5rem;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
}
</style>