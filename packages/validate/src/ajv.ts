import Ajv from "ajv";
import addFormats from "ajv-formats";

// From: https://github.com/miguelmota/is-base64/blob/0702e189090921a2f11b4342f27906ff8c43d7ec/is-base64.js#L15
const rBase64 =
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

export const ajv = new Ajv({
  strictTypes: false
});

addFormats(ajv);

// eslint-disable-next-line @typescript-eslint/ban-types
export function register(id: string, schema: object): void {
  if (!ajv.getSchema(id)) {
    ajv.addSchema(schema, id);
  }
}

ajv.addFormat("byte", {
  type: "string",
  validate: (value: string) => rBase64.test(value)
});
