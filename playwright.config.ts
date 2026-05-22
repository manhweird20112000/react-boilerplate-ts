import { defineConfig, devices } from '@playwright/test'

const appPort = process.env.VITE_APP_PORT ?? '9999'
const baseURL = `http://127.0.0.1:${appPort}`

const e2eServerEnv: Record<string, string> = {
  VITE_APP_PORT: appPort,
  VITE_API_URL: process.env.VITE_API_URL ?? 'https://api.w3rd.com/api/',
  VITE_APP_NAME: process.env.VITE_APP_NAME ?? 'W3RD Codebase',
  VITE_USE_MOCK: process.env.VITE_USE_MOCK ?? 'true',
  VITE_USE_MSW: process.env.VITE_USE_MSW ?? 'true'
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/example.spec.ts', '**/seed.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'pnpm dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: e2eServerEnv
  }
})
