import {
  trimPrefix,
  getClassName,
  getInterfaceName,
  getShortClassName,
  getShortInterfaceName
} from "./string";

export interface Property {
  description?: string;
  type: string;
  format?: string;
  items?: Property;
  $ref?: string;
  properties?: { [key: string]: Property };
  required?: string[];
  additionalProperties?: Property;
  [key: string]: any;
}

export interface GroupVersionKind {
  group: string;
  kind: string;
  version: string;
}

export interface GenerateResult {
  path: string;
  content: string;
}

export type GenerateFunc = (
  defs: ReadonlyArray<Definition>
) => Promise<ReadonlyArray<GenerateResult>>;

function trimRefPrefix(ref: string) {
  return trimPrefix(ref, "#/definitions/");
}

function collectRefs(data: any): ReadonlyArray<string> {
  const refs = Object.keys(data).map(key => {
    const val = data[key];

    if (key === "$ref" && typeof val === "string") {
      return [trimRefPrefix(val)];
    }

    if (typeof val === "object" && !Array.isArray(val)) {
      return collectRefs(val);
    }

    return [];
  });

  return refs.reduce((acc, x) => acc.concat(x), [] as string[]);
}

export class Definition {
  public readonly gvk: ReadonlyArray<GroupVersionKind>;

  constructor(public readonly id: string, public readonly schema: Property) {
    if (!schema.type && !schema.$ref) {
      schema.type = "object";
    }

    this.gvk = schema["x-kubernetes-group-version-kind"] || [];
  }

  public getGVK(): GroupVersionKind | undefined {
    return this.gvk[0];
  }

  public getGroup(): string | undefined {
    const gvk = this.getGVK();
    return gvk && gvk.group;
  }

  public getVersion(): string | undefined {
    const gvk = this.getGVK();
    return gvk && gvk.version;
  }

  public getAPIVersion(): string | undefined {
    const gvk = this.getGVK();
    if (!gvk) return;
    if (!gvk.group) return gvk.version;
    return gvk.group + "/" + gvk.version;
  }

  public getKind(): string | undefined {
    const gvk = this.getGVK();
    return gvk && gvk.kind;
  }

  public getClassName(): string {
    return getClassName(this.id);
  }

  public getInterfaceName(): string {
    return getInterfaceName(this.id);
  }

  public getShortClassName(): string {
    return getShortClassName(this.id);
  }

  public getShortInterfaceName(): string {
    return getShortInterfaceName(this.id);
  }

  public getRefs(): Set<string> {
    return new Set(collectRefs(this.schema).filter(x => x !== this.id));
  }
}
