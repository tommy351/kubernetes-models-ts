export interface GroupVersionKind {
  group: string;
  kind: string;
  version: string;
}

export interface Schema {
  description?: string;
  type: string;
  format?: string;
  items?: Schema;
  $ref?: string;
  properties?: { [key: string]: Schema };
  required?: string[];
  additionalProperties?: Schema;
  enum?: any[];
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
  (definitions: readonly Definition[]): Promise<readonly OutputFile[]>;
}
