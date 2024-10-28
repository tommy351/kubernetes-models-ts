# @kubernetes-models/cloudnative-pg

[CloudNative PG](https://cloudnative-pg.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/cloudnative-pg
```

## Usage

```js
import { Cluster } from "@kubernetes-models/cloudnative-pg/postgresql.cnpg.io/v1/Cluster";

// Create a new GitRepository
const cluster = new Cluster({
  metadata: {
    name: "cluster-example"
  },
  spec: {
    instances: 3,
    storage: {
      size: "1Gi"
    }
  }
});

// Validate against JSON schema
cluster.validate();
```

## License

MIT
