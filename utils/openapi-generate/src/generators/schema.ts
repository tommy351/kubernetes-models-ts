import {
  collectRefs,
  Definition,
  generateImports,
  Generator,
  Import,
  Schema,
  transformSchema
} from "@kubernetes-models/generate";
import { trimSuffix } from "@kubernetes-models/string-util";
import { addFormats } from "@kubernetes-models/validate";
import Ajv, { _ } from "ajv";
import { Context } from "../context";
import { getClassName, trimRefPrefix } from "../string";
import { getSchemaPath, isAPIMachineryID } from "../utils";
import assert from "assert";
import standaloneCode from "ajv/dist/standalone";

function replaceRef(schema: Schema): Schema {
  if (typeof schema.$ref === "string") {
    return { ...schema, $ref: trimRefPrefix(schema.$ref) + "#" };
  }

  return schema;
}

function compileSchema(def: Definition): Schema {
  let schema: Schema = {};

  // Rewrite schemas for some special types
  switch (def.schemaId) {
    case "io.k8s.apimachinery.pkg.util.intstr.IntOrString":
      schema = {
        oneOf: [{ type: "string" }, { type: "integer", format: "int32" }]
      };
      break;

    case "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.JSON":
    case "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSON":
      schema = {};
      break;

    default:
      schema = transformSchema(def.schema, [replaceRef]);
  }

  return schema;
}

export default function ({ externalAPIMachinery }: Context): Generator {
  function getSchemaImportPath(ref: string): string {
    if (externalAPIMachinery && isAPIMachineryID(ref)) {
      return `@kubernetes-models/apimachinery/${trimSuffix(
        getSchemaPath(ref),
        ".js"
      )}`;
    }

    return `./${getClassName(ref)}`;
  }

  return async (definitions) => {
    return definitions.map((def) => {
      const ajv = new Ajv({
        strictTypes: false,
        allErrors: true,
        code: { source: true, esm: true, lines: true, formats: _`formats` },
        inlineRefs: false
      });

      const schema = compileSchema(def);
      const imports: Import[] = [];
      const refs = collectRefs(def.schema)
        .map(trimRefPrefix)
        .filter((ref) => ref !== def.schemaId);

      // Register custom formats
      addFormats(ajv);

      // Register the schema because some schemas reference themselves
      ajv.addSchema(schema, def.schemaId);

      for (const ref of refs) {
        // Register referenced schemas
        ajv.addSchema({}, ref);
      }

      imports.push({
        name: "formats",
        path: "@kubernetes-models/validate"
      });

      // Compile the schema
      const validate = ajv.compile(schema);

      // Ensure that the source code is generated
      assert(validate.source);

      // Rewrite validate function for referenced schemas
      for (const value of validate.source.scopeValues.validate ?? []) {
        const source = (value as any).value.ref.source;
        source.validateCode = `import ${source.validateName} from "${getSchemaImportPath((value as any).value.ref.schemaEnv.baseId)}";`;
        source.scopeValues = {};
      }

      const code = standaloneCode(ajv, validate);

      return {
        path: getSchemaPath(def.schemaId),
        content: `${generateImports(imports)}
${code}`
      };
    });
  };
}
