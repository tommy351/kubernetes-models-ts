# kubernetes-models-ts

[![](https://img.shields.io/npm/v/kubernetes-models.svg)](https://www.npmjs.com/package/kubernetes-models) ![Test](https://github.com/tommy351/kubernetes-models-ts/workflows/Test/badge.svg)

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

See [examples](examples) folder for more examples.

## Packages

### Models

- [kubernetes-models](packages/kubernetes-models) - Kubernetes models.

### 3rd-party Models

- [@kubernetes-models/cert-manager](packages/cert-manager) - [cert-manager](https://github.com/jetstack/cert-manager) models.
- [@kubernetes-models/contour](packages/contour) - [Contour](https://github.com/heptio/contour) models.

### Generators

- [@kubernetes-models/crd-generate](packages/crd-generate) - Generate Kubernetes models for custom resource definitions (CRD).
- [@kubernetes-models/openapi-generate](packages/openapi-generate) - Generate Kubernetes models from OpenAPI schema.

### Utilities

- [@kubernetes-models/base](packages/base) - Base model for Kubernetes models.
- [@kubernetes-models/read-input](packages/read-input) - Read input from file, URL or stdin.
- [@kubernetes-models/string-util](packages/string-util) - Utility functions for strings.
- [@kubernetes-models/validate](packages/validate) - Validation library for Kubernetes models.

## License

MIT
