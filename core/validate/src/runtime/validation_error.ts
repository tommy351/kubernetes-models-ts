import type { ValidationError } from "ajv";
import mod from "ajv/dist/runtime/validation_error.js";
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export default (mod.default || mod) as unknown as typeof ValidationError;
