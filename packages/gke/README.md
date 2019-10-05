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

const route = new BackendConfig({
  metadata: {
    name: "iap-example"
  },
  spec: {
    iap: {
      enabled: true,
      oauthclientCredentials: {
          secretName: 'iap-oauth-secret'
      }
    }
  }
});

// Validate against JSON schema
route.validate();
```

## License

MIT
