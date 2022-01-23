# @kubernetes-models/cert-manager

[cert-manager](https://cert-manager.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/cert-manager
```

## Usage

```js
import { Certificate } from "@kubernetes-models/cert-manager/cert-manager.io/v1/Certificate";

// Create a new certificate
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

// Validate against JSON schema
cert.validate();
```

## License

MIT
