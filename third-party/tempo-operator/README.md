# @kubernetes-models/spicedb

[Tempo Operator](https://github.com/grafana/tempo-operator) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/tempo-operator
```

## Usage

```js
import { SpiceDBCluster } from '@kubernetes-models/spicedb/authzed.com/v1alpha1/SpiceDBCluster';

// create the spiceDB cluster
const cluster = new TempoMonolithic({
  metadata: {
    name: "dev"
  },
  spec: {
    storage: {
      traces: { gcs: { secret: "tempo-traces" }, backend: "gcs" }
    }
  }
});

// Validate against JSON schema
cluster.validate();
```

## License

MIT
