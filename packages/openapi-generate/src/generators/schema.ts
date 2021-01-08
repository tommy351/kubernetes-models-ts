import {
  collectRefs,
  Definition,
  generateImports,
  Generator,
  Import,
  Schema
} from "@kubernetes-models/generate";
import { getClassName, trimRefPrefix } from "../string";

function compileSchema(def: Definition): string {
  function changeRef(obj: Schema): any {
    const output: any = {};

    for (const key of Object.keys(obj)) {
      // Remove description and kubernetes attributes
      if (key === "description" || key.startsWith("x-kubernetes-")) {
        continue;
      }

      let val = obj[key];

      if (key === "$ref" && typeof val === "string") {
        val = trimRefPrefix(val) + "#";
      } else if (typeof val === "object" && !Array.isArray(val)) {
        val = changeRef(val);
      }

      output[key] = val;
    }

    return output;
  }

  let schema: any;

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
      schema = changeRef(def.schema);
  }

  return JSON.stringify(schema, null, "  ");
}

const generateSchemas: Generator = async (definitions) => {
  return definitions.map((def) => {
    const className = getClassName(def.schemaId);
    const imports: Import[] = [];
    const refs = collectRefs(def.schema)
      .map(trimRefPrefix)
      .filter((ref) => ref !== def.schemaId);
    let addSchemaContent = "";

    imports.push({
      name: "register",
      path: "@kubernetes-models/validate"
    });

    for (const ref of refs) {
      const alias = getClassName(ref);

      imports.push({
        name: "addSchema",
        alias: getClassName(ref),
        path: `./${getClassName(ref)}`
      });

      addSchemaContent += `${alias}();\n`;
    }

    return {
      path: `_schemas/${className}.ts`,
      content: `${generateImports(imports)}

const schema: object = ${compileSchema(def)};

export function addSchema() {
${addSchemaContent}register(${JSON.stringify(def.schemaId)}, schema);
}
`
    };
  });
};

export default generateSchemas;
