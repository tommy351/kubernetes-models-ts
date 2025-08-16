import { Schema, SchemaTransformer } from "./types";
import { omit, omitBy, uniq } from "es-toolkit";
import Ajv, { _ } from "ajv";
import standaloneCode from "ajv/dist/standalone";
import assert from "assert";
import { formats } from "@kubernetes-models/validate";
import { ParseResult, parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import generate from "@babel/generator";
import { SchemaEnv, SchemaRefs } from "ajv/dist/compile";
import { objectHash, sha256base64 } from "ohash";
import nullableRef from "./nullable-ref";
import pattern from "./pattern";

const ajv = new Ajv();

const AJV_RUNTIME_PREFIX = "ajv/dist/runtime/";

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

/**
 * Remove `"use strict"` directive.
 */
function removeDirectives(ast: ParseResult<t.File>): void {
  traverse(ast, {
    Program(path) {
      path.node.directives = [];
    }
  });
}

/**
 * Remove `export default` declaration.
 */
function removeDefaultExport(ast: ParseResult<t.File>): void {
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      path.remove();
    }
  });
}

/**
 * Replace validate function of referenced schemas with import statement.
 */
function replaceValidateFunction(
  ast: ParseResult<t.File>,
  names: Map<string, string>,
  refs: Record<string, string>
): void {
  traverse(ast, {
    FunctionDeclaration(path) {
      if (!path.node.id) return;

      const id = names.get(path.node.id.name);
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
    }
  });
}

/**
 * Replace `const func = require("ajv/dist/runtime/*")` with import statement.
 */
function replaceRuntimeRequire(ast: ParseResult<t.File>): void {
  traverse(ast, {
    VariableDeclaration(path) {
      const filtered = new Set<number>();

      for (let i = 0; i < path.node.declarations.length; i++) {
        const { id, init } = path.node.declarations[i];

        if (
          !t.isIdentifier(id) ||
          !t.isMemberExpression(init) ||
          !t.isCallExpression(init.object) ||
          !t.isIdentifier(init.property) ||
          !t.isIdentifier(init.object.callee) ||
          init.object.callee.name !== "require" ||
          init.object.arguments.length !== 1 ||
          !t.isStringLiteral(init.object.arguments[0])
        ) {
          continue;
        }

        const importPath = init.object.arguments[0].value;
        if (!importPath.startsWith(AJV_RUNTIME_PREFIX)) continue;

        filtered.add(i);
        path.insertBefore(
          t.importDeclaration(
            [
              init.property.name === "default"
                ? t.importDefaultSpecifier(id)
                : t.importSpecifier(id, init.property)
            ],
            t.stringLiteral(
              "@kubernetes-models/validate/runtime/" +
                importPath.substring(AJV_RUNTIME_PREFIX.length)
            )
          )
        );
      }

      if (!filtered.size) return;

      const vars = path.node.declarations.filter((_, i) => !filtered.has(i));

      if (vars.length) {
        path.replaceWith(t.variableDeclaration(path.node.kind, vars));
      } else {
        path.remove();
      }
    }
  });
}

/**
 * Replace `require("FORMATS")` with import statement.
 */
function replaceFormatRequire(ast: ParseResult<t.File>): void {
  let formatsImported = false;

  traverse(ast, {
    CallExpression(path) {
      if (
        t.isIdentifier(path.node.callee) &&
        path.node.callee.name === "require" &&
        path.node.arguments.length === 1 &&
        t.isStringLiteral(path.node.arguments[0]) &&
        path.node.arguments[0].value === "FORMATS"
      ) {
        if (!formatsImported) {
          formatsImported = true;

          ast.program.body.unshift(
            t.importDeclaration(
              [
                t.importSpecifier(
                  t.identifier("formats"),
                  t.identifier("formats")
                )
              ],
              t.stringLiteral("@kubernetes-models/validate")
            )
          );
        }

        path.replaceWith(t.identifier("formats"));
      }
    }
  });
}

export async function compileSchema(
  schema: Schema,
  refs: Record<string, string>
): Promise<string> {
  const ajv = new Ajv({
    strictTypes: false,
    allErrors: true,
    code: {
      source: true,
      esm: true,
      formats: _`require("FORMATS")`,
      lines: true
    },
    inlineRefs: false,
    keywords: [
      // example keyword is used by grafana-operator
      "example"
    ],
    formats,
    messages: false
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
  const ast = parse(code, { sourceType: "module" });

  removeDirectives(ast);
  removeDefaultExport(ast);
  replaceValidateFunction(ast, validateNames, refs);
  replaceRuntimeRequire(ast);
  replaceFormatRequire(ast);

  const result = generate(ast, {}, code);

  return result.code;
}
