import { ErrorObject } from "ajv";
import { ajv } from "./ajv";

export class ValidationError extends Error {
  constructor(public readonly errors: ErrorObject[] = []) {
    super(ajv.errorsText(errors));
  }
}

ValidationError.prototype.name = "ValidationError";

export function validate(id: string, data: unknown): void {
  if (!ajv.validate(id, data) && ajv.errors) {
    throw new ValidationError(ajv.errors);
  }
}
