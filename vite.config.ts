import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // La escena 3D (módulo Representación técnica) se carga con React.lazy,
    // así que Vite no la descubre en el rastreo inicial de dependencias —
    // sin esto, la primera visita re-optimiza sobre la marcha y puede
    // provocar un fallo transitorio de React en desarrollo (no ocurre en
    // producción). Declararlas aquí las precompila desde el arranque.
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
})
