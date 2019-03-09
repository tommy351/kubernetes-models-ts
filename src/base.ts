import { ajv, ValidationError } from "./ajv";
import isPlainObject from "is-plain-object";

/** @internal */
export const SCHEMA_ID = Symbol("SCHEMA_ID");

/** @internal */
export const ADD_SCHEMA = Symbol("ADD_SCHEMA");

function filterUndefinedValues(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map(filterUndefinedValues);
  }

  if (isPlainObject(data)) {
    return setDefinedProps(data, {});
  }

  return data;
}

function setDefinedProps(src: any, dst: any) {
  for (const key of Object.keys(src)) {
    if (src[key] !== undefined) {
      dst[key] = filterUndefinedValues(src[key]);
    }
  }

  return dst;
}

export class BaseModel<T> {
  /** @internal */
  protected [SCHEMA_ID]: string;

  /** @internal */
  protected [ADD_SCHEMA]: () => void;

  constructor(data?: T) {
    if (data) {
      setDefinedProps(data, this);
    }
  }

  public toJSON() {
    return setDefinedProps(this, {});
  }

  public validate() {
    this[ADD_SCHEMA]();

    if (!ajv.validate(this[SCHEMA_ID], this) && ajv.errors) {
      const err = new ValidationError(ajv.errors);
      err.message = ajv.errorsText(ajv.errors);
      throw err;
    }
  }
}
