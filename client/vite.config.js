import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '197e-2401-4900-6468-c2b0-379b-8528-6a19-7421.ngrok-free.app' // Add your ngrok host here
    ]
  }
})
