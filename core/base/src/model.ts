import { isPlainObject } from "es-toolkit/predicate";
import {
  type ValidateFunc,
  runValidateFunc
} from "@kubernetes-models/validate";
import { type TypeMeta } from "./meta.js";

function setDefinedProps<D extends object>(src: object, dst: D): D {
  const s = src as Record<string, unknown>;
  const d = dst as Record<string, unknown>;

  for (const key of Object.keys(s)) {
    if (s[key] !== undefined) {
      d[key] = filterUndefinedValues(s[key]);
    }
  }

  return dst;
}

function filterUndefinedValues(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map(filterUndefinedValues);
  }

  if (isPlainObject(data)) {
    return setDefinedProps(data as object, {});
  }

  return data;
}

export type ModelData<T> = T extends TypeMeta ? Omit<T, keyof TypeMeta> : T;

export type ModelConstructor<T> = new (data?: ModelData<T>) => Model<T>;

export class Model<T> {
  public constructor(data?: ModelData<T>) {
    if (data) {
      setDefinedProps(data, this);
    }
  }

  protected setDefinedProps(data?: ModelData<T>): void {
    if (data) {
      setDefinedProps(data, this);
    }
  }

  public toJSON(): unknown {
    const result: Record<string, unknown> = {};

    setDefinedProps(this, result);

    return result;
  }

  public validate(): void {
    // Use `setValidateFunc` to set the validate function
  }
}

export function setValidateFunc<T>(
  ctor: ModelConstructor<T>,
  fn: ValidateFunc<T>
): void {
  ctor.prototype.validate = function () {
    runValidateFunc(fn, this);
  };
}
