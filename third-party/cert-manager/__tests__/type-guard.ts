import { describe, it, expect } from "vitest";
import { Certificate } from "../gen/cert-manager.io/v1/Certificate";

describe.each([
  // Interface with TypeMeta only
  [{ apiVersion: "cert-manager.io/v1", kind: "Certificate" }, true],
  // Interface with incorrect apiVersion
  [{ apiVersion: "cert-manager.io/v2", kind: "Certificate" }, false],
  // Interface with incorrect kind
  [{ apiVersion: "cert-manager.io/v1", kind: "CertificateRequest" }, false],
  // Interface with valid data
  [
    {
      apiVersion: "cert-manager.io/v1",
      kind: "Certificate",
      metadata: { name: "test" }
    },
    true
  ],
  // Interface with invalid data (it doesn't matter anyway)
  [{ apiVersion: "cert-manager.io/v1", kind: "Certificate", foo: "bar" }, true],
  // null
  [null, false],
  // undefined
  [undefined, false],
  // Empty object
  [{}, false],
  // Boolean
  [true, false],
  // Number
  [3.14, false],
  // Array
  [[], false],
  // String
  ["foo", false],
  // Class without any data
  [new Certificate(), true],
  // Class with valid data
  [
    new Certificate({
      metadata: { name: "test" },
      spec: {
        issuerRef: {
          name: ""
        },
        secretName: ""
      }
    }),
    true
  ]
])("Certificate.is(%p)", (value, expected) => {
  it(`should return ${expected}`, () => {
    expect(Certificate.is(value)).toEqual(expected);
  });
});
