# @kubernetes-models/elastic-cloud

[Elastic Cloud on Kubernetes (ECK)](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-overview.html) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/elastic-cloud
```

```js
import { Elasticsearch } from '@kubernetes-models/elastic-cloud/elasticsearch.k8s.elastic.co/v1';

const elasticsearch = new Elasticsearch({
  metadata: {
    name: "example"
  },
  spec: {
    version: "8.9.2",
    nodeSets: [
      {
        name: "example"
      }
    ]
  },
});

// Validate against JSON schema
elasticsearch.validate();
```

## License

MIT
