import { fileURLToPath } from 'node:url';

const sharedVitestConfig = {
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'server-only': fileURLToPath(
        new URL('./src/__tests__/server-only.ts', import.meta.url)
      ),
    },
  },
  test: {
    globals: true,
  },
};

export { sharedVitestConfig };
