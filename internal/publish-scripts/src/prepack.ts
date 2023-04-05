import { readJSON, writeJSON } from "fs-extra";
import { join } from "path";

export interface PrePackArguments {
  cwd: string;
}

export async function prePack(args: PrePackArguments): Promise<void> {
  const rootPkgJsonPath = join(args.cwd, "package.json");
  const distPkgJsonPath = join(args.cwd, "dist/package.json");
  const rootPkgJson = await readJSON(rootPkgJsonPath);
  const distPkgJson = await readJSON(distPkgJsonPath);

  await writeJSON(
    distPkgJsonPath,
    {
      ...distPkgJson,
      version: rootPkgJson.version,
      dependencies: rootPkgJson.dependencies,
      devDependencies: rootPkgJson.devDependencies,
      peerDependencies: rootPkgJson.peerDependencies
    },
    { spaces: 2 }
  );
  console.log("Updated package.json dependencies");
}
