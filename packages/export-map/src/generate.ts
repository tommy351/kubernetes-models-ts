import glob from "fast-glob";
import { writeJSON, readFile, pathExists } from "fs-extra";
import { trimSuffix } from "@kubernetes-models/string-util";
import { extname } from "path";
import ignore from "ignore";

const CJS_EXT = ".cjs";
const ESM_EXT = ".mjs";

interface Export {
  require: string;
  import: string;
}

export interface GenerateArguments {
  cwd: string;
  include: string[];
  exclude: string[];
  export: string;
  ignoreFile: string;
}

export async function generate(args: GenerateArguments): Promise<void> {
  const ig = ignore();
  ig.add(args.exclude);

  if (await pathExists(args.ignoreFile)) {
    ig.add(await readFile(args.ignoreFile, "utf-8"));
  }

  const paths = await glob(args.include, {
    cwd: args.cwd
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

  await writeJSON(args.export, exportMap, {
    spaces: 2
  });

  console.log("Generated export map in %s", args.export);
}
