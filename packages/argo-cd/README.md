# @kubernetes-models/argo-cd

[Argo CD](https://argo-cd.readthedocs.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/argo-cd
```

## Usage

```js
import { Application } from "@kubernetes-models/argo-cd/argoproj.io/v1alpha1/Application";

// Create a new Application
const vpa = new Application({
  metadata: {
    name: "guestbook"
  },
  spec: {
    project: "default",
    source: {
      repoURL: "https://github.com/argoproj/argocd-example-apps.git",
      targetRevision: "HEAD",
      path: "guestbook"
    },
    destination: {
      server: "https://kubernetes.default.svc",
      namespace: "guestbook"
    }
  }
});

// Validate against JSON schema
vpa.validate();
```

## License

MIT
