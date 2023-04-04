import { copy, ensureSymlink, readJSON, writeJSON } from "fs-extra";
import { join } from "path";

export interface PrePackArguments {
  cwd: string;
}

export async function prePack(args: PrePackArguments): Promise<void> {
  const distDir = join(args.cwd, "dist");

  for (const file of ["package.json", "README.md"]) {
    await copy(join(args.cwd, file), join(distDir, file));
  }

  await ensureSymlink(
    join(args.cwd, "node_modules"),
    join(distDir, "node_modules")
  );

  const pkgJsonPath = join(distDir, "package.json");
  const pkgJson = await readJSON(pkgJsonPath);
  const exportMapPath = join(args.cwd, "gen/export-map.json");
  const exportMap = await readJSON(exportMapPath);

  pkgJson.exports = exportMap;

  await writeJSON(pkgJsonPath, pkgJson, {
    spaces: 2
  });

  console.log("Injected export map %s into %s", exportMapPath, pkgJsonPath);
}
