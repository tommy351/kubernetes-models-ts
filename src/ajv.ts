import Ajv, { ValidationError, FormatDefinition } from "ajv";
import bigInteger from "big-integer";

// From: https://github.com/miguelmota/is-base64/blob/0702e189090921a2f11b4342f27906ff8c43d7ec/is-base64.js#L15
const rBase64 = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

export const ajv = new Ajv({
  coerceTypes: true,
  extendRefs: "fail",
  format: "full"
});

export { ValidationError };

export function addSchema(id: string, schema: any) {
  if (!ajv.getSchema(id)) {
    ajv.addSchema(schema, id);
  }
}

function intFormat(bits: number): FormatDefinition {
  return {
    validate(input: number) {
      const int = bigInteger(input);
      return int.bitLength().toJSNumber() <= bits;
    },
    compare(a: number, b: number) {
      return bigInteger(a).compare(bigInteger(b));
    },
    type: "number"
  };
}

ajv.addFormat("int32", intFormat(32));
ajv.addFormat("int64", intFormat(64));

ajv.addFormat("int-or-string", {
  type: "string",
  validate(input: string) {
    const n = +input;
    if (isNaN(n)) return true;
    return Number.isInteger(n);
  }
});

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
