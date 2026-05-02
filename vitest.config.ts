import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/__tests__/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    setupFiles: ["./.vitest/setup.ts"]
  }
});
