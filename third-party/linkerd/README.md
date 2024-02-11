# @kubernetes-models/linkerd

[Linkerd](https://linkerd.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/linkerd
```

```js
import { ServiceProfile } from '@kubernetes-models/linkerd/linkerd.io/v1alpha2/ServiceProfile';

const serviceProfile = new ServiceProfile({
  metadata: {
    name: "example"
  },
  spec: {
    routes: [
      {
        name: "example",
        condition: {
          method: "GET",
          pathRegex: "/v1/example/.*"
        }
      }
    ]
  },
});

// Validate against JSON schema
serviceProfile.validate();
```

## License

MIT