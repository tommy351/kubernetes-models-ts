# @kubernetes-models/vault-secrets-operator

[HashiCorp Vault Secrets Operator](https://github.com/hashicorp/vault-secrets-operator) models. Provides TypeScript classes for the `secrets.hashicorp.com/v1beta1` CRDs:

- `VaultAuth`, `VaultAuthGlobal`, `VaultConnection`
- `VaultStaticSecret`, `VaultDynamicSecret`, `VaultPKISecret`
- `HCPAuth`, `HCPVaultSecretsApp`
- `CSISecrets`, `SecretTransformation`

## Installation

Install with npm.

```sh
npm install @kubernetes-models/vault-secrets-operator
```

## Usage

```js
import { VaultStaticSecret } from "@kubernetes-models/vault-secrets-operator/secrets.hashicorp.com/v1beta1/VaultStaticSecret";

const secret = new VaultStaticSecret({
  metadata: {
    name: "example",
    namespace: "default",
  },
  spec: {
    vaultAuthRef: "default",
    mount: "kv",
    path: "app/config",
    type: "kv-v2",
    destination: {
      name: "example-k8s-secret",
      create: true,
    },
  },
});

// Validate against the JSON schema
secret.validate();
```

## License

MIT
