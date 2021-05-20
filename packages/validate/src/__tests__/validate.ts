import { validate } from "../validate";
import { register } from "../ajv";
import Ajv from "ajv";

describe("validate", () => {
  const id = "number-test";

  beforeAll(() => {
    register(id, { type: "number" });
  });

  it("success", () => {
    expect(() => validate(id, 46)).not.toThrow();
  });

  it("failed", () => {
    expect(() => validate(id, false)).toThrow(Ajv.ValidationError);
  });
});
