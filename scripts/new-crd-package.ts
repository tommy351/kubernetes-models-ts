/* eslint-disable node/no-unpublished-import */
import { join } from "path";
import yargs from "yargs";
import { mkdir, stat, writeFile } from "fs/promises";
import humanId from "human-id";
import execa from "execa";

const rootDir = join(__dirname, "..");

(async () => {
  const args = await yargs
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

  const pkgDir = join(rootDir, "third-party", args.name);

  try {
    await stat(pkgDir);
    throw new Error(`Path already exists: ${pkgDir}`);
  } catch (err: any) {
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
    homepage: `https://github.com/tommy351/kubernetes-models-ts/tree/master/third-party/${args.name}`,
    author: args.author,
    license: "MIT",
    main: "index.js",
    module: "index.mjs",
    types: "index.d.ts",
    sideEffects: false,
    scripts: {
      build: "crd-generate && publish-scripts build",
      prepack: "publish-scripts prepack"
    },
    publishConfig: {
      access: "public",
      directory: "dist",
      linkDirectory: true
    },
    keywords: ["kubernetes", "kubernetes-models", args.name],
    engines: {
      node: ">=14"
    },
    dependencies: {
      "@kubernetes-models/apimachinery": "workspace:^",
      "@kubernetes-models/base": "workspace:^",
      "@kubernetes-models/validate": "workspace:^",
      "@swc/helpers": "^0.5.8"
    },
    devDependencies: {
      "@kubernetes-models/crd-generate": "workspace:^",
      "@kubernetes-models/publish-scripts": "workspace:^"
    },
    "crd-generate": {
      input: [],
      output: "./gen"
    }
  };

  const tsConfig = {
    extends: "../../tsconfig.build.json",
    compilerOptions: {
      outDir: "dist",
      sourceMap: false
    },
    include: ["gen"]
  };

  console.log("Creating the package directory:", pkgDir);
  await mkdir(pkgDir, { recursive: true });

  console.log("Writing package.json");
  await writeFile(
    join(pkgDir, "package.json"),
    JSON.stringify(pkgJson, null, "  ")
  );

  console.log("Writing tsconfig.json");
  await writeFile(
    join(pkgDir, "tsconfig.json"),
    JSON.stringify(tsConfig, null, "  ")
  );

  console.log("Writing changeset");
  const changesetId = humanId({
    separator: "-",
    capitalize: false
  });

  await writeFile(
    join(rootDir, ".changeset", changesetId + ".md"),
    `---
"${pkgJson.name}": minor
---

First release.
`
  );

  console.log("New package %s is created at %s", pkgJson.name, pkgDir);

  console.log("Running pnpm install");
  const { exitCode } = await execa("pnpm", ["install"], {
    stdio: "inherit",
    reject: false
  });
  process.exitCode = exitCode;
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
