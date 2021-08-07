# @kubernetes-models/flux-cd

[Flux CD](https://fluxcd.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/flux-cd
```

## Usage

```js
import { GitRepository } from "@kubernetes-models/flux-cd/source.toolkit.fluxcd.io/v1beta1/GitRepository";

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
