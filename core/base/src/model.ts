import { isPlainObject } from "is-plain-object";
import {
  validate,
  ValidateFunc,
  runValidateFunc
} from "@kubernetes-models/validate";
import { TypeMeta } from "./meta";

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

export type ModelData<T> = T extends TypeMeta ? Omit<T, keyof TypeMeta> : T;

export type ModelConstructor<T> = new (data?: ModelData<T>) => Model<T>;

export class Model<T> {
  /** @internal */
  private [SCHEMA_ID]?: string;

  /** @internal */
  private [ADD_SCHEMA]?: () => void;

  public constructor(data?: ModelData<T>) {
    if (data) {
      setDefinedProps(data, this);
    }
  }

  public toJSON(): any {
    const result = {};

    setDefinedProps(this, result);

    return result;
  }

  public validate(): void {
    const id = this[SCHEMA_ID];
    if (!id) return;

    if (typeof this[ADD_SCHEMA] === "function") {
      this[ADD_SCHEMA]();
    }

    validate(id, this);
  }
}

export function setSchema<T>(
  ctor: ModelConstructor<T>,
  id: string,
  addSchema: () => void
): void {
  ctor.prototype[SCHEMA_ID] = id;
  ctor.prototype[ADD_SCHEMA] = addSchema;
}

export function setValidateFunc<T>(
  ctor: ModelConstructor<T>,
  fn: ValidateFunc<T>
): void {
  ctor.prototype.validate = function () {
    runValidateFunc(fn, this);
  };
}
