import Ajv from "ajv";
import { ajv } from "./ajv";

export function validate(id: string, data: unknown): void {
  if (!ajv.validate(id, data) && ajv.errors) {
    const err = new Ajv.ValidationError(ajv.errors);
    err.message = ajv.errorsText(ajv.errors);
    throw err;
  }
}
