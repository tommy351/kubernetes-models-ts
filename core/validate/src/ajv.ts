import Ajv, { AnySchema } from "ajv";
import addFormats from "ajv-formats";
import addFormatsDraft2019 from "ajv-formats-draft2019";

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
  strictTypes: false,
  allErrors: true,
  verbose: true
});

addFormats(ajv);
addFormatsDraft2019(ajv);

export function register(id: string, schema: AnySchema): void {
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

// This format is used in Istio.
ajv.addFormat("string", {
  type: "string",
  validate: (value: unknown) => typeof value === "string"
});
