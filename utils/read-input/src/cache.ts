import findCacheDir from "find-cache-dir";
import { join, dirname } from "path";
import makeDir from "make-dir";
import { readFile, writeFile } from "fs";
import { promisify } from "util";

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
let cacheDir: string;

function getCacheDir(): string {
  if (!cacheDir) {
    const path = findCacheDir({ name: "kubernetes-models-read-input" });
    if (!path) throw new Error("failed to get the cache directory");
    cacheDir = path;
  }

  return cacheDir;
}

export async function getOrSetCache(
  key: string,
  valueFn: () => Promise<string>
): Promise<string> {
  const path = join(getCacheDir(), key);

  try {
    return await readFileAsync(path, "utf8");
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err;
  }

  const value = await valueFn();

  await makeDir(dirname(path));
  await writeFileAsync(path, value);

  return value;
}
