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
import Ajv from "ajv";
import { Context } from "../context";
import { getClassName, trimRefPrefix } from "../string";
import { getSchemaPath, isAPIMachineryID } from "../utils";
import assert from "assert";

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
        code: { source: true, esm: true },
        inlineRefs: false
      });

      const schema = compileSchema(def);
      const imports: Import[] = [];
      const refs = collectRefs(def.schema)
        .map(trimRefPrefix)
        .filter((ref) => ref !== def.schemaId);
      const formatVars: Record<string, string> = {};
      let addSchemaContent = "";

      // Register custom formats
      addFormats(ajv);

      // Register the schema because some schemas reference themselves
      ajv.addSchema(schema, def.schemaId);

      imports.push({
        name: "register",
        path: "@kubernetes-models/validate"
      });

      for (const ref of refs) {
        const alias = getClassName(ref);

        addSchemaContent += `${alias}();\n`;

        // Import addSchema function
        imports.push({
          name: "addSchema",
          alias,
          path: getSchemaImportPath(ref)
        });

        // Register referenced schemas
        ajv.addSchema({}, ref);
      }

      // Compile the schema
      const validate = ajv.compile(schema);

      // Ensure that the source code is generated
      assert(validate.source);

      // Assign format functions to variables
      for (const format of validate.source.scopeValues.formats ?? []) {
        const key = format.value?.key;

        if (typeof key === "string") {
          formatVars[format.str] = key;
        }
      }

      if (Object.keys(formatVars).length) {
        imports.push({
          name: "formats",
          path: "@kubernetes-models/validate"
        });
      }

      // Import validate functions from other schemas
      for (const [key, ref] of Object.entries(validate.schemaEnv.refs)) {
        // Do not import the schema itself
        if (key === def.schemaId) continue;

        const name = (ref as any).validateName;

        // Skip if the name is not defined
        if (!name) continue;

        imports.push({
          name: "validate",
          alias: name,
          path: getSchemaImportPath(key)
        });
      }

      return {
        path: getSchemaPath(def.schemaId),
        content: `${generateImports(imports)}

const schema = ${JSON.stringify(schema)};

${Object.entries(formatVars)
  .map(([key, value]) => `const ${key} = formats[${JSON.stringify(value)}];`)
  .join("\n")}
${validate.source.validateCode}
export { ${validate.source.validateName} as validate };

export function addSchema() {
${addSchemaContent}register(${JSON.stringify(def.schemaId)}, schema);
}
`
      };
    });
  };
}
