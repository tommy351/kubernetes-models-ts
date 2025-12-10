# @kubernetes-models/gcp

[Google Cloud Platform](https://cloud.google.com/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/gcp
```

## Usage

### Google Cloud Monitoring

via [PodMonitoring](https://cloud.google.com/stackdriver/docs/managed-prometheus/setup-managed#gmp-pod-monitoring)

```js
import { PodMonitoring } from "@kubernetes-models/gcp/monitoring.googleapis.com/v1";

const podMonitoring = new PodMonitoring({
  metadata: {
    name: "prom-example"
  },
  spec: {
    selector: {
      matchLabels: {
        "app.kubernetes.io/name": "prom-example"
      }
    },
    endpoints: [{ port: "metrics", interval: "30s" }]
  }
});

// Validate against JSON schema
podMonitoring.validate();
```

## License

MIT
