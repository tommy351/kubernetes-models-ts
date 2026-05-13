---
"@kubernetes-models/kubedb": major
---

Migrate from crd-generate to go-generate. The `corev1.VolumeSource` external-import blocker (`MemcachedSpec`, `ScriptSourceSpec` etc.) is resolved by the inline-include-structs allowlist added in earlier `@kubernetes-models/go-generate` commits.
