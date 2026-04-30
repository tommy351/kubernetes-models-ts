# @kubernetes-models/milvus-operator

[Milvus Operator](https://github.com/zilliztech/milvus-operator) models — typed `Milvus`, `MilvusCluster`, and `MilvusUpgrade` custom resources for the Milvus vector database.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/milvus-operator
```

## Usage

```js
import { Milvus } from "@kubernetes-models/milvus-operator/milvus.io/v1beta1/Milvus";

// Create a new Milvus cluster CR
const milvus = new Milvus({
  metadata: {
    name: "milvus",
    namespace: "default"
  },
  spec: {
    mode: "cluster",
    components: {
      image: "milvusdb/milvus:v2.6.15",
      queryNode: { replicas: 2 },
      dataNode: { replicas: 1 },
      proxy: { replicas: 2 }
    },
    dependencies: {
      msgStreamType: "woodpecker"
    }
  }
});

// Validate against JSON schema
milvus.validate();
```

## License

MIT
