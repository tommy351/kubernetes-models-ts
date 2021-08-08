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
