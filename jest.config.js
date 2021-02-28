"use strict";

module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/packages"],
  collectCoverageFrom: ["packages/*/src/**/*.ts", "!packages/*/src/index.ts"],
  testEnvironment: "node",
  moduleNameMapper: {
    "^kubernetes-models/(.+)$": "kubernetes-models/$1.cjs"
  }
};
