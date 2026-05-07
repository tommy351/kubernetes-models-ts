import {
  collectRefs,
  compileSchemas,
  type CompileSchemaTask,
  transformSchema,
  type Generator,
} from "@kubernetes-models/generate";
import { getRelativePath, getSchemaPath, isExternalRef } from "../utils.js";
import { trimSuffix } from "@kubernetes-models/string-util";

const externalRefReplacements: {
  prefix: string;
  replacement: string;
}[] = [
  {
    prefix: "k8s.io/apimachinery/pkg/",
    replacement:
      "@kubernetes-models/apimachinery/_schemas/IoK8sApimachineryPkg",
  },
  {
    prefix: "k8s.io/",
    replacement: "kubernetes-models/_schemas/IoK8s",
  },
];

function camelCasePath(path: string): string {
  return path
    .split("/")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

function getExternalSchemaPath(ref: string): string {
  for (const { prefix, replacement } of externalRefReplacements) {
    if (ref.startsWith(prefix)) {
      return replacement + camelCasePath(ref.substring(prefix.length));
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
