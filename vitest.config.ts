import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['tests/unit/**/*.test.ts', 'src/components/__tests__/**/*.test.tsx'],
    environment: 'jsdom',
    reporters: process.env.CI
      ? [['allure-vitest/reporter', { resultsDir: 'allure-results' }]]
      : ['verbose'],
    coverage: {
      provider: 'v8',
      include: ['src/utils/**', 'src/hooks/useHistory.ts'],
      exclude: ['src/utils/modes.ts'],
      reporter: ['text', 'lcov'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 80,
      },
    },
  },
})
