import type { GroupVersion, Schema } from "@kubernetes-models/generate";
import { execa } from "execa";
import { fileURLToPath } from "node:url";

export interface Context {
  schemata: Record<string, Schema>;
  packages: Record<string, Package>;
}

export interface Package extends GroupVersion {
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
