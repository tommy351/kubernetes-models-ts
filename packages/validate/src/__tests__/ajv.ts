import { ajv } from "../ajv";

describe("format", () => {
  describe("int32", () => {
    describe.each([
      [0, true],
      [Math.pow(2, 32) - 1, true],
      [Math.pow(2, 32), false],
      [-Math.pow(2, 32), true],
      [-Math.pow(2, 32) - 1, false],
      [123.456, false]
    ])("when input = %d", (input, expected) => {
      it(`should return ${expected}`, () => {
        expect(
          ajv.validate({ type: "integer", format: "int32" }, input)
        ).toEqual(expected);
      });
    });
  });

  describe("int64", () => {
    // NOTE: The following numbers used for testing are not very precised
    // because "number" type in JavaScript is IEEE 754.
    describe.each([
      [0, true],
      [Math.pow(2, 63), true],
      [Math.pow(2, 65), false],
      [-Math.pow(2, 63), true],
      [-Math.pow(2, 65), false],
      [123.456, false]
    ])("when input = %d", (input, expected) => {
      it(`should return ${expected}`, () => {
        expect(
          ajv.validate({ type: "integer", format: "int64" }, input)
        ).toEqual(expected);
      });
    });
  });

  describe("float", () => {
    describe.each([[1.23, true]])("when input = %d", (input, expected) => {
      it(`should return ${expected}`, () => {
        expect(
          ajv.validate({ type: "number", format: "float" }, input)
        ).toEqual(expected);
      });
    });
  });

  describe("double", () => {
    describe.each([[1.23, true]])("when input = %d", (input, expected) => {
      it(`should return ${expected}`, () => {
        expect(
          ajv.validate({ type: "number", format: "double" }, input)
        ).toEqual(expected);
      });
    });
  });

  describe("byte", () => {
    describe.each([
      ["U3dhZ2dlciByb2Nrcw==", true],
      ["", true],
      ["uuLMhh", false]
    ])("when input = %s", (input, expected) => {
      it(`should return ${expected}`, () => {
        expect(ajv.validate({ type: "string", format: "byte" }, input)).toEqual(
          expected
        );
      });
    });
  });
});
