import Ajv from "ajv";
import addFormats from "ajv-formats";

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
