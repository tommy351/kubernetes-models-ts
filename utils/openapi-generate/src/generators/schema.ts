import {
  collectRefs,
  Definition,
  Generator,
  Schema,
  transformSchema as baseTransformSchema,
  compileSchema
} from "@kubernetes-models/generate";
import { trimSuffix } from "@kubernetes-models/string-util";
import { Context } from "../context";
import { getClassName, trimRefPrefix } from "../string";
import { getSchemaPath, isAPIMachineryID } from "../utils";
import { OutputFile } from "@kubernetes-models/generate";

function replaceRef(schema: Schema): Schema {
  if (typeof schema.$ref === "string") {
    const ref = trimRefPrefix(schema.$ref);
    return { ...schema, $ref: `${ref}#` };
  }

  return schema;
}

function transformSchema(def: Definition): Schema {
  let schema: Schema = {};

  // Rewrite schemas for some special types
  switch (def.schemaId) {
    case "io.k8s.apimachinery.pkg.util.intstr.IntOrString":
      schema = {
        oneOf: [{ type: "string" }, { type: "integer", format: "int32" }]
      };
      break;

    case "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.JSON":
    case "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSON":
      schema = {};
      break;

    default:
      schema = baseTransformSchema(def.schema, [replaceRef]);
  }

  return { ...schema, $id: def.schemaId };
}

export default function ({ externalAPIMachinery }: Context): Generator {
  function getSchemaImportPath(ref: string): string {
    if (externalAPIMachinery && isAPIMachineryID(ref)) {
      return `@kubernetes-models/apimachinery/${trimSuffix(
        getSchemaPath(ref),
        ".js"
      )}`;
    }

    return `./${getClassName(ref)}`;
  }

  return async (definitions) => {
    const files: OutputFile[] = [];

    for (const def of definitions) {
      const schema = transformSchema(def);
      const refIds = collectRefs(def.schema)
        .map(trimRefPrefix)
        .filter((ref) => ref !== def.schemaId);
      const refPaths = Object.fromEntries(
        refIds.map((ref) => [ref, getSchemaImportPath(ref)])
      );

      files.push(
        {
          path: getSchemaPath(def.schemaId),
          content: await compileSchema(schema, refPaths)
        },
        {
          path: trimSuffix(getSchemaPath(def.schemaId), ".js") + ".d.ts",
          content: `export function validate(data: unknown): boolean;`
        }
      );
    }

    return files;
  };
}
