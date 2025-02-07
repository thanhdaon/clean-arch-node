import path from "node:path";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => ({
  test: {
    env: loadEnv(mode, process.cwd(), ""),
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
}));
