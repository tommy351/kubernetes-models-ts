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

function compileClassCtor(def: Definition): string {
  if (!def.getGVK()) {
    return "";
  }

  return `
constructor(data?: ${def.getInterfaceName()}) {
  super({
    apiVersion: "${def.getAPIVersion()}",
    kind: "${def.getKind()}",
    ...data
  } as any);
}`;
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
    const classContent = `${trimSuffix(trimComment(typing.trim()), "}")}
${compileClassCtor(def)}
}`;

    content += `
import { BaseModel, SCHEMA_ID, ADD_SCHEMA } from "../_src/base";
import { addSchema } from "../_schemas/${def.getClassName()}";

${comment}export interface ${def.getInterfaceName()} ${typing}

${comment}export class ${def.getClassName()} extends BaseModel<${def.getInterfaceName()}> implements ${def.getInterfaceName()} ${classContent}

${def.getClassName()}.prototype[SCHEMA_ID] = "${def.id}";
${def.getClassName()}.prototype[ADD_SCHEMA] = addSchema;
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
