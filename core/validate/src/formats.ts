import type Ajv from "ajv";
import type { Format } from "ajv";
import { fullFormats as fullFormatsBase } from "ajv-formats/dist/formats";
import fullFormatsDraft2019 from "ajv-formats-draft2019/formats";

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

function validateString(value: unknown): value is string {
  return typeof value === "string";
}

export const formats: Record<string, Format> = {
  ...fullFormatsBase,
  ...fullFormatsDraft2019,
  byte: { type: "string", validate: rBase64 },
  quantity: { type: "string", validate: rQuantity },
  // This format is used in Istio.
  string: { type: "string", validate: validateString }
};

export function addFormats(ajv: Ajv): void {
  for (const [name, format] of Object.entries(formats)) {
    ajv.addFormat(name, format);
  }
}
