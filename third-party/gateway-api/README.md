# @kubernetes-models/gateway-api

[Gateway API](https://gateway-api.sigs.k8s.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/gateway-api
```

## Usage

```js
import { HTTPRoute } from "@kubernetes-models/gateway-api/gateway.networking.k8s.io/v1/HTTPRoute";

// Create a new HTTPRoute
const route = new HTTPRoute({
  metadata: {
    name: "http-route"
  },
  spec: {
    parentRefs: [
      {
        kind: "Gateway",
        name: "foo-gateway"
      }
    ],
    rules: [
      {
        backendRefs: [{ name: "foo-svc", port: 8080 }]
      }
    ]
  }
});

// Validate against JSON schema
route.validate();
```

## License

MIT
