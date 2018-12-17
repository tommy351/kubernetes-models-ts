import yargs from "yargs";
import fs from "fs";
import { join, relative, resolve, dirname, extname } from "path";

const { readFile, access, mkdir, writeFile } = fs.promises;

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

const modelPath = resolve(argv.model);
const outputPath = resolve(argv.output);

function camelCase(input: string, chars: string) {
  let output = "";
  let upper = false;

  for (const s of input) {
    if (chars.includes(s)) {
      upper = true;
    } else {
      output += upper ? s.toUpperCase() : s;
      upper = false;
    }
  }

  return output;
}

function upperFirst(s: string) {
  return s[0].toUpperCase() + s.substring(1);
}

function lowerFirst(s: string) {
  return s[0].toLowerCase() + s.substring(1);
}

function getFileName(s: string) {
  return camelCase(s, ".");
}

function getClassName(s: string) {
  return upperFirst(camelCase(s, "."));
}

function getModelPath(name: string) {
  return join(modelPath, getFileName(name) + ".ts");
}

function trimPrefix(s: string, prefix: string) {
  if (s.substring(0, prefix.length) === prefix) {
    return s.substring(prefix.length);
  }

  return s;
}

function trimSuffix(s: string, suffix: string) {
  const end = s.length - suffix.length;

  if (s.substring(end) === suffix) {
    return s.substring(0, end);
  }

  return s;
}

function set(obj: any, key: string, value: any) {
  const dot = key.indexOf(".");

  if (!~dot) {
    obj[key] = value;
    return obj;
  }

  const firstKey = key.substring(0, dot);
  const restKey = key.substring(dot + 1);

  obj[firstKey] = obj[firstKey] || {};
  set(obj[firstKey], restKey, value);

  return obj;
}

async function mkdirAll(path: string) {
  const parent = dirname(path);

  try {
    await access(parent);
  } catch (err) {
    await mkdirAll(parent);
  }

  try {
    await mkdir(path);
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
}

async function walkTree(tree: any, dir: string) {
  if (typeof tree === "string") {
    const path = dir + ".ts";
    const className = getClassName(tree);
    const modelPath = getModelPath(tree);
    const importPath = trimSuffix(
      relative(dirname(path), modelPath),
      extname(modelPath)
    );

    const output = [
      `import {${className}} from '${importPath}';`,
      `export default ${className};`
    ];

    await mkdirAll(dirname(path));
    await writeFile(path, output.join("\n"));
    console.log(`Generated: ${path}`);
    return;
  }

  const output = [];
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

  await mkdirAll(dir);
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
    } catch (e) {}
  }

  const tree: { [key: string]: any } = {};

  for (const key of definitions) {
    set(tree, trimPrefix(key, "io.k8s."), key);
  }

  await walkTree(tree, outputPath);
}

main().catch(err => {
  console.error(err);
});
