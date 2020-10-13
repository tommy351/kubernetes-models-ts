# @kubernetes-models/sealed-secrets

[Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/sealed-secrets
```

## Usage

```js
import { SealedSecret } from "@kubernetes-models/sealed-secrets/bitnami.com/v1alpha1/SealedSecret";

const secret = new SealedSecret({
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
secret.validate();
```

## License

MIT
