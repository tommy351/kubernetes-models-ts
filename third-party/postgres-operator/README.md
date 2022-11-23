# @kubernetes-models/postgres-operator

PostgreSQL models.

This package contains the following operators:

- [Crunchy Data Postgres Operator (PGO)](https://access.crunchydata.com/documentation/postgres-operator/v5/)
- [Zalando Postgres Operator](https://postgres-operator.readthedocs.io/en/latest/)

Feel free to submit an issue or a pull request if the operator you are using is not here.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/postgres-operator
```

## Usage

### Crunchy Data

```js
import { PostgresCluster } from "@kubernetes-models/postgres-operator/postgres-operator.crunchydata.com/v1beta1/PostgresCluster";

// Create a new PostgreSQL cluster
const cluster = new PostgresCluster({
  metadata: { name: "example" },
  spec: {
    image:
      "registry.developers.crunchydata.com/crunchydata/crunchy-postgres:ubi8-14.5-1",
    postgresVersion: 14,
    instances: [
      {
        name: "instance1",
        dataVolumeClaimSpec: {
          accessModes: ["ReadWriteOnce"],
          resources: {
            requests: {
              storage: "1Gi"
            }
          }
        }
      }
    ],
    backups: {
      pgbackrest: {
        image:
          "registry.developers.crunchydata.com/crunchydata/crunchy-pgbackrest:ubi8-2.40-1",
        repos: [
          {
            name: "repo1",
            volume: {
              volumeClaimSpec: {
                accessModes: ["ReadWriteOnce"],
                resources: {
                  requests: {
                    storage: "1Gi"
                  }
                }
              }
            }
          }
        ]
      }
    }
  }
});

// Validate against JSON schema
cluster.validate();
```

### Zalando

```js
import { postgresql } from "@kubernetes-models/postgres-operator/acid.zalan.do/v1/postgresql";

// Create a new PostgreSQL cluster
const cluster = new postgresql({
  metadata: {
    name: "example"
  },
  spec: {
    teamId: "acid",
    volume: {
      size: "1Gi"
    },
    numberOfInstances: 2,
    users: {
      zalando: ["superuser", "createdb"]
    },
    databases: {
      foo: "zalando"
    },
    preparedDatabases: {
      bar: {}
    },
    postgresql: {
      version: "14"
    }
  }
});

// Validate against JSON schema
cluster.validate();
```

## License

See [LICENSE](../../LICENSE)
