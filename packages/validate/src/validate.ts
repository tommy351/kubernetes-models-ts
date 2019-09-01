import { ValidationError } from "ajv";
import { ajv } from "./ajv";

export function validate(id: string, data: any): void {
  if (!ajv.validate(id, data) && ajv.errors) {
    const err = new ValidationError(ajv.errors);
    err.message = ajv.errorsText(ajv.errors);
    throw err;
  }
}
