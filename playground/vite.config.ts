import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@kolirt/vue-modal': fileURLToPath(new URL('../packages/core/src/index.ts', import.meta.url))
    }
  },
  server: { port: 5173, open: false }
})
