---
"@kubernetes-models/autoscaler": major
---

Switch to go-generate. Types now sourced from upstream Go packages — vertical-pod-autoscaler v1.6.0. Field types are now easier to reference: instead of `IVerticalPodAutoscaler['spec']`, use `IVerticalPodAutoscalerSpec`.
