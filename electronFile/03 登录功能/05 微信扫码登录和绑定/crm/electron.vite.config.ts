import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

//element-plus
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

//设置组件name
import VueSetupExtend from 'vite-plugin-vue-setup-extend'

const publicDir = resolve('resources');
const envDir = resolve('build');

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    publicDir,
    envDir,
    envPrefix:'RENDERER_',
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@router': resolve('src/renderer/src/router'),
        '@views':resolve('src/renderer/src/views'),
        '@store':resolve('src/renderer/src/store'),
        '@hooks':resolve('src/renderer/src/hooks'),
        '@utils':resolve('src/renderer/src/utils'),
        '@api':resolve('src/renderer/src/api'),
        '@config':resolve('src/renderer/src/config'),
        '@types':resolve('src/renderer/src/types'),
        '@layout':resolve('src/renderer/src/layout'),
        '@mixins':resolve('src/renderer/src/mixins'),
        '@directives':resolve('src/renderer/src/directives'),
        '@components':resolve('src/renderer/src/components'),
      }
    },
    server:{
      "proxy":{
        "/api":{
          //target:'http://uat.crm.xuexiluxian.cn',
          target:'http://www.xuexiluxian.cn:9999',
          changeOrigin:true,
          rewrite: path =>  path.replace(/^\/api/,'')
        }
      }
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      VueSetupExtend()
    ]
  }
})
