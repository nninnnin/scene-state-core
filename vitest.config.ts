import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: [],
    coverage: { provider: "v8", reporter: ["text", "lcov"] },
  },
});
