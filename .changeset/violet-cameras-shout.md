---
"kubernetes-models": minor
"@kubernetes-models/argo-cd": minor
"@kubernetes-models/autoscaler": minor
"@kubernetes-models/cert-manager": minor
"@kubernetes-models/crd-generate": minor
"@kubernetes-models/cilium": minor
"@kubernetes-models/contour": minor
"@kubernetes-models/flux-cd": minor
"@kubernetes-models/gke": minor
"@kubernetes-models/grafana-agent-operator": minor
"@kubernetes-models/grafana-operator": minor
"@kubernetes-models/istio": minor
"@kubernetes-models/jaeger-operator": minor
"@kubernetes-models/kapp-controller": minor
"@kubernetes-models/knative": minor
"@kubernetes-models/prometheus-operator": minor
"@kubernetes-models/sealed-secrets": minor
"@kubernetes-models/thanos-operator": minor
"@kubernetes-models/victoria-metrics-operator": minor
---

All models with `apiVersion` and `kind` properties now come with a new static method `is`, which returns `true` when the input value contains the same `apiVersion` and `kind` with the model.

This function implements TypeScript type guard, which is very useful for narrowing down types.

Please noted that this function only checks `apiVersion` and `kind`, other properties may still be invalid.

Below is an example of the type guard function.

```ts
import { Pod } from "kubernetes-models/v1/Pod";

if (Pod.is(value)) {
  // value is a Pod.
}
```
