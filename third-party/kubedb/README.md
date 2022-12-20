# @kubernetes-models/kubedb

[KubeDB](https://kubedb.com/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/kubedb
```

## Usage

```js
import { App } from "@kubernetes-models/kubedb/kubedb.com/v1alpha2/Postgres";

// Create a new Postgres
const pg = new Postgres({
  metadata: { name: "example" },
  spec: {
    version: "13.2",
    storageType: "Durable",
    storage: {
      storageClassName: "standard",
      accessModes: ["ReadWriteOnce"],
      resources: {
        requests: { storage: "1Gi" }
      }
    },
    terminationPolicy: "DoNotTerminate"
  }
});

// Validate against JSON schema
pg.validate();
```

## License

See [LICENSE](../../LICENSE)
