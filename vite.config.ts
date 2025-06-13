import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  esbuild: {
    target: 'es2020',
    // Remove the loader and include/exclude - let Vite handle it automatically
  },
  build: {
    target: 'es2020'
  }
});