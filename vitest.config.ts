import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Component tests only (*.test.tsx, happy-dom). Pure-layer tests stay on the
// native Node runner — vitest deliberately does not include *.test.ts.

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.tsx'],
    setupFiles: ['src/test/setup.ts'],
    css: {
      modules: { classNameStrategy: 'non-scoped' },
    },
  },
});
