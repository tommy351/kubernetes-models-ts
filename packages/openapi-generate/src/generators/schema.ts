import { Definition, GenerateResult, Property } from "../types";
import { trimRefPrefix, getClassName } from "../string";

function compileSchema(def: Definition): string {
  function changeRef(obj: Property): any {
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
  switch (def.id) {
    case "io.k8s.apimachinery.pkg.util.intstr.IntOrString":
      schema = {
        oneOf: [{ type: "string" }, { type: "integer", format: "int32" }]
      };
      break;

    case "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.JSON":
      schema = {};
      break;

    default:
      schema = changeRef(def.schema);
  }

  return JSON.stringify(schema, null, "  ");
}

function compileAddSchema(def: Definition): string {
  let output = "{\n";

  for (const ref of def.getRefs()) {
    output += `${getClassName(ref)}();\n`;
  }

  output += `register("${def.id}", schema);\n`;
  output += "}\n";
  return output;
}

function generate(def: Definition): GenerateResult {
  let content = `import { register } from "@kubernetes-models/validate";
`;

  for (const ref of def.getRefs()) {
    content += `
import { addSchema as ${getClassName(ref)} } from "./${getClassName(ref)}";
`;
  }

  content += `const schema: object = ${compileSchema(def)};

export function addSchema() ${compileAddSchema(def)}
`;

  return {
    path: `_schemas/${def.getClassName()}.ts`,
    content
  };
}

export async function generateSchemas(
  defs: readonly Definition[]
): Promise<readonly GenerateResult[]> {
  return defs.map(generate);
}
