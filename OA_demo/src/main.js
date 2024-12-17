// import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/css/global.css'
import '@/assets/font/iconfont.css'
import '@/components/iconfont/iconfont.js'
import '@/utils/browser_patch'

import 'dayjs/locale/zh-cn'
import locale from 'element-plus/es/locale/lang/zh-cn'

import router from '@/router/index'
// import VueCanvasPoster from 'vue-canvas-poster'
import store from '@/store/index'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//添加事件管理者'passive'，来阻止'touchstart'事件，让页面更加流畅。 解决chrome下的warning问题
import 'default-passive-events'
import SvgIcon from '@/components/iconfont/SvgIcon.vue'
import Cookies from 'js-cookie'
import mitt from 'mitt'

const app = createApp(App)
const bus = mitt()
app.config.globalProperties.$bus = bus //相当于Vue2中的:Vue.prototype.$bus = bus

router.beforeEach(async (to, from, next) => {
  const isLogin = Cookies.get('isLogin')
  if (isLogin || to.name === 'login') {
    next()
  } else {
    localStorage.clear()
    Cookies.remove('isLogin')
    next('/login')
  }
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('SvgIcon', SvgIcon)
app.use(ElementPlus, { locale })
app.use(router)
app.use(store)
app.mount('#app')
