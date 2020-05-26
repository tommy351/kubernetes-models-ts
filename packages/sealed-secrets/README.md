# @kubernetes-models/sealed-secrets

[Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/sealed-secrets
```

## Usage

```js
import { BackendConfig } from "@kubernetes-models/sealed-secrets/gen/bitnami.com/v1alpha1/SealedSecret";

const route = new SealedSecret({
  metadata: {
    name: "my-secret"
  },
  spec: {
    encryptedData: {
      foo: "AgBy3i4OJSWK+PiTySYZZA9rO43cGDEq"
    }
  }
});

// Validate against JSON schema
route.validate();
```

## License

MIT
