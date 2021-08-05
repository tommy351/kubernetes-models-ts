/* eslint-disable node/no-unpublished-import */
import makeDir from "make-dir";
import { join } from "path";
import yargs from "yargs";
import fs from "fs";
import { promisify } from "util";
import signale from "signale";

const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

const args = yargs
  .option("name", {
    type: "string",
    demandOption: true,
    description: "Package name"
  })
  .option("description", {
    type: "string",
    description: "Package description"
  })
  .option("author", {
    type: "string",
    description: "Package author"
  })
  .parse();

(async () => {
  const pkgDir = join(__dirname, "..", "packages", args.name);

  try {
    await stat(pkgDir);
    throw new Error(`Path already exists: ${pkgDir}`);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }

  const pkgJson = {
    name: `@kubernetes-models/${args.name}`,
    version: "0.0.0",
    description: args.description,
    repository: {
      type: "git",
      url: "https://github.com/tommy351/kubernetes-models-ts.git"
    },
    homepage: `https://github.com/tommy351/kubernetes-models-ts/tree/master/packages/${args.name}`,
    author: args.author,
    license: "MIT",
    main: "index.js",
    module: "index.mjs",
    types: "index.d.ts",
    sideEffects: false,
    scripts: {
      build: "npm-run-all build:*",
      postbuild: "export-map generate --cwd gen --export gen/export-map.json",
      prepack:
        "cp package.json README.md dist/ && export-map inject --package dist/package.json --export gen/export-map.json",
      clean: "rimraf gen"
    },
    publishConfig: {
      access: "public",
      directory: "dist"
    },
    keywords: ["kubernetes"],
    engines: {
      node: ">=12"
    },
    dependencies: {
      "@kubernetes-models/base": "workspace:*",
      "@kubernetes-models/validate": "workspace:*",
      "kubernetes-models": "workspace:*",
      tslib: "^2.0.3"
    },
    devDependencies: {
      "@kubernetes-models/crd-generate": "workspace:*",
      "@kubernetes-models/export-map": "workspace:*",
      "npm-run-all": "^4.1.5",
      rimraf: "^3.0.2"
    }
  };

  const tsConfig = {
    extends: "../../tsconfig.build.json",
    compilerOptions: {
      rootDir: "gen",
      outDir: "dist",
      sourceMap: false
    },
    include: ["gen"],
    references: [
      { path: "../base" },
      { path: "../validate" },
      { path: "../crd-generate" },
      { path: "../kubernetes-models" },
      { path: "../export-map" }
    ]
  };

  signale.info("Creating the package directory:", pkgDir);
  await makeDir(pkgDir);

  signale.info("Writing package.json");
  await writeFile(
    join(pkgDir, "package.json"),
    JSON.stringify(pkgJson, null, "  ")
  );

  signale.info("Writing tsconfig.json");
  await writeFile(
    join(pkgDir, "tsconfig.json"),
    JSON.stringify(tsConfig, null, "  ")
  );

  signale.success("New package %s is created at %s", pkgJson.name, pkgDir);
})().catch((err) => {
  signale.fatal(err);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});
