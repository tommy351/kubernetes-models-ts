import { ajv } from "./ajv";
import type { Schema, SchemaTransformer } from "./types";
import { omit, omitBy, uniq } from "lodash";
import assert from "assert";
import type { ValueScopeName } from "ajv/dist/compile/codegen";
import type { SchemaEnv } from "ajv/dist/compile";

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
    } else {
      newProps[k] = { oneOf: [v, { type: "null" }] };
    }
  }

  return {
    ...schema,
    properties: newProps
  };
}

function omitDescription(schema: Schema): Schema {
  return omit(schema, ["description"]);
}

function omitKubernetesFields(schema: Schema): Schema {
  return omitBy(schema, (v, k) => k.startsWith("x-kubernetes-"));
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
      ? {
          exclusiveMinimum: minimum
        }
      : { exclusiveMinimum, minimum }),
    ...(exclusiveMaximum === true
      ? {
          exclusiveMaximum: maximum
        }
      : { exclusiveMaximum, maximum })
  };
}

/**
 * Rewrite string pattern with `RegExp` class to make sure it can be parsed by
 * Ajv correctly. Invalid pattern will be omitted.
 */
function rewriteStringPattern(schema: Schema): Schema {
  if (schema.type !== "string" || !schema.pattern) return schema;

  const { pattern, ...rest } = schema;

  try {
    return {
      ...rest,
      // Use the method Ajv uses to create a RegExp.
      // https://ajv.js.org/json-schema.html#pattern
      pattern: new RegExp(pattern, "u").source
    };
  } catch (err) {
    console.error(err);
    return rest;
  }
}

function doTransformSchema(
  schema: Schema,
  transformers: readonly SchemaTransformer[]
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
      output[k] = doTransformSchema(v as Schema, transformers);
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
  transformers: readonly SchemaTransformer[] = []
): Schema {
  const output = doTransformSchema(schema, [
    omitDescription,
    omitKubernetesFields,
    allowNull,
    uniqEnum,
    setExclusiveNumber,
    rewriteStringPattern,
    ...transformers
  ]);

  ajv.validateSchema(output, true);

  return output;
}

function renderValidatorFormats(names?: Set<ValueScopeName>): string {
  if (!names?.size) return "";

  const lines: string[] = [
    'import { formats } from "@kubernetes-models/validate";'
  ];

  for (const name of names) {
    if (name.value?.key) {
      lines.push(`const ${name.str} = formats["${name.value.key}"]`);
    }
  }

  return lines.join("\n");
}

function renderValidatorSchemas(names?: Set<ValueScopeName>): string {
  if (!names?.size) return "";

  const lines: string[] = [];

  for (const name of names) {
    if (name.value?.code) {
      lines.push(`const ${name.str}: object = ${name.value.code}`);
    }
  }

  return lines.join("\n");
}

export interface ValidatorInput {
  id: string;
  path: string;
  schema: Schema;
}

export interface ValidatorResult {
  id: string;
  path: string;
  content: string;
}

export function generateValidators(
  inputs: readonly ValidatorInput[]
): ValidatorResult[] {
  const pathMap = new Map<string, string>();

  // Register schemas
  for (const input of inputs) {
    pathMap.set(input.id, input.path);
    ajv.addSchema(input.schema, input.id);
  }

  function renderRefs(names?: Set<ValueScopeName>): string {
    if (!names?.size) return "";

    const lines: string[] = [];

    for (const name of names) {
      const schemaEnv: SchemaEnv = (name.value?.ref as any).schemaEnv;
      const path = pathMap.get(schemaEnv.baseId);

      if (path) {
        lines.push(`import { validate as ${name.str} } from "${path}";`);
      }
    }

    return lines.join("\n");
  }

  return inputs.map((input) => {
    const compiled = ajv.compile(input.schema);
    assert(compiled.source);

    const { validateCode, validateName, scopeValues } = compiled.source;

    return {
      id: input.id,
      path: input.path,
      content: `// @ts-nocheck
${renderRefs(scopeValues.validate)}
${renderValidatorFormats(scopeValues.formats)}
${renderValidatorSchemas(scopeValues.schema)}
function ${validateName}(data: unknown): boolean;
${validateCode}
export { ${validateName} as validate };
`
    };
  });
}
