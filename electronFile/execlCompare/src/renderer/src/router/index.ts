import { createRouter, createWebHistory } from "vue-router";
import routes from './routes'
import {beforeEach} from './guards'
const router = createRouter({
    history: createWebHistory(),
    routes 
}) 

router.beforeEach(beforeEach)


// router.afterEach(afterEach)
export default router

