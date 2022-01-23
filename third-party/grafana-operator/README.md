# @kubernetes-models/grafana-operator

[Grafana operator](https://github.com/grafana-operator/grafana-operator) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/grafana-operator
```

## Usage

```js
import { Grafana } from "@kubernetes-models/grafana-operator/integreatly.org/v1alpha1/Grafana";

// Create a new Grafana
const grafana = new Grafana({
  metadata: { name: "example" },
  spec: {
    config: {
      log: {
        mode: "console",
        level: "error"
      }
    }
  }
});

// Validate against JSON schema
grafana.validate();
```

## License

See [LICENSE](../../LICENSE)
