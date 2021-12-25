/* eslint-disable node/no-unpublished-require */
"use strict";

const globby = require("globby");
const { dirname } = require("path");

module.exports = {
  entryPoints: globby
    .sync("packages/*/tsconfig.json", {
      cwd: dirname(__dirname),
      absolute: true
    })
    .map((path) => dirname(path)),
  out: "public",
  entryPointStrategy: "packages"
};
