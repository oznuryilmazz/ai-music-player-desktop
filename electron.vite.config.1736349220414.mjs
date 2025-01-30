import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      target: 'node16' // Electron ana süreci için uygun hedef
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      target: 'node16' // Preload süreci için uygun hedef
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer')
      }
    },
    plugins: [react()],
    build: {
      target: 'web' // Renderer süreci için doğru hedef
    }
  }
})
