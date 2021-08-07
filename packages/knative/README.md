# @kubernetes-models/knative

[Knative](https://knative.dev/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/knative
```

## Usage

```js
import { Service } from "@kubernetes-models/knative/serving.knative.dev/v1/Service";

// Create a service
const service = new Service({
  metadata: { name: "hello" },
  spec: {
    template: {
      metadata: { name: "hello-world" },
      spec: {
        containers: [
          {
            image: "gcr.io/knative-samples/helloworld-go",
            ports: [{ containerPort: 8080 }]
          }
        ]
      }
    }
  }
});

// Validate against JSON schema
service.validate();
```

## License

MIT
