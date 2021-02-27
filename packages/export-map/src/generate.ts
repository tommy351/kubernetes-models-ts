import glob from "fast-glob";
import { writeJSON } from "fs-extra";
import { trimSuffix } from "@kubernetes-models/string-util";
import { extname } from "path";

const CJS_EXT = ".js";
const ESM_EXT = ".mjs";

interface Export {
  require: string;
  import: string;
}

export interface GenerateArguments {
  path: string;
  export: string;
}

export async function generate(args: GenerateArguments): Promise<void> {
  const paths = await glob(["**/*.ts", "!**/*.d.ts"], {
    cwd: args.path
  });
  const exportMap: Record<string, Export> = {};

  for (const path of paths) {
    if (path.startsWith("_")) continue;

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
