import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'jsdom',
    reporters: process.env.CI
      ? [['allure-vitest/reporter', { resultsDir: 'allure-results' }]]
      : ['verbose'],
  },
})
