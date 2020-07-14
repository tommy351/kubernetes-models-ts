# @kubernetes-models/gke

[Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/docs/concepts/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/gke
```

## Usage

### Google Cloud CDN/IAP/Cloud Armor Settings

via [BackendConfig](https://cloud.google.com/kubernetes-engine/docs/concepts/backendconfig)

```js
import { BackendConfig } from "@kubernetes-models/gke/cloud.google.com/v1beta1/BackendConfig";

const config = new BackendConfig({
  metadata: {
    name: "iap-example"
  },
  spec: {
    iap: {
      enabled: true,
      oauthclientCredentials: {
        secretName: "iap-oauth-secret"
      }
    }
  }
});

// Validate against JSON schema
config.validate();
```

### Config Connector

```js
import { SpannerInstance } from "@kubernetes-models/gke/spanner.cnrm.cloud.google.com/v1beta1/SpannerInstance";

const instance = new SpannerInstance({
  metadata: {
    name: "spanner-example"
  },
  spec: {
    config: "regional-us-west1",
    displayName: "Spanner Example",
    numNodes: 1
  }
});

instance.validate();
```

## License

MIT
