# @kubernetes-models/openkruise

[OpenKruise](https://openkruise.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/openkruise
```

## Usage

```js
import { CloneSet } from "@kubernetes-models/openkruise/apps.kruise.io/v1alpha1/CloneSet";

// Create a new CloneSet
const cloneSet = new CloneSet({
  metadata: {
    name: "sample",
  },
  spec: {
    replicas: 5,
    selector: {
      matchLabels: { app: "sample" },
    },
    template: {
      metadata: {
        labels: { app: "sample" },
      },
      spec: {
        containers: [
          {
            name: "main",
            image: "nginx:alpine",
          },
        ],
      },
    },
  },
});

// Validate against JSON schema
cloneSet.validate();
```

## License

MIT
