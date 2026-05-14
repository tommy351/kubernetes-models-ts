# @kubernetes-models/karmada

[Karmada](https://karmada.io/) (Kubernetes Armada) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/karmada
```

## Usage

```js
import { PropagationPolicy } from "@kubernetes-models/karmada/policy.karmada.io/v1alpha1/PropagationPolicy";

// Create a new PropagationPolicy
const policy = new PropagationPolicy({
  metadata: {
    name: "example-policy",
    namespace: "default"
  },
  spec: {
    resourceSelectors: [
      {
        apiVersion: "apps/v1",
        kind: "Deployment",
        name: "nginx"
      }
    ],
    placement: {
      clusterAffinity: {
        clusterNames: ["member1", "member2"]
      }
    }
  }
});

// Validate against JSON schema
policy.validate();
```

## License

MIT
