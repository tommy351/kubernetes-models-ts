# kubernetes-models-ts

[![](https://img.shields.io/npm/v/kubernetes-models.svg)](https://www.npmjs.com/package/kubernetes-models) [![Build Status](https://travis-ci.org/tommy351/kubernetes-models-ts.svg?branch=master)](https://travis-ci.org/tommy351/kubernetes-models-ts) [![](https://img.shields.io/badge/kubernetes-1.13.1-green.svg)](https://github.com/kubernetes/kubernetes/tree/v1.13.1)

Kubernetes models in TypeScript.

## Installation

Install with npm.

```sh
npm install kubernetes-models
```

## Usage

```js
import { Pod } from "kubernetes-models/api/core/v1";

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

## Build

```sh
make dist
```

## License

MIT
