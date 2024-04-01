import { isPlainObject } from "is-plain-object";
import { ValidateFunc, runValidateFunc } from "@kubernetes-models/validate";
import { TypeMeta } from "./meta";

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
