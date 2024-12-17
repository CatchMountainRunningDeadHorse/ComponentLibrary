<template>
    <el-form 
        ref="ruleFormRef"
        :model="form"
        :rules="rules"
        size="large"
    >
        <el-form-item prop="mobile">
            <el-input  
                v-model="form.mobile" 
                placeholder="手机号码" 
                clearable 
                prefix-icon="Iphone"
            >
                <template #prepend> +86 </template>
            </el-input>
        </el-form-item>

        <el-form-item prop="captcha">
            
            <div class="login-msg-yzm">
                <el-input
                    v-model="form.captcha" 
                    placeholder="验证码" 
                    clearable 
                    prefix-icon="Unlock"
                ></el-input>

                <el-button :disabled="disabled" @click="getCode">
                    {{ $t('login.smsGet') }}
                    <span v-if="disabled">{{  time }}</span>
                </el-button>
            </div>

        </el-form-item>

         <!--登录-->
         <el-form-item>
            <el-button  
                type="primary" 
                style="width: 100%;"
                @click="login(ruleFormRef)"
             >
                {{ $t('login.signIn') }}
            </el-button>
        </el-form-item>

    </el-form>
</template>

<script setup>
import { ref  , reactive  } from 'vue'
import { loginCaptcha , loginByMobile } from '@api/login'
import { Encrypt } from '@utils/aes'
import useUserLogin from '@hooks/useUserLogin'
//表单内容
const form = reactive({
    mobile:'',
    captcha:''
});
//form表单dom
const ruleFormRef = ref();
//表单验证
const rules = {
    mobile:[
        {required:true,message:'请输入手机号码'}
    ],
    captcha:[
        {required:true,message:'请输入验证码'}
    ]
}
//获取验证码按钮 禁用
let disabled = ref(false);
//倒计时时间
let time = ref(0);



//获取验证码
const getCode = async ()=>{

    let res = await loginCaptcha({
        mobile:Encrypt(form.mobile)
    })

    if( res.code != '200') return ;

    disabled.value = true;
    time.value = 10;
    let timer = setInterval(() => {
        time.value-=1;
        if( time.value < 1 ){
            clearInterval( timer );
            disabled.value = false;
            time.value = 0;
        }
    }, 1000);

}
//登录
const login = ( formEl )=>{
    
    formEl.validate(async (valid, fields) => {
        if (valid) {
            let res = await loginByMobile({
                mobile:Encrypt(form.mobile),
                captcha:Encrypt(form.captcha)
            })

            useUserLogin(res);
           
        } else {
            console.log('error' , fields )
        }
    })
}



</script>

<style scoped lang="scss">
.login-msg-yzm{
    display: flex;
    width:100%;
    input{
        flex:1;
    }
    button{
        margin-left:20px;
    }
}
</style>