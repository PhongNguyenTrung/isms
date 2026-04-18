import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/analytics.io': {
        target: 'http://localhost:3007',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/analytics\.io/, '/socket.io'),
      },
      '/socket.io': {
        target: 'http://localhost:3003',
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
