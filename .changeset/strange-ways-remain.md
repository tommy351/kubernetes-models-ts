---
"@kubernetes-models/publish-scripts": minor
"kubernetes-models": minor
"@kubernetes-models/argo-cd": minor
"@kubernetes-models/argo-rollouts": minor
"@kubernetes-models/autoscaler": minor
"@kubernetes-models/cert-manager": minor
"@kubernetes-models/cilium": minor
"@kubernetes-models/contour": minor
"@kubernetes-models/external-secrets": minor
"@kubernetes-models/flagger": minor
"@kubernetes-models/flux-cd": minor
"@kubernetes-models/gateway-api": minor
"@kubernetes-models/gke": minor
"@kubernetes-models/grafana-agent-operator": minor
"@kubernetes-models/grafana-operator": minor
"@kubernetes-models/istio": minor
"@kubernetes-models/jaeger-operator": minor
"@kubernetes-models/kapp-controller": minor
"@kubernetes-models/keda": minor
"@kubernetes-models/knative": minor
"@kubernetes-models/kubedb": minor
"@kubernetes-models/postgres-operator": minor
"@kubernetes-models/prometheus-operator": minor
"@kubernetes-models/rabbitmq-cluster-operator": minor
"@kubernetes-models/rabbitmq-messaging-topology-operator": minor
"@kubernetes-models/redis-operator": minor
"@kubernetes-models/sealed-secrets": minor
"@kubernetes-models/seldon-core-operator": minor
"@kubernetes-models/spiffe": minor
"@kubernetes-models/thanos-operator": minor
"@kubernetes-models/victoria-metrics-operator": minor
---

Decrease the size of export map in `package.json` by using wildcard pattern (`*`).

```js
// Before
{
  "exports": {
    "./v1/Pod": {
      "import": "./v1/Pod.mjs",
      "require": "./v1/Pod.js"
    },
    "./v1/Service": {
      "import": "./v1/Service.mjs",
      "require": "./v1/Service.js"
    }
  }
}

// After
{
  "exports": {
    "./v1/*": {
      "import": "./v1/*.mjs",
      "require": "./v1/*.js"
    }
  }
}
```
