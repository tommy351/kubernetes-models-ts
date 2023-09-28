# @kubernetes-models/shipwright

[Shipwright](https://shipwright.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/shipwright
```

## Usage

```js
import { Build } from "@kubernetes-models/shipwright/shipwright.io/v1alpha1/Build";
import { BuildRun } from "@kubernetes-models/shipwright/shipwright.io/v1alpha1/BuildRun";

// Create a new Build
const build = new Build({
  metadata: {
    name: "buildah-golang-build"
  },
  spec: {
    strategy: {
      kind: 'ClusterBuildStrategy',
      name: 'buildah',
    },
    source: {
      url: 'https://github.com/shipwright-io/sample-go',
      contextDir: 'docker-build'
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
    generateName: "buildah-golang-build-"
  },
  spec: {
    buildRef = {
      name: 'buildah-golang-build',
    }
  },
});

// Validate against JSON schema
buildRun.validate();
```

## License

MIT
