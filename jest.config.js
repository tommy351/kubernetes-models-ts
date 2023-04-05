"use strict";

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "cjs",
    "mjs",
    "json",
    "node"
  ],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.m?[jt]sx?$",
  setupFilesAfterEnv: ["jest-extended/all"]
};
