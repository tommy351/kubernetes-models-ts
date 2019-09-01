# @kubernetes-models/contour

[Contour](https://github.com/heptio/contour) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/contour
```

## Usage

```js
import { IngressRoute } from "@kubernetes-models/contour/contour.heptio.com/v1beta1/IngressRoute";

// Create a new ingress route
const route = new IngressRoute({
  metadata: {
    name: "foo"
  },
  spec: {
    virtualhost: {
      fqdn: "foo.example.com"
    },
    routes: [
      {
        match: "/",
        services: [
          {
            name: "foo",
            port: 80
          }
        ]
      }
    ]
  }
});

// Validate against JSON schema
route.validate();
```

## License

MIT
