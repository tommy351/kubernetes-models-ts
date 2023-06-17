import type { ErrorObject, SchemaObject } from "ajv";

export interface Validator {
  (data: unknown): boolean;
  errors?: ErrorObject[];
}

function renderPlural(
  value: number,
  singular: string,
  plural = `${singular}s`
): string {
  return `${value} ${value === 1 ? singular : plural}`;
}

// Based on `en` translation in ajv-i18n package.
function formatErrorObject(err: ErrorObject): string {
  // TODO: Add more error messages
  switch (err.keyword) {
    case "items":
      return `must NOT have more than ${renderPlural(
        err.params.limit,
        "item"
      )}`;

    case "additionalProperties":
      return `must NOT have additional properties`;

    case "anyOf":
      return `must match a schema in "anyOf"`;

    case "enum":
      return `must be equal to one of the allowed values`;

    case "format":
      return `must match format "${err.params.format}"`;

    case "exclusiveMaximum":
    case "exclusiveMinimum":
      return `must be ${err.params.comparison} ${err.params.limit}`;

    case "maxItems":
      return `must NOT have more than ${renderPlural(
        err.params.limit,
        "item"
      )}`;

    case "minItems":
      return `must NOT have less than ${renderPlural(
        err.params.limit,
        "item"
      )}`;

    case "maxLength":
      return `must NOT be longer than ${renderPlural(
        err.params.limit,
        "character"
      )}`;

    case "minLength":
      return `must NOT be shorter than ${renderPlural(
        err.params.limit,
        "character"
      )}`;

    case "maxProperties":
      return `must NOT have more than ${renderPlural(
        err.params.limit,
        "property",
        "properties"
      )}`;

    case "minProperties":
      return `must NOT have less than ${renderPlural(
        err.params.limit,
        "property",
        "properties"
      )}`;

    case "multipleOf":
      return `must be a multiple of ${err.params.multipleOf}`;

    case "not":
      return `must NOT be valid according to the schema in "not"`;

    case "oneOf":
      return `must match exactly one schema in "oneOf"`;

    case "pattern":
      return `must match pattern "${err.params.pattern}"`;

    case "required":
      return `must have required property "${err.params.missingProperty}"`;

    case "type":
      return `must be ${err.params.type}`;

    case "unevaluatedProperties":
      return `must NOT have unevaluated properties`;

    case "unevaluatedItems":
      return `must NOT have more than ${renderPlural(err.params.len, "item")}`;

    case "uniqueItems":
      return `must NOT have duplicate items (items ## ${err.params.j} and ${err.params.i} are identical)`;

    case "const":
      return "must be equal to constant";

    case "contains":
      return "must contain a valid item";

    default:
      return `must pass "${err.keyword}" keyword validation`;
  }
}

function generateErrorMessage(errors: readonly ErrorObject[]): string {
  if (!errors.length) return "No errors";

  return errors
    .map((e) => `data.${e.instancePath} ${e.message || formatErrorObject(e)}`)
    .join(", ");
}

// https://github.com/ajv-validator/ajv/blob/490eb8c0eba8392d071fef005e16d330f259d0ba/lib/runtime/validation_error.ts#L3
export class ValidationError extends Error {
  public readonly ajv = true;
  public readonly validation = true;

  constructor(public readonly errors: ErrorObject[]) {
    super(generateErrorMessage(errors));
  }
}

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

export function runValidator(validator: Validator, data: unknown): void {
  if (!validator(data) && validator.errors) {
    const errors = excludeNullableRefErrors(validator.errors);

    throw new ValidationError(errors);
  }
}
