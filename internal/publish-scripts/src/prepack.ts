import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export interface PrePackArguments {
  cwd: string;
}

export async function prePack(args: PrePackArguments): Promise<void> {
  const rootPkgJsonPath = join(args.cwd, "package.json");
  const distPkgJsonPath = join(args.cwd, "dist/package.json");
  const rootPkgJson = JSON.parse(await readFile(rootPkgJsonPath, "utf-8"));
  const distPkgJson = JSON.parse(await readFile(distPkgJsonPath, "utf-8"));

  await writeFile(
    distPkgJsonPath,
    JSON.stringify(
      {
        ...distPkgJson,
        version: rootPkgJson.version,
        dependencies: rootPkgJson.dependencies,
        devDependencies: rootPkgJson.devDependencies,
        peerDependencies: rootPkgJson.peerDependencies
      },
      null,
      2
    )
  );
  console.log("Updated package.json dependencies");
}
