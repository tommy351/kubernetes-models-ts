# @kubernetes-models/flink

[Flink Kubernetes Operator](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-main/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/flink
```

## Usage

```js
import { FlinkDeployment } from "@kubernetes-models/flink/flink.apache.org/v1beta1/FlinkDeployment";

// Create a new deployment
const deployment = new FlinkDeployment({
  metadata: {
    name: "example"
  },
  spec: {
    image: "flink:1.20",
    flinkVersion: "v1_20",
    flinkConfiguration: {
      "taskmanager.numberOfTaskSlots": "2"
    },
    serviceAccount: "flink",
    jobManager: {
      resource: {
        memory: "1024m",
        cpu: 1
      }
    },
    taskManager: {
      resource: {
        memory: "2048m",
        cpu: 1
      }
    },
    job: {
      jarURI: "local:///opt/flink/examples/streaming/StateMachineExample.jar",
      parallelism: 2,
      upgradeMode: "stateless",
      state: "running"
    }
  }
});

// Validate against JSON schema
deployment.validate();
```

## License

MIT
