import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      },
      extensions: ['.ts', '.vue']
    },
    plugins: [vue()],
    // server:{
    //   "proxy":{
    //     "/api":{
    //       target:"http://localhost:3000",
    //       changeOrigin:true,
    //       rewrite:path=>path.replace('/^\/api/','')
    //     }
    //   }
    // }
  }
})