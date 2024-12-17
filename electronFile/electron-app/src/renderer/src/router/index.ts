import { createRouter,createWebHistory } from "vue-router";

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkActiveClass: 'is-active',
    routes:[
        {
            path:'/',
            component:()=>import('../views/home/index.vue')
        },
        {
            path:'/list',
            component:()=>import('../views/list/index.vue')
        }
    ]
})