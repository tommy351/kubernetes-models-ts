# @kubernetes-models/redis-operator

[Redis Operator](https://ot-container-kit.github.io/redis-operator/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/redis-operator
```

## Usage

```js
import { RedisCluster } from "@kubernetes-models/redis-operator/redis.redis.opstreelabs.in/v1beta1/RedisCluster";

const cluster = new RedisCluster({
  metadata: { name: "example" },
  spec: {
    clusterSize: 3,
    clusterVersion: "v7",
    persistenceEnabled: true,
    kubernetesConfig: {
      image: "quay.io/opstree/redis:v7.0.5"
    }
  }
});

// Validate against JSON schema
cluster.validate();
```

## License

MIT
