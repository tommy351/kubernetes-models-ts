# @kubernetes-models/thanos-operator

[Thanos operator](https://github.com/banzaicloud/thanos-operator) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/thanos-operator
```

## Usage

```js
import { Thanos } from "@kubernetes-models/thanos-operator/monitoring.banzaicloud.io/v1alpha1/Thanos";

// Create a new Thanos
const thanos = new Thanos({
  metadata: { name: "example" },
  spec: {
    query: {},
    rule: {},
    storeGateway: {}
  }
});

// Validate against JSON schema
thanos.validate();
```

## License

See [LICENSE](../../LICENSE)
