export default [
    {
        path:'/',
        name:'首页',
        component:()=>import('@renderer/views/Login/index.vue')
    },
    {
        path:'/compare',
        name:'比较',
        component:()=>import('@renderer/views/Compare/index.vue')
    }
]