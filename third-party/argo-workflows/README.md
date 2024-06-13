# @kubernetes-models/argo-rollouts

[Argo Rollouts](https://argoproj.github.io/argo-rollouts/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/argo-rollouts
```

## Usage

```js
import { Rollout } from "@kubernetes-models/argo-rollouts/argoproj.io/v1alpha1/Rollout";

// Create a new Rollout
const rollout = new Rollout({
  metadata: {
    name: "rollouts-demo"
  },
  spec: {
    replicas: 5,
    strategy: {
      canary: {
        steps: [
          { setWeight: 20 },
          { pause: {} },
          { setWeight: 40 },
          { pause: { duration: 10 } }
        ]
      }
    },
    revisionHistoryLimit: 2,
    selector: {
      matchLabels: {
        app: "rollouts-demo"
      }
    },
    template: {
      metadata: {
        labels: {
          app: "rollouts-demo"
        }
      },
      spec: {
        containers: [
          {
            name: "rollouts-demo",
            image: "argoproj/rollouts-demo:blue"
          }
        ]
      }
    }
  }
});

// Validate against JSON schema
rollout.validate();
```

## License

MIT
