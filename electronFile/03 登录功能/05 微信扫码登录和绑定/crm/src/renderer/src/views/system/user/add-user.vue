<template>
    <el-dialog
        v-model="show"
        title="新增用户"
        width="800px"
        @close="close"
    >
        <template #default>
            <div class="form-container">
                <el-form
                    ref="formRef"
                    :model="userForm"
                    :rules="userRules"
                    label-width="90px"
                    class="user-editor-form"
                >
                    <div class="form-row">
                        <el-form-item label="用户名" prop="username" class="inline">
                            <el-input v-model="userForm.username" show-word-limit placeholder="请输入用户名" />
                        </el-form-item>

                        <el-form-item label="密码" prop="password" class="inline" v-if="!userForm.id">
                            <el-input v-model="userForm.password" show-word-limit placeholder="请输入用户密码" />
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
                                    :key="item.id"
                                    :label="item.k"
                                    :value="userForm.gender==item.v?userForm.gender:item.v"
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

                        <el-form-item label="备注" prop="remark" >
                            <el-input
                                v-model="userForm.remark"
                                type="textarea"
                                placeholder="请输入用户备注"
                                :maxlength="200"
                                show-word-limit
                            />
                        </el-form-item>
                    </div>
                </el-form>
            </div>
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
import { ref , reactive , getCurrentInstance , onBeforeMount  } from 'vue'
import { unitList , postPage , rolePage , userAdd } from './api/user'
const props  = defineProps({
    show:Boolean
})
const show = ref(props.show);
const emit = defineEmits();

//表单数据
const userForm = reactive({})
//所属机构
const unitTree = ref([]);
//所属岗位
const postTree = ref([]);
//所有角色
const roleTree = ref([]);

const userRules = reactive({
    username: [
        { required: true, message: "用户名称为必填项", trigger: "blur" },
        {
        pattern: /^[a-zA-Z][^\u4e00-\u9fa5]*$/,
        message: "用户名不能有汉字，必须字母",
        trigger: "blur"
        }
    ],
    password: [
        { required: true, message: "用户密码为必填项", trigger: "blur" },
        {
        validator: (rule, value, callback) => {
            if (value && (value.length < 6 || value.length > 16)) {
            callback(new Error("密码长度需要大于等于6且小于等于16"));
            } else {
            callback();
            }
        },
        trigger: "blur"
        }

    ],
    realName: [
        { required: true, message: "真实姓名为必填项", trigger: "blur" },
    ],
    phone: [
        { required: true, message: "手机号为必填项", trigger: "blur" },
        {
        message: "手机号格式不正确",
        pattern: /^1[3456789]\d{9}$/,
        trigger: "blur"
        }
    ],
    roleIds: [
        { required: true, message: "请至少选择一项", trigger: "blur" },
        {
        message: "请至少选择一项",
        trigger: "change",
        validator: (value) => value.length !== 0
        }
    ],
    postIds: [
        { required: true, message: "请至少选择一项", trigger: "blur" },
        {
        message: "请至少选择一项",
        trigger: "change",
        validator: (value) => value.length !== 0
        }
    ],
    unitId: [
        { required: true, message: "请至少选择一项", trigger: "blur" }
    ],
    email: [
        {
        message: "邮箱格式不对",
        pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        trigger: "blur",
        }
    ]
})

const { proxy } = getCurrentInstance();
onBeforeMount(async ()=>{
    //传递字典参数
    proxy.sendDicts(['system_global_gender','system_global_status']);
    //查询机构
    let unit = await unitList();
    unitTree.value = unit.data;
    //查询岗位
    let post = await postPage({
        current:'1',
        size:'10'
    });
    postTree.value = post.data.records;
    //所有角色
    let role = await rolePage({
        current:'1',
        size:"10"
    });
    roleTree.value = role.data.records;
})

//关闭dialog
const close = ()=>{
    emit('update:show',false);
}

//确认新增
const onSubmit = async ()=>{
    //userAdd
    let res = await userAdd(userForm);
    if( res.code =='200' ){
        show.value = false;
        emit('change')
    }
}
</script>