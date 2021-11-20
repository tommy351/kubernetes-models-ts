# @kubernetes-models/cilium

[Cilium](https://cilium.io/) CRD.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/cilium
```

## Usage

```js
import { CiliumLocalRedirectPolicy } from "@kubernetes-models/cilium/cilium.io/v2/CiliumLocalRedirectPolicy";

const lrp = new CiliumLocalRedirectPolicy({
  metadata: {
    name: "lrp"
  },
  spec: {
    redirectFrontend: {
      serviceMatcher: {
        serviceName: "my-service",
        namespace: "default"
      }
    },
    redirectBackend: {
      localEndpointSelector: {
        matchLabels: {
          name: "proxy"
        }
      },
      toPorts: [
        {
          port: "8080",
          protocol: "TCP"
        }
      ]
    }
  }
});

// Validate against JSON schema
lrp.validate();
```

## License

MIT
