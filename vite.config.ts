import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // TanStack Router's Vite plugin must come before @vitejs/plugin-react so
    // it can watch route files and emit the generated route tree.
    tanstackRouter({
      target: 'react',
      routesDirectory: 'src/routes',
      generatedRouteTree: 'src/routeTree.gen.ts',
    }),
    react(),
    tailwindcss(),
  ],
  // Load .env files from the environment/ folder instead of project root.
  // Resolved relative to this config file so it works regardless of CWD.
  envDir: resolve(dirname(fileURLToPath(import.meta.url)), 'environment'),
  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src'),
    },
  },
});