import { ajv } from "../ajv";

describe("format", () => {
  describe("int32", () => {
    function buildTest(input: number, expected: boolean) {
      return () => {
        expect(
          ajv.validate({ type: "integer", format: "int32" }, input)
        ).toEqual(expected);
      };
    }

    it("should pass when value = 0", buildTest(0, true));
    it("should pass when value = 2^32-1", buildTest(Math.pow(2, 32) - 1, true));
    it("should fail when value = 2^32", buildTest(Math.pow(2, 32), false));
    it("should pass when value = -2^32", buildTest(-Math.pow(2, 32), true));
    it(
      "should fail when value = -2^32-1",
      buildTest(-Math.pow(2, 32) - 1, false)
    );
    it("should fail when value = 123.456", buildTest(123.456, false));
  });

  describe("int64", () => {
    function buildTest(input: number, expected: boolean) {
      return () => {
        expect(
          ajv.validate({ type: "integer", format: "int64" }, input)
        ).toEqual(expected);
      };
    }

    // NOTE: The following numbers used for testing are not very precised
    // because "number" type in JavaScript is IEEE 754.
    it("should pass when value = 0", buildTest(0, true));
    it("should pass when value = 2^63", buildTest(Math.pow(2, 63), true));
    it("should fail when value = 2^65", buildTest(Math.pow(2, 65), false));
    it("should pass when value = -2^63", buildTest(-Math.pow(2, 63), true));
    it("should fail when value = -2^65", buildTest(-Math.pow(2, 65), false));
    it("should faile when value = 123.456", buildTest(123.456, false));
  });

  describe("float", () => {
    function buildTest(input: number, expected: boolean) {
      return () => {
        expect(
          ajv.validate({ type: "number", format: "float" }, input)
        ).toEqual(expected);
      };
    }

    it("should pass when value = 1.23", buildTest(1.23, true));
  });

  describe("double", () => {
    function buildTest(input: number, expected: boolean) {
      return () => {
        expect(
          ajv.validate({ type: "number", format: "double" }, input)
        ).toEqual(expected);
      };
    }

    it("should pass when value = 1.23", buildTest(1.23, true));
  });

  describe("byte", () => {
    function buildTest(input: string, expected: boolean) {
      return () => {
        expect(ajv.validate({ type: "string", format: "byte" }, input)).toEqual(
          expected
        );
      };
    }

    it(
      "should pass when given base64 encoded string",
      buildTest("U3dhZ2dlciByb2Nrcw==", true)
    );

    it("should pass when given empty string", buildTest("", true));
    it("should fail when given invalid string", buildTest("uuLMhh", false));
  });
});
