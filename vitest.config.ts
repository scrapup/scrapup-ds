import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'test/**/*.test.{ts,tsx}'],
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/components/**', 'src/lib/**'],
      exclude: ['**/*.stories.tsx', '**/index.ts', '**/*.test.{ts,tsx}', '**/*.css'],
      reporter: ['text', 'json-summary', 'html'],
      thresholds: { lines: 95, branches: 95, functions: 95, statements: 95 },
    },
  },
});
