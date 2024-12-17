//路由表
import { markRaw } from 'vue'
export const AppRoutes = markRaw([
    { 
        path: "/", 
        redirect:'/dashboard',
        name:'layout',
        component: ()=>import('@layout/index.vue') 
    },
    { 
        path: "/login", 
        meta:{
            name:'登录',
        },
        component: ()=>import('@views/login/Login.vue')
    }
])

