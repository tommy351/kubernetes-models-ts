import { Certificate } from "../gen/cert-manager.io/v1alpha3/Certificate";

describe("Certificate", () => {
  let cert: Certificate;

  beforeEach(() => {
    cert = new Certificate({
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

  it("should set apiVersion", () => {
    expect(cert).toHaveProperty("apiVersion", "cert-manager.io/v1alpha3");
  });

  it("should set kind", () => {
    expect(cert).toHaveProperty("kind", "Certificate");
  });

  it("validate", () => {
    expect(() => cert.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(cert.toJSON()).toEqual({
      apiVersion: "cert-manager.io/v1alpha3",
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
});
