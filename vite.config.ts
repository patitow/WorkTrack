import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/renderer'),
      '@/components': resolve(__dirname, 'src/renderer/components'),
      '@/stores': resolve(__dirname, 'src/renderer/stores'),
      '@/utils': resolve(__dirname, 'src/renderer/utils'),
      '@/types': resolve(__dirname, 'src/renderer/types'),
    },
  },
  server: {
    port: 3000,
  },
})
