import type { GroupVersion, Schema } from "@kubernetes-models/generate";
import { execa } from "execa";
import { fileURLToPath } from "node:url";

export interface Context {
  schemata: Record<string, Schema>;
  packages: Record<string, Package>;
  roots: string[];
  // Overrides the file-name segment of `getInternalDefinitionPath` for
  // specific schema ids. Populated to break case-insensitive filesystem
  // collisions between sibling types in the same package (e.g.
  // `TidbInitializer` vs `TiDBInitializer` upstream).
  pathRenames?: Record<string, string>;
}

export interface Package extends GroupVersion {
  goPath: string;
  kinds?: string[];
}

export async function load(input: readonly string[]): Promise<Context> {
  const { stdout } = await execa("go", [
    "run",
    fileURLToPath(new URL("../go", import.meta.url)),
    ...input,
  ]);

  return JSON.parse(stdout);
}
