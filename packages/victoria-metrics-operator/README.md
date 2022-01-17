# @kubernetes-models/victoria-metrics-operator

[VictoriaMetrics operator](https://github.com/VictoriaMetrics/operator) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/victoria-metrics-operator
```

## Usage

```js
import { VMCluster } from "@kubernetes-models/victoria-metrics-operator/operator.victoriametrics.com/v1beta1/VMCluster";

// Create a new VMCluster
const cluster = new VMCluster({
  metadata: { name: "example" },
  spec: {
    retentionPeriod: "12",
    vmstorage: {
      replicaCount: 2
    }
  }
});

// Validate against JSON schema
cluster.validate();
```

## License

See [LICENSE](../../LICENSE)
