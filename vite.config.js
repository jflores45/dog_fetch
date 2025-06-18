import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'https://frontend-take-home-service.fetch.com',
        changeOrigin: true,
        secure: true,
      },
      '/dogs': {
        target: 'https://frontend-take-home-service.fetch.com',
        changeOrigin: true,
        secure: true,
      },
      '/locations': {
        target: 'https://frontend-take-home-service.fetch.com',
        changeOrigin: true,
        secure: true,
      }
      
    }
  }
})
