import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://erp.dr-scent.ge',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
