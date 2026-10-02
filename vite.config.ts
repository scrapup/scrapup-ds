import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Library mode (plan §4.1): ESM only, React external, one stylesheet (styles.css)
// plus the token-only stylesheet (tokens.css).
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        tokens: resolve(import.meta.dirname, 'src/tokens.css'),
      },
      formats: ['es'],
    },
    cssCodeSplit: true,
    minify: true,
    sourcemap: false,
    rolldownOptions: {
      external: [/^react(-dom)?(\/.*)?$/],
      output: {
        assetFileNames: (asset) => (asset.names[0] === 'index.css' ? 'styles.css' : '[name][extname]'),
      },
    },
  },
});
