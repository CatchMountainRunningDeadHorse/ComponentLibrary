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

