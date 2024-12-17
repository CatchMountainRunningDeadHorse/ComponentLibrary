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



# 13、窗口按钮-国际化

##### 13.1 布局

```
<el-dropdown trigger="click" @command="configLang">
    <el-button circle>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path d="M478.33 433.6l-90-218a22 22 0 0 0-40.67 0l-90 218a22 22 0 1 0 40.67 16.79L316.66 406h102.67l18.33 44.39A22 22 0 0 0 458 464a22 22 0 0 0 20.32-30.4zM334.83 362L368 281.65L401.17 362z" fill="currentColor"></path><path d="M267.84 342.92a22 22 0 0 0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73c39.65-53.68 62.11-114.75 71.27-143.49H330a22 22 0 0 0 0-44H214V70a22 22 0 0 0-44 0v20H54a22 22 0 0 0 0 44h197.25c-9.52 26.95-27.05 69.5-53.79 108.36c-31.41-41.68-43.08-68.65-43.17-68.87a22 22 0 0 0-40.58 17c.58 1.38 14.55 34.23 52.86 83.93c.92 1.19 1.83 2.35 2.74 3.51c-39.24 44.35-77.74 71.86-93.85 80.74a22 22 0 1 0 21.07 38.63c2.16-1.18 48.6-26.89 101.63-85.59c22.52 24.08 38 35.44 38.93 36.1a22 22 0 0 0 30.75-4.9z" fill="currentColor"></path></svg>
    </el-button>
    <template #dropdown >
        <el-dropdown-menu>
          <el-dropdown-item
          v-for="item in config.LANG"
          :key="item.value"
          :command="item"
          >{{  item.name }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
</el-dropdown>
```

##### 13.2 逻辑

```
import { ref , getCurrentInstance , ComponentInternalInstance } from 'vue';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const config = reactive({
    LANG:[
        {name:"中文",value:'zh-cn'},
        {name:'英文',value:'en'}
    ]
})
const configLang = ( item:any )=>{
    let val:string = item.value;
    let i18n = proxy?.$i18n;
    i18n!.locale = val;
	localStorage.setItem('lang',val);
}
```

##### 13.3 main.ts导入i18n

```
//国际化
import i18n from './locales'
app.use(i18n)
```

##### 13.4 locales/index.ts

```
import { createI18n } from 'vue-i18n'

import zh from './lang/zh-cn'
import en from './lang/en'

//element语言包
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import English from 'element-plus/dist/locale/en.mjs';
const messages = {
    'zh-cn':{
        el:zhCn,
        ...zh
    },
    'en':{
        el:English,
        ...en
    }
}
const i18n = createI18n({
    locale: localStorage.getItem('lang') || 'zh-cn',  // 初始化配置语言
    messages    
})

export default i18n
```

##### 13.5 lang/en.ts

```
export default {
	login: {
		slogan: 'The most concise basic permission framework system.' ,
		describe: 'Electron + Vue3 + element plus based front-end solutions in the background.',
		signInTitle: 'Sign in',
		accountLogin: 'Account sign in',
		mobileLogin: 'Mobile sign in',
		rememberMe: 'Remember me',
		forgetPassword: 'Forget password',
		signIn: 'Sign in',
		signInOther: 'Sign in with',
		userPlaceholder: 'user / phone / email',
		userError: 'Please input a user name',
		PWPlaceholder: 'Please input a password',
		PWError: 'Please input a password',
		admin: 'Administrator',
		user: 'User',
		mobilePlaceholder: 'Mobile',
		mobileError: 'Please input mobile',
		smsPlaceholder: 'SMS Code',
		smsError: 'Please input sms code',
		smsGet: 'Get SMS Code',
		smsSent: 'SMS sent to mobile number',
		noAccount: 'No account?',
		createAccount: 'Create a new account',
		wechatLoginTitle: 'QR code sign in',
		wechatLoginMsg: 'Please use wechat to scan and log in | Auto scan after 3 seconds of simulation',
		wechatLoginResult: 'Scanned | Please click authorize login in the device'
	},
	user: {
		dynamic: 'Dynamic',
		info: 'User Info',
		settings: 'Settings',
		nightmode: 'night mode',
		nightmode_msg: 'Suitable for low light environment,The current night mode is beta',
		language: 'language',
		language_msg: 'Translation in progress,Temporarily translated the text of this view',
	}
}
```

##### 13.6 lang/zh-cn.ts

```
export default {
	login: {
		slogan: '最精简的基础权限框架系统',
		describe: '基于Electron + Vue3 + Element-Plus 的中后台前端解决方案。',
		signInTitle: '用户登录',
		accountLogin: '账号登录',
		mobileLogin: '手机号登录',
		rememberMe: '24小时免登录',
		forgetPassword: '忘记密码',
		signIn: '登录',
		signInOther: '其他登录方式',
		userPlaceholder: '用户名 / 手机 / 邮箱',
		userError: '请输入用户名',
		PWPlaceholder: '请输入密码',
		PWError: '请输入密码',
		admin: '管理员',
		user: '用户',
		mobilePlaceholder: '手机号码',
		mobileError: '111请输入手机号码',
		smsPlaceholder: '短信验证码',
		smsError: '请输入短信验证码',
		smsGet: '获取验证码',
		smsSent: '已发送短信至手机号码',
		noAccount: '还没有账号?',
		createAccount: '创建新账号',
		wechatLoginTitle: '二维码登录',
		wechatLoginMsg: '请使用微信扫一扫登录 | 模拟3秒后自动扫描',
		wechatLoginResult: '已扫描 | 请在设备中点击授权登录'
	},
	user: {
		dynamic: '近期动态',
		info: '个人信息',
		settings: '设置',
		nightmode: '黑夜模式',
		nightmode_msg: '适合光线较弱的环境，当前黑暗模式为beta版本',
		language: '语言',
		language_msg: '翻译进行中，暂翻译了本视图的文本',
	}
}
```

##### 13.7 使用

```
template：非绑定
			<h4>{{  $t('login.slogan')  }}</h4>
			
template：绑定
			<el-tab-pane :label="$t('login.accountLogin')">
			
js：
	const { proxy } = getCurrentInstance() as ComponentInternalInstance;
	proxy?.$t('login.mobileError')
```



# 14、axios封装get和post

##### 14.1 request.ts

```
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const request: AxiosInstance = axios.create({
    baseURL: '/api'
});

// 添加请求拦截器
request.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
});

const http = {
    get<T>(url: string, params?: any, config?: {}): Promise<T> {
      return new Promise((resolve, reject) => {
        request
          .get<T>(url, { params,...config } )
          .then((res: AxiosResponse<T>) => {
            resolve(res.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    post<T>(url: string, data?: any, config?: {}): Promise<T> {
      return new Promise((resolve, reject) => {
        request
          .post<T>(url, data, config)
          .then((res: AxiosResponse<T>) => {
            resolve(res.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
};
  
export default http;
```

##### 14.2 api文件

```
import http from "@utils/request";
import { UserRuleForm , PhoneCodeForm , PhoneRuleForm } from '@interface/login'

interface ILoginRequest{
	code:string
	msg:string
	data?:string | null
}

//图形验证码
export const captchaImage = ( data:{
	key:string
} ):Promise<ArrayBuffer>=>{
	return http.get<ArrayBuffer>('/captcha/image',data,{responseType:'arraybuffer'});
}

//用户登录
export const loginByJson = ( data:UserRuleForm ):Promise<ILoginRequest>=>{
    return http.post<ILoginRequest>('/u/loginByJson',data)
}

//登录动态验证码
export const loginCaptcha = ( data:PhoneCodeForm ):Promise<ILoginRequest>=>{
    
	return http.get<ILoginRequest>('/captcha/sendRegisterOrLoginCaptcha',data)

}

//手机验证码登录
export const loginByMobile = ( data:PhoneRuleForm ):Promise<ILoginRequest>=>{
    return http.post<ILoginRequest>('/u/loginByMobile',data)
}
```



# 15、登录后

##### 15.1 登录后-流程：

```
1. 如果用户输入的正确，点击【登录】：后端会给前端返回【token】，前端需要把token存储起来（本地存储）
2. 请求用户信息接口
	前端在headers头中，把token传递过去
	后端给前端返回当前登录用户的【用户信息】，其中关于登录的有：角色信息-角色权限编码
3. 请求获取路由接口，把角色信息-角色权限编码传递给后端，从而获得此用户的路由菜单权限树
```

##### 15.2 获取用户信息

```
1. 接口
	
	***传递token，要在：config.headers['Authorization'] 中赋值token

2. interface
	export interface User {
    id: string;
    username: string;
    realName: string;
    userType: number;
    email: string;
    phone: string;
    gender: number;
    avatar: string;
    enabled: number;
    delFlag: number;
    remark: string | null;
}

export interface Permission {
    [index: number]: string;
}

export interface Unit {
    id: string;
    name: string;
    code: string;
    codeseq: string;
    contact: string;
    mobile: string;
    email: string;
    web: string;
    parentId: string;
    hasChildren: number;
    system: number;
    enabled: number;
    leaderId: string | null;
    createBy: string;
    createTime: number | null;
    updateBy: string | null;
    updateTime: number | null;
    address: string;
}

export interface Role {
    id: string;
    roleName: string;
    rolePerm: string;
}

export interface IUserData {
    code: string;
    msg: string;
    data: {
        userInfo: User;
        permissions: Permission;
        units: Unit;
        roles: Role[];
    };
}
3. 调用方法=》进行数据存储
import { defineStore } from 'pinia'
import { getInfo } from '@api/user'
import { Role } from '@interface/user'
import { useMenuStore } from '@store/useMenuStore'
export const useUserStore = defineStore('userId', {
  state: ():{
    roles:Role[],
    rolePerm:string
  } => {
    return {
      roles:[],
      rolePerm:''
    }
  },
  getters:{},
  actions:{
    async  getUserInfo(){
      let res = await getInfo();
      let { permissions ,roles , units , userInfo } = res.data;
      this.roles = roles;
      this.rolePerm = roles[0].rolePerm;
     
      useMenuStore().getMenu();
    }
  },
  persist: {
    enabled: true, //开启数据缓存
    strategies: [
      {
        storage: localStorage,//默认走session
        paths: ['rolePerm']
      }
    ]
  }
})
```

##### 15.3 获取路由

```
1. 接口
2. interface
export interface Meta {
    title: string;
    icon: string;
    noCache: boolean;
    link: string | null;
  }
  
export interface Child {
    id: string;
    name: string;
    path: string;
    hidden: boolean;
    component: string;
    meta: Meta;
  }
  
export interface Parent {
    id: string;
    name: string;
    hidden: boolean;
    redirect: string;
    component: string;
    alwaysShow: boolean;
    query: string;
    path: string;
    meta: Meta;
    children: Child[];
  }
  
export interface IResponseData {
    code: string;
    msg: string;
    data: Parent[];
}
3. 调用方法=》进行数据存储

import { defineStore } from 'pinia'
import { getUserMenu } from '@api/user'
import { useUserStore } from '@store/useUserStore'
import { Parent } from '@interface/user'
export const useMenuStore = defineStore('menuId', {
  state: ():{
    menu:Parent[]
  }=> {
    return {
      menu:[]
    }
  },
  getters:{},
  actions:{
    async getMenu(){
        let res = await getUserMenu(useUserStore().rolePerm);
        this.menu = res.data;
        console.log('菜单',useUserStore().rolePerm,res  );
    }
  },
  persist: {
    enabled: true, //开启数据缓存
    strategies: [
      {
        storage: localStorage,//默认走session
        paths: ['menu']
      }
    ]
  }
})
```



# 16、后台管理系统-骨架

##### 16.1 窗口设置

```
//从login跳转到Home，只是路由的切换，窗口并没有换，所以窗口的配置会一直生效，那么就要修改窗口的：

//窗口大小
mainWindow.setSize(1200, 720);
//窗口最小值
mainWindow.setMinimumSize(1000, 500);
//窗口居中
mainWindow.center();
//窗口大小可以修改
mainWindow.setResizable(true);
```

##### 16.2 后台架构布局

提示，用来调试：mainWindow.webContents.openDevTools();

```
<template>
    <section class="aminui-wrapper">
        <!--1级菜单-->
        <div class="aminui-side-split">
            <div class="aminui-side-split-top">
                <router-link to="/">
                    <img class="logo" src="../assets/images/logo-r.png">
                </router-link>
            </div>
            <div class="adminui-side-split-scroll">
                <el-scrollbar>
                    <ul>
                        <li class="active">
                            <el-icon><ChatRound /></el-icon>
                            <p>首页</p>
                        </li>
                        <li>
                            <el-icon><ChatRound /></el-icon>
                            <p>新媒体</p>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
        </div>
        <!--2级菜单-->
        <div class="aminui-side">
            <div class="adminui-side-top">
                <h2>首页</h2>
            </div>
            <div class="adminui-side-scroll">
                <el-scrollbar>
                    <el-menu>
                        <el-menu-item index="1">
                            <el-icon><ChatRound /></el-icon>
                            <span>仪表盘</span>
                        </el-menu-item>
                        <el-menu-item index="2">
                            <el-icon><ChatRound /></el-icon>
                            <span>仪表盘</span>
                        </el-menu-item>
                        <el-menu-item index="3">
                            <el-icon><ChatRound /></el-icon>
                            <span>仪表盘</span>
                        </el-menu-item>
                        <el-menu-item index="4">
                            <el-icon><ChatRound /></el-icon>
                            <span>仪表盘</span>
                        </el-menu-item>
                        <el-menu-item index="5">
                            <el-icon><ChatRound /></el-icon>
                            <span>仪表盘</span>
                        </el-menu-item>
                        <el-menu-item index="6">
                            <el-icon><ChatRound /></el-icon>
                            <span>仪表盘</span>
                        </el-menu-item>
                    </el-menu>
                </el-scrollbar>
            </div>
            <div class="adminui-side-bottom">
                <el-icon><el-icon-expand/></el-icon>
            </div>
        </div>
        <!--右侧组件-->
        <div class="aminui-body">
            右侧内容
        </div>
    </section>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
onBeforeMount(()=>{
    window.electron.ipcRenderer.invoke('resize-window');
})
</script>

<style scoped lang="scss">
.aminui-wrapper{
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .aminui-side-split{
        display: flex;
        flex-direction: column;
        width:65px;
        height: 100vh;
        overflow: hidden;
        background: #222b45;
        .aminui-side-split-top {height: 49px;-webkit-app-region: drag;}
        .aminui-side-split-top a {display: inline-block;width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;}
        .aminui-side-split-top .logo {height:30px;vertical-align: bottom;}
        .adminui-side-split-scroll {overflow: auto;overflow-x:hidden;height: 100%;flex: 1;}
        li {cursor: pointer;width: 65px;height: 65px;color: #fff;text-align: center;display: flex;flex-direction: column;align-items: center;justify-content: center;}
        li i {font-size: 18px;}
        li p {margin-top:5px;font-size:12px;}
        li:hover {background: rgba(255, 255, 255, 0.1);}
        li.active {background: #409EFF;}
    }
    .aminui-side{
        display: flex;
        flex-flow: column;
        width:210px;
        background: #fff;
        box-shadow: 2px 0 8px 0 rgba(29,35,41,.05);
        border-right: 1px solid #e6e6e6;
        .adminui-side-top {    -webkit-app-region: drag;border-bottom: 1px solid #ebeef5;height:49px;line-height: 50px;}
        .adminui-side-top h2 {padding:0 20px;font-size: 17px;color: #3c4a54;}
        .adminui-side-scroll {overflow: auto;overflow-x:hidden;flex: 1;}
        .adminui-side-bottom {border-top: 1px solid #ebeef5;height:51px;cursor: pointer;display: flex;align-items: center;justify-content: center;}
        .adminui-side-bottom i {font-size: 16px;}
        .adminui-side-bottom:hover {color: var(--el-color-primary);}
    }
    .aminui-body{
        flex:1;
    }
}
.el-menu{
    border-right:0px;
}
</style>
```



# 17、hooks

##### 17.1 hooks是什么

```
vue3 中的 hooks 就是函数的一种写法，就是将文件的一些单独功能的 js 代码进行抽离出来进行封装使用。

它的主要作用是 Vue3 借鉴了 React 的一种机制，用于在函数组件中共享状态逻辑和副作用，从而实现代码的可复用性。

注意：其实 hooks 和 vue2 中的 mixin 有点类似，但是相对 mixins 而言， hooks 更清楚复用功能代码的来源, 更清晰易懂。
```

##### 17.2 hooks优点

```
hooks 作为独立逻辑的组件封装，其内部的属性、函数等和外部组件具有响应式依附的作用。
自定义 hook 的作用类似于 vue2 中的 mixin 技术，使用方便，易于上手。
使用 Vue3 的组合 API 封装的可复用，高内聚低耦合。
```

##### 17.3 自定义 hook 需要满足的规范

```
具备可复用功能，才需要抽离为 hooks 独立文件
函数名/文件名以 use 开头，形如: useXX
引用时将响应式变量或者方法显式解构暴露出来；
```

##### 17.4 具体使用

```
//hooks文件

import { useUserStore  } from '@store/useUserStore'
import { useMenuStore } from '@store/useMenuStore'

import router from '@router'

const useLogin = async ( token )=>{
   //1. 存储token
   localStorage.setItem('TOKEN', token );
   //2. 获取用户信息 ==> 数据的存储和重构是在别的地方
   await useUserStore().getUserInfo();
   //3. 获取路由 ==> 数据的存储和重构是在别的地方  
   await useMenuStore().getMenu();
   //4. 进入后台管理系统首页
   router.push('/');
}

export default useLogin;
```

```
//vue文件

//引入hooks
import useLogin from '@hooks/useLogin'

//调用hooks
useLogin( res.data );
```



# 18、渲染一级菜单

##### 18.1 动态组件

```
<el-icon>
	<component :is="item.meta.icon.replace('el-icon-','')"></component>
</el-icon>
```

##### 18.2 把数据传递给子组件

```
nextMenu.value = pmenu.value.children;
```

