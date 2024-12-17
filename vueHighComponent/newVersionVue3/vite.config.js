import { fileURLToPath, URL } from 'node:url'
// import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
      // eslint-disable-next-line no-undef
      // '@': path.resolve(__dirname, './src')
    },
    extensions: ['.js', '.vue']
  },
  eslint: {
    enable: false
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
