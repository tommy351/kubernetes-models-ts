# @kubernetes-models/chaos-mesh

[Chaos Mesh](https://chaos-mesh.org/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/chaos-mesh
```

## Usage

```js
import { PodChaos } from "@kubernetes-models/chaos-mesh/chaos-mesh.org/v1alpha1/PodChaos";

// Create a new PodChaos
const chaos = new PodChaos({
  metadata: {
    name: "pod-failure-example",
    namespace: "default",
  },
  spec: {
    action: "pod-failure",
    mode: "one",
    duration: "30s",
    selector: {
      namespaces: ["default"],
      labelSelectors: {
        app: "web",
      },
    },
  },
});

// Validate against JSON schema
chaos.validate();
```

## License

MIT
