import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import type { Config } from './src/types/electron.js'

const configPath = path.resolve(__dirname, 'duoyunARConfig.json')
let config: Config = {}
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
}
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/ui'),
    },
  },
  build: {
    outDir: 'dist-reract',
  },
  server: {
    port: config.portNumber || 5123,
    strictPort: true,
  },
})
