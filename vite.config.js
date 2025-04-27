// Change file extension to .mjs and use ESM syntax
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // Add this import

export default defineConfig({
  plugins: [vue()], // Add Vue plugin
  base: './',
  server: {
    proxy: {
      '/yolo-detect': {
        target: 'http://localhost:10404',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/yolo-detect/, '')
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1000, // 提升警告阈值
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'vue': ['vue', '@vue/runtime-dom'],
          'lodash': ['lodash-es', 'lodash-unified'],
          'vendors': ['axios', 'dayjs']
        }
      }
    }
  }
})