import {
  Generator,
  ValidatorInput,
  generateValidators,
  transformSchema
} from "@kubernetes-models/generate";
import { getSchemaPath } from "../utils";

const generateSchemas: Generator = async (definitions) => {
  const inputs: ValidatorInput[] = definitions.map((def) => ({
    id: def.schemaId,
    path: `./${def.schemaId}`,
    schema: transformSchema(def.schema)
  }));

  inputs.push({
    id: "io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
    path: "@kubernetes-models/apimachinery/_schemas/IoK8sApimachineryPkgApisMetaV1ObjectMeta",
    schema: {}
  });

  return generateValidators(inputs).map((v) => ({
    path: getSchemaPath(v.id),
    content: v.content
  }));
};

export default generateSchemas;
