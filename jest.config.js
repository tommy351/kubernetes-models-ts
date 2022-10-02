"use strict";

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^kubernetes-models/(.*)":
      "<rootDir>/first-party/kubernetes-models/dist/$1",
    "^@kubernetes-models/apimachinery/(.*)":
      "<rootDir>/first-party/apimachinery/dist/$1"
  },
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
