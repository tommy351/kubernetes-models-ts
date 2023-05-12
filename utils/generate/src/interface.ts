import { Schema } from "./types";
import { formatComment } from "@kubernetes-models/string-util";
import indentString from "indent-string";
import { omit } from "lodash";

const FALLBACK_TYPE = "any";
const WILDCARD_FIELD = "*";

export interface GenerateInterfaceOptions {
  includeDescription?: boolean;
  getRefType?(ref: string): string;
  getFieldType?(key: string[], schema: Schema): string | undefined;
}

function _generateInterface(
  schema: Schema,
  options: GenerateInterfaceOptions,
  parentKeys: string[]
): string {
  const { getRefType, getFieldType, includeDescription } = options;

  if (getFieldType) {
    const result = getFieldType(parentKeys, schema);
    if (result) return result;
  }

  if (typeof schema.$ref === "string") {
    if (!getRefType) throw new Error("options.getRefType is undefined");

    return getRefType(schema.$ref);
  }

  const slots = [];
  if (schema.enum && schema.enum.length) {
    slots.push(...schema.enum.map((x) => JSON.stringify(x)));
  }

  if (schema.not) {
    slots.push(`Exclude<${_generateInterface(
      omit(schema, ["not"]),
      options,
      parentKeys
    )}, ${_generateInterface(
      { ...omit(schema, ["not"]), ...schema.not },
      options,
      parentKeys
    )}>`);
  }

  if (schema.oneOf) {
    slots.push(...schema.oneOf
      .map((x) =>
        _generateInterface(
          { ...omit(schema, ["oneOf"]), ...x },
          options,
          parentKeys
        )
      ))
  }

  if (schema.anyOf) {
    slots.push(...schema.anyOf
      .map((x) =>
        _generateInterface(
          { ...omit(schema, ["anyOf"]), ...x },
          options,
          parentKeys
        )
      ))
  }

  if (schema.allOf) {
    const input = schema.allOf
      .map((x) =>
        _generateInterface(
          { ...omit(schema, ["allOf"]), ...x },
          options,
          parentKeys
        )
      )
      .join(" & ");
    // must ensure the order of evaluation is correct here
    slots.push(`(${input})`);
  }

  switch (schema.type) {
    case "object": {
      const { required = [], properties = {}, additionalProperties } = schema;
      let output = "";

      for (const key of Object.keys(properties)) {
        const prop = properties[key];

        if (includeDescription && typeof prop.description === "string") {
          output += formatComment(prop.description);
        }

        output += `${JSON.stringify(key)}`;
        if (!required.includes(key)) output += "?";
        output +=
          ": " +
          _generateInterface(prop, options, [...parentKeys, key]) +
          ";\n";
      }

      if (additionalProperties) {
        output += `[key: string]: ${_generateInterface(
          additionalProperties,
          options,
          [...parentKeys, WILDCARD_FIELD]
        )};\n`;
      }

      slots.push("{\n" + indentString(output, 2) + "}");
    }
      break;
    case "number":
    case "integer":
      slots.push("number");
      break;
    case "string":
      switch (schema.format) {
        case "int-or-string":
          slots.push("string | number");
          break;
        default:
          slots.push("string");
          break;
      }
      break;
    case "boolean":
      slots.push("boolean");
      break;
    case "array":
      if (schema.items) {
        slots.push(`Array<${_generateInterface(schema.items, options, [
          ...parentKeys,
          WILDCARD_FIELD
        ])}>`);
      } else {
        slots.push(`${FALLBACK_TYPE}[]`);
      }
      break;
    case "null":
      slots.push("null");
      break;
  }

  if (slots.length <= 0) {
    return FALLBACK_TYPE;
  };

  return slots.join(" | ");
}

export function generateInterface(
  schema: Schema,
  options: GenerateInterfaceOptions = {}
): string {
  return _generateInterface(schema, options, []);
}
