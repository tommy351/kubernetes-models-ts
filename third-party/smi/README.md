# @kubernetes-models/smi

[Service Mesh Interface (SMI)](https://smi-spec.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/smi
```

## Usage

```ts
import { TrafficSplit } from "@kubernetes-models/smi/split.smi-spec.io/v1alpha4/TrafficSplit";

const split = new TrafficSplit({
  metadata: { name: "example" },
  spec: {
    service: "example",
    backends: [
      { service: "example-v1", weight: 90 },
      { service: "example-v2", weight: 10 }
    ]
  }
});
```

## License

MIT
