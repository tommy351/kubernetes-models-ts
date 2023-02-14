# @kubernetes-models/keda

[KEDA](https://github.com/kedacore/keda) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/keda
```

## Usage

```js
import { ScaledObject } from "@kubernetes-models/keda/keda.sh/v1alpha1/ScaledObject";

// Create a new ScaledObject
const scaledObject = new ScaledObject({
  metadata: {
    name: "example",
  },
  spec: {
    scaleTargetRef: {
      name: 'example',
    },
    triggers: [
      {
        type: "cpu",
        metadata: {
          type: "Utilization",
          value: "70",
        },
      }
    ],
  },
});

// Validate against JSON schema
scaledObject.validate();
```

## License

See [LICENSE](../../LICENSE)
