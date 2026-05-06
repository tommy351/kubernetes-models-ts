import {
  type Generator,
  transformSchema,
  compileSchemas,
  type OutputFile,
} from "@kubernetes-models/generate";
import { getSchemaPath } from "../utils.js";
import { trimSuffix } from "@kubernetes-models/string-util";

const generateSchemas: Generator = async (definitions) => {
  const files: OutputFile[] = [];
  const tasks = definitions.map((def) => ({
    schema: { ...transformSchema(def.schema), $id: def.schemaId },
    refs: {
      "io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta":
        "@kubernetes-models/apimachinery/_schemas/IoK8sApimachineryPkgApisMetaV1ObjectMeta",
    },
  }));
  const schemas = await compileSchemas(tasks);

  for (let i = 0; i < definitions.length; i++) {
    const def = definitions[i];
    const path = getSchemaPath(def.schemaId);

    files.push(
      {
        path,
        content: schemas[i],
      },
      // TODO: Move this to @kubernetes-models/generate
      {
        path: trimSuffix(path, ".js") + ".d.ts",
        content: `export function validate(data: unknown): boolean;`,
      },
    );
  }

  return files;
};

export default generateSchemas;
