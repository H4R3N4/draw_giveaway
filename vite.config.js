import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Les appels /api partent vers le relais Facebook (dossier server/),
    // seul détenteur du jeton d'accès.
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.PORT || 5174}`,
        changeOrigin: true,
      },
    },
  },
})
