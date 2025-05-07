# @kubernetes-models/opentelemetry-operator

OpenTelemetry Operator Models for Kubernetes

This package contains the following operators:

- [OpenTelemetry Operator](https://github.com/open-telemetry/opentelemetry-operator)

Feel free to submit an issue or a pull request if the operator you are using is not here.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/opentelemetry-operator
```

## Usage

### OpenTelemetry Operator

```js
import { OpenTelemetryCollector } from "@kubernetes-models/opentelemetry-operator/opentelemetry.io/v1beta1/OpenTelemetryCollector";
import { Instrumentation } from "@kubernetes-models/opentelemetry-operator/opentelemetry.io/v1alpha1/Instrumentation";

// Create a new OpenTelemetry Collector
const collector = new OpenTelemetryCollector({
  metadata: { name: "my-collector" },
  spec: {
    mode: "deployment",
    image:
      "ghcr.io/open-telemetry/opentelemetry-collector-releases/opentelemetry-collector-contrib:0.96.0",
    config: {
      receivers: {
        otlp: {
          protocols: {
            grpc: {},
            http: {}
          }
        }
      },
      exporters: {
        prometheus: {
          endpoint: "0.0.0.0:8889"
        }
      },
      service: {
        pipelines: {
          metrics: {
            receivers: ["otlp"],
            exporters: ["prometheus"]
          }
        }
      }
    }
  }
});

// Create an OpenTelemetry Instrumentation resource
const instrumentation = new Instrumentation({
  metadata: { name: "my-instrumentation" },
  spec: {
    exporter: {
      endpoint: "http://my-collector-collector:4318"
    },
    propagators: ["tracecontext", "baggage"],
    sampler: {
      type: "parentbased_traceidratio",
      argument: "0.25"
    },
    nodejs: {
      image: "auto"
    },
    java: {
      image: "auto"
    }
  }
});

// Validate against JSON schema
collector.validate();
instrumentation.validate();
```

## License

See [LICENSE](../../LICENSE)
