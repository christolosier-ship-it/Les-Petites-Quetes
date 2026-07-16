import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/Les-Petites-Quetes/',
  plugins: [react()],
  build: {
    target: 'es2022',
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: [
        'src/app/state/**/*.ts',
        'src/app/controller/**/*.ts',
        'src/application/model/**/*.ts',
        'src/application/services/**/*.ts',
        'src/domain/**/*.ts',
        'src/persistence/**/*.ts',
        'src/assets/registry/**/*.ts',
        'src/content/validation/**/*.ts',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
    },
  },
});
