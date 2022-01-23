# @kubernetes-models/contour

[Contour](https://projectcontour.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/contour
```

## Usage

```js
import { HTTPProxy } from "@kubernetes-models/contour/projectcontour.io/v1";

// Create a new HTTP proxy
const route = new HTTPProxy({
  metadata: {
    name: "foo"
  },
  spec: {
    virtualhost: {
      fqdn: "foo.example.com"
    },
    routes: [
      {
        conditions: [
          {
            prefix: "/"
          }
        ],
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
