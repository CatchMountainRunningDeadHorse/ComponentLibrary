<template>
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="0" size="large">
        <!--用户名-->
        <el-form-item prop="username">
            <el-input v-model="form.username" prefix-icon="user" clearable placeholder="用户名"></el-input>
        </el-form-item>
         <!--密码-->
        <el-form-item prop="password">
            <el-input v-model="form.password" prefix-icon="lock" clearable show-password placeholder="密码"></el-input>
        </el-form-item>

        <!--验证码-->
        <el-form-item>
            <div class="boxCode">
                <el-input v-model="form.captcha" prefix-icon="CircleCheck" clearable placeholder="请输入验证码" ></el-input>
                <el-image :src="captchas.url" @click="getCodeApi" class="code"></el-image>
            </div>
        </el-form-item>
        <!--记住密码-->
        <el-form-item style="margin-bottom: 10px;">
            <el-checkbox v-model="checked" label="记住密码" size="small" @change="onMemoPassword"/>
        </el-form-item>
         <!--登录-->
        <el-form-item>
            <el-button  type="primary" style="width: 100%;" @click="login(ruleFormRef)">登录</el-button>
        </el-form-item>

        </el-form>
</template>

<script setup lang="ts">
import {  reactive , onBeforeMount , ref  } from 'vue'
import { imageCode  , loginByJson } from '@api/login'
import { useGlobalUserStore } from '@store/UserGlobalStore'
import { Encrypt , Decrypt } from '@utils/aes.js'
import useMemoPassword from '@hooks/useMemoPassword'
import useUserLogin from '@hooks/useUserLogin'
let userStore = useGlobalUserStore();
import { useRouter } from 'vue-router'
let router = useRouter();

const ruleFormRef = ref(null);
const form = reactive({
    username: '',
    password:'',
    captcha:''
})
const rules = reactive({
    username: [
       {required: true, message: '必须填写', trigger: 'blur'}
    ],
    password: [
        {required: true, message: '必须填写', trigger: 'blur'}
    ]
})
const captchas = reactive({
    url:'',
    key:''
})
const getCodeApi = async ()=>{
    captchas.key = new Date().getTime().toString();
    const res = await imageCode({key: captchas.key});
    let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
    let imgUrl = URL.createObjectURL( blob );
    captchas.url = imgUrl;
    //captcha.url = 'data:image/png;base64,' + btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''));
}
onBeforeMount(()=>{
    const userPwd = localStorage.getItem('user-pwd');
    if( userPwd ){
        let { username , password } = JSON.parse( userPwd );
        form.username = Decrypt(username);
        form.password = Decrypt(password);
    }
    //生成验证码
    getCodeApi();
})

const login = async ( formEl )=>{
    await formEl.validate(async (valid, fields) => {
    if (valid) {
        let { password , username , captcha  } = form;
        let res = await loginByJson({
            password:Encrypt(password),
            username: Encrypt(username),
            key: captchas.key,
            captcha
        })
        useUserLogin( res );
        //是否记住了密码
        setMemoPassword();
    } else {
      console.log('error submit!', fields)
    }
  })
}

//记住密码
let { memoVal , onMemoPassword } = useMemoPassword();
const checked = ref(memoVal);
const setMemoPassword = ()=>{
   checked.value ? localStorage.setItem('user-pwd',
    JSON.stringify({
        username:Encrypt(form.username),
        password:Encrypt(form.password)
    })
   ) : localStorage.removeItem('user-pwd') 
}
</script>


<style lang="scss">
.boxCode{
  display: flex;
  align-items: center;
  width: 100%;
}
.code{
  margin-left: 10px;
  height: 40px;
  cursor: pointer;
}
</style>

