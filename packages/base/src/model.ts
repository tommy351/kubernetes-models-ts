import isPlainObject from "is-plain-object";
import { validate } from "@kubernetes-models/validate";

const SCHEMA_ID = Symbol("SCHEMA_ID");
const ADD_SCHEMA = Symbol("ADD_SCHEMA");

function setDefinedProps(src: any, dst: any): any {
  for (const key of Object.keys(src)) {
    if (src[key] !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      dst[key] = filterUndefinedValues(src[key]);
    }
  }

  return dst;
}

function filterUndefinedValues(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map(filterUndefinedValues);
  }

  if (isPlainObject(data)) {
    return setDefinedProps(data, {});
  }

  return data;
}

type ModelData<T> = T extends { apiVersion: any; kind: any }
  ? Omit<T, "apiVersion" | "kind">
  : T;

type ModelConstructor<T> = new () => Model<T>;

export class Model<T> {
  /** @internal */
  protected [SCHEMA_ID]: string;

  /** @internal */
  protected [ADD_SCHEMA]: () => void;

  public constructor(data?: ModelData<T>) {
    if (data) {
      setDefinedProps(data, this);
    }
  }

  public toJSON(): any {
    return setDefinedProps(this, {});
  }

  public validate(): void {
    const id = this[SCHEMA_ID];
    if (!id) return;

    if (typeof this[ADD_SCHEMA] === "function") {
      this[ADD_SCHEMA]();
    }

    validate(id, this);
  }

  public static setSchema<T>(
    ctor: ModelConstructor<T>,
    id: string,
    addSchema: () => void
  ): void {
    ctor.prototype[SCHEMA_ID] = id;
    ctor.prototype[ADD_SCHEMA] = addSchema;
  }
}
