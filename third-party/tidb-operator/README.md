# @kubernetes-models/tidb-operator

[TiDB Operator](https://github.com/pingcap/tidb-operator) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/tidb-operator
```

## Usage

```js
import { TidbCluster } from "@kubernetes-models/tidb-operator/pingcap.com/v1alpha1/TidbCluster";

// Create a new TidbCluster
const cluster = new TidbCluster({
  metadata: {
    name: "cluster-sample",
  },
  spec: {
    version: 'v6.5.0',
    timezone: 'UTC',
    pvReclaimPolicy: 'Retain',
    enableDynamicConfiguration: true,
    configUpdateStrategy: 'RollingUpdate',
    discovery: {},
    helper: {
      image: 'alpine:3.16.0',
    },
    pd: {
      baseImage: 'pingcap/pd',
      maxFailoverCount: 0,
      replicas: 1,
      // if storageClassName is not set, the default Storage Class of the Kubernetes cluster will be used
      // storageClassName: local-storage
      requests: {
        storage: '1Gi'
      },
      config: {},
    },
    tikv: {
      baseImage: 'pingcap/tikv',
      maxFailoverCount: 0,
      // If only 1 TiKV is deployed, the TiKV region leader
      // cannot be transferred during upgrade, so we have
      // to configure a short timeout
      evictLeaderTimeout: '1m',
      replicas: 1,
      // if storageClassName is not set, the default Storage Class of the Kubernetes cluster will be used
      // storageClassName: local-storage
      requests: {
        storage: '1Gi'
      },
      config: {
        storage: {
          // In basic examples, we set this to avoid using too much storage.
          'reserve-space': '0MB',
        },
        rocksdb: {
          // In basic examples, we set this to avoid the following error in some Kubernetes clusters:
          // "the maximum number of open file descriptors is too small, got 1024, expect greater or equal to 82920"
          'max-open-files': 256,
        },
        raftdb: {
          'max-open-files': 256,
        },
      },
    },
  },
});

// Validate against JSON schema
cluster.validate();
```

## License

See [LICENSE](../../LICENSE)
