import {
  Generator,
  transformSchema,
  compileSchema
} from "@kubernetes-models/generate";
import { getSchemaPath } from "../utils";

const generateSchemas: Generator = async (definitions) => {
  return definitions.map((def) => {
    const schema = transformSchema(def.schema);

    return {
      path: getSchemaPath(def.schemaId),
      content: compileSchema(schema, {
        "io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta":
          "@kubernetes-models/apimachinery/_schemas/IoK8sApimachineryPkgApisMetaV1ObjectMeta"
      })
    };
  });
};

export default generateSchemas;
