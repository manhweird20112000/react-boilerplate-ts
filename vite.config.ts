import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from 'vite-tsconfig-paths'
import react from "@vitejs/plugin-react-swc";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from 'tailwindcss'
import dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config()

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return defineConfig({
    plugins: [
      react(),
      tsconfigPaths(),
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "weird-1k",
        project: "javascript-react",
      }),
    ],
    build: {
      minify: false,
      sourcemap: false
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '~': resolve(__dirname, 'src'),
      },
      dedupe: ['tsx', 'ts'],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    css: {
      postcss: {
        plugins: [tailwindcss],
      },
    },
    define: {
      'process.env': process.env,
    },
  });
}
