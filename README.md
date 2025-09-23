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
- [@kubernetes-models/argo-rollouts](third-party/argo-rollouts) - [Argo Rollouts](https://argoproj.github.io/argo-rollouts/) models.
- [@kubernetes-models/argo-workflows](third-party/argo-workflows) - [Argo Workflows](https://argoproj.github.io/argo-workflows/) models.
- [@kubernetes-models/autoscaler](third-party/autoscaler) - [Kubernetes Autoscaler](https://github.com/kubernetes/autoscaler) models.
- [@kubernetes-models/cert-manager](third-party/cert-manager) - [cert-manager](https://cert-manager.io/) models.
- [@kubernetes-models/cilium](third-party/cilium) - [Cilium](https://cilium.io/) CRD.
- [@kubernetes-models/clickhouse](third-party/clickhouse) - [ClickHouse Kubernetes Operator](https://github.com/Altinity/clickhouse-operator) models.
- [@kubernetes-models/contour](third-party/contour) - [Contour](https://projectcontour.io/) models.
- [@kubernetes-models/elastic-cloud](third-party/elastic-cloud) - [Elastic Cloud on Kubernetes (ECK)](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-overview.html) models.
- [@kubernetes-models/envoy-gateway](third-party/envoy-gateway) - [Envoy Gateway](https://gateway.envoyproxy.io/) models.
- [@kubernetes-models/external-secrets](third-party/external-secrets) - [External secrets](https://external-secrets.io) models.
- [@kubernetes-models/fission](third-party/fission) - [Fission](https://fission.io) models.
- [@kubernetes-models/flagger](third-party/flagger) - [Flagger](https://flagger.app/) models.
- [@kubernetes-models/flink](third-party/flink) - [Flink Kubernetes Operator](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-main/) models.
- [@kubernetes-models/flux-cd](third-party/flux-cd) - [Flux CD](https://fluxcd.io/) models.
- [@kubernetes-models/gateway-api](third-party/gateway-api) - [Gateway API](https://gateway-api.sigs.k8s.io/) models.
- [@kubernetes-models/gke](third-party/gke) - [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine) models.
- [@kubernetes-models/grafana-agent-operator](third-party/grafana-agent-operator) - [Grafana agent operator](https://grafana.com/docs/agent/latest/operator/) models.
- [@kubernetes-models/grafana-operator](third-party/grafana-operator) - [Grafana operator](https://github.com/grafana-operator/grafana-operator) models.
- [@kubernetes-models/hierarchical-namespaces](third-party/hierarchical-namespaces) - [Hierarchical Namespace](https://github.com/kubernetes-sigs/hierarchical-namespaces) models.
- [@kubernetes-models/istio](third-party/istio) - [Istio](https://istio.io/) models.
- [@kubernetes-models/jaeger-operator](third-party/jaeger-operator) - [Jaeger operator](https://www.jaegertracing.io/docs/latest/operator/) models.
- [@kubernetes-models/k8ssandra-operator](third-party/k8ssandra-operator) - [K8ssandra](https://k8ssandra.io/) models.
- [@kubernetes-models/kapp-controller](third-party/kapp-controller) - [Carvel kapp contoller](https://github.com/vmware-tanzu/carvel-kapp-controller) models.
- [@kubernetes-models/karpenter](third-party/karpenter) - [Karpenter](https://karpenter.sh/) models.
- [@kubernetes-models/keda](third-party/keda) - [KEDA](https://github.com/kedacore/keda) models.
- [@kubernetes-models/knative](third-party/knative) - [Knative](https://knative.dev/) models.
- [@kubernetes-models/kubedb](third-party/kubedb) - [KubeDB](https://kubedb.com/) models.
- [@kubernetes-models/kyverno](third-party/kyverno) - [Kyverno](https://kyverno.io/) models.
- [@kubernetes-models/linkerd](third-party/linkerd) - [Linkerd](https://linkerd.io/) models.
- [@kubernetes-models/nats](third-party/nats) - NATS models.
- [@kubernetes-models/opentelemetry-operator](third-party/opentelemetry-operator) - [OpenTelemetry Operator](https://github.com/open-telemetry/opentelemetry-operator) models.
- [@kubernetes-models/pipelines-as-code](third-party/pipelines-as-code) - [Pipelines-as-Code](https://pipelinesascode.com/) models.
- [@kubernetes-models/postgres-operator](third-party/postgres-operator) - PostgreSQL operator models.
- [@kubernetes-models/prometheus-operator](third-party/prometheus-operator) - [Prometheus operator](https://github.com/prometheus-operator/prometheus-operator/) models.
- [@kubernetes-models/pulsar-resources-operator](third-party/pulsar-resources-operator) - [Pulsar resources operator](https://github.com/streamnative/pulsar-resources-operator) models.
- [@kubernetes-models/rabbitmq-cluster-operator](third-party/rabbitmq-cluster-operator/) - [RabbitMQ cluster operator](https://github.com/rabbitmq/cluster-operator) models.
- [@kubernetes-models/rabbitmq-messaging-topology-operator](third-party/rabbitmq-messaging-topology-operator/) - [RabbitMQ Messaging Topology Operator](https://github.com/rabbitmq/messaging-topology-operator) models.
- [@kubernetes-models/redis-operator](third-party/redis-operator) - [Redis Operator](https://ot-container-kit.github.io/redis-operator/) models.
- [@kubernetes-models/sealed-secrets](third-party/sealed-secrets) - [sealed-secrets](https://github.com/bitnami-labs/sealed-secrets) models.
- [@kubernetes-models/seldon-core-operator](third-party/seldon-core-operator) - [SeldonCore operator](https://github.com/SeldonIO/seldon-core/tree/v1.15.0/helm-charts/seldon-core-operator) models.
- [@kubernetes-models/shipwright](third-party/shipwright) - [Shipwright](https://shipwright.io/) CRD.
- [@kubernetes-models/smi](third-party/smi) - [Service Mesh Interface (SMI)](https://smi-spec.io/) models.
- [@kubernetes-models/spicedb](third-party/spicedb) - [SpiceDB](https://authzed.com/docs) models.
- [@kubernetes-models/spiffe](third-party/spiffe) - [SPIFFE](https://spiffe.io/) models.
- [@kubernetes-models/strimzi-kafka-operator](third-party/strimzi-kafka-operator) - [Strimzi Kafka Operator](https://strimzi.io/) models.
- [@kubernetes-models/thanos-operator](third-party/thanos-operator) - [Thanos operator](https://github.com/banzaicloud/thanos-operator) models.
- [@kubernetes-models/tidb-operator](third-party/tidb-operator) - [TiDB Operator](https://github.com/pingcap/tidb-operator) models.
- [@kubernetes-models/traefik](third-party/traefik) - [Traefik Operator](https://github.com/traefik/traefik-helm-chart/tree/master/traefik/crds) models.
- [@kubernetes-models/victoria-metrics-operator](third-party/victoria-metrics-operator) - [VictoriaMetrics operator](https://github.com/VictoriaMetrics/operator) models.

### Generators

- [@kubernetes-models/crd-generate](utils/crd-generate) - Generate Kubernetes models for custom resource definitions (CRD).
- [@kubernetes-models/openapi-generate](utils/openapi-generate) - Generate Kubernetes models from OpenAPI schema.

### Runtime Dependencies

- [@kubernetes-models/base](core/base) - Base model for Kubernetes models.
- [@kubernetes-models/validate](core/validate) - Validation library for Kubernetes models.

### Utilities

- [@kubernetes-models/generate](utils/generate) - Type declarations and utilities for Kubernetes model generation.
- [@kubernetes-models/read-input](utils/read-input) - Read input from file, URL or stdin.
- [@kubernetes-models/string-util](utils/string-util) - Utility functions for strings.

## License

MIT
