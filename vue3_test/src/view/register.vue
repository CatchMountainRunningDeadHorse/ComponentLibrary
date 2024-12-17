<template>
    <section>
        <img src="/static/img/bg.jpeg" class="bg">
    
        <div class="login">
            <h2>Sign In</h2>
            <el-form
                ref="ruleFormRef"
                style="max-width: 600px"
                :model="ruleForm"
                :rules="rules"
                label-width="auto"
                class="demo-ruleForm"
            >
                <el-form-item label="账号" prop="account" class="inputBox">
                    <el-input v-model="ruleForm.account" type="text" autocomplete="off" />
                </el-form-item>
                <el-form-item label="昵称" prop="name" class="inputBox">
                    <el-input v-model="ruleForm.name" type="text" autocomplete="off" />
                </el-form-item>
                <el-form-item label="密码" prop="pass" class="inputBox" >
                    <el-input ref="pwd" v-model="ruleForm.pass" type="password" autocomplete="off"/>
                    <el-icon v-if="isSee" @click="showPwd"><View /></el-icon>     
                    <el-icon v-else @click="showPwd"><Hide /></el-icon>
                </el-form-item>
                <el-form-item class="inputBox">
                    <el-button class="btn" type="primary" @click="Register(ruleFormRef)">Sign In</el-button>
                </el-form-item>
            </el-form>
            <div class="group">
                <a @click="backLogin">返回登录？</a>
            </div>
        </div>
        <div class="flower">
            <img src="/static/img/flower.png">
            <img src="/static/img/flower.png">
            <img src="/static/img/flower.png">
            <img src="/static/img/flower.png">
            <img src="/static/img/flower.png">
            <img src="/static/img/flower.png">
            <img src="/static/img/flower.png">
            <img src="/static/img/flower.png">
        </div>
    </section>
</template>

<script setup>
    import { ref,onMounted,unref } from 'vue'
    import { useRouter } from 'vue-router'
    import { postData } from '@/http/api'
    import { formatTime } from '@/utils/util'
    import { ElMessage } from 'element-plus';
    let isSee = ref(false)
    const router = useRouter()
    const ruleForm = ref({
        account:'',
        pass:'',
        name:'',
        date:''
    })
    const ruleFormRef = ref()
    const pwd = ref()

    // 自定义验证规则
    const validatePass = (rule, value, callback) => {
      //  密码只能由大小写英文字母或数字开头，且由大小写英文字母_.组成
      const reg = /^[A-Za-z0-9][A-Za-z0-9_.]{5,14}$/
      console.log('reg', value.match(reg))
      if (!value.match(reg)) {
        callback(new Error('密码由字母或数字开头，且只能为字母,数字,下划线及（.）'))
      } else {
        callback()
      }
    }
    const rules = ref({
        account: [{ required: true, trigger: 'change' ,message:'账号不能为空'}],
        name: [{ required: true, trigger: 'change' ,message:'昵称不能为空'}],
        pass: [
            { required: true, trigger: 'change' ,message:'密码不能为空' },
            { min: 6, max: 15, message: '密码位数只能在6~15之间', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }
        ],
    })

    onMounted(() => {

    })
    const showPwd =() => {
        if(isSee.value){
            pwd.value.input.attributes.type.value = 'password'
            isSee.value = false
        }else{
            pwd.value.input.attributes.type.value = 'text'
            isSee.value = true
        }
    }
     const Register =  (e) => {
        e.validate(async(valid)=>{
            if(valid){
                ruleForm.value.date = formatTime(new Date())
                const {data} = await postData('register',ruleForm)
                console.log('倪总说就开始的科技感牛',data);
                if(data.code === 0){
                    router.back()
                }else{
                    ElMessage({
                        message:data.msg,
                        type:"error"
                    })
                }
            }else{
                console.log('error register!')
            }
        })
    }
    const backLogin = () => {
        console.log('驾驶开放和会计师给你看见',router);
        router.back()
    }
</script>

<style scoped>
section{
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-x: hidden;
}
section .bg{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.login{
    position: relative;
    width: 500px;
    min-height: 300px;
    padding: 60px;
    border-radius: 20px;
    background: rgba(255,255,255,0.25);
    backdrop-filter: blur(3px);
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-shadow: 0 25px 50px rgba(0,0,0,0.2);
}
.login h2{
    position: relative;
    width: 100%;
    text-align: center;
    font-size: 2.5em;
    font-weight: 600;
    color: #8f2c24;
    margin-bottom: 10px;
}
.login .inputBox{
    position: relative;
}
.login .inputBox input{
    position: relative;
    width: 100%;
    padding: 15px 20px;
    outline: none;
    font-size: 1.25em;
    color: #8f2c24;
    border-radius: 5px;
    background: #fff;
    border: none;
    margin-bottom: 30px;
}
.login .inputBox i{
    position: absolute;
    right: 15px;
    /* top: 15px; */
    font-size: 28px;
    color: #8f2c24;
    cursor: pointer;
}
.login .inputBox .see{
    display: none;
}
.login .inputBox .no-see{
    display: block;
}
.login .inputBox ::placeholder{
    color:#8f2c24
}
.login .inputBox .btn{
    position: relative;
    outline: none;
    font-size: 1.25em;
    color: #fff;
    border-radius: 5px;
    background: #8f2c24;
    width: 100%;
    height: auto;
    padding: 15px 20px;
    border: none;
    cursor: pointer;
    font-weight: 500;
}
.login .group{
    display: flex;
    justify-content: space-between;
}
.login .group a{
    font-size: 1.25em;
    color: #8f2c24;
    font-weight: 500;
    text-decoration: none;
}
.flower{
    position: absolute;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    z-index: 1;
    pointer-events: none;
}
.flower img{
    position: absolute;
}

@keyframes animate{
    0%{
        opacity: 0;top: -10px;transform: translateX(20px) rotate(0deg);
    }
    10%{
        opacity: 1;
    }
    20%{
        transform: translateX(-20px) rotate(45deg);
    }
    40%{
        transform: translateX(-20px) rotate(90deg);
    }
    60%{
        transform: translateX(-20px) rotate(180deg);
    }
    80%{
        transform: translateX(-20px) rotate(45deg);
    }
    100%{
        top: 110%; transform: translateX(20px) rotate(225deg);
    }
}
.flower img:nth-child(1){
    left:20%;
    animation: animate 20s linear infinite;
}
.flower img:nth-child(2){
    left:50%;
    animation: animate 14s -2s linear infinite;
}
.flower img:nth-child(3){
    left:70%;
    animation: animate 12s -3s linear infinite;
}
.flower img:nth-child(4){
    left:5%;
    animation: animate 15s -2s linear infinite;
}
.flower img:nth-child(5){
    left:85%;
    animation: animate 18s -1s linear infinite;
}
.flower img:nth-child(6){
    left:90%;
    animation: animate 12s -2s linear infinite;
}
.flower img:nth-child(7){
    left:15%;
    animation: animate 14s -1s linear infinite;
}
.flower img:nth-child(8){
    left:60%;
    animation: animate 15s -1s linear infinite;
}

</style>