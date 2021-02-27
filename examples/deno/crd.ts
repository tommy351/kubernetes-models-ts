import { Certificate } from "https://cdn.skypack.dev/@kubernetes-models/cert-manager/cert-manager.io/v1/Certificate?dts";

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

console.log(cert);
cert.validate();
