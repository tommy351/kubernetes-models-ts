# @kubernetes-models/nats

NATS models.

This package contains the following operators:

- [NATS Controllers for Kubernetes (NACK)](https://github.com/nats-io/nack)

Feel free to submit an issue or a pull request if the operator you are using is not here.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/nats
```

## Usage

### NATS Controllers for Kubernetes (NACK)

```js
import { Stream } from "@kubernetes-models/nats/jetstream.nats.io/v1beta2/Stream";
import { Consumer } from "@kubernetes-models/nats/jetstream.nats.io/v1beta2/Consumer";

// Create a new NATS JetStream stream
const myStream = new Stream({
  metadata: { name: "mystream" },
  spec: {
    name: "mystream",
    subjects: ["orders.*"],
    storage: "memory",
    maxAge: "1h"
  }
});

// Create a new NATS JetStream consumer
const myPushConsumer = new Consumer({
  metadata: { name: "my-push-consumer" },
  spec: {
    streamName: "mystream",
    durableName: "my-push-consumer",
    deliverSubject: "my-push-consumer.orders",
    deliverPolicy: "last",
    ackPolicy: "none",
    replayPolicy: "instant"
  }
});

// Create a new NATS JetStream consumer
const myPullConsumer = new Consumer({
  metadata: { name: "my-pull-consumer" },
  spec: {
    streamName: "mystream",
    durableName: "my-pull-consumer",
    deliverPolicy: "all",
    filterSubject: "orders.received",
    maxDeliver: 20,
    ackPolicy: "explicit"
  }
});

// Validate against JSON schema
myStream.validate();
myPushConsumer.validate();
myPullConsumer.validate();
```

## License

See [LICENSE](../../LICENSE)
