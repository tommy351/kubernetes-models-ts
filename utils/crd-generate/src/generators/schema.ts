import {
  Generator,
  Import,
  generateImports,
  transformSchema
} from "@kubernetes-models/generate";
import { addFormats } from "@kubernetes-models/validate";
import Ajv, { _ } from "ajv";
import { getSchemaPath } from "../utils";
import standaloneCode from "ajv/dist/standalone";
import assert from "assert";

const OBJECT_META_ID = "io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta";

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
    const validate = ajv.compile(schema);

    assert(validate.source);

    for (const value of validate.source.scopeValues.validate ?? []) {
      if ((value as any).value.ref.schemaEnv.baseId === OBJECT_META_ID) {
        const source = (value as any).value.ref.source;
        source.validateCode = `import { validate as ${source.validateName} } from "@kubernetes-models/apimachinery/_schemas/IoK8sApimachineryPkgApisMetaV1ObjectMeta";`;
        source.scopeValues = {};
      }
    }

    const code = standaloneCode(ajv, validate);

    return {
      path: getSchemaPath(def.schemaId),
      content: `${generateImports(imports)}

${code}
`
    };
  });
};

export default generateSchemas;
