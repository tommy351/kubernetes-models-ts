# @kubernetes-models/tekton-pipelines

[Tekton Pipelines](https://tekton.dev/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/tekton-pipelines
```

## Usage

```js
import { Pipeline } from "@kubernetes-models/tekton-pipelines/tekton.dev/v1/Pipeline";

// Create a new Pipeline
const pipeline = new Pipeline({
  metadata: {
    name: "example-pipeline",
    namespace: "default"
  },
  spec: {
    tasks: [
      {
        name: "hello",
        taskRef: {
          name: "hello-task"
        }
      }
    ]
  }
});

// Validate against JSON schema
pipeline.validate();
```

## License

MIT
