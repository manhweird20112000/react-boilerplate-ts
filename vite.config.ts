import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'

const projectRoot: string = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_DEV_PORT = 9999

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
  const packageName = resolveNodeModulePackageName(moduleId)

  if (!packageName) {
    return undefined
  }

  if (packageName === 'react-router' || packageName === 'react-router-dom') {
    return 'router-vendor'
  }

  if (packageName === 'react' || packageName === 'react-dom' || packageName === 'scheduler') {
    return 'react-vendor'
  }

  return undefined
}

function resolveNodeModulePackageName(moduleId: string): string | undefined {
  const normalizedModuleId = normalizeModuleId(moduleId)
  const nodeModulesMarker = '/node_modules/'
  const nodeModulesIndex = normalizedModuleId.lastIndexOf(nodeModulesMarker)

  if (nodeModulesIndex === -1) {
    return undefined
  }

  const packagePath = normalizedModuleId.slice(nodeModulesIndex + nodeModulesMarker.length)
  const packagePathParts = packagePath.split('/')
  const scopeOrName = packagePathParts[0]

  if (!scopeOrName) {
    return undefined
  }

  if (scopeOrName.startsWith('@')) {
    const scopedPackageName = packagePathParts[1]

    return scopedPackageName ? `${scopeOrName}/${scopedPackageName}` : undefined
  }

  return scopeOrName
}

function normalizeModuleId(moduleId: string): string {
  return moduleId.replaceAll('\\', '/')
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
      include: ['react', 'react-dom', 'react-router-dom']
    },
    test: {
      environment: 'happy-dom',
      setupFiles: ['./src/tests/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        include: ['src/**'],
        exclude: [
          'node_modules/**',
          'src/shared/utils/mock-data/**',
          'src/tests/**',
          'src/**/msw/**',
          'src/routes/**',
          'src/store/**'
        ],
        thresholds: {
          global: {
            lines: 70,
            branches: 70,
            functions: 70,
            statements: 70
          }
        }
      }
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
