import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@toreva/types': path.resolve(__dirname, 'packages/types/src/index.ts'),
    },
  },
  test: {
    environment: 'node',
    include: ['packages/*/src/**/*.test.ts'],
  },
});
