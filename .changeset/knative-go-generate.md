---
"@kubernetes-models/knative": major
---

Switch to go-generate. Types now sourced from upstream Go packages — knative.dev/serving v0.49.0, knative.dev/eventing v0.49.0, knative.dev/operator v0.49.1 (plus untagged knative.dev/networking and knative.dev/caching).

Field types are now easier to reference: instead of `IService['spec']`, use `IServiceSpec`.
