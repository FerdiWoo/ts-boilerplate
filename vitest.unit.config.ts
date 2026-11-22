import { defineConfig } from 'vitest/config';

import { sharedVitestConfig } from './vitest.shared.config.ts';

export default defineConfig({
  ...sharedVitestConfig,
  test: {
    ...sharedVitestConfig.test,
    name: 'unit',
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['src/__tests__/integration/**'],
  },
});
