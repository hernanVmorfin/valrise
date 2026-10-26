import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    outDir: resolve(import.meta.dirname, 'packages/valrise-core/assets/dist'),
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: resolve(import.meta.dirname, 'packages/valrise-core/assets/inquiry.ts'),
      output: {
        entryFileNames: 'js/inquiry-[hash].js',
        assetFileNames: 'css/inquiry-[hash][extname]',
      },
    },
  },
});
