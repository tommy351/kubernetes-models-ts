/// <reference types="jest-extended" />
import { describe, it, expect } from "vitest";
import Ajv, { Schema } from "ajv";
import { ValidateFunc, runValidateFunc } from "../validate";
import standaloneCode from "ajv/dist/standalone";

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

describe("nullable $ref", () => {
  const nullableSchema = {
    oneOf: [{ type: "string" }, { type: "null" }]
  };
  const normalOneOfSchema = {
    oneOf: [{ type: "string" }, { type: "number" }]
  };

  describe("ajv.compile", () => {
    it("should remove nullable oneOf errors", () => {
      const validate = ajv.compile(nullableSchema);

      expect(() => runValidateFunc(validate, 3.14)).toThrowWithMessage(
        Ajv.ValidationError,
        "data must be string"
      );
    });

    it("should not remove normal oneOf errors", () => {
      const validate = ajv.compile(normalOneOfSchema);

      expect(() => runValidateFunc(validate, true)).toThrowWithMessage(
        Ajv.ValidationError,
        `data must be string, data must be number, data must match exactly one schema in "oneOf"`
      );
    });
  });

  describe("standalone", () => {
    function compile(schema: Schema): ValidateFunc<unknown> {
      const ajv = new Ajv({
        code: { source: true },
        messages: false
      });
      const validate = ajv.compile(schema);
      const code = standaloneCode(ajv, validate);
      const mod = { exports: {} };

      eval(`(function(module, exports) { ${code} })`)(mod, mod.exports);

      return mod.exports as ValidateFunc<unknown>;
    }

    it("should remove nullable oneOf errors", () => {
      const validate = compile(nullableSchema);

      expect(() => runValidateFunc(validate, 3.14)).toThrowWithMessage(
        Ajv.ValidationError,
        "data must be string"
      );
    });

    it("should not remove normal oneOf errors", () => {
      const validate = compile(normalOneOfSchema);

      expect(() => runValidateFunc(validate, true)).toThrowWithMessage(
        Ajv.ValidationError,
        `data must be string, data must be number, data must match exactly one schema in "oneOf"`
      );
    });
  });
});
