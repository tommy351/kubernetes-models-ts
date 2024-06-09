import type { ErrorObject } from "ajv";
import ValidationError from "./runtime/validation_error";
import localize from "ajv-i18n";

function generateErrorMessage(errors: ErrorObject[]): string {
  localize.en(errors);

  return errors
    .map((err) => `data${err.instancePath} ${err.message}`)
    .join(", ");
}

export interface ValidateFunc<T> {
  (data: unknown): data is T;
  errors?: ErrorObject[] | null;
}

export function runValidateFunc<T>(
  fn: ValidateFunc<T>,
  data: unknown
): asserts data is T {
  if (!fn(data) && fn.errors) {
    const errors = fn.errors;

    const err = new ValidationError(errors);
    err.message = generateErrorMessage(errors);

    throw err;
  }
}
