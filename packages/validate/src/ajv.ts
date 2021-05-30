import Ajv from "ajv";
import addFormats from "ajv-formats";

// From: https://github.com/miguelmota/is-base64/blob/0702e189090921a2f11b4342f27906ff8c43d7ec/is-base64.js#L15
const rBase64 =
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

// https://github.com/kubernetes/apimachinery/blob/8c18d83/pkg/api/resource/quantity.go
const rSignedNumber = /[+-]?(?:\d+|\d+\.\d+|\d+\.|\.\d+)/;
// https://physics.nist.gov/cuu/Units/binary.html
const rBinarySI = /[KMGTPE]i/;
// https://en.wikipedia.org/wiki/Metric_prefix#List_of_SI_prefixes
const rDecimalSI = /(?:[YZEPTGMkhdcmunpfazy]|da)/;
const rDecimalExponent = new RegExp(`[eE]${rSignedNumber.source}`);
const rQuantitySuffix = new RegExp(
  `(?:${rBinarySI.source}|${rDecimalSI.source}|${rDecimalExponent.source})?`
);
const rQuantity = new RegExp(
  `^${rSignedNumber.source}${rQuantitySuffix.source}$`
);

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

ajv.addFormat("quantity", {
  type: "string",
  validate: rQuantity
});
