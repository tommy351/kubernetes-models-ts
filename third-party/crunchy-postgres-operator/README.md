# @kubernetes-models/crunchy-postgres-operator

[Crunchy Postgres Operator (PGO)](https://github.com/CrunchyData/postgres-operator) models. Provides TypeScript classes for the Crunchy Data PGO CRDs under the `postgres-operator.crunchydata.com` API group:

- `postgres-operator.crunchydata.com/v1`: `PostgresCluster`
- `postgres-operator.crunchydata.com/v1beta1`: `PostgresCluster`, `PGAdmin`, `PGUpgrade`

## Installation

Install with npm.

```sh
npm install @kubernetes-models/crunchy-postgres-operator
```

## Usage

```js
import { PostgresCluster } from "@kubernetes-models/crunchy-postgres-operator/postgres-operator.crunchydata.com/v1beta1/PostgresCluster";

// Create a new PostgresCluster
const cluster = new PostgresCluster({
  metadata: {
    name: "hippo",
    namespace: "default",
  },
  spec: {
    postgresVersion: 16,
    instances: [
      {
        dataVolumeClaimSpec: {
          accessModes: ["ReadWriteOnce"],
          resources: {
            requests: {
              storage: "1Gi",
            },
          },
        },
      },
    ],
    backups: {
      pgbackrest: {
        repos: [
          {
            name: "repo1",
            volume: {
              volumeClaimSpec: {
                accessModes: ["ReadWriteOnce"],
                resources: {
                  requests: {
                    storage: "1Gi",
                  },
                },
              },
            },
          },
        ],
      },
    },
  },
});

// Validate against JSON schema
cluster.validate();
```

## License

MIT
