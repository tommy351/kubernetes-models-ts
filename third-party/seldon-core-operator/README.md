# @kubernetes-models/seldon-core-operator

[SeldonCore operator](https://github.com/SeldonIO/seldon-core/tree/v1.15.0/helm-charts/seldon-core-operator) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/seldon-core-operator
```

## Usage

```js
import { SeldonDeployment } from "@kubernetes-models/seldon-core-operator/machinelearning.seldon.io/v1/SeldonDeployment";

// Create a new SeldonDeployment
const deployment = new SeldonDeployment({
  metadata: { name: "example" },
  spec: {
    predictors: [
      {
        name: "example",
        graph: {
          name: "classifier",
          children: [],
          endpoint: {
            type: "REST",
          },
          type: "MODEL",
        },
      }
    ]
  }
})

// Validate against JSON schema
deployment.validate();
```

## License

See [LICENSE](../../LICENSE)
