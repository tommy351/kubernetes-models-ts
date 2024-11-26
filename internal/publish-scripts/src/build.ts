import glob from "fast-glob";
import { writeJSON, pathExists, readJSON } from "fs-extra";
import { basename, dirname, extname, join, posix } from "path";
import { copyFile, mkdir, rm, writeFile } from "fs/promises";
import execa from "execa";
import * as swc from "@swc/core";

const ECMA_VERSION = 2020;
const DTS_EXT = ".d.ts";
const DMTS_EXT = ".d.mts";
const CJS_EXT = ".js";
const ESM_EXT = ".mjs";

function getGenDir(cwd: string): string {
  return join(cwd, "gen");
}

function getDistDir(cwd: string): string {
  return join(cwd, "dist");
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
      types: name + DMTS_EXT,
      default: name + ESM_EXT
    },
    require: {
      types: name + DTS_EXT,
      default: name + CJS_EXT
    }
  };
}

async function generateExportMap(
  args: BuildArguments
): Promise<Record<string, unknown>> {
  const paths = await glob(["**/*.{js,ts}"], {
    cwd: getGenDir(args.cwd),
    ...(!args["include-hidden"] && { ignore: ["!_**/*"] })
  });

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

async function compileDts(cwd: string): Promise<void> {
  const tscBin = join(__dirname, "../node_modules/.bin/tsc");

  console.log("Generating declaration files");
  await execa(tscBin, ["--emitDeclarationOnly"], { cwd, stdio: "inherit" });
}

async function writeJs({
  ast,
  module,
  path
}: {
  ast: swc.Module;
  module: "es6" | "commonjs";
  path: string;
}): Promise<void> {
  const transformResult = await swc.transform(ast, {
    jsc: {
      target: `es${ECMA_VERSION}`,
      externalHelpers: true,
      loose: true
    },
    module: { type: module }
  });

  const minifyResult = await swc.minify(transformResult.code, {
    compress: {
      toplevel: true,
      ecma: ECMA_VERSION
    },
    mangle: false,
    ecma: ECMA_VERSION,
    module: module === "es6"
  });

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, minifyResult.code);
}

function isRelativeImport(source: string): boolean {
  return source.startsWith("./") || source.startsWith("../");
}

function rewriteImportPath(ast: swc.Module, ext: string): swc.Module {
  const body: swc.ModuleItem[] = [];

  function rewrite<T extends { source?: swc.StringLiteral }>(stmt: T): T {
    if (!stmt.source || !isRelativeImport(stmt.source.value)) {
      return stmt;
    }

    const currentExt = extname(stmt.source.value);
    const newValue =
      stmt.source.value.substring(
        0,
        stmt.source.value.length - currentExt.length
      ) + ext;

    return {
      ...stmt,
      source: {
        ...stmt.source,
        value: newValue,
        raw: JSON.stringify(newValue)
      }
    };
  }

  for (const stmt of ast.body) {
    switch (stmt.type) {
      case "ImportDeclaration":
      case "ExportAllDeclaration":
      case "ExportNamedDeclaration":
        body.push(rewrite(stmt));
        break;
      default:
        body.push(stmt);
    }
  }

  return { ...ast, body };
}

async function compileJs(cwd: string): Promise<void> {
  const genDir = getGenDir(cwd);
  const distDir = getDistDir(cwd);
  const srcPaths = await glob(["**/*.{js,ts}"], {
    cwd: genDir,
    ignore: ["**/*.d.ts", "**/*.d.mts"]
  });

  for (const path of srcPaths) {
    const srcPath = join(genDir, path);
    const ext = extname(path);
    const name = path.substring(0, path.length - ext.length);

    console.log("Transforming:", `gen/${path}`);

    const ast = await swc.parseFile(srcPath, {
      syntax: ext === ".ts" ? "typescript" : "ecmascript"
    });

    await Promise.all([
      writeJs({
        ast: rewriteImportPath(ast, CJS_EXT),
        module: "commonjs",
        path: join(distDir, name + CJS_EXT)
      }),
      writeJs({
        ast: rewriteImportPath(ast, ESM_EXT),
        module: "es6",
        path: join(distDir, name + ESM_EXT)
      })
    ]);
  }
}

async function copySchemaDts(cwd: string): Promise<void> {
  const genDir = getGenDir(cwd);
  const distDir = getDistDir(cwd);
  const paths = await glob(["_schemas/**/*.d.ts"], { cwd: genDir });

  for (const path of paths) {
    const src = join(genDir, path);
    const dst = join(distDir, path);

    console.log("Copying:", path);

    await mkdir(dirname(dst), { recursive: true });
    await copyFile(src, dst);
  }
}

async function copyEsmDts(cwd: string): Promise<void> {
  const distDir = getDistDir(cwd);
  const paths = await glob(["**/*.d.ts"], { cwd: distDir });

  // TODO: Rewrite extension to `.mjs` in declaration files

  for (const path of paths) {
    const dst = path.substring(0, path.length - DTS_EXT.length) + DMTS_EXT;
    console.log("Copying:", dst);
    await copyFile(join(distDir, path), join(distDir, dst));
  }
}

async function copyDistFiles(cwd: string): Promise<void> {
  for (const file of ["README.md"]) {
    const src = join(cwd, file);
    const dst = join(cwd, "dist", file);

    if (!(await pathExists(src))) continue;

    await copyFile(src, dst);
    console.log("Copying:", file);
  }
}

async function writePkgJson(args: BuildArguments): Promise<void> {
  const pkgJson = await readJSON(join(args.cwd, "package.json"));

  pkgJson.exports = await generateExportMap(args);

  await writeJSON(join(args.cwd, "dist/package.json"), pkgJson, { spaces: 2 });
}

export interface BuildArguments {
  cwd: string;
  "include-hidden"?: boolean;
}

export async function build(args: BuildArguments): Promise<void> {
  await rm(join(args.cwd, "dist"), { recursive: true, force: true });
  await compileDts(args.cwd);
  await compileJs(args.cwd);

  if (args["include-hidden"]) {
    await copySchemaDts(args.cwd);
  }

  await copyEsmDts(args.cwd);
  await copyDistFiles(args.cwd);
  await writePkgJson(args);
}
