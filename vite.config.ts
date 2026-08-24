import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Load .env files from the environment/ folder instead of project root.
  // Resolved relative to this config file so it works regardless of CWD.
  envDir: resolve(dirname(fileURLToPath(import.meta.url)), 'environment'),
  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src'),
    },
  },
});
