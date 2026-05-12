---
"@kubernetes-models/prometheus-operator": major
---

Switch to go-generate. Types now sourced from upstream Go packages — prometheus-operator v0.91.0.

Field types are now easier to reference: instead of `IPrometheus['spec']`, use `IPrometheusSpec`.
