import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'

const projectRoot: string = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_DEV_PORT = 9000

function resolvePortFromEnv(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw === '') {
    return fallback
  }
  const parsed: number = Number.parseInt(raw, 10)
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 65535) {
    return fallback
  }
  return parsed
}

/**
 * Splits stable framework dependencies into separate chunks for caching.
 */
function resolveManualChunk(moduleId: string): string | undefined {
  if (!moduleId.includes('node_modules')) {
    return undefined
  }
  if (
    moduleId.includes('@reduxjs') ||
    moduleId.includes('redux-saga') ||
    moduleId.includes('/react-redux/')
  ) {
    return 'redux-vendor'
  }
  if (moduleId.includes('react-router')) {
    return 'router-vendor'
  }
  if (/node_modules\/react(?!-)/u.test(moduleId) || moduleId.includes('react-dom')) {
    return 'react-vendor'
  }
  return undefined
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectRoot, '')
  const appPort: number = resolvePortFromEnv(env.VITE_APP_PORT, DEFAULT_DEV_PORT)
  return {
    plugins: [react(), tailwindcss({ optimize: true })],
    resolve: {
      alias: {
        '@': path.resolve(projectRoot, 'src'),
        '~': path.resolve(projectRoot, 'src')
      }
    },
    server: {
      port: appPort,
      strictPort: true,
      host: true
    },
    optimizeDeps: {
      include: ['@reduxjs/toolkit', 'react', 'react-dom', 'react-router-dom']
    },
    build: {
      target: 'es2022',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: resolveManualChunk
        }
      }
    },
    preview: {
      port: appPort,
      strictPort: true,
      host: true
    }
  }
})
