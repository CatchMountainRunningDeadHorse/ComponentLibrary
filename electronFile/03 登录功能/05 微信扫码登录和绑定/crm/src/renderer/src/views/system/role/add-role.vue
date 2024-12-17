<template>
    <el-dialog 
        v-model="show" 
        title="新增角色"
        @close="close"
    >
      <template #default>
        <el-form
          ref="formRef"
          :model="deForm"
          :rules="formRules"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input placeholder="请输入角色名称" v-model="deForm.roleName"/>
          </el-form-item>
          <el-form-item label="权限字符" prop="rolePerm">
            <el-input placeholder="请输入权限字符" v-model="deForm.rolePerm"/>
          </el-form-item>
          <el-form-item label="状态" prop="enabled">
            <el-radio-group v-model="deForm.enabled">
              <el-radio
                v-for="item in dicts.system_global_status"
                :key="item.id"
                :label="deForm.enabled==item.v?deForm.enabled:item.v "
              >
                {{ item.k }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="菜单权限">
            <div class="item-menu">
              <el-checkbox
                v-model="permission.openAll"
                @change="toggleTreeCollapse"
              >
                展开/折叠
              </el-checkbox>
              
              <el-checkbox
                v-model="permission.selectAll"
                @change="toggleTreeChecked"
              >
                全选/全不选
              </el-checkbox>
              <el-checkbox v-model="permission.linkage">
                父子(联动/不联动)
              </el-checkbox>
           
              <el-tree
                ref="treeRef"
                :data="permission.treeList"
                :props="permission.treeProps"
                :check-strictly="!permission.linkage"
                :default-expand-all="permission.openAll"
                show-checkbox
                node-key="id"
                class="tree"
              />

            </div>
          </el-form-item>

          <el-form-item label="备注" prop="descript">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="deForm.descript"
              :maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </template>

      <template #footer>
        <span class="dialog-footer">
          <el-button>取消</el-button>
          <el-button type="primary" @click="onSubmit"> 确认 </el-button>
        </span>
      </template>

    </el-dialog>
</template>

<script setup lang="ts">
import { menuTree , roleAdd  , roleGet , roleUpdate  } from './api/role'
import { ref ,  defineEmits , reactive , getCurrentInstance , onBeforeMount  } from 'vue'
//接收到的值
const props  = defineProps({
    show:Boolean,
    updateRow:String,
})
const show = ref(props.show);
const updateRow = ref(props.updateRow);

//关闭dialog
const emit = defineEmits();
const close = ()=>{
  emit('update:show',false);
}

//表单数据
const deForm = reactive({
  id: '', //序号
  roleName: "", //角色名称
  rolePerm: "", //角色权限字符
  enabled: '1', //状态
  descript: ""  //备注
})
//表单验证规则
const formRules = reactive({
  roleName: [
    {required: true, message: "请填写角色名称", trigger: "blur"}
  ],
  rolePerm: [
    {required: true, message: "请填写权限字符", trigger: "blur"}
  ]
})

//树数据
const treeRef = ref();
const permission = reactive({
  treeList:[],
  treeProps:{
    label:'name'
  },
  linkage:true,    //父子不互相关联
  openAll:false,  //是否默认展开所有节点
  selectAll:false
})


const { proxy } = getCurrentInstance();
onBeforeMount(async ()=>{

  //传递字典参数
  proxy.sendDicts(['system_global_status']);
  //获取菜单权限树
  let res = await menuTree();
  permission.treeList = res.data;

  if( updateRow.value ){
    let res = await roleGet(updateRow.value);
    //permissions
    let { id , roleName , rolePerm , enabled , descript } = res.data.role;
    deForm.id = id;
    deForm.roleName = roleName;
    deForm.rolePerm = rolePerm;
    deForm.enabled = enabled;
    deForm.descript = descript;
    treeRef.value.setCheckedKeys( res.data.permissions );
  }

})


//展开 &  折叠
const toggleTreeCollapse = ( e )=>{
  const nodeMap = treeRef.value.store.nodesMap;
  Object.keys( nodeMap ).forEach(key=>{
    nodeMap[key].expanded = e;
  })
}
//全选 &  全不选
const toggleTreeChecked = (e)=>{
  const nodeMap = treeRef.value.store.nodesMap;
  Object.keys( nodeMap ).forEach(key=>{
    nodeMap[key].checked = e;
  })
}

//修改：
const update = async ()=>{
  deForm.permissionIds = treeRef.value.getCheckedKeys();
  let res = await roleUpdate( deForm );
  if( res.code == '200' ) ElMessage({ type:'success',message:'修改角色成功'});
}
//新增：
const add = async ()=>{
  deForm.permissionIds = treeRef.value.getCheckedKeys();
  let res = await roleAdd( deForm );
  if( res.code == '200' ) ElMessage({ type:'success',message:'添加角色成功'});
}
//提交
const onSubmit = async ()=>{

  if( updateRow.value ){
    await update();
  }else{
    await add();
  }
  //关闭dialog
  show.value = false;
  //更新列表
  emit('change');
}
</script>