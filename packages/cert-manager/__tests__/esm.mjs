import { Certificate } from "../dist/cert-manager.io/v1/Certificate.mjs";

describe("Certificate", () => {
  const cert = new Certificate({
    metadata: {
      name: "foo"
    },
    spec: {
      secretName: "foo-secret",
      dnsNames: ["foo.example.com"],
      issuerRef: {
        name: "letsencrypt-prod",
        kind: "Issuer"
      }
    }
  });

  it("toJSON", () => {
    expect(cert.toJSON()).toEqual({
      apiVersion: "cert-manager.io/v1",
      kind: "Certificate",
      metadata: {
        name: "foo"
      },
      spec: {
        secretName: "foo-secret",
        dnsNames: ["foo.example.com"],
        issuerRef: {
          name: "letsencrypt-prod",
          kind: "Issuer"
        }
      }
    });
  });

  it("validate", () => {
    expect(() => cert.validate()).not.toThrow();
  });
});
