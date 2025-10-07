import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          redux: ["@reduxjs/toolkit", "react-redux"],
          ui: ["@radix-ui/react-slot", "@radix-ui/react-avatar"],
          animations: ["framer-motion"],
          icons: ["lucide-react"],
        },
      },
    },
  },
});
