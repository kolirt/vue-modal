import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dts from 'vite-plugin-dts'
import eslint from 'vite-plugin-eslint'
import pkg from './package.json'

export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin({ useStrictCSP: true }),
    dts({
      tsConfigFilePath: './tsconfig.lib.json',
      rollupTypes: true
    }),
    eslint()
  ],
  build: {
    lib: {
      name: 'vue-modal',
      formats: ['es', 'umd'],
      entry: resolve(__dirname, 'lib/index.ts'),
      fileName: 'vue-modal'
    },
    emptyOutDir: true,
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies)],
      output: {
        globals: {
          ...(() => {
            const obj: Record<string, string> = {}
            Object.keys(pkg.dependencies).forEach((key) => {
              obj[key] = key
            })
            return obj
          })()
        }
      }
    }
  }
})
