---
"@kubernetes-models/autoscaler": major
---

Switch to go-generate. Types now sourced from upstream Go packages — vertical-pod-autoscaler v1.6.0.

Field types are now easier to reference: instead of `IVerticalPodAutoscaler['spec']`, use `IVerticalPodAutoscalerSpec`.

Breaking: `autoscaling.k8s.io/v1beta1` models are no longer emitted. Upstream VPA disabled that API version in 0.5.0 and marks the pinned Go package with `+kubebuilder:skip`, so go-generate now emits only `v1` and `v1beta2`.
