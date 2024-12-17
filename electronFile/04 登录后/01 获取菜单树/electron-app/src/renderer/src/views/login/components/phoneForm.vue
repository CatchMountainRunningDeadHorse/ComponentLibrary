<template>
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="0"
        size="large"
    >
        <el-form-item prop="mobile">
            <el-input v-model="ruleForm.mobile" prefix-icon="iphone" clearable placeholder="请输入手机号">
                <template #prepend>+86</template>
            </el-input>
        </el-form-item>

        <el-form-item prop="captcha">
            <div class="login-msg-yzm">
                <el-input v-model="ruleForm.captcha" prefix-icon="unlock" clearable placeholder="请输入验证码"></el-input>
                <el-button @click="getCode" :disabled="disabled">获取验证码<span v-if="disabled">({{ time }})</span></el-button>
            </div>
        </el-form-item>

        <el-form-item>
            <el-button @click='login(ruleFormRef)' type="primary" style="width: 100%;" round :loading='isLogin'>登录</el-button>
        </el-form-item>

        <el-form-item>
           <router-link to="">{{ $t('login.forgetPassword') }} </router-link>
        </el-form-item>

    </el-form>
</template>

<script setup lang="ts">
import { reactive, ref  , getCurrentInstance, ComponentInternalInstance } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { PhoneRuleForm } from '@interface/login'
import { loginCaptcha , loginByMobile } from '@api/login'
import { Encrypt } from '@utils/aes'

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<PhoneRuleForm>({
    mobile: '',
    captcha: ''
})

const validatorTel = (rule: any, value: string, callback: any) => {
    if( value === ''){
        callback( new Error( proxy?.$t('login.mobileError')  ));
    }else if( !/^1[3456789]\d{9}$/.test( value ) ){
        callback( new Error('请填写正确手机号') );
    }else{
        callback();
    }
}
const rules = reactive<FormRules<PhoneRuleForm>>({
    mobile: [
        { validator:validatorTel, trigger: 'blur' },
    ],
    captcha: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ]
})
const time = ref<number>(60);
const disabled = ref<boolean>(false);
const isLogin = ref<boolean>(false);

//获取验证码
const getCode = async ()=>{
    let validate = await ruleFormRef.value?.validateField('mobile', () => null);
    if( !validate ){
        return ElMessage.error('请填写正确的手机号');
    }
    
    let res = await loginCaptcha({
        mobile:Encrypt( ruleForm.mobile )
    })

    if(  res.code != '200') return ElMessage.error(res.msg);
   
    ElMessage.success('发送成功');
    
    disabled.value = true;
    time.value = 60;
    let timer = setInterval(()=>{
        time.value -= 1;
        if( time.value < 1 ){
            clearInterval( timer );
            disabled.value = false;
            time.value = 0;
        }
    },1000)

    return ;
}
//登录
const login = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
        let res = await loginByMobile({
            mobile:Encrypt( ruleForm.mobile ),
            captcha:Encrypt( ruleForm.captcha )
        })
        
        if( res.code !='200') return ElMessage.error(res.msg);
        
    } else {
        return ElMessage.warning('请填写正确内容');
    }

    return ;
  })
}
</script>

<style scoped>
.login-msg-yzm{
    display: flex;
    width: 100%;
}
.login-msg-yzm .el-button{
    margin-left:10px;
}
</style>