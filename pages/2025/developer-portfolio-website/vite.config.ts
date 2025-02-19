import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/2025/developer-portfolio-website/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});