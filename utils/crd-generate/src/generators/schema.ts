import {
  Generator,
  Import,
  Schema,
  generateImports,
  transformSchema
} from "@kubernetes-models/generate";
import { addFormats } from "@kubernetes-models/validate";
import Ajv, { _ } from "ajv";
import { getSchemaPath } from "../utils";
import standaloneCode from "ajv/dist/standalone";
import assert from "assert";
import objectHash from "object-hash";

const OBJECT_META_ID = "io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta";

function addChildSchema(ajv: Ajv, schema: Schema): Schema {
  const hash = objectHash(schema);

  if (!ajv.getSchema(hash)) {
    ajv.addSchema(schema, hash);
    splitSchema(ajv, schema);
  }

  return { $ref: hash };
}

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

const generateSchemas: Generator = async (definitions) => {
  return definitions.map((def) => {
    const ajv = new Ajv({
      strictTypes: false,
      allErrors: true,
      code: { source: true, esm: true, formats: _`formats`, lines: true },
      inlineRefs: false,
      // example keyword is used by grafana-operator
      keywords: ["example"]
    });
    const imports: Import[] = [];

    // Register custom formats
    addFormats(ajv);

    // Register ObjectMeta schema
    ajv.addSchema({}, OBJECT_META_ID);

    imports.push({
      name: "formats",
      path: "@kubernetes-models/validate"
    });

    const schema = transformSchema(def.schema);

    splitSchema(ajv, schema);

    // Compile the schema
    const validate = ajv.compile(schema);

    // Ensure that the source code is generated
    assert(validate.source);

    // Rewrite validate code for ObjectMeta
    for (const value of validate.source.scopeValues.validate ?? []) {
      if ((value as any).value.ref.schema?.$ref === `${OBJECT_META_ID}#`) {
        const source = (value as any).value.ref.source;
        source.validateCode = `import ${source.validateName} from "@kubernetes-models/apimachinery/_schemas/IoK8sApimachineryPkgApisMetaV1ObjectMeta";`;
        source.scopeValues = {};
      }
    }

    const code = standaloneCode(ajv, validate);

    return {
      path: getSchemaPath(def.schemaId),
      content: `${generateImports(imports)}
${code}`
    };
  });
};

export default generateSchemas;
