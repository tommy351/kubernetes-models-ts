import { Schema, SchemaTransformer } from "./types";
import { omit, omitBy } from "lodash";

export function collectRefs(data: Record<string, unknown>): readonly string[] {
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

  return refs.reduce((acc, x) => acc.concat(x), [] as string[]);
}

function appendType(schema: Schema, type: string): Schema {
  if (!schema.type || schema.type === type) return schema;

  if (Array.isArray(schema.type)) {
    if (schema.type.includes(type)) return schema;
    return { ...schema, type: [...schema.type, type] };
  }

  if (schema.type) {
    return { ...schema, type: [schema.type, type] };
  }

  return { ...schema, type };
}

function allowNull(schema: Schema): Schema {
  if (schema.type !== "object") return schema;

  const { properties, required = [] } = schema;
  if (!properties) return schema;

  const newProps: Record<string, Schema> = {};

  for (const [k, v] of Object.entries(properties)) {
    if (!v.$ref && !required.includes(k)) {
      newProps[k] = appendType(v, "null");
    } else {
      newProps[k] = v;
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
  return doTransformSchema(schema, [
    omitDescription,
    omitKubernetesFields,
    allowNull,
    ...transformers
  ]);
}
