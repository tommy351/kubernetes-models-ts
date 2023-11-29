# @kubernetes-models/traefik

[Traefik](https://traefik.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/traefik
```

## Usage

```js
import { IngressRoute } from "@kubernetes-models/traefik/traefik.containo.us/v1alpha1/IngressRoute";

// Create a new IngressRoute
const ingressRoute = new IngressRoute({
  metadata: {
    name: "test"
  },
  spec: {
    entryPoints: ["web"],
    routes: [
      {
        match: "Host(`example.com`)",
        kind: "Rule",
        services: [
          {
            name: "test",
            port: 80
          }
        ]
      }
    ]
  }
});

// Validate against JSON schema
ingressRoute.validate();
```

## License

MIT
