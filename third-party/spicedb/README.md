# @kubernetes-models/spicedb

[SpiceDB](https://authzed.com/docs) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/spicedb
```

## Usage

```js
import { SpiceDBCluster } from '@kubernetes-models/spicedb/authzed.com/v1alpha1/SpiceDBCluster';

// create the spiceDB cluster
const cluster = new SpiceDBCluster({
  metadata: {
    name: "dev"
  },
  spec: {
    channel: 'stable',
    version: 'v1.14.0',
    config: {
      datastoreEngine: 'memory',
    },
    secretName: 'dev-spicedb-secret',
  },
});

// Validate against JSON schema
cluster.validate();
```

## License

MIT
