import path from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { playwright } from '@vitest/browser-playwright'
import storybookTest from '@storybook/addon-vitest/vitest-plugin'
import { defineConfig } from 'vitest/config'

const dirname: string = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss({ optimize: true })],
  resolve: {
    alias: {
      '@': path.join(dirname, 'src'),
      '~': path.join(dirname, 'src')
    }
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary'],
      thresholds: {
        'src/shared/utils/**/*.ts': { lines: 70 },
        'src/features/**/hooks/**/*.ts': { lines: 70 },
        'src/features/**/components/**/*.tsx': { lines: 70 },
        'src/features/**/services/**/*.ts': { lines: 50 },
      },
      exclude: ['node_modules/**', 'tests/**', 'src/mocks/**', 'src/tests/**'],
    },
    projects: [
      {
        name: 'unit',
        test: {
          include: ['src/**/*.test.{ts,tsx}'],
          environment: 'happy-dom',
          setupFiles: ['./src/tests/setup.ts'],
          globals: true,
          alias: {
            '@': path.join(dirname, 'src'),
            '~': path.join(dirname, 'src')
          }
        }
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
            storybookScript: 'pnpm storybook --no-open',
            storybookUrl: 'http://localhost:6006'
          })
        ],
        test: {
          name: 'storybook',
          root: '.storybook',
          browser: {
            enabled: true,
            provider: playwright({}),
            headless: true,
            instances: [{ browser: 'chromium' }]
          },
          setupFiles: ['./vitest.setup.ts']
        }
      }
    ]
  }
})
