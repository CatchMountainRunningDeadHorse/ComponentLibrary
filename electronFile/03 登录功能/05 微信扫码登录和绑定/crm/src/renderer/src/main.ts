import { createApp } from 'vue'
import App from './App.vue'

//路由
import router from '@router'

//状态管理 && 持久化存储
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
const store = createPinia();
store.use(  piniaPluginPersist  );

//国际化
import i18n from './locals/index.js'

//全局混入
import DictPluginMixins from '@mixins/DictPluginMixins'

//自定义指令
import { AuthDirectives  } from '@directives/auth.directive'

let app = createApp(App);

// 全局引入ElementplusIcon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use( router );
app.use( store  );
app.use(DictPluginMixins);
app.directive( AuthDirectives.name , AuthDirectives  );
app.use( i18n );
app.mount('#app');

