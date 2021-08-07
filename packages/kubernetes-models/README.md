# kubernetes-models

[![](https://img.shields.io/npm/v/kubernetes-models.svg)](https://www.npmjs.com/package/kubernetes-models) [![](https://img.shields.io/badge/kubernetes-1.22.0-green.svg)](https://github.com/kubernetes/kubernetes/tree/v1.22.0)

Kubernetes models in TypeScript.

## Installation

Install with npm.

```sh
npm install kubernetes-models
```

## Usage

```js
import { Pod } from "kubernetes-models/v1";

// Create a new instance
const pod = new Pod({
  metadata: {
    name: "foo"
  },
  spec: {
    containers: []
  }
});

// Validate against JSON schema
pod.validate();
```

## Development

To update Kubernetes version, update the values of `openapi-generate.input` in `package.json`. Please follow the following guides when editing the values.

- Older versions first.
- Add only versions with removed APIs and latest version.
- See [the deprecation guide of Kubernetes](https://kubernetes.io/docs/reference/using-api/deprecation-guide/) for removed APIs.

## License

MIT
