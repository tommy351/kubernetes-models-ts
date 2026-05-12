export interface GroupVersion {
  group: string;
  version: string;
}

export interface GroupVersionKind extends GroupVersion {
  kind: string;
}

export interface Schema {
  description?: string;
  type?: string | string[];
  format?: string;
  items?: Schema;
  $ref?: string | Schema;
  properties?: { [key: string]: Schema };
  required?: string[];
  additionalProperties?: Schema;
  enum?: any[];
  const?: any;
  not?: Schema;
  oneOf?: Schema[];
  anyOf?: Schema[];
  allOf?: Schema[];
  nullable?: boolean;
  pattern?: string;
  [key: string]: any;
}

export interface Definition {
  gvk?: readonly GroupVersionKind[];
  schemaId: string;
  schema: Schema;
}

export interface OutputFile {
  path: string;
  content: string;
}

export interface Generator {
  (definitions: readonly Definition[]): Promise<OutputFile[]>;
}

export interface SchemaTransformer {
  (schema: Schema): Schema;
}
