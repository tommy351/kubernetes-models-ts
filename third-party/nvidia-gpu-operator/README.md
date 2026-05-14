# @kubernetes-models/nvidia-gpu-operator

[NVIDIA GPU Operator](https://github.com/NVIDIA/gpu-operator) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/nvidia-gpu-operator
```

## Usage

```js
import { ClusterPolicy } from "@kubernetes-models/nvidia-gpu-operator/nvidia.com/v1/ClusterPolicy";

// Create a new ClusterPolicy
const policy = new ClusterPolicy({
  metadata: {
    name: "cluster-policy",
    namespace: "gpu-operator",
  },
  spec: {},
});

// Validate against JSON schema
policy.validate();
```

## License

MIT
