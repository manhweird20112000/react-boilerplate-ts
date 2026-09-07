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
          // Vite 8 / Rolldown: prefer codeSplitting.groups over deprecated manualChunks.
          codeSplitting: {
            groups: [
              {
                name: 'react-vendor',
                test: /node_modules[\\/](?:react-dom|scheduler|react)[\\/]/,
                priority: 30
              },
              {
                name: 'router-vendor',
                test: /node_modules[\\/]react-router(?:-dom)?[\\/]/,
                priority: 20
              }
            ]
          }
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
