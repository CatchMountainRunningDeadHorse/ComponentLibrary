export const AppRoutes = [
    { 
        path: "/", 
        name:'首页',
        redirect: '/dashboard',
        component: ()=>import('@layout/index.vue'),
        children:[
            {
                path: "/dashboard", 
                component: ()=>import('@views/home/index.vue'),
            }
        ]
    },
    { 
        path: "/system", 
        component: ()=>import('@layout/index.vue'),
        children:[
            {
                path: "/system/role", 
                component: ()=>import('@views/system/role/index.vue'),
            }
        ]
    },
    { 
        path: "/login", 
        name:'登录',
        component: ()=>import('@views/login/Login.vue') 
    }
]