import { type ErrorObject } from "ajv";
import ValidationError from "./runtime/validation_error.js";
import localizeEnMod from "ajv-i18n/localize/en/index.js";

const localizeEn = localizeEnMod as unknown as (
  errors?: ErrorObject[] | null
) => void;

function generateErrorMessage(errors: ErrorObject[]): string {
  localizeEn(errors);

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
