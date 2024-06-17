# @kubernetes-models/argo-workflows

[Argo Workflows](https://argoproj.github.io/argo-workflows/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/argo-workflows
```

## Usage

```js
import { Rollout } from "@kubernetes-models/argo-workflows/argoproj.io/v1alpha1/Workflow";

// Create a new Rollout
const workflow = new Workflow({
  metadata: {
    name: "workflows-demo"
  },
  spec: {
    entrypoint: "hello",
    templates: [
      {
        name: "hello",
        container: {
          image: "alpine:latest",
          command: ["echo", "Hello, Argo!"]
        }
      }
    ]
  }
});

// Validate against JSON schema
workflow.validate();
```

## License

MIT
