import { defineConfig } from 'vitest/config';

import { sharedVitestConfig } from './vitest.shared.config.ts';

export default defineConfig({
  ...sharedVitestConfig,
  test: {
    ...sharedVitestConfig.test,
    name: 'integration',
    environment: 'node',
    pool: 'forks',
    maxWorkers: 1,
    hookTimeout: 60_000,
    testTimeout: 30_000,
    setupFiles: [
      './src/__tests__/setup.ts',
      './src/__tests__/integration/setup.ts',
    ],
    include: ['src/__tests__/integration/**/*.{test,spec}.{ts,tsx}'],
    exclude: [],
  },
});
