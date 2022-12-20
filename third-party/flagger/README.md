# @kubernetes-models/flagger

[Flagger](https://flagger.app/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/flagger
```

## Usage

```js
import { Canary } from "@kubernetes-models/flagger/flagger.app/v1beta1/Canary";

// Create a new Canary
const canary = new Canary({
  metadata: {
    name: "example"
  },
  spec: {
    targetRef: {
      apiVersion: "apps/v1",
      kind: "Deployment",
      name: "example"
    },
    service: { port: 9898 },
    analysis: {
      interval: "1m",
      threshold: 10,
      maxWeight: 50,
      stepWeight: 5
    }
  }
});

// Validate against JSON schema
canary.validate();
```

## License

MIT
