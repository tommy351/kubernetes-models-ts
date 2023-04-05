---
"@kubernetes-models/base": patch
"@kubernetes-models/validate": patch
"@kubernetes-models/crd-generate": patch
"@kubernetes-models/generate": patch
"@kubernetes-models/openapi-generate": patch
"@kubernetes-models/read-input": patch
"@kubernetes-models/string-util": patch
"@kubernetes-models/apimachinery": patch
"kubernetes-models": patch
"@kubernetes-models/argo-cd": patch
"@kubernetes-models/argo-rollouts": patch
"@kubernetes-models/autoscaler": patch
"@kubernetes-models/cert-manager": patch
"@kubernetes-models/cilium": patch
"@kubernetes-models/contour": patch
"@kubernetes-models/external-secrets": patch
"@kubernetes-models/flagger": patch
"@kubernetes-models/flux-cd": patch
"@kubernetes-models/gateway-api": patch
"@kubernetes-models/gke": patch
"@kubernetes-models/grafana-agent-operator": patch
"@kubernetes-models/grafana-operator": patch
"@kubernetes-models/istio": patch
"@kubernetes-models/jaeger-operator": patch
"@kubernetes-models/kapp-controller": patch
"@kubernetes-models/keda": patch
"@kubernetes-models/knative": patch
"@kubernetes-models/kubedb": patch
"@kubernetes-models/postgres-operator": patch
"@kubernetes-models/prometheus-operator": patch
"@kubernetes-models/rabbitmq-cluster-operator": patch
"@kubernetes-models/rabbitmq-messaging-topology-operator": patch
"@kubernetes-models/redis-operator": patch
"@kubernetes-models/sealed-secrets": patch
"@kubernetes-models/seldon-core-operator": patch
"@kubernetes-models/spiffe": patch
"@kubernetes-models/thanos-operator": patch
"@kubernetes-models/victoria-metrics-operator": patch
---

Simplify export map.

```js
// Before
{
  "exports": {
    "import": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.mjs"
    },
    "require": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  }
}

// After
{
  "exports": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.mjs",
    "require": "./dist/index.js"
  }
}
```
