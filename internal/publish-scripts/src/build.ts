import glob from "fast-glob";
import { writeJSON, readFile, pathExists, readJSON } from "fs-extra";
import { basename, dirname, extname, join, posix } from "path";
import ignore, { Ignore } from "ignore";
import { copyFile, mkdir, writeFile } from "fs/promises";
import execa from "execa";
import * as swc from "@swc/core";
import { trimSuffix } from "@kubernetes-models/string-util";

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

function generateExportEntry(name: string): Record<string, string> {
  return {
    types: name + DTS_EXT,
    import: name + ESM_EXT,
    require: name + CJS_EXT
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

  const exportMap: Record<string, unknown> = {
    "./package.json": "./package.json"
  };

  for (const path of paths) {
    const base = basename(path, extname(path));
    const dir = posix.dirname(path);
    const exportPath = dir === "." ? dir : `./${dir}`;

    if (base === "index") {
      exportMap[exportPath] = generateExportEntry(`${exportPath}/index`);
    } else {
      exportMap[`${exportPath}/*`] = generateExportEntry(`${exportPath}/*`);
    }
  }

  return sortObjectByKey(exportMap);
}

async function generateDTS(cwd: string): Promise<void> {
  const tscBin = join(__dirname, "../node_modules/.bin/tsc");

  console.log("Generating type declarations");
  await execa(tscBin, ["--emitDeclarationOnly", "--outDir", "dts"], {
    cwd,
    stdio: "inherit"
  });
}

async function compileTS(
  cwd: string,
  options: {
    module: "es6" | "commonjs";
    outDir: string;
    ext: string;
  }
): Promise<void> {
  console.log("Compiling TS files:", options.module);

  const paths = await glob("**/*.ts", { cwd: join(cwd, "gen") });

  for (const path of paths) {
    const srcPath = join(cwd, "gen", path);
    const dstPath =
      trimSuffix(join(options.outDir, path), ".ts") + "." + options.ext;
    const result = await swc.transformFile(srcPath, {
      filename: path,
      jsc: {
        parser: {
          syntax: "typescript"
        },
        externalHelpers: true,
        target: "es2020",
        minify: {
          compress: true,
          mangle: true
        }
      },
      module: {
        type: options.module
      }
    });

    await mkdir(dirname(dstPath), { recursive: true });
    await writeFile(dstPath, result.code);
  }
}

export interface BuildArguments {
  cwd: string;
}

export async function build(args: BuildArguments): Promise<void> {
  // await checkTypes(args.cwd);
  await generateDTS(args.cwd);
  await compileTS(args.cwd, { module: "commonjs", outDir: "cjs", ext: "cjs" });
  await compileTS(args.cwd, { module: "es6", outDir: "esm", ext: "mjs" });
  // await copyDistFiles(args.cwd);
  // await writePkgJson(args.cwd);

  // TODO: Update export map
}
