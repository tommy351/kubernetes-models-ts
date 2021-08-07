import glob from "fast-glob";
import { writeJSON, readFile, pathExists } from "fs-extra";
import { trimSuffix } from "@kubernetes-models/string-util";
import { extname } from "path";
import ignore from "ignore";
import { join } from "path";

const CJS_EXT = ".cjs";
const ESM_EXT = ".mjs";

interface Export {
  require: string;
  import: string;
}

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

  const exportMap: Record<string, Export> = {};

  for (const path of paths) {
    if (ig.ignores(path)) continue;

    const base = trimSuffix(path, extname(path));
    const exportPath =
      base === "index" ? "." : `./${trimSuffix(base, "/index")}`;
    const requirePath = `./${base}${CJS_EXT}`;
    const importPath = `./${base}${ESM_EXT}`;

    exportMap[exportPath] = {
      require: requirePath,
      import: importPath
    };
  }

  await writeJSON(exportPath, exportMap, {
    spaces: 2
  });

  console.log("Generated export map in %s", exportPath);
}
