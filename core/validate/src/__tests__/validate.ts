/// <reference types="jest-extended" />
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { validate } from "../validate";
import { ajv, register } from "../ajv";
import Ajv from "ajv";

describe("number", () => {
  const id = "number-test";

  beforeEach(() => {
    register(id, { type: "number" });
  });

  afterEach(() => {
    ajv.removeSchema(id);
  });

  it("success", () => {
    expect(() => validate(id, 46)).not.toThrow();
  });

  it("failed", () => {
    expect(() => validate(id, false)).toThrowWithMessage(
      Ajv.ValidationError,
      "data must be number"
    );
  });
});

describe("object", () => {
  const id = "object-test";

  beforeEach(() => {
    register(id, {
      type: "object",
      properties: {
        a: { type: "string" },
        b: { type: "number" },
        c: { type: "boolean" }
      }
    });
  });

  afterEach(() => {
    ajv.removeSchema(id);
  });

  it("success", () => {
    expect(() =>
      validate(id, {
        a: "abc",
        b: 3.14,
        c: true
      })
    ).not.toThrow();
  });

  it("failed", () => {
    expect(() =>
      validate(id, {
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
  beforeEach(() => {
    register("str", { type: "string" });
    register("str-nullable", {
      oneOf: [{ $ref: "str" }, { type: "null" }]
    });
  });

  afterEach(() => {
    ajv.removeSchema("str-nullable");
    ajv.removeSchema("str");
  });

  it("should remove oneOf errors", () => {
    expect(() => validate("str-nullable", 3.14)).toThrowWithMessage(
      Ajv.ValidationError,
      "data must be string"
    );
  });
});
