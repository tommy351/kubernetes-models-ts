# @kubernetes-models/strimzi-kafka-operator

[Strimzi Kafka Operator](https://strimzi.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/strimzi-kafka-operator
```

## Usage

```js
import { Kafka } from "@kubernetes-models/strimzi-kafka-operator/kafka.strimzi.io/v1/Kafka";

// Create a new Kafka
const kafka = new Kafka({
  metadata: {
    name: "my-cluster",
    annotations: {
      "strimzi.io/node-pools": "enabled",
      "strimzi.io/kraft": "enabled"
    }
  },
  spec: {
    kafka: {
      version: "4.1.1",
      metadataVersion: "4.1.1",
      listeners: [
        { name: "plain", port: 9092, type: "internal", tls: false },
        { name: "tls", port: 9093, type: "internal", tls: true }
      ],
      config: {
        "offsets.topic.replication.factor": 1,
        "transaction.state.log.replication.factor": 1,
        "transaction.state.log.min.isr": 1,
        "default.replication.factor": 1,
        "min.insync.replicas": 1
      }
    }
  }
});

// Validate against JSON schema
kafka.validate();
```

## License

MIT