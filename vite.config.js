import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    // Serve index.html for all routes (SPA fallback)
    historyApiFallback: true,
  },
  preview: {
    // Same fallback for `npm run preview`
    historyApiFallback: true,
  },
});
