import type { ValidationError } from "ajv";
import mod from "ajv/dist/runtime/validation_error.js";
export default (mod.default || mod) as unknown as typeof ValidationError;
