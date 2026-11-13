import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ server: { proxy: { '/api': { target: 'http://127.0.0.1:8083', changeOrigin: true, rewrite: (path) => path.replace(/^\/api/, '') } } }, plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }), react(), tailwindcss()] });
