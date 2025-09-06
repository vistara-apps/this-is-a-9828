import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          wallet: ['@rainbow-me/rainbowkit', 'wagmi', 'viem'],
          utils: ['axios', 'date-fns', 'lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
