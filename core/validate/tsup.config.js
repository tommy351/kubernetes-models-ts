"use strict";

const { defineConfig } = require("tsup");

export default defineConfig([
  {
    name: "base",
    entry: ["src/index.ts"],
    sourcemap: true,
    outDir: "dist",
    format: ["cjs", "esm"],
    platform: "neutral",
    treeshake: true
  },
  {
    name: "types",
    entry: ["src/index.ts"],
    dts: true,
    outDir: "dist"
  },
  {
    name: "node-esm",
    entry: ["src/index.ts"],
    format: "esm",
    outDir: "dist",
    sourcemap: true,
    platform: "node",
    treeshake: true,
    esbuildOptions(options) {
      options.resolveExtensions = [".node-esm.ts", ".ts", ".js"];
    },
    outExtension() {
      return { js: ".node.mjs" };
    }
  }
]);
