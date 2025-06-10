// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  /* ── load *.env files so you can reference them with import.meta.env ── */
  loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    /**
     * Dev-server
     * ──────────
     * • runs on :5173
     * • any request beginning with /api is proxied to the
     *   Express server that’s listening on :5000
     */
    server: {
      port: 5173,
      open: true,
      proxy: {
        "/api": {
          // target: "http://localhost:5001",
          target: "http://localhost:4000", // Express server
          changeOrigin: true, // sets correct host header for CORS
          secure: false, // ignore self-signed certs in dev (HTTPS)
        },
      },
    },

    /**
     * Build output
     */
    build: {
      outDir: "dist/client",
      emptyOutDir: true,
    },

    /**
     * (Optional) path aliases
     */
    // resolve: {
    //   alias: {
    //     "@": path.resolve(__dirname, "src"),
    //   },
    // },
  };
});
