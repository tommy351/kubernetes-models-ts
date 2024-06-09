import { Schema, SchemaTransformer } from "./types";
import { omit, omitBy, uniq } from "lodash";
import Ajv, { _ } from "ajv";
import standaloneCode from "ajv/dist/standalone";
import assert from "assert";
import { formats } from "@kubernetes-models/validate";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import generate from "@babel/generator";
import { SchemaEnv, SchemaRefs } from "ajv/dist/compile";
import { objectHash, sha256base64 } from "ohash";
import nullableRef from "./nullable-ref";

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
    } else if (v.$ref) {
      const { $ref, ...rest } = v;
      newProps[k] = { ...rest, nullableRef: $ref };
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
    rewriteStringPattern,
    ...transformers
  ]);

  ajv.validateSchema(output, true);

  return output;
}

function addChildSchema(ajv: Ajv, schema: Schema): Schema {
  const hash = sha256base64(objectHash(schema));

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
      schema.additionalProperties
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

export async function compileSchema(
  schema: Schema,
  refs: Record<string, string>
): Promise<string> {
  const ajv = new Ajv({
    strictTypes: false,
    allErrors: true,
    code: { source: true, esm: true, formats: _`formats`, lines: true },
    inlineRefs: false,
    keywords: [
      // example keyword is used by grafana-operator
      "example"
    ],
    formats,
    messages: false
  });

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
  const ast = parse(code, { sourceType: "module" });

  traverse(ast, {
    Program(path) {
      // Remove "use strict" directive
      path.node.directives = [];

      // Add @kubernetes-models/validate import
      path.node.body.unshift(
        t.importDeclaration(
          [t.importSpecifier(t.identifier("formats"), t.identifier("formats"))],
          t.stringLiteral("@kubernetes-models/validate")
        )
      );
    },
    // Replace validate function of referenced schemas with import statement
    FunctionDeclaration(path) {
      if (!path.node.id) return;

      const id = validateNames.get(path.node.id.name);
      if (!id) return;

      const ref = refs[id];
      if (!ref) return;

      path.replaceWith(
        t.importDeclaration(
          [
            t.importSpecifier(
              t.identifier(path.node.id.name),
              t.identifier("validate")
            )
          ],
          t.stringLiteral(ref)
        )
      );
    },
    // Replace Ajv runtime require() with import statement
    VariableDeclaration(path) {
      const vars: t.VariableDeclarator[] = [];

      for (const declaration of path.node.declarations) {
        if (
          t.isIdentifier(declaration.id) &&
          t.isMemberExpression(declaration.init) &&
          t.isCallExpression(declaration.init.object) &&
          t.isIdentifier(declaration.init.property) &&
          t.isIdentifier(declaration.init.object.callee) &&
          declaration.init.object.callee.name === "require" &&
          declaration.init.object.arguments.length === 1 &&
          t.isStringLiteral(declaration.init.object.arguments[0])
        ) {
          const importPath = declaration.init.object.arguments[0].value.replace(
            /^ajv\/dist\/runtime\/(.+)$/,
            "@kubernetes-models/validate/runtime/$1"
          );

          // Insert an import statement before the current node
          path.insertBefore(
            t.importDeclaration(
              [
                declaration.init.property.name === "default"
                  ? t.importDefaultSpecifier(declaration.id)
                  : t.importSpecifier(declaration.id, declaration.init.property)
              ],
              t.stringLiteral(importPath)
            )
          );
        } else {
          vars.push(declaration);
        }
      }

      // Do not change the node if variables are not removed
      if (vars.length === path.node.declarations.length) return;

      if (vars.length) {
        // Replace the node with a new variable declaration
        path.replaceWith(t.variableDeclaration(path.node.kind, vars));
      } else {
        // Remove the node if all variables are removed
        path.remove();
      }
    },
    // Remove the default export
    ExportDefaultDeclaration(path) {
      path.remove();
    }
  });

  const result = generate(ast, {}, code);

  return result.code;
}
