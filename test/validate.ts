import { expect } from "chai";
import { Pod } from "../gen/ts/api/core/v1/Pod";
import { ajv, ValidationError } from "../src/ajv";

describe("validate", () => {
  describe("when validation passed", () => {
    it("should pass", () => {
      const pod = new Pod({
        spec: {
          containers: []
        }
      });

      pod.validate();
    });
  });

  describe("when validation failed", () => {
    it("should throw an error", () => {
      const pod = new Pod({
        spec: {} as any
      });

      expect(() => pod.validate()).to.throw(
        ValidationError,
        "data.spec should have required property 'containers'"
      );
    });
  });

  describe("format", () => {
    describe("int-or-string", () => {
      function test(input: any, expected: boolean) {
        return () => {
          expect(
            ajv.validate({ type: "string", format: "int-or-string" }, input)
          ).to.equal(expected);
        };
      }

      it("should pass when given string", test("foo", true));
      it("should pass when given integer", test(123, true));
      it("should fail when given float", test(123.456, false));
    });

    describe("int32", () => {
      function test(input: number, expected: boolean) {
        return () => {
          expect(
            ajv.validate({ type: "integer", format: "int32" }, input)
          ).to.equal(expected);
        };
      }

      it("should pass when value = 0", test(0, true));
      it("should pass when value = 2^32-1", test(Math.pow(2, 32) - 1, true));
      it("should fail when value = 2^32", test(Math.pow(2, 32), false));
      it("should pass when value = -2^32", test(-Math.pow(2, 32), true));
      it("should fail when value = -2^32-1", test(-Math.pow(2, 32) - 1, false));
      it("should fail when value = 123.456", test(123.456, false));
    });

    describe("int64", () => {
      function test(input: number, expected: boolean) {
        return () => {
          expect(
            ajv.validate({ type: "integer", format: "int64" }, input)
          ).to.equal(expected);
        };
      }

      // NOTE: The following numbers used for testing are not very precised
      // because "number" type in JavaScript is IEEE 754.
      it("should pass when value = 0", test(0, true));
      it("should pass when value = 2^63", test(Math.pow(2, 63), true));
      it("should fail when value = 2^65", test(Math.pow(2, 65), false));
      it("should pass when value = -2^63", test(-Math.pow(2, 63), true));
      it("should fail when value = -2^65", test(-Math.pow(2, 65), false));
      it("should faile when value = 123.456", test(123.456, false));
    });

    describe("float", () => {
      function test(input: number, expected: boolean) {
        return () => {
          expect(
            ajv.validate({ type: "number", format: "float" }, input)
          ).to.equal(expected);
        };
      }

      it("should pass when value = 1.23", test(1.23, true));
    });

    describe("double", () => {
      function test(input: number, expected: boolean) {
        return () => {
          expect(
            ajv.validate({ type: "number", format: "double" }, input)
          ).to.equal(expected);
        };
      }

      it("should pass when value = 1.23", test(1.23, true));
    });

    describe("byte", () => {
      function test(input: string, expected: boolean) {
        return () => {
          expect(
            ajv.validate({ type: "string", format: "byte" }, input)
          ).to.equal(expected);
        };
      }

      it(
        "should pass when given base64 encoded string",
        test("U3dhZ2dlciByb2Nrcw==", true)
      );

      it("should pass when given empty string", test("", true));
      it("should fail when given invalid string", test("uuLMhh", false));
    });
  });
});
