"use strict";

const nodeVersion = process.versions.node;
const isESMSupported = +nodeVersion.split(".")[0] >= 14;

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
  ...(isESMSupported && {
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.m?[jt]sx?$"
  })
};
