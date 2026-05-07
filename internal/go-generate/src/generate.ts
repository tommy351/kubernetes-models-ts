import {
  composeGenerators,
  type Definition,
  type GroupVersionKind,
  writeOutputFiles,
} from "@kubernetes-models/generate";
import { type Context, load } from "./load.js";
import generateDefinition from "./generators/definition.js";
import generateSchema from "./generators/schema.js";
import { getKind, getPackage, isExternalRef } from "./utils.js";

function getGVK(ctx: Context, id: string): GroupVersionKind | undefined {
  const pkg = getPackage(ctx, id);
  if (!pkg) return;

  const kind = getKind(id);
  if (!pkg.kinds?.includes(kind)) return;

  return {
    group: pkg.group,
    version: pkg.version,
    kind,
  };
}

export interface GenerateOptions {
  input: string[];
  outputPath: string;
}

export async function generate(options: GenerateOptions): Promise<void> {
  const ctx = await load(options.input);
  const generator = composeGenerators([
    generateDefinition(ctx),
    generateSchema,
  ]);
  const definitions = Object.entries(ctx.schemata)
    .filter(([id]) => !isExternalRef(id))
    .map(([id, schema]): Definition => {
      const gvk = getGVK(ctx, id);

      return {
        schemaId: id,
        schema,
        ...(gvk && { gvk: [gvk] }),
      };
    });
  const files = await generator(definitions);

  await writeOutputFiles(options.outputPath, files);
}
