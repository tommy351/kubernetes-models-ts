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
import { SchemaTransformer } from "@kubernetes-models/generate";

function replaceRef(def: Definition): SchemaTransformer {
  return (schema) => {
    if (typeof schema.$ref === "string") {
      const ref = trimRefPrefix(schema.$ref);

      // If the ref equals to the schema ID, replace it with "#", which means
      // self-reference.
      return { ...schema, $ref: ref === def.schemaId ? "#" : `${ref}#` };
    }

    return schema;
  };
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
      schema = baseTransformSchema(def.schema, [replaceRef(def)]);
  }

  return schema;
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
    return Promise.all(
      definitions.map(async (def) => {
        const schema = transformSchema(def);
        const refIds = collectRefs(def.schema)
          .map(trimRefPrefix)
          .filter((ref) => ref !== def.schemaId);
        const refPaths = Object.fromEntries(
          refIds.map((ref) => [ref, getSchemaImportPath(ref)])
        );

        return {
          path: getSchemaPath(def.schemaId),
          content: await compileSchema(schema, refPaths)
        };
      })
    );
  };
}
