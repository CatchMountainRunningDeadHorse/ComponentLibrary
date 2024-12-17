import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
// import store from '@/store/index'
// console.log('555555555555555555555555555555', store)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
    // VueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.js', '.vue']
  },
  eslint: {
    enable: false
  },
  server: {
    hmr: true,
    port: 8080,
    proxy: {
      '/api': {
        // target: 'http://192.168.31.14:9804',
        target: 'https://www.yoyangyun.com/YYT',
        rewrite: (path) => path.replace(/^\/api/, ''),
        ws: true,
        changeOrigin: true
      },
      '/Info': {
        target: 'https://obs.cn-sh1.ctyun.cn/obsApi/',
        // target: 'https://www.yoyangyun.com/YYT',
        rewrite: (path) => path.replace(/^\/Info/, ''),
        ws: true,
        changeOrigin: true
      }
    },
    disableHostCheck: true // 添加这一行
  }
})
