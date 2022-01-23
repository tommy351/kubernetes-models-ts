# @kubernetes-models/autoscaler

[Kubernetes Autoscaler](https://github.com/kubernetes/autoscaler) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/autoscaler
```

## Usage

```js
import { VerticalPodAutoscaler } from "@kubernetes-models/autoscaler/autoscaling.k8s.io/v1/VerticalPodAutoscaler";

const vpa = new VerticalPodAutoscaler({
  spec: {
    targetRef: {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      name: 'my-app'
    },
    updatePolicy: {
      updateMode: 'Off'
    }
  }
});

// Validate against JSON schema
vpa.validate();
```

## License

MIT
