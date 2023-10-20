# @kubernetes-models/shipwright

[Shipwright](https://shipwright.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/shipwright
```

## Usage

Models contains the v1alpha1 version for the Shipwright Operator up to version 0.11 and the v1beta1 version that is part of the Shipwright Operator version 0.12+.

```js
import { Build } from "@kubernetes-models/shipwright/shipwright.io/v1beta1/Build";
import { BuildRun } from "@kubernetes-models/shipwright/shipwright.io/v1beta1/BuildRun";

// Create a new Build
const build = new Build({
  metadata: {
    name: "buildah-golang-build",
  },
  spec: {
    strategy: {
      kind: 'ClusterBuildStrategy',
      name: 'buildah',
    },
    source: {
      git: {
        url: 'https://github.com/shipwright-io/sample-go',
      },
      contextDir: 'docker-build',
    },
    output: {
      image: 'registry/namespace/image:latest',
    },
  },
});

// Validate against JSON schema
build.validate();

// Create a BuildRun that links that Build
const buildRun = new Build({
  metadata: {
    generateName: "buildah-golang-build-",
  },
  spec: {
    build: {
      name: 'buildah-golang-build',
    },
  },
});

// Validate against JSON schema
buildRun.validate();
```

## License

MIT
