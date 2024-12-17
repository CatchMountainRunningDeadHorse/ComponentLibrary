import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import ViteWorkerPlugin from 'vite-plugin-worker';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // ViteWorkerPlugin()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions:[".js",".vue"]
  },
  // lintOnSave:false,
  //开启代理服务器 (方式二)
  server: {
    hmr:true,
    port:8887,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8888',
        rewrite: (path) => path.replace(/^\/api/, ''),
        ws: true,
        changeOrigin: true
      },
    }
  },
    //加载器
    chainWebpack: config => {
      config.module
        .rule('gltf')
        .test(/\.(gltf)$/)
        .use('gltf-webpack-loader')
        .loader('gltf-webpack-loader')
        .end();
        // 添加处理 .glb 文件的规则
      config.module
        .rule('glb')
        .test(/\.(glb)$/)
        .use('raw-loader')
        .loader('raw-loader')
        .end();
      config.module
        .rule('worker-loader')
        .test(/\.worker\.js$/)
        .use({
          loader:'worker-loader',
          options:{
            inline:true
          }
        })
        .loader('worker-loader')
        .end();
    }
})
