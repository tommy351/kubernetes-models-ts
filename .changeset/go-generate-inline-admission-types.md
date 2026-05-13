---
"@kubernetes-models/go-generate": patch
---

Extend `inlineIncludeStructs` with five more upstream types that have no standalone TS module on the consumer side: `metav1.GroupVersionKind`, `metav1.GroupVersionResource`, `admission/v1.AdmissionRequest` (webhook payload, never in the API server's OpenAPI spec), and `admissionregistration/v1alpha1.{ApplyConfiguration,JSONPatch}` (alpha group not republished by `kubernetes-models`). Without these, Kyverno's `AdmissionRequestInfoObject` and `MutatingPolicySpec` emitted imports against module paths that don't resolve.
