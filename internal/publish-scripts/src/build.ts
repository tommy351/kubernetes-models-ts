import glob from "fast-glob";
import { writeJSON, readFile, pathExists, readJSON } from "fs-extra";
import { trimSuffix } from "@kubernetes-models/string-util";
import { basename, extname, join, posix } from "path";
import ignore, { Ignore } from "ignore";
import { copyFile } from "fs/promises";
import execa from "execa";

const DTS_EXT = ".d.ts";
const CJS_EXT = ".js";
const ESM_EXT = ".mjs";

async function loadExportMapIgnoreFile(
  ig: Ignore,
  path: string
): Promise<void> {
  if (!(await pathExists(path))) return;

  ig.add(await readFile(path, "utf-8"));
  console.log("Loaded export map ignore file", path);
}

function sortObjectByKey<T extends Record<string, unknown>>(input: T): T {
  const entries = Object.entries(input).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return Object.fromEntries(entries) as T;
}

function generateExportEntry(name: string): Record<string, unknown> {
  return {
    import: {
      types: name + DTS_EXT,
      default: name + ESM_EXT
    },
    require: {
      types: name + DTS_EXT,
      default: name + CJS_EXT
    }
  };
}

async function generateExportMap(
  cwd: string
): Promise<Record<string, unknown>> {
  const ig = ignore();

  await loadExportMapIgnoreFile(ig, join(cwd, ".export-map-ignore"));

  const paths = (await glob(["**/*.ts"], { cwd: join(cwd, "gen") })).filter(
    (path) => !ig.ignores(path)
  );

  const indexDirSet = new Set<string>();
  const nonIndexFiles: Record<string, number> = {};

  for (const path of paths) {
    const base = basename(path, extname(path));
    const dir = posix.dirname(path);

    if (base === "index") {
      indexDirSet.add(dir);
    } else {
      nonIndexFiles[dir] = (nonIndexFiles[dir] || 0) + 1;
    }
  }

  const exportMap: Record<string, unknown> = {
    "./package.json": "./package.json"
  };

  for (const path of indexDirSet) {
    const exportPath = path === "." ? path : `./${path}`;

    exportMap[exportPath] = generateExportEntry(`${exportPath}/index`);

    if (nonIndexFiles[path] > 0) {
      const wildcardExportPath = `${exportPath}/*`;

      exportMap[wildcardExportPath] = generateExportEntry(wildcardExportPath);
    }
  }

  for (const path of paths) {
    const dir = posix.dirname(path);

    if (indexDirSet.has(dir)) continue;

    const exportPath = "./" + posix.normalize(trimSuffix(path, extname(path)));

    exportMap[exportPath] = generateExportEntry(exportPath);
  }

  return sortObjectByKey(exportMap);
}

async function compileTS(cwd: string): Promise<void> {
  const tscMultiBin = join(__dirname, "../node_modules/.bin/tsc-multi");
  const tscMultiConfig = join(__dirname, "../../../tsc-multi.json");

  console.log("Running tsc-multi");
  await execa(
    tscMultiBin,
    ["--config", tscMultiConfig, "--compiler", require.resolve("typescript")],
    { cwd, stdio: "inherit" }
  );
}

async function copyDistFiles(cwd: string): Promise<void> {
  for (const file of ["README.md"]) {
    const src = join(cwd, file);
    const dst = join(cwd, "dist", file);

    if (!(await pathExists(src))) continue;

    await copyFile(src, dst);
    console.log("Copied to dist folder:", file);
  }
}

async function writePkgJson(cwd: string): Promise<void> {
  const pkgJson = await readJSON(join(cwd, "package.json"));

  pkgJson.exports = await generateExportMap(cwd);

  await writeJSON(join(cwd, "dist/package.json"), pkgJson, { spaces: 2 });
}

export interface BuildArguments {
  cwd: string;
}

export async function build(args: BuildArguments): Promise<void> {
  await compileTS(args.cwd);
  await copyDistFiles(args.cwd);
  await writePkgJson(args.cwd);
}
