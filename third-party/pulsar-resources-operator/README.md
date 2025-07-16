# @kubernetes-models/pulsar-resources-operator

[Pulsar resources operator](https://github.com/streamnative/pulsar-resources-operator) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/pulsar-resources-operator
```

## Usage

```js
import { PulsarTenant } from "@kubernetes-models/pulsar-resources-operator/resource.streamnative.io/v1alpha1/PulsarTenant";

// Create a new PulsarTenant
const tenant = new PulsarTenant({
  metadata: { name: "example" },
  spec: {
    name: "example-tenant",
    connectionRef: { name: "example-connection" }
  }
});

// Validate against JSON schema
tenant.validate();
```

## License

See [LICENSE](../../LICENSE)
