# @kubernetes-models/spiffe

[SPIFFE](https://spiffe.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/spiffe
```

## Usage

```js
import { SpiffeID } from "@kubernetes-models/spiffe/spiffeid.spiffe.io/v1beta1/SpiffeID";

const id = new SpiffeID({
  metadata: {
    name: "test-id"
  },
  spec: {
    parentId: 'spiffe://example.org/spire/server',
    spiffeId: 'spiffe://example.org/test',
    selector: {
      namespace: 'default',
      podName: 'test-pod'
    },
  }
});

// Validate against JSON schema
id.validate();
```

## License

MIT
