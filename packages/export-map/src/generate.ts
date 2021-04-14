import glob from "fast-glob";
import { writeJSON, readFile, pathExists } from "fs-extra";
import { trimSuffix } from "@kubernetes-models/string-util";
import { extname } from "path";
import ignore from "ignore";

const CJS_EXT = ".js";
const ESM_EXT = ".mjs";

interface Export {
  import: string;
  require: string;
}

function generateExport(path: string): Export {
  return {
    import: `./${path}${ESM_EXT}`,
    require: `./${path}${CJS_EXT}`
  };
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

    if (base === "index") {
      exportMap["."] = generateExport(base);
    } else if (base.endsWith("/index")) {
      exportMap[`./${trimSuffix(base, "/index")}`] = generateExport(base);
    }
  }

  exportMap["./*"] = generateExport("*");

  await writeJSON(args.export, exportMap, {
    spaces: 2
  });

  console.log("Generated export map in %s", args.export);
}
