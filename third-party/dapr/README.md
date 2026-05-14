## @kubernetes-models/dapr

[Dapr](https://dapr.io/) models.

> [!NOTE]
> Dapr's upstream CRDs are hand-written and rely on `x-kubernetes-preserve-unknown-fields` for most of their `spec`, so the generated TypeScript schemas are intentionally loose. Fields outside the high-level shape will accept arbitrary values.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/dapr
```

## Usage

```js
import { Component } from "@kubernetes-models/dapr/dapr.io/v1alpha1/Component";

// Create a new Component
const component = new Component({
  metadata: {
    name: "statestore",
    namespace: "default"
  },
  spec: {
    type: "state.redis",
    version: "v1",
    metadata: [
      { name: "redisHost", value: "redis:6379" }
    ]
  }
});

// Validate against JSON schema
component.validate();
```

## License

MIT
