# @kubernetes-models/prometheus-operator

[Prometheus operator](https://github.com/prometheus-operator/prometheus-operator/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/prometheus-operator
```

## Usage

```js
import { ServiceMonitor } from "@kubernetes-models/prometheus-operator/monitoring.coreos.com/v1/ServiceMonitor";

const monitor = new ServiceMonitor({
  metadata: {
    name: "my-service-monitor"
  },
  spec: {
    selector: {
      matchLabels: {
        app: "some-app"
      }
    },
    endpoints: [
      {
        port: web
      }
    ]
  }
});

// Validate against JSON schema
monitor.validate();
```

## License

MIT
