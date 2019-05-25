import { ajv, ValidationError } from "./ajv";
import isPlainObject from "is-plain-object";

/** @internal */
export const SCHEMA_ID = Symbol("SCHEMA_ID");

/** @internal */
export const ADD_SCHEMA = Symbol("ADD_SCHEMA");

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

export class BaseModel<T> {
  /** @internal */
  protected [SCHEMA_ID]: string;

  /** @internal */
  protected [ADD_SCHEMA]: () => void;

  public constructor(data?: T) {
    if (data) {
      setDefinedProps(data, this);
    }
  }

  public toJSON(): any {
    return setDefinedProps(this, {});
  }

  public validate(): void {
    this[ADD_SCHEMA]();

    if (!ajv.validate(this[SCHEMA_ID], this) && ajv.errors) {
      const err = new ValidationError(ajv.errors);
      err.message = ajv.errorsText(ajv.errors);
      throw err;
    }
  }
}
