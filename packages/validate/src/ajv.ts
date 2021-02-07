import Ajv, { FormatDefinition } from "ajv";
import addFormats from "ajv-formats";

// From: https://github.com/miguelmota/is-base64/blob/0702e189090921a2f11b4342f27906ff8c43d7ec/is-base64.js#L15
const rBase64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

export const ajv = new Ajv({});

addFormats(ajv);

// eslint-disable-next-line @typescript-eslint/ban-types
export function register(id: string, schema: object): void {
  if (!ajv.getSchema(id)) {
    ajv.addSchema(schema, id);
  }
}

function intFormat(bits: number): FormatDefinition<number> {
  const max = BigInt(2) ** BigInt(bits - 1) - BigInt(1);
  const min = BigInt(-2) ** BigInt(bits - 1);

  return {
    validate(input: number) {
      const n = BigInt(input);
      return n >= min && n <= max;
    },
    compare(a: number, b: number) {
      const diff = BigInt(a) - BigInt(b);
      if (diff > 0) return 1;
      if (diff < 0) return -1;
      return 0;
    },
    type: "number"
  };
}

ajv.addFormat("int32", intFormat(32));
ajv.addFormat("int64", intFormat(64));

ajv.addFormat("float", {
  type: "number",
  validate() {
    return true;
  }
});

ajv.addFormat("double", {
  type: "number",
  validate() {
    return true;
  }
});

ajv.addFormat("byte", {
  type: "string",
  validate(input: string) {
    return rBase64.test(input);
  }
});
