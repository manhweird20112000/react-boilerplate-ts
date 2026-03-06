import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import * as path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss({ optimize: true })],

  resolve: {
    alias: {
      "~": path.resolve("./src"),
    },
  },

  build: {
    minify: true,
  },

  server: {
    port: parseInt(process.env.VITE_PORT || "9000"),
  },

  
});
