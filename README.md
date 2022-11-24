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

- [kubernetes-models](first-party/kubernetes-models) - Kubernetes models.
- [@kubernetes-models/apimachinery](first-party/apimachinery) - Types for Kubernetes API objects.

### 3rd-party Models

- [@kubernetes-models/argo-cd](third-party/argo-cd) - [Argo CD](https://argo-cd.readthedocs.io/) models.
- [@kubernetes-models/cert-manager](third-party/cert-manager) - [cert-manager](https://cert-manager.io/) models.
- [@kubernetes-models/cilium](third-party/cilium) - [Cilium](https://cilium.io/) CRD.
- [@kubernetes-models/contour](third-party/contour) - [Contour](https://projectcontour.io/) models.
- [@kubernetes-models/external-secrets](third-party/external-secrets) - [External secrets](https://external-secrets.io) models.
- [@kubernetes-models/flux-cd](third-party/flux-cd) - [Flux CD](https://fluxcd.io/) models.
- [@kubernetes-models/gateway-api](third-party/gateway-api) - [Gateway API](https://gateway-api.sigs.k8s.io/) models.
- [@kubernetes-models/gke](third-party/gke) - [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine) models.
- [@kubernetes-models/grafana-agent-operator](third-party/grafana-agent-operator) - [Grafana agent operator](https://grafana.com/docs/agent/latest/operator/) models.
- [@kubernetes-models/grafana-operator](third-party/grafana-operator) - [Grafana operator](https://github.com/grafana-operator/grafana-operator) models.
- [@kubernetes-models/istio](third-party/istio) - [Istio](https://istio.io/) models.
- [@kubernetes-models/jaeger-operator](third-party/jaeger-operator) - [Jaeger operator](https://www.jaegertracing.io/docs/latest/operator/) models.
- [@kubernetes-models/kapp-controller](third-party/kapp-controller) - [Carvel kapp contoller](https://github.com/vmware-tanzu/carvel-kapp-controller) models.
- [@kubernetes-models/knative](third-party/knative) - [Knative](https://knative.dev/) models.
- [@kubernetes-models/postgres-operator](third-party/postgres-operator) - PostgreSQL operator models.
- [@kubernetes-models/prometheus-operator](third-party/prometheus-operator) - [Prometheus operator](https://github.com/prometheus-operator/prometheus-operator/) models.
- [@kubernetes-models/rabbitmq-cluster-operator](third-party/rabbitmq-cluster-operator/) - [RabbitMQ cluster operator](https://github.com/rabbitmq/cluster-operator) models.
- [@kubernetes-models/rabbitmq-messaging-topology-operator](third-party/rabbitmq-messaging-topology-operator/) - [RabbitMQ Messaging Topology Operator](https://github.com/rabbitmq/messaging-topology-operator) models.
- [@kubernetes-models/sealed-secrets](third-party/sealed-secrets) - [sealed-secrets](https://github.com/bitnami-labs/sealed-secrets) models.
- [@kubernetes-models/spiffe](third-party/spiffe) - [SPIFFE](https://spiffe.io/) models.
- [@kubernetes-models/thanos-operator](third-party/thanos-operator) - [Thanos operator](https://github.com/banzaicloud/thanos-operator) models.
- [@kubernetes-models/victoria-metrics-operator](third-party/victoria-metrics-operator) - [VictoriaMetrics operator](https://github.com/VictoriaMetrics/operator) models.

### Generators

- [@kubernetes-models/crd-generate](utils/crd-generate) - Generate Kubernetes models for custom resource definitions (CRD).
- [@kubernetes-models/openapi-generate](utils/openapi-generate) - Generate Kubernetes models from OpenAPI schema.

### Runtime Dependencies

- [@kubernetes-models/base](core/base) - Base model for Kubernetes models.
- [@kubernetes-models/validate](core/validate) - Validation library for Kubernetes models.

### Utilities

- [@kubernetes-models/base](core/base) - Base model for Kubernetes models.
- [@kubernetes-models/export-map](utils/export-map) - Generate and inject export map.
- [@kubernetes-models/generate](utils/generate) - Type declarations and utilities for Kubernetes model generation.
- [@kubernetes-models/read-input](utils/read-input) - Read input from file, URL or stdin.
- [@kubernetes-models/string-util](utils/string-util) - Utility functions for strings.

## License

MIT
