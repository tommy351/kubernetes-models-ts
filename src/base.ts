import { ajv, ValidationError } from "./ajv";

export const SCHEMA_ID = Symbol("SCHEMA_ID");
export const ADD_SCHEMA = Symbol("ADD_SCHEMA");

function setDefinedProps(src: any, dst: any) {
  for (const key of Object.keys(src)) {
    if (src[key] !== undefined) dst[key] = src[key];
  }

  return dst;
}

export abstract class BaseModel<T> {
  protected abstract [SCHEMA_ID]: string;
  protected abstract [ADD_SCHEMA]: () => void;

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
