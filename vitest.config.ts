// eslint-disable-next-line n/no-missing-import, n/no-unpublished-import
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/__tests__/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    setupFiles: ["./.vitest/setup.ts"]
  }
});
