export interface TypeMeta {
  /**
   * APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
   */
  apiVersion: string;
  /**
   * Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
   */
  kind: string;
}

function isNonNullObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null;
}

export type TypeMetaGuard<T extends TypeMeta> = (value: unknown) => value is T;

export function createTypeMetaGuard<T extends TypeMeta>(
  meta: TypeMeta
): TypeMetaGuard<T> {
  return (value): value is T => {
    return (
      isNonNullObject(value) &&
      value.apiVersion === meta.apiVersion &&
      value.kind === meta.kind
    );
  };
}
