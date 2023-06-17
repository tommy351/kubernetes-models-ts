import {
  collectRefs,
  Definition,
  generateValidators,
  Generator,
  Schema,
  transformSchema,
  ValidatorInput
} from "@kubernetes-models/generate";
import { Context } from "../context";
import { getClassName, trimRefPrefix } from "../string";
import { getSchemaPath, isAPIMachineryID } from "../utils";
import { trimSuffix } from "@kubernetes-models/string-util";

function replaceRef(schema: Schema): Schema {
  if (typeof schema.$ref === "string") {
    return { ...schema, $ref: trimRefPrefix(schema.$ref) + "#" };
  }

  return schema;
}

function compileSchema(def: Definition): Schema {
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
      schema = transformSchema(def.schema, [replaceRef]);
  }

  return schema;
}

export default function ({ externalAPIMachinery }: Context): Generator {
  return async (definitions) => {
    const inputs: ValidatorInput[] = definitions.map((def) => ({
      id: def.schemaId,
      path: `./${getClassName(def.schemaId)}`,
      schema: compileSchema(def)
    }));

    if (externalAPIMachinery) {
      const refs = new Set(
        definitions.flatMap((def) =>
          collectRefs(def.schema)
            .map(trimRefPrefix)
            .filter((ref) => isAPIMachineryID(ref) && ref !== def.schemaId)
        )
      );

      for (const ref of refs) {
        inputs.push({
          id: ref,
          path: `@kubernetes-models/apimachinery/${trimSuffix(
            getSchemaPath(ref),
            ".ts"
          )}`,
          schema: {}
        });
      }
    }

    return generateValidators(inputs).map((v) => ({
      path: getSchemaPath(v.id),
      content: v.content
    }));
  };
}
