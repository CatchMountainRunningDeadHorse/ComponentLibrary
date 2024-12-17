import { createRouter, createWebHashHistory } from "vue-router";

import Home from '../views/Home.vue';
import List from '../views/List.vue';

export default createRouter({
    history: createWebHashHistory(),
    routes:[
        { path: "/", component: Home },
        { path: "/list", component: List }
    ]
})