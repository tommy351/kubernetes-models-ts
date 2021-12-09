# kubernetes-models-ts

[![](https://img.shields.io/npm/v/kubernetes-models.svg)](https://www.npmjs.com/package/kubernetes-models) ![Test](https://github.com/tommy351/kubernetes-models-ts/workflows/Test/badge.svg)

Kubernetes models in TypeScript.

## Installation

Install with npm.

```sh
npm install kubernetes-models
```

## Usage

```js
import { Pod } from "kubernetes-models/v1";

// Create a new instance
const pod = new Pod({
  metadata: {
    name: "foo"
  },
  spec: {
    containers: []
  }
});

// Validate against JSON schema
pod.validate();
```

See [examples](examples) folder for more examples.

## Packages

### Models

- [kubernetes-models](packages/kubernetes-models) - Kubernetes models.

### 3rd-party Models

- [@kubernetes-models/argo-cd](packages/argo-cd) - [Argo CD](https://argo-cd.readthedocs.io/) models.
- [@kubernetes-models/cert-manager](packages/cert-manager) - [cert-manager](https://cert-manager.io/) models.
- [@kubernetes-models/cilium](packages/cilium) - [Cilium](https://cilium.io/) CRD.
- [@kubernetes-models/contour](packages/contour) - [Contour](https://projectcontour.io/) models.
- [@kubernetes-models/flux-cd](packages/flux-cd) - [Flux CD](https://fluxcd.io/) models.
- [@kubernetes-models/gke](packages/gke) - [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine) models.
- [@kubernetes-models/grafana-operator](packages/grafana-operator) - [Grafana operator](https://github.com/grafana-operator/grafana-operator) models.
- [@kubernetes-models/istio](packages/istio) - [Istio](https://istio.io/) models.
- [@kubernetes-models/jaeger-operator](packages/jaeger-operator) - [Jaeger operator](https://www.jaegertracing.io/docs/latest/operator/) models.
- [@kubernetes-models/kapp-controller](packages/kapp-controller) - [Carvel kapp contoller](https://github.com/vmware-tanzu/carvel-kapp-controller) models.
- [@kubernetes-models/knative](packages/knative) - [Knative](https://knative.dev/) models.
- [@kubernetes-models/prometheus-operator](packages/prometheus-operator) - [Prometheus operator](https://github.com/prometheus-operator/prometheus-operator/) models.
- [@kubernetes-models/sealed-secrets](packages/sealed-secrets) - [sealed-secrets](https://github.com/bitnami-labs/sealed-secrets) models.

### Generators

- [@kubernetes-models/crd-generate](packages/crd-generate) - Generate Kubernetes models for custom resource definitions (CRD).
- [@kubernetes-models/openapi-generate](packages/openapi-generate) - Generate Kubernetes models from OpenAPI schema.

### Utilities

- [@kubernetes-models/base](packages/base) - Base model for Kubernetes models.
- [@kubernetes-models/export-map](packages/export-map) - Generate and inject export map.
- [@kubernetes-models/generate](packages/generate) - Type declarations and utilities for Kubernetes model generation.
- [@kubernetes-models/read-input](packages/read-input) - Read input from file, URL or stdin.
- [@kubernetes-models/string-util](packages/string-util) - Utility functions for strings.
- [@kubernetes-models/validate](packages/validate) - Validation library for Kubernetes models.

## License

MIT
