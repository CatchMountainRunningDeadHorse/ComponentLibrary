import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import SvgIcon from '@/components/iconfont/SvgIcon.vue'
import '@/components/iconfont/iconfont.js'

//element-plus组件汉化
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/es/locale/lang/zh-cn'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import mitt from 'mitt'
import Cookies from 'js-cookie'
import { useUserRoutersStore } from '@/stores/store'
import { genarateRouter } from '@/utils/util'

const app = createApp(App)
const bus = mitt()
app.config.globalProperties.$bus = bus //相当于Vue2中的:Vue.prototype.$bus = bus

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
const setRouter = useUserRoutersStore()
// router.beforeEach(async (to, from, next) => {
//   const isLogin = Cookies.get('isLogin')
//   if ((isLogin || to.name === 'login') && !setRouter.routePamars.hasAuth) {
//     console.log('1111111111111')

//     await setRouter.setUserRouters()
//     const newRoutes = genarateRouter(setRouter.routePamars.userRouters)
//     localStorage.setItem('customRoutes', JSON.stringify(newRoutes))
//     newRoutes.forEach((item) => {
//       router.addRoute(item)
//     })
//     next()
//   } else {
//     console.log('22222222222222222')

//     localStorage.clear()
//     Cookies.remove('isLogin')
//     next('/login')
//   }
// })
app.component('SvgIcon', SvgIcon)
app.use(ElementPlus, { locale })
app.use(router)

app.mount('#app')
