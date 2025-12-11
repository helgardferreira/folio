/// <reference types='vitest' />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    emptyOutDir: true,
    outDir: './dist',
    reportCompressedSize: true,
    target: 'ES2023',
  },
  cacheDir: '../../node_modules/.vite/apps/frontend',
  plugins: [react(), tailwindcss()],
  preview: {
    host: 'localhost',
    port: 4200,
  },
  root: __dirname,
  server: {
    host: 'localhost',
    port: 4200,
  },
  test: {
    coverage: {
      provider: 'v8' as const,
      reportsDirectory: './test-output/vitest/coverage',
    },
    environment: 'jsdom',
    globals: true,
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    name: 'frontend',
    reporters: ['default'],
    watch: false,
  },
}));
