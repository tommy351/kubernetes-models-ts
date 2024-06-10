/// <reference types="jest-extended" />
import { describe, it, expect } from "vitest";
import Ajv from "ajv";
import { runValidateFunc } from "../validate";

const ajv = new Ajv({
  strictTypes: false,
  allErrors: true,
  verbose: true
});

describe("number", () => {
  const validate = ajv.compile({ type: "number" });

  it("success", () => {
    expect(() => runValidateFunc(validate, 46)).not.toThrow();
  });

  it("failed", () => {
    expect(() => runValidateFunc(validate, false)).toThrowWithMessage(
      Ajv.ValidationError,
      "data must be number"
    );
  });
});

describe("object", () => {
  const validate = ajv.compile({
    type: "object",
    properties: {
      a: { type: "string" },
      b: { type: "number" },
      c: { type: "boolean" }
    }
  });

  it("success", () => {
    expect(() =>
      runValidateFunc(validate, {
        a: "abc",
        b: 3.14,
        c: true
      })
    ).not.toThrow();
  });

  it("failed", () => {
    expect(() =>
      runValidateFunc(validate, {
        a: true,
        b: 3.14,
        c: "abc"
      })
    ).toThrowWithMessage(
      Ajv.ValidationError,
      "data/a must be string, data/c must be boolean"
    );
  });
});
