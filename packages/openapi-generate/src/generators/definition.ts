import { Definition, GenerateResult, Property } from "../types";
import {
  trimRefPrefix,
  getInterfaceName,
  getClassName,
  trimSuffix
} from "../string";

function commentize(
  content: string,
  props?: { [key: string]: boolean }
): string {
  let output = "/**\n";

  for (const line of content.split("\n")) {
    output +=
      " * " + line.replace(/\*/g, "\\*").replace(/\*\//g, "*\\/") + "\n";
  }

  if (props) {
    for (const key of Object.keys(props)) {
      if (props[key]) output += ` * @${key}\n`;
    }
  }

  output += " */\n";
  return output;
}

function trimComment(s: string): string {
  return s.replace(/\/\*{2}[\s\S]+?\*\//g, "");
}

function compileType(def: Property): string {
  if (typeof def.$ref === "string") {
    return getInterfaceName(trimRefPrefix(def.$ref));
  }

  switch (def.type) {
    case "object":
      const { required = [], properties = {}, additionalProperties } = def;
      let output = "{\n";

      for (const key of Object.keys(properties)) {
        const prop = properties[key];

        if (typeof prop.description === "string") {
          output += commentize(prop.description);
        }

        output += `"${key}"`;
        if (!~required.indexOf(key)) output += "?";
        output += ": " + compileType(prop) + ";\n";
      }

      if (additionalProperties) {
        output += `[key: string]: ${compileType(additionalProperties)};\n`;
      }

      output += "}";
      return output;

    case "string":
      if (def.enum && def.enum.length) {
        return def.enum.map(x => JSON.stringify(x)).join(" | ");
      }

      switch (def.format) {
        case "int-or-string":
          return "string | number";

        default:
          return "string";
      }

    case "number":
    case "integer":
      return "number";

    case "boolean":
      return "boolean";

    case "array":
      if (def.items) {
        return `Array<${compileType(def.items)}>`;
      }

      return "any[]";

    case "null":
      return "null";
  }

  return "any";
}

function generate(def: Definition): GenerateResult {
  const typing = compileType(def.schema);
  let content = "";
  let comment = "";

  if (def.schema.description) {
    comment = commentize(def.schema.description, {
      deprecated: def.schema.description.toLowerCase().startsWith("deprecated")
    });
  }

  for (const ref of def.getRefs()) {
    content += `
import { ${getInterfaceName(ref)} } from "./${getClassName(ref)}";
`;
  }

  if (def.schema.type === "object") {
    const gvk = def.getGVK();
    let classContent = typing;

    if (gvk) {
      classContent = `${trimSuffix(trimComment(typing.trim()), "}")}
static apiVersion: ${def.getInterfaceName()}["apiVersion"] = "${def.getAPIVersion()}";
static kind: ${def.getInterfaceName()}["kind"] = "${def.getKind()}";
}`;

      classContent = classContent.replace(
        /"(apiVersion|kind)": "([^"]+)";/g,
        `$1: ${def.getInterfaceName()}["$1"] = ${def.getClassName()}["$1"];`
      );
    }

    content += `
import { Model } from "@kubernetes-models/base";
import { addSchema } from "../_schemas/${def.getClassName()}";

${comment}export interface ${def.getInterfaceName()} ${typing}

${comment}export class ${def.getClassName()} extends Model<${def.getInterfaceName()}> implements ${def.getInterfaceName()} ${classContent}

Model.setSchema(${def.getClassName()}, "${def.id}", addSchema);
`;
  } else {
    content += `
${comment}export type ${def.getInterfaceName()} = ${typing};

${comment}export type ${def.getClassName()} = ${def.getInterfaceName()};
`;
  }

  content += `
export {
  ${def.getInterfaceName()} as ${def.getShortInterfaceName()},
  ${def.getClassName()} as ${def.getShortClassName()}
};
`;

  return {
    path: `_definitions/${def.getClassName()}.ts`,
    content
  };
}

export async function generateDefinitions(
  defs: readonly Definition[]
): Promise<readonly GenerateResult[]> {
  return defs.map(generate);
}
