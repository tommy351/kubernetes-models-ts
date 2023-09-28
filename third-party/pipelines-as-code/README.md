# @kubernetes-models/pipelines-as-code

[Pipelines-as-Code](https://pipelinesascode.com/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/pipelines-as-code
```

## Usage

```js
import { Repository } from "@kubernetes-models/pipelines-as-code/pipelinesascode.tekton.dev/v1alpha1/Repository";

// Create a new Application
const repository = new Repository({
  metadata: {
    name: "pac-repo"
  },
  spec: {
    url: "https://github.com/linda/project",
    git_provider: {
      secret: {
        name: 'my-secret',
        key: 'repo-secret',
      },
      webhook_secret: {
        name: 'my-secret',
        key: 'webhook-secret',
      },
    },
  },
});

// Validate against JSON schema
app.validate();
```

## License

MIT
