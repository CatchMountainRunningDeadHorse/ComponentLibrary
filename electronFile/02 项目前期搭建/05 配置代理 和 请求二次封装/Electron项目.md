接口地址：http://doc.xuexiluxian.cn/

账号：testapi

密码：123456



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



