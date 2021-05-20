import { ajv } from "../ajv";

describe("format: byte", () => {
  it("multiple base64 strings in an object", () => {
    const result = ajv.validate(
      {
        type: "object",
        additionalProperties: {
          type: "string",
          format: "byte"
        }
      },
      {
        foo: Buffer.from("foo").toString("base64"),
        bar: Buffer.from("bar").toString("base64")
      }
    );

    expect(result).toBeTruthy();
  });
});
