import type { Schema, SchemaTransformer } from "./types.js";
import { omit, omitBy, uniq } from "es-toolkit";
import { Ajv, _ } from "ajv";
import standaloneCodeMod from "ajv/dist/standalone/index.js";
import assert from "node:assert";
import { formats } from "@kubernetes-models/validate";
import { SchemaEnv, type SchemaRefs } from "ajv/dist/compile/index.js";
import { serialize, digest } from "ohash";
import nullableRef from "./nullable-ref.js";
import pattern from "./pattern.js";
import { Worker } from "node:worker_threads";

const ajv = new Ajv();
const standaloneCode =
  standaloneCodeMod as unknown as typeof standaloneCodeMod.default;

const FORMAT_IMPORT = `import { formats } from "@kubernetes-models/validate";\n`;
const FORMAT_REQUIRE = `require("FORMATS")`;
const SCHEMA_COMPILE_CONCURRENCY = 4;
const PARALLEL_SCHEMA_THRESHOLD = 32;

export interface CompileSchemaTask {
  schema: Schema;
  refs: Record<string, string>;
}

interface WorkerMessage {
  id: number;
  code?: string;
  error?: {
    message: string;
    name?: string;
    stack?: string;
  };
}

export function collectRefs(data: Record<string, unknown>): string[] {
  const refs = Object.keys(data).map((key) => {
    const val = data[key];

    if (key === "$ref" && typeof val === "string") {
      return [val];
    }

    if (typeof val === "object" && !Array.isArray(val)) {
      return collectRefs(val as Record<string, unknown>);
    }

    return [];
  });

  return uniq(refs.reduce((acc, x) => acc.concat(x), [] as string[]));
}

function allowNull(schema: Schema): Schema {
  if (schema.type !== "object") return schema;

  const { properties, required = [] } = schema;
  if (!properties) return schema;

  const newProps: Record<string, Schema> = {};

  for (const [k, v] of Object.entries(properties)) {
    if (required.includes(k)) {
      newProps[k] = v;
    } else if (v.type) {
      newProps[k] = { ...v, nullable: true };
    } else if (v.$ref) {
      const { $ref, ...rest } = v;
      newProps[k] = { ...rest, nullableRef: $ref };
    } else {
      newProps[k] = v;
    }
  }

  return {
    ...schema,
    properties: newProps,
  };
}

function omitDescription(schema: Schema): Schema {
  return omit(schema, ["description"]);
}

function omitKubernetesFields(schema: Schema): Schema {
  return omitBy(schema, (v, k) => (k as string).startsWith("x-kubernetes-"));
}

function uniqEnum(schema: Schema): Schema {
  if (Array.isArray(schema.enum)) {
    return { ...schema, enum: uniq(schema.enum) };
  }

  return schema;
}

function setExclusiveNumber(schema: Schema): Schema {
  if (schema.type !== "number" && schema.type !== "integer") return schema;

  const { minimum, maximum, exclusiveMinimum, exclusiveMaximum, ...rest } =
    schema;

  return {
    ...rest,
    ...(exclusiveMinimum === true
      ? { exclusiveMinimum: minimum }
      : { exclusiveMinimum, minimum }),
    ...(exclusiveMaximum === true
      ? { exclusiveMaximum: maximum }
      : { exclusiveMaximum, maximum }),
  };
}

function doTransformSchema(
  schema: Schema,
  transformers: readonly SchemaTransformer[],
): Schema {
  const output: Schema = {};

  for (const [k, v] of Object.entries(schema)) {
    if (Array.isArray(v)) {
      output[k] = v.map((x) => {
        if (typeof x === "object" && !Array.isArray(x)) {
          return doTransformSchema(x, transformers);
        }

        return x;
      });
    } else if (typeof v === "object") {
      output[k] = doTransformSchema(v, transformers);
    } else {
      output[k] = v;
    }
  }

  return transformers.reduce((acc, transform) => transform(acc), output);
}

/**
 * Converts the input schema into a valid JSON schema.
 */
export function transformSchema(
  schema: Schema,
  transformers: readonly SchemaTransformer[] = [],
): Schema {
  const output = doTransformSchema(schema, [
    omitDescription,
    omitKubernetesFields,
    allowNull,
    uniqEnum,
    setExclusiveNumber,
    ...transformers,
  ]);

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  ajv.validateSchema(output, true);

  return output;
}

function addChildSchema(ajv: Ajv, schema: Schema): Schema {
  const hash = digest(serialize(schema));

  if (!ajv.getSchema(hash)) {
    ajv.addSchema(schema, hash);
    splitSchema(ajv, schema);
  }

  return { $ref: hash };
}

// TODO: Try not to modify the schema in place
function splitSchema(ajv: Ajv, schema: Schema): void {
  if (schema.properties) {
    for (const [key, value] of Object.entries(schema.properties)) {
      schema.properties[key] = addChildSchema(ajv, value);
    }
  }

  if (schema.items) {
    schema.items = addChildSchema(ajv, schema.items);
  }

  if (schema.additionalProperties) {
    schema.additionalProperties = addChildSchema(
      ajv,
      schema.additionalProperties,
    );
  }

  if (schema.not) {
    schema.not = addChildSchema(ajv, schema.not);
  }

  if (schema.oneOf) {
    schema.oneOf = schema.oneOf.map((x) => addChildSchema(ajv, x));
  }

  if (schema.anyOf) {
    schema.anyOf = schema.anyOf.map((x) => addChildSchema(ajv, x));
  }

  if (schema.allOf) {
    schema.allOf = schema.allOf.map((x) => addChildSchema(ajv, x));
  }
}

function collectValidateNames(refs: SchemaRefs): Map<string, string> {
  const names = new Map<string, string>();
  const seenIds = new Set<string>();

  function collect(refs: SchemaRefs): void {
    for (const value of Object.values(refs)) {
      const ref = value as SchemaEnv | undefined;
      if (!ref) continue;

      const id = ref.baseId;
      if (seenIds.has(id)) continue;

      seenIds.add(id);

      if (ref.validateName) {
        names.set(ref.validateName.str, id);
      }

      if (ref.refs) {
        collect(ref.refs);
      }
    }
  }

  collect(refs);

  return names;
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Ajv standalone output is predictable, so a small scanner is enough here and
// avoids parsing every generated validator with Babel.
function findFunctionDeclaration(
  code: string,
  name: string,
): { start: number; end: number } | undefined {
  const re = new RegExp(`(^|\\n)function ${escapeRegExp(name)}\\(`);
  const match = re.exec(code);

  if (!match) return;

  const start = match.index + match[1].length;
  const paramsStart = code.indexOf("(", start);
  if (paramsStart < 0) return;

  const paramsEnd = findMatchingDelimiter(code, paramsStart, "(", ")");
  if (paramsEnd < 0) return;

  const bodyStart = code.indexOf("{", paramsEnd);
  if (bodyStart < 0) return;

  const bodyEnd = findMatchingDelimiter(code, bodyStart, "{", "}");
  if (bodyEnd < 0) return;

  return {
    start,
    end: code[bodyEnd + 1] === "\n" ? bodyEnd + 2 : bodyEnd + 1,
  };
}

function findMatchingDelimiter(
  code: string,
  start: number,
  open: string,
  close: string,
): number {
  let depth = 0;
  let quote: string | undefined;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let i = start; i < code.length; i++) {
    const char = code[i];
    const next = code[i + 1];

    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }

    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        i++;
      }

      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = undefined;
      }

      continue;
    }

    if (char === "/" && next === "/") {
      lineComment = true;
      i++;
      continue;
    }

    if (char === "/" && next === "*") {
      blockComment = true;
      i++;
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === open) {
      depth++;
    } else if (char === close) {
      depth--;

      if (depth === 0) return i;
    }
  }

  return -1;
}

function replaceFunctionDeclarations(
  code: string,
  names: Map<string, string>,
  refs: Record<string, string>,
): string {
  const replacements: Array<{
    start: number;
    end: number;
    value: string;
  }> = [];

  for (const [name, id] of names) {
    const ref = refs[id];
    if (!ref) continue;

    const declaration = findFunctionDeclaration(code, name);
    if (!declaration) {
      throw new Error(`Cannot find validation function: ${name}`);
    }

    replacements.push({
      ...declaration,
      value: `import { validate as ${name} } from ${JSON.stringify(ref)};\n`,
    });
  }

  return applyReplacements(code, replacements);
}

function applyReplacements(
  code: string,
  replacements: readonly { start: number; end: number; value: string }[],
): string {
  let output = "";
  let index = 0;

  for (const replacement of [...replacements].sort(
    (a, b) => a.start - b.start,
  )) {
    if (replacement.start < index) continue;

    output += code.slice(index, replacement.start) + replacement.value;
    index = replacement.end;
  }

  return output + code.slice(index);
}

function rewriteRuntimeImports(code: string): string {
  return code.replace(
    /^const ([A-Za-z_$][\w$]*) = require\("ajv\/dist\/runtime\/([^"]+)"\)\.([A-Za-z_$][\w$]*);\n?/gm,
    (_, name: string, runtimePath: string, property: string) => {
      const importPath = "@kubernetes-models/validate/runtime/" + runtimePath;

      if (property === "default") {
        return `import ${name} from ${JSON.stringify(importPath)};\n`;
      }

      return `import { ${property} as ${name} } from ${JSON.stringify(
        importPath,
      )};\n`;
    },
  );
}

function rewriteStandaloneCode(
  code: string,
  names: Map<string, string>,
  refs: Record<string, string>,
): string {
  const usesFormats = code.includes(FORMAT_REQUIRE);
  let output = code;

  output = output.replace(/^"use strict";\n?/, "");
  output = output.replace(/^export default [A-Za-z_$][\w$]*;\n?/m, "");
  output = rewriteRuntimeImports(output);
  output = replaceFunctionDeclarations(output, names, refs);
  output = output.replaceAll(FORMAT_REQUIRE, "formats");

  return usesFormats ? FORMAT_IMPORT + output : output;
}

export async function compileSchema(
  schema: Schema,
  refs: Record<string, string>,
): Promise<string> {
  const ajv = new Ajv({
    strictTypes: false,
    allErrors: true,
    code: {
      source: true,
      esm: true,
      formats: _`require("FORMATS")`,
      lines: true,
      // SWC minifies published validators later; skipping Ajv's optimizer speeds
      // generation with negligible minified output size impact.
      optimize: 0,
    },
    inlineRefs: false,
    keywords: [
      // example keyword is used by grafana-operator
      "example",
    ],
    formats,
    messages: false,
    // transformSchema already validates generator input. Avoid adding meta
    // schemas or validating the same split validator graph during compilation.
    meta: false,
    validateSchema: false,
  });

  // Override the default pattern keyword to support RE2.
  // The reason we don't use `code.regExp` option is because we only want to
  // use RE2 for patterns that JavaScript can't handle.
  ajv.removeKeyword("pattern");
  ajv.addKeyword(pattern);

  // Add keywords
  ajv.addKeyword(nullableRef);

  // Add self reference
  ajv.addSchema(schema);

  // Add referenced schemas
  for (const key of Object.keys(refs)) {
    ajv.addSchema({}, key);
  }

  // Split the schema
  splitSchema(ajv, schema);

  // Compile the schema
  const validate = ajv.compile(schema);

  // Ensure the source code is generated
  assert(validate.source);

  const validateNames = collectValidateNames(validate.schemaEnv.refs);

  // Generate standalone code
  const code = standaloneCode(ajv, validate);

  return rewriteStandaloneCode(code, validateNames, refs);
}

async function compileSchemasSequentially(
  tasks: readonly CompileSchemaTask[],
): Promise<string[]> {
  const output: string[] = [];

  for (const task of tasks) {
    output.push(await compileSchema(task.schema, task.refs));
  }

  return output;
}

function deserializeWorkerError(error: WorkerMessage["error"]): Error {
  const err = new Error(error?.message ?? "Schema worker failed");

  err.name = error?.name ?? "Error";
  err.stack = error?.stack;

  return err;
}

function compileSchemaInWorker(
  worker: Worker,
  id: number,
  task: CompileSchemaTask,
): Promise<string> {
  return new Promise((resolve, reject) => {
    function cleanup(): void {
      worker.off("message", onMessage);
      worker.off("error", onError);
    }

    function onMessage(message: WorkerMessage): void {
      if (message.id !== id) return;

      cleanup();

      if (message.error) {
        reject(deserializeWorkerError(message.error));
      } else if (message.code !== undefined) {
        resolve(message.code);
      } else {
        reject(new Error("Schema worker returned an empty response"));
      }
    }

    function onError(err: Error): void {
      cleanup();
      reject(err);
    }

    worker.on("message", onMessage);
    worker.on("error", onError);
    worker.postMessage({ id, ...task });
  });
}

export async function compileSchemas(
  tasks: readonly CompileSchemaTask[],
): Promise<string[]> {
  if (tasks.length < PARALLEL_SCHEMA_THRESHOLD) {
    return compileSchemasSequentially(tasks);
  }

  const workers = Array.from(
    {
      length: Math.min(SCHEMA_COMPILE_CONCURRENCY, tasks.length),
    },
    () => new Worker(new URL("./schema-worker.js", import.meta.url)),
  );
  const output = new Array<string>(tasks.length);
  let nextIndex = 0;

  try {
    await Promise.all(
      workers.map(async (worker) => {
        while (nextIndex < tasks.length) {
          const index = nextIndex++;

          output[index] = await compileSchemaInWorker(
            worker,
            index,
            tasks[index],
          );
        }
      }),
    );
  } finally {
    await Promise.all(workers.map((worker) => worker.terminate()));
  }

  return output;
}
