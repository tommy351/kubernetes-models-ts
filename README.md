# kubernetes-models-ts

[![](https://img.shields.io/npm/v/kubernetes-models.svg)](https://www.npmjs.com/package/kubernetes-models) [![CircleCI](https://circleci.com/gh/tommy351/kubernetes-models-ts/tree/master.svg?style=svg)](https://circleci.com/gh/tommy351/kubernetes-models-ts/tree/master) [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Ftommy351%2Fkubernetes-models-ts.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Ftommy351%2Fkubernetes-models-ts?ref=badge_shield)
[![](https://img.shields.io/badge/kubernetes-1.13.1-green.svg)](https://github.com/kubernetes/kubernetes/tree/v1.13.1)

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

## Build

```sh
make dist
```

## License

MIT


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Ftommy351%2Fkubernetes-models-ts.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Ftommy351%2Fkubernetes-models-ts?ref=badge_large)