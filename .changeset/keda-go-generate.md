---
"@kubernetes-models/keda": major
---

Switch to go-generate. Types now sourced from upstream Go module github.com/kedacore/keda v2.19.0.

Field types are now easier to reference: instead of `IScaledObject['spec']`, use `IScaledObjectSpec`.
