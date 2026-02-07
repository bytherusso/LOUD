import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/LOUD/', // Asegúrate que esto coincida con tu repo
  build: {
    // Aumentamos el límite de aviso (opcional) o dividimos los chunks
    chunkSizeWarningLimit: 1000, // Subimos el límite a 1000kb para que no moleste
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Si el código viene de node_modules (librerías), ponlo en un archivo separado
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})