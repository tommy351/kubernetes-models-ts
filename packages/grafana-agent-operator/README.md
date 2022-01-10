# @kubernetes-models/grafana-agent-operator

[Grafana agent operator](https://grafana.com/docs/agent/latest/operator/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/grafana-agent-operator
```

## Usage

```js
import { GrafanaAgent } from "@kubernetes-models/grafana-agent-operator/monitoring.grafana.com/v1alpha1/GrafanaAgent";

// Create a new GrafanaAgent
const agent = new GrafanaAgent({
  metadata: { name: "grafana-agent" },
  spec: {
    image: "grafana/agent:v0.21.2",
    logLevel: "info",
    metrics: {
      instanceSelector: {
        matchLabels: {
          agent: "grafana-agent-metrics"
        }
      }
    }
  }
});

// Validate against JSON schema
agent.validate();
```

## License

See [LICENSE](../../LICENSE)
