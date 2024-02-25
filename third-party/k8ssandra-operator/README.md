# @kubernetes-models/k8ssandra-operator

[K8ssandra](https://k8ssandra.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/k8ssandra-operator
```

```js
import { K8ssandraCluster } from '@kubernetes-models/k8ssandra-operator/v1alpha1';

const cluster = new K8ssandraCluster({
  metadata: { name: "example" },
  spec: {
    cassandra: {
      datacenters: [
        {
          metadata: {
            name: "example"
          },
          size: 3
        }
      ]
    }
  }
});

// Validate against JSON schema
cluster.validate();
```

## License

MIT
