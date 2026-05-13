import {
  collectRefs,
  compileSchemas,
  type CompileSchemaTask,
  transformSchema,
  type Generator,
} from "@kubernetes-models/generate";
import type { Context } from "../load.js";
import {
  getQualifiedClassName,
  getRelativePath,
  getSchemaPath,
  isExternalRef,
} from "../utils.js";
import { trimSuffix } from "@kubernetes-models/string-util";

const externalSchemaDirs: { prefix: string; dir: string }[] = [
  {
    prefix: "io.k8s.apimachinery.pkg.",
    dir: "@kubernetes-models/apimachinery/_schemas",
  },
  {
    prefix: "io.k8s.sigs.gateway-api.",
    dir: "@kubernetes-models/gateway-api/_schemas",
  },
  { prefix: "io.k8s.", dir: "kubernetes-models/_schemas" },
];

function getExternalSchemaPath(ref: string): string {
  for (const { prefix, dir } of externalSchemaDirs) {
    if (ref.startsWith(prefix)) {
      return `${dir}/${getQualifiedClassName(ref)}`;
    }
  }

  return ref;
}

export default function generateSchema(ctx: Context): Generator {
  return async (definitions) => {
    const tasks = definitions.map((def): CompileSchemaTask => {
      const schema = transformSchema(def.schema);
      const refIds = collectRefs(def.schema);
      const refPaths = Object.fromEntries(
        refIds.map((ref) => [
          ref,
          isExternalRef(ctx, ref)
            ? getExternalSchemaPath(ref)
            : getRelativePath(
                getSchemaPath(ctx, def.schemaId),
                getSchemaPath(ctx, ref),
              ),
        ]),
      );

      return { schema, refs: refPaths };
    });
    const schemas = await compileSchemas(tasks);

    return definitions.flatMap((def, i) => {
      const path = getSchemaPath(ctx, def.schemaId);

      return [
        {
          path,
          content: schemas[i],
        },
        {
          path: trimSuffix(path, ".js") + ".d.ts",
          content: "export function validate(data: unknown): boolean;",
        },
      ];
    });
  };
}
