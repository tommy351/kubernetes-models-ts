import test from "ava";
import { Certificate } from "../../../packages/cert-manager/dist/cert-manager.io/v1/Certificate.mjs";

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

test("Certificate.toJSON", (t) => {
  t.deepEqual(cert.toJSON(), {
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

test("Certificate.validate", (t) => {
  t.notThrows(() => cert.validate());
});
