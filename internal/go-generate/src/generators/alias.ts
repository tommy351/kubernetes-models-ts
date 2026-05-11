import { camelCase } from "@kubernetes-models/string-util";
import { posix } from "node:path";
import type { Generator, OutputFile } from "@kubernetes-models/generate";
import type { Context } from "../load.js";
import { getInternalDefinitionPath } from "../utils.js";

function getIndexPath(key: string): string {
  return key ? `${key}/index.ts` : "index.ts";
}

export default function generateAlias(ctx: Context): Generator {
  return async (definitions) => {
    const kindPathMap = new Map<string, string[]>();
    const indexPathMap = new Map<string, string[]>();
    const output: OutputFile[] = [];

    for (const def of definitions) {
      const defPath = getInternalDefinitionPath(ctx, def.schemaId);
      const dir = posix.dirname(defPath);
      const kind = posix.basename(defPath);
      const dirKey = dir === "." ? "" : dir;
      const values = kindPathMap.get(dirKey) ?? [];

      if (!values.includes(kind)) {
        values.push(kind);
        kindPathMap.set(dirKey, values);
      }
    }

    for (const key of kindPathMap.keys()) {
      if (!key) continue;
      const segments = key.split("/");

      for (let i = 0; i < segments.length; i++) {
        const parent = segments.slice(0, i).join("/");
        const child = segments[i];
        const values = indexPathMap.get(parent) ?? [];

        if (!values.includes(child)) {
          values.push(child);
          indexPathMap.set(parent, values);
        }
      }
    }

    const dirs = new Set([...kindPathMap.keys(), ...indexPathMap.keys()]);

    for (const dir of dirs) {
      const lines: string[] = [];

      for (const kind of kindPathMap.get(dir) ?? []) {
        lines.push(`export * from "./${kind}.js";`);
      }

      for (const sub of indexPathMap.get(dir) ?? []) {
        lines.push(
          `export * as ${camelCase(sub, ".-")} from "./${sub}/index.js";`,
        );
      }

      output.push({
        path: getIndexPath(dir),
        content: lines.join("\n"),
      });
    }

    return output;
  };
}
