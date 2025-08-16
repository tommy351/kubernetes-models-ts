import { Schema } from "./types";
import { formatComment } from "@kubernetes-models/string-util";
import indentString from "indent-string";
import { omit } from "es-toolkit";

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

  if (schema.enum && schema.enum.length) {
    return schema.enum.map((x) => JSON.stringify(x)).join(" | ");
  }

  if (schema.not) {
    return `Exclude<${_generateInterface(
      omit(schema, ["not"]),
      options,
      parentKeys
    )}, ${_generateInterface(
      { ...omit(schema, ["not"]), ...schema.not },
      options,
      parentKeys
    )}>`;
  }

  const result = (() => {
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

        return "{\n" + indentString(output, 2) + "}";
      }

      case "number":
      case "integer":
        return "number";

      case "string":
        switch (schema.format) {
          case "int-or-string":
            return "string | number";

          default:
            return "string";
        }

      case "boolean":
        return "boolean";

      case "array":
        if (schema.items) {
          return `Array<${_generateInterface(schema.items, options, [
            ...parentKeys,
            WILDCARD_FIELD
          ])}>`;
        }

        return `${FALLBACK_TYPE}[]`;

      case "null":
        return "null";
    }

    return "";
  })();

  if (schema.oneOf) {
    return intersectType(
      result,
      schema.oneOf
        .map((x) =>
          _generateInterface(
            { ...omit(schema, ["oneOf"]), ...x },
            options,
            parentKeys
          )
        )
        .join(" | ")
    );
  }

  if (schema.anyOf) {
    return intersectType(
      result,
      schema.anyOf
        .map((x) =>
          _generateInterface(
            { ...omit(schema, ["anyOf"]), ...x },
            options,
            parentKeys
          )
        )
        .join(" | ")
    );
  }

  if (schema.allOf) {
    return intersectType(
      result,
      schema.allOf
        .map((x) =>
          _generateInterface(
            { ...omit(schema, ["allOf"]), ...x },
            options,
            parentKeys
          )
        )
        .join(" & ")
    );
  }

  return result || FALLBACK_TYPE;
}

function intersectType(base: string, patch: string): string {
  if (base) {
    return `${base} & (${patch})`;
  }

  return patch;
}

export function generateInterface(
  schema: Schema,
  options: GenerateInterfaceOptions = {}
): string {
  return _generateInterface(schema, options, []);
}
