# @kubernetes-models/flink

[Flink Kubernetes Operator](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-main/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/flink
```

## Usage

```js
import { GitRepository } from "@kubernetes-models/flink/source.toolkit.fluxcd.io/v1beta1/GitRepository";

// Create a new GitRepository
const repo = new GitRepository({
  metadata: {
    name: "webapp"
  },
  spec: {
    interval: "60m",
    url: "https://github.com/tommy351/kubernetes-models-ts",
    ref: {
      branch: "master"
    }
  }
});

// Validate against JSON schema
repo.validate();
```

## License

MIT
