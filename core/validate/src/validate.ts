import type { ErrorObject, SchemaObject } from "ajv";
import ValidationError from "./runtime/validation_error";

function excludeNullableRefErrors(errors: ErrorObject[]): ErrorObject[] {
  const result: ErrorObject[] = [];
  const schemaPathsToExclude = new Set<string>();

  for (const err of errors) {
    /*
      We want to exclude nullable $ref type like this:

      {
        instancePath: '',
        schemaPath: '#/oneOf',
        keyword: 'oneOf',
        params: { passingSchemas: null },
        message: 'must match exactly one schema in oneOf',
        schema: [ { '$ref': 'str' }, { type: 'null' } ],
        parentSchema: { oneOf: [ [Object], [Object] ] },
        data: 3.14
      }
     */
    if (err.keyword === "oneOf") {
      const nullTypeIndex = (err.schema as SchemaObject[])?.findIndex(
        (x) => x.type === "null"
      );

      if (nullTypeIndex > -1) {
        /*
          oneOf error usually comes with the error below, and we want to remove
          it as well.
          {
            instancePath: '',
            schemaPath: '#/oneOf/1/type',
            keyword: 'type',
            params: { type: 'null' },
            message: 'must be null',
            schema: 'null',
            parentSchema: { type: 'null' },
            data: 3.14
          }
         */
        schemaPathsToExclude.add(`${err.schemaPath}/${nullTypeIndex}/type`);
        continue;
      }
    }

    result.push(err);
  }

  return result.filter((x) => !schemaPathsToExclude.has(x.schemaPath));
}

function generateErrorMessage(errors: ErrorObject[]): string {
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
    const errors = excludeNullableRefErrors(fn.errors);
    if (!errors.length) return;

    const err = new ValidationError(errors);
    err.message = generateErrorMessage(errors);

    throw err;
  }
}
