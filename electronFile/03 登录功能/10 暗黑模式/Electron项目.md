```
接口地址：http://doc.xuexiluxian.cn/
账号：testapi
密码：123456
```



```
后台管理系统用户名 +  密码
admin
abc123456
```



# 一、创建项目

	1.2 官网网址：https://evite.netlify.app/ 
	
	1.3 安装步骤
	
		npx degit alex8088/electron-vite-boilerplate electron-app
		cd electron-app
	
		npm install
		npm run dev

vue版本：vue3

构建工具：vite

框架类型：Electron

JS语法：TypeScript



# 二、安装路由 和 路由二次封装

2.1 安装路由：npm install vue-router -S

	1. 新建：router/index.ts
	
	2. router/index.ts写入内容
	
		import { createRouter, createWebHashHistory } from "vue-router";
		export default createRouter({
			history: createWebHashHistory(),//hash模式
		    routes:[{ path: "/", component: Login }]//路由配置规则数组
		})
	
	3. main.ts中use一下router
	
		use(router)
		
	4. 创建对应路由的.vue文件

2.2 路由二次封装

疑问：为什么路由二次封装？

解答：router文件中在写项目中包含：路由表、导航守卫等等内容，假设路由表特别多 或 导航守卫内容特别多，代码则很难维护和阅读，所以二次封装路由是为了方便后期维护和管理。

操作流程：

```
1. index.ts
  import { createRouter, createWebHashHistory } from "vue-router";
  import { AppRoutes } from '@router/routes'
  import {  beforeEach  , afterEach  } from '@router/guards'

  const AppRouter = createRouter({
      history: createWebHashHistory(),
      routes:AppRoutes
  })

  AppRouter.beforeEach(beforeEach)
  AppRouter.afterEach(afterEach)

  export default AppRouter;

2. 新建routes.ts ： 放入路由表
	export const AppRoutes = [
      { 
          path: "/",
          name:'layout',
          component: ()=>import('@layout/index.vue') 
      },
      { 
          path: "/login", 
          name:'登录',
          component: ()=>import('@views/login/Login.vue')
      },
  ];

3. 新建guards.ts ：放入导航守卫
	//全局前置导航守卫
	export const beforeEach = async ( to )=>{
		//...
	}
	//全局后置导航守卫
  export const afterEach = ()=>{
		//...
  }

```



# 三、安装store（pinia） 和  持久化存储

3.1 下载安装

```
npm install pinia -S
```

3.2 main.ts引入

```
import { createPinia } from 'pinia'
app.use(createPinia())
```

3.3 新建目录：store/index.ts

```
import { defineStore } from 'pinia'
export const useStore = defineStore('storeId', {
  state: () => {
    return {
      counter: 0,
    }
  },
  getters:{},
  actions:{}
})
```

3.4 Vuex和Pinia的区别

Vuex和pinia的区别有很多，例如：pinia没有mutations和modules，那么vuex的modules是为了区分和管理小store模块的内容，但是pinia没有modules所以无法直接管理，但是为了项目可能store比较多，为了更好的管理store可以模拟实现来完成。

3.5 增加全局store

```
修改：index.ts
内容为：store/index.ts主要引入其他store  //模拟实现vuex的modules
```

3.6 持久化存储

```
下载安装：npm install pinia-plugin-persist
```

```
//main.ts

//状态管理
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
const store = createPinia()
store.use(piniaPluginPersist)

app.use( store );
```

```
//useUserStore.ts

import { defineStore } from 'pinia'

export const useUserStore = defineStore('userId', {
    state: () => {
        return {
        }
    },
    getters:{},
    actions:{},
    persist: {
      enabled: true, //开启数据缓存
      strategies: [
        {
          storage: localStorage,//默认走session
          paths: ['rolePerm', 'permissions']
        }
      ]
    }
})
```



# 四、路径别名

配置文件：electron.vite.config.ts

```
export default defineConfig({
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        //增加路径别名
      }
    },
    plugins: [vue()]
  }
})
```



# 五、配置代理 和 请求二次封装

5.1 配置代理 ：electron.vite.config.ts

```
export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
      }
    },
    server:{
      "proxy":{
        "/api":{
          target:'http://uat.crm.xuexiluxian.cn',
          changeOrigin:true,
          rewrite: path =>  path.replace(/^\/api/,'')
        }
      }
    }
  }
})
```

5.2 请求二次封装：utils/request.ts

先下载axios：npm install axios

```
import axios from 'axios';

const request = axios.create({
    baseURL: '/api'
});

// 添加请求拦截器
request.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
});

export default request;
```

##### 后面课程中，会单独分装get和post。

5.3 api文件管理

新建：api/login.ts

```
import request from "@utils/request";

//用户登录
export const loginByJson = ( data )=>{
    return request({
    	url:'/u/loginByJson',
    	method:'请求方式'
			//...
    })
}
```



# 六、安装使用Element Plus

6.1 安装

```
npm install element-plus --save
```

6.2 按需导入

```
npm install -D unplugin-vue-components unplugin-auto-import
```

6.3 electron.vite.config.ts

```
//element
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
      }
    },
    server:{
      "proxy":{
        "/api":{
          target:'http://uat.crm.xuexiluxian.cn',
          changeOrigin:true,
          rewrite: path =>  path.replace(/^\/api/,'')
        }
      }
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      })
    ]
  }
})
```



# 七、登录页布局

7.1 左侧布局

```
<template>
    <div class="login_bg">
        <!--左边-->
        <div class="login_adv">
            <div class="login_adv__title">
                <h2>小鹿线</h2>
                <h4>客户关系管理系统</h4>
                <p>让业务在线更高效，加速企业数字化升级。</p>
            </div>
            <div class="login_adv__mask"></div>
            <div class="login_adv__imgage">
                <img src="../assets/images/data.png" width="100%">
            </div>
            <div class="login_adv__bottom">
                © 小鹿线客户管理系统 1.0.11
            </div>
        </div>
    </div>
</template>

<style scoped>
.login_bg {
  width: 100vw;
  height: 100vh;
  background: #fff;
  display: flex;
}
.login_adv {
    background-image: url('../assets/images/auth_banner.jpg');
    width: 40%;
    position: relative;
}
.login_adv__title {
  color: #fff;
  padding: 40px;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  z-index: 2;
}
.login_adv__title h2 {
  font-size: 40px;
}

.login_adv__title h4 {
  font-size: 18px;
  margin-top: 10px;
  font-weight: normal;
}

.login_adv__title p {
  font-size: 14px;
  margin-top: 10px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.6);
}

.login_adv__title div {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.login_adv__imgage{
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 80px;
  padding: 40px;
  z-index: 3;
}

.login_adv__imgage img{
  width: 100%;
}

.login_adv__bottom {
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  color: #fff;
  padding: 0 40px 40px 40px;
  background-image: linear-gradient(transparent, #000);
  z-index: 3;
}

.login_adv__mask {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}
</style>
```

7.2 右侧布局

```
<template>
    <div class="login">
        <!--左侧-->
        <div class="login_adv">
            <div class="login_adv_title">
                <h2>小鹿线</h2>
                <h4>客户关系管理系统</h4>
                <p>让业务在线更高效，加速企业数字化升级。</p>
            </div>
            <div class="login_adv_mask"></div>

            <div class="login_adv_imgage">
                <img src="../assets/images/data.png" width="100%">
            </div>
            <div class="login_adv_bottom">
                © 小鹿线客户管理系统 1.0.11
            </div>
        </div>
        <!--右侧-->
        <div class="login-main">
            <div class="login-form">

                <div class="login-header">
                    <div class="login-img">
                        <img src="../assets/images/logo.png" alt="">
                        <label>小鹿线客户管理系统</label>
                    </div>
                </div>
                <el-tabs>
                    <el-tab-pane label="账号登录" lazy>User</el-tab-pane>
                    <el-tab-pane label="手机号登录" lazy>Config</el-tab-pane>
                </el-tabs>
                <template v-if='true'>
                    <el-divider>其他登录方式</el-divider>
                    <div class="login-oauth">
                        <!--微信按钮-->
                        <el-button type="success" circle  size="large">
                            <el-icon size="large">
                               <ChatDotRound />
                            </el-icon>
                        </el-button>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login{
    width:100vw;
    height: 100vh;
    background-color: #fff;
    display: flex;
}
.login_adv{
    background: url('../assets/images/auth_banner.jpg') no-repeat;
    width:40%;
    position: relative;
}
.login_adv_title{
    position: absolute;
    top:0;
    left:0;
    right:0;
    z-index: 2;
    padding:40px;
    color:#fff;
}
.login_adv_title h2{
    font-size: 40px;
}
.login_adv_title h4{
    font-size: 18px;
    margin-top: 10px;
}
.login_adv_title p{
    font-size: 14px;
    margin-top: 10px;
    line-height: 1.8;
    color: rgb(255,255,255,.6);
}
.login_adv_imgage{
    position: absolute;
    left:0px;
    right:0px;
    bottom:80px;
    padding:40px;
    z-index: 3;
}
.login_adv_imgage img{
    width: 100%;
    height: 100%;
}
.login_adv_bottom{
    position: absolute;
    left:0px;
    right:0px;
    bottom:0px;
    color:#fff;
    padding:0 40px 40px 40px;
}
.login_adv_mask{
    position: absolute;
    left:0px;
    top:0px;
    right:0px;
    bottom:0px;
    background:rgba(0, 0, 0,.5);
    z-index: 1;
}

.login-main{
    flex:1;
    display: flex;
    overflow: auto;
}
.login-form{
    width:400px;
    margin: auto;
    padding:80px 0 0 0;
}
.login-header{
    margin-bottom: 40px;
}
.login-header .login-img{
    display: flex;
    justify-content: center;
    align-items: center;
}
.login-header .login-img img{
    width:40px;
    height: 40px;
    vertical-align: bottom;
    margin-right:10px;
}
.login-header .login-img label{
    font-size:26px;
    font-weight: bold;
}
.login-oauth{
    display: flex;
    justify-content: space-around;
}
</style>
```

7.3 下载引入icon

安装

```
npm install @element-plus/icons-vue
```

main.ts引入

```
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}
```



# 八、账号登录

8.1 布局 + 逻辑

```
<template>
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="0" size="large">
     
        <el-form-item prop="username">
        <el-input v-model="form.username" prefix-icon="user" clearable placeholder="请输入">
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="form.password" prefix-icon="lock" clearable show-password placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item>
        <div class="boxCode">
          <el-input v-model="form.captcha" prefix-icon="CircleCheck" clearable placeholder="请输入验证码" ></el-input>
          <el-image :src="captchaUrl" @click="getImage" class="code"></el-image>
        </div>
       
      </el-form-item>
  
      <div class="rememberMe">
        <div>
          <el-checkbox label="记住密码" />
        </div>
        <div>
          <router-link to="/reset_password">忘记密码？</router-link>
        </div>
      </div>
  
      <el-form-item>
        <el-button type="primary" style="width: 100%;" round @click="login(ruleFormRef)">登录</el-button>
      </el-form-item>

    </el-form>
</template>

<script setup lang="ts">
import {  reactive , ref , onBeforeMount } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { captchaImage , loginByJson } from '@api/login'
import { Encrypt } from '@utils/aes'
import { RuleForm } from '../types/login'

let captchaUrl = ref<string>('');

const ruleFormRef = ref<FormInstance>()

const form = reactive<RuleForm>({
    username: "",
    password: "",
    captcha: "",
    key: ''    
})

const rules =reactive<FormRules<RuleForm>>({
    username: [
        {required: true, message: '正确用户名', trigger: 'blur'}
    ],
    password: [
        {required: true, message: '正确密码', trigger: 'blur'}
    ]
})

let getImage = async ()=>{
    const key = new Date().getTime().toString();
    form.key = key;
    const res = await captchaImage({ key })
    let blob = new Blob([res],{type:'application/vnd.ms-excel'});
    let imgUrl = URL.createObjectURL( blob );
    captchaUrl.value = imgUrl;
}

onBeforeMount(()=>{
    getImage();
})

const login = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid:boolean) => {
    if (valid) {
        let res = await loginByJson({
            username:Encrypt(form.username),
            password:Encrypt(form.password),
            key:form.key,
            captcha:form.captcha
        });
        if( res.code != "200" ){
            return ElMessage.error(res.msg)
        }
    } else {
        return ElMessage.warning('请填写正确内容')
    }
    return;
  })
}
</script>

<style scoped>
  .boxCode{
    display: flex;
    align-items: center;
    width: 100%;
  }
  .code{
    margin-left: 10px;
    height: 40px;
    width: 100px;
    cursor: pointer;
  }
  .rememberMe{
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
 </style>
```

8.2 解决的问题

```
1. 验证码报错的问题，需要注释掉index.html中的meta
2. element-plus的message样式不生效需要在main.ts加入：import 'element-plus/theme-chalk/index.css'
3. 加密使用：aes
4. 新建types文件，其内容全部为interface内容
```



# 九、手机号 验证码登录

9.1 布局

```
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
                <el-button :disabled="disabled">获取验证码<span v-if="disabled">({{ time }})</span></el-button>
            </div>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" style="width: 100%;" round :loading='isLogin'>登录</el-button>
        </el-form-item>

        <el-form-item>
           <router-link to="">忘记密码?</router-link>
        </el-form-item>

    </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { PhoneRuleForm } from '@interface/login'

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<PhoneRuleForm>({
    mobile: '',
    captcha: ''
})
const rules = reactive<FormRules<PhoneRuleForm>>({
    mobile: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
    captcha: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ]
})
const time = ref<number>(60);
const disabled = ref<boolean>(false);
const isLogin = ref<boolean>(false);
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
```

9.2 布局 + 逻辑

```
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
           <router-link to="">忘记密码?</router-link>
        </el-form-item>

    </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { PhoneRuleForm } from '@interface/login'
import { loginCaptcha , loginByMobile } from '@api/login'
import { Encrypt } from '@utils/aes'

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<PhoneRuleForm>({
    mobile: '',
    captcha: ''
})
const validatorTel = (rule: any, value: string, callback: any) => {
    if( value === ''){
        callback( new Error('请填写手机号') );
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
```



# 十、Electron窗口调整

##### 10.1 【默认】有标题栏，有标题

![image-20231213004858777](/Users/zhangpang/Library/Application Support/typora-user-images/image-20231213004858777.png)



##### 10.2 有标题栏，无标题

![image-20231213005038488](/Users/zhangpang/Library/Application Support/typora-user-images/image-20231213005038488.png)

***有系统自带按钮

主进程设置：

```
const mainWindow = new BrowserWindow({
    ...
    titleBarStyle: 'hidden',//隐藏标题
    titleBarOverlay: {
      color: '#ffffff',
      symbolColor: '#74b1be'
    },
    ...
})
```

问题：窗口就无法拖拽了，解决方案为：渲染进程添加样式

```
<style>
div {
    -webkit-app-region: drag;
}
</style>
```

##### 10.3 无标题栏，无标题

![image-20231213005131738](/Users/zhangpang/Library/Application Support/typora-user-images/image-20231213005131738.png)

主进程：

```
const mainWindow = new BrowserWindow({
 		...
    frame: false,//无边框窗口
    ...
})
```

问题：窗口无法拖拽，解决方案：渲染进程通信主进程，采用拖拽的形式完成

```
<div class="button" @mousedown="mousedown"></div>

<script>
import { ref } from 'vue';

let isKeyDown = ref<boolean>(false);
let dinatesX = ref<number>(0);
let dinatesY = ref<number>(0);

const mousedown = ( event )=>{
    isKeyDown.value = true;
    dinatesX.value = event.x;
    dinatesY.value = event.y;

    document.onmousemove = (ev) => {
        if(isKeyDown.value ){
            const x = ev.screenX - dinatesX.value;
            const y = ev.screenY - dinatesY.value;
            //给主进程传入坐标
            let data = {
                appX:x,
                appY:y
            }
            electron.ipcRenderer.invoke('custom-adsorption',data);
        }
    };
    document.onmouseup = () => {
        isKeyDown.value = false
    };
}
</script>
```

主进程：

```
ipcMain.handle('custom-adsorption',(event,res) => {
    let x = res.appX;
    let y = res.appY;
    mainWindow.setPosition( x , y )
})
```



# 十一、窗口按钮-关闭软件

![image-20231214005107900](/Users/zhangpang/Library/Application Support/typora-user-images/image-20231214005107900.png)

##### 11.1 布局

```
<div class="login-config">
  <div class="login-config-btn">
  	<el-button icon="close" circle type="default"></el-button>
  </div>
</div>
```

```
.login-config{
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    z-index: 9999;
}
.login-config-btn{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 120px;
    margin: 10px 10px 0 0;
    float: right;
}
```

##### 11.2 关闭窗口

```
close 	方法用于关闭窗口，可以通过监听 close 事件来执行一些自定义操作，并有机会取消关闭操作。
destroy 方法用于彻底销毁一个窗口，不会触发 close 事件，并立即释放与窗口相关的所有资源。
```

##### 11.3 关闭软件

```
app.quit() 方法用于退出整个 Electron 应用程序，可以通过监听 before-quit 事件来执行一些预处理操作。
app.exit() 方法用于立即终止整个 Electron 应用程序的进程，不会触发任何事件。
```



# 十二、窗口按钮-换肤

##### 12.1 布局

```
<el-button circle @click='configDark'>
  <el-icon v-if='dark'><Sunny /></el-icon>
  <el-icon v-else><Moon /></el-icon> 
</el-button>
```

##### 12.2 添加scss文件

```
//App.vue

<style lang='scss'>
@import './assets/css/style.scss';
</style>
```

```
//style.scss

@import 'node_modules/element-plus/theme-chalk/src/dark/css-vars.scss';
*{margin: 0;padding:0;}
a{
  text-decoration: none;
  color:#333;
}
html.dark {
	//变量
	--el-text-color-primary: #d0d0d0;
	--el-color-primary-dark-2: var(--el-color-primary-light-2) !important;
	--el-color-primary-light-9: var(--el-color-primary-dark-8) !important;
	--el-color-primary-light-8: var(--el-color-primary-dark-7) !important;
	--el-color-primary-light-7: var(--el-color-primary-dark-6) !important;
	--el-color-primary-light-5: var(--el-color-primary-dark-4) !important;
	--el-color-primary-light-3: var(--el-color-primary-dark-3) !important;

	//登录背景
	.login {background: var(--el-bg-color);}
  a{
		color:#fff;
	}
	
}
```

##### 12.3 逻辑

```
const dark = ref<string | null>(localStorage.getItem('dark'));
const configDark = ()=>{
    const element = document.querySelector('html') as HTMLElement | null;
    if (element) {
        if( element.className == 'dark'  ){
            element.className = '';
        }else{
            element.className = 'dark';
        }
        dark.value = element.className;
        localStorage.setItem('dark', element.className);
    }
}
```

##### 12.4 App.vue初始化皮肤样式

```
<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import {  ref , onBeforeMount } from 'vue';

onBeforeMount(()=>{
  const dark = ref<string | null>( localStorage.getItem('dark') );
  const element = document.querySelector('html') as HTMLElement | null;
  if( element ){
    if( dark.value == 'dark' ){
        element.className = 'dark';
    }else{
        element.className = '';
    }
  }
})
</script>

<style lang="scss">
@import './assets/css/style.scss';
</style>
```

##### 12.5 顺便把Electron类型给了

```
//preload/index.d.ts

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    ipcRenderer: Electron.IpcRenderer
  }
}
```

