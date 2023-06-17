import Ajv from "ajv";
import { addFormats } from "@kubernetes-models/validate";

export const ajv = new Ajv({
  strictTypes: false,
  allErrors: true,
  verbose: true,
  code: {
    source: true,
    lines: true
  },
  inlineRefs: false,
  messages: false
});

addFormats(ajv);
