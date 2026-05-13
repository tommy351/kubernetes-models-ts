---
"@kubernetes-models/go-generate": minor
---

Inline upstream struct types (`metav1.GroupKind`, `metav1.Timestamp`, `corev1.VolumeSource`, `admissionregistration/v1alpha1.Mutation`) whose JSON shape has no standalone TS module on the consumer side. Without this, `tsc --emitDeclarationOnly` fails with TS2307 when a third-party package references one of these types.
