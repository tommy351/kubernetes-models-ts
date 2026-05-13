import {
  composeGenerators,
  type Definition,
  type GroupVersionKind,
  writeOutputFiles,
} from "@kubernetes-models/generate";
import { type Context, load } from "./load.js";
import generateDefinition from "./generators/definition.js";
import generateSchema from "./generators/schema.js";
import generateAlias from "./generators/alias.js";
import {
  getInternalDefinitionPath,
  getKind,
  getPackage,
  isExternalRef,
  isRootKind,
} from "./utils.js";

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

// Break case-insensitive filesystem collisions between sibling types
// whose generated paths fold to the same lowercase form (e.g.
// `TidbInitializer` and `TiDBInitializer` both at
// `pingcap.com/v1alpha1/`). The root-kind variant keeps its natural
// file name; other variants get a `_<index>` suffix. The choice is
// stable across runs because IDs are sorted alphabetically.
function computePathRenames(ctx: Context): Record<string, string> {
  const groups = new Map<string, string[]>();

  for (const id of Object.keys(ctx.schemata)) {
    if (isExternalRef(ctx, id)) continue;
    const path = getInternalDefinitionPath(ctx, id);
    const folded = path.toLowerCase();
    let bucket = groups.get(folded);
    if (!bucket) {
      bucket = [];
      groups.set(folded, bucket);
    }
    bucket.push(id);
  }

  const renames: Record<string, string> = {};
  for (const ids of groups.values()) {
    if (ids.length <= 1) continue;
    ids.sort();
    const kindIdx = ids.findIndex((id) => isRootKind(ctx, id));
    if (kindIdx > 0) {
      const [k] = ids.splice(kindIdx, 1);
      ids.unshift(k);
    }
    for (let i = 1; i < ids.length; i++) {
      renames[ids[i]] = `${getKind(ids[i])}_${i}`;
    }
  }

  return renames;
}

export async function generate(options: GenerateOptions): Promise<void> {
  const ctx = await load(options.input);
  ctx.pathRenames = computePathRenames(ctx);
  const generator = composeGenerators([
    generateDefinition(ctx),
    generateSchema(ctx),
    generateAlias(ctx),
  ]);
  const definitions = Object.entries(ctx.schemata)
    .filter(([id]) => !isExternalRef(ctx, id))
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
