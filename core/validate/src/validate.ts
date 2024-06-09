import type { ErrorObject, SchemaObject } from "ajv";
import ValidationError from "./runtime/validation_error";
import localize from "ajv-i18n";

const reOneOfTypeSchemaPath = /^\d+\/type$/;

function excludeNullableRefErrors(errors: ErrorObject[]): ErrorObject[] {
  const result: ErrorObject[] = [];
  const schemaPathsToExclude = new Set<string>();
  const oneOfSchemaPaths: string[] = [];

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
      oneOfSchemaPaths.push(err.schemaPath);

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

  /*
    Errors thrown by standalone code are like this. We want to keep the first error only.
    [
      {
        instancePath: '',
        schemaPath: '#/oneOf/0/type',
        keyword: 'type',
        params: { type: 'string' }
      },
      {
        instancePath: '',
        schemaPath: '#/oneOf/1/type',
        keyword: 'type',
        params: { type: 'number' }
      },
      {
        instancePath: '',
        schemaPath: '#/oneOf',
        keyword: 'oneOf',
        params: { passingSchemas: null }
      }
    ]
   */
  for (const err of errors) {
    for (const path of oneOfSchemaPaths) {
      const prefix = path + "/";

      // Find schema paths like this: #/oneOf/0/type, and the params.type is "null".
      if (
        err.schemaPath.startsWith(prefix) &&
        reOneOfTypeSchemaPath.test(err.schemaPath.substring(prefix.length)) &&
        err.params.type === "null"
      ) {
        schemaPathsToExclude.add(path);
        schemaPathsToExclude.add(err.schemaPath);
      }
    }
  }

  return result.filter((x) => !schemaPathsToExclude.has(x.schemaPath));
}

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
    const errors = excludeNullableRefErrors(fn.errors);
    if (!errors.length) return;

    const err = new ValidationError(errors);
    err.message = generateErrorMessage(errors);

    throw err;
  }
}
