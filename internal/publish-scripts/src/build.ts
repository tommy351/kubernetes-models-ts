// eslint-disable-next-line import-x/no-named-as-default
import glob from "fast-glob";
import { basename, dirname, extname, join, posix } from "node:path";
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { execa } from "execa";
import * as swc from "@swc/core";
import { fileURLToPath } from "node:url";
import pMap from "p-map";

const ECMA_VERSION = 2024;
const DTS_EXT = ".d.ts";
const JS_EXT = ".js";
const CONCURRENCY = 4;

function sortObjectByKey<T extends Record<string, unknown>>(input: T): T {
  const entries = Object.entries(input).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  return Object.fromEntries(entries) as T;
}

function generateExportEntry(name: string): Record<string, string> {
  return {
    types: name + DTS_EXT,
    import: name + JS_EXT,
  };
}

async function generateExportMap(
  args: BuildArguments,
): Promise<Record<string, unknown>> {
  const paths = await glob(["**/*.{js,ts}"], {
    cwd: join(args.cwd, "gen"),
    ...(!args["include-hidden"] && { ignore: ["!_**/*"] }),
  });

  const exportMap: Record<string, unknown> = {
    "./package.json": "./package.json",
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
  const tscBin = fileURLToPath(
    new URL("../node_modules/.bin/tsc", import.meta.url),
  );

  console.log("Generating declaration files");
  await execa(tscBin, ["--emitDeclarationOnly"], { cwd, stdio: "inherit" });
}

async function writeJs({
  srcPath,
  dstPath,
}: {
  srcPath: string;
  dstPath: string;
}): Promise<void> {
  // Generators emit standalone validators as plain JS already; only TS sources
  // need SWC's transform pass before minification.
  const code =
    extname(srcPath) === JS_EXT
      ? await readFile(srcPath, "utf8")
      : (
          await swc.transformFile(srcPath, {
            jsc: {
              target: `es${ECMA_VERSION}`,
              loose: true,
            },
            module: { type: "nodenext" },
          })
        ).code;

  const minifyResult = await swc.minify(code, {
    compress: {
      toplevel: true,
      ecma: ECMA_VERSION,
    },
    mangle: false,
    ecma: ECMA_VERSION,
    module: true,
  });

  await mkdir(dirname(dstPath), { recursive: true });
  await writeFile(dstPath, minifyResult.code);
}

async function compileJs(cwd: string): Promise<void> {
  const genDir = join(cwd, "gen");
  const distDir = join(cwd, "dist");
  const srcPaths = await glob(["**/*.{js,ts}"], {
    cwd: genDir,
    ignore: ["**/*.d.ts"],
  });

  await pMap(
    srcPaths,
    async (path) => {
      const srcPath = join(genDir, path);
      const ext = extname(path);
      const name = path.substring(0, path.length - ext.length);

      console.log("Transforming:", `gen/${path}`);

      await writeJs({
        srcPath,
        dstPath: join(distDir, name + JS_EXT),
      });
    },
    {
      concurrency: CONCURRENCY,
    },
  );
}

async function copySchemaDts(cwd: string): Promise<void> {
  const genDir = join(cwd, "gen");
  const paths = await glob(["_schemas/**/*.d.ts"], { cwd: genDir });

  await pMap(
    paths,
    async (path) => {
      const src = join(genDir, path);
      const dst = join(cwd, "dist", path);

      console.log("Copying:", path);

      await mkdir(dirname(dst), { recursive: true });
      await copyFile(src, dst);
    },
    {
      concurrency: CONCURRENCY,
    },
  );
}

async function copyDistFiles(cwd: string): Promise<void> {
  for (const file of ["README.md"]) {
    const src = join(cwd, file);
    const dst = join(cwd, "dist", file);

    try {
      await copyFile(src, dst);
      console.log("Copying:", file);
    } catch (err) {
      if ((err as any).code !== "ENOENT") throw err;
    }
  }
}

async function writePkgJson(args: BuildArguments): Promise<void> {
  const pkgJson = JSON.parse(
    await readFile(join(args.cwd, "package.json"), "utf-8"),
  );

  pkgJson.exports = await generateExportMap(args);

  await writeFile(
    join(args.cwd, "dist/package.json"),
    JSON.stringify(pkgJson, null, 2),
  );
}

export interface BuildArguments {
  cwd: string;
  "include-hidden"?: boolean;
}

export async function build(args: BuildArguments): Promise<void> {
  await rm(join(args.cwd, "dist"), { recursive: true, force: true });
  await Promise.all([compileDts(args.cwd), compileJs(args.cwd)]);

  if (args["include-hidden"]) {
    await copySchemaDts(args.cwd);
  }

  await copyDistFiles(args.cwd);
  await writePkgJson(args);
}
