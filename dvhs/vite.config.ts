import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ◉  If you need path aliases (optional):
// import { resolve } from 'path';
// const r = (p: string) => resolve(__dirname, p);

export default defineConfig({
  plugins: [react()],

  /**
   * Dev-server settings
   * ──────────────
   *  ▸ Runs on 5173 by default
   *  ▸ Proxies **ANY** request that starts with /api
   *    to the Express proxy on port 5000
   */
  server: {
    port: 5173, // optional (default 5173)
    open: true, // auto-opens the browser
    proxy: {
      "/api": "http://localhost:5000",
    },
  },

  /**
   * Build settings (optional)
   * Vite will emit the React app to /dist as usual.
   */
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
  },

  /**
   * Resolve aliases (un-comment if you want to use "@/" or similar)
   */
  // resolve: {
  //   alias: {
  //     '@': r('src')
  //   }
  // }
});
