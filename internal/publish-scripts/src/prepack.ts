import { copy, ensureLink } from "fs-extra";
import { join } from "path";
import { inject } from "@kubernetes-models/export-map";

export interface PrePackArguments {
  cwd: string;
}

export async function prePack(args: PrePackArguments): Promise<void> {
  const distDir = join(args.cwd, "dist");
  const genDir = join(args.cwd, "gen");

  for (const file of ["package.json", "README.md"]) {
    await copy(join(args.cwd, file), join(distDir, file));
  }

  await ensureLink(
    join(args.cwd, "node_modules"),
    join(distDir, "node_modules")
  );

  await inject({
    package: join(distDir, "package.json"),
    export: join(genDir, "export-map.json")
  });
}
