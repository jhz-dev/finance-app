import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tsconfigPaths({ root: "." })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@tests": fileURLToPath(new URL("./src/_tests_", import.meta.url))
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/_tests_/setup.ts",
    coverage: {
      provider: "v8",
    },
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
