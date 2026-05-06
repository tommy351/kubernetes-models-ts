import type { Generator, GroupVersionKind, OutputFile } from "./types.js";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import pMap from "p-map";

const WRITE_CONCURRENCY = 16;

export class PathConflictError extends Error {
  public path: string;

  constructor(path: string) {
    super(`Path conflict: ${path}`);
    this.path = path;
  }
}

PathConflictError.prototype.name = "PathConflictError";

export function composeGenerators(generators: readonly Generator[]): Generator {
  return async (definitions) => {
    const fileMap = new Map<string, OutputFile>();

    for (const g of generators) {
      const files = await g(definitions);

      for (const f of files) {
        if (fileMap.has(f.path)) {
          throw new PathConflictError(f.path);
        }

        fileMap.set(f.path, f);
      }
    }

    return [...fileMap.values()];
  };
}

export async function writeOutputFiles(
  outDir: string,
  files: readonly OutputFile[],
): Promise<void> {
  await rm(outDir, { recursive: true, force: true });
  const paths = files.map((file) => ({
    ...file,
    outputPath: join(outDir, file.path),
  }));
  const dirs = new Set(paths.map((file) => dirname(file.outputPath)));

  await pMap(dirs, (dir) => mkdir(dir, { recursive: true }), {
    concurrency: WRITE_CONCURRENCY,
  });

  await pMap(
    paths,
    async (file) => {
      console.log("Writing:", file.path);
      await writeFile(file.outputPath, file.content);
    },
    { concurrency: WRITE_CONCURRENCY },
  );
}

export function getAPIVersion({ group, version }: GroupVersionKind): string {
  return group ? `${group}/${version}` : version;
}
