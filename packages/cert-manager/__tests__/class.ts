import { Certificate } from "../gen/certmanager.k8s.io/v1alpha1/Certificate";

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
        acme: {
          config: [
            {
              domains: ["foo.example.com"]
            }
          ]
        },
        issuerRef: {
          name: "letsencrypt-prod",
          kind: "Issuer"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(cert).toHaveProperty("apiVersion", "certmanager.k8s.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(cert).toHaveProperty("kind", "Certificate");
  });

  it("validate", () => {
    expect(() => cert.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(cert.toJSON()).toEqual({
      apiVersion: "certmanager.k8s.io/v1alpha1",
      kind: "Certificate",
      metadata: {
        name: "foo"
      },
      spec: {
        secretName: "foo-secret",
        dnsNames: ["foo.example.com"],
        acme: {
          config: [
            {
              domains: ["foo.example.com"]
            }
          ]
        },
        issuerRef: {
          name: "letsencrypt-prod",
          kind: "Issuer"
        }
      }
    });
  });
});
