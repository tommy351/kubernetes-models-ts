# @kubernetes-models/kueue

[Kueue](https://kueue.sigs.k8s.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/kueue
```

## Usage

```js
import { ClusterQueue } from "@kubernetes-models/kueue/kueue.x-k8s.io/v1beta2/ClusterQueue";

// Create a new ClusterQueue
const queue = new ClusterQueue({
  metadata: {
    name: "cluster-queue",
  },
  spec: {
    namespaceSelector: {},
    resourceGroups: [
      {
        coveredResources: ["cpu", "memory"],
        flavors: [
          {
            name: "default-flavor",
            resources: [
              { name: "cpu", nominalQuota: "9" },
              { name: "memory", nominalQuota: "36Gi" },
            ],
          },
        ],
      },
    ],
  },
});

// Validate against JSON schema
queue.validate();
```

## License

MIT
