import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const ROOT_DIR = dirname(__dirname);

interface Package {
  path: string;
  packageJson: {
    version?: string;
    dependencies?: Record<string, string>;
  };
}

const pkgMap = new Map<string, Package>();

async function loadPkgInfo(dir: string): Promise<void> {
  for (const name of await readdir(dir)) {
    const path = join(dir, name, "package.json");
    const pkg = JSON.parse(await readFile(path, "utf8"));

    pkgMap.set(pkg.name, {
      path,
      packageJson: pkg
    });
  }
}

(async () => {
  await Promise.all(
    ["core", "first-party", "third-party", "utils"].map((name) =>
      loadPkgInfo(join(ROOT_DIR, name))
    )
  );

  for (const pkg of pkgMap.values()) {
    const { dependencies } = pkg.packageJson;

    if (!dependencies) continue;

    for (const [name, version] of Object.entries(dependencies)) {
      if (version.startsWith("workspace:")) {
        const dep = pkgMap.get(name);

        if (dep?.packageJson.version) {
          dependencies[name] = dep.packageJson.version;
        }
      }
    }

    console.log("Writing", pkg.path);
    await writeFile(pkg.path, JSON.stringify(pkg.packageJson, null, "  "));
  }
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
