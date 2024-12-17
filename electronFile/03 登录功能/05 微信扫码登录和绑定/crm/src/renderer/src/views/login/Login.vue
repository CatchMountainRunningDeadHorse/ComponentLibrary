<template>
    <div class="login">
        <!--头部--->
        <div class="login-t">
            <div class="login-t-bar">
                <!--黑白模式-->
                <el-button circle @click='configDark'>
                    <el-icon v-if="config.dark=='dark'"><Sunny /></el-icon>
                    <el-icon v-else><Moon /></el-icon>
                </el-button>
                <!--切换语言-->
                <el-dropdown @command="configLang" trigger="click">
                    <el-button circle>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path d="M478.33 433.6l-90-218a22 22 0 0 0-40.67 0l-90 218a22 22 0 1 0 40.67 16.79L316.66 406h102.67l18.33 44.39A22 22 0 0 0 458 464a22 22 0 0 0 20.32-30.4zM334.83 362L368 281.65L401.17 362z" fill="currentColor"></path><path d="M267.84 342.92a22 22 0 0 0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73c39.65-53.68 62.11-114.75 71.27-143.49H330a22 22 0 0 0 0-44H214V70a22 22 0 0 0-44 0v20H54a22 22 0 0 0 0 44h197.25c-9.52 26.95-27.05 69.5-53.79 108.36c-31.41-41.68-43.08-68.65-43.17-68.87a22 22 0 0 0-40.58 17c.58 1.38 14.55 34.23 52.86 83.93c.92 1.19 1.83 2.35 2.74 3.51c-39.24 44.35-77.74 71.86-93.85 80.74a22 22 0 1 0 21.07 38.63c2.16-1.18 48.6-26.89 101.63-85.59c22.52 24.08 38 35.44 38.93 36.1a22 22 0 0 0 30.75-4.9z" fill="currentColor"></path></svg>
                    </el-button>
                    <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item 
                            v-for="item in CONFIG.LANG"
                            :key="item.name"
                            :command="item"
                        >{{ item.name }}</el-dropdown-item>
                    </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <!--关闭-->
                <el-button circle @click="windowClose">
                    <el-icon><Close /></el-icon>
                </el-button>

            </div>
        </div>

        <div class="login-l">
            <div class="login_adv__title">
				<h2>鹿线开源</h2>
				<h4>{{ $t('login.slogan') }}</h4>
				<p>{{ $t('login.slogan') }}</p>
			</div>
			<div class="login_adv__mask"></div>
			<div class="login_adv__bottom">
				© 鹿线开源
			</div>
        </div>

        <div class="login-r">
            <div class="login-form">

                <div class="login-header">
					<div class="logo">
						<img src="/images/logo.png">
					</div>
				</div>

                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                    
                    <el-tab-pane :label="$t('login.accountLogin')" name="user">
                        <div style="height: 300px;">
                            <passWordForm></passWordForm>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="手机号登录" name="phone">
                        <div style="height: 300px;">
                            <phoneForm></phoneForm>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <el-button @click="wxLogin">微信扫码登录</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref , getCurrentInstance , onBeforeMount, reactive  } from 'vue'
import CONFIG from '@config'
//tab切换
const activeName = ref('user');
const handleClick = (tab, event ) => {
//   console.log(tab, event)
}
//帐号登录
import passWordForm from './module/password-form.vue'
//手机号登录
import phoneForm from './module/phone-form.vue'

//关闭窗口
const windowClose = ()=>{

    ElMessageBox.confirm('确认要关闭软件吗？','关闭窗口',{
        tpye:'info',
        cancelButtonText: '取消',
        confirmButtonText: '确认',
    })
    .then(() => {
        window.electron.ipcRenderer.invoke('renderer-to-main',{
            name: 'close-window',
            event: 'event',
            data: null
        })
    })
    .catch(() => {
       console.log( '取消' );
    })

}

//icons
const config = reactive({
    dark:localStorage.getItem('APP_dark') || false
})

//切换模式
const configDark = ()=>{
    if( document.querySelector('html').className =='dark' ){
        document.querySelector('html').className = '';
    }else{
        document.querySelector('html').className = 'dark';
    }
    config.dark = document.querySelector('html').className;
}
//国际化
const instance = getCurrentInstance();
let { proxy }= instance;

//切换语言 
const configLang = ( e )=>{
    proxy.$i18n.locale = e.value; 
    localStorage.setItem('lang',e.value);
}

//hooks
import useUserLogin from '@hooks/useUserLogin'
//api
import { getAccessToken } from '@api/login'
//生命周期中
onBeforeMount(()=>{
    //渲染进程接收主进程的参数
    window.electron.ipcRenderer.once('main-to-renderer',async (e,data)=>{
        //data==>微信授权code码
        let res = await getAccessToken({
            code:data.data
        })
        useUserLogin( res );
    })
})

//微信扫码登录
const wxLogin = ()=>{
    window.electron.ipcRenderer.invoke('renderer-to-main',{
        name: 'wx',
        event: 'event',
        data: null
    })
}

</script>

<style scoped>
.login{
    display: flex;
    width:100vw;
    height: 100vh;
    overflow: hidden;
}
.login-t{
    position: absolute;
    top:0;
    right:0;
    width:100%;
    z-index: 999;
}
.login-t-bar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    float: right;
    width:120px;
    margin:10px 10px 0 0;
}
.login-l{
    position: relative;
    width:40%;
    background-color: #000;
}
.login_adv__title {color: #fff;padding: 40px;position: absolute;top:0px;left:0px;right: 0px;z-index: 2;}
.login_adv__title h2 {font-size: 40px;}
.login_adv__title h4 {font-size: 18px;margin-top: 10px;font-weight: normal;}
.login_adv__title p {font-size: 14px;margin-top:10px;line-height: 1.8;color: rgba(255,255,255,0.6);}
.login_adv__title div {margin-top: 10px;display: flex;align-items: center;}
.login_adv__title div span {margin-right: 15px;}
.login_adv__bottom {position: absolute;left:0px;right: 0px;bottom: 0px;color: #fff;padding: 40px;background-image:linear-gradient(transparent, #000);z-index: 3;}

.login-r{
    flex:1;
    display: flex;
    
}
.login-form {width: 400px;margin: auto;}
.login-header {margin-bottom: 40px;}
.login-header .logo {display: flex;align-items: center;justify-content: center}
.login-header .logo img {width: 40px;height: 40px;vertical-align: bottom;margin-right: 10px;}
.login-header .logo label {font-size: 26px;font-weight: bold;}
.login-oauth {display: flex;justify-content:space-around;}
.login-form .el-divider {margin-top:40px;}
</style>