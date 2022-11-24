# @kubernetes-models/external-secrets

[External secrets](https://external-secrets.io) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/external-secrets
```

## Usage

```js
import { ExternalSecret } from "@kubernetes-models/external-secrets/external-secrets.io/v1beta1/ExternalSecret";

// Create a new ExternalSecret
const secret = new ExternalSecret({
  metadata: {
    name: "example"
  },
  spec: {
    refreshInterval: "1h",
    secretStoreRef: {
      name: "secret-store-sample",
      kind: "SecretStore"
    },
    target: {
      name: "secret-to-be-created",
      creationPolicy: "Owner"
    },
    data: [
      {
        secretKey: "secret-key-to-be-managed",
        remoteRef: {
          key: "provider-key",
          version: "provider-key-version",
          property: "provider-key-property"
        }
      }
    ],
    dataFrom: [
      {
        extract: { key: "remote-key-in-the-provider" }
      }
    ]
  }
});

// Validate against JSON schema
secret.validate();
```

## License

MIT
