import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/war-is-peace-photobooth-frontend/',
  plugins: [react()],
  server: {
    port: 8080,
    host: true,
    proxy: {
      '/photos': 'http://localhost:8000'
    }
  },
});
