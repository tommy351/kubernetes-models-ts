import { dirname, extname, join, relative, resolve } from "path";
import yargs from "yargs";
import { access, readFile, writeFile } from "./fs";
import { set } from "./object";
import { camelCase, trimPrefix, trimSuffix, upperFirst } from "./string";

const { argv } = yargs
  .option("file", {
    description: "Path of OpenAPI spec",
    required: true
  })
  .option("model", {
    description: "Path of the model folder",
    required: true
  })
  .option("output", {
    description: "Output path",
    required: true
  });

const modelDir = resolve(argv.model);
const outputDir = resolve(argv.output);

function getFileName(s: string) {
  return camelCase(s, ".");
}

function getClassName(s: string) {
  return upperFirst(camelCase(s, "."));
}

function getModelPath(name: string) {
  return join(modelDir, getFileName(name) + ".ts");
}

async function walkTree(tree: any, dir: string) {
  const output = [];

  if (typeof tree === "string") {
    const path = dir + ".ts";
    const className = getClassName(tree);
    const modelPath = getModelPath(tree);
    const importPath = trimSuffix(
      relative(dirname(path), modelPath),
      extname(modelPath)
    );

    output.push(`import {${className}} from '${importPath}';`);
    output.push(`export default ${className};`);

    await writeFile(path, output.join("\n"));
    console.log(`Generated: ${path}`);
    return;
  }

  const indexPath = join(dir, "index.ts");

  for (const key of Object.keys(tree)) {
    const path = join(dir, key);
    const value = tree[key];

    if (typeof value === "string") {
      output.push(`export {default as ${key}} from './${key}';`);
    } else {
      output.push(`import * as ${key} from './${key}';`);
      output.push(`export {${key}};`);
    }

    await walkTree(value, path);
  }

  await writeFile(indexPath, output.join("\n"));
  console.log(`Generated: ${indexPath}`);
}

async function main() {
  // Read OpenAPI spec
  const spec = JSON.parse(await readFile(argv.file, "utf8"));

  // Check generated model files
  const definitions = [];

  for (const key of Object.keys(spec.definitions)) {
    try {
      await access(getModelPath(key));
      definitions.push(key);
    } catch (e) {
      // ignore errors
    }
  }

  const tree: { [key: string]: any } = {};

  for (const key of definitions) {
    set(tree, trimPrefix(key, "io.k8s."), key);
  }

  await walkTree(tree, outputDir);
}

main().catch(err => {
  console.error(err);
});
