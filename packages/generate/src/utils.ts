import { Generator, GroupVersionKind, OutputFile } from "./types";
import { outputFile } from "fs-extra";
import { join } from "path";

export class PathConflictError extends Error {
  constructor(public path: string) {
    super(`Path conflict: ${path}`);
  }
}

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
  files: readonly OutputFile[]
): Promise<void> {
  for (const f of files) {
    console.log("Writing:", f.path);
    await outputFile(join(outDir, f.path), f.content);
  }
}

export function getAPIVersion({ group, version }: GroupVersionKind): string {
  return group ? `${group}/${version}` : version;
}
