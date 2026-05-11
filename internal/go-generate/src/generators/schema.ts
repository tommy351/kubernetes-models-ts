import {
  collectRefs,
  compileSchemas,
  type CompileSchemaTask,
  transformSchema,
  type Generator,
} from "@kubernetes-models/generate";
import {
  getQualifiedClassName,
  getRelativePath,
  getSchemaPath,
  isExternalRef,
} from "../utils.js";
import { trimSuffix } from "@kubernetes-models/string-util";

const externalSchemaDirs: { prefix: string; dir: string }[] = [
  {
    prefix: "k8s.io/apimachinery/pkg/",
    dir: "@kubernetes-models/apimachinery/_schemas",
  },
  { prefix: "k8s.io/", dir: "kubernetes-models/_schemas" },
];

function getExternalSchemaPath(ref: string): string {
  for (const { prefix, dir } of externalSchemaDirs) {
    if (ref.startsWith(prefix)) {
      return `${dir}/${getQualifiedClassName(ref)}`;
    }
  }

  return ref;
}

const generateSchema: Generator = async (definitions) => {
  const tasks = definitions.map((def): CompileSchemaTask => {
    const schema = transformSchema(def.schema);
    const refIds = collectRefs(def.schema);
    const refPaths = Object.fromEntries(
      refIds.map((ref) => [
        ref,
        isExternalRef(ref)
          ? getExternalSchemaPath(ref)
          : getRelativePath(getSchemaPath(def.schemaId), getSchemaPath(ref)),
      ]),
    );

    return { schema, refs: refPaths };
  });
  const schemas = await compileSchemas(tasks);

  return definitions.flatMap((def, i) => {
    const path = getSchemaPath(def.schemaId);

    return [
      {
        path,
        content: schemas[i],
      },
      {
        path: trimSuffix(path, ".js") + ".d.ts",
        content: "export function validate(data: unknown): boolean;",
      },
    ];
  });
};

export default generateSchema;
