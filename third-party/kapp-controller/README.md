# @kubernetes-models/kapp-controller

[Carvel kapp contoller](https://github.com/vmware-tanzu/carvel-kapp-controller) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/kapp-controller
```

## Usage

```js
import { App } from "@kubernetes-models/kapp-controller/kappctrl.k14s.io/v1alpha1/App";

// Create a new Application
const app = new App({
  metadata: { name: "hello" },
  spec: {
    serviceAccountName: "default-ns-sa",
    fetch: [
      {
        git: {
          url: "https://github.com/vmware-tanzu/carvel-simple-app-on-kubernetes",
          ref: "origin/develop",
          subPath: "config-step-2-template"
        }
      }
    ],
    template: [{ ytt: {} }],
    deploy: [{ kapp: {} }]
  }
});

// Validate against JSON schema
app.validate();
```

## License

See [LICENSE](../../LICENSE)
