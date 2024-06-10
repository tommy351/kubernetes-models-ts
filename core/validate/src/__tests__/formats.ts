import { describe, it, expect } from "vitest";
import { addFormats } from "../formats";
import Ajv from "ajv";

const ajv = new Ajv({
  strictTypes: false,
  allErrors: true,
  verbose: true
});

addFormats(ajv);

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

// https://github.com/kubernetes/apimachinery/blob/8c18d83/pkg/api/resource/quantity_test.go#L216
describe("format: quantity", () => {
  it.each([
    ["0", true],
    ["0n", true],
    ["0u", true],
    ["0m", true],
    ["0Ki", true],
    ["0k", true],
    ["0Mi", true],
    ["0M", true],
    ["0Gi", true],
    ["0G", true],
    ["0Ti", true],
    ["0T", true],

    // Quantity less numbers are allowed
    ["1", true],

    // Binary suffixes
    ["1Ki", true],
    ["8Ki", true],
    ["7Mi", true],
    ["6Gi", true],
    ["5Ti", true],
    ["4Pi", true],
    ["3Ei", true],

    ["10Ti", true],
    ["100T", true],

    // Decimal suffixes
    ["5n", true],
    ["4u", true],
    ["3m", true],
    ["9", true],
    ["8k", true],
    ["50k", true],
    ["7M", true],
    ["6G", true],
    ["5T", true],
    ["40T", true],
    ["300T", true],
    ["2P", true],
    ["1E", true],

    // Decimal exponents
    ["1E-3", true],
    ["1e3", true],
    ["1E6", true],
    ["1e9", true],
    ["1E12", true],
    ["1e15", true],
    ["1E18", true],

    // Nonstandard but still parsable
    ["1e14", true],
    ["1e13", true],
    ["1e3", true],
    ["100.035k", true],

    // Things that look like floating point
    ["0.001", true],
    ["0.0005k", true],
    ["0.005", true],
    ["0.05", true],
    ["0.5", true],
    ["0.00050k", true],
    ["0.00500", true],
    ["0.05000", true],
    ["0.50000", true],
    ["0.5e0", true],
    ["0.5e-1", true],
    ["0.5e-2", true],
    ["0.5e0", true],
    ["10.035M", true],

    ["1.2e3", true],
    ["1.3E+6", true],
    ["1.40e9", true],
    ["1.53E12", true],
    ["1.6e15", true],
    ["1.7E18", true],

    ["9.01", true],
    ["8.1k", true],
    ["7.123456M", true],
    ["6.987654321G", true],
    ["5.444T", true],
    ["40.1T", true],
    ["300.2T", true],
    ["2.5P", true],
    ["1.01E", true],

    // Things that saturate/round
    ["3.001n", true],
    ["1.1E-9", true],
    ["0.0000000001", true],
    ["0.0000000005", true],
    ["0.00000000050", true],
    ["0.5e-9", true],
    ["0.9n", true],
    ["0.00000012345", true],
    ["0.00000012354", true],
    ["9Ei", true],
    ["9223372036854775807Ki", true],
    ["12E", true],

    // We'll accept fractional binary stuff, too.
    ["100.035Ki", true],
    ["0.5Mi", true],
    ["0.05Gi", true],
    ["0.025Ti", true],

    // Things written by trolls
    ["0.000000000001Ki", true], // rounds up, changes format
    [".001", true],
    [".0001k", true],
    ["1.", true],
    ["1.G", true],

    // invalid
    ["1.1.M", false],
    ["1+1.0M", false],
    ["0.1mi", false],
    ["0.1am", false],
    ["aoeu", false],
    [".5i", false],
    ["1i", false],
    ["-3.01i", false],
    ["-3.01e-", false],

    // trailing whitespace is forbidden
    [" 1", false],
    ["1 ", false]
  ])("%s -> %p", (input, expected) => {
    const result = ajv.validate(
      {
        type: "string",
        format: "quantity"
      },
      input
    );

    expect(result).toEqual(expected);
  });
});

describe("format: string", () => {
  it.each([
    ["foo", true],
    [1, false],
    [true, false]
  ])("%s -> %p", (input, expected) => {
    const result = ajv.validate({ type: "string", format: "string" }, input);

    expect(result).toEqual(expected);
  });
});

describe("format: cidr", () => {
  it.each([
    // IPv4 CIDR
    ["192.168.0.1/24", true],
    // IPv6 CIDR
    ["1:2:3:4:5:6:7:8/64", true],
    // Just an IPv4
    ["192.168.0.1", false],
    // Empty string
    ["", false]
  ])("%s -> %p", (input, expected) => {
    const result = ajv.validate({ type: "string", format: "cidr" }, input);

    expect(result).toEqual(expected);
  });
});
