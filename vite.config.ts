import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from 'vite-tsconfig-paths'
import react from "@vitejs/plugin-react-swc";
import tailwindcss from 'tailwindcss'
import dotenv from 'dotenv'

dotenv.config()

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return defineConfig({
    plugins: [react(), tsconfigPaths()],
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
