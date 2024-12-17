import './assets/main.css'
// import require from 'require'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/router/index'
import '@/assets/css/global.css'

import store from '@/store'
import App from './App.vue'
import VueCanvasPoster from "vue-canvas-poster";
import '@/assets/font/iconfont.css'
import SocketService from '@/utils/socket_service'
import testSocketService from '@/utils/test_socket'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// import { genarateRouter } from '@/utils/util'
const app = createApp(App)

//其他的组件  globalProperties.$socket
app.config.globalProperties.$Tsocket = testSocketService.Instance
//其他的组件  globalProperties.$socket
app.config.globalProperties.$socket = SocketService.Instance
// router.beforeEach(async (to,from,next) => {
//   if(!store.state.hasAuth){
//     await store.dispatch('setUserRouters')
//     const newRoutes = genarateRouter(store.state.userRouters)
//     newRoutes.forEach(item => {
//       router.addRoute(item)
//     });
//     next({path:to.path})
//   }else{
//     next()
//   }
// })

// router.beforeEach( (to,from,next) => {
//     const isLogin = localStorage.getItem('isLogin')
//     if(isLogin || to.name === 'login'){
//         next()
//     }else{
//         next('/login')
//     }
// })
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(VueCanvasPoster);
app.use(ElementPlus)
app.use(store)
app.use(router)
// app.use(websocket)
// app.use(AFRAME)
app.mount('#app')



