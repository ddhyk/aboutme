import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://211.159.149.77:8000',
        changeOrigin: true
      }
    },
    // 开发服务器配置
    host: '0.0.0.0', // 监听所有地址
    port: 5173,      // 端口
    open: true,      // 自动打开浏览器
    // 配置history模式的回退
    historyApiFallback: {
      rewrites: [
        // 处理非根路径的路由请求，将其重定向到index.html
        { from: /^\/blog.*/, to: '/index.html' },
        { from: /^\/notes.*/, to: '/index.html' },
        { from: /^\/resource.*/, to: '/index.html' },
        { from: /^\/ai.*/, to: '/index.html' },
        { from: /^\/about.*/, to: '/index.html' },
      ]
    }
  },
  build: {
    outDir: 'dist'
  }
}) 