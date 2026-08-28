import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // TanStack Router's Vite plugin MUST stay first so it can watch route
    // files and emit the generated route tree before React/Babel sees them.
    tanstackRouter({
      target: 'react',
      routesDirectory: 'src/routes',
      generatedRouteTree: 'src/routeTree.gen.ts',
    }),
    // React (Oxc JSX transform + Fast Refresh). No options here — the
    // Compiler runs via the separate @rolldown/plugin-babel entry below.
    react(),
    // React Compiler via Babel — Stage 1: annotation-only.
    babel({
      presets: [
        reactCompilerPreset({
          compilationMode: 'annotation',
          target: '19',
          panicThreshold: 'none',
        }),
      ],
    }),
    // Tailwind last (CSS-only transform).
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
