# @kubernetes-models/jaeger-operator

[Jaeger operator](https://www.jaegertracing.io/docs/latest/operator/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/jaeger-operator
```

## Usage

```js
import { Jaeger } from "@kubernetes-models/jaeger-operator/jaegertracing.io/v1/Jaeger";

// Create a new Jaeger
const jaeger = new Jaeger({
  metadata: { name: "hello" },
  spec: {
    strategy: "production",
    collector: {
      maxReplicas: 5,
      resources: {
        limits: {
          cpu: "100m",
          memory: "128Mi"
        }
      }
    },
    storage: {
      type: "elasticsearch",
      options: {
        es: {
          "server-urls": "http://elasticsearch:9200"
        }
      }
    }
  }
});

// Validate against JSON schema
jaeger.validate();
```

## License

See [LICENSE](../../LICENSE)
