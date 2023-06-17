import { getClassName } from "./string";

export function mergeOpenAPISpecs<
  T extends {
    definitions?: Record<string, unknown>;
  }
>(specs: readonly T[]): T {
  let result: T = {} as T;

  for (const spec of specs) {
    result = {
      ...spec,
      definitions: {
        ...result.definitions,
        ...spec.definitions
      }
    };
  }

  return result;
}

export function getSchemaPath(id: string): string {
  return `_schemas/${getClassName(id)}.ts`;
}

export function isAPIMachineryID(id: string): boolean {
  return id.startsWith("io.k8s.apimachinery.");
}
