import yargs from "yargs";
import { readFile, writeFile } from "./fs";
import { camelCase, trimPrefix, upperFirst, trimSuffix } from "./string";
import { join, relative, dirname, posix } from "path";
import { set } from "./object";

interface DefinitionTree {
  [key: string]: string | DefinitionTree;
}

const { argv } = yargs
  .option("file", {
    description: "Path of OpenAPI spec",
    required: true
  })
  .option("output", {
    description: "Output path",
    required: true
  });

function collectRef(input: any): string[] {
  const refs = Object.keys(input).map(key => {
    const val = input[key];

    if (key === "$ref" && typeof val === "string") {
      const ref = val.replace("#/definitions/", "");
      return [ref];
    }

    if (typeof val === "object" && !Array.isArray(val)) {
      return collectRef(val);
    }

    return [];
  });

  return refs.reduce((acc, x) => acc.concat(x), [] as string[]);
}

function getClassName(name: string): string {
  return upperFirst(camelCase(name, ".-"));
}

function getInterfaceName(name: string): string {
  return "I" + getClassName(name);
}

function getShortClassName(name: string): string {
  const s = name.split(".");
  return s[s.length - 1];
}

function getShortInterfaceName(name: string): string {
  return "I" + getShortClassName(name);
}

function trimDefPrefix(name: string) {
  return trimPrefix(name, "io.k8s.");
}

function getOutputPath(name: string): string {
  return join(argv.output, ...trimDefPrefix(name).split("."));
}

function commentize(s: string): string {
  let output = "/**\n";

  for (const line of s.split("\n")) {
    output += " * " + line.replace(/\*\//g, "\\*\\/") + "\n";
  }

  output += " */\n";
  return output;
}

function compileDefinition(key: string, def: any): string {
  const interfaceName = getInterfaceName(key);
  const className = getClassName(key);
  let output = "";

  if (typeof def.description === "string") {
    output += commentize(def.description);
  }

  if (!def.type && !def.$ref) def.type = "object";

  const content = compileType(def);

  if (def.type === "object") {
    let classContent =
      trimSuffix(content.trim(), "}") +
      compileClassCtor(key, def) +
      compileClassJSON(key, def) +
      "}";

    const gvk = def["x-kubernetes-group-version-kind"];

    if (gvk && gvk.length) {
      const { group, version, kind } = gvk[0];

      classContent = classContent.replace(
        `"apiVersion"?: string;`,
        `apiVersion = "${group ? group + "/" : ""}${version}";`
      );

      classContent = classContent.replace(
        `"kind"?: string;`,
        `kind = "${kind}";`
      );
    }

    output += `export interface ${interfaceName} ${content}\n`;
    output += `export class ${className} implements ${interfaceName} ${classContent}\n`;
  } else {
    output += `export type ${interfaceName} = ${content};\n`;
    output += `export type ${className} = ${interfaceName};\n`;
  }

  output += `export { ${interfaceName} as ${getShortInterfaceName(key)} };\n`;
  output += `export { ${className} as ${getShortClassName(key)} };\n`;

  return output;
}

function compileType(def: any): string {
  if (typeof def.$ref === "string") {
    return getInterfaceName(trimPrefix(def.$ref, "#/definitions/"));
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
      return `Array<${compileType(def.items)}>`;

    case "null":
      return "null";
  }

  return "any";
}

function compileClassCtor(name: string, def: any): string {
  let output = `constructor(data?: ${getInterfaceName(name)}) {\n`;
  output += "if (data) {\n";

  if (typeof def.properties === "object") {
    for (const key of Object.keys(def.properties)) {
      output += `if (data["${key}"] !== undefined) this["${key}"] = data["${key}"];\n`;
    }
  } else {
    output += `for (const key of Object.keys(data)) {
      if ((data as any)[key] !== undefined) (this as any)[key] = (data as any)[key];
    }\n`;
  }

  output += "}\n";
  output += "}\n";
  return output;
}

function compileClassJSON(name: string, { properties }: any): string {
  if (typeof properties !== "object") return "";

  let output = `toJSON() {\n`;
  output += "const output: any = {};\n";

  for (const key of Object.keys(properties)) {
    output += `if (this["${key}"] !== undefined) output["${key}"] = this["${key}"];\n`;
  }

  output += "return output;\n";
  output += "}\n";
  return output;
}

async function writeIndexFiles(tree: DefinitionTree, name: string = "") {
  let output = "";

  for (const key of Object.keys(tree)) {
    const val = tree[key];

    if (typeof val === "string") {
      output += `export * from "./${key}";\n`;
    } else {
      const exportedName = camelCase(key, "-");
      output += `import * as ${exportedName} from "./${key}";\n`;
      output += `export { ${exportedName} };\n`;
      await writeIndexFiles(val, name + key + ".");
    }
  }

  const path = join(getOutputPath(name), "index.ts");
  console.log("Generating:", path);
  await writeFile(path, output);
}

(async () => {
  const { definitions } = JSON.parse(await readFile(argv.file, "utf8"));
  const tree: DefinitionTree = {};

  for (const key of Object.keys(definitions)) {
    const def = definitions[key];
    const path = getOutputPath(key) + ".ts";
    let content = "";

    for (const ref of new Set(collectRef(def))) {
      let importPath = relative(dirname(path), getOutputPath(ref));

      if (!importPath.startsWith(".")) {
        importPath = "./" + importPath;
      }

      importPath = importPath.replace(/\\/g, posix.sep);
      content += `import { ${getInterfaceName(ref)} } from '${importPath}';\n`;
    }

    content += compileDefinition(key, def);

    console.log("Generating:", path);
    await writeFile(path, content);
    set(tree, trimDefPrefix(key), key);
  }

  await writeIndexFiles(tree);
})().catch(console.error);
