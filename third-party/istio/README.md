# @kubernetes-models/istio

[Istio](https://istio.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/istio
```

## Usage

```js
import { Gateway } from "@kubernetes-models/istio/networking.istio.io/v1beta1/Gateway";

// Create a new Gateway
const gateway = new Gateway({
  metadata: {
    name: "test"
  },
  spec: {
    selector: {
      app: "istio"
    },
    servers: [
      {
        port: {
          number: 80
        },
        hosts: ["*"]
      }
    ]
  }
});

// Validate against JSON schema
gateway.validate();
```

## License

MIT
