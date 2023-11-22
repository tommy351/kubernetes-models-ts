# @kubernetes-models/envoy-gateway

[Envoy Gateway](https://gateway.envoyproxy.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/envoy-gateway
```

## Usage

```js
import { Gateway } from "../gen/gateway.networking.k8s.io/v1/Gateway";
import { GatewayClass } from "../gen/gateway.networking.k8s.io/v1/GatewayClass";
import { HTTPRoute } from "../gen/gateway.networking.k8s.io/v1/HTTPRoute";

const gatewayClass = new GatewayClass({
  metadata: {
    name: "eg"
  },
  spec: {
    controllerName: "gateway.envoyproxy.io/gatewayclass-controller"
  }
});
const gateway = new Gateway({
  metadata: {
    name: "eg"
  },
  spec: {
    gatewayClassName: "eg",
    listeners: [
      {
        name: "http",
        protocol: "HTTP",
        port: 80
      }
    ]
  }
});
const httpRoute = new HTTPRoute({
  metadata: {
    name: "backend"
  },
  spec: {
    parentRefs: [
      {
        name: "eg"
      }
    ],
    hostnames: [
      "www.example.com"
    ],
    rules: [
      {
        backendRefs: [
          {
            group: "",
            kind: "Service",
            name: "backend",
            port: 3000,
            weight: 1
          }
        ],
        matches: [
          {
            path: {
              type: "PathPrefix",
              value: "/"
            }
          }
        ]
      }
    ]
  }
});

// Validate against JSON schema
gatewayClass.validate();
gateway.validate();
httpRoute.validate();
```

## License

MIT
