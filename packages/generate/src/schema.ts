import { Schema, SchemaTransformer } from "./types";
import { omit, omitBy, uniq } from "lodash";
import Ajv from "ajv";

const ajv = new Ajv();

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
  transformers: readonly SchemaTransformer[] = []
): Schema {
  const output = doTransformSchema(schema, [
    omitDescription,
    omitKubernetesFields,
    allowNull,
    uniqEnum,
    setExclusiveNumber,
    ...transformers
  ]);

  ajv.validateSchema(output, true);

  return output;
}
