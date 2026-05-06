import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/sdk/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist/sdk',
  external: ['react', 'react-dom', 'react-router-dom', 'axios'],
  minify: true
})
