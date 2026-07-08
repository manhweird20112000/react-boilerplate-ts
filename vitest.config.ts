import path from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
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
        'src/features/**/services/**/*.ts': { lines: 50 }
      },
      exclude: ['node_modules/**', 'tests/**', 'src/**/msw/**', 'src/tests/**']
    },
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'happy-dom',
    setupFiles: ['./src/tests/setup.ts'],
    globals: true,
    alias: {
      '@': path.join(dirname, 'src'),
      '~': path.join(dirname, 'src')
    }
  }
})
