import glob from "fast-glob";
import { writeJSON, readFile, pathExists } from "fs-extra";
import { trimSuffix } from "@kubernetes-models/string-util";
import { extname, join } from "path";
import ignore from "ignore";

const DTS_EXT = ".d.ts";
const CJS_EXT = ".js";
const ESM_EXT = ".mjs";

export interface GenerateArguments {
  cwd?: string;
  include?: string[];
  exclude?: string[];
  export: string;
  ignoreFile?: string;
}

export async function generate({
  cwd = process.cwd(),
  include = ["**/*.ts"],
  exclude = [],
  export: exportPath,
  ignoreFile = join(cwd, ".export-map-ignore")
}: GenerateArguments): Promise<void> {
  const ig = ignore();
  ig.add(exclude);

  if (await pathExists(ignoreFile)) {
    ig.add(await readFile(ignoreFile, "utf-8"));
  }

  const paths = await glob(include, {
    cwd
  });

  paths.sort();

  const exportMap: Record<string, unknown> = {};

  for (const path of paths) {
    if (ig.ignores(path)) continue;

    const base = trimSuffix(path, extname(path));
    const exportPath =
      base === "index" ? "." : `./${trimSuffix(base, "/index")}`;
    const typesPath = `./${base}${DTS_EXT}`;
    const requirePath = `./${base}${CJS_EXT}`;
    const importPath = `./${base}${ESM_EXT}`;

    exportMap[exportPath] = {
      import: {
        types: typesPath,
        default: importPath
      },
      require: {
        types: typesPath,
        default: requirePath
      }
    };
  }

  await writeJSON(exportPath, exportMap, {
    spaces: 2
  });

  console.log("Generated export map in %s", exportPath);
}
