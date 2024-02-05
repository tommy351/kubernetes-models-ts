# @kubernetes-models/envoy-gateway

[Envoy Gateway](https://gateway.envoyproxy.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/envoy-gateway
```

## Usage

```js
import { BackendTrafficPolicy } from "@kubernetes-models/envoy-gateway/gateway.envoyproxy.io/v1alpha1";

// Create a new BackendTrafficPolicy
const app = new BackendTrafficPolicy({
  metadata: {
    namespace: "envoy-gateway",
    name: "target-gateway-1"
  },
  spec: {
    targetRef: {
      group: "gateway.networking.k8s.io",
      kind: "Gateway",
      name: "gateway-1",
      namespace: "envoy-gateway"
    }
  }
});

// Validate against JSON schema
app.validate();
```

## License

MIT
