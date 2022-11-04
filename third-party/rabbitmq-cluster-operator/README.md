# @kubernetes-models/rabbitmq-cluster-operator

[RabbitMQ Cluster Operator](https://github.com/rabbitmq/cluster-operator) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/rabbitmq-cluster-operator
```

## Usage

```js
import { RabbitmqCluster } from "@kubernetes-models/rabbitmq-cluster-operator/rabbitmq.com/v1beta1/RabbitmqCluster";

// Create a new RabbitmqCluster
const cluster = new RabbitmqCluster({
	metadata: { name: "example" },
	spec: {
		replicas: 3,
		service: {
			type: "LoadBalancer"
		}
	}
});

// Validate against JSON schema
cluster.validate();
```

## License

See [LICENSE](../../LICENSE)
