import glob from "fast-glob";
import { writeJSON, readFile, pathExists } from "fs-extra";
import { trimSuffix } from "@kubernetes-models/string-util";
import { basename, extname, join, posix } from "path";
import ignore, { Ignore } from "ignore";

const DTS_EXT = ".d.ts";
const CJS_EXT = ".js";
const ESM_EXT = ".mjs";

async function loadExportMapIgnoreFile(ig: Ignore, path: string) {
  if (!(await pathExists(path))) return;

  ig.add(await readFile(path, "utf-8"));
}

function sortObjectByKey<T extends Record<string, unknown>>(input: T): T {
  const entries = Object.entries(input).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return Object.fromEntries(entries) as T;
}

function generateExportEntry(name: string) {
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

export interface PostBuildArguments {
  cwd: string;
}

export async function postBuild(args: PostBuildArguments): Promise<void> {
  const genDir = join(args.cwd, "gen");
  const ig = ignore();

  await loadExportMapIgnoreFile(ig, join(args.cwd, ".export-map-ignore"));

  const paths = (await glob(["**/*.ts"], { cwd: genDir })).filter(
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

  const exportMapPath = join(genDir, "export-map.json");

  await writeJSON(exportMapPath, sortObjectByKey(exportMap), { spaces: 2 });
  console.log("Generated export map in %s", exportMapPath);
}
