import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: true,
    allowedHosts: ['5173-ivettigro51j9a5jflkrx-dd1713b5.manusvm.computer', '5174-ivettigro51j9a5jflkrx-dd1713b5.manusvm.computer']
  }
})

