import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '1fd2-2401-4900-6468-c2b0-e434-5c3c-80ee-bd7e.ngrok-free.app' // Add your ngrok host here
    ]
  }
})
