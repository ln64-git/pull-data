import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // adjust if needed
    },
  },
  test: {
    environment: 'node',
  },
});
