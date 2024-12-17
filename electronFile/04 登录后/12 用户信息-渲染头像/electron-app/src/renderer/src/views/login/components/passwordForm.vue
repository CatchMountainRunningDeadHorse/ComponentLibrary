<template>
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="0"
        size="large"
        @keyup.enter="login(ruleFormRef)"
    >
        <el-form-item prop="username">
            <el-input v-model="ruleForm.username" prefix-icon="user" clearable placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item prop="password">
            <el-input v-model="ruleForm.password" prefix-icon="lock" clearable show-password  placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item>
            <div class="box-code">
                <el-input v-model="ruleForm.captcha" prefix-icon="CircleCheck" clearable placeholder="请输入验证码"></el-input>
                <el-image class='code' :src="captchaUrl" @click="getCaptcha"></el-image>
            </div>
        </el-form-item>

        <div class="remember">
            <div>
                <el-checkbox label="记住密码"></el-checkbox>
            </div>
            <div>
                <router-link to="">{{ $t('login.forgetPassword') }}</router-link>
            </div>
        </div>

        <el-form-item>
           <el-button type="primary" round style="width:100%" @click="login(ruleFormRef)" :loading="isLogin">登录</el-button>
        </el-form-item>

    </el-form>
</template>

<script setup lang="ts">
import { reactive, ref , onBeforeMount , getCurrentInstance , ComponentInternalInstance  } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { captchaImage , loginByJson } from '@api/login'
import { Encrypt } from '@utils/aes'
import { UserRuleForm } from '@interface/login'

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
let captchaUrl = ref<string>('');
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<UserRuleForm>({
    username: '',
    password: '',
    key: '',
    captcha: '',
})
let rules = reactive<FormRules<UserRuleForm>>({})
const isLogin = ref<boolean>(false);

//验证码
const getCaptcha = async ()=>{
    const key:string = new Date().getTime().toString();
    ruleForm.key = key;
    let res = await captchaImage({ key })
    let blob = new Blob([res],{type:'application/vnd.ms-excel'});
    let imgUrl = URL.createObjectURL( blob );
    captchaUrl.value = imgUrl;
}

//生命周期
onBeforeMount(()=>{
    rules = {
        username: [
            { required: true, message: proxy?.$t('login.userError'), trigger: 'blur' },
        ],
        password: [
            { required: true, message: proxy?.$t('login.PWPlaceholder'), trigger: 'blur' },
        ]
    }
    getCaptcha();
})



//hooks
import useLogin from '@hooks/useLogin'
//登录
const login = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
        isLogin.value = true;
        let res = await loginByJson({
            username:Encrypt(ruleForm.username),
            password:Encrypt(ruleForm.password),
            key:ruleForm.key,
            captcha:ruleForm.captcha
        })
        isLogin.value = false;
        //调用hooks
        useLogin( res );
    } else {
        return ElMessage.warning('请填写正确内容');
    }
    return ;
  })
}
</script>

<style scoped>
.box-code{
    display: flex;
    align-items: center;
    width: 100%;
}
.code{
    margin-left: 10px;
    width: 100px;
    height: 40px;
    cursor: pointer;
}
.remember{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size:14px;
}
</style>