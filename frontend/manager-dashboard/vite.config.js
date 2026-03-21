import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/analytics.io': {
        target: 'http://localhost:3007',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/analytics\.io/, '/socket.io'),
      },
    },
  },
});
